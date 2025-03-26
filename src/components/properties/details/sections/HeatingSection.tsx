
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Thermometer } from 'lucide-react';
import { EditableSection } from './EditableSection';

interface HeatingSectionProps {
  heating: string;
  isEditing: boolean;
  onUpdateHeating: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const HeatingSection = ({
  heating,
  isEditing,
  onUpdateHeating,
  onSave,
  onCancel
}: HeatingSectionProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <EditableSection
          title="Chauffage et climatisation"
          isEditing={isEditing}
          onEdit={() => {}}
          onSave={onSave}
          onCancel={onCancel}
        >
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-primary" />
              <Input 
                value={heating} 
                onChange={(e) => onUpdateHeating(e.target.value)}
                className="w-full"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-primary" />
              <span>{heating}</span>
            </div>
          )}
        </EditableSection>
      </CardContent>
    </Card>
  );
};
