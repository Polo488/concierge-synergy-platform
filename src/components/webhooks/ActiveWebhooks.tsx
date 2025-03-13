
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWebhooks } from '@/hooks/useWebhooks';
import { HospitableWebhook } from '@/types/hospitable';
import { Loader2, Plus, Trash2, Edit } from 'lucide-react';
import { WebhookFormDialog } from './WebhookFormDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface ActiveWebhooksProps {
  onAddNew: () => void;
}

export function ActiveWebhooks({ onAddNew }: ActiveWebhooksProps) {
  const { webhooks, isLoading, deleteWebhook } = useWebhooks();
  const [editingWebhook, setEditingWebhook] = useState<HospitableWebhook | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = (webhook: HospitableWebhook) => {
    setEditingWebhook(webhook);
    setIsDialogOpen(true);
  };

  const handleDelete = async (webhookId: string) => {
    await deleteWebhook.mutateAsync(webhookId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Active webhooks</h2>
        <Button 
          onClick={onAddNew}
          size="sm"
          variant="outline"
          className="border-dashed border-gray-300"
        >
          <Plus className="h-4 w-4 mr-1" /> Add new
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : webhooks && webhooks.length > 0 ? (
        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <Card key={webhook.id} className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-medium">{webhook.label}</h3>
                    <p className="text-sm text-gray-500 break-all">{webhook.url}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {webhook.types.map((type) => (
                        <div key={type} className="bg-gray-100 text-xs px-2.5 py-1 rounded-full">
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 self-end md:self-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(webhook)}
                      className="text-gray-500"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-500 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the webhook 
                            and remove its data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(webhook.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <h3 className="text-lg font-medium mb-2">No webhooks yet</h3>
            <p className="text-gray-500 mb-6">
              You haven't created any webhooks yet. You can create the first one with the button below.
            </p>
            <Button 
              onClick={onAddNew}
              className="bg-rose-500 hover:bg-rose-600 text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Add new
            </Button>
          </CardContent>
        </Card>
      )}

      {editingWebhook && (
        <WebhookFormDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen}
          webhook={editingWebhook}
          onClose={() => setEditingWebhook(null)}
        />
      )}
    </div>
  );
}
