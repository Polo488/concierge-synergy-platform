
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, Edit, Save, X, Plus, Trash, Image } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from 'sonner';

interface Photo {
  id: string;
  url: string;
  caption: string;
  category: string;
}

interface PropertyPhotosTabProps {
  photos: Photo[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  allCategories: string[];
}

export const PropertyPhotosTab = ({ 
  photos, 
  selectedCategory, 
  onCategoryChange,
  allCategories 
}: PropertyPhotosTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPhotos, setEditedPhotos] = useState<Photo[]>([...photos]);
  const [newPhoto, setNewPhoto] = useState({
    url: '',
    caption: '',
    category: allCategories[0] || 'Extérieur'
  });
  const [newCategory, setNewCategory] = useState('');

  const handleSave = () => {
    toast.success("Photos mises à jour avec succès");
    setIsEditing(false);
    // En situation réelle, les photos seraient mises à jour dans la base de données
  };

  const handleCancel = () => {
    setEditedPhotos([...photos]);
    setNewPhoto({
      url: '',
      caption: '',
      category: allCategories[0] || 'Extérieur'
    });
    setNewCategory('');
    setIsEditing(false);
  };

  const addPhoto = () => {
    if (newPhoto.url.trim() && newPhoto.caption.trim()) {
      const photoToAdd = {
        id: `new-photo-${Date.now()}`,
        url: newPhoto.url.trim(),
        caption: newPhoto.caption.trim(),
        category: newPhoto.category
      };
      
      setEditedPhotos([...editedPhotos, photoToAdd]);
      setNewPhoto({
        url: '',
        caption: '',
        category: newPhoto.category
      });
    }
  };

  const removePhoto = (id: string) => {
    setEditedPhotos(editedPhotos.filter(photo => photo.id !== id));
  };

  const updatePhotoCaption = (id: string, caption: string) => {
    setEditedPhotos(editedPhotos.map(photo => 
      photo.id === id ? {...photo, caption} : photo
    ));
  };

  const updatePhotoCategory = (id: string, category: string) => {
    setEditedPhotos(editedPhotos.map(photo => 
      photo.id === id ? {...photo, category} : photo
    ));
  };

  const addNewCategory = () => {
    if (newCategory.trim() && !allCategories.includes(newCategory.trim())) {
      // In a real app, we would update the allCategories array
      // For now, just update the newPhoto object to use this category
      setNewPhoto({...newPhoto, category: newCategory.trim()});
      setNewCategory('');
      toast.success(`Nouvelle catégorie "${newCategory}" ajoutée`);
    }
  };

  return (
    <TabsContent value="photos" className="space-y-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-lg">Photos</h3>
        <div className="flex items-center gap-2">
          <Select 
            value={selectedCategory} 
            onValueChange={onCategoryChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Toutes">Toutes les catégories</SelectItem>
              {allCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
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
      </div>
      
      {isEditing && (
        <Card className="p-4 mb-4">
          <h4 className="font-medium mb-3">Ajouter une nouvelle photo</h4>
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium block mb-1">URL de l'image</label>
                <Input
                  value={newPhoto.url}
                  onChange={(e) => setNewPhoto({...newPhoto, url: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Légende</label>
                <Input
                  value={newPhoto.caption}
                  onChange={(e) => setNewPhoto({...newPhoto, caption: e.target.value})}
                  placeholder="Description de la photo"
                />
              </div>
            </div>
            
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium block mb-1">Catégorie</label>
                <Select 
                  value={newPhoto.category} 
                  onValueChange={(value) => setNewPhoto({...newPhoto, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Nouvelle catégorie</label>
                <div className="flex gap-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Nom de la catégorie"
                  />
                  <Button 
                    variant="outline" 
                    onClick={addNewCategory}
                    className="shrink-0"
                    disabled={!newCategory.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={addPhoto}
              disabled={!newPhoto.url.trim() || !newPhoto.caption.trim()}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter la photo
            </Button>
          </div>
        </Card>
      )}
      
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isEditing ? (
          editedPhotos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden">
              <div className="aspect-video relative bg-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-muted-foreground/30" />
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button 
                    variant="destructive"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => removePhoto(photo.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-2 space-y-2">
                  <Input
                    value={photo.caption}
                    onChange={(e) => updatePhotoCaption(photo.id, e.target.value)}
                    placeholder="Légende"
                    className="text-xs h-7"
                  />
                  <Select 
                    value={photo.category} 
                    onValueChange={(value) => updatePhotoCategory(photo.id, value)}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {allCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          ))
        ) : (
          photos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden">
              <div className="aspect-video relative bg-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-muted-foreground/30" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-2 text-xs">
                  {photo.caption}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </TabsContent>
  );
};
