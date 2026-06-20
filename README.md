# scadenze-formazione-calculator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/tutor-sicurezza/scadenze-formazione-calculator)
[![GitHub release](https://img.shields.io/github/v/release/tutor-sicurezza/scadenze-formazione-calculator)](https://github.com/tutor-sicurezza/scadenze-formazione-calculator/releases)
[![GitHub stars](https://img.shields.io/github/stars/tutor-sicurezza/scadenze-formazione-calculator?style=social)](https://github.com/tutor-sicurezza/scadenze-formazione-calculator/stargazers)
[![CI](https://github.com/tutor-sicurezza/scadenze-formazione-calculator/actions/workflows/ci.yml/badge.svg)](https://github.com/tutor-sicurezza/scadenze-formazione-calculator/actions/workflows/ci.yml)
[![Part of the tutor-sicurezza open-data ecosystem](https://img.shields.io/badge/ecosystem-tutor--sicurezza-blue.svg)](https://github.com/tutor-sicurezza)

Libreria TypeScript/JavaScript pura per calcolare le **scadenze di aggiornamento** dei corsi di formazione per la sicurezza sul lavoro in Italia, secondo il **D.Lgs 81/08** e gli **Accordi Stato-Regioni** applicabili.

Zero dipendenze runtime. Pensata per essere usata in tool HR, gestionali HSE, LMS, dashboard di compliance, o semplici script per il consulente del lavoro.

## Cos’è

Ogni corso obbligatorio in materia di sicurezza sul lavoro ha una **periodicità di aggiornamento** definita per legge (es. lavoratori: 6 ore ogni 5 anni; preposti: aggiornamento annuale dopo l’Accordo Rep. 78/CSR 17/04/2025). Questa libreria centralizza tale logica in un’API tipizzata: passi lo slug del corso e la data dell’ultima formazione, ottieni la scadenza e lo stato (`in-regola` / `in-scadenza` / `scaduto`).

## Installazione

```bash
npm install scadenze-formazione-calculator
```

## Esempio d’uso

```ts
import { calcolaScadenza } from 'scadenze-formazione-calculator';

const r = calcolaScadenza('lavoratori-medio', new Date('2021-09-15'));

console.log(r.scadenza.toISOString());
// 2026-09-15T00:00:00.000Z

console.log(r.statoIl(new Date('2026-06-20'))); // 'in-scadenza'
console.log(r.giorniAllaScadenza());            // es. 87
console.log(r.periodicita);
// { ore: 6, mesi: 60, fonte: 'Accordo Stato-Regioni 21/12/2011, punto 9' }
```

### Elenco scadenze (utile per tabelle UI)

```ts
import { elencoPeriodicita } from 'scadenze-formazione-calculator';

for (const p of elencoPeriodicita()) {
  console.log(`${p.corso}: ${p.ore} h ogni ${p.mesi} mesi (${p.fonte})`);
}
```

## Tabella periodicità

| Corso (slug) | Ore aggiornamento | Periodicità | Riferimento |
|---|---|---|---|
| `lavoratori-basso` | 6 | 5 anni | Accordo SR 21/12/2011, punto 9 |
| `lavoratori-medio` | 6 | 5 anni | Accordo SR 21/12/2011, punto 9 |
| `lavoratori-alto` | 6 | 5 anni | Accordo SR 21/12/2011, punto 9 |
| `preposto` | 6 | **1 anno** | Accordo SR Rep. 78/CSR 17/04/2025 |
| `dirigente` | 6 | 5 anni | Accordo SR 21/12/2011, punto 6 |
| `rspp-modulo-b` | 40 | 5 anni | Accordo SR 07/07/2016, art. 6 |
| `rls` | 4 (o 8 oltre 50 dip.) | 1 anno | D.Lgs 81/08, art. 37 c. 11 |
| `antincendio-l1` | 2 | 5 anni | D.M. 02/09/2021, All. III |
| `antincendio-l2` | 5 | 5 anni | D.M. 02/09/2021, All. III |
| `antincendio-l3` | 8 | 5 anni | D.M. 02/09/2021, All. III |
| `primo-soccorso-a` | 6 | 3 anni | D.M. 388/2003, art. 3 c. 5 |
| `primo-soccorso-b-c` | 4 | 3 anni | D.M. 388/2003, art. 3 c. 5 |
| `carrelli-elevatori` | 4 | 5 anni | Accordo SR 22/02/2012, All. A |
| `ple` | 4 | 5 anni | Accordo SR 22/02/2012, All. A |
| `haccp` | 4 | 3 anni (indicativo) | Reg. CE 852/2004 + norme regionali |

## Note normative

- **Preposti — aggiornamento annuale**: l’Accordo Stato-Regioni Rep. 78/CSR del 17/04/2025 ha modificato la periodicità dell’aggiornamento dei preposti, portandola a **cadenza annuale** (in precedenza era quinquennale). La libreria adotta la nuova regola.
- **RLS**: l’art. 37 c. 11 del D.Lgs 81/08 prevede 4 ore annue per aziende fino a 50 dipendenti e 8 ore annue oltre tale soglia. La libreria espone il valore minimo (4 h); puoi sovrascriverlo lato applicativo in base alla dimensione aziendale.
- **HACCP**: la periodicità è demandata alle Regioni; il valore di default (3 anni) è una media indicativa. Verifica la normativa della tua Regione.

## Tool online

Per uso non-developer è disponibile un [calcolatore web gratuito](https://123formazione.com/strumenti/calcolatore-scadenze) basato su questa libreria, realizzato da **123Formazione**: utile per RSPP, consulenti del lavoro o titolari di PMI che vogliono verificare al volo lo stato dei loro corsi.

## Test

```bash
npm install
npm test
```

## English summary

`scadenze-formazione-calculator` is a zero-dependency TypeScript library that computes refresher deadlines for Italian workplace-safety training courses (Legislative Decree 81/2008 and the related State-Regions Agreements). Given a course slug and the date of last training, it returns the expiry date and a status of `in-regola` / `in-scadenza` / `scaduto`.

## Disclaimer

Lo schema delle periodicità è curato sulla base della normativa vigente al **giugno 2026**, ma la legislazione evolve: questa libreria è un aiuto operativo e **non sostituisce una consulenza professionale**. PR e issue benvenute per segnalare modifiche normative.

## Related repositories

Open dataset / tooling ecosystem for Italian workplace safety (D.Lgs 81/08) maintained by [@tutor-sicurezza](https://github.com/tutor-sicurezza):

**Datasets**
- [italian-ateco-database](https://github.com/tutor-sicurezza/italian-ateco-database) — ATECO 2007 codes + workplace-safety risk
- [italian-province-regioni-dataset](https://github.com/tutor-sicurezza/italian-province-regioni-dataset) — Italian provinces + regions metadata
- [comuni-italiani-istat](https://github.com/tutor-sicurezza/comuni-italiani-istat) — Italian municipalities with ISTAT codes
- [dlgs-81-08-glossario](https://github.com/tutor-sicurezza/dlgs-81-08-glossario) — 218 D.Lgs 81/08 glossary terms
- [dlgs-81-08-testo-unico](https://github.com/tutor-sicurezza/dlgs-81-08-testo-unico) — D.Lgs 81/08 structured by Title + key articles index
- [haccp-italia-normativa-regionale](https://github.com/tutor-sicurezza/haccp-italia-normativa-regionale) — HACCP regional regulations (20 Italian regions)
- [verifiche-periodiche-inail-attrezzature](https://github.com/tutor-sicurezza/verifiche-periodiche-inail-attrezzature) — Equipment subject to INAIL periodic verification
- [accordi-stato-regioni-sicurezza-lavoro](https://github.com/tutor-sicurezza/accordi-stato-regioni-sicurezza-lavoro) — Stato-Regioni training agreements

**Libraries / tools**
- [next-seo-italian-helpers](https://github.com/tutor-sicurezza/next-seo-italian-helpers) — Next.js SEO helpers for Italian B2B
- [mcp-italian-workplace-safety](https://github.com/tutor-sicurezza/mcp-italian-workplace-safety) — MCP server for Claude Desktop / Cursor / Cline

**Online services**
- [Public REST API + OpenAPI 3.1 + DCAT-AP-IT](https://123formazione.com/api/public/docs) — Free open data API
- [Live documentation site (GitHub Pages)](https://tutor-sicurezza.github.io/accordi-stato-regioni-sicurezza-lavoro/) — Accordi Stato-Regioni

All resources are MIT or CC-BY licensed and maintained as production-quality open data.

## Licenza

[MIT](./LICENSE)
