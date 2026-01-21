
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wrench, MapPin, User, MessageSquare, AlertTriangle, Info } from 'lucide-react';
import { Conversation } from '@/types/messaging';
import { MessagingMaintenanceFormData } from '@/types/operations';
import { cn } from '@/lib/utils';

interface CreateMaintenanceFromMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversation: Conversation | null;
  hasSimilarTask: boolean;
  onSubmit: (data: MessagingMaintenanceFormData) => void;
}

const urgencyOptions = [
  { value: 'low', label: 'Faible', color: 'bg-green-100 text-green-700' },
  { value: 'medium', label: 'Moyen', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'high', label: 'Élevé', color: 'bg-orange-100 text-orange-700' },
  { value: 'critical', label: 'Critique', color: 'bg-red-100 text-red-700' },
];

export const CreateMaintenanceFromMessageDialog: React.FC<CreateMaintenanceFromMessageDialogProps> = ({
  open,
  onOpenChange,
  conversation,
  hasSimilarTask,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [confirmDuplicate, setConfirmDuplicate] = useState(false);

  // Pre-fill from last guest message
  useEffect(() => {
    if (open && conversation) {
      const lastGuestMessage = [...conversation.messages]
        .reverse()
        .find(m => m.sender === 'guest');
      
      setTitle(`Maintenance - ${conversation.reservation.propertyName}`);
      setDescription(lastGuestMessage?.content || '');
      setUrgency('medium');
      setConfirmDuplicate(false);
    }
  }, [open, conversation]);

  if (!conversation) return null;

  const handleSubmit = () => {
    if (hasSimilarTask && !confirmDuplicate) {
      return;
    }

    const data: MessagingMaintenanceFormData = {
      title,
      description,
      urgency,
      propertyId: conversation.reservation.propertyId,
      propertyName: conversation.reservation.propertyName,
      conversationId: conversation.id,
      reservationId: conversation.reservationId,
      guestId: conversation.guestId,
      guestName: conversation.guest.name,
      prefilledMessage: description,
    };

    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-amber-600" />
            Créer une tâche de maintenance
          </DialogTitle>
          <DialogDescription>
            Cette tâche sera liée à la conversation et apparaîtra dans les statistiques.
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
                Une tâche similaire a été créée récemment pour cette conversation.
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmDuplicate}
                    onChange={(e) => setConfirmDuplicate(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Je confirme vouloir créer une nouvelle tâche</span>
                </label>
              </AlertDescription>
            </Alert>
          )}

          {/* Form fields */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de l'intervention"
              />
            </div>

            <div>
              <Label htmlFor="urgency">Urgence</Label>
              <Select value={urgency} onValueChange={(v) => setUrgency(v as typeof urgency)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {urgencyOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <Badge className={cn('text-xs', opt.color)}>{opt.label}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">
                Description
                <span className="text-xs text-muted-foreground ml-2">(pré-rempli depuis le message)</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Décrivez le problème..."
              />
            </div>
          </div>

          {/* Info about what will happen */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="ml-2 text-xs">
              Cette tâche apparaîtra dans:
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                <li>Module Maintenance</li>
                <li>Historique maintenance de la propriété</li>
                <li>Dashboard (tâches du jour)</li>
                <li>KPIs (volume maintenance, issues par propriété)</li>
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
            disabled={!title || !description || (hasSimilarTask && !confirmDuplicate)}
          >
            <Wrench className="h-4 w-4 mr-2" />
            Créer la tâche
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
