
import { 
  HospitableCredentials,
  HospitableProperty,
  HospitableReservation,
  HospitableGuest,
  HospitableTransaction,
  HospitableImportResult
} from '@/types/hospitable';

const API_BASE_URL = 'https://api.hospitable.com/v1';

class HospitableService {
  private credentials: HospitableCredentials | null = null;

  setCredentials(credentials: HospitableCredentials) {
    this.credentials = credentials;
    console.log('Hospitable credentials set:', credentials);
  }

  getCredentials(): HospitableCredentials | null {
    return this.credentials;
  }

  isAuthenticated(): boolean {
    return !!this.credentials?.apiKey;
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Hospitable');
    }

    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${this.credentials?.apiKey}`);
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');

    // Ajouter l'account ID comme paramètre de requête
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (this.credentials?.accountId) {
      url.searchParams.append('account_id', this.credentials.accountId);
    }

    return fetch(url.toString(), {
      ...options,
      headers
    });
  }

  // Vérifier les identifiants
  async verifyCredentials(): Promise<boolean> {
    // Simulation pour le développement
    if (import.meta.env.DEV) {
      console.log('DEV: Simulating Hospitable credentials verification');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    }

    try {
      const response = await this.fetchWithAuth('/account');
      return response.ok;
    } catch (error) {
      console.error('Error verifying Hospitable credentials:', error);
      return false;
    }
  }

  // Récupérer les propriétés
  async fetchProperties(): Promise<HospitableProperty[]> {
    // Pour la simulation, retourner des données fictives
    if (import.meta.env.DEV) {
      console.log('DEV: Simulating properties fetch');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return [
        {
          id: 1,
          name: 'Appartement Hospitable Lyon 1',
          bedrooms_count: 2,
          bathrooms_count: 1,
          surface: 65,
          surface_unit: 'm²',
          address: {
            city: 'Lyon',
            country_code: 'FR',
            street: '10 Rue de la République',
            zip: '69001'
          }
        },
        {
          id: 2,
          name: 'Studio Hospitable Lyon 2',
          bedrooms_count: 1,
          bathrooms_count: 1,
          surface: 30,
          surface_unit: 'm²',
          address: {
            city: 'Lyon',
            country_code: 'FR',
            street: '5 Place Bellecour',
            zip: '69002'
          }
        }
      ];
    }

    // Code pour l'implémentation réelle
    const response = await this.fetchWithAuth('/properties');
    if (!response.ok) {
      throw new Error(`Failed to fetch properties: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.properties.map((property: any) => ({
      id: property.id,
      name: property.name,
      bedrooms_count: property.bedroom_count || 0,
      bathrooms_count: property.bathroom_count || 0,
      surface: property.square_feet || 0,
      surface_unit: 'm²',
      address: {
        city: property.city,
        country_code: property.country_code,
        street: property.address,
        zip: property.zipcode
      }
    }));
  }

  // Récupérer les réservations
  async fetchReservations(params?: { startDate?: Date; endDate?: Date }): Promise<HospitableReservation[]> {
    // Pour la simulation, retourner des données fictives
    if (import.meta.env.DEV) {
      console.log('DEV: Simulating reservations fetch');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return [
        {
          id: 101,
          check_in: '2023-11-15T14:00:00Z',
          check_out: '2023-11-20T10:00:00Z',
          status: 'confirmed',
          guest_id: 201,
          property_id: 1,
          amount: 850,
          currency: 'EUR',
          created_at: '2023-10-05T09:23:45Z',
          updated_at: '2023-10-05T09:23:45Z'
        },
        {
          id: 102,
          check_in: '2023-12-01T15:00:00Z',
          check_out: '2023-12-08T11:00:00Z',
          status: 'confirmed',
          guest_id: 202,
          property_id: 2,
          amount: 630,
          currency: 'EUR',
          created_at: '2023-11-10T14:30:12Z',
          updated_at: '2023-11-10T14:30:12Z'
        }
      ];
    }

    // Code pour l'implémentation réelle
    let endpoint = '/reservations';
    if (params) {
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('start_date', params.startDate.toISOString().split('T')[0]);
      if (params.endDate) queryParams.append('end_date', params.endDate.toISOString().split('T')[0]);
      if (queryParams.toString()) {
        endpoint += `?${queryParams.toString()}`;
      }
    }
    
    const response = await this.fetchWithAuth(endpoint);
    if (!response.ok) {
      throw new Error(`Failed to fetch reservations: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.reservations.map((reservation: any) => ({
      id: reservation.id,
      check_in: reservation.check_in,
      check_out: reservation.check_out,
      status: reservation.status,
      guest_id: reservation.guest_id,
      property_id: reservation.property_id,
      amount: reservation.total_amount,
      currency: reservation.currency || 'EUR',
      created_at: reservation.created_at,
      updated_at: reservation.updated_at
    }));
  }

  // Récupérer les invités
  async fetchGuests(): Promise<HospitableGuest[]> {
    // Pour la simulation, retourner des données fictives
    if (import.meta.env.DEV) {
      console.log('DEV: Simulating guests fetch');
      await new Promise(resolve => setTimeout(resolve, 700));
      
      return [
        {
          id: 201,
          first_name: 'Thomas',
          last_name: 'Martin',
          email: 'thomas.martin@example.com',
          phone: '+33612345678',
          created_at: '2023-09-15T08:30:00Z',
          updated_at: '2023-09-15T08:30:00Z'
        },
        {
          id: 202,
          first_name: 'Sophie',
          last_name: 'Dubois',
          email: 'sophie.dubois@example.com',
          phone: '+33687654321',
          created_at: '2023-10-20T14:45:00Z',
          updated_at: '2023-10-20T14:45:00Z'
        }
      ];
    }

    // Code pour l'implémentation réelle
    const response = await this.fetchWithAuth('/guests');
    if (!response.ok) {
      throw new Error(`Failed to fetch guests: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.guests.map((guest: any) => ({
      id: guest.id,
      first_name: guest.first_name,
      last_name: guest.last_name,
      email: guest.email,
      phone: guest.phone,
      created_at: guest.created_at,
      updated_at: guest.updated_at
    }));
  }

  // Récupérer les transactions
  async fetchTransactions(): Promise<HospitableTransaction[]> {
    // Pour la simulation, retourner des données fictives
    if (import.meta.env.DEV) {
      console.log('DEV: Simulating transactions fetch');
      await new Promise(resolve => setTimeout(resolve, 900));
      
      return [
        {
          id: 301,
          reservation_id: 101,
          amount: 425,
          currency: 'EUR',
          status: 'completed',
          payment_method: 'credit_card',
          created_at: '2023-10-05T09:25:00Z',
          updated_at: '2023-10-05T09:30:00Z'
        },
        {
          id: 302,
          reservation_id: 101,
          amount: 425,
          currency: 'EUR',
          status: 'completed',
          payment_method: 'bank_transfer',
          created_at: '2023-11-10T10:15:00Z',
          updated_at: '2023-11-10T10:20:00Z'
        }
      ];
    }

    // Code pour l'implémentation réelle
    const response = await this.fetchWithAuth('/transactions');
    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.transactions.map((transaction: any) => ({
      id: transaction.id,
      reservation_id: transaction.reservation_id,
      amount: transaction.amount,
      currency: transaction.currency || 'EUR',
      status: transaction.status,
      payment_method: transaction.payment_method,
      created_at: transaction.created_at,
      updated_at: transaction.updated_at
    }));
  }

  // Importer toutes les données en une fois
  async importAll(params?: { startDate?: Date; endDate?: Date }): Promise<HospitableImportResult> {
    try {
      console.log('Importing all data from Hospitable...');
      
      const properties = await this.fetchProperties();
      const reservations = await this.fetchReservations(params);
      const guests = await this.fetchGuests();
      const transactions = await this.fetchTransactions();
      
      console.log('Import completed successfully');
      
      return {
        reservations,
        properties,
        guests,
        transactions
      };
    } catch (error) {
      console.error('Error importing data from Hospitable:', error);
      throw error;
    }
  }
}

export const hospitable = new HospitableService();
