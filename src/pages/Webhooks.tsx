
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHospitable } from '@/hooks/useHospitable';
import { WebhooksIntroduction } from '@/components/webhooks/WebhooksIntroduction';
import { ActiveWebhooks } from '@/components/webhooks/ActiveWebhooks';
import { LegacyWebhooks } from '@/components/webhooks/LegacyWebhooks';
import { Button } from '@/components/ui/button';
import { WebhookFormDialog } from '@/components/webhooks/WebhookFormDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';

export default function Webhooks() {
  const { isAuthenticated } = useHospitable();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Webhooks Hospitable</h1>
        
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-rose-500 hover:bg-rose-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter un webhook
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="webhooks" className="w-full">
            <TabsList className="mb-6 border-b w-full justify-start rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger 
                value="webhooks" 
                className="py-2.5 px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-rose-500 data-[state=active]:text-rose-500 data-[state=active]:shadow-none bg-transparent"
              >
                Webhooks
              </TabsTrigger>
              <TabsTrigger 
                value="legacy" 
                className="py-2.5 px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-rose-500 data-[state=active]:text-rose-500 data-[state=active]:shadow-none bg-transparent"
              >
                Legacy webhooks
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="webhooks" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <WebhooksIntroduction />
                </div>
                <div className="lg:col-span-2">
                  <ActiveWebhooks onAddNew={() => setIsDialogOpen(true)} />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="legacy" className="mt-0">
              <LegacyWebhooks />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <WebhookFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </div>
  );
}
