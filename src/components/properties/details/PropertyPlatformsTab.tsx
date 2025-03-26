
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, ExternalLink, Edit, Save, X, Plus, Trash } from 'lucide-react';
import { Property, platformLinks } from '@/utils/propertyUtils';
import { toast } from 'sonner';

interface PropertyPlatformsTabProps {
  property: Property;
}

export const PropertyPlatformsTab = ({ property }: PropertyPlatformsTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlatforms, setEditedPlatforms] = useState(
    platformLinks.map(platform => ({
      name: platform.name,
      customUrl: '', // Dans un cas réel, cela viendrait de la propriété
      useDefault: true // Indique si on utilise l'URL par défaut ou une URL personnalisée
    }))
  );
  const [newPlatform, setNewPlatform] = useState({
    name: '',
    url: ''
  });

  const handleSave = () => {
    toast.success("Plateformes mises à jour avec succès");
    setIsEditing(false);
    // En situation réelle, les plateformes seraient mises à jour dans la base de données
  };

  const handleCancel = () => {
    setEditedPlatforms(
      platformLinks.map(platform => ({
        name: platform.name,
        customUrl: '',
        useDefault: true
      }))
    );
    setNewPlatform({ name: '', url: '' });
    setIsEditing(false);
  };

  const updatePlatformUrl = (index: number, url: string) => {
    const updatedPlatforms = [...editedPlatforms];
    updatedPlatforms[index] = {
      ...updatedPlatforms[index],
      customUrl: url,
      useDefault: false
    };
    setEditedPlatforms(updatedPlatforms);
  };

  const toggleUseDefault = (index: number) => {
    const updatedPlatforms = [...editedPlatforms];
    updatedPlatforms[index] = {
      ...updatedPlatforms[index],
      useDefault: !updatedPlatforms[index].useDefault
    };
    setEditedPlatforms(updatedPlatforms);
  };

  const addPlatform = () => {
    if (newPlatform.name.trim() && newPlatform.url.trim()) {
      setEditedPlatforms([
        ...editedPlatforms,
        {
          name: newPlatform.name.trim(),
          customUrl: newPlatform.url.trim(),
          useDefault: false
        }
      ]);
      setNewPlatform({ name: '', url: '' });
    }
  };

  const removePlatform = (index: number) => {
    // Ne supprime que les plateformes personnalisées (non par défaut)
    if (index >= platformLinks.length) {
      const updatedPlatforms = [...editedPlatforms];
      updatedPlatforms.splice(index, 1);
      setEditedPlatforms(updatedPlatforms);
    }
  };

  const getPlatformUrl = (platform, index) => {
    if (index < platformLinks.length && platform.useDefault) {
      return platformLinks[index].url(property.id);
    }
    return platform.customUrl;
  };

  return (
    <TabsContent value="platforms" className="space-y-4 mt-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-lg">Plateformes de location</h3>
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
          
          <div className="space-y-4">
            {editedPlatforms.map((platform, index) => (
              <div key={index} className="flex items-start gap-3">
                <Globe className="h-4 w-4 mt-1" />
                {isEditing ? (
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{platform.name}</p>
                      {index >= platformLinks.length && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePlatform(index)}
                          className="h-7 w-7 p-0 text-destructive"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {index < platformLinks.length && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant={platform.useDefault ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleUseDefault(index)}
                          className="text-xs h-7"
                        >
                          URL par défaut
                        </Button>
                        <Button
                          variant={!platform.useDefault ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleUseDefault(index)}
                          className="text-xs h-7"
                        >
                          URL personnalisée
                        </Button>
                      </div>
                    )}
                    
                    {!platform.useDefault && (
                      <Input
                        value={platform.customUrl}
                        onChange={(e) => updatePlatformUrl(index, e.target.value)}
                        placeholder="URL personnalisée"
                        className="w-full"
                      />
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="font-medium">{platform.name}</p>
                    <p className="text-muted-foreground">
                      <a 
                        href={getPlatformUrl(platform, index)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        Voir l'annonce <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                )}
              </div>
            ))}

            {isEditing && (
              <div className="border p-3 rounded-md space-y-3 mt-4">
                <h4 className="text-sm font-medium">Ajouter une plateforme</h4>
                <div className="space-y-2">
                  <Input
                    placeholder="Nom de la plateforme"
                    value={newPlatform.name}
                    onChange={(e) => setNewPlatform({...newPlatform, name: e.target.value})}
                  />
                  <Input
                    placeholder="URL de l'annonce"
                    value={newPlatform.url}
                    onChange={(e) => setNewPlatform({...newPlatform, url: e.target.value})}
                  />
                  <Button
                    onClick={addPlatform}
                    variant="outline"
                    size="sm"
                    disabled={!newPlatform.name.trim() || !newPlatform.url.trim()}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter la plateforme
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
