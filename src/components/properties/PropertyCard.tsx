
import { Building, BedDouble, Home, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/utils/propertyUtils';
import { PropertyAmenityBadge } from './PropertyAmenityBadge';

interface PropertyCardProps {
  property: Property;
  index: number;
  onClick: (property: Property) => void;
}

export const PropertyCard = ({ property, index, onClick }: PropertyCardProps) => {
  return (
    <Card 
      key={property.id} 
      className={`animate-slide-up stagger-${(index % 5) + 1} border border-border/40 overflow-hidden card-hover`}
      onClick={() => onClick(property)}
    >
      <div className="h-48 bg-muted relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <Home className="h-12 w-12 text-muted-foreground/30" />
        </div>
        <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full font-medium">
          N°{property.number}
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <Badge className="mb-2 rounded-full">{property.type}</Badge>
            <h3 className="font-semibold text-lg">{property.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3.5 w-3.5" />
              {property.address}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3 mt-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BedDouble className="h-4 w-4" />
            {property.bedrooms} {property.bedrooms > 1 ? 'chambres' : 'chambre'}
          </div>
          <div>|</div>
          <div>{property.size} m²</div>
        </div>
        
        <div className="mt-3">
          <p className="text-xs font-medium mb-1.5">Équipements:</p>
          <div className="flex flex-wrap gap-1.5">
            {property.amenities.slice(0, 3).map((amenity, i) => (
              <PropertyAmenityBadge key={i} amenity={amenity} />
            ))}
            {property.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs rounded-full">
                +{property.amenities.length - 3}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/30">
          <div className="text-sm">
            <span className="text-muted-foreground">Propriétaire:</span>{' '}
            <span className="font-medium">{property.owner.name}</span>
          </div>
          <div className="text-sm font-medium">
            Commission: {property.commission}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
