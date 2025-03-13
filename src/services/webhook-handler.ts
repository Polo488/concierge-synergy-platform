
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
  const baseURL = import.meta.env.DEV 
    ? 'http://localhost:5173'  // URL de développement (changez le port si nécessaire)
    : window.location.origin;  // URL de production
    
  return `${baseURL}/api/webhooks/hospitable`;
}
