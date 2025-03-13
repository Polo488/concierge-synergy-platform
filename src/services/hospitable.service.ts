
import { 
  HospitableCredentials,
  HospitableProperty,
  HospitableReservation,
  HospitableGuest,
  HospitableTransaction,
  HospitableImportResult,
  HospitablePaginatedResponse
} from '@/types/hospitable';

// URL de base de l'API selon la documentation officielle (v2)
const API_BASE_URL = 'https://public.api.hospitable.com/v2';

class HospitableService {
  private credentials: HospitableCredentials | null = null;

  setCredentials(credentials: HospitableCredentials) {
    this.credentials = credentials;
    console.log('Hospitable credentials set:', credentials);
    
    // Stocker les identifiants dans sessionStorage pour persister entre les rechargements
    try {
      sessionStorage.setItem('hospitableCredentials', JSON.stringify(credentials));
    } catch (error) {
      console.error('Error storing Hospitable credentials:', error);
    }
  }

  getCredentials(): HospitableCredentials | null {
    // Si les identifiants ne sont pas en mémoire, essayer de les récupérer du sessionStorage
    if (!this.credentials) {
      try {
        const storedCredentials = sessionStorage.getItem('hospitableCredentials');
        if (storedCredentials) {
          this.credentials = JSON.parse(storedCredentials);
          console.log('Retrieved credentials from sessionStorage');
        }
      } catch (error) {
        console.error('Error retrieving Hospitable credentials:', error);
      }
    }
    return this.credentials;
  }

  isAuthenticated(): boolean {
    return !!this.getCredentials()?.accessToken;
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const credentials = this.getCredentials();
    if (!credentials || !credentials.accessToken) {
      throw new Error('Not authenticated with Hospitable');
    }

    const headers = new Headers(options.headers);
    
    // Format d'authentification selon la documentation officielle:
    // 'Authorization: Bearer <token>'
    headers.set('Authorization', `Bearer ${credentials.accessToken}`);
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');

    // Construire l'URL complète (avec le préfixe v2)
    let url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    // Ajouter l'account ID comme paramètre de requête si nécessaire
    if (credentials.accountId && !endpoint.includes('account')) {
      url += url.includes('?') ? '&' : '?';
      url += `account_id=${credentials.accountId}`;
    }

    console.log(`Hospitable API request: ${url}`);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers
      });
      
      console.log(`Hospitable API response status: ${response.status}`);
      
      // Gestion des erreurs d'authentification (401)
      if (response.status === 401) {
        console.error('Authentication failed: Token might be expired or invalid');
        throw new Error('Authentication failed: Your access token might be expired or invalid. Please update your credentials.');
      }
      
      if (!response.ok) {
        let errorText = '';
        try {
          // Essayer d'obtenir le corps JSON de l'erreur
          const errorBody = await response.json();
          errorText = JSON.stringify(errorBody);
          console.error('Hospitable API error details:', errorBody);
        } catch {
          // Si ce n'est pas du JSON, récupérer le texte brut
          errorText = await response.text();
        }
        
        console.error(`Hospitable API error (${response.status}): ${errorText}`);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      return response;
    } catch (error) {
      console.error('Hospitable API fetch error:', error);
      throw error;
    }
  }

  // Vérifier les identifiants
  async verifyCredentials(): Promise<boolean> {
    if (!this.isAuthenticated()) {
      console.error('Cannot verify credentials: No access token provided');
      return false;
    }

    try {
      // Selon la documentation, on utilise /me pour vérifier l'authentification
      console.log('Verifying Hospitable credentials using /me endpoint');
      const response = await this.fetchWithAuth('/me');
      const userData = await response.json();
      console.log('Hospitable authentication successful:', userData);
      return true;
    } catch (error) {
      console.error('Error verifying Hospitable credentials:', error);
      return false;
    }
  }

  // Récupérer les propriétés selon la documentation
  async fetchProperties(): Promise<HospitableProperty[]> {
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
          },
          created_at: '2023-01-15T09:00:00Z',
          updated_at: '2023-01-15T09:00:00Z'
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
          },
          created_at: '2023-02-20T14:30:00Z',
          updated_at: '2023-02-20T14:30:00Z'
        }
      ];
    }

    // Endpoint selon la doc: GET /properties
    const response = await this.fetchWithAuth('/properties');
    const data = await response.json();
    
    console.log('Properties data:', data);
    
    // Adapter la réponse au format de notre application
    return data.data.map((property: any) => ({
      id: property.id,
      name: property.name || property.title,
      bedrooms_count: property.bedrooms || 0,
      bathrooms_count: property.bathrooms || 0,
      surface: property.square_feet || property.square_meters || 0,
      surface_unit: property.square_feet ? 'ft²' : 'm²',
      address: {
        city: property.city,
        country_code: property.country_code,
        street: property.address || property.street,
        zip: property.zip_code || property.postal_code
      },
      created_at: property.created_at,
      updated_at: property.updated_at
    }));
  }

  // Récupérer les réservations selon la documentation
  async fetchReservations(params?: { startDate?: Date; endDate?: Date }): Promise<HospitableReservation[]> {
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
          updated_at: '2023-10-05T09:23:45Z',
          channel: 'airbnb',
          adults: 2,
          children: 0
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
          updated_at: '2023-11-10T14:30:12Z',
          channel: 'booking.com',
          adults: 1,
          children: 0
        }
      ];
    }

    // Code pour l'implémentation réelle
    // Endpoint selon la doc: GET /reservations
    let endpoint = '/reservations';
    if (params) {
      const queryParams = [];
      
      // Utiliser le format de date YYYY-MM-DD pour les paramètres selon la doc
      if (params.startDate) queryParams.push(`start_date=${params.startDate.toISOString().split('T')[0]}`);
      if (params.endDate) queryParams.push(`end_date=${params.endDate.toISOString().split('T')[0]}`);
      
      if (queryParams.length > 0) {
        endpoint += `?${queryParams.join('&')}`;
      }
    }
    
    const response = await this.fetchWithAuth(endpoint);
    const data = await response.json();
    
    console.log('Reservations data:', data);
    
    return data.data.map((reservation: any) => ({
      id: reservation.id,
      check_in: reservation.check_in,
      check_out: reservation.check_out,
      status: reservation.status,
      guest_id: reservation.guest_id,
      property_id: reservation.listing_id || reservation.property_id,
      amount: reservation.total_amount || reservation.amount,
      currency: reservation.currency || 'EUR',
      created_at: reservation.created_at,
      updated_at: reservation.updated_at,
      channel: reservation.channel,
      channel_id: reservation.channel_id,
      adults: reservation.guests_adults || reservation.adults || 0,
      children: reservation.guests_children || reservation.children || 0,
      infants: reservation.guests_infants || reservation.infants || 0
    }));
  }

  // Récupérer les invités selon la documentation
  async fetchGuests(): Promise<HospitableGuest[]> {
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
          updated_at: '2023-09-15T08:30:00Z',
          notes: 'Arrivée tardive possible',
          country_code: 'FR'
        },
        {
          id: 202,
          first_name: 'Sophie',
          last_name: 'Dubois',
          email: 'sophie.dubois@example.com',
          phone: '+33687654321',
          created_at: '2023-10-20T14:45:00Z',
          updated_at: '2023-10-20T14:45:00Z',
          country_code: 'FR'
        }
      ];
    }

    // Endpoint selon la doc: GET /guests
    const response = await this.fetchWithAuth('/guests');
    const data = await response.json();
    
    console.log('Guests data:', data);
    
    return data.data.map((guest: any) => ({
      id: guest.id,
      first_name: guest.first_name,
      last_name: guest.last_name,
      email: guest.email,
      phone: guest.phone,
      created_at: guest.created_at,
      updated_at: guest.updated_at,
      notes: guest.notes,
      country_code: guest.country_code
    }));
  }

  // Récupérer les transactions selon la documentation
  async fetchTransactions(): Promise<HospitableTransaction[]> {
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
          updated_at: '2023-10-05T09:30:00Z',
          description: 'Acompte 50%',
          paid_at: '2023-10-05T09:28:00Z'
        },
        {
          id: 302,
          reservation_id: 101,
          amount: 425,
          currency: 'EUR',
          status: 'completed',
          payment_method: 'bank_transfer',
          created_at: '2023-11-10T10:15:00Z',
          updated_at: '2023-11-10T10:20:00Z',
          description: 'Solde 50%',
          paid_at: '2023-11-10T10:18:00Z'
        }
      ];
    }

    // Endpoint selon la doc: GET /payments
    const endpoint = '/payments';
    const response = await this.fetchWithAuth(endpoint);
    const data = await response.json();
    
    console.log('Transactions data:', data);
    
    return data.data.map((transaction: any) => ({
      id: transaction.id,
      reservation_id: transaction.reservation_id,
      amount: transaction.amount,
      currency: transaction.currency || 'EUR',
      status: transaction.status,
      payment_method: transaction.payment_method,
      created_at: transaction.created_at,
      updated_at: transaction.updated_at,
      description: transaction.description,
      paid_at: transaction.paid_at
    }));
  }

  // Importer toutes les données en une fois
  async importAll(params?: { startDate?: Date; endDate?: Date }): Promise<HospitableImportResult> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Hospitable. Please configure your credentials first.');
    }

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

  // Réinitialiser les identifiants (déconnexion)
  clearCredentials() {
    this.credentials = null;
    try {
      sessionStorage.removeItem('hospitableCredentials');
    } catch (error) {
      console.error('Error clearing Hospitable credentials:', error);
    }
  }
}

export const hospitable = new HospitableService();
