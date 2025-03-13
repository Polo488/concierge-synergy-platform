
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hospitable } from '@/services/hospitable.service';
import { 
  HospitableWebhook, 
  CreateWebhookRequest,
  WebhookType 
} from '@/types/hospitable';
import { toast } from '@/components/ui/use-toast';

export function useWebhooks() {
  const queryClient = useQueryClient();
  
  // Fetch webhooks
  const webhooksQuery = useQuery({
    queryKey: ['hospitable', 'webhooks'],
    queryFn: () => hospitable.getWebhooks(),
    enabled: hospitable.isAuthenticated(),
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Erreur lors du chargement des webhooks",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  });

  // Create webhook
  const createWebhook = useMutation({
    mutationFn: (data: CreateWebhookRequest) => hospitable.createWebhook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospitable', 'webhooks'] });
      toast({
        title: "Webhook créé",
        description: "Le webhook a été créé avec succès",
        variant: "success",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur lors de la création du webhook",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update webhook
  const updateWebhook = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & CreateWebhookRequest) => 
      hospitable.updateWebhook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospitable', 'webhooks'] });
      toast({
        title: "Webhook mis à jour",
        description: "Le webhook a été mis à jour avec succès",
        variant: "success",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur lors de la mise à jour du webhook",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete webhook
  const deleteWebhook = useMutation({
    mutationFn: (id: string) => hospitable.deleteWebhook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospitable', 'webhooks'] });
      toast({
        title: "Webhook supprimé",
        description: "Le webhook a été supprimé avec succès",
        variant: "success",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur lors de la suppression du webhook",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    webhooks: webhooksQuery.data,
    isLoading: webhooksQuery.isLoading,
    error: webhooksQuery.error,
    
    createWebhook,
    updateWebhook,
    deleteWebhook,
    
    refetch: webhooksQuery.refetch
  };
}
