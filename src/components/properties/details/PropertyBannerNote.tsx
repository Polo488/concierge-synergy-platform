import { useState } from 'react';
import { AlertTriangle, Edit2, X, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PropertyBannerNoteProps {
  note?: string;
  updatedAt?: string;
  updatedBy?: string;
  onSave: (note: string) => void;
  canEdit?: boolean;
}

export const PropertyBannerNote = ({
  note,
  updatedAt,
  updatedBy,
  onSave,
  canEdit = true,
}: PropertyBannerNoteProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState(note || '');
  const { toast } = useToast();

  const handleSave = () => {
    onSave(editedNote);
    setIsEditing(false);
    toast({
      title: "Note mise à jour",
      description: "La note interne a été enregistrée avec succès.",
    });
  };

  const handleCancel = () => {
    setEditedNote(note || '');
    setIsEditing(false);
  };

  const hasNote = note && note.trim().length > 0;

  if (isEditing) {
    return (
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span className="font-medium text-amber-800 dark:text-amber-300 text-sm">
            Note interne prioritaire
          </span>
        </div>
        <Textarea
          value={editedNote}
          onChange={(e) => setEditedNote(e.target.value)}
          placeholder="Ajoutez une note interne importante pour ce logement..."
          className="min-h-[80px] bg-white dark:bg-background border-amber-300 dark:border-amber-700 focus:border-amber-500"
          autoFocus
        />
        <div className="flex justify-end gap-2 mt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="text-muted-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Annuler
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Check className="h-4 w-4 mr-1" />
            Enregistrer
          </Button>
        </div>
      </div>
    );
  }

  if (!hasNote && !canEdit) {
    return null;
  }

  return (
    <div
      className={`rounded-lg p-4 mb-4 ${
        hasNote
          ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800'
          : 'bg-muted/50 border border-dashed border-muted-foreground/30'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 flex-1">
          <AlertTriangle
            className={`h-4 w-4 mt-0.5 ${
              hasNote
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-muted-foreground'
            }`}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`font-medium text-sm ${
                  hasNote
                    ? 'text-amber-800 dark:text-amber-300'
                    : 'text-muted-foreground'
                }`}
              >
                Note interne prioritaire
              </span>
              {hasNote && updatedAt && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(new Date(updatedAt), 'dd MMM yyyy à HH:mm', { locale: fr })}
                  {updatedBy && ` par ${updatedBy}`}
                </span>
              )}
            </div>
            <p
              className={`text-sm ${
                hasNote
                  ? 'text-amber-900 dark:text-amber-200'
                  : 'text-muted-foreground italic'
              }`}
            >
              {hasNote ? note : 'Ajoutez une note interne pour ce logement…'}
            </p>
          </div>
        </div>
        {canEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className={`shrink-0 ${
              hasNote
                ? 'text-amber-700 hover:text-amber-800 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900/50'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
