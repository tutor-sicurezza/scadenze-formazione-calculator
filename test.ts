// Test base — esegui con: npx tsx test.ts
import { calcolaScadenza, PERIODICITA, elencoPeriodicita } from './src/index.js';

let passed = 0;
let failed = 0;

function assert(name: string, cond: boolean, extra?: unknown) {
  if (cond) {
    passed++;
    console.log(`  OK  ${name}`);
  } else {
    failed++;
    console.error(`  FAIL ${name}`, extra ?? '');
  }
}

// 1. PERIODICITA contiene tutte le voci attese.
assert('PERIODICITA ha 15 voci', Object.keys(PERIODICITA).length === 15);

// 2. Lavoratore basso: aggiornamento ogni 5 anni (60 mesi).
const r1 = calcolaScadenza('lavoratori-basso', new Date('2020-01-15'));
assert(
  'lavoratori-basso scade 2025-01-15',
  r1.scadenza.toISOString().startsWith('2025-01-15'),
  r1.scadenza.toISOString(),
);

// 3. Stato "scaduto" se passato.
assert(
  'lavoratori-basso scaduto al 2026-06-20',
  r1.statoIl(new Date('2026-06-20')) === 'scaduto',
);

// 4. Stato "in-regola" se ancora lontano.
const r2 = calcolaScadenza('lavoratori-basso', new Date('2026-01-15'));
assert(
  'lavoratori-basso in regola al 2026-06-20',
  r2.statoIl(new Date('2026-06-20')) === 'in-regola',
);

// 5. Preposto: aggiornamento annuale (12 mesi).
const r3 = calcolaScadenza('preposto', new Date('2025-06-01'));
assert(
  'preposto scade 2026-06-01',
  r3.scadenza.toISOString().startsWith('2026-06-01'),
);
assert(
  'preposto in-scadenza al 2026-05-15',
  r3.statoIl(new Date('2026-05-15')) === 'in-scadenza',
);

// 6. Corso non valido.
try {
  // @ts-expect-error volutamente invalido
  calcolaScadenza('inesistente', new Date());
  assert('lancia su corso invalido', false);
} catch {
  assert('lancia su corso invalido', true);
}

// 7. elencoPeriodicita
assert('elencoPeriodicita restituisce array', elencoPeriodicita().length === 15);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
