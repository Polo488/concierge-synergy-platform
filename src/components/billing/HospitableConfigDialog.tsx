
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
import { InfoIcon } from 'lucide-react';

const formSchema = z.object({
  accessToken: z.string().min(1, "Le token d'accès est requis"),
  accountId: z.string().optional(), // Rendu facultatif
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
            Entrez votre Personal Access Token (PAT) Hospitable pour vous connecter à votre compte.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="accessToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Access Token (PAT)</FormLabel>
                  <FormDescription className="flex items-center gap-1 text-sm">
                    <InfoIcon className="h-4 w-4" />
                    Vous pouvez créer un PAT dans votre compte Hospitable, section API.
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="pat_xxxxxxxxxxxxxxxx" {...field} />
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
