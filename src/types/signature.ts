
export type SignatureZoneType = 'signature' | 'initials' | 'date' | 'text';
export type SignatureRole = 'owner' | 'conciergerie';
export type SignatureSessionStatus = 'draft' | 'sent' | 'viewed' | 'signed' | 'expired';

export interface SignatureTemplate {
  id: string;
  name: string;
  description?: string;
  documentUrl?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  zones: SignatureZone[];
}

export interface SignatureZone {
  id: string;
  templateId: string;
  zoneType: SignatureZoneType;
  label: string;
  role: SignatureRole;
  pageNumber: number;
  xPosition: number;
  yPosition: number;
  width: number;
  height: number;
  isRequired: boolean;
  fieldKey?: string;
  sortOrder: number;
}

export interface SignatureSession {
  id: string;
  templateId: string;
  onboardingProcessId?: string;
  token: string;
  status: SignatureSessionStatus;
  ownerName?: string;
  ownerEmail?: string;
  propertyAddress?: string;
  commissionRate?: number;
  fieldValues: Record<string, string>;
  signedDocumentUrl?: string;
  sentAt?: string;
  viewedAt?: string;
  signedAt?: string;
  expiresAt?: string;
  signerIp?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SignatureEvent {
  id: string;
  sessionId: string;
  eventType: string;
  actor?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface SignatureZoneData {
  id: string;
  sessionId: string;
  zoneId: string;
  value?: string;
  completedAt?: string;
  signerIp?: string;
}

export const ZONE_TYPE_CONFIG: Record<SignatureZoneType, { label: string; icon: string; color: string }> = {
  signature: { label: 'Signature', icon: 'PenTool', color: 'text-primary' },
  initials: { label: 'Initiales', icon: 'Type', color: 'text-blue-500' },
  date: { label: 'Date', icon: 'Calendar', color: 'text-amber-500' },
  text: { label: 'Texte', icon: 'AlignLeft', color: 'text-emerald-500' },
};

export const SESSION_STATUS_CONFIG: Record<SignatureSessionStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: 'Non envoyé', color: 'text-muted-foreground', bgColor: 'bg-muted' },
  sent: { label: 'Envoyé', color: 'text-blue-600', bgColor: 'bg-blue-500/10' },
  viewed: { label: 'Vu', color: 'text-amber-600', bgColor: 'bg-amber-500/10' },
  signed: { label: 'Signé', color: 'text-emerald-600', bgColor: 'bg-emerald-500/10' },
  expired: { label: 'Expiré', color: 'text-red-600', bgColor: 'bg-red-500/10' },
};

export const FIELD_KEY_OPTIONS = [
  { key: 'owner_name', label: 'Nom du propriétaire' },
  { key: 'owner_address', label: 'Adresse du propriétaire' },
  { key: 'property_address', label: 'Adresse du bien' },
  { key: 'commission_rate', label: 'Taux de commission' },
  { key: 'iban', label: 'IBAN' },
  { key: 'bic', label: 'BIC' },
  { key: 'start_date', label: 'Date de début' },
  { key: 'duration', label: 'Durée du mandat' },
];
