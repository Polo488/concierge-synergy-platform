
import { Property, Booking } from './types';

// Sample properties data
export const properties: Property[] = [
  { 
    id: 1, 
    name: 'Appartement 12 Rue du Port', 
    capacity: 4, 
    pricePerNight: 95,
    bacCode: 'A1234',
    wifiCode: 'WIFI-PORT-2024',
    floor: '3ème étage',
    youtubeLink: 'https://youtu.be/sample1',
    agentNotes: 'Parking à 100m sur la droite. Four Whirlpool référence XYZ123. Le volet de la cuisine est parfois difficile à manœuvrer.'
  },
  { 
    id: 2, 
    name: 'Studio 8 Avenue des Fleurs', 
    capacity: 2, 
    pricePerNight: 65,
    bacCode: 'B5678',
    wifiCode: 'FLEURS-WIFI',
    floor: 'Rez-de-chaussée',
    agentNotes: 'Clés à récupérer chez le gardien si le client arrive après 20h.'
  },
  { 
    id: 3, 
    name: 'Loft 72 Rue des Arts', 
    capacity: 3, 
    pricePerNight: 85,
    bacCode: 'C9012',
    wifiCode: 'ARTS-WIFI-SECURE',
    floor: '5ème étage',
    youtubeLink: 'https://youtu.be/sample2',
    agentNotes: 'La balnéo peut prendre jusqu\'à 30min pour chauffer. Pression d\'eau parfois faible en soirée.'
  },
  { 
    id: 4, 
    name: 'Maison 23 Rue de la Paix', 
    capacity: 6, 
    pricePerNight: 120,
    bacCode: 'D3456',
    wifiCode: 'PAIX-NET-2024',
    floor: 'Maison sur 2 niveaux',
    agentNotes: 'Jardin à entretenir en été. Voisin sensible au bruit après 22h.'
  },
  { 
    id: 5, 
    name: 'Appartement 45 Boulevard Central', 
    capacity: 4, 
    pricePerNight: 90,
    bacCode: 'E7890',
    wifiCode: 'CENTRAL-WIFI',
    floor: '2ème étage',
    youtubeLink: 'https://youtu.be/sample3',
    agentNotes: 'Chauffage à régler manuellement en hiver. Thermostat dans l\'entrée.'
  },
  { 
    id: 6, 
    name: 'Studio 15 Rue des Lilas', 
    capacity: 2, 
    pricePerNight: 70,
    bacCode: 'F1234',
    wifiCode: 'LILAS-NET',
    floor: '1er étage',
    agentNotes: 'Interphone parfois capricieux, demander aux clients de nous appeler en cas de problème d\'accès.'
  },
  { 
    id: 7, 
    name: 'Appartement 28 Avenue Victor Hugo', 
    capacity: 5, 
    pricePerNight: 110,
    bacCode: 'G5678',
    wifiCode: 'HUGO-WIFI-2024',
    floor: '4ème étage avec ascenseur',
    youtubeLink: 'https://youtu.be/sample4',
    agentNotes: 'Local à vélos au sous-sol. Code: 1289. Cuisine équipée avec robot multifonction (mode d\'emploi dans le tiroir).'
  },
];

// Sample bookings data
export const bookingsData: Booking[] = [
  { 
    id: 1, 
    propertyId: 1, 
    guestName: 'Martin Dupont', 
    checkIn: new Date(2024, 2, 15), 
    checkOut: new Date(2024, 2, 18),
    status: 'confirmed',
    color: '#4CAF50'
  },
  { 
    id: 2, 
    propertyId: 2, 
    guestName: 'Sophie Martin', 
    checkIn: new Date(2024, 2, 16), 
    checkOut: new Date(2024, 2, 20),
    status: 'confirmed',
    color: '#4CAF50'
  },
  { 
    id: 3, 
    propertyId: 3, 
    guestName: 'Jean Durand', 
    checkIn: new Date(2024, 2, 18), 
    checkOut: new Date(2024, 2, 25),
    status: 'confirmed',
    color: '#4CAF50'
  },
  { 
    id: 4, 
    propertyId: 1, 
    guestName: 'Julie Petit', 
    checkIn: new Date(2024, 2, 25), 
    checkOut: new Date(2024, 2, 28),
    status: 'pending',
    color: '#FFC107'
  },
  { 
    id: 5, 
    propertyId: 4, 
    guestName: 'Thomas Bernard', 
    checkIn: new Date(2024, 2, 10), 
    checkOut: new Date(2024, 2, 15),
    status: 'completed',
    color: '#9E9E9E'
  },
  { 
    id: 6, 
    propertyId: 5, 
    guestName: 'Camille Leroy', 
    checkIn: new Date(2024, 3, 1), 
    checkOut: new Date(2024, 3, 7),
    status: 'confirmed',
    color: '#4CAF50'
  },
  { 
    id: 7, 
    propertyId: 2, 
    guestName: 'Mathieu Roux', 
    checkIn: new Date(2024, 3, 10), 
    checkOut: new Date(2024, 3, 15),
    status: 'confirmed',
    color: '#4CAF50'
  },
];

// Function to get bookings for a specific month (not implemented fully)
export const getBookingsForMonth = (date: Date, properties: Property[]): Booking[] => {
  // For this demo, we'll just return all bookings
  // In a real implementation, this would filter by the selected month
  return bookingsData;
};
