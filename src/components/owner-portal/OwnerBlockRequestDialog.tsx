import { useEffect, useState } from 'react';
import { format } from 'date-fns';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Info, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { MOTIF_LABELS } from '@/types/blockRequest';
import type { BlockMotif, BlockMode } from '@/types/blockRequest';
import { useBlockRequests } from '@/hooks/useBlockRequests';
import { useAuth } from '@/contexts/AuthContext';
import type { CalendarProperty } from '@/types/calendar';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  property: CalendarProperty | null;
  startDate: Date | null;
  endDate?: Date | null;
}

export function OwnerBlockRequestDialog({
  open,
  onOpenChange,
  property,
  startDate,
  endDate,
}: Props) {
  const { user } = useAuth();
  const { create, approve, modeFor } = useBlockRequests();

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [motif, setMotif] = useState<BlockMotif>('personal');
  const [comment, setComment] = useState('');

  const mode: BlockMode = property ? modeFor(property.id) : 'request';

  useEffect(() => {
    if (open && startDate) {
      const s = format(startDate, 'yyyy-MM-dd');
      const e = format(endDate ?? startDate, 'yyyy-MM-dd');
      setStart(s);
      setEnd(e);
      setMotif('personal');
      setComment('');
    }
  }, [open, startDate, endDate]);

  if (!property) return null;

  const handleSubmit = () => {
    if (!start || !end) {
      toast.error('Sélectionnez une période');
      return;
    }
    const s = new Date(start);
    const e = new Date(end);
    if (e < s) {
      toast.error('La date de fin doit être après la date de début');
      return;
    }
    const req = create({
      propertyId: property.id,
      propertyName: property.name,
      ownerId: user?.id ?? '7',
      ownerName: user?.name ?? 'Propriétaire',
      startDate: s,
      endDate: e,
      motif,
      comment: comment.trim() || undefined,
    });

    if (mode === 'direct') {
      approve(req.id, 'Blocage direct (paramètre logement)');
      toast.success('Période bloquée');
    } else {
      toast.success('Demande envoyée à votre gestionnaire');
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'direct' ? 'Bloquer ces dates' : 'Demander un blocage'}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <span className="truncate">{property.name}</span>
            <Badge variant="secondary" className="text-[10px]">
              {mode === 'direct' ? 'Direct' : 'Sur validation'}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="start">Du</Label>
              <Input
                id="start"
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="end">Au</Label>
              <Input
                id="end"
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Motif</Label>
            <Select value={motif} onValueChange={(v) => setMotif(v as BlockMotif)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(MOTIF_LABELS) as BlockMotif[]).map((m) => (
                  <SelectItem key={m} value={m}>
                    {MOTIF_LABELS[m]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="comment">Commentaire (facultatif)</Label>
            <Textarea
              id="comment"
              placeholder="Précisions à l'attention du gestionnaire…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
            {mode === 'direct' ? (
              <>
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 flex-shrink-0" />
                <span>
                  Vous pouvez bloquer directement ce logement, sans validation
                  préalable du gestionnaire.
                </span>
              </>
            ) : (
              <>
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Votre gestionnaire recevra la demande et vous notifiera dès
                  qu'elle sera traitée.
                </span>
              </>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            {mode === 'direct' ? 'Bloquer' : 'Envoyer la demande'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
