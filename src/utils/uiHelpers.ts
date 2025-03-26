
import { UrgencyLevel } from '@/types/maintenance';

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
