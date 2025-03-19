
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

interface LogEntry {
  timestamp: string;
  message: string;
  type?: 'info' | 'error' | 'success' | 'warning';
}

export function useBookingSync() {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // Set default credentials if none exist
  useState(() => {
    if (!bookingSyncService.getCredentials()) {
      bookingSyncService.setCredentials(DEFAULT_CREDENTIALS);
    }
  });
  
  // Log function
  const addLog = (message: string, type: 'info' | 'error' | 'success' | 'warning' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  // Clear logs
  const clearLogs = () => {
    setLogs([]);
  };
  
  // État pour suivre les paramètres d'importation
  const [importParams, setImportParams] = useState<{
    startDate?: Date;
    endDate?: Date;
  }>({});
  
  // Mutation pour configurer les identifiants
  const configMutation = useMutation({
    mutationFn: (credentials: BookingSyncCredentials) => {
      addLog(`Tentative d'authentification avec les identifiants: ${credentials.clientId.substring(0, 8)}...`, 'info');
      bookingSyncService.setCredentials(credentials);
      return bookingSyncService.authenticate();
    },
    onSuccess: (success) => {
      if (success) {
        addLog('Authentification réussie!', 'success');
        toast({
          title: "Configuration réussie",
          description: "La connexion à SMILY a été établie avec succès.",
        });
        setIsConfiguring(false);
      } else {
        addLog('Échec de l\'authentification: Les informations d\'identification semblent invalides', 'error');
        toast({
          title: "Échec de configuration",
          description: "Impossible de se connecter à SMILY. Vérifiez vos identifiants.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      addLog(`Erreur d'authentification: ${error instanceof Error ? error.message : 'Une erreur inconnue s\'est produite'}`, 'error');
      console.error('Authentication error:', error);
      toast({
        title: "Erreur d'authentification",
        description: error instanceof Error ? error.message : "Une erreur s'est produite lors de la connexion à SMILY",
        variant: "destructive",
      });
    }
  });

  // Query pour importer les données
  const importQuery = useQuery({
    queryKey: ['bookingSync', 'import', importParams],
    queryFn: async () => {
      addLog(`Démarrage de l'import depuis SMILY pour la période du ${importParams.startDate?.toLocaleDateString() || 'début'} au ${importParams.endDate?.toLocaleDateString() || 'aujourd\'hui'}`, 'info');
      try {
        const result = await bookingSyncService.importAll(importParams);
        
        if (result) {
          // Log les résultats
          const rentalCount = result.rentals?.length || 0;
          const bookingCount = result.bookings?.length || 0;
          const clientCount = result.clients?.length || 0;
          const paymentCount = result.payments?.length || 0;
          
          addLog(`Import réussi - ${rentalCount} hébergements, ${bookingCount} réservations, ${clientCount} clients, ${paymentCount} paiements`, 'success');
        }
        
        return result;
      } catch (error) {
        addLog(`Erreur lors de l'import: ${error instanceof Error ? error.message : 'Une erreur inconnue s\'est produite'}`, 'error');
        throw error;
      }
    },
    enabled: false, // Ne s'exécute pas automatiquement
  });
  
  // Fonction pour démarrer l'importation
  const startImport = (params?: { startDate?: Date; endDate?: Date }) => {
    if (params) {
      setImportParams(params);
    }
    
    if (!bookingSyncService.isAuthenticated()) {
      addLog('Impossible de démarrer l\'import: Non authentifié à SMILY', 'warning');
      toast({
        title: "Non authentifié",
        description: "Veuillez configurer vos identifiants SMILY avant d'importer des données.",
        variant: "destructive",
      });
      setIsConfiguring(true);
      return;
    }
    
    addLog('Lancement de l\'import depuis SMILY...', 'info');
    importQuery.refetch();
  };

  // Auto-authenticate avec les identifiants par défaut si disponibles
  const autoAuthenticateMutation = useMutation({
    mutationFn: () => {
      if (bookingSyncService.getCredentials() && !bookingSyncService.isAuthenticated()) {
        addLog('Tentative d\'authentification automatique avec les identifiants par défaut', 'info');
        return bookingSyncService.authenticate();
      }
      return Promise.resolve(false);
    },
    onSuccess: (success) => {
      if (success) {
        addLog('Authentification automatique réussie', 'success');
      } else if (bookingSyncService.getCredentials()) {
        addLog('Échec de l\'authentification automatique', 'warning');
      }
    }
  });

  // Monitor service function calls
  useEffect(() => {
    const originalImportAll = bookingSyncService.importAll;
    const originalAuthenticate = bookingSyncService.authenticate;
    
    bookingSyncService.importAll = async (params) => {
      addLog(`API call: importAll(${JSON.stringify(params)})`, 'info');
      return originalImportAll.call(bookingSyncService, params);
    };
    
    bookingSyncService.authenticate = async () => {
      addLog(`API call: authenticate()`, 'info');
      return originalAuthenticate.call(bookingSyncService);
    };
    
    return () => {
      bookingSyncService.importAll = originalImportAll;
      bookingSyncService.authenticate = originalAuthenticate;
    };
  }, []);

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
    
    // Logs
    logs,
    addLog,
    clearLogs
  };
}
