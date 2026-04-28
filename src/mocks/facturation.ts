// Mocks Facturation Noé — données cohérentes et crédibles
// Pro: SympaGroupe SARL — 41 logements (30 P1 / 8 P2 / 3 P3) — 18 propriétaires
// 78 réservations sur Mars 2026 + historique nov 2025 → fév 2026

export type ModeFacturation = "P1" | "P2" | "P3";
export type Source = "airbnb" | "booking" | "direct";
export type StepKey = "sync" | "ba" | "drafts" | "issue" | "sepa" | "wrap";
export type StepState = "done" | "action" | "waiting" | "pending" | "blocked";
export type BAState = "draft" | "blocked" | "ready" | "validated";
export type AlertKind = null | "duplicate" | "negative";
export type DraftState = "blocked" | "ready" | "validated" | "issued";
export type SessionState = "draft" | "in_progress" | "issued" | "closed";

export interface ProInfo {
  name: string;
  siret: string;
  vatIntra: string;
  address: string;
  ibanCourant: string;
  ibanSequestre: string;
  carteG: { number: string; expiresAt: string };
  vatRate: number;
  invoicePrefix: string;
}

export interface Owner {
  id: string;
  name: string;
  email: string;
  iban?: string;
  hasMandateSEPA: boolean;
}

export interface Property {
  id: string;
  name: string;
  ownerId: string;
  mode: ModeFacturation;
  commissionRate: number;
  cleaningSellHt: number;
  cleaningBuyHt: number;
  laundrySellHt: number;
  keynestHt: number;
  fixedMonthlyHt: number; // assurance + articles fixes
}

export interface Reservation {
  id: string;
  apiReference: string;
  propertyId: string;
  source: Source;
  guest: string;
  arrival: string; // ISO
  departure: string;
  nights: number;
  amount: number; // brut OTA
  payout: number; // versé propriétaire / pro
  hasKeynest: boolean;
}

export interface BARow {
  id: string;
  reservationId: string;
  apiReference: string;
  date: string;
  guest: string;
  source: Source;
  amount: number;
  alert: AlertKind;
  alertReason?: string;
  validated: boolean;
}

export interface BA {
  id: string;
  propertyId: string;
  ownerId: string;
  month: string; // "2026-03"
  state: BAState;
  rows: BARow[];
  total: number;
}

export interface DraftLine {
  label: string;
  qty: number;
  unitHt: number;
  vatRate: number;
  isReimbursement?: boolean; // débours
  providerInvoiceRef?: string;
  modified?: boolean;
}

export interface Draft {
  id: string;
  propertyId: string;
  ownerId: string;
  baId: string;
  month: string;
  state: DraftState;
  lines: DraftLine[];
  blockingReasons: string[]; // ex: "iban_missing", "provider_invoice_missing"
  totalHt: number;
  totalVat: number;
  totalTtc: number;
  reimbursements: number;
  baAmount: number;
  net: number; // ce que le proprio doit (ou 0/avoir si trop-perçu)
  invoiceNumber?: string;
}

export interface ProviderInvoiceTodo {
  id: string;
  providerName: string;
  amountTtc: number;
  date: string;
  hint: string;
}

export interface ComplementaryTodo {
  id: string;
  ownerName: string;
  monthLabel: string;
  amount: number;
}

export interface VigilanceItem {
  id: string;
  level: "yellow" | "orange" | "red";
  title: string;
  detail: string;
}

export interface MonthSummary {
  month: string;
  label: string;
  state: SessionState;
  invoicesCount: number;
  caTransited: number;
  honoraires: number;
  activeProperties: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

export const PRO: ProInfo = {
  name: "SympaGroupe SARL",
  siret: "853 421 097 00018",
  vatIntra: "FR42853421097",
  address: "12 rue Vendôme, 69006 Lyon",
  ibanCourant: "FR76 1027 8073 0000 0214 5670 154",
  ibanSequestre: "FR76 1027 8073 0000 0214 5670 998",
  carteG: { number: "CPI 6901 2024 000 012 547", expiresAt: "2027-06-15" },
  vatRate: 0.20,
  invoicePrefix: "BNBLYON",
};

const OWNER_NAMES = [
  "Élise Marchand", "Antoine Berthier", "Camille Rouvière", "Hugo Lévêque",
  "Marie-Claire Aubert", "Pierre Salomon", "Léa Doumergue", "Vincent Roussel",
  "Sophie Hennequin", "Thomas Vasseur", "Isabelle Dauphin", "Romain Cazeneuve",
  "Clémence Moreau", "Jean-Baptiste Duroc", "Aurélie Lestrange", "Maxime Tournier",
  "Hélène Vidal", "Nicolas Fabre"
];

export const OWNERS: Owner[] = OWNER_NAMES.map((name, i) => {
  const slug = name.toLowerCase().replace(/[^a-z]/g, "");
  return {
    id: `o-${i + 1}`,
    name,
    email: `${slug.slice(0, 12)}@mail.fr`,
    iban: i === 7 || i === 14 ? undefined : `FR76 ${1000 + i * 17} 0000 0000 ${String(1000 + i * 91).padStart(4, "0")} 000`,
    hasMandateSEPA: i % 5 !== 0,
  };
});

// 41 logements : owners distribués (certains en ont plusieurs)
const PROP_DEFS: Array<{ name: string; ownerIdx: number; mode: ModeFacturation }> = [
  // P3 (mandant)
  { name: "Loft Saxe-Gambetta", ownerIdx: 0, mode: "P3" },
  { name: "Suite Croix-Rousse", ownerIdx: 0, mode: "P3" },
  { name: "Atelier Guillotière", ownerIdx: 4, mode: "P3" },
  // P2 (split)
  { name: "Apt Bellecour 2P", ownerIdx: 1, mode: "P2" },
  { name: "Studio Part-Dieu", ownerIdx: 1, mode: "P2" },
  { name: "Apt Foch 3P", ownerIdx: 2, mode: "P2" },
  { name: "Vieux Lyon Charme", ownerIdx: 5, mode: "P2" },
  { name: "Confluence Vue", ownerIdx: 6, mode: "P2" },
  { name: "Apt Brotteaux Sud", ownerIdx: 8, mode: "P2" },
  { name: "Studio Monplaisir", ownerIdx: 11, mode: "P2" },
  { name: "Loft Vaise", ownerIdx: 13, mode: "P2" },
  // P1 (standard) — 30
  { name: "Apt Bastille 2P", ownerIdx: 3, mode: "P1" },
  { name: "Studio République", ownerIdx: 3, mode: "P1" },
  { name: "Duplex Hôtel de Ville", ownerIdx: 7, mode: "P1" },
  { name: "Apt Ainay 2P", ownerIdx: 9, mode: "P1" },
  { name: "Suite Cordeliers", ownerIdx: 9, mode: "P1" },
  { name: "Studio Terreaux", ownerIdx: 10, mode: "P1" },
  { name: "Apt Massena", ownerIdx: 12, mode: "P1" },
  { name: "Loft Jean Macé", ownerIdx: 14, mode: "P1" },
  { name: "Apt Sans-Souci", ownerIdx: 15, mode: "P1" },
  { name: "Studio Garibaldi", ownerIdx: 15, mode: "P1" },
  { name: "Apt Berthelot", ownerIdx: 16, mode: "P1" },
  { name: "Maison Caluire", ownerIdx: 17, mode: "P1" },
  { name: "Apt Préfecture", ownerIdx: 17, mode: "P1" },
  { name: "Studio Saint-Just", ownerIdx: 0, mode: "P1" },
  { name: "Apt Fourvière", ownerIdx: 2, mode: "P1" },
  { name: "Studio Mutualité", ownerIdx: 4, mode: "P1" },
  { name: "Apt Liberté 3P", ownerIdx: 5, mode: "P1" },
  { name: "Studio Thiers", ownerIdx: 6, mode: "P1" },
  { name: "Apt Edgar Quinet", ownerIdx: 8, mode: "P1" },
  { name: "Loft Tony Garnier", ownerIdx: 11, mode: "P1" },
  { name: "Apt Place Carnot", ownerIdx: 13, mode: "P1" },
  { name: "Studio Perrache", ownerIdx: 14, mode: "P1" },
  { name: "Apt Servient", ownerIdx: 16, mode: "P1" },
  { name: "Studio Lafayette", ownerIdx: 1, mode: "P1" },
  { name: "Apt Wilson", ownerIdx: 3, mode: "P1" },
  { name: "Loft Mermoz", ownerIdx: 5, mode: "P1" },
  { name: "Studio Grange-Blanche", ownerIdx: 7, mode: "P1" },
  { name: "Apt Place Bahadourian", ownerIdx: 9, mode: "P1" },
  { name: "Studio Jet d'Eau", ownerIdx: 12, mode: "P1" },
  { name: "Apt Lacassagne", ownerIdx: 16, mode: "P1" },
];

export const PROPERTIES: Property[] = PROP_DEFS.map((d, i) => ({
  id: `p-${i + 1}`,
  name: d.name,
  ownerId: OWNERS[d.ownerIdx].id,
  mode: d.mode,
  commissionRate: d.mode === "P3" ? 0.20 : d.mode === "P2" ? 0.18 : 0.15,
  cleaningSellHt: 75 + (i % 4) * 10,
  cleaningBuyHt: 45 + (i % 3) * 5,
  laundrySellHt: 18,
  keynestHt: 8,
  fixedMonthlyHt: 12, // assurance
}));

// Génération réservations Mars 2026 (78 résas réparties)
function pad(n: number) { return String(n).padStart(2, "0"); }
function dateStr(y: number, m: number, d: number) { return `${y}-${pad(m)}-${pad(d)}`; }

const FIRST_NAMES = ["Marc", "Julie", "Tom", "Lina", "Paul", "Emma", "Leo", "Zoé", "Hugo", "Sara", "Nina", "Adam", "Eve", "Rémi", "Mia", "Liam", "Anna", "Noah", "Lola", "Théo"];
const LAST_NAMES = ["Dupont", "Martin", "Bernard", "Petit", "Robert", "Richard", "Durand", "Leroy", "Moreau", "Laurent", "Simon", "Michel", "Lefevre", "Garcia", "David"];

function makeGuest(seed: number) {
  return `${FIRST_NAMES[seed % FIRST_NAMES.length]} ${LAST_NAMES[(seed * 7) % LAST_NAMES.length]}`;
}

export const RESERVATIONS_MARS: Reservation[] = (() => {
  const res: Reservation[] = [];
  let id = 1;
  PROPERTIES.forEach((p, idx) => {
    const count = idx < 28 ? 2 : idx < 38 ? 1 : 3; // 28*2 + 10*1 + 3*3 = 75; on ajoute 3 = 78
    for (let r = 0; r < count; r++) {
      const arrivalDay = 2 + ((idx + r * 7) % 24);
      const nights = 2 + ((idx + r) % 5);
      const departureDay = Math.min(28, arrivalDay + nights);
      const realNights = departureDay - arrivalDay;
      const source: Source = r === 0 ? (idx % 2 === 0 ? "airbnb" : "booking") : (idx % 3 === 0 ? "booking" : "airbnb");
      const nightlyRate = 90 + ((idx * 13 + r * 5) % 60);
      const amount = nightlyRate * realNights;
      const payout = p.mode === "P2" ? Math.round(amount * 0.78) : amount;
      res.push({
        id: `r-${id}`,
        apiReference: `${source === "airbnb" ? "HMABC" : "BK"}${1000 + id * 13}`,
        propertyId: p.id,
        source,
        guest: makeGuest(id),
        arrival: dateStr(2026, 3, arrivalDay),
        departure: dateStr(2026, 3, departureDay),
        nights: realNights,
        amount,
        payout,
        hasKeynest: idx % 3 === 0,
      });
      id++;
    }
  });
  // 3 résas supplémentaires pour atteindre 78
  while (res.length < 78) {
    const p = PROPERTIES[res.length % PROPERTIES.length];
    res.push({
      id: `r-${res.length + 1}`,
      apiReference: `BK${9000 + res.length}`,
      propertyId: p.id,
      source: "direct",
      guest: makeGuest(res.length + 99),
      arrival: dateStr(2026, 3, 26),
      departure: dateStr(2026, 3, 28),
      nights: 2,
      amount: 200,
      payout: 200,
      hasKeynest: false,
    });
  }
  return res;
})();

// Construction des BA pour Mars 2026 — 1 BA par logement actif
export const BAS_MARS: BA[] = (() => {
  const byProp = new Map<string, Reservation[]>();
  RESERVATIONS_MARS.forEach(r => {
    const arr = byProp.get(r.propertyId) || [];
    arr.push(r);
    byProp.set(r.propertyId, arr);
  });
  const list: BA[] = [];
  let baId = 1;
  byProp.forEach((reservations, propId) => {
    const prop = PROPERTIES.find(p => p.id === propId)!;
    const rows: BARow[] = reservations.map((r, idx) => {
      // Injecter quelques alertes
      let alert: AlertKind = null;
      let alertReason: string | undefined;
      let amount = r.payout;
      if (baId === 3 && idx === 0) { alert = "duplicate"; alertReason = "Même apiRef + même montant qu'un BA de février 2026 (longue durée probable)"; }
      if (baId === 7 && idx === 1) { alert = "negative"; alertReason = "Annulation tardive Airbnb"; amount = -312.40; }
      if (baId === 12 && idx === 0) { alert = "duplicate"; alertReason = "Versement mensuel d'une longue durée déjà encaissée en février"; }
      return {
        id: `bar-${baId}-${idx}`,
        reservationId: r.id,
        apiReference: r.apiReference,
        date: r.arrival,
        guest: r.guest,
        source: r.source,
        amount,
        alert,
        alertReason,
        validated: alert === null,
      };
    });
    const total = rows.reduce((s, r) => s + r.amount, 0);
    const hasAlert = rows.some(r => r.alert !== null);
    list.push({
      id: `ba-${baId}`,
      propertyId: propId,
      ownerId: prop.ownerId,
      month: "2026-03",
      state: hasAlert ? "blocked" : "ready",
      rows,
      total,
    });
    baId++;
  });
  return list;
})();

// Brouillons — générés à partir des BA, avec quelques blocages
export function buildDrafts(bas: BA[]): Draft[] {
  return bas.map((ba, i) => {
    const prop = PROPERTIES.find(p => p.id === ba.propertyId)!;
    const owner = OWNERS.find(o => o.id === ba.ownerId)!;
    const reservations = RESERVATIONS_MARS.filter(r => r.propertyId === ba.propertyId);
    const passages = reservations.length;
    const keynestCount = reservations.filter(r => r.hasKeynest).length;

    const lines: DraftLine[] = [
      { label: "Commission de gestion", qty: 1, unitHt: Math.round(ba.total * prop.commissionRate * 100) / 100, vatRate: PRO.vatRate },
      { label: "Ménages réalisés", qty: passages, unitHt: prop.cleaningSellHt, vatRate: PRO.vatRate },
      { label: "Blanchisserie", qty: passages, unitHt: prop.laundrySellHt, vatRate: PRO.vatRate },
      ...(keynestCount > 0 ? [{ label: "Remise de clés Keynest", qty: keynestCount, unitHt: prop.keynestHt, vatRate: PRO.vatRate }] : []),
      { label: "Articles fixes (assurance, abonnements)", qty: 1, unitHt: prop.fixedMonthlyHt, vatRate: PRO.vatRate },
    ];

    const totalHt = lines.reduce((s, l) => s + l.qty * l.unitHt, 0);
    const totalVat = lines.reduce((s, l) => s + l.qty * l.unitHt * l.vatRate, 0);
    const totalTtc = totalHt + totalVat;
    const reimbursements = 0;
    const baAmount = ba.total;
    const net = totalTtc - baAmount;

    // Blocages : 3 brouillons bloqués
    const blockingReasons: string[] = [];
    if (i === 1) blockingReasons.push("provider_invoice_missing");
    if (i === 5 && !owner.iban) blockingReasons.push("iban_missing");
    if (!owner.iban && owner.hasMandateSEPA) blockingReasons.push("iban_missing");
    if (i === 9) blockingReasons.push("maintenance_pending");

    const baValidated = ba.state === "validated";
    const state: DraftState = blockingReasons.length > 0 ? "blocked" : (baValidated ? "ready" : "ready");

    return {
      id: `d-${i + 1}`,
      propertyId: ba.propertyId,
      ownerId: ba.ownerId,
      baId: ba.id,
      month: ba.month,
      state,
      lines,
      blockingReasons,
      totalHt: Math.round(totalHt * 100) / 100,
      totalVat: Math.round(totalVat * 100) / 100,
      totalTtc: Math.round(totalTtc * 100) / 100,
      reimbursements,
      baAmount,
      net: Math.round(net * 100) / 100,
    };
  });
}

// Tâches en attente externe (panneau droit)
export const PROVIDER_INVOICES_TODO: ProviderInvoiceTodo[] = [
  { id: "pi-1", providerName: "Cleaning Lyon Pro", amountTtc: 432.00, date: "2026-04-03", hint: "Couvre 6 logements de mars" },
  { id: "pi-2", providerName: "Net'Concept", amountTtc: 285.50, date: "2026-04-04", hint: "Apt Bastille + Studio République" },
  { id: "pi-3", providerName: "Laundry Express", amountTtc: 178.20, date: "2026-04-05", hint: "Blanchisserie semaine 13" },
];

export const COMPLEMENTARY_TODO: ComplementaryTodo[] = [
  { id: "c-1", ownerName: "Élise Marchand", monthLabel: "Pour Janvier 2026", amount: 124.50 },
  { id: "c-2", ownerName: "Antoine Berthier", monthLabel: "Pour Février 2026", amount: 87.30 },
];

export const VIGILANCE: VigilanceItem[] = [
  { id: "v-1", level: "yellow", title: "Carte G expire J-47", detail: "Renouvellement à anticiper avant le 15/06/2027" },
  { id: "v-2", level: "orange", title: "2 IBAN propriétaires manquants", detail: "Sophie Hennequin, Aurélie Lestrange" },
  { id: "v-3", level: "yellow", title: "Garantie financière à renouveler", detail: "Échéance dans 4 mois" },
];

// Historique 6 mois
export const HISTORY: MonthSummary[] = [
  { month: "2026-03", label: "Mars 2026", state: "draft", invoicesCount: 0, caTransited: 0, honoraires: 0, activeProperties: 41 },
  { month: "2026-02", label: "Février 2026", state: "issued", invoicesCount: 39, caTransited: 113820, honoraires: 16710, activeProperties: 39 },
  { month: "2026-01", label: "Janvier 2026", state: "closed", invoicesCount: 38, caTransited: 98450, honoraires: 14580, activeProperties: 38 },
  { month: "2025-12", label: "Décembre 2025", state: "closed", invoicesCount: 40, caTransited: 142300, honoraires: 21450, activeProperties: 40 },
  { month: "2025-11", label: "Novembre 2025", state: "closed", invoicesCount: 37, caTransited: 89200, honoraires: 13180, activeProperties: 37 },
  { month: "2025-10", label: "Octobre 2025", state: "closed", invoicesCount: 36, caTransited: 95680, honoraires: 14110, activeProperties: 36 },
];

export const PERIODS = ["Janvier 2026", "Février 2026", "Mars 2026", "Avril 2026"];

export function fmt(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(n);
}

export function fmtNoCents(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}
