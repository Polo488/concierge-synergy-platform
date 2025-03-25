
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
