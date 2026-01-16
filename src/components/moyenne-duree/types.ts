
// Types for Moyenne Durée module

// Mandat Types
export type MandatStatus = "active" | "expired" | "terminated";

export interface Mandat {
  id: string;
  property: string;
  owner: string;
  startDate: string;
  endDate: string;
  status: MandatStatus;
  notes?: string;
}

export interface MandatForm {
  id: string;
  property: string;
  owner: string;
  startDate: string;
  endDate: string;
  notes: string;
}

// Booking Types
export type BookingSource = 
  | "airbnb" 
  | "booking" 
  | "homelike" 
  | "wunderflats" 
  | "direct" 
  | "relocation" 
  | "other";

export type BookingStatus = "upcoming" | "active" | "completed";

export interface CommissionSplit {
  bnbLyon: number; // BNB Lyon's percentage of the total commission (0-100)
  hamac: number;   // Hamac's percentage of the total commission (0-100)
}

export interface Commission {
  total: number;
  bnbLyon: number;
  hamac: number;
}

export interface Booking {
  id: string;
  property: string;
  tenant: string;
  startDate: string;
  endDate: string;
  amount: number;
  cleaningFee: number;
  commissionRate: number;
  commissionSplit: CommissionSplit;
  commission: Commission;
  source: BookingSource;
  monthlyPayment: boolean;
  payments?: Payment[];
  status: BookingStatus;
}

export interface BookingForm {
  id: string;
  property: string;
  tenant: string;
  startDate: string;
  endDate: string;
  amount: string;
  cleaningFee: string;
  commissionRate: string;
  bnbLyonSplit: string;
  hamacSplit: string;
  source: string;
  monthlyPayment: boolean;
  paymentDay: string;
}

// Payment Types
export type PaymentStatus = "pending" | "paid" | "overdue";

export interface Payment {
  id: string;
  dueDate: string;
  amount: number;
  status: PaymentStatus;
  paymentDate?: string;
}

// Interface for commission split info display
export interface CommissionSplitInfo {
  label: string;
  color: string;
}

// Interface for status info methods
export interface StatusInfo<T extends string> {
  getColor: (status: T) => string;
  getLabel: (status: T) => string;
}

// Form Options
export interface SelectOption {
  value: string;
  label: string;
}

// ============= RENT DOCUMENTS & LEASES =============

// Rental Type - for eligibility
export type RentalType = "midterm" | "shortterm";

// Document Status
export type DocumentStatus = "draft" | "generated" | "sent" | "paid";

// Rent Call (Appel de loyer)
export interface RentCall {
  id: string;
  bookingId: string;
  month: string; // Format: YYYY-MM
  amount: number;
  dueDate: string;
  status: DocumentStatus;
  generatedAt?: string;
  sentAt?: string;
  paidAt?: string;
  pdfUrl?: string;
  notes?: string;
}

// Rent Receipt (Quittance)
export interface RentReceipt {
  id: string;
  bookingId: string;
  rentCallId: string;
  month: string; // Format: YYYY-MM
  amount: number;
  paymentDate: string;
  status: DocumentStatus;
  generatedAt?: string;
  sentAt?: string;
  pdfUrl?: string;
  notes?: string;
}

// Lease Template Variables
export interface LeaseTemplateVariable {
  key: string;
  label: string;
  source: "booking" | "property" | "tenant" | "custom";
}

// Lease Template
export type LeaseTemplateType = "furnished" | "mobility" | "classic" | "seasonal" | "custom";

export interface LeaseTemplate {
  id: string;
  name: string;
  type: LeaseTemplateType;
  content: string; // Rich text with placeholders like {{tenant_name}}, {{property_address}}
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
}

// Lease Version
export interface LeaseVersion {
  id: string;
  version: number;
  content: string;
  createdAt: string;
  createdBy: string;
  notes?: string;
}

// Lease Signature Status
export type LeaseSignatureStatus = "not_sent" | "sent" | "signed";

// Lease Contract
export interface Lease {
  id: string;
  bookingId: string;
  templateId: string;
  templateName: string;
  content: string;
  versions: LeaseVersion[];
  currentVersion: number;
  signatureStatus: LeaseSignatureStatus;
  signedPdfUrl?: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "finalized" | "signed";
}

// Extended Booking with rental documents
export interface ExtendedBooking extends Booking {
  rentalType: RentalType;
  enableRentDocuments: boolean; // For short-term, user can toggle this
  rentCalls?: RentCall[];
  rentReceipts?: RentReceipt[];
  lease?: Lease;
}

// Document Generation Request
export interface RentCallGenerationRequest {
  bookingId: string;
  month: string;
  amount: number;
  dueDate: string;
  customSchedule?: boolean;
}

// Timeline Entry for document history
export type TimelineEntryType = "rent_call_created" | "rent_call_sent" | "rent_call_paid" | 
  "receipt_created" | "receipt_sent" | "lease_created" | "lease_updated" | "lease_sent" | "lease_signed";

export interface TimelineEntry {
  id: string;
  bookingId: string;
  type: TimelineEntryType;
  date: string;
  description: string;
  documentId?: string;
  metadata?: Record<string, any>;
}

// Lease Template Placeholders
export const LEASE_TEMPLATE_VARIABLES: LeaseTemplateVariable[] = [
  // Tenant info
  { key: "tenant_name", label: "Nom du locataire", source: "tenant" },
  { key: "tenant_email", label: "Email du locataire", source: "tenant" },
  { key: "tenant_phone", label: "Téléphone du locataire", source: "tenant" },
  
  // Property info
  { key: "property_name", label: "Nom du logement", source: "property" },
  { key: "property_address", label: "Adresse du logement", source: "property" },
  { key: "property_type", label: "Type de logement", source: "property" },
  { key: "property_surface", label: "Surface", source: "property" },
  
  // Booking info
  { key: "start_date", label: "Date de début", source: "booking" },
  { key: "end_date", label: "Date de fin", source: "booking" },
  { key: "rent_amount", label: "Montant du loyer", source: "booking" },
  { key: "deposit_amount", label: "Dépôt de garantie", source: "booking" },
  { key: "cleaning_fee", label: "Frais de ménage", source: "booking" },
  
  // Custom
  { key: "custom_clause", label: "Clause personnalisée", source: "custom" },
  { key: "house_rules", label: "Règlement intérieur", source: "custom" },
];
