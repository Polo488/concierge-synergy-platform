
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
import { BookingSyncCredentials } from '@/types/bookingSync';

const formSchema = z.object({
  clientId: z.string().min(1, "L'ID client est requis"),
  clientSecret: z.string().min(1, "Le secret client est requis"),
  redirectUri: z.string().url("L'URI de redirection doit être une URL valide"),
});

// Default SMILY API credentials
const DEFAULT_CREDENTIALS = {
  clientId: '62cf3c457d20bf1e7dc5cac0d182f9c6c6b5d3e3d628bb7057defbc4ed53e4da',
  clientSecret: '30e0c5100953296cacdcdf559aaeb2566322dddf2ec5e6608af3be7a67921b36',
  redirectUri: 'https://bnb-lyon.com/auth/callback',
};

interface SmilyConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BookingSyncCredentials) => void;
  initialData?: BookingSyncCredentials;
  isLoading?: boolean;
}

export function SmilyConfigDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
}: SmilyConfigDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: initialData?.clientId || DEFAULT_CREDENTIALS.clientId,
      clientSecret: initialData?.clientSecret || DEFAULT_CREDENTIALS.clientSecret,
      redirectUri: initialData?.redirectUri || DEFAULT_CREDENTIALS.redirectUri,
    },
  });

  // Fix the type issue by ensuring all required fields are present
  function handleSubmit(values: z.infer<typeof formSchema>) {
    // Create a proper BookingSyncCredentials object with all required fields
    const credentials: BookingSyncCredentials = {
      clientId: values.clientId,
      clientSecret: values.clientSecret,
      redirectUri: values.redirectUri,
    };
    
    onSubmit(credentials);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configuration de SMILY (BookingSync)</DialogTitle>
          <DialogDescription>
            Les identifiants d'API BookingSync sont pré-remplis. Vous pouvez les utiliser directement ou les modifier selon vos besoins.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Client</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre ID client BookingSync" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientSecret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secret Client</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Votre secret client BookingSync" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="redirectUri"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URI de Redirection</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://votre-app.com/callback" 
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
