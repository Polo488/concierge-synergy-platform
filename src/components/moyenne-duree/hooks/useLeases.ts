
import { useState } from "react";
import { format } from "date-fns";
import {
  Lease,
  LeaseTemplate,
  LeaseTemplateType,
  LeaseVersion,
  LeaseSignatureStatus,
  LEASE_TEMPLATE_VARIABLES,
} from "../types";

// Mock lease templates
const mockLeaseTemplates: LeaseTemplate[] = [
  {
    id: "TPL-001",
    name: "Bail meublé standard",
    type: "furnished",
    content: `CONTRAT DE LOCATION MEUBLÉE

Entre les soussignés :

LE BAILLEUR : BNB Lyon
Adresse : [Adresse du bailleur]

ET

LE LOCATAIRE : {{tenant_name}}
Email : {{tenant_email}}
Téléphone : {{tenant_phone}}

Il a été convenu ce qui suit :

ARTICLE 1 - DÉSIGNATION DU BIEN
Le présent contrat a pour objet la location du logement suivant :
Désignation : {{property_name}}
Adresse : {{property_address}}
Type : {{property_type}}
Surface : {{property_surface}} m²

ARTICLE 2 - DURÉE DU BAIL
Le présent bail est consenti pour une durée déterminée du {{start_date}} au {{end_date}}.

ARTICLE 3 - LOYER ET CHARGES
Le loyer mensuel est fixé à {{rent_amount}} €.
Les charges sont comprises dans le loyer.
Frais de ménage de fin de séjour : {{cleaning_fee}} €

ARTICLE 4 - DÉPÔT DE GARANTIE
Un dépôt de garantie de {{deposit_amount}} € est versé à la signature du bail.

ARTICLE 5 - RÈGLEMENT INTÉRIEUR
{{house_rules}}

{{custom_clause}}

Fait à Lyon, le [Date de signature]

Le Bailleur                                    Le Locataire
Signature                                      Signature`,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    isDefault: true,
  },
  {
    id: "TPL-002",
    name: "Bail mobilité",
    type: "mobility",
    content: `CONTRAT DE LOCATION MOBILITÉ

Le présent bail est consenti en application de l'article 25-12 de la loi n°89-462 du 6 juillet 1989.

BAILLEUR : BNB Lyon

LOCATAIRE : {{tenant_name}}
Email : {{tenant_email}}

LOGEMENT :
{{property_name}}
{{property_address}}

DURÉE : Du {{start_date}} au {{end_date}}
LOYER MENSUEL : {{rent_amount}} €
FRAIS DE MÉNAGE : {{cleaning_fee}} €

Ce bail est soumis aux dispositions spécifiques du bail mobilité :
- Durée de 1 à 10 mois non renouvelable
- Aucun dépôt de garantie exigible
- Locataire éligible : formation, études, stage, mutation, mission temporaire

{{custom_clause}}

Signatures :`,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    isDefault: false,
  },
  {
    id: "TPL-003",
    name: "Bail classique non meublé",
    type: "classic",
    content: `CONTRAT DE LOCATION

BAILLEUR : BNB Lyon

LOCATAIRE : {{tenant_name}}

LOGEMENT : {{property_name}} - {{property_address}}

DURÉE : Du {{start_date}} au {{end_date}}
LOYER : {{rent_amount}} €/mois

DÉPÔT DE GARANTIE : {{deposit_amount}} €

{{custom_clause}}

Fait le [Date]

Signatures :`,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    isDefault: false,
  },
];

// Mock leases
const mockLeases: Lease[] = [
  {
    id: "LEASE-001",
    bookingId: "MD-2023-002",
    templateId: "TPL-001",
    templateName: "Bail meublé standard",
    content: `CONTRAT DE LOCATION MEUBLÉE

Entre les soussignés :

LE BAILLEUR : BNB Lyon

ET

LE LOCATAIRE : Lucas Martin
Email : lucas.martin@email.com
Téléphone : 06 12 34 56 78

ARTICLE 1 - DÉSIGNATION DU BIEN
Le présent contrat a pour objet la location du logement suivant :
Désignation : Studio Part-Dieu
Adresse : 15 Rue de la Part-Dieu, 69003 Lyon
Type : Studio
Surface : 25 m²

ARTICLE 2 - DURÉE DU BAIL
Le présent bail est consenti pour une durée déterminée du 01/11/2023 au 31/01/2024.

ARTICLE 3 - LOYER ET CHARGES
Le loyer mensuel est fixé à 800 €.
Les charges sont comprises dans le loyer.
Frais de ménage de fin de séjour : 120 €

ARTICLE 4 - DÉPÔT DE GARANTIE
Un dépôt de garantie de 800 € est versé à la signature du bail.

Fait à Lyon, le 25/10/2023`,
    versions: [
      {
        id: "V-001",
        version: 1,
        content: "Version initiale du bail",
        createdAt: "2023-10-25",
        createdBy: "Admin",
      },
    ],
    currentVersion: 1,
    signatureStatus: "signed",
    createdAt: "2023-10-25",
    updatedAt: "2023-10-25",
    status: "signed",
  },
];

// Hook for managing lease templates
export const useLeaseTemplates = () => {
  const [templates, setTemplates] = useState<LeaseTemplate[]>(mockLeaseTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<LeaseTemplate | null>(null);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const getTemplateById = (id: string) => {
    return templates.find((t) => t.id === id);
  };

  const getDefaultTemplate = () => {
    return templates.find((t) => t.isDefault) || templates[0];
  };

  const createTemplate = (template: Omit<LeaseTemplate, "id" | "createdAt" | "updatedAt">) => {
    const newTemplate: LeaseTemplate = {
      ...template,
      id: `TPL-${Date.now()}`,
      createdAt: format(new Date(), "yyyy-MM-dd"),
      updatedAt: format(new Date(), "yyyy-MM-dd"),
    };
    setTemplates((prev) => [...prev, newTemplate]);
    return newTemplate;
  };

  const updateTemplate = (id: string, updates: Partial<LeaseTemplate>) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, ...updates, updatedAt: format(new Date(), "yyyy-MM-dd") }
          : t
      )
    );
  };

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const setDefaultTemplate = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => ({
        ...t,
        isDefault: t.id === id,
      }))
    );
  };

  return {
    templates,
    selectedTemplate,
    setSelectedTemplate,
    templateDialogOpen,
    setTemplateDialogOpen,
    isEditing,
    setIsEditing,
    getTemplateById,
    getDefaultTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    setDefaultTemplate,
  };
};

// Hook for managing leases
export const useLeases = () => {
  const [leases, setLeases] = useState<Lease[]>(mockLeases);
  const [selectedLease, setSelectedLease] = useState<Lease | null>(null);
  const [leaseDialogOpen, setLeaseDialogOpen] = useState(false);
  const [leaseEditorOpen, setLeaseEditorOpen] = useState(false);

  const getLeaseForBooking = (bookingId: string) => {
    return leases.find((l) => l.bookingId === bookingId);
  };

  const createLeaseFromTemplate = (
    bookingId: string,
    template: LeaseTemplate,
    variables: Record<string, string>
  ): Lease => {
    // Replace template variables with actual values
    let content = template.content;
    Object.entries(variables).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{{${key}}}`, "g"), value);
    });

    const now = format(new Date(), "yyyy-MM-dd");
    const newLease: Lease = {
      id: `LEASE-${Date.now()}`,
      bookingId,
      templateId: template.id,
      templateName: template.name,
      content,
      versions: [
        {
          id: `V-${Date.now()}`,
          version: 1,
          content,
          createdAt: now,
          createdBy: "Admin",
          notes: "Version initiale créée à partir du modèle",
        },
      ],
      currentVersion: 1,
      signatureStatus: "not_sent",
      createdAt: now,
      updatedAt: now,
      status: "draft",
    };

    setLeases((prev) => [...prev, newLease]);
    return newLease;
  };

  const updateLeaseContent = (leaseId: string, newContent: string, notes?: string) => {
    setLeases((prev) =>
      prev.map((l) => {
        if (l.id === leaseId) {
          const newVersion: LeaseVersion = {
            id: `V-${Date.now()}`,
            version: l.currentVersion + 1,
            content: newContent,
            createdAt: format(new Date(), "yyyy-MM-dd"),
            createdBy: "Admin",
            notes,
          };

          return {
            ...l,
            content: newContent,
            versions: [...l.versions, newVersion],
            currentVersion: l.currentVersion + 1,
            updatedAt: format(new Date(), "yyyy-MM-dd"),
          };
        }
        return l;
      })
    );
  };

  const updateSignatureStatus = (leaseId: string, status: LeaseSignatureStatus) => {
    setLeases((prev) =>
      prev.map((l) =>
        l.id === leaseId
          ? {
              ...l,
              signatureStatus: status,
              status: status === "signed" ? "signed" : l.status,
              updatedAt: format(new Date(), "yyyy-MM-dd"),
            }
          : l
      )
    );
  };

  const finalizeLease = (leaseId: string) => {
    setLeases((prev) =>
      prev.map((l) =>
        l.id === leaseId
          ? {
              ...l,
              status: "finalized",
              updatedAt: format(new Date(), "yyyy-MM-dd"),
            }
          : l
      )
    );
  };

  const uploadSignedPdf = (leaseId: string, pdfUrl: string) => {
    setLeases((prev) =>
      prev.map((l) =>
        l.id === leaseId
          ? {
              ...l,
              signedPdfUrl: pdfUrl,
              signatureStatus: "signed",
              status: "signed",
              updatedAt: format(new Date(), "yyyy-MM-dd"),
            }
          : l
      )
    );
  };

  const deleteLease = (leaseId: string) => {
    setLeases((prev) => prev.filter((l) => l.id !== leaseId));
  };

  const restoreVersion = (leaseId: string, versionNumber: number) => {
    setLeases((prev) =>
      prev.map((l) => {
        if (l.id === leaseId) {
          const version = l.versions.find((v) => v.version === versionNumber);
          if (version) {
            return {
              ...l,
              content: version.content,
              currentVersion: versionNumber,
              updatedAt: format(new Date(), "yyyy-MM-dd"),
            };
          }
        }
        return l;
      })
    );
  };

  return {
    leases,
    selectedLease,
    setSelectedLease,
    leaseDialogOpen,
    setLeaseDialogOpen,
    leaseEditorOpen,
    setLeaseEditorOpen,
    getLeaseForBooking,
    createLeaseFromTemplate,
    updateLeaseContent,
    updateSignatureStatus,
    finalizeLease,
    uploadSignedPdf,
    deleteLease,
    restoreVersion,
  };
};

// Get lease template type label
export const getLeaseTypeLabel = (type: LeaseTemplateType): string => {
  switch (type) {
    case "furnished":
      return "Meublé";
    case "mobility":
      return "Mobilité";
    case "classic":
      return "Classique";
    case "seasonal":
      return "Saisonnier";
    case "custom":
      return "Personnalisé";
    default:
      return type;
  }
};

// Get signature status info
export const getSignatureStatusInfo = (status: LeaseSignatureStatus) => {
  switch (status) {
    case "not_sent":
      return { label: "Non envoyé", color: "bg-gray-100 text-gray-800" };
    case "sent":
      return { label: "Envoyé", color: "bg-yellow-100 text-yellow-800" };
    case "signed":
      return { label: "Signé", color: "bg-green-100 text-green-800" };
    default:
      return { label: status, color: "bg-gray-100 text-gray-800" };
  }
};

// Get lease status info
export const getLeaseStatusInfo = (status: Lease["status"]) => {
  switch (status) {
    case "draft":
      return { label: "Brouillon", color: "bg-gray-100 text-gray-800" };
    case "finalized":
      return { label: "Finalisé", color: "bg-blue-100 text-blue-800" };
    case "signed":
      return { label: "Signé", color: "bg-green-100 text-green-800" };
    default:
      return { label: status, color: "bg-gray-100 text-gray-800" };
  }
};

// Utility to get template variables from data
export const getTemplateVariables = (booking: any, property?: any): Record<string, string> => {
  return {
    tenant_name: booking.tenant || "",
    tenant_email: booking.tenantEmail || "",
    tenant_phone: booking.tenantPhone || "",
    property_name: booking.property || "",
    property_address: property?.address || "[Adresse à compléter]",
    property_type: property?.type || "[Type à compléter]",
    property_surface: property?.surface?.toString() || "[Surface à compléter]",
    start_date: booking.startDate || "",
    end_date: booking.endDate || "",
    rent_amount: booking.amount?.toString() || "",
    deposit_amount: (booking.amount || 0).toString(),
    cleaning_fee: booking.cleaningFee?.toString() || "0",
    custom_clause: "",
    house_rules: "",
  };
};
