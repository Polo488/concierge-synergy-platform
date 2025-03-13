export interface HospitableCredentials {
  accessToken: string;
  accountId?: string; // ID de compte facultatif
}

export interface HospitableProperty {
  id?: number;      // Conservé pour rétrocompatibilité
  uuid: string;     // Nouveau: UUID au lieu d'ID numérique
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
  created_at?: string;
  updated_at?: string;
  listings?: {     // Nouveau: informations des listings associés
    platform: string;
    platform_id: string;
    platform_name?: string;
    platform_email?: string;
  }[];
}

export interface HospitableReservation {
  id?: number;     // Conservé pour rétrocompatibilité
  uuid: string;    // Nouveau: UUID comme identifiant principal
  arrival_date: string;   // Renommé depuis check_in
  departure_date: string; // Renommé depuis check_out
  check_in?: string;      // Heure complète d'arrivée
  check_out?: string;     // Heure complète de départ
  reservation_status: {
    current: string;
  };
  guest_id: number;
  property_id?: number;   // Conservé pour rétrocompatibilité
  property_uuid: string;  // Nouveau: UUID de la propriété
  platform: string;       // Renommé depuis channel
  platform_id: string;    // Renommé depuis code ou channel_id
  nights: number;
  created: string;        // Renommé depuis created_at
  updated_at?: string;
  guests: {
    total: number;
    adult_count: number;
    children_count: number;
    infants_count: number;
    pet_count?: number;
  };
  financials: {
    currency: string;
    guest: {
      accommodation: number;
      total_price: number;
    };
    host: {
      guest_fees: number;
      host_fees: number;
      taxes: number;
      revenue: number;
    };
  };
}

export interface HospitableGuest {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone_numbers?: string[];  // Changé en tableau selon la doc
  created_at: string;
  updated_at: string;
  notes?: string;
  country_code?: string;
  profile_picture?: string;  // Renommé depuis picture_url
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
  description?: string;
  paid_at?: string;
}

export interface HospitablePagination {
  page?: number;
  per_page?: number;
  total?: number;
}

export interface HospitableImportResult {
  reservations: HospitableReservation[];
  properties: HospitableProperty[];
  guests: HospitableGuest[];
  transactions: HospitableTransaction[];
  pagination?: {
    current_page: number;
    total_pages: number;
    per_page: number;
    total: number;
    next_page?: number;
  };
}

// Pagination response selon la documentation V2
export interface HospitablePaginatedResponse<T> {
  data: T[];
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
      links?: {
        next?: string;
      };
    };
  };
  links?: {
    self?: string;
    first?: string;
    prev?: string;
    next?: string;
    last?: string;
  };
}
