
import { toast } from '@/components/ui/use-toast';

interface WebhookPayload {
  event_type: string;
  event_data: any;
  timestamp: string;
}

/**
 * Traite les webhooks reçus de Hospitable
 * @param payload Données reçues du webhook
 */
export async function handleHospitableWebhook(payload: WebhookPayload): Promise<void> {
  try {
    console.log('Webhook reçu de Hospitable:', payload);
    
    // Selon le type d'événement, on effectue différentes actions
    switch (payload.event_type) {
      case 'reservation.created':
      case 'reservation.updated':
        console.log('Nouvelle réservation ou mise à jour:', payload.event_data);
        toast({
          title: 'Nouvelle réservation',
          description: `Réservation ${payload.event_data.id} reçue`,
          variant: 'default',
        });
        break;
      
      case 'property.updated':
        console.log('Propriété mise à jour:', payload.event_data);
        toast({
          title: 'Propriété mise à jour',
          description: `Propriété ${payload.event_data.name} mise à jour`,
          variant: 'default',
        });
        break;
        
      default:
        console.log('Événement non géré:', payload.event_type);
    }
    
    // Ici vous pourriez enregistrer les données dans une base de données
    // ou déclencher d'autres actions dans votre application
    
  } catch (error) {
    console.error('Erreur lors du traitement du webhook:', error);
    throw error;
  }
}

/**
 * URL pour exposer comme endpoint de webhook
 * Pour tester localement avec ngrok: npx ngrok http 5173
 */
export function getWebhookURL(): string {
  // En production, utilisez votre domaine réel
  // Pour le développement local, on retourne simplement le chemin de l'API
  const baseURL = import.meta.env.DEV 
    ? '/api/webhooks/hospitable'  // Chemin relatif pour le développement local
    : `${window.location.origin}/api/webhooks/hospitable`;  // URL complète en production
    
  return baseURL;
}

/**
 * Construit l'URL complète pour un webhook avec une URL ngrok
 * @param ngrokUrl URL ngrok (ex: https://abc123.ngrok.io)
 */
export function buildWebhookUrlWithNgrok(ngrokUrl: string): string {
  if (!ngrokUrl) return '';
  
  // Assurez-vous que l'URL ngrok est correctement formatée
  const formattedNgrokUrl = ngrokUrl.trim();
  if (!formattedNgrokUrl.startsWith('http')) {
    return `https://${formattedNgrokUrl}/api/webhooks/hospitable`;
  }
  
  // Si l'URL se termine par un slash, on le retire
  const baseUrl = formattedNgrokUrl.endsWith('/') 
    ? formattedNgrokUrl.slice(0, -1)
    : formattedNgrokUrl;
    
  return `${baseUrl}/api/webhooks/hospitable`;
}
