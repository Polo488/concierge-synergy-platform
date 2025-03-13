
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { hospitable } from '@/services/hospitable.service';
import { 
  HospitableCredentials, 
  HospitableImportResult 
} from '@/types/hospitable';
import { toast } from '@/components/ui/use-toast';

export function useHospitable() {
  const [isConfiguring, setIsConfiguring] = useState(false);
  
  // État pour suivre les paramètres d'importation
  const [importParams, setImportParams] = useState<{
    startDate?: Date;
    endDate?: Date;
  }>({});
  
  // Mutation pour configurer les identifiants
  const configMutation = useMutation({
    mutationFn: async (credentials: HospitableCredentials) => {
      hospitable.setCredentials(credentials);
      return hospitable.verifyCredentials();
    },
    onSuccess: (success) => {
      if (success) {
        toast({
          title: "Configuration réussie",
          description: "La connexion à Hospitable a été établie avec succès.",
        });
        setIsConfiguring(false);
      } else {
        toast({
          title: "Échec de configuration",
          description: "Impossible de se connecter à Hospitable. Vérifiez votre clé API.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error('Authentication error:', error);
      toast({
        title: "Erreur d'authentification",
        description: error instanceof Error ? error.message : "Une erreur s'est produite lors de la connexion à Hospitable",
        variant: "destructive",
      });
    }
  });

  // Query pour importer les données
  const importQuery = useQuery({
    queryKey: ['hospitable', 'import', importParams],
    queryFn: () => hospitable.importAll(importParams),
    enabled: false, // Ne s'exécute pas automatiquement
    onSuccess: (data) => {
      toast({
        title: "Importation réussie",
        description: `${data.reservations.length} réservations, ${data.properties.length} propriétés, ${data.guests.length} clients et ${data.transactions.length} transactions importés.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur d'importation",
        description: error instanceof Error ? error.message : "Une erreur s'est produite lors de l'importation des données",
        variant: "destructive",
      });
    }
  });
  
  // Fonction pour démarrer l'importation
  const startImport = (params?: { startDate?: Date; endDate?: Date }) => {
    if (params) {
      setImportParams(params);
    }
    
    if (!hospitable.isAuthenticated()) {
      toast({
        title: "Non authentifié",
        description: "Veuillez configurer vos identifiants Hospitable avant d'importer des données.",
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
    isAuthenticated: hospitable.isAuthenticated(),
    credentials: hospitable.getCredentials(),
    
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
