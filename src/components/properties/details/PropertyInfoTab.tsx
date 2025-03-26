
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/utils/propertyUtils';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface PropertyInfoTabProps {
  property: Property;
}

export const PropertyInfoTab = ({ property }: PropertyInfoTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProperty, setEditedProperty] = useState<Partial<Property>>({
    type: property.type,
    size: property.size,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    commission: property.commission,
  });

  const handleInputChange = (field: string, value: string | number) => {
    setEditedProperty({
      ...editedProperty,
      [field]: value,
    });
  };

  const handleSave = () => {
    // Dans un cas réel, vous enverriez ces données à une API
    // Ici, nous simulons juste la mise à jour et affichons un toast
    toast.success("Informations du logement mises à jour avec succès");
    setIsEditing(false);
    
    // En situation réelle, property serait mis à jour avec les valeurs de editedProperty
    // et les changements seraient propagés au composant parent
  };

  const handleCancel = () => {
    // Réinitialiser les changements
    setEditedProperty({
      type: property.type,
      size: property.size,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      commission: property.commission,
    });
    setIsEditing(false);
  };

  return (
    <TabsContent value="info" className="space-y-4 mt-4">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">Détails du logement</h3>
              {isEditing ? (
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCancel}
                    className="h-8 px-2"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Annuler
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={handleSave}
                    className="h-8 px-2"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Sauvegarder
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="h-8 px-2"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
              )}
            </div>
            {isEditing ? (
              // Mode édition
              <dl className="space-y-3">
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground">Type</dt>
                  <dd className="font-medium w-1/2">
                    <Select 
                      value={editedProperty.type || ''} 
                      onValueChange={(value) => handleInputChange('type', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Type de bien" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Appartement">Appartement</SelectItem>
                        <SelectItem value="Studio">Studio</SelectItem>
                        <SelectItem value="Loft">Loft</SelectItem>
                        <SelectItem value="Maison">Maison</SelectItem>
                        <SelectItem value="Villa">Villa</SelectItem>
                      </SelectContent>
                    </Select>
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground">Surface</dt>
                  <dd className="font-medium w-1/2">
                    <div className="flex items-center">
                      <Input 
                        type="number" 
                        value={editedProperty.size || ''} 
                        onChange={(e) => handleInputChange('size', Number(e.target.value))}
                        className="w-full"
                      />
                      <span className="ml-2">m²</span>
                    </div>
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground">Chambres</dt>
                  <dd className="font-medium w-1/2">
                    <Input 
                      type="number" 
                      value={editedProperty.bedrooms || ''} 
                      onChange={(e) => handleInputChange('bedrooms', Number(e.target.value))}
                      className="w-full"
                    />
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground">Salles de bain</dt>
                  <dd className="font-medium w-1/2">
                    <Input 
                      type="number" 
                      value={editedProperty.bathrooms || ''} 
                      onChange={(e) => handleInputChange('bathrooms', Number(e.target.value))}
                      className="w-full"
                    />
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground">Commission</dt>
                  <dd className="font-medium w-1/2">
                    <div className="flex items-center">
                      <Input 
                        type="number" 
                        value={editedProperty.commission || ''} 
                        onChange={(e) => handleInputChange('commission', Number(e.target.value))}
                        className="w-full"
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </dd>
                </div>
              </dl>
            ) : (
              // Mode affichage
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
            )}
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
