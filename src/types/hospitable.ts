
export interface HospitableCredentials {
  apiKey: string;
  accountId: string;
}

export interface HospitableProperty {
  id: number;
  name: string;
  bedrooms_count: number;
  bathrooms_count: number;
  surface: number;
  surface_unit: string;
  address?: {
    city?: string;
    country_code?: string;
    street?: string;
    zip?: string;
  };
}

export interface HospitableReservation {
  id: number;
  check_in: string;
  check_out: string;
  status: string;
  guest_id: number;
  property_id: number;
  amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface HospitableGuest {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface HospitableTransaction {
  id: number;
  reservation_id: number;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export interface HospitableImportResult {
  reservations: HospitableReservation[];
  properties: HospitableProperty[];
  guests: HospitableGuest[];
  transactions: HospitableTransaction[];
}
