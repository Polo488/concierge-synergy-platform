
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { bookingSyncService } from '@/services/bookingSyncService';
import { 
  BookingSyncCredentials, 
  BookingSyncImportResult 
} from '@/types/bookingSync';
import { toast } from '@/hooks/use-toast';

// Default credentials for SMILY API
const DEFAULT_CREDENTIALS: BookingSyncCredentials = {
  clientId: '62cf3c457d20bf1e7dc5cac0d182f9c6c6b5d3e3d628bb7057defbc4ed53e4da',
  clientSecret: '30e0c5100953296cacdcdf559aaeb2566322dddf2ec5e6608af3be7a67921b36',
  redirectUri: 'https://preview--concierge-synergy-platform.lovable.app/billing'
};

export function useBookingSync() {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState('/rentals');
  const [apiMethod, setApiMethod] = useState<'GET'>('GET'); // Seule la méthode GET est autorisée
  const [apiParams, setApiParams] = useState<Record<string, string>>({});
  const [apiBody, setApiBody] = useState<string>('');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Set default credentials if none exist and attempt to authenticate
  useEffect(() => {
    const initAuth = async () => {
      console.log('Initializing authentication...');
      if (!bookingSyncService.getCredentials()) {
        console.log('No credentials found, setting default credentials');
        bookingSyncService.setCredentials(DEFAULT_CREDENTIALS);
      }
      
      // Si nous avons des identifiants mais que nous ne sommes pas authentifiés, tenter l'authentification
      if (bookingSyncService.getCredentials() && !bookingSyncService.isAuthenticated()) {
        console.log('Have credentials but not authenticated, attempting to authenticate');
        try {
          const success = await bookingSyncService.authenticate();
          console.log('Authentication attempt result:', success);
          
          if (success) {
            toast({
              title: "Authentifié avec SMILY",
              description: "La connexion à SMILY a été établie avec les identifiants par défaut.",
            });
          }
        } catch (err) {
          console.error('Initial authentication failed:', err);
          toast({
            title: "Échec d'authentification",
            description: "Impossible de se connecter à SMILY avec les identifiants par défaut.",
            variant: "destructive",
          });
        }
      } else if (bookingSyncService.isAuthenticated()) {
        console.log('Already authenticated with BookingSync');
      }
    };
    
    initAuth();
  }, []);
  
  // État pour suivre les paramètres d'importation
  const [importParams, setImportParams] = useState<{
    startDate?: Date;
    endDate?: Date;
  }>({});
  
  // Mutation pour configurer les identifiants
  const configMutation = useMutation({
    mutationFn: (credentials: BookingSyncCredentials) => {
      bookingSyncService.setCredentials(credentials);
      return bookingSyncService.authenticate();
    },
    onSuccess: (success) => {
      if (success) {
        toast({
          title: "Configuration réussie",
          description: "La connexion à SMILY a été établie avec succès.",
        });
        setIsConfiguring(false);
      } else {
        toast({
          title: "Échec de configuration",
          description: "Impossible de se connecter à SMILY. Vérifiez vos identifiants.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error('Authentication error:', error);
      toast({
        title: "Erreur d'authentification",
        description: error instanceof Error ? error.message : "Une erreur s'est produite lors de la connexion à SMILY",
        variant: "destructive",
      });
    }
  });

  // API request mutation
  const apiRequestMutation = useMutation({
    mutationFn: async () => {
      setApiError(null);
      try {
        // Seule la méthode GET est autorisée, donc pas besoin de parsedBody
        return await bookingSyncService.executeApiRequest(
          apiEndpoint,
          'GET',
          apiParams
        );
      } catch (error) {
        if (error instanceof SyntaxError && apiBody) {
          throw new Error("Invalid JSON in request body");
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      setApiResponse(data);
      toast({
        title: "Requête API réussie",
        description: `L'appel à ${apiEndpoint} a réussi.`,
      });
    },
    onError: (error) => {
      console.error('API request error:', error);
      setApiError(error instanceof Error ? error.message : "Une erreur s'est produite lors de l'appel API");
      toast({
        title: "Erreur d'appel API",
        description: error instanceof Error ? error.message : "Une erreur s'est produite lors de l'appel API",
        variant: "destructive",
      });
    }
  });

  // Query pour importer les données
  const importQuery = useQuery({
    queryKey: ['bookingSync', 'import', importParams],
    queryFn: () => bookingSyncService.importAll(importParams),
    enabled: false, // Ne s'exécute pas automatiquement
  });
  
  // Helper function to add API parameters
  const addApiParam = (key: string, value: string) => {
    setApiParams(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Helper function to remove API parameters
  const removeApiParam = (key: string) => {
    setApiParams(prev => {
      const newParams = { ...prev };
      delete newParams[key];
      return newParams;
    });
  };

  // Helper function to execute API request
  const executeApiRequest = () => {
    if (!bookingSyncService.isAuthenticated()) {
      toast({
        title: "Non authentifié",
        description: "Veuillez configurer vos identifiants SMILY avant d'exécuter des requêtes API.",
        variant: "destructive",
      });
      setIsConfiguring(true);
      return;
    }
    
    apiRequestMutation.mutate();
  };

  // Auto-authenticate avec les identifiants par défaut
  const autoAuthenticateMutation = useMutation({
    mutationFn: async () => {
      console.log('Starting auto-authentication...');
      // Si nous avons déjà des identifiants et ne sommes pas authentifiés
      if (bookingSyncService.getCredentials() && !bookingSyncService.isAuthenticated()) {
        console.log('Auto-authenticating with BookingSync using existing credentials');
        const success = await bookingSyncService.authenticate();
        console.log('Auto-authentication result:', success);
        return success;
      }
      // Si nous sommes déjà authentifiés
      if (bookingSyncService.isAuthenticated()) {
        console.log('Already authenticated, no need for auto-authentication');
        return true;
      }
      // Si nous n'avons pas d'identifiants, utiliser les identifiants par défaut
      console.log('No credentials, setting default credentials and authenticating');
      bookingSyncService.setCredentials(DEFAULT_CREDENTIALS);
      const success = await bookingSyncService.authenticate();
      console.log('Default credentials authentication result:', success);
      return success;
    },
    onSuccess: (success) => {
      if (success) {
        console.log('Auto-authentication successful');
      } else {
        console.log('Auto-authentication failed');
        toast({
          title: "Échec d'authentification automatique",
          description: "Impossible de se connecter automatiquement à SMILY.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error('Auto-authentication error:', error);
      toast({
        title: "Erreur d'authentification",
        description: error instanceof Error ? error.message : "Une erreur s'est produite lors de la connexion automatique à SMILY",
        variant: "destructive",
      });
    }
  });

  // Modified startImport function to handle authentication automatically
  const startImport = async (params?: { startDate?: Date; endDate?: Date }) => {
    if (params) {
      setImportParams(params);
    }
    
    console.log('Starting import process, current auth status:', bookingSyncService.isAuthenticated());
    
    // If not authenticated, try to auto-authenticate with default credentials
    if (!bookingSyncService.isAuthenticated()) {
      console.log('Not authenticated, attempting to authenticate automatically');
      try {
        // Force authentication with default credentials if needed
        const success = await autoAuthenticateMutation.mutateAsync();
        console.log('Auto-authentication for import result:', success);
        
        if (!success) {
          console.error('Auto-authentication failed before import');
          toast({
            title: "Non authentifié",
            description: "Veuillez configurer vos identifiants SMILY avant d'importer des données.",
            variant: "destructive",
          });
          setIsConfiguring(true);
          return false;
        }
      } catch (error) {
        console.error('Auto authentication failed:', error);
        toast({
          title: "Erreur d'authentification",
          description: "Impossible de se connecter automatiquement à SMILY.",
          variant: "destructive",
        });
        setIsConfiguring(true);
        return false;
      }
    }
    
    // Now we should be authenticated, proceed with the import
    console.log('Starting import with authenticated client, params:', params);
    const result = await importQuery.refetch();
    console.log('Import refetch result:', result);
    return result;
  };

  return {
    // États
    isConfiguring,
    setIsConfiguring,
    isAuthenticated: bookingSyncService.isAuthenticated(),
    credentials: bookingSyncService.getCredentials(),
    
    // Configuration
    configMutation,
    autoAuthenticateMutation,
    
    // Importation
    importQuery,
    startImport,
    importParams,
    setImportParams,
    
    // Données importées
    importedData: importQuery.data,
    
    // API Request
    apiEndpoint,
    setApiEndpoint,
    apiMethod, // Only GET is allowed
    apiParams,
    setApiParams,
    addApiParam: (key: string, value: string) => {
      setApiParams(prev => ({
        ...prev,
        [key]: value
      }));
    },
    removeApiParam: (key: string) => {
      setApiParams(prev => {
        const newParams = { ...prev };
        delete newParams[key];
        return newParams;
      });
    },
    apiBody,
    setApiBody,
    apiResponse,
    apiError,
    executeApiRequest: () => {
      if (!bookingSyncService.isAuthenticated()) {
        toast({
          title: "Non authentifié",
          description: "Veuillez configurer vos identifiants SMILY avant d'exécuter des requêtes API.",
          variant: "destructive",
        });
        setIsConfiguring(true);
        return;
      }
      
      // I need to use the mutate() function from apiRequestMutation but don't have it, using a direct method call
      apiRequestMutation.mutate();
    },
    isExecutingApi: apiRequestMutation.isPending,
    resetApiResponse: () => setApiResponse(null)
  };
}
