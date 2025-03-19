
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

  setCredentials(credentials: BookingSyncCredentials) {
    this.credentials = credentials;
    // Dans une implémentation réelle, nous stockerions cela dans localStorage
    localStorage.setItem('bookingSyncCredentials', JSON.stringify(credentials));
    console.log('Credentials set:', credentials);
  }

  getCredentials(): BookingSyncCredentials | null {
    // Tenter de récupérer les identifiants de localStorage s'ils n'existent pas en mémoire
    if (!this.credentials) {
      const storedCredentials = localStorage.getItem('bookingSyncCredentials');
      if (storedCredentials) {
        try {
          this.credentials = JSON.parse(storedCredentials);
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
      
      this.authenticated = true;
      
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

  // Nouvelle méthode pour exécuter des requêtes API génériques
  async executeApiRequest(endpoint: string): Promise<any> {
    try {
      // Dans un environnement de dev, on peut soit simuler une réponse, soit faire un appel réel
      if (import.meta.env.DEV) {
        console.log(`DEV: Executing API request to ${endpoint}`);
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Si l'endpoint est /rentals, retournons des données simulées de logements
        if (endpoint.startsWith('/rentals')) {
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
              }
            ],
            meta: {
              pagination: {
                current_page: 1,
                per_page: 20,
                total_pages: 1,
                total_count: 2
              }
            }
          };
        }
        
        // Pour les autres endpoints, retournons un objet générique
        return {
          success: true,
          message: `DEV: Simulated API response for ${endpoint}`,
          timestamp: new Date().toISOString()
        };
      }
      
      // Dans un environnement de production ou si on force un vrai appel API
      const response = await this.fetchWithAuth(endpoint);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error executing API request to ${endpoint}:`, error);
      throw error;
    }
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
    if (!this.credentials) {
      throw new Error('No credentials available for BookingSync API');
    }

    const headers = new Headers(options.headers);
    
    // En production, nous utiliserions le vrai token d'accès
    // Pour le développement, nous simulons avec l'ID client
    headers.set('Authorization', `Bearer ${this.credentials.clientId}`);
    headers.set('Content-Type', 'application/vnd.api+json');
    headers.set('Accept', 'application/vnd.api+json');

    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
  }

  // Récupérer les hébergements (rentals)
  async fetchRentals(): Promise<BookingSyncRental[]> {
    // Pour la simulation, retourner des données fictives
    if (import.meta.env.DEV) {
      console.log('DEV: Simulating rental fetch');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return [
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
      ];
    }

    // Code pour l'implémentation réelle
    const response = await this.fetchWithAuth('/rentals');
    if (!response.ok) {
      throw new Error(`Failed to fetch rentals: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.rentals;
  }

  // Récupérer les réservations (bookings)
  async fetchBookings(params?: { start_at?: string; end_at?: string }): Promise<BookingSyncBooking[]> {
    // Pour la simulation, retourner des données fictives
    if (import.meta.env.DEV) {
      console.log('DEV: Simulating bookings fetch');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return [
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
      ];
    }

    // Code pour l'implémentation réelle
    let url = '/bookings';
    if (params) {
      const queryParams = new URLSearchParams();
      if (params.start_at) queryParams.set('start_at', params.start_at);
      if (params.end_at) queryParams.set('end_at', params.end_at);
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }
    
    const response = await this.fetchWithAuth(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch bookings: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.bookings;
  }

  // Récupérer les clients
  async fetchClients(): Promise<BookingSyncClient[]> {
    // Pour la simulation, retourner des données fictives
    if (import.meta.env.DEV) {
      console.log('DEV: Simulating clients fetch');
      await new Promise(resolve => setTimeout(resolve, 700));
      
      return [
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
      ];
    }

    // Code pour l'implémentation réelle
    const response = await this.fetchWithAuth('/clients');
    if (!response.ok) {
      throw new Error(`Failed to fetch clients: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.clients;
  }

  // Récupérer les paiements
  async fetchPayments(): Promise<BookingSyncPayment[]> {
    // Pour la simulation, retourner des données fictives
    if (import.meta.env.DEV) {
      console.log('DEV: Simulating payments fetch');
      await new Promise(resolve => setTimeout(resolve, 900));
      
      return [
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
      ];
    }

    // Code pour l'implémentation réelle
    const response = await this.fetchWithAuth('/payments');
    if (!response.ok) {
      throw new Error(`Failed to fetch payments: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.payments;
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
      
      return {
        rentals,
        bookings,
        clients,
        payments
      };
    } catch (error) {
      console.error('Error importing data from BookingSync:', error);
      throw error;
    }
  }
}

export const bookingSyncService = new BookingSyncService();
