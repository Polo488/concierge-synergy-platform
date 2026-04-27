/**
 * Catalogue centralisé des libellés de toasts.
 *
 * Objectif : garantir des messages cohérents (ton, structure, vocabulaire)
 * à travers TOUS les modules de l'app (Entrepôt, Maintenance, Ménage,
 * Logements, Facturation, etc.).
 *
 * Convention :
 *  - Phrases courtes, sujet d'abord, à l'infinitif ou participe passé.
 *  - Pas de point final.
 *  - Capitaliser uniquement le 1er mot.
 *  - description (optionnelle) = détail secondaire.
 *
 * Variantes :
 *  - success → action validée par le backend / état modifié
 *  - error   → action refusée, validation échouée, exception
 *  - info    → information neutre, pas d'action effectuée
 *  - warning → action partielle ou attention requise
 *
 * Usage :
 *   import { toast } from "@/lib/toast";
 *   import { TOAST_MESSAGES as M } from "@/lib/toastMessages";
 *   toast.success(M.inventory.stockUpdated(5, true));
 *   toast.error(M.common.invalidQuantity);
 */

export const TOAST_MESSAGES = {
  // ───────────────────────── Communs ─────────────────────────
  common: {
    saved: "Modifications enregistrées",
    created: (entity: string) => `${entity} créé·e`,
    updated: (entity: string) => `${entity} mis·e à jour`,
    deleted: (entity: string) => `${entity} supprimé·e`,
    duplicated: (entity: string) => `${entity} dupliqué·e`,
    sent: "Envoyé",
    copied: "Copié dans le presse-papiers",

    invalidQuantity: "Quantité invalide",
    invalidName: "Nom requis",
    requiredField: (field: string) => `${field} requis`,
    networkError: "Connexion impossible",
    genericError: "Une erreur est survenue",
    notFound: (entity: string) => `${entity} introuvable`,

    comingSoon: "Bientôt disponible",
    notAvailable: "Fonctionnalité disponible au lancement",
  },

  // ───────────────────────── Entrepôt ─────────────────────────
  inventory: {
    stockUpdated: (amount: number, increased: boolean) =>
      `Stock ${increased ? "augmenté" : "diminué"} de ${amount} unité${amount > 1 ? "s" : ""}`,
    itemAdded: (name: string) => `Article « ${name} » ajouté`,
    itemRemoved: (name: string) => `Article « ${name} » supprimé`,
    orderLinkUpdated: "Lien de commande mis à jour",
    orderLinkMissing:
      "Aucun lien de commande configuré. Cliquez sur « Gérer » pour en ajouter un.",
    lowStockWarning: (name: string) => `Stock bas pour « ${name} »`,
  },

  // ───────────────────────── Maintenance ─────────────────────────
  maintenance: {
    interventionCreated: "Intervention créée",
    interventionScheduled: (date: string) =>
      `Intervention créée et programmée pour le ${date}`,
    interventionAssigned: (technician: string, date?: string) =>
      `Intervention assignée à ${technician}${date ? ` pour le ${date}` : ""}`,
    interventionCompleted: "Intervention terminée",
    interventionCancelled: "Intervention annulée",
    technicianRequired: "Veuillez sélectionner un technicien",
    exportStarted: "Export lancé",
    exportStartedDesc: "Le fichier CSV des interventions a été téléchargé",
    calendarSynced: "Calendrier synchronisé",
    calendarSyncedDesc: "Les interventions ont été synchronisées avec le calendrier",
  },

  // ───────────────────────── Ménage ─────────────────────────
  cleaning: {
    issueReported: "Problème ménage signalé",
    issueResolved: "Problème résolu",
    repassScheduled: "Repasse planifiée",
    cleaningCompleted: "Ménage terminé",
    cleaningAssigned: (agent: string) => `Ménage assigné à ${agent}`,
    cleaningCancelled: "Ménage annulé",
  },

  // ───────────────────────── Logements ─────────────────────────
  properties: {
    created: "Logement créé",
    updated: "Logement mis à jour",
    deleted: "Logement supprimé",
    duplicated: "Logement dupliqué",
    detailsSaved: "Détails du logement enregistrés",
    bannerUpdated: "Note d'en-tête mise à jour",
    accessInfoSaved: "Informations d'accès enregistrées",
  },

  // ───────────────────────── Facturation ─────────────────────────
  billing: {
    importSuccess: (count: number, source = "réservations") =>
      `Import réussi : ${count} ${source} importée${count > 1 ? "s" : ""}`,
    importPartial: (count: number) =>
      `${count} entrée${count > 1 ? "s" : ""} non assignée${count > 1 ? "s" : ""}, vérifiez l'onglet Contrôle`,
    importError: (msg?: string) =>
      msg ? `Erreur lors de l'import : ${msg}` : "Une erreur est survenue lors de l'import",
    datesRequired: "Veuillez spécifier les dates de début et de fin",
    invoiceGenerated: "Facture générée",
    invoiceSent: "Facture envoyée",
    paymentRecorded: "Paiement enregistré",
  },
} as const;

export default TOAST_MESSAGES;
