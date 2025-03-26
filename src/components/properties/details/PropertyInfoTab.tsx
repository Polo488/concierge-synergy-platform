
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/utils/propertyUtils';
import { TabsContent } from '@/components/ui/tabs';

interface PropertyInfoTabProps {
  property: Property;
}

export const PropertyInfoTab = ({ property }: PropertyInfoTabProps) => {
  return (
    <TabsContent value="info" className="space-y-4 mt-4">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium text-lg mb-4">Détails du logement</h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Type</dt>
                <dd className="font-medium">{property.type}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Surface</dt>
                <dd className="font-medium">{property.size} m²</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Chambres</dt>
                <dd className="font-medium">{property.bedrooms}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Salles de bain</dt>
                <dd className="font-medium">{property.bathrooms}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Commission</dt>
                <dd className="font-medium">{property.commission}%</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium text-lg mb-4">Propriétaire</h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Nom</dt>
                <dd className="font-medium">{property.owner.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium">{property.owner.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Téléphone</dt>
                <dd className="font-medium">{property.owner.phone}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium text-lg mb-4">Linge et consommables</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h4 className="font-medium mb-2">Linge de lit</h4>
              <ul className="list-disc ml-4 space-y-1 text-sm">
                {property.linens.bedding.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Serviettes</h4>
              <ul className="list-disc ml-4 space-y-1 text-sm">
                {property.linens.towels.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Consommables</h4>
              <ul className="list-disc ml-4 space-y-1 text-sm">
                {property.linens.consumables.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium text-lg mb-4">Aménités</h3>
          <div className="flex flex-wrap gap-2">
            {property.amenities.map((amenity, index) => (
              <Badge key={index} className="rounded-full">
                {amenity}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
