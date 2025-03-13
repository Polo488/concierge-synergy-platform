
import { 
  HospitableWebhook, 
  CreateWebhookRequest 
} from '@/types/hospitable';

// Fonction pour générer un ID aléatoire
const generateId = () => Math.random().toString(36).substring(2, 15);

// Webhooks fictifs pour le développement
let mockWebhooks: HospitableWebhook[] = [
  {
    id: 'webhook1',
    label: 'Webhook de test',
    url: 'https://example.com/webhook',
    types: ['reservations', 'properties'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'active'
  }
];

// Méthodes mock pour les webhooks
export const mockWebhookMethods = {
  getWebhooks: async (): Promise<HospitableWebhook[]> => {
    // Simule un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));
    return [...mockWebhooks];
  },
  
  createWebhook: async (data: CreateWebhookRequest): Promise<HospitableWebhook> => {
    // Simule un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Crée un nouveau webhook
    const newWebhook: HospitableWebhook = {
      id: generateId(),
      label: data.label,
      url: data.url,
      types: data.types,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active'
    };
    
    // Ajoute le webhook à la liste
    mockWebhooks.push(newWebhook);
    
    return newWebhook;
  },
  
  updateWebhook: async (id: string, data: CreateWebhookRequest): Promise<HospitableWebhook> => {
    // Simule un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Trouve et met à jour le webhook
    const index = mockWebhooks.findIndex(w => w.id === id);
    if (index === -1) {
      throw new Error('Webhook not found');
    }
    
    const updatedWebhook: HospitableWebhook = {
      ...mockWebhooks[index],
      label: data.label,
      url: data.url,
      types: data.types,
      updated_at: new Date().toISOString()
    };
    
    mockWebhooks[index] = updatedWebhook;
    
    return updatedWebhook;
  },
  
  deleteWebhook: async (id: string): Promise<void> => {
    // Simule un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Filtre le webhook à supprimer
    const initialLength = mockWebhooks.length;
    mockWebhooks = mockWebhooks.filter(w => w.id !== id);
    
    if (mockWebhooks.length === initialLength) {
      throw new Error('Webhook not found');
    }
  }
};
