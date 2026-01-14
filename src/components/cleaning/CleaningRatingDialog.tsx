
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Star, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QualityTag } from '@/types/quality';
import { CleaningTask } from '@/types/cleaning';

interface CleaningRatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: CleaningTask | null;
  onSubmit: (rating: {
    taskId: number;
    rating: number;
    comment: string;
    tags: QualityTag[];
    reworkRequired: boolean;
    reworkReason: string;
  }) => void;
}

const QUALITY_TAGS: { value: QualityTag; label: string; emoji: string }[] = [
  { value: 'dust', label: 'Poussière', emoji: '🧹' },
  { value: 'bathroom', label: 'Salle de bain', emoji: '🚿' },
  { value: 'linen', label: 'Linge', emoji: '🛏️' },
  { value: 'kitchen', label: 'Cuisine', emoji: '🍳' },
  { value: 'smell', label: 'Odeur', emoji: '👃' },
  { value: 'floors', label: 'Sols', emoji: '🧽' },
  { value: 'missing_items', label: 'Objets manquants', emoji: '📦' },
  { value: 'windows', label: 'Vitres', emoji: '🪟' },
  { value: 'appliances', label: 'Appareils', emoji: '🔌' },
  { value: 'general', label: 'Général', emoji: '✨' },
];

export const CleaningRatingDialog = ({
  open,
  onOpenChange,
  task,
  onSubmit,
}: CleaningRatingDialogProps) => {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<QualityTag[]>([]);
  const [reworkRequired, setReworkRequired] = useState(false);
  const [reworkReason, setReworkReason] = useState('');

  const handleTagToggle = (tag: QualityTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (!task) return;
    
    onSubmit({
      taskId: task.id,
      rating,
      comment,
      tags: selectedTags,
      reworkRequired,
      reworkReason,
    });

    // Reset form
    setRating(5);
    setComment('');
    setSelectedTags([]);
    setReworkRequired(false);
    setReworkReason('');
    onOpenChange(false);
  };

  const handleSkip = () => {
    if (!task) return;
    
    onSubmit({
      taskId: task.id,
      rating: 0,
      comment: '',
      tags: [],
      reworkRequired: false,
      reworkReason: '',
    });

    // Reset form
    setRating(5);
    setComment('');
    setSelectedTags([]);
    setReworkRequired(false);
    setReworkReason('');
    onOpenChange(false);
  };

  const displayRating = hoveredRating || rating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Noter le ménage
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Property info */}
          {task && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{task.property}</span>
              {task.cleaningAgent && (
                <span> • Agent: {task.cleaningAgent}</span>
              )}
            </div>
          )}

          {/* Star rating */}
          <div className="space-y-2">
            <Label>Note qualité</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      'h-8 w-8 transition-colors',
                      star <= displayRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground/30'
                    )}
                  />
                </button>
              ))}
              <span className="ml-3 text-lg font-semibold">
                {displayRating}/5
              </span>
            </div>
          </div>

          {/* Quality tags */}
          <div className="space-y-2">
            <Label>Points à signaler (optionnel)</Label>
            <div className="flex flex-wrap gap-2">
              {QUALITY_TAGS.map((tag) => (
                <Badge
                  key={tag.value}
                  variant={selectedTags.includes(tag.value) ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer transition-all hover:scale-105',
                    selectedTags.includes(tag.value) && 'bg-primary'
                  )}
                  onClick={() => handleTagToggle(tag.value)}
                >
                  <span className="mr-1">{tag.emoji}</span>
                  {tag.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Commentaire (optionnel)</Label>
            <Textarea
              id="comment"
              placeholder="Ajouter un commentaire sur la qualité du ménage..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Rework required */}
          <div className="space-y-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <Label htmlFor="rework" className="text-sm font-medium">
                  Repassage requis
                </Label>
              </div>
              <Switch
                id="rework"
                checked={reworkRequired}
                onCheckedChange={setReworkRequired}
              />
            </div>
            
            {reworkRequired && (
              <Textarea
                placeholder="Raison du repassage..."
                value={reworkReason}
                onChange={(e) => setReworkReason(e.target.value)}
                className="min-h-[60px] bg-background"
              />
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={handleSkip}>
            Passer
          </Button>
          <Button onClick={handleSubmit}>
            Enregistrer la note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
