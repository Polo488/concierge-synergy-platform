
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, CheckCircle2, ExternalLink } from 'lucide-react';
import { getWebhookURL, buildWebhookUrlWithNgrok } from '@/services/webhook-handler';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';

export function WebhookUrlDisplay() {
  const [copied, setCopied] = useState(false);
  const [ngrokUrl, setNgrokUrl] = useState('');
  const webhookUrl = getWebhookURL();
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  const copyToClipboard = (textToCopy: string) => {
    if (!textToCopy) {
      toast({
        title: "Erreur",
        description: "Aucune URL à copier. Veuillez d'abord entrer une URL ngrok.",
        variant: "destructive",
      });
      return;
    }
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      toast({
        title: "URL copiée !",
        description: "L'URL a été copiée dans le presse-papier",
        variant: "default",
      });
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Erreur lors de la copie:', err);
      toast({
        title: "Erreur",
        description: "Impossible de copier l'URL",
        variant: "destructive",
      });
    });
  };

  const copyWebhookUrl = () => {
    const urlToCopy = isLocalhost ? buildWebhookUrlWithNgrok(ngrokUrl) : webhookUrl;
    copyToClipboard(urlToCopy);
  };

  const handleNgrokChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNgrokUrl(e.target.value);
  };
  
  // URL complète à utiliser avec ngrok
  const completeWebhookUrl = isLocalhost 
    ? buildWebhookUrlWithNgrok(ngrokUrl)
    : webhookUrl;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">URL du webhook à utiliser dans Hospitable</CardTitle>
        <CardDescription>
          Copiez cette URL et utilisez-la pour configurer votre webhook dans Hospitable
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLocalhost ? (
          <>
            <Alert className="bg-yellow-50 border-yellow-100">
              <AlertDescription className="text-sm">
                <strong>Vous êtes en mode développement local.</strong> Hospitable ne peut pas accéder directement à votre serveur local.
                Veuillez suivre les étapes ci-dessous pour créer une URL accessible publiquement.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3 bg-gray-50 p-4 rounded-md border">
              <h3 className="font-medium">Instructions pour tester en local:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Ouvrez un terminal et exécutez: <code className="bg-gray-200 px-1 py-0.5 rounded">npx ngrok http 5173</code></li>
                <li>Copiez l'URL HTTPS fournie par ngrok (ex: <code className="bg-gray-200 px-1 py-0.5 rounded">https://abc123.ngrok.io</code>)</li>
                <li>Collez-la dans le champ ci-dessous (sans le chemin /api/webhooks/...):</li>
              </ol>
              
              <div className="flex items-center space-x-2">
                <Input 
                  value={ngrokUrl} 
                  onChange={handleNgrokChange}
                  placeholder="https://abc123.ngrok.io" 
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    window.open('https://dashboard.ngrok.com', '_blank');
                  }}
                  title="Ouvrir le dashboard ngrok"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="pt-2">
                <p className="font-medium text-sm">URL complète à utiliser dans Hospitable:</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Input 
                    value={completeWebhookUrl || "Veuillez d'abord entrer l'URL ngrok"}
                    readOnly 
                    className="font-mono text-sm bg-white"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={copyWebhookUrl}
                    disabled={!ngrokUrl}
                    className={copied ? "text-green-500" : ""}
                    title="Copier l'URL"
                  >
                    {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-2">
            <Input 
              value={webhookUrl} 
              readOnly 
              className="font-mono text-sm bg-gray-50"
            />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={copyWebhookUrl}
              className={copied ? "text-green-500" : ""}
              title="Copier l'URL"
            >
              {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        )}
        
        <div className="text-sm text-muted-foreground mt-2">
          <p className="font-medium">Comment configurer dans Hospitable:</p>
          <ol className="list-decimal list-inside mt-1">
            <li>Connectez-vous à votre compte Hospitable</li>
            <li>Allez dans Paramètres &gt; Webhooks</li>
            <li>Cliquez sur "Add new"</li>
            <li>Donnez un nom à votre webhook (ex: "Mon application")</li>
            <li>Collez l'URL copiée ci-dessus dans le champ "The URL where this webhook will be sent"</li>
            <li>Sélectionnez les événements que vous souhaitez recevoir</li>
            <li>Cliquez sur "Save"</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
