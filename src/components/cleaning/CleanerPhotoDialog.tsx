
import { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Camera, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { CleaningTask, CleaningPhoto } from '@/types/cleaning';

interface CleanerPhotoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: CleaningTask | null;
  agentName?: string;
  onSubmit: (data: { taskId: number; photos: CleaningPhoto[]; comment: string }) => void;
}

export const CleanerPhotoDialog = ({
  open,
  onOpenChange,
  task,
  agentName,
  onSubmit,
}: CleanerPhotoDialogProps) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const readers = Array.from(files).map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((results) => {
      setPreviews((prev) => [...prev, ...results]);
    });
  };

  const removePhoto = (idx: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const reset = () => {
    setPreviews([]);
    setComment('');
  };

  const handleSubmit = () => {
    if (!task) return;
    const photos: CleaningPhoto[] = previews.map((url, i) => ({
      id: `${task.id}-${Date.now()}-${i}`,
      url,
      caption: '',
      timestamp: new Date().toISOString(),
      agent: agentName || task.cleaningAgent || 'Prestataire',
    }));
    onSubmit({ taskId: task.id, photos, comment });
    reset();
    onOpenChange(false);
  };

  const handleSkip = () => {
    if (!task) return;
    onSubmit({ taskId: task.id, photos: [], comment: '' });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Ménage terminé
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {task && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{task.property}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label>Photos du logement (optionnel)</Label>
            <p className="text-xs text-muted-foreground">
              Ajoute des photos qui serviront à valider la qualité du ménage.
            </p>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />

            <div className="grid grid-cols-3 gap-2">
              {previews.map((src, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-lg overflow-hidden border border-border bg-muted"
                >
                  <img src={src} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background"
                    aria-label="Retirer la photo"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
              >
                {previews.length === 0 ? (
                  <Camera className="h-6 w-6" />
                ) : (
                  <ImageIcon className="h-6 w-6" />
                )}
                <span className="text-[11px]">Ajouter</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cleaner-comment">Commentaire (optionnel)</Label>
            <Textarea
              id="cleaner-comment"
              placeholder="Une remarque à transmettre ? (état du logement, anomalie…)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[70px]"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={handleSkip}>
            Passer
          </Button>
          <Button onClick={handleSubmit}>Valider</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
