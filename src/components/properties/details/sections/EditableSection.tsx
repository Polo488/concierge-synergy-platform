
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Save, X } from 'lucide-react';

interface EditableSectionProps {
  title: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  children: ReactNode;
}

export const EditableSection = ({
  title,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  children,
}: EditableSectionProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-lg">{title}</h3>
        {isEditing ? (
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onCancel}
              className="h-8 px-2"
            >
              <X className="h-4 w-4 mr-1" />
              Annuler
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={onSave}
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
            onClick={onEdit}
            className="h-8 px-2"
          >
            <Edit className="h-4 w-4 mr-1" />
            Modifier
          </Button>
        )}
      </div>
      {children}
    </>
  );
};
