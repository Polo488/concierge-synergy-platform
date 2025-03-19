import { 
  BookingSyncCredentials,
  BookingSyncRental,
  BookingSyncBooking,
  BookingSyncClient,
  BookingSyncPayment,
  BookingSyncImportResult
} from '@/types/bookingSync';

const API_BASE_URL = 'https://www.bookingsync.com/api/v3';

class BookingSyncService {
  private credentials: BookingSyncCredentials | null = null;
  private authenticated: boolean = false;
  private accessToken: string | null = null;

  setCredentials(credentials: BookingSyncCredentials) {
    this.credentials = credentials;
    // Dans une implémentation réelle, nous stockerions cela dans localStorage
    localStorage.setItem('bookingSyncCredentials', JSON.stringify(credentials));
    console.log('Credentials set:', credentials);
    
    // If we have an access token in the credentials, set authenticated to true
    if (credentials.accessToken) {
      this.accessToken = credentials.accessToken;
      this.authenticated = true;
    }
  }

  getCredentials(): BookingSyncCredentials | null {
    // Tenter de récupérer les identifiants de localStorage s'ils n'existent pas en mémoire
    if (!this.credentials) {
      const storedCredentials = localStorage.getItem('bookingSyncCredentials');
      if (storedCredentials) {
        try {
          this.credentials = JSON.parse(storedCredentials);
          
          // If we have an access token in the credentials, set authenticated to true
          if (this.credentials.accessToken) {
            this.accessToken = this.credentials.accessToken;
            this.authenticated = true;
          }
        } catch (e) {
          console.error('Failed to parse stored credentials:', e);
        }
      }
    }
    return this.credentials;
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  // Dans une vraie implémentation, cette méthode ouvrirait une fenêtre pour l'authentification OAuth
  async authenticate(): Promise<boolean> {
    // Vérifier que les identifiants sont disponibles
    if (!this.credentials) {
      throw new Error('No credentials provided for BookingSync authentication');
    }

    console.log('Authenticating with BookingSync using credentials:', this.credentials.clientId);
    
    try {
      // En production, cela ferait un vrai appel OAuth
      // Pour le développement, nous simulons une réponse positive
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate access token generation for development
      this.accessToken = `dev_${this.credentials.clientId}_token_${Date.now()}`;
      this.authenticated = true;
      
      // Update credentials with the new access token
      this.credentials = {
        ...this.credentials,
        accessToken: this.accessToken,
        expiresAt: Date.now() + 3600000 // 1 hour from now
      };
      
      // Store updated credentials
      localStorage.setItem('bookingSyncCredentials', JSON.stringify(this.credentials));
      
      // Essayons de faire un appel API simple pour vérifier les identifiants
      try {
        const testResponse = await this.testApiConnection();
        if (!testResponse) {
          throw new Error('API test connection failed');
        }
      } catch (error) {
        console.error('API test connection error:', error);
        // Dans un environnement de dev, on continue quand même
        if (!import.meta.env.DEV) {
          this.authenticated = false;
          return false;
        }
      }
      
      console.log('Authentication successful');
      return true;
    } catch (error) {
      console.error('Authentication error:', error);
      this.authenticated = false;
      return false;
    }
  }

  // Méthode pour tester la connexion API
  private async testApiConnection(): Promise<boolean> {
    try {
      // Dans un environnement de dev, on simule une réponse positive
      if (import.meta.env.DEV) {
        console.log('DEV: Simulating API test connection');
        return true;
      }
      
      // Dans un environnement de production, on fait un vrai appel API
      const response = await this.fetchWithAuth('/rentals?per_page=1');
      return response.ok;
    } catch (error) {
      console.error('API test connection error:', error);
      return false;
    }
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
    if (!this.isAuthenticated() || !this.accessToken) {
      throw new Error('Not authenticated with BookingSync API');
    }

    const headers = new Headers(options.headers);
    
    // According to BookingSync API documentation
    headers.set('Authorization', `Bearer ${this.accessToken}`);
    headers.set('Content-Type', 'application/vnd.api+json');
    headers.set('Accept', 'application/vnd.api+json');

    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    return fetch(url, {
      ...options,
      headers
    });
  }

  // Generic method to execute any API request according to BookingSync API documentation
  // Modifié pour n'accepter que la méthode GET
  async executeApiRequest(
    endpoint: string, 
    method: 'GET' = 'GET', // Seule la méthode GET est autorisée
    params?: Record<string, string>,
    body?: any // Conservé pour la compatibilité mais non utilisé
  ): Promise<any> {
    try {
      if (!this.isAuthenticated()) {
        await this.authenticate();
      }
      
      // Build URL with parameters if provided
      let url = endpoint;
      if (params && Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
          queryParams.append(key, value);
        }
        url += `?${queryParams.toString()}`;
      }
      
      // For development, simulate API responses
      if (import.meta.env.DEV) {
        console.log(`DEV: Simulating API request: GET ${url}`);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Return mock data based on the endpoint
        if (url.includes('/rentals')) {
          return this.getMockRentals();
        } else if (url.includes('/bookings')) {
          return this.getMockBookings();
        } else if (url.includes('/clients')) {
          return this.getMockClients();
        } else if (url.includes('/payments')) {
          return this.getMockPayments();
        } else {
          // Generic mock response
          return {
            data: [],
            meta: {
              count: 0,
              total_pages: 1,
              current_page: 1
            }
          };
        }
      }
      
      const options: RequestInit = {
        method: 'GET', // Force la méthode GET
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'Accept': 'application/vnd.api+json'
        }
      };
      
      const response = await this.fetchWithAuth(url, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Mock data methods for development
  private getMockRentals(): any {
    return {
      rentals: [
        {
          id: 1,
          name: 'Appartement Bellecour',
          bedrooms_count: 2,
          bathrooms_count: 1,
          surface: 65,
          surface_unit: 'm²',
          address: {
            city: 'Lyon',
            country_code: 'FR',
            street: '10 Place Bellecour',
            zip: '69002'
          }
        },
        {
          id: 2,
          name: 'Studio Croix-Rousse',
          bedrooms_count: 1,
          bathrooms_count: 1,
          surface: 35,
          surface_unit: 'm²',
          address: {
            city: 'Lyon',
            country_code: 'FR',
            street: '5 Boulevard de la Croix-Rousse',
            zip: '69004'
          }
        },
        {
          id: 3,
          name: 'Loft Confluence',
          bedrooms_count: 3,
          bathrooms_count: 2,
          surface: 95,
          surface_unit: 'm²',
          address: {
            city: 'Lyon',
            country_code: 'FR',
            street: '15 Cours Charlemagne',
            zip: '69002'
          }
        }
      ],
      meta: {
        count: 3,
        total_pages: 1,
        current_page: 1
      }
    };
  }

  private getMockBookings(): any {
    return {
      bookings: [
        {
          id: 101,
          start_at: '2023-11-15T14:00:00Z',
          end_at: '2023-11-20T10:00:00Z',
          status: 'Booked',
          client_id: 201,
          rental_id: 1,
          price_cents: 85000,
          currency: 'EUR',
          created_at: '2023-10-05T09:23:45Z',
          updated_at: '2023-10-05T09:23:45Z'
        },
        {
          id: 102,
          start_at: '2023-12-01T15:00:00Z',
          end_at: '2023-12-08T11:00:00Z',
          status: 'Booked',
          client_id: 202,
          rental_id: 2,
          price_cents: 63000,
          currency: 'EUR',
          created_at: '2023-11-10T14:30:12Z',
          updated_at: '2023-11-10T14:30:12Z'
        },
        {
          id: 103,
          start_at: '2023-12-10T16:00:00Z',
          end_at: '2023-12-15T10:00:00Z',
          status: 'Tentative',
          client_id: 203,
          rental_id: 3,
          price_cents: 112500,
          currency: 'EUR',
          created_at: '2023-11-25T17:42:18Z',
          updated_at: '2023-11-25T17:42:18Z'
        }
      ],
      meta: {
        count: 3,
        total_pages: 1,
        current_page: 1
      }
    };
  }

  private getMockClients(): any {
    return {
      clients: [
        {
          id: 201,
          firstname: 'Pierre',
          lastname: 'Dupont',
          email: 'pierre.dupont@example.com',
          phone: '+33612345678',
          created_at: '2023-09-15T08:30:00Z',
          updated_at: '2023-09-15T08:30:00Z'
        },
        {
          id: 202,
          firstname: 'Marie',
          lastname: 'Laurent',
          email: 'marie.laurent@example.com',
          phone: '+33687654321',
          created_at: '2023-10-20T14:45:00Z',
          updated_at: '2023-10-20T14:45:00Z'
        },
        {
          id: 203,
          firstname: 'Jean',
          lastname: 'Martin',
          email: 'jean.martin@example.com',
          phone: '+33698765432',
          created_at: '2023-11-05T11:15:00Z',
          updated_at: '2023-11-05T11:15:00Z'
        }
      ],
      meta: {
        count: 3,
        total_pages: 1,
        current_page: 1
      }
    };
  }

  private getMockPayments(): any {
    return {
      payments: [
        {
          id: 301,
          booking_id: 101,
          amount_cents: 42500,
          currency: 'EUR',
          status: 'Captured',
          payment_method: 'credit_card',
          created_at: '2023-10-05T09:25:00Z',
          updated_at: '2023-10-05T09:30:00Z'
        },
        {
          id: 302,
          booking_id: 101,
          amount_cents: 42500,
          currency: 'EUR',
          status: 'Captured',
          payment_method: 'bank_transfer',
          created_at: '2023-11-10T10:15:00Z',
          updated_at: '2023-11-10T10:20:00Z'
        },
        {
          id: 303,
          booking_id: 102,
          amount_cents: 63000,
          currency: 'EUR',
          status: 'Captured',
          payment_method: 'credit_card',
          created_at: '2023-11-10T14:35:00Z',
          updated_at: '2023-11-10T14:40:00Z'
        }
      ],
      meta: {
        count: 3,
        total_pages: 1,
        current_page: 1
      }
    };
  }

  // Récupérer les hébergements (rentals)
  async fetchRentals(): Promise<BookingSyncRental[]> {
    const response = await this.executeApiRequest('/rentals');
    return response.rentals;
  }

  // Récupérer les réservations (bookings)
  async fetchBookings(params?: { start_at?: string; end_at?: string }): Promise<BookingSyncBooking[]> {
    const response = await this.executeApiRequest('/bookings', 'GET', params);
    return response.bookings;
  }

  // Récupérer les clients
  async fetchClients(): Promise<BookingSyncClient[]> {
    const response = await this.executeApiRequest('/clients');
    return response.clients;
  }

  // Récupérer les paiements
  async fetchPayments(): Promise<BookingSyncPayment[]> {
    const response = await this.executeApiRequest('/payments');
    return response.payments;
  }

  // Importer toutes les données en une fois
  async importAll(params?: { startDate?: Date; endDate?: Date }): Promise<BookingSyncImportResult> {
    if (!this.isAuthenticated()) {
      await this.authenticate();
    }

    try {
      console.log('Importing all data from BookingSync...');
      
      const rentals = await this.fetchRentals();
      
      let bookingParams: { start_at?: string; end_at?: string } = {};
      if (params?.startDate) {
        bookingParams.start_at = params.startDate.toISOString();
      }
      if (params?.endDate) {
        bookingParams.end_at = params.endDate.toISOString();
      }
      
      const bookings = await this.fetchBookings(bookingParams);
      const clients = await this.fetchClients();
      const payments = await this.fetchPayments();
      
      console.log('Import completed successfully');
      
      // Calculate unassigned bookings (those without rental mapping)
      const unassignedCount = bookings.filter(booking => {
        const rental = rentals.find(r => r.id === booking.rental_id);
        return !rental;
      }).length;
      
      return {
        rentals,
        bookings,
        clients,
        payments,
        bookingsCount: bookings.length,
        unassignedCount,
        errorCount: 0 // Default to 0 since we don't track errors in this implementation
      };
    } catch (error) {
      console.error('Error importing data from BookingSync:', error);
      throw error;
    }
  }
}

export const bookingSyncService = new BookingSyncService();
