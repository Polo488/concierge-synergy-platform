
import { Badge } from '@/components/ui/badge';
import { Wifi, Wind, Car, Tv, Waves, UtensilsCrossed, CigaretteOff } from 'lucide-react';
import { getAmenityIcon } from '@/utils/propertyUtils';

interface PropertyAmenityBadgeProps {
  amenity: string;
}

export const PropertyAmenityBadge = ({ amenity }: PropertyAmenityBadgeProps) => {
  const getIcon = () => {
    const iconName = getAmenityIcon(amenity);
    switch (iconName) {
      case 'Wifi': return <Wifi className="h-4 w-4" />;
      case 'Wind': return <Wind className="h-4 w-4" />;
      case 'Car': return <Car className="h-4 w-4" />;
      case 'Tv': return <Tv className="h-4 w-4" />;
      case 'Waves': return <Waves className="h-4 w-4" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="h-4 w-4" />;
      case 'CigaretteOff': return <CigaretteOff className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <Badge variant="outline" className="text-xs rounded-full flex items-center gap-1">
      {getIcon()}
      {amenity}
    </Badge>
  );
};
