
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Sparkles, 
  MapPin, 
  User, 
  MessageSquare, 
  AlertTriangle, 
  Info,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { Conversation } from '@/types/messaging';
import { MessagingCleaningIssueFormData } from '@/types/operations';
import { CleaningIssueType } from '@/types/cleaning';
import { cn } from '@/lib/utils';

interface CreateCleaningIssueFromMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversation: Conversation | null;
  hasSimilarTask: boolean;
  onSubmit: (data: MessagingCleaningIssueFormData, createRepasse: boolean) => void;
}

const ISSUE_TYPE_OPTIONS: { value: CleaningIssueType; label: string; emoji: string }[] = [
  { value: 'dust', label: 'Poussière', emoji: '🧹' },
  { value: 'bathroom', label: 'Salle de bain', emoji: '🚿' },
  { value: 'linen', label: 'Linge', emoji: '🛏️' },
  { value: 'kitchen', label: 'Cuisine', emoji: '🍳' },
  { value: 'smell', label: 'Odeur', emoji: '👃' },
  { value: 'floors', label: 'Sols', emoji: '🪣' },
  { value: 'missing_items', label: 'Éléments manquants', emoji: '❓' },
  { value: 'windows', label: 'Vitres', emoji: '🪟' },
  { value: 'appliances', label: 'Appareils', emoji: '📺' },
  { value: 'damage', label: 'Dommage', emoji: '⚠️' },
  { value: 'guest_complaint', label: 'Plainte voyageur', emoji: '😤' },
  { value: 'other', label: 'Autre', emoji: '📝' },
];

export const CreateCleaningIssueFromMessageDialog: React.FC<CreateCleaningIssueFromMessageDialogProps> = ({
  open,
  onOpenChange,
  conversation,
  hasSimilarTask,
  onSubmit,
}) => {
  const [issueTypes, setIssueTypes] = useState<CleaningIssueType[]>([]);
  const [description, setDescription] = useState('');
  const [repasseRequired, setRepasseRequired] = useState(false);
  const [confirmDuplicate, setConfirmDuplicate] = useState(false);

  // Pre-fill from last guest message
  useEffect(() => {
    if (open && conversation) {
      const lastGuestMessage = [...conversation.messages]
        .reverse()
        .find(m => m.sender === 'guest');
      
      setDescription(lastGuestMessage?.content || '');
      setIssueTypes([]);
      setRepasseRequired(false);
      setConfirmDuplicate(false);
    }
  }, [open, conversation]);

  if (!conversation) return null;

  const toggleIssueType = (type: CleaningIssueType) => {
    setIssueTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleSubmit = () => {
    if (hasSimilarTask && !confirmDuplicate) {
      return;
    }

    const data: MessagingCleaningIssueFormData = {
      issueTypes: issueTypes as string[],
      description,
      propertyId: conversation.reservation.propertyId,
      propertyName: conversation.reservation.propertyName,
      conversationId: conversation.id,
      reservationId: conversation.reservationId,
      guestId: conversation.guestId,
      guestName: conversation.guest.name,
      repasseRequired,
      photos: [],
      prefilledMessage: description,
    };

    onSubmit(data, repasseRequired);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-600" />
            Signaler un problème ménage
          </DialogTitle>
          <DialogDescription>
            Le problème sera enregistré et compté dans les statistiques qualité.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Context info */}
          <div className="p-3 bg-muted rounded-lg space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{conversation.reservation.propertyName}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{conversation.guest.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <Badge variant="secondary" className="text-xs">
                Origine: Message voyageur
              </Badge>
            </div>
          </div>

          {/* Duplicate warning */}
          {hasSimilarTask && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                Un problème similaire a été signalé récemment pour cette conversation.
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmDuplicate}
                    onChange={(e) => setConfirmDuplicate(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Je confirme vouloir créer un nouveau signalement</span>
                </label>
              </AlertDescription>
            </Alert>
          )}

          {/* Issue types - multi-select */}
          <div>
            <Label>Type(s) de problème</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {ISSUE_TYPE_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  type="button"
                  variant={issueTypes.includes(opt.value) ? 'default' : 'outline'}
                  size="sm"
                  className={cn(
                    'justify-start text-xs h-auto py-2',
                    issueTypes.includes(opt.value) && 'ring-2 ring-offset-1'
                  )}
                  onClick={() => toggleIssueType(opt.value)}
                >
                  <span className="mr-1">{opt.emoji}</span>
                  {opt.label}
                </Button>
              ))}
            </div>
            {issueTypes.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                {issueTypes.length} type(s) sélectionné(s)
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">
              Description
              <span className="text-xs text-muted-foreground ml-2">(pré-rempli depuis le message)</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Décrivez le problème..."
            />
          </div>

          {/* Repasse toggle */}
          <div className={cn(
            'p-4 rounded-lg border-2 transition-colors',
            repasseRequired ? 'border-primary bg-primary/5' : 'border-muted'
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RefreshCw className={cn(
                  'h-5 w-5',
                  repasseRequired ? 'text-primary' : 'text-muted-foreground'
                )} />
                <div>
                  <Label htmlFor="repasse-switch" className="cursor-pointer font-medium">
                    Repasse nécessaire
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Planifier une repasse immédiate
                  </p>
                </div>
              </div>
              <Switch
                id="repasse-switch"
                checked={repasseRequired}
                onCheckedChange={setRepasseRequired}
              />
            </div>
            {repasseRequired && (
              <div className="mt-3 p-2 bg-background rounded text-xs text-muted-foreground">
                <CheckCircle2 className="h-3 w-3 inline mr-1" />
                Une tâche de repasse sera automatiquement créée
              </div>
            )}
          </div>

          {/* Info about what will happen */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="ml-2 text-xs">
              Ce signalement apparaîtra dans:
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                <li>Module Ménage (problèmes)</li>
                <li>Historique repasse de la propriété</li>
                <li>KPIs Qualité (taux repasse, issues par type)</li>
                {repasseRequired && <li className="font-medium text-primary">+ Tâche de repasse créée</li>}
              </ul>
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={issueTypes.length === 0 || !description || (hasSimilarTask && !confirmDuplicate)}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {repasseRequired ? 'Signaler + Planifier repasse' : 'Signaler le problème'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
