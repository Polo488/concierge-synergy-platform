
import React from 'react';
import { InventoryItem } from '@/types/maintenance';

// Mock data for inventory
export const getMaintenanceInventoryData = () => {
  const consummables: InventoryItem[] = [
    { id: 1, name: 'Papier toilette', category: 'Consommables', stock: 15, min: 20, status: 'low' },
    { id: 2, name: 'Savon liquide', category: 'Consommables', stock: 23, min: 15, status: 'low' },
    { id: 3, name: 'Éponges', category: 'Consommables', stock: 45, min: 20, status: 'ok' },
    { id: 4, name: 'Produit vaisselle', category: 'Consommables', stock: 32, min: 15, status: 'ok' },
    { id: 5, name: 'Liquide vaisselle', category: 'Consommables', stock: 28, min: 15, status: 'ok' },
  ];

  const linen: InventoryItem[] = [
    { id: 6, name: 'Draps king size', category: 'Linge', stock: 28, min: 15, status: 'ok' },
    { id: 7, name: 'Housses couette', category: 'Linge', stock: 18, min: 20, status: 'low' },
    { id: 8, name: 'Serviettes bain', category: 'Linge', stock: 52, min: 30, status: 'ok' },
    { id: 9, name: 'Serviettes main', category: 'Linge', stock: 64, min: 30, status: 'ok' },
    { id: 10, name: 'Taies d\'oreiller', category: 'Linge', stock: 35, min: 20, status: 'ok' },
  ];

  const maintenance: InventoryItem[] = [
    { id: 11, name: 'Ampoules LED', category: 'Maintenance', stock: 24, min: 10, status: 'ok' },
    { id: 12, name: 'Joints silicone', category: 'Maintenance', stock: 8, min: 5, status: 'ok' },
    { id: 13, name: 'Piles AA', category: 'Maintenance', stock: 16, min: 20, status: 'low' },
    { id: 14, name: 'Fusibles', category: 'Maintenance', stock: 12, min: 10, status: 'ok' },
    { id: 15, name: 'Ruban adhésif', category: 'Maintenance', stock: 4, min: 3, status: 'ok' },
  ];

  // Combine all inventory items
  return [...consummables, ...linen, ...maintenance];
};

// Mock data for maintenance tasks with updated material storage and internal names
export const getInitialMaintenanceTasks = () => {
  const allInventoryItems = getMaintenanceInventoryData();

  const initialPendingMaintenance = [
    { 
      id: 1, 
      title: 'Fuite robinet salle de bain', 
      property: 'Appartement 12 Rue du Port',
      internalName: 'Port-12',
      urgency: 'high' as const,
      createdAt: '2023-11-20',
      description: 'Fuite importante sous le lavabo de la salle de bain principale',
      materials: [
        allInventoryItems.find(i => i.id === 12) as InventoryItem,
        allInventoryItems.find(i => i.id === 15) as InventoryItem
      ],
      materialQuantities: { 12: 1, 15: 2 }
    },
    { 
      id: 2, 
      title: 'Serrure porte d\'entrée bloquée', 
      property: 'Studio 8 Avenue des Fleurs',
      internalName: 'Fleurs-8',
      urgency: 'critical' as const,
      createdAt: '2023-11-21',
      description: 'Client ne peut pas entrer dans le logement, serrure bloquée',
      materials: [
        allInventoryItems.find(i => i.id === 15) as InventoryItem
      ],
      materialQuantities: { 15: 1 }
    },
    { 
      id: 3, 
      title: 'Ampoule salon grillée', 
      property: 'Maison 23 Rue de la Paix',
      internalName: 'Paix-23',
      urgency: 'low' as const,
      createdAt: '2023-11-22',
      description: 'Remplacer l\'ampoule du plafonnier dans le salon',
      materials: [
        allInventoryItems.find(i => i.id === 11) as InventoryItem
      ],
      materialQuantities: { 11: 1 }
    },
  ];

  const initialInProgressMaintenance = [
    { 
      id: 4, 
      title: 'Problème chauffage', 
      property: 'Appartement 45 Boulevard Central',
      internalName: 'Central-45',
      urgency: 'medium' as const,
      createdAt: '2023-11-19',
      technician: 'Martin Dupont',
      startedAt: '2023-11-20',
      scheduledDate: '2023-11-25',
      description: 'Radiateur de la chambre ne chauffe pas correctement',
      materials: [
        allInventoryItems.find(i => i.id === 14) as InventoryItem
      ],
      materialQuantities: { 14: 2 }
    },
    { 
      id: 5, 
      title: 'Volet roulant bloqué', 
      property: 'Loft 72 Rue des Arts',
      internalName: 'Arts-72',
      urgency: 'medium' as const,
      createdAt: '2023-11-18',
      technician: 'Sophie Moreau',
      startedAt: '2023-11-20',
      description: 'Volet roulant de la chambre principale ne descend plus',
      materials: [
        allInventoryItems.find(i => i.id === 15) as InventoryItem
      ],
      materialQuantities: { 15: 1 }
    },
  ];

  const initialCompletedMaintenance = [
    { 
      id: 6, 
      title: 'Remplacement chasse d\'eau', 
      property: 'Appartement 12 Rue du Port',
      internalName: 'Port-12',
      urgency: 'high' as const,
      createdAt: '2023-11-15',
      completedAt: '2023-11-16',
      technician: 'Martin Dupont',
      description: 'Remplacement complet du mécanisme de chasse d\'eau',
      materials: [
        allInventoryItems.find(i => i.id === 12) as InventoryItem
      ],
      materialQuantities: { 12: 2 }
    },
    { 
      id: 7, 
      title: 'Installation étagère', 
      property: 'Studio 8 Avenue des Fleurs',
      internalName: 'Fleurs-8',
      urgency: 'low' as const,
      createdAt: '2023-11-16',
      completedAt: '2023-11-17',
      technician: 'Sophie Moreau',
      description: 'Installation d\'une étagère dans la cuisine selon demande du propriétaire',
      materials: [
        allInventoryItems.find(i => i.id === 15) as InventoryItem
      ],
      materialQuantities: { 15: 3 }
    },
  ];

  return {
    pending: initialPendingMaintenance,
    inProgress: initialInProgressMaintenance,
    completed: initialCompletedMaintenance
  };
};
