
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { hospitable } from '@/services/hospitable.service';
import { 
  HospitableCredentials, 
  HospitableImportResult,
  HospitablePagination
} from '@/types/hospitable';
import { toast } from '@/components/ui/use-toast';

// Token d'accès codé en dur (à utiliser uniquement pour les tests)
const HARDCODED_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5YTYyNGRmMC0xMmYxLTQ0OGUtYjg4NC00MzY3ODBhNWQzY2QiLCJqdGkiOiIyZWM2MDdjM2RhYWIxODNhYzgyOTM2ODljYzdkYjRjMjU3NzIyZDg1OTY2OGRiNjc5Y2VhNDFkYzc4MjFmYzkzNTZjYmJhMWI2NWI1OTFkMSIsImlhdCI6MTc0MTg1NzIwNi43MDI4MDgsIm5iZiI6MTc0MTg1NzIwNi43MDI4MTIsImV4cCI6MTc3MzM5MzIwNi42OTU1ODUsInN1YiI6IjE4NzcxMiIsInNjb3BlcyI6WyJwYXQ6cmVhZCIsInBhdDp3cml0ZSJdfQ.WvniAvtezL8bM3K9Gi5vSGH5evSIfm9grK2UEjE0sna3bOQC-Mkz39eLsqPz3RzY6uATux-Wp8x8nLLZg59eGopkXboZVAqe1B6j51uRlm_UqTL9XppHlLel9i3KVjh71XVjyxinvRT00jZDvBK_OskTqhyuDrY2ykPQvss4d86XojS1BCM-6JNuDBQ627Pn-1TCtXTEncmlKlEWzJAAH3_mbwHNu_0vUrPJtAaFH41eu1mb_sWFIEpBiGytsZQcDNPdWwFkFGrmvmL8n_JwGZFMGWUzPdxObzQIQhyGVquDIbYELEtOSi-ogEPKdbv5t14uO0myood_5t-rD0-3-zgwfN6pBshSxC7lyuS5gkrsnNBGlrtiOoz9ea1oDcoKiIKr9pfF30EW7dvw47nOThIwNLqJ6bNohHKoRflqUgcXIgR8M-P8KUelmg820ZInJSkTYvfObLJTujICdwvoeVaCnEa8ZkQUGOHnQR0c1VjOovfFb9zRuG8we6AHqbqG-Lc71MDXgz5YlUIramCwJzGvkvu1YG6XzJLR9vHSMh8ua-sn_k3I1zcM44WAwbToIoezIoU6L_cJaJQOX8bOERM9RFcKzuvXuqpUsgi0T2cHhbg2tiW9oyAzaRy_FwfxDY77BKheEfvkZjwaCfOrbpRSjffctzsZi280_tuRX0A";

export function useHospitable() {
  const [isConfiguring, setIsConfiguring] = useState(false);
  
  // État pour suivre les paramètres d'importation
  const [importParams, setImportParams] = useState<{
    startDate?: Date;
    endDate?: Date;
    pagination?: HospitablePagination;
  }>({});
  
  // Initialiser avec le token codé en dur au chargement
  useEffect(() => {
    // Applique le token codé en dur si aucun token n'est configuré
    if (!hospitable.isAuthenticated()) {
      console.log('Setting hardcoded Hospitable token');
      hospitable.setCredentials({ accessToken: HARDCODED_TOKEN });
    }
  }, []);
  
  // Mutation pour configurer les identifiants
  const configMutation = useMutation({
    mutationFn: async (credentials: HospitableCredentials) => {
      console.log('Setting Hospitable credentials:', credentials);
      
      // On stocke d'abord les identifiants pour les tests
      hospitable.setCredentials(credentials);
      
      // Puis on vérifie si le token est valide
      const isValid = await hospitable.verifyCredentials();
      
      console.log('Verification result:', isValid);
      
      if (!isValid) {
        throw new Error("Le token d'accès n'est pas valide ou la connexion à l'API a échoué");
      }
      
      return isValid;
    },
    onSuccess: (success) => {
      if (success) {
        toast({
          title: "Configuration réussie",
          description: "La connexion à Hospitable a été établie avec succès.",
          variant: "success",
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
          variant: "success",
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
  const startImport = (params?: { 
    startDate?: Date; 
    endDate?: Date; 
    pagination?: HospitablePagination;
  }) => {
    if (params) {
      setImportParams(params);
    }
    
    if (!hospitable.isAuthenticated()) {
      // Appliquer automatiquement le token codé en dur
      console.log('Auto-applying hardcoded token for import');
      hospitable.setCredentials({ accessToken: HARDCODED_TOKEN });
    }
    
    importQuery.refetch();
  };

  // Fonction pour accéder à la page suivante des résultats
  const loadNextPage = () => {
    if (importQuery.data?.pagination?.next_page) {
      const nextPage = importQuery.data.pagination.current_page + 1;
      setImportParams(prev => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          page: nextPage
        }
      }));
      importQuery.refetch();
    }
  };

  // Fonction pour accéder à la page précédente des résultats
  const loadPreviousPage = () => {
    if (importQuery.data?.pagination?.current_page > 1) {
      const prevPage = importQuery.data.pagination.current_page - 1;
      setImportParams(prev => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          page: prevPage
        }
      }));
      importQuery.refetch();
    }
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
    
    // Pagination
    loadNextPage,
    loadPreviousPage,
    
    // Données importées
    importedData: importQuery.data,
  };
}
