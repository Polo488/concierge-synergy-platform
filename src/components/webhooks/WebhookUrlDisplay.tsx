
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, CheckCircle2 } from 'lucide-react';
import { getWebhookURL } from '@/services/webhook-handler';

export function WebhookUrlDisplay() {
  const [copied, setCopied] = useState(false);
  const webhookUrl = getWebhookURL();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">URL du webhook à utiliser</CardTitle>
        <CardDescription>
          Copiez cette URL et utilisez-la pour configurer votre webhook dans Hospitable
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Input 
            value={webhookUrl} 
            readOnly 
            className="font-mono text-sm bg-gray-50"
          />
          <Button 
            variant="outline" 
            size="icon" 
            onClick={copyToClipboard}
            className={copied ? "text-green-500" : ""}
          >
            {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Note : Pour tester en local, vous devez exposer votre serveur de développement avec 
          un outil comme ngrok : <code>npx ngrok http 5173</code>
        </p>
      </CardContent>
    </Card>
  );
}
