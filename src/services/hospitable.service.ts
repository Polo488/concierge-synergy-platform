import { 
  HospitableCredentials,
  HospitableProperty,
  HospitableReservation,
  HospitableGuest,
  HospitableTransaction,
  HospitableImportResult,
  HospitablePaginatedResponse,
  HospitableWebhook,
  CreateWebhookRequest
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

  // Récupérer les propriétés selon la documentation V2
  async fetchProperties(): Promise<HospitableProperty[]> {
    if (import.meta.env.DEV) {
      console.log('DEV: Simulating properties fetch');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return [
        {
          uuid: '095be615-a8ad-4c33-8e9c-c7612fbf6c9f',
          id: 1, // Pour rétrocompatibilité
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
          updated_at: '2023-01-15T09:00:00Z',
          listings: [
            {
              platform: 'airbnb',
              platform_id: '12345678'
            }
          ]
        },
        {
          uuid: '195be615-a8ad-4c33-8e9c-c7612fbf6c0d',
          id: 2, // Pour rétrocompatibilité
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
          updated_at: '2023-02-20T14:30:00Z',
          listings: [
            {
              platform: 'booking.com',
              platform_id: '87654321'
            }
          ]
        }
      ];
    }

    // Endpoint selon la doc V2: GET /properties
    const response = await this.fetchWithAuth('/properties');
    const data: HospitablePaginatedResponse<any> = await response.json();
    
    console.log('Properties data:', data);
    
    // Adapter la réponse au format de notre application
    return data.data.map((property: any) => ({
      uuid: property.uuid,
      id: property.id, // Pour rétrocompatibilité
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
      updated_at: property.updated_at,
      listings: property.listings || []
    }));
  }

  // Récupérer les réservations selon la documentation V2
  async fetchReservations(params?: { startDate?: Date; endDate?: Date }): Promise<HospitableReservation[]> {
    if (import.meta.env.DEV) {
      console.log('DEV: Simulating reservations fetch');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return [
        {
          uuid: 'f95be615-a8ad-4c33-8e9c-c7612fbf6c9f',
          id: 101, // Pour rétrocompatibilité
          arrival_date: '2023-11-15T14:00:00Z',
          departure_date: '2023-11-20T10:00:00Z',
          check_in: '2023-11-15T14:00:00Z',
          check_out: '2023-11-20T10:00:00Z',
          reservation_status: {
            current: 'confirmed'
          },
          guest_id: 201,
          property_id: 1, // Pour rétrocompatibilité
          property_uuid: '095be615-a8ad-4c33-8e9c-c7612fbf6c9f',
          platform: 'airbnb',
          platform_id: 'HMXYZ123',
          nights: 5,
          created: '2023-10-05T09:23:45Z',
          updated_at: '2023-10-05T09:23:45Z',
          guests: {
            total: 2,
            adult_count: 2,
            children_count: 0,
            infants_count: 0
          },
          financials: {
            currency: 'EUR',
            guest: {
              accommodation: 800,
              total_price: 850
            },
            host: {
              guest_fees: 25,
              host_fees: 30,
              taxes: 20,
              revenue: 775
            }
          }
        },
        {
          uuid: 'g95be615-a8ad-4c33-8e9c-c7612fbf6d0f',
          id: 102, // Pour rétrocompatibilité
          arrival_date: '2023-12-01T15:00:00Z',
          departure_date: '2023-12-08T11:00:00Z',
          check_in: '2023-12-01T15:00:00Z',
          check_out: '2023-12-08T11:00:00Z',
          reservation_status: {
            current: 'confirmed'
          },
          guest_id: 202,
          property_id: 2, // Pour rétrocompatibilité
          property_uuid: '195be615-a8ad-4c33-8e9c-c7612fbf6c0d',
          platform: 'booking.com',
          platform_id: 'BDC456789',
          nights: 7,
          created: '2023-11-10T14:30:12Z',
          updated_at: '2023-11-10T14:30:12Z',
          guests: {
            total: 1,
            adult_count: 1,
            children_count: 0,
            infants_count: 0
          },
          financials: {
            currency: 'EUR',
            guest: {
              accommodation: 600,
              total_price: 630
            },
            host: {
              guest_fees: 15,
              host_fees: 20,
              taxes: 10,
              revenue: 585
            }
          }
        }
      ];
    }

    // Code pour l'implémentation réelle
    // Endpoint selon la doc V2: GET /reservations
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
    const data: HospitablePaginatedResponse<any> = await response.json();
    
    console.log('Reservations data:', data);
    
    return data.data.map((reservation: any) => ({
      uuid: reservation.uuid,
      id: reservation.id, // Pour rétrocompatibilité
      arrival_date: reservation.arrival_date || reservation.check_in,
      departure_date: reservation.departure_date || reservation.check_out,
      check_in: reservation.check_in,
      check_out: reservation.check_out,
      reservation_status: {
        current: reservation.reservation_status?.current || reservation.status
      },
      guest_id: reservation.guest_id,
      property_id: reservation.property_id, // Pour rétrocompatibilité
      property_uuid: reservation.property_uuid || reservation.property?.uuid,
      platform: reservation.platform || reservation.channel,
      platform_id: reservation.platform_id || reservation.reservation_code || reservation.code,
      nights: reservation.nights,
      created: reservation.created || reservation.created_at,
      updated_at: reservation.updated_at,
      guests: {
        total: reservation.guests?.total || (reservation.adults || 0) + (reservation.children || 0) + (reservation.infants || 0),
        adult_count: reservation.guests?.adult_count || reservation.adults || 0,
        children_count: reservation.guests?.children_count || reservation.children || 0,
        infants_count: reservation.guests?.infants_count || reservation.infants || 0,
        pet_count: reservation.guests?.pet_count || reservation.pets || 0
      },
      financials: {
        currency: reservation.financials?.currency || reservation.currency || 'EUR',
        guest: {
          accommodation: reservation.financials?.guest?.accommodation || reservation.base_price || 0,
          total_price: reservation.financials?.guest?.total_price || reservation.total_price || reservation.amount || 0
        },
        host: {
          guest_fees: reservation.financials?.host?.guest_fees || reservation.guest_fee || 0,
          host_fees: reservation.financials?.host?.host_fees || reservation.host_service_fee || 0,
          taxes: reservation.financials?.host?.taxes || reservation.tax_amount || 0,
          revenue: reservation.financials?.host?.revenue || reservation.payout_price || 0
        }
      }
    }));
  }

  // Récupérer les invités selon la documentation V2
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
          phone_numbers: ['+33612345678'],
          created_at: '2023-09-15T08:30:00Z',
          updated_at: '2023-09-15T08:30:00Z',
          notes: 'Arrivée tardive possible',
          country_code: 'FR',
          profile_picture: 'https://example.com/profile.jpg'
        },
        {
          id: 202,
          first_name: 'Sophie',
          last_name: 'Dubois',
          email: 'sophie.dubois@example.com',
          phone_numbers: ['+33687654321'],
          created_at: '2023-10-20T14:45:00Z',
          updated_at: '2023-10-20T14:45:00Z',
          country_code: 'FR'
        }
      ];
    }

    // Endpoint selon la doc V2: GET /guests
    const response = await this.fetchWithAuth('/guests');
    const data: HospitablePaginatedResponse<any> = await response.json();
    
    console.log('Guests data:', data);
    
    return data.data.map((guest: any) => ({
      id: guest.id,
      first_name: guest.first_name,
      last_name: guest.last_name,
      email: guest.email,
      phone_numbers: guest.phone_numbers || (guest.phone ? [guest.phone] : []),
      created_at: guest.created_at,
      updated_at: guest.updated_at,
      notes: guest.notes,
      country_code: guest.country_code,
      profile_picture: guest.profile_picture || guest.picture_url
    }));
  }

  // Récupérer les transactions selon la documentation V2
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

    // Endpoint selon la doc V2: GET /payments
    const endpoint = '/payments';
    const response = await this.fetchWithAuth(endpoint);
    const data: HospitablePaginatedResponse<any> = await response.json();
    
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

  // Add webhook methods
  async getWebhooks(): Promise<HospitableWebhook[]> {
    if (import.meta.env.DEV) {
      console.log('DEV: Simulating webhooks fetch');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return [
        {
          id: '1',
          label: 'Réservations webhook',
          url: 'https://example.com/webhooks/reservations',
          types: ['reservations'],
          created_at: '2023-01-15T09:00:00Z',
          updated_at: '2023-01-15T09:00:00Z',
          status: 'active'
        },
        {
          id: '2',
          label: 'Properties webhook',
          url: 'https://example.com/webhooks/properties',
          types: ['properties'],
          created_at: '2023-02-20T14:30:00Z',
          updated_at: '2023-02-20T14:30:00Z',
          status: 'active'
        }
      ];
    }

    // Endpoint for webhooks
    const response = await this.fetchWithAuth('/webhooks');
    const data: HospitablePaginatedResponse<HospitableWebhook> = await response.json();
    
    return data.data;
  }

  async createWebhook(data: CreateWebhookRequest): Promise<HospitableWebhook> {
    if (import.meta.env.DEV) {
      console.log('DEV: Simulating webhook creation', data);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        id: Math.random().toString(36).substring(2, 11),
        label: data.label,
        url: data.url,
        types: data.types,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'active'
      };
    }

    const response = await this.fetchWithAuth('/webhooks', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    return result.data;
  }

  async updateWebhook(id: string, data: CreateWebhookRequest): Promise<HospitableWebhook> {
    if (import.meta.env.DEV) {
      console.log('DEV: Simulating webhook update', id, data);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        id,
        label: data.label,
        url: data.url,
        types: data.types,
        created_at: '2023-01-15T09:00:00Z',
        updated_at: new Date().toISOString(),
        status: 'active'
      };
    }

    const response = await this.fetchWithAuth(`/webhooks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    return result.data;
  }

  async deleteWebhook(id: string): Promise<void> {
    if (import.meta.env.DEV) {
      console.log('DEV: Simulating webhook deletion', id);
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }

    await this.fetchWithAuth(`/webhooks/${id}`, {
      method: 'DELETE'
    });
  }
}

export const hospitable = new HospitableService();
