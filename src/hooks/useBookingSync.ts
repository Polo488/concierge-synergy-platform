
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
  redirectUri: 'https://bnb-lyon.com/auth/callback'
};

export function useBookingSync() {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [apiResponseData, setApiResponseData] = useState<any>(null);
  
  // Set default credentials if none exist
  useEffect(() => {
    if (!bookingSyncService.getCredentials()) {
      bookingSyncService.setCredentials(DEFAULT_CREDENTIALS);
    }
  }, []);
  
  // State for tracking import parameters
  const [importParams, setImportParams] = useState<{
    startDate?: Date;
    endDate?: Date;
  }>({});
  
  // Mutation for configuring credentials
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

  // Query for importing data
  const importQuery = useQuery({
    queryKey: ['bookingSync', 'import', importParams],
    queryFn: () => bookingSyncService.importAll(importParams),
    enabled: false, // Does not run automatically
  });
  
  // Function to start import
  const startImport = (params?: { startDate?: Date; endDate?: Date }) => {
    if (params) {
      setImportParams(params);
    }
    
    if (!bookingSyncService.isAuthenticated()) {
      toast({
        title: "Non authentifié",
        description: "Veuillez configurer vos identifiants SMILY avant d'importer des données.",
        variant: "destructive",
      });
      setIsConfiguring(true);
      return;
    }
    
    importQuery.refetch();
  };

  // Auto-authenticate with default credentials if available
  const autoAuthenticateMutation = useMutation({
    mutationFn: () => {
      if (bookingSyncService.getCredentials() && !bookingSyncService.isAuthenticated()) {
        return bookingSyncService.authenticate();
      }
      return Promise.resolve(false);
    }
  });
  
  // Function to execute direct API call
  const executeApiCall = async (endpoint: string = '/rentals', params: Record<string, string> = {}) => {
    if (!bookingSyncService.isAuthenticated()) {
      toast({
        title: "Non authentifié",
        description: "Veuillez configurer vos identifiants SMILY avant d'exécuter des requêtes API.",
        variant: "destructive",
      });
      setIsConfiguring(true);
      return null;
    }
    
    try {
      // Build the query string from params
      const queryString = new URLSearchParams(params).toString();
      const url = `${endpoint}${queryString ? `?${queryString}` : ''}`;
      
      const response = await bookingSyncService.executeApiRequest(url);
      setApiResponseData(response);
      return response;
    } catch (error) {
      console.error('API call error:', error);
      toast({
        title: "Erreur API",
        description: error instanceof Error ? error.message : "Une erreur s'est produite lors de l'exécution de la requête API",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    // States
    isConfiguring,
    setIsConfiguring,
    isAuthenticated: bookingSyncService.isAuthenticated(),
    credentials: bookingSyncService.getCredentials(),
    apiResponseData,
    
    // Configuration
    configMutation,
    autoAuthenticateMutation,
    
    // Import
    importQuery,
    startImport,
    importParams,
    setImportParams,
    
    // API
    executeApiCall,
    
    // Imported data
    importedData: importQuery.data,
  };
}
