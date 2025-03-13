import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
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
import { Checkbox } from '@/components/ui/checkbox';
import { useWebhooks } from '@/hooks/useWebhooks';
import { HospitableWebhook, WebhookType } from '@/types/hospitable';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  label: z.string().min(1, "Le nom du webhook est requis"),
  url: z.string().url("Une URL valide est requise"),
  types: z.array(z.string()).min(1, "Sélectionnez au moins un type de webhook")
});

type FormValues = z.infer<typeof formSchema>;

interface WebhookFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  webhook?: HospitableWebhook;
  onClose?: () => void;
}

export function WebhookFormDialog({ open, onOpenChange, webhook, onClose }: WebhookFormDialogProps) {
  const { createWebhook, updateWebhook } = useWebhooks();
  const isEditing = !!webhook;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: webhook?.label || '',
      url: webhook?.url || '',
      types: webhook?.types || []
    }
  });

  const isLoading = createWebhook.isPending || updateWebhook.isPending;

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditing && webhook) {
        await updateWebhook.mutateAsync({
          id: webhook.id,
          label: values.label,
          url: values.url,
          types: values.types as WebhookType[]
        });
      } else {
        await createWebhook.mutateAsync({
          label: values.label,
          url: values.url,
          types: values.types as WebhookType[]
        });
      }
      
      form.reset();
      onOpenChange(false);
      if (onClose) onClose();
    } catch (error) {
      console.error('Error saving webhook:', error);
    }
  };

  const webhookTypes = [
    { id: 'properties', label: 'Properties' },
    { id: 'reservations', label: 'Reservations' }
  ];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen && onClose) onClose();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit webhook' : 'Add new webhook'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook label</FormLabel>
                  <FormControl>
                    <Input placeholder="Mon webhook Hospitable" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>The URL where this webhook will be sent</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/webhook" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel>Webhook Types</FormLabel>
              <div className="mt-2 space-y-2">
                {webhookTypes.map(type => (
                  <FormField
                    key={type.id}
                    control={form.control}
                    name="types"
                    render={({ field }) => {
                      return (
                        <FormItem 
                          key={type.id} 
                          className="flex flex-row items-center space-x-3 space-y-0 border rounded-md p-3"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(type.id)}
                              onCheckedChange={(checked) => {
                                const updatedValue = checked
                                  ? [...field.value, type.id]
                                  : field.value.filter((value) => value !== type.id);
                                field.onChange(updatedValue);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">{type.label}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              {form.formState.errors.types && (
                <p className="text-sm font-medium text-destructive mt-2">
                  {form.formState.errors.types.message}
                </p>
              )}
            </div>
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                  if (onClose) onClose();
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : isEditing ? 'Save changes' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
