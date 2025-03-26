
import { MaintenanceTask, UrgencyLevel } from '@/types/maintenance';
import { Property } from '@/types/property';

// Add sample maintenance tasks for demo purposes
export const generateMaintenanceHistory = (properties: Property[]): MaintenanceTask[] => {
  // Using the same urgency levels and maintenance types as in the Maintenance page
  const urgencyLevels: UrgencyLevel[] = ['low', 'medium', 'high', 'critical'];
  const maintenanceTypes = [
    'Fuite robinet', 'Remplacement ampoule', 'Serrure bloquée', 'Problème chauffage',
    'Volet roulant bloqué', 'Chasse d\'eau défectueuse', 'Réparation mur', 'Nettoyage ventilation'
  ];
  const technicians = ['Martin Dupont', 'Sophie Moreau', 'Jean Mercier', 'Emma Laurent'];
  
  // Generate some maintenance history
  const maintenanceHistory: MaintenanceTask[] = [];
  
  properties.forEach(property => {
    // Each property gets 0-5 maintenance tasks
    const tasksCount = Math.floor(Math.random() * 6);
    
    for (let i = 0; i < tasksCount; i++) {
      const id = `maint-${property.id}-${i}`;
      const createdDate = new Date();
      // Set the date to be between 1 and 180 days in the past
      createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 180) - 1);
      const createdAt = createdDate.toISOString().split('T')[0];
      
      const urgency = urgencyLevels[Math.floor(Math.random() * urgencyLevels.length)];
      const title = `${maintenanceTypes[Math.floor(Math.random() * maintenanceTypes.length)]} - ${property.type}`;
      const technician = technicians[Math.floor(Math.random() * technicians.length)];
      
      // Some tasks are completed, some in progress, some pending
      const status = Math.random();
      let startedAt, completedAt;
      
      if (status > 0.3) { // 70% chance of being started
        const startDate = new Date(createdDate);
        startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 7) + 1); // 1-7 days after creation
        startedAt = startDate.toISOString().split('T')[0];
        
        if (status > 0.6) { // 40% chance of being completed (out of all tasks)
          const completeDate = new Date(startDate);
          completeDate.setDate(completeDate.getDate() + Math.floor(Math.random() * 14) + 1); // 1-14 days after starting
          completedAt = completeDate.toISOString().split('T')[0];
        }
      }
      
      maintenanceHistory.push({
        id,
        propertyId: property.id,
        title,
        property: `${property.type} ${property.number} - ${property.address}`,
        urgency,
        createdAt,
        startedAt,
        completedAt,
        technician: startedAt ? technician : undefined,
        description: `Intervention de maintenance pour ${title.toLowerCase()} dans le logement ${property.number}.`
      });
    }
  });
  
  return maintenanceHistory;
};
