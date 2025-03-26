
import { Property } from '@/utils/propertyUtils';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Home, Building, Calendar, AlertCircle } from 'lucide-react';
import { PropertyAmenityBadge } from './PropertyAmenityBadge';
import { Progress } from '@/components/ui/progress';

interface PropertyCardProps {
  property: Property;
  index: number;
  onClick: (property: Property) => void;
}

export const PropertyCard = ({ property, index, onClick }: PropertyCardProps) => {
  const staggerDelay = (index % 9) * 0.05;
  
  // Get the first photo or a placeholder
  const coverPhoto = property.photos.length > 0
    ? property.photos[0].url
    : 'https://placehold.co/600x400/eee/999/png?text=No+Photo';
  
  // Calculate percentage for progress bar (for résidence principale only)
  const isResidencePrincipale = property.residenceType === 'principale';
  const percentage = isResidencePrincipale 
    ? Math.min(100, (property.nightsCount / property.nightsLimit) * 100)
    : 0;
  const isNearLimit = isResidencePrincipale && percentage >= 90;
  
  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-md cursor-pointer animate-fadeIn"
      style={{ animationDelay: `${staggerDelay}s` }}
      onClick={() => onClick(property)}
    >
      <div className="relative h-40 overflow-hidden">
        <img 
          src={coverPhoto} 
          alt={property.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        
        <div className="absolute top-2 right-2 flex gap-1">
          <Badge variant="secondary" className="text-xs">
            {property.type}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold truncate">
              {property.name}
            </h3>
            <div className="text-muted-foreground text-xs flex items-center mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate">{property.address}</span>
            </div>
          </div>
          <Badge 
            variant={property.residenceType === 'principale' ? 'outline' : 'secondary'}
            className={`text-xs flex items-center gap-1 ${
              property.residenceType === 'principale' ? 'border-blue-400 text-blue-700' : 'bg-green-100 text-green-800'
            }`}
          >
            <Calendar className="h-3 w-3" />
            {property.residenceType === 'principale' ? 'Principale' : 'Secondaire'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Building className="h-4 w-4" />
            {property.classification}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Home className="h-4 w-4" />
            {property.size} m²
          </div>
        </div>
        
        {isResidencePrincipale && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Nuits utilisées</span>
              <span className={isNearLimit ? 'text-red-500 font-medium' : ''}>
                {property.nightsCount} / {property.nightsLimit}
              </span>
            </div>
            <Progress 
              value={percentage} 
              className={`h-1.5 ${isNearLimit ? 'bg-red-200' : 'bg-gray-200'}`} 
            />
            {isNearLimit && (
              <div className="flex items-center gap-1 text-xs text-red-500 mt-1">
                <AlertCircle className="h-3 w-3" />
                <span>Proche de la limite légale</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-1 pt-0">
        {property.amenities.slice(0, 3).map((amenity, i) => (
          <PropertyAmenityBadge key={i} amenity={amenity} />
        ))}
        {property.amenities.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{property.amenities.length - 3}
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
};
