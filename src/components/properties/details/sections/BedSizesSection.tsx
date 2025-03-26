
import { Card, CardContent } from '@/components/ui/card';
import { BedDouble } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { EditableSection } from './EditableSection';
import { Button } from '@/components/ui/button';
import { PlusCircle, X } from 'lucide-react';
import { useState } from 'react';

interface BedSizesSectionProps {
  bedSizes: string[];
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onUpdateBedSizes: (bedSizes: string[]) => void;
}

export const BedSizesSection = ({
  bedSizes,
  isEditing,
  onSave,
  onCancel,
  onUpdateBedSizes
}: BedSizesSectionProps) => {
  const [editedBedSizes, setEditedBedSizes] = useState<string[]>([...bedSizes]);
  const [newBedSize, setNewBedSize] = useState('');

  const handleAddBedSize = () => {
    if (newBedSize.trim()) {
      const updatedSizes = [...editedBedSizes, newBedSize.trim()];
      setEditedBedSizes(updatedSizes);
      onUpdateBedSizes(updatedSizes);
      setNewBedSize('');
    }
  };

  const handleRemoveBedSize = (index: number) => {
    const updatedSizes = editedBedSizes.filter((_, i) => i !== index);
    setEditedBedSizes(updatedSizes);
    onUpdateBedSizes(updatedSizes);
  };

  const handleChangeBedSize = (index: number, value: string) => {
    const updatedSizes = [...editedBedSizes];
    updatedSizes[index] = value;
    setEditedBedSizes(updatedSizes);
    onUpdateBedSizes(updatedSizes);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <EditableSection
          title="Tailles des lits"
          isEditing={isEditing}
          onEdit={() => {}}
          onSave={onSave}
          onCancel={onCancel}
        >
          {isEditing ? (
            <div className="space-y-4">
              {editedBedSizes.map((size, index) => (
                <div key={index} className="flex items-center gap-2">
                  <BedDouble className="h-5 w-5 flex-shrink-0 text-primary" />
                  <Input
                    value={size}
                    onChange={(e) => handleChangeBedSize(index, e.target.value)}
                    placeholder="ex: 160x200"
                    className="flex-grow"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveBedSize(index)}
                    className="h-8 w-8 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-4">
                <Input
                  value={newBedSize}
                  onChange={(e) => setNewBedSize(e.target.value)}
                  placeholder="Ajouter une taille de lit (ex: 160x200)"
                  className="flex-grow"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddBedSize();
                    }
                  }}
                />
                <Button
                  variant="outline"
                  onClick={handleAddBedSize}
                  className="shrink-0"
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {bedSizes.length > 0 ? (
                bedSizes.map((size, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <BedDouble className="h-5 w-5 text-primary" />
                    <span>Lit {index + 1}: {size}</span>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground italic">Aucune taille de lit spécifiée</div>
              )}
            </div>
          )}
        </EditableSection>
      </CardContent>
    </Card>
  );
};
