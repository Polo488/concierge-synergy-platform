
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HospitableCredentials } from '@/types/hospitable';
import { InfoIcon, ExternalLink, KeyRound, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Validation simplifiée - juste vérifier que le token n'est pas vide
const formSchema = z.object({
  accessToken: z.string()
    .min(1, "Le token d'accès est requis"),
  accountId: z.string().optional(), // Facultatif
});

const DEFAULT_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5YTYyNGRmMC0xMmYxLTQ0OGUtYjg4NC00MzY3ODBhNWQzY2QiLCJqdGkiOiIyZWM2MDdjM2RhYWIxODNhYzgyOTM2ODljYzdkYjRjMjU3NzIyZDg1OTY2OGRiNjc5Y2VhNDFkYzc4MjFmYzkzNTZjYmJhMWI2NWI1OTFkMSIsImlhdCI6MTc0MTg1NzIwNi43MDI4MDgsIm5iZiI6MTc0MTg1NzIwNi43MDI4MTIsImV4cCI6MTc3MzM5MzIwNi42OTU1ODUsInN1YiI6IjE4NzcxMiIsInNjb3BlcyI6WyJwYXQ6cmVhZCIsInBhdDp3cml0ZSJdfQ.WvniAvtezL8bM3K9Gi5vSGH5evSIfm9grK2UEjE0sna3bOQC-Mkz39eLsqPz3RzY6uATux-Wp8x8nLLZg59eGopkXboZVAqe1B6j51uRlm_UqTL9XppHlLel9i3KVjh71XVjyxinvRT00jZDvBK_OskTqhyuDrY2ykPQvss4d86XojS1BCM-6JNuDBQ627Pn-1TCtXTEncmlKlEWzJAAH3_mbwHNu_0vUrPJtAaFH41eu1mb_sWFIEpBiGytsZQcDNPdWwFkFGrmvmL8n_JwGZFMGWUzPdxObzQIQhyGVquDIbYELEtOSi-ogEPKdbv5t14uO0myood_5t-rD0-3-zgwfN6pBshSxC7lyuS5gkrsnNBGlrtiOoz9ea1oDcoKiIKr9pfF30EW7dvw47nOThIwNLqJ6bNohHKoRflqUgcXIgR8M-P8KUelmg820ZInJSkTYvfObLJTujICdwvoeVaCnEa8ZkQUGOHnQR0c1VjOovfFb9zRuG8we6AHqbqG-Lc71MDXgz5YlUIramCwJzGvkvu1YG6XzJLR9vHSMh8ua-sn_k3I1zcM44WAwbToIoezIoU6L_cJaJQOX8bOERM9RFcKzuvXuqpUsgi0T2cHhbg2tiW9oyAzaRy_FwfxDY77BKheEfvkZjwaCfOrbpRSjffctzsZi280_tuRX0A";

export interface HospitableConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: HospitableCredentials) => void;
  initialData?: HospitableCredentials;
  isLoading?: boolean;
  error?: string;
}

export function HospitableConfigDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
  error,
}: HospitableConfigDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accessToken: initialData?.accessToken || DEFAULT_TOKEN,
      accountId: initialData?.accountId || '',
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    // Créer un objet avec les identifiants Hospitable
    const credentials: HospitableCredentials = {
      accessToken: values.accessToken,
    };
    
    // Ajouter l'ID de compte seulement s'il est fourni
    if (values.accountId && values.accountId.trim() !== '') {
      credentials.accountId = values.accountId;
    }
    
    onSubmit(credentials);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configuration de Hospitable</DialogTitle>
          <DialogDescription>
            Entrez votre token d'accès Hospitable (Personal Access Token) pour vous connecter à votre compte.
          </DialogDescription>
        </DialogHeader>

        <Alert className="mb-4 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">
            Un token d'accès par défaut est déjà configuré. Vous pouvez cliquer directement sur "Configurer" ou modifier si nécessaire.
          </AlertDescription>
        </Alert>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="accessToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token d'accès personnel</FormLabel>
                  <FormDescription className="flex items-center gap-1 text-sm">
                    <InfoIcon className="h-4 w-4" />
                    Entrez votre token d'accès personnel Hospitable (sans préfixe).
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="Votre token d'accès" {...field} />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground mt-1">
                    <a 
                      href="https://developer.hospitable.com/docs/public-api-docs/d862b3ee512e6-introduction#authentication" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      Consulter la documentation 
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID du Compte (facultatif)</FormLabel>
                  <FormDescription>
                    Requis uniquement si vous avez accès à plusieurs comptes.
                  </FormDescription>
                  <FormControl>
                    <Input 
                      placeholder="L'ID de votre compte Hospitable (facultatif)" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Configuration en cours...' : 'Configurer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
