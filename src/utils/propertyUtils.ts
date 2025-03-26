import { MaintenanceTask, UrgencyLevel } from '@/types/maintenance';

export const generateProperties = () => {
  const propertyTypes = ['Appartement', 'Studio', 'Loft', 'Maison', 'Villa'];
  const propertyClassifications = ['T1', 'T2', 'T3', 'T4', 'T5'];
  const ownerNames = [
    'Thomas Dubois', 'Marie Lefevre', 'Jean Martin', 'Sophie Bernard', 'Pierre Durand',
    'Isabelle Moreau', 'Michel Lambert', 'Anne Rousseau', 'Philippe Girard', 'Julie Leroy'
  ];
  
  return Array.from({ length: 400 }, (_, i) => {
    const id = (i + 1).toString();
    const number = id.padStart(2, '0');
    const type = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    
    // Assign classification based on type and bedrooms
    const bedrooms = Math.floor(Math.random() * 5) + 1;
    let classification = '';
    
    if (type === 'Studio') {
      classification = 'T1';
    } else if (type === 'Appartement' || type === 'Loft') {
      // T1 to T5 based on bedroom count
      classification = `T${Math.min(bedrooms, 5)}`;
    }
    
    const ownerName = ownerNames[Math.floor(Math.random() * ownerNames.length)];
    const commission = Math.floor(Math.random() * 10) + 10;
    const bathrooms = Math.floor(Math.random() * 3) + 1;
    const size = Math.floor(Math.random() * 100) + 30;
    
    // Generate bed sizes
    const bedSizes = [];
    const possibleBedSizes = ['90x190', '140x190', '160x200', '180x200', '90x190 (superposé)'];
    
    for (let j = 0; j < bedrooms; j++) {
      const randomSize = possibleBedSizes[Math.floor(Math.random() * possibleBedSizes.length)];
      bedSizes.push(randomSize);
    }
    
    const possibleAmenities = [
      'Wifi', 'Climatisation', 'Parking', 'Télévision', 'Vue mer', 
      'Cuisine équipée', 'Piscine', 'Jardin', 'Balcon', 'Terrasse', 
      'Salle de sport', 'Non-fumeur', 'Animaux acceptés'
    ];
    
    const amenities = [];
    const amenitiesCount = Math.floor(Math.random() * 6) + 3;
    for (let j = 0; j < amenitiesCount; j++) {
      const randomIndex = Math.floor(Math.random() * possibleAmenities.length);
      if (!amenities.includes(possibleAmenities[randomIndex])) {
        amenities.push(possibleAmenities[randomIndex]);
      }
    }
    
    const streetNames = [
      'Rue de la République', 'Avenue des Champs-Élysées', 'Boulevard Saint-Michel',
      'Rue de Rivoli', 'Avenue Montaigne', 'Place de la Concorde', 'Rue du Faubourg Saint-Honoré'
    ];
    const cities = ['Lyon', 'Paris', 'Marseille', 'Bordeaux', 'Nice', 'Toulouse', 'Strasbourg'];
    const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
    const streetNumber = Math.floor(Math.random() * 100) + 1;
    const city = cities[Math.floor(Math.random() * cities.length)];
    const address = `${streetNumber} ${streetName}, ${city}`;
    
    const equipmentItems = {
      heating: ["Chauffage central", "Radiateurs électriques", "Chauffage au sol", "Pompe à chaleur"][Math.floor(Math.random() * 4)],
      kitchen: [
        "Four", "Micro-ondes", "Lave-vaisselle", "Réfrigérateur", "Plaques de cuisson", 
        "Cafetière", "Grille-pain", "Bouilloire"
      ].slice(0, Math.floor(Math.random() * 5) + 3),
      bathroom: [
        "Douche", "Baignoire", "Sèche-cheveux", "Machine à laver", "Sèche-linge"
      ].slice(0, Math.floor(Math.random() * 3) + 2)
    };
    
    // Update linens with bed size info
    const linens = {
      bedding: [
        `${bedrooms} jeux de draps`, 
        `${bedrooms * 2} taies d'oreiller`, 
        `${bedrooms} couettes`
      ],
      towels: [
        `${bedrooms * 2} grandes serviettes`, 
        `${bedrooms * 2} petites serviettes`, 
        `${bathrooms} tapis de bain`
      ],
      consumables: [
        "Papier toilette (4 rouleaux)", 
        "Savon liquide", 
        "Shampoing", 
        "Gel douche"
      ]
    };
    
    const photoCategories = ["Extérieur", "Salon", "Cuisine", "Chambre", "Salle de bain", "Chauffage", "Radiateur", "Équipement"];
    
    const photosCount = Math.floor(Math.random() * 5) + 8;
    const photos = Array.from({ length: photosCount }, (_, photoIndex) => {
      const category = photoCategories[Math.floor(Math.random() * photoCategories.length)];
      return {
        id: `${id}-photo-${photoIndex + 1}`,
        url: `https://placehold.co/600x400/008000/FFFFFF/png?text=Photo+${photoIndex + 1}`,
        caption: `${category} ${number}`,
        category: category
      };
    });
    
    // Initialize empty upsells statistics
    const upsells = {
      available: [
        { id: 1, name: 'Ménage supplémentaire', price: 50, sold: Math.floor(Math.random() * 10) },
        { id: 2, name: 'Petit-déjeuner', price: 15, sold: Math.floor(Math.random() * 20) },
        { id: 3, name: 'Transfert aéroport', price: 35, sold: Math.floor(Math.random() * 5) },
        { id: 4, name: 'Lit bébé', price: 10, sold: Math.floor(Math.random() * 3) }
      ],
      totalRevenue: Math.floor(Math.random() * 500)
    };
    
    return {
      id,
      number,
      name: `Logement ${number}`,
      type,
      classification,
      address,
      size,
      bedrooms,
      bedSizes,
      bathrooms,
      amenities,
      commission,
      photos,
      equipment: equipmentItems,
      linens,
      upsells,
      owner: {
        name: ownerName,
        email: `${ownerName.toLowerCase().replace(' ', '.')}@example.com`,
        phone: `+33 ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`
      },
      bacCode: Math.random().toString(36).substring(2, 7).toUpperCase(),
      digicode: Math.floor(Math.random() * 9000 + 1000).toString(),
      wifiCode: `WIFI-${Math.floor(Math.random() * 1000)}`,
      youtubeLink: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
      floor: `${Math.floor(Math.random() * 10) + 1}ème étage`,
      agentNotes: `Parking gratuit à 50m. Four à micro-ondes Samsung ref. M1234.`,
      attachments: [
        { id: 1, name: 'Manuel du four', url: 'https://example.com/manuel_four.pdf', type: 'manual' },
        { id: 2, name: 'Contrat de location', url: 'https://example.com/contrat.pdf', type: 'contract' }
      ]
    };
  });
};

// Add sample maintenance tasks for demo purposes
export const generateMaintenanceHistory = (properties) => {
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

// Helper functions for UI elements
export const getAmenityIcon = (amenity: string) => {
  switch (amenity.toLowerCase()) {
    case 'wifi': return 'Wifi';
    case 'climatisation': return 'Wind';
    case 'parking': return 'Car';
    case 'télévision': return 'Tv';
    case 'vue mer': return 'Waves';
    case 'cuisine équipée': return 'UtensilsCrossed';
    case 'non-fumeur': return 'CigaretteOff';
    default: return null;
  }
};

export const getUrgencyBadge = (urgency: UrgencyLevel) => {
  switch(urgency) {
    case 'low':
      return { color: "bg-blue-100 text-blue-800 hover:bg-blue-200", text: "Faible" };
    case 'medium':
      return { color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200", text: "Moyenne" };
    case 'high':
      return { color: "bg-orange-100 text-orange-800 hover:bg-orange-200", text: "Élevée" };
    case 'critical':
      return { color: "bg-red-100 text-red-800 hover:bg-red-200", text: "Critique" };
    default:
      return { color: "", text: "" };
  }
};

export const platformLinks = [
  { 
    name: "Airbnb", 
    url: (propertyId: string) => `https://airbnb.com/rooms/${propertyId}`, 
    icon: "Globe" 
  },
  { 
    name: "Booking.com", 
    url: (propertyId: string) => `https://booking.com/hotel/${propertyId}`, 
    icon: "Globe" 
  },
  { 
    name: "Abritel", 
    url: (propertyId: string) => `https://abritel.fr/location/${propertyId}`, 
    icon: "Globe" 
  }
];

export type Property = ReturnType<typeof generateProperties>[number];
