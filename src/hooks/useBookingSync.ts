
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { bookingSyncService } from '@/services/bookingSyncService';
import { 
  BookingSyncCredentials, 
  BookingSyncImportResult 
} from '@/types/bookingSync';
import { toast } from '@/components/ui/use-toast';

export function useBookingSync() {
  const [isConfiguring, setIsConfiguring] = useState(false);
  
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

  // Query pour importer les données
  const importQuery = useQuery({
    queryKey: ['bookingSync', 'import', importParams],
    queryFn: () => bookingSyncService.importAll(importParams),
    enabled: false, // Ne s'exécute pas automatiquement
  });
  
  // Fonction pour démarrer l'importation
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

  return {
    // États
    isConfiguring,
    setIsConfiguring,
    isAuthenticated: bookingSyncService.isAuthenticated(),
    credentials: bookingSyncService.getCredentials(),
    
    // Configuration
    configMutation,
    
    // Importation
    importQuery,
    startImport,
    importParams,
    setImportParams,
    
    // Données importées
    importedData: importQuery.data,
  };
}
