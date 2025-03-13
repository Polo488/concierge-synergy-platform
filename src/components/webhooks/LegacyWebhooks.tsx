
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function LegacyWebhooks() {
  return (
    <Card className="border-gray-200 bg-gray-50">
      <CardContent className="p-6">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            Legacy webhooks are being deprecated. We recommend migrating to the new webhooks system.
          </AlertDescription>
        </Alert>
        
        <div className="text-center py-8">
          <h3 className="text-lg font-medium mb-2">No legacy webhooks</h3>
          <p className="text-gray-500">
            You don't have any legacy webhooks configured.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
