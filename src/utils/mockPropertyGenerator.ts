import { Property, PropertyType, PropertyClassification, ResidenceType } from '@/types/property';

export const generateProperties = (): Property[] => {
  const propertyTypes: PropertyType[] = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6+'];
  const propertyClassifications: PropertyClassification[] = ['Appartement', 'Studio', 'Loft', 'Maison', 'Villa'];
  const ownerNames = [
    'Thomas Dubois', 'Marie Lefevre', 'Jean Martin', 'Sophie Bernard', 'Pierre Durand',
    'Isabelle Moreau', 'Michel Lambert', 'Anne Rousseau', 'Philippe Girard', 'Julie Leroy'
  ];
  
  return Array.from({ length: 400 }, (_, i) => {
    const id = (i + 1).toString();
    const number = id.padStart(2, '0');
    
    // Assign type (T1-T6+) based on bedroom count
    const bedrooms = Math.floor(Math.random() * 5) + 1;
    const type = `T${Math.min(bedrooms, 6)}${bedrooms >= 6 ? '+' : ''}` as PropertyType;
    
    // Assign classification
    const classificationIndex = Math.floor(Math.random() * propertyClassifications.length);
    const classification = propertyClassifications[classificationIndex];
    
    const ownerName = ownerNames[Math.floor(Math.random() * ownerNames.length)];
    const commission = Math.floor(Math.random() * 10) + 10;
    const bathrooms = Math.floor(Math.random() * 3) + 1;
    const size = Math.floor(Math.random() * 100) + 30;
    
    // Determine residence type - 30% principale, 70% secondaire
    const residenceType: ResidenceType = Math.random() < 0.3 ? 'principale' : 'secondaire';
    
    // For résidences principales, generate a random number of nights used
    const nightsLimit = residenceType === 'principale' ? 120 : 365;
    const nightsCount = residenceType === 'principale' 
      ? Math.floor(Math.random() * nightsLimit) 
      : Math.floor(Math.random() * 250); // For secondaires, just a random number for demo
    
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
      ],
      residenceType,
      nightsCount,
      nightsLimit,
      // Add some sample banner notes for demo
      internalBannerNote: i % 5 === 0 ? 'Attention: Le propriétaire sera présent du 15 au 20 du mois. Contacter avant toute intervention.' : undefined,
      internalBannerNoteUpdatedAt: i % 5 === 0 ? new Date().toISOString() : undefined,
      internalBannerNoteUpdatedBy: i % 5 === 0 ? 'Marie Dupont' : undefined,
    };
  });
};
