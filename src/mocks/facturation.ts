// Mocks Facturation Noé — données financièrement cohérentes
// Mois courant : Octobre 2026 / Précédent : Septembre 2026

export interface Owner {
  id: string;
  name: string;
  email: string;
  iban: string;
  bic: string;
  commissionRate: number; // ex 0.20
  cartG: boolean;
}

export interface Property {
  id: string;
  name: string;
  city: string;
  ownerId: string;
}

export type Platform = "booking" | "airbnb" | "direct";
export type ReservationStatus = "confirmed" | "cancelled" | "to_check";

export interface Reservation {
  id: string;
  platform: Platform;
  ref: string; // ex "BK-4827193"
  guest: string;
  propertyId: string;
  checkIn: string; // ISO
  checkOut: string; // ISO
  nights: number;
  gross: number;
  otaCommission: number;
  touristTax: number;
  noeFee: number;
  netOwner: number;
  status: ReservationStatus;
}

export type NegativeOpType =
  | "late_cancellation"
  | "adjustment"
  | "chargeback"
  | "manual_credit";

export type NegativeDecision =
  | null
  | "owner"
  | "noe"
  | "split"
  | "custom";

export interface NegativeOp {
  id: string;
  type: NegativeOpType;
  platform: Platform;
  ref: string;
  guest: string;
  propertyId: string;
  amount: number; // négatif
  occurredAt: string; // ISO
  details: string;
  recommended: NegativeDecision;
  decision: NegativeDecision;
  customAmount?: number;
  note?: string;
  resolvedAt?: string;
}

export interface MaintenanceLine {
  id: string;
  date: string;
  propertyId: string;
  description: string;
  materialCost: number;
  laborCost: number;
  defaultPrice: number;
  billedPrice: number; // editable
}

export interface CleaningLine {
  id: string;
  date: string;
  propertyId: string;
  type: "menage" | "linge";
  defaultPrice: number;
  billedPrice: number;
}

export interface MiscLine {
  id: string;
  date: string;
  propertyId: string;
  label: string;
  amountHT: number;
  vatRate: number; // 0.20
  hasReceipt: boolean;
}

// ───────── Propriétaires ─────────
export const owners: Owner[] = [
  { id: "o1", name: "Julien Martin", email: "j.martin@mail.fr", iban: "FR76 3000 4000 0312 3456 7890 143", bic: "BNPAFRPP", commissionRate: 0.20, cartG: true },
  { id: "o2", name: "Camille Lefèvre", email: "c.lefevre@mail.fr", iban: "FR76 1027 8061 4100 0203 9876 521", bic: "CMCIFRPP", commissionRate: 0.22, cartG: true },
  { id: "o3", name: "Antoine Rousseau", email: "a.rousseau@mail.fr", iban: "FR76 1820 6000 0512 8744 9001 287", bic: "AGRIFRPP", commissionRate: 0.18, cartG: true },
  { id: "o4", name: "Sophie Bernard", email: "s.bernard@mail.fr", iban: "FR76 3000 3035 1000 0500 1234 879", bic: "SOGEFRPP", commissionRate: 0.20, cartG: true },
  { id: "o5", name: "Marc Dubois", email: "m.dubois@mail.fr", iban: "FR76 1751 5900 0008 0011 1132 064", bic: "CEPAFRPP", commissionRate: 0.20, cartG: true },
  { id: "o6", name: "Élodie Petit", email: "e.petit@mail.fr", iban: "FR76 1469 0000 0112 3456 7890 198", bic: "BPGSFRPP", commissionRate: 0.25, cartG: true },
  { id: "o7", name: "Nicolas Garnier", email: "n.garnier@mail.fr", iban: "FR76 3000 2005 5000 0001 0203 045", bic: "CRLYFRPP", commissionRate: 0.20, cartG: true },
  { id: "o8", name: "Laure Moreau", email: "l.moreau@mail.fr", iban: "FR76 1234 5678 9012 3456 7890 187", bic: "BNPAFRPP", commissionRate: 0.18, cartG: true },
];

// ───────── Logements ─────────
export const properties: Property[] = [
  { id: "p1", name: "Appt Bastille 2P", city: "Paris 11e", ownerId: "o1" },
  { id: "p2", name: "Loft Marais", city: "Paris 4e", ownerId: "o1" },
  { id: "p3", name: "Studio Montmartre", city: "Paris 18e", ownerId: "o2" },
  { id: "p4", name: "Appt Vieux-Lyon", city: "Lyon 5e", ownerId: "o2" },
  { id: "p5", name: "Maison Confluence", city: "Lyon 2e", ownerId: "o3" },
  { id: "p6", name: "Studio Croix-Rousse", city: "Lyon 4e", ownerId: "o4" },
  { id: "p7", name: "Appt Vieux-Port", city: "Marseille 2e", ownerId: "o5" },
  { id: "p8", name: "Villa Endoume", city: "Marseille 7e", ownerId: "o5" },
  { id: "p9", name: "Appt Capitole", city: "Toulouse", ownerId: "o6" },
  { id: "p10", name: "Studio Carmes", city: "Toulouse", ownerId: "o7" },
  { id: "p11", name: "Appt Vieille-Ville", city: "Nice", ownerId: "o8" },
  { id: "p12", name: "Studio Promenade", city: "Nice", ownerId: "o8" },
];

// ───────── Helpers génération ─────────
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

const FIRST = ["Marie", "Lucas", "Emma", "Hugo", "Léa", "Nathan", "Chloé", "Théo", "Manon", "Louis", "Camille", "Jules", "Sarah", "Adam", "Inès", "Maxime", "Anaïs", "Antoine", "Clara", "Léo"];
const LAST = ["Dupont", "Martin", "Bernard", "Robert", "Petit", "Durand", "Leroy", "Moreau", "Simon", "Laurent", "Lefebvre", "Michel", "Garcia", "David", "Bertrand", "Roux", "Vincent", "Fournier", "Morel", "Girard"];

function randomGuest(r: () => number) {
  return `${FIRST[Math.floor(r() * FIRST.length)]} ${LAST[Math.floor(r() * LAST.length)]}`;
}

function pad(n: number) { return n < 10 ? `0${n}` : `${n}`; }
function isoDate(y: number, m: number, d: number) {
  return `${y}-${pad(m)}-${pad(d)}`;
}

function generateReservations(year: number, month: number, count: number, platform: Platform, seed: number): Reservation[] {
  const r = rng(seed);
  const daysInMonth = new Date(year, month, 0).getDate();
  const list: Reservation[] = [];
  for (let i = 0; i < count; i++) {
    const propIdx = Math.floor(r() * properties.length);
    const property = properties[propIdx];
    const owner = owners.find((o) => o.id === property.ownerId)!;
    const startDay = 1 + Math.floor(r() * (daysInMonth - 2));
    const nights = 1 + Math.floor(r() * 6);
    const checkInD = startDay;
    const checkOutD = Math.min(daysInMonth, startDay + nights);
    const realNights = checkOutD - checkInD;
    const nightlyRate = 80 + Math.floor(r() * 220);
    const gross = nightlyRate * realNights;
    const otaRate = platform === "booking" ? 0.15 : platform === "airbnb" ? 0.03 : 0;
    const otaCommission = Math.round(gross * otaRate * 100) / 100;
    const touristTax = Math.round(realNights * 1.5 * 100) / 100;
    const noeFee = Math.round((gross - otaCommission) * owner.commissionRate * 100) / 100;
    const netOwner = Math.round((gross - otaCommission - touristTax - noeFee) * 100) / 100;
    const status: ReservationStatus = r() < 0.04 ? "to_check" : "confirmed";
    list.push({
      id: `${platform[0]}-${seed}-${i}`,
      platform,
      ref: platform === "booking" ? `BK-${4800000 + Math.floor(r() * 99999)}` : platform === "airbnb" ? `AB-${5100000 + Math.floor(r() * 99999)}` : `DR-${1000 + i}`,
      guest: randomGuest(r),
      propertyId: property.id,
      checkIn: isoDate(year, month, checkInD),
      checkOut: isoDate(year, month, checkOutD),
      nights: realNights,
      gross,
      otaCommission,
      touristTax,
      noeFee,
      netOwner,
      status,
    });
  }
  return list;
}

// ───────── Mois courant : Octobre 2026 ─────────
export const CURRENT_PERIOD = { year: 2026, month: 10, label: "Octobre 2026" };
export const PREVIOUS_PERIOD = { year: 2026, month: 9, label: "Septembre 2026" };

export const reservations: Reservation[] = [
  ...generateReservations(2026, 10, 47, "booking", 42),
  ...generateReservations(2026, 10, 31, "airbnb", 1337),
];

export const previousReservations: Reservation[] = [
  ...generateReservations(2026, 9, 38, "booking", 7),
  ...generateReservations(2026, 9, 28, "airbnb", 13),
];

// ───────── Opérations négatives ─────────
export const initialNegativeOps: NegativeOp[] = [
  {
    id: "neg-1",
    type: "late_cancellation",
    platform: "booking",
    ref: "BK-4827193",
    guest: "Marie Dupont",
    propertyId: "p1",
    amount: -312.40,
    occurredAt: "2026-10-17T14:32:00",
    details: "Période 18 oct → 22 oct (4 nuits). Annulée 17 oct 14h32. Politique : Flexible — remboursement intégral.",
    recommended: "owner",
    decision: null,
  },
  {
    id: "neg-2",
    type: "adjustment",
    platform: "booking",
    ref: "BK-4831207",
    guest: "Lucas Bernard",
    propertyId: "p4",
    amount: -85.00,
    occurredAt: "2026-10-22T09:11:00",
    details: "Résolution centre Booking : compensation pour bruit (geste commercial conciergerie).",
    recommended: "noe",
    decision: null,
  },
  {
    id: "neg-3",
    type: "manual_credit",
    platform: "airbnb",
    ref: "AB-5118042",
    guest: "Emma Petit",
    propertyId: "p7",
    amount: -148.50,
    occurredAt: "2026-10-25T18:00:00",
    details: "Avoir manuel — souci douche en début de séjour, remboursement partiel proposé.",
    recommended: "split",
    decision: null,
  },
];

// ───────── Maintenance ─────────
export const maintenanceLines: MaintenanceLine[] = [
  { id: "m1", date: "2026-10-03", propertyId: "p1", description: "Remplacement chauffe-eau 100L", materialCost: 320, laborCost: 180, defaultPrice: 550, billedPrice: 550 },
  { id: "m2", date: "2026-10-07", propertyId: "p3", description: "Réparation volet roulant chambre", materialCost: 65, laborCost: 90, defaultPrice: 180, billedPrice: 180 },
  { id: "m3", date: "2026-10-09", propertyId: "p5", description: "Débouchage évier cuisine", materialCost: 12, laborCost: 80, defaultPrice: 110, billedPrice: 95 },
  { id: "m4", date: "2026-10-12", propertyId: "p7", description: "Pose serrure 5 points", materialCost: 145, laborCost: 120, defaultPrice: 290, billedPrice: 290 },
  { id: "m5", date: "2026-10-15", propertyId: "p9", description: "Reprise peinture salon", materialCost: 60, laborCost: 220, defaultPrice: 320, billedPrice: 280 },
  { id: "m6", date: "2026-10-18", propertyId: "p11", description: "Remplacement mitigeur SDB", materialCost: 95, laborCost: 70, defaultPrice: 195, billedPrice: 195 },
  { id: "m7", date: "2026-10-21", propertyId: "p2", description: "Diagnostic fuite chaudière", materialCost: 0, laborCost: 110, defaultPrice: 110, billedPrice: 110 },
  { id: "m8", date: "2026-10-26", propertyId: "p8", description: "Pose détecteurs de fumée x3", materialCost: 45, laborCost: 60, defaultPrice: 130, billedPrice: 130 },
];

// ───────── Ménage / Linge (12 prestations) ─────────
export const cleaningLines: CleaningLine[] = [
  { id: "c1", date: "2026-10-04", propertyId: "p1", type: "menage", defaultPrice: 65, billedPrice: 65 },
  { id: "c2", date: "2026-10-04", propertyId: "p1", type: "linge", defaultPrice: 28, billedPrice: 28 },
  { id: "c3", date: "2026-10-08", propertyId: "p3", type: "menage", defaultPrice: 55, billedPrice: 55 },
  { id: "c4", date: "2026-10-10", propertyId: "p5", type: "menage", defaultPrice: 75, billedPrice: 75 },
  { id: "c5", date: "2026-10-10", propertyId: "p5", type: "linge", defaultPrice: 32, billedPrice: 32 },
  { id: "c6", date: "2026-10-13", propertyId: "p7", type: "menage", defaultPrice: 70, billedPrice: 70 },
  { id: "c7", date: "2026-10-16", propertyId: "p9", type: "menage", defaultPrice: 60, billedPrice: 60 },
  { id: "c8", date: "2026-10-19", propertyId: "p11", type: "menage", defaultPrice: 65, billedPrice: 65 },
  { id: "c9", date: "2026-10-22", propertyId: "p2", type: "menage", defaultPrice: 80, billedPrice: 80 },
  { id: "c10", date: "2026-10-25", propertyId: "p8", type: "menage", defaultPrice: 90, billedPrice: 90 },
  { id: "c11", date: "2026-10-25", propertyId: "p8", type: "linge", defaultPrice: 38, billedPrice: 38 },
  { id: "c12", date: "2026-10-28", propertyId: "p12", type: "menage", defaultPrice: 60, billedPrice: 60 },
];

export const miscLines: MiscLine[] = [
  { id: "x1", date: "2026-10-12", propertyId: "p1", label: "Recharge consommables café/thé", amountHT: 24.5, vatRate: 0.20, hasReceipt: true },
  { id: "x2", date: "2026-10-20", propertyId: "p7", label: "Achat ampoule LED + piles télécommande", amountHT: 18.9, vatRate: 0.20, hasReceipt: false },
];

// ───────── Helpers calculs ─────────
export function getProperty(id: string) {
  return properties.find((p) => p.id === id)!;
}
export function getOwner(id: string) {
  return owners.find((o) => o.id === id)!;
}
export function getOwnerByProperty(propertyId: string) {
  return getOwner(getProperty(propertyId).ownerId);
}

export function sum<T>(arr: T[], pick: (v: T) => number) {
  return arr.reduce((a, b) => a + pick(b), 0);
}

// User config (toggle SEPA via cartG)
export const currentUser = {
  name: "Conciergerie Noé Paris",
  cartG: true,
  sepaIban: "FR76 1234 5678 9012 3456 7890 198",
  sepaBic: "BNPAFRPP",
  sepaAccountRef: "CG-2026-001",
};
