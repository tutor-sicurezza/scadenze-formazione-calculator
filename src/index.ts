// scadenze-formazione-calculator
// Calcolatore scadenze aggiornamento corsi sicurezza lavoro (Italia).
// Riferimenti: D.Lgs 81/08, Accordo Stato-Regioni 21/12/2011,
// Accordo Stato-Regioni Rep. 78/CSR 17/04/2025.

export type CorsoSlug =
  | 'lavoratori-basso'
  | 'lavoratori-medio'
  | 'lavoratori-alto'
  | 'preposto'
  | 'dirigente'
  | 'rspp-modulo-b'
  | 'rls'
  | 'antincendio-l1'
  | 'antincendio-l2'
  | 'antincendio-l3'
  | 'primo-soccorso-a'
  | 'primo-soccorso-b-c'
  | 'carrelli-elevatori'
  | 'ple'
  | 'haccp';

export interface Periodicita {
  /** Ore minime del corso di aggiornamento */
  ore: number;
  /** Periodicità di aggiornamento in mesi */
  mesi: number;
  /** Riferimento normativo */
  fonte: string;
}

export const PERIODICITA: Record<CorsoSlug, Periodicita> = {
  'lavoratori-basso': {
    ore: 6,
    mesi: 60,
    fonte: 'Accordo Stato-Regioni 21/12/2011, punto 9',
  },
  'lavoratori-medio': {
    ore: 6,
    mesi: 60,
    fonte: 'Accordo Stato-Regioni 21/12/2011, punto 9',
  },
  'lavoratori-alto': {
    ore: 6,
    mesi: 60,
    fonte: 'Accordo Stato-Regioni 21/12/2011, punto 9',
  },
  preposto: {
    // Accordo Rep. 78/CSR 17/04/2025: aggiornamento annuale per i preposti.
    ore: 6,
    mesi: 12,
    fonte: 'Accordo Stato-Regioni Rep. 78/CSR 17/04/2025',
  },
  dirigente: {
    ore: 6,
    mesi: 60,
    fonte: 'Accordo Stato-Regioni 21/12/2011, punto 6',
  },
  'rspp-modulo-b': {
    // Aggiornamento quinquennale RSPP/ASPP (Modulo B)
    ore: 40,
    mesi: 60,
    fonte: 'Accordo Stato-Regioni 07/07/2016, art. 6',
  },
  rls: {
    // Aggiornamento annuale; durata variabile per dimensione aziendale (4 h o 8 h).
    ore: 4,
    mesi: 12,
    fonte: 'D.Lgs 81/08, art. 37 c. 11',
  },
  'antincendio-l1': {
    ore: 2,
    mesi: 60,
    fonte: 'D.M. 02/09/2021, Allegato III',
  },
  'antincendio-l2': {
    ore: 5,
    mesi: 60,
    fonte: 'D.M. 02/09/2021, Allegato III',
  },
  'antincendio-l3': {
    ore: 8,
    mesi: 60,
    fonte: 'D.M. 02/09/2021, Allegato III',
  },
  'primo-soccorso-a': {
    ore: 6,
    mesi: 36,
    fonte: 'D.M. 388/2003, art. 3 c. 5',
  },
  'primo-soccorso-b-c': {
    ore: 4,
    mesi: 36,
    fonte: 'D.M. 388/2003, art. 3 c. 5',
  },
  'carrelli-elevatori': {
    ore: 4,
    mesi: 60,
    fonte: 'Accordo Stato-Regioni 22/02/2012, Allegato A',
  },
  ple: {
    // Piattaforme di Lavoro Elevabili
    ore: 4,
    mesi: 60,
    fonte: 'Accordo Stato-Regioni 22/02/2012, Allegato A',
  },
  haccp: {
    // La periodicità HACCP è regolata da norme regionali (in media 2-3 anni).
    ore: 4,
    mesi: 36,
    fonte: 'Reg. CE 852/2004 — recepimenti regionali (valore indicativo medio)',
  },
};

export type StatoCorso = 'in-regola' | 'in-scadenza' | 'scaduto';

export interface RisultatoScadenza {
  /** Data entro cui il corso va aggiornato */
  scadenza: Date;
  /** Restituisce lo stato del corso a una data specifica (default: oggi) */
  statoIl: (data?: Date) => StatoCorso;
  /** Giorni mancanti alla scadenza (negativo se già scaduto) */
  giorniAllaScadenza: (data?: Date) => number;
  /** Periodicità applicata */
  periodicita: Periodicita;
}

/**
 * Calcola la data di scadenza dell’aggiornamento per un corso di sicurezza.
 *
 * @param corso slug del corso (vedi CorsoSlug)
 * @param dataUltimoCorso data del corso o dell’ultimo aggiornamento effettuato
 * @param sogliaInScadenzaGiorni numero di giorni prima della scadenza in cui
 *  lo stato diventa "in-scadenza" (default: 60)
 */
export function calcolaScadenza(
  corso: CorsoSlug,
  dataUltimoCorso: Date,
  sogliaInScadenzaGiorni = 60,
): RisultatoScadenza {
  const p = PERIODICITA[corso];
  if (!p) {
    throw new Error(`Corso non riconosciuto: ${corso}`);
  }
  if (!(dataUltimoCorso instanceof Date) || isNaN(dataUltimoCorso.getTime())) {
    throw new Error('dataUltimoCorso non valida');
  }

  const scadenza = new Date(dataUltimoCorso);
  scadenza.setMonth(scadenza.getMonth() + p.mesi);

  const giorniAllaScadenza = (data: Date = new Date()): number => {
    const ms = scadenza.getTime() - data.getTime();
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
  };

  const statoIl = (data: Date = new Date()): StatoCorso => {
    const giorni = giorniAllaScadenza(data);
    if (giorni < 0) return 'scaduto';
    if (giorni <= sogliaInScadenzaGiorni) return 'in-scadenza';
    return 'in-regola';
  };

  return { scadenza, statoIl, giorniAllaScadenza, periodicita: p };
}

/**
 * Restituisce tutte le periodicità note in formato array, comodo per UI a tabella.
 */
export function elencoPeriodicita(): Array<{ corso: CorsoSlug } & Periodicita> {
  return (Object.keys(PERIODICITA) as CorsoSlug[]).map((c) => ({
    corso: c,
    ...PERIODICITA[c],
  }));
}
