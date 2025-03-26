
import { Card } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Camera } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

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
  return (
    <TabsContent value="photos" className="space-y-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-lg">Photos</h3>
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
      </div>
      
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo) => (
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
        ))}
      </div>
    </TabsContent>
  );
};
