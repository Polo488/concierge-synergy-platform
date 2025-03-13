
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
import { InfoIcon, ExternalLink, KeyRound } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Validation simplifiée - juste vérifier que le token n'est pas vide
const formSchema = z.object({
  accessToken: z.string()
    .min(1, "Le token d'accès est requis"),
  accountId: z.string().optional(), // Facultatif
});

export interface HospitableConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: HospitableCredentials) => void;
  initialData?: HospitableCredentials;
  isLoading?: boolean;
}

export function HospitableConfigDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
}: HospitableConfigDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accessToken: initialData?.accessToken || '',
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

        <Alert className="mb-4 bg-muted">
          <KeyRound className="h-4 w-4" />
          <AlertDescription>
            Un token d'accès est déjà configuré par défaut. Vous pouvez le modifier si nécessaire.
          </AlertDescription>
        </Alert>

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
