import { useState, useEffect } from 'react';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { CalendarDays, Send } from 'lucide-react';
import type { CalendarProperty } from '@/types/calendar';
import type { BlockMotif } from '@/types/blockRequest';
import { MOTIF_LABELS } from '@/types/blockRequest';

interface OwnerBlockRequestDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  property?: CalendarProperty;
  startDate?: Date;
  endDate?: Date;
  /** 'direct' = immediate block, 'request' = submit for admin approval */
  mode: 'direct' | 'request';
  onSubmit: (data: { motif: BlockMotif; comment: string }) => void;
}

export function OwnerBlockRequestDialog({
  open,
  onOpenChange,
  property,
  startDate,
  endDate,
  mode,
  onSubmit,
}: OwnerBlockRequestDialogProps) {
  const [motif, setMotif] = useState<BlockMotif>('personal');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (open) {
      setMotif('personal');
      setComment('');
    }
  }, [open]);

  if (!property || !startDate || !endDate) return null;

  const nights = Math.max(1, differenceInDays(endDate, startDate));
  const isDirect = mode === 'direct';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            {isDirect ? 'Bloquer ces dates' : 'Demander un blocage'}
          </DialogTitle>
          <DialogDescription>
            {isDirect
              ? 'Le blocage sera effectif immédiatement et synchronisé sur vos canaux.'
              : 'Votre demande sera envoyée à votre gestionnaire pour validation.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-lg border border-border/50 bg-muted/30 p-3 text-sm">
            <div className="font-semibold">{property.name}</div>
            <div className="text-muted-foreground mt-1">
              Du <strong>{format(startDate, 'd MMM yyyy', { locale: fr })}</strong> au{' '}
              <strong>{format(endDate, 'd MMM yyyy', { locale: fr })}</strong> — {nights} nuit
              {nights > 1 ? 's' : ''}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Motif</Label>
            <RadioGroup value={motif} onValueChange={(v) => setMotif(v as BlockMotif)}>
              {(Object.keys(MOTIF_LABELS) as BlockMotif[]).map((m) => (
                <div key={m} className="flex items-center space-x-2">
                  <RadioGroupItem value={m} id={`motif-${m}`} />
                  <Label htmlFor={`motif-${m}`} className="font-normal cursor-pointer">
                    {MOTIF_LABELS[m]}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Commentaire (optionnel)</Label>
            <Textarea
              id="comment"
              placeholder="Précisez les détails si nécessaire…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={() => onSubmit({ motif, comment })} className="gap-2">
            <Send className="w-4 h-4" />
            {isDirect ? 'Bloquer' : 'Envoyer la demande'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
