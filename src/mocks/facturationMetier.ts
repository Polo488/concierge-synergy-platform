// ============================================================
// Facturation Noé — Modèle métier complet (BA, Payouts, Réconciliation, Séquestre)
// Construit par-dessus les entités existantes (owners, properties, reservations).
// ============================================================
import {
  reservations as RES,
  owners,
  properties,
  getOwnerByProperty,
  getProperty,
  type Reservation,
  type Platform,
} from "@/mocks/facturation";

// ============================================================
// TYPES
// ============================================================

/** Transaction OTA atomique rattachée à une réservation et un payout. */
export interface OtaTransaction {
  id: string;
  reservationRef: string;
  reservationId: string;
  type: "payment" | "refund" | "aircover" | "adjustment";
  amount: number; // signé
  occurredAt: string; // ISO
  payoutId: string;
}

/** Versement OTA → compte séquestre. */
export interface OtaPayout {
  id: string;
  platform: Platform;
  /** Airbnb: payout_reference (G-XXXX). Booking: statement_descriptor. */
  reference: string;
  /** Montant total versé (somme algébrique des transactions). */
  amount: number;
  /** Booking : un payout par logement. Sinon null (multi-logements possible). */
  propertyId: string | null;
  /** Date d'arrivée bancaire prévue/effective. */
  bankDate: string;
  /** Pour Booking : libellé bancaire SEPA. Pour Airbnb : libellé virement avec G-XXXX. */
  bankLabel: string;
  /** Présent dans le CSV OTA importé ? (toujours true pour les payouts générés). */
  inOtaCsv: boolean;
}

/** Transaction bancaire constatée sur le compte séquestre (relevé). */
export interface BankTransaction {
  id: string;
  date: string;
  amount: number; // signé : crédit > 0, débit < 0
  /** Libellé du virement reçu (doit matcher reference d'un payout). */
  label: string;
  /** Référence reconnue (extraite via regex G-XXXX, BK-XXX...). */
  matchedReference: string | null;
  /** Statut de réconciliation. */
  reconciliationStatus: "matched" | "unmatched" | "manual";
  /** Si réconcilié, ID du payout. */
  matchedPayoutId: string | null;
  /** Catégorie pour les flux non OTA. */
  source: "ota_airbnb" | "ota_booking" | "direct" | "midterm" | "other";
}

export type BaStatus = "draft" | "ready" | "validated" | "blocked";

/** Bon à Tirer : 1 logement / 1 mois — agrège tout ce qui a été perçu. */
export interface BonATirer {
  id: string; // BA-2026-10-XXXX
  number: number; // numéro croissant
  propertyId: string;
  ownerId: string;
  periodLabel: string;
  /** Liste des réservations couvertes. */
  reservationIds: string[];
  /** Référence des payouts adossés (rapprochés banque). */
  payoutIds: string[];
  /** Sommes brutes perçues (= sum payouts rattachés). */
  grossReceived: number;
  /** Détail : remboursements et aircover inclus dans la période. */
  refunds: number;
  aircover: number;
  status: BaStatus;
  blockingReasons: string[];
  validatedAt?: string;
  validatedBy?: string;
}

export type InvoiceStatus = "draft" | "ready" | "validated" | "blocked" | "sent" | "credited" | "deferred";

/** Facture mensuelle : 1 logement / 1 mois — agrège BA validés + services. */
export interface Invoice {
  id: string;
  number: string; // FAC-2026-10-XXXX (croissant, immuable une fois validée)
  propertyId: string;
  ownerId: string;
  periodLabel: string;
  baId: string; // BA agrégé
  /** Montants détaillés. */
  netFromBa: number; // net réservations
  feesNoe: number; // commissions Noé
  cleaningDebours: number; // ménage refacturé
  maintenanceDebours: number;
  insurance: number;
  miscHt: number;
  vat: number;
  /** Net final à reverser (peut être négatif). */
  netOwner: number;
  status: InvoiceStatus;
  blockingReasons: string[];
  /** Décision si net < 0 : "deferred" report mois suivant ou "manual_collect". */
  negativeDecision: null | "deferred" | "manual_collect";
}

/** Mouvement séquestre (entrée OTA / sortie SEPA / frais). */
export interface EscrowMovement {
  id: string;
  date: string;
  label: string;
  amount: number; // signé
  type: "ota_in" | "sepa_out" | "fee" | "manual";
  /** Référence interne (BA, payout, virement…). */
  ref: string | null;
}

// ============================================================
// GÉNÉRATION DES DONNÉES (cohérentes avec les réservations existantes)
// ============================================================

function pad(n: number, w = 4) { return String(n).padStart(w, "0"); }

/**
 * Pour chaque réservation : créer un payment OTA et le payout correspondant.
 * Booking → 1 payout par réservation (ou par logement). Airbnb → 1 payout G-XXXX par batch.
 */
function buildOtaLayer() {
  const transactions: OtaTransaction[] = [];
  const payouts: OtaPayout[] = [];

  // Booking : un payout par logement / mois (regroupe toutes les rés du logement)
  const byPropBooking = new Map<string, Reservation[]>();
  RES.filter((r) => r.platform === "booking" && r.status === "confirmed").forEach((r) => {
    if (!byPropBooking.has(r.propertyId)) byPropBooking.set(r.propertyId, []);
    byPropBooking.get(r.propertyId)!.push(r);
  });

  let payoutSeq = 1;
  byPropBooking.forEach((list, propertyId) => {
    const total = list.reduce((a, r) => a + (r.gross - r.otaCommission), 0);
    const ref = `BK-PAY-${pad(payoutSeq++, 6)}`;
    const payout: OtaPayout = {
      id: `payout-bk-${propertyId}`,
      platform: "booking",
      reference: ref,
      amount: Math.round(total * 100) / 100,
      propertyId,
      bankDate: `2026-11-05`,
      bankLabel: `VIR SEPA BOOKING.COM ${ref}`,
      inOtaCsv: true,
    };
    payouts.push(payout);
    list.forEach((r, i) => {
      transactions.push({
        id: `txn-bk-${r.id}`,
        reservationRef: r.ref,
        reservationId: r.id,
        type: "payment",
        amount: r.gross - r.otaCommission,
        occurredAt: r.checkOut,
        payoutId: payout.id,
      });
    });
  });

  // Airbnb : un payout G-XXXX par batch (~5 réservations)
  const airbnbList = RES.filter((r) => r.platform === "airbnb" && r.status === "confirmed");
  for (let i = 0; i < airbnbList.length; i += 5) {
    const batch = airbnbList.slice(i, i + 5);
    const total = batch.reduce((a, r) => a + (r.gross - r.otaCommission), 0);
    const ref = `G-${pad(8000 + Math.floor(i / 5), 5)}`;
    const payout: OtaPayout = {
      id: `payout-ab-${i}`,
      platform: "airbnb",
      reference: ref,
      amount: Math.round(total * 100) / 100,
      propertyId: null,
      bankDate: `2026-11-${String(3 + Math.floor(i / 5)).padStart(2, "0")}`,
      bankLabel: `VIR AIRBNB PAYMENTS UK ${ref}`,
      inOtaCsv: true,
    };
    payouts.push(payout);
    batch.forEach((r) => {
      transactions.push({
        id: `txn-ab-${r.id}`,
        reservationRef: r.ref,
        reservationId: r.id,
        type: "payment",
        amount: r.gross - r.otaCommission,
        occurredAt: r.checkOut,
        payoutId: payout.id,
      });
    });
  }

  return { transactions, payouts };
}

const { transactions: OTA_TRANSACTIONS, payouts: OTA_PAYOUTS } = buildOtaLayer();
export const otaTransactions = OTA_TRANSACTIONS;
export const otaPayouts = OTA_PAYOUTS;

// ============================================================
// RELEVÉ BANCAIRE — la majorité des virements arrivent + 1 exception + 1 flux direct
// ============================================================
function buildBankStatement(): BankTransaction[] {
  const tx: BankTransaction[] = [];
  let i = 0;

  OTA_PAYOUTS.forEach((p) => {
    // 95% match parfait, 1 exception sur le 3e payout (montant différent)
    const isException = i === 2;
    const amount = isException ? p.amount - 12.40 : p.amount;
    tx.push({
      id: `bank-${i++}`,
      date: p.bankDate,
      amount,
      label: p.bankLabel,
      matchedReference: isException ? null : p.reference,
      reconciliationStatus: isException ? "unmatched" : "matched",
      matchedPayoutId: isException ? null : p.id,
      source: p.platform === "airbnb" ? "ota_airbnb" : "ota_booking",
    });
  });

  // Flux non OTA : virement direct propriétaire (réservation directe)
  tx.push({
    id: `bank-${i++}`,
    date: "2026-10-22",
    amount: 980,
    label: "VIR M. ROUSSEAU LOC DIRECTE OCT",
    matchedReference: null,
    reconciliationStatus: "manual",
    matchedPayoutId: null,
    source: "direct",
  });

  // Petit flux moyenne durée
  tx.push({
    id: `bank-${i++}`,
    date: "2026-10-08",
    amount: 1450,
    label: "VIR LOYER MOYENNE DUREE OCT",
    matchedReference: null,
    reconciliationStatus: "manual",
    matchedPayoutId: null,
    source: "midterm",
  });

  return tx;
}

export const bankTransactions = buildBankStatement();

// ============================================================
// BONS À TIRER — 1 par (logement × mois)
// ============================================================
function buildBaList(): BonATirer[] {
  let seq = 1;
  const baItems: BonATirer[] = [];
  properties.forEach((prop) => {
    const propRes = RES.filter((r) => r.propertyId === prop.id && r.status === "confirmed");
    if (propRes.length === 0) return;
    const propPayouts = OTA_PAYOUTS.filter((p) => {
      if (p.platform === "booking") return p.propertyId === prop.id;
      return OTA_TRANSACTIONS.some(
        (t) => t.payoutId === p.id && propRes.some((r) => r.id === t.reservationId)
      );
    });
    const grossReceived = propRes.reduce((a, r) => a + (r.gross - r.otaCommission), 0);
    baItems.push({
      id: `BA-2026-10-${pad(seq, 4)}`,
      number: 20260000 + seq++,
      propertyId: prop.id,
      ownerId: prop.ownerId,
      periodLabel: "Octobre 2026",
      reservationIds: propRes.map((r) => r.id),
      payoutIds: propPayouts.map((p) => p.id),
      grossReceived: Math.round(grossReceived * 100) / 100,
      refunds: 0,
      aircover: 0,
      status: "draft" as BaStatus,
      blockingReasons: [],
    });
  });
  return baItems;
}

export const initialBaList = buildBaList();

// ============================================================
// FACTURES — 1 par (logement × mois) — initialement en draft
// ============================================================
export function buildInitialInvoices(
  baList: BonATirer[],
  cleaningTotalsByProp: Record<string, number>,
  maintenanceTotalsByProp: Record<string, number>,
  miscTotalsByProp: Record<string, number>,
): Invoice[] {
  let seq = 1;
  return baList.map((ba) => {
    const propRes = RES.filter((r) => ba.reservationIds.includes(r.id));
    const noeFee = propRes.reduce((a, r) => a + r.noeFee, 0);
    const netFromBa = propRes.reduce((a, r) => a + (r.gross - r.otaCommission - r.touristTax), 0);
    const cleaning = cleaningTotalsByProp[ba.propertyId] || 0;
    const maintenance = maintenanceTotalsByProp[ba.propertyId] || 0;
    const miscHt = miscTotalsByProp[ba.propertyId] || 0;
    const insurance = 0;
    const vat = (cleaning + maintenance + miscHt + insurance) * 0.20;
    const netOwner = netFromBa - noeFee - cleaning - maintenance - miscHt - insurance - vat;
    return {
      id: `invoice-${ba.propertyId}`,
      number: `FAC-2026-10-${pad(seq++, 4)}`,
      propertyId: ba.propertyId,
      ownerId: ba.ownerId,
      periodLabel: "Octobre 2026",
      baId: ba.id,
      netFromBa: Math.round(netFromBa * 100) / 100,
      feesNoe: Math.round(noeFee * 100) / 100,
      cleaningDebours: Math.round(cleaning * 100) / 100,
      maintenanceDebours: Math.round(maintenance * 100) / 100,
      insurance,
      miscHt: Math.round(miscHt * 100) / 100,
      vat: Math.round(vat * 100) / 100,
      netOwner: Math.round(netOwner * 100) / 100,
      status: "draft",
      blockingReasons: [],
      negativeDecision: null,
    };
  });
}

// ============================================================
// SÉQUESTRE — solde de départ + entrées OTA
// ============================================================
export const escrowOpeningBalance = 12_450.00; // Solde reporté début Octobre

export function buildEscrowEntries(): EscrowMovement[] {
  const m: EscrowMovement[] = [];
  m.push({
    id: "esc-open",
    date: "2026-10-01",
    label: "Solde reporté début de mois",
    amount: escrowOpeningBalance,
    type: "manual",
    ref: null,
  });
  bankTransactions.forEach((bt) => {
    m.push({
      id: `esc-${bt.id}`,
      date: bt.date,
      label: bt.label,
      amount: bt.amount,
      type: bt.source === "direct" || bt.source === "midterm" ? "manual" : "ota_in",
      ref: bt.matchedReference,
    });
  });
  return m.sort((a, b) => a.date.localeCompare(b.date));
}

// ============================================================
// HELPERS
// ============================================================
export function getReservationsForBa(ba: BonATirer): Reservation[] {
  return RES.filter((r) => ba.reservationIds.includes(r.id));
}

export function getPayoutsForBa(ba: BonATirer): OtaPayout[] {
  return OTA_PAYOUTS.filter((p) => ba.payoutIds.includes(p.id));
}

export { owners, properties, getOwnerByProperty, getProperty };
