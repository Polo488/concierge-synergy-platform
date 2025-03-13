
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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HospitableCredentials } from '@/types/hospitable';

const formSchema = z.object({
  apiKey: z.string().min(1, "La clé API est requise"),
  accountId: z.string().optional(), // Rendu facultatif
});

interface HospitableConfigDialogProps {
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
      apiKey: initialData?.apiKey || '',
      accountId: initialData?.accountId || '',
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    // Créer un objet avec les identifiants Hospitable
    const credentials: HospitableCredentials = {
      apiKey: values.apiKey,
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
            Entrez votre clé API Hospitable pour connecter à votre compte. L'ID du compte est facultatif.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clé API</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre clé API Hospitable" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID du Compte (facultatif)</FormLabel>
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
