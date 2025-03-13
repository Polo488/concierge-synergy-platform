
import { useState, useEffect } from 'react';
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
  
  // Vérifier l'état d'authentification au chargement
  useEffect(() => {
    // Si des identifiants sont stockés mais pas chargés en mémoire
    if (!hospitable.isAuthenticated() && sessionStorage.getItem('hospitableCredentials')) {
      console.log('Found credentials in sessionStorage, loading them');
      hospitable.getCredentials(); // Force l'initialisation depuis le sessionStorage
    }
  }, []);
  
  // Mutation pour configurer les identifiants
  const configMutation = useMutation({
    mutationFn: async (credentials: HospitableCredentials) => {
      console.log('Setting Hospitable credentials:', credentials);
      
      // On ne fait aucune validation du token pour être sûr que ça passe
      // On laisse l'API Hospitable valider le token
      
      hospitable.setCredentials(credentials);
      const isValid = await hospitable.verifyCredentials();
      
      console.log('Verification result:', isValid);
      
      if (!isValid) {
        throw new Error("Le token d'accès n'est pas valide");
      }
      
      return isValid;
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
          description: "Impossible de se connecter à Hospitable. Vérifiez votre token d'accès.",
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
    meta: {
      onSuccess: (data: HospitableImportResult) => {
        toast({
          title: "Importation réussie",
          description: `${data.reservations.length} réservations, ${data.properties.length} propriétés, ${data.guests.length} clients et ${data.transactions.length} transactions importés.`,
        });
      },
      onError: (error: Error) => {
        toast({
          title: "Erreur d'importation",
          description: error instanceof Error ? error.message : "Une erreur s'est produite lors de l'importation des données",
          variant: "destructive",
        });
      }
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

  // Fonction pour se déconnecter de Hospitable
  const logout = () => {
    hospitable.clearCredentials();
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté de Hospitable."
    });
  };

  return {
    // États
    isConfiguring,
    setIsConfiguring,
    isAuthenticated: hospitable.isAuthenticated(),
    credentials: hospitable.getCredentials(),
    
    // Configuration
    configMutation,
    logout,
    
    // Importation
    importQuery,
    startImport,
    importParams,
    setImportParams,
    
    // Données importées
    importedData: importQuery.data,
  };
}
