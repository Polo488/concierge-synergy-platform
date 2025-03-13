
export interface BookingSyncCredentials {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface BookingSyncRental {
  id: number;
  name: string;
  description?: string;
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

export interface BookingSyncBooking {
  id: number;
  start_at: string;
  end_at: string;
  status: 'Booked' | 'Canceled' | 'Tentative' | 'Unavailable';
  client_id: number;
  rental_id: number;
  price_cents: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface BookingSyncClient {
  id: number;
  firstname: string;
  lastname: string;
  email?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface BookingSyncPayment {
  id: number;
  booking_id: number;
  amount_cents: number;
  currency: string;
  status: 'Pending' | 'Authorized' | 'Captured' | 'Refunded' | 'Rejected';
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export interface BookingSyncImportResult {
  bookings: BookingSyncBooking[];
  rentals: BookingSyncRental[];
  clients: BookingSyncClient[];
  payments: BookingSyncPayment[];
}
