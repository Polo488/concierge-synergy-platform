
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Camera, Home, User, Calendar, FileWarning } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CleaningTask, CleaningIssue, CleaningIssueSource, CleaningIssueType } from '@/types/cleaning';

interface CleaningIssueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  linkedTask?: CleaningTask | null;
  source?: CleaningIssueSource;
  onSubmit: (issue: Omit<CleaningIssue, 'id' | 'createdAt' | 'repasseTaskId'>) => void;
}

const ISSUE_TYPES: { value: CleaningIssueType; label: string; emoji: string }[] = [
  { value: 'dust', label: 'Poussière', emoji: '🧹' },
  { value: 'bathroom', label: 'Salle de bain', emoji: '🚿' },
  { value: 'linen', label: 'Linge', emoji: '🛏️' },
  { value: 'kitchen', label: 'Cuisine', emoji: '🍳' },
  { value: 'smell', label: 'Odeur', emoji: '👃' },
  { value: 'floors', label: 'Sols', emoji: '🧽' },
  { value: 'missing_items', label: 'Objets manquants', emoji: '📦' },
  { value: 'windows', label: 'Vitres', emoji: '🪟' },
  { value: 'appliances', label: 'Appareils', emoji: '🔌' },
  { value: 'damage', label: 'Dégât', emoji: '💥' },
  { value: 'guest_complaint', label: 'Plainte client', emoji: '😤' },
  { value: 'other', label: 'Autre', emoji: '📋' },
];

const SOURCE_LABELS: Record<CleaningIssueSource, { label: string; icon: typeof Home }> = {
  cleaning_task: { label: 'Tâche de ménage', icon: Home },
  reservation: { label: 'Réservation (plainte)', icon: Calendar },
  quality_check: { label: 'Contrôle qualité', icon: FileWarning },
};

export const CleaningIssueDialog = ({
  open,
  onOpenChange,
  linkedTask,
  source = 'cleaning_task',
  onSubmit,
}: CleaningIssueDialogProps) => {
  const [issueSource, setIssueSource] = useState<CleaningIssueSource>(source);
  const [issueTypes, setIssueTypes] = useState<CleaningIssueType[]>([]);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [repasseRequired, setRepasseRequired] = useState(false);
  const [propertyName, setPropertyName] = useState(linkedTask?.property || '');

  // Reset form when dialog opens/closes or linkedTask changes
  useEffect(() => {
    if (open) {
      setIssueSource(source);
      setIssueTypes([]);
      setDescription('');
      setPhotos([]);
      setRepasseRequired(false);
      setPropertyName(linkedTask?.property || '');
    }
  }, [open, linkedTask, source]);

  const toggleIssueType = (type: CleaningIssueType) => {
    setIssueTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleSubmit = () => {
    if (!propertyName || issueTypes.length === 0 || !description.trim()) {
      return;
    }

    const issue: Omit<CleaningIssue, 'id' | 'createdAt' | 'repasseTaskId'> = {
      propertyId: propertyName.toLowerCase().replace(/\s+/g, '-'),
      propertyName: propertyName,
      linkedTaskId: linkedTask?.id,
      linkedAgentId: linkedTask?.cleaningAgent?.toLowerCase().replace(/\s+/g, '-'),
      linkedAgentName: linkedTask?.cleaningAgent || undefined,
      source: issueSource,
      issueType: issueTypes[0], // Primary issue type (first selected)
      issueTypes: issueTypes, // All selected types
      description,
      photos,
      repasseRequired,
      status: 'open',
      createdBy: 'manager',
    };

    onSubmit(issue);
    onOpenChange(false);
  };

  const SourceIcon = SOURCE_LABELS[issueSource].icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Déclarer un problème de ménage
          </DialogTitle>
          <DialogDescription>
            Signalez un problème de qualité pour déclencher un suivi et éventuellement une repasse.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Source - locked when coming from task */}
          <div className="space-y-2">
            <Label>Source du signalement</Label>
            {linkedTask ? (
              <div className="p-3 bg-muted rounded-md text-sm font-medium flex items-center gap-2">
                <SourceIcon className="h-4 w-4 text-muted-foreground" />
                {SOURCE_LABELS[issueSource].label}
              </div>
            ) : (
              <Select value={issueSource} onValueChange={(v) => setIssueSource(v as CleaningIssueSource)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SOURCE_LABELS).map(([value, { label }]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}</div>

          {/* Property */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Propriété
            </Label>
            {linkedTask ? (
              <div className="p-3 bg-muted rounded-md text-sm font-medium">
                {linkedTask.property}
              </div>
            ) : (
              <Select value={propertyName} onValueChange={setPropertyName}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une propriété" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Appartement 12 Rue du Port">Appartement 12 Rue du Port</SelectItem>
                  <SelectItem value="Studio 8 Avenue des Fleurs">Studio 8 Avenue des Fleurs</SelectItem>
                  <SelectItem value="Loft 72 Rue des Arts">Loft 72 Rue des Arts</SelectItem>
                  <SelectItem value="Maison 23 Rue de la Paix">Maison 23 Rue de la Paix</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Linked task info */}
          {linkedTask && (
            <div className="p-3 bg-muted/50 rounded-md space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Agent:</span>
                <span className="font-medium">{linkedTask.cleaningAgent || 'Non assigné'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{linkedTask.date || 'Aujourd\'hui'}</span>
              </div>
            </div>
          )}

          {/* Issue Type - Multiple selection */}
          <div className="space-y-2">
            <Label>Type(s) de problème * <span className="text-muted-foreground text-xs font-normal">(plusieurs choix possibles)</span></Label>
            <div className="flex flex-wrap gap-2">
              {ISSUE_TYPES.map((type) => (
                <Badge
                  key={type.value}
                  variant={issueTypes.includes(type.value) ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer transition-all hover:scale-105',
                    issueTypes.includes(type.value) && 'bg-primary'
                  )}
                  onClick={() => toggleIssueType(type.value)}
                >
                  <span className="mr-1">{type.emoji}</span>
                  {type.label}
                </Badge>
              ))}
            </div>
            {issueTypes.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {issueTypes.length} type{issueTypes.length > 1 ? 's' : ''} sélectionné{issueTypes.length > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description du problème *</Label>
            <Textarea
              id="description"
              placeholder="Décrivez le problème en détail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Photos placeholder */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Photos (optionnel)
            </Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Camera className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                Glissez des photos ici ou cliquez pour ajouter
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Photos client, photos contrôle qualité...
              </p>
            </div>
          </div>

          {/* Repasse Required - MANDATORY FIELD */}
          <div className="space-y-3 rounded-lg border-2 border-destructive/30 bg-destructive/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <div>
                  <Label htmlFor="repasse" className="text-base font-semibold">
                    Repasse requise ? *
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Si oui, une tâche de repasse sera automatiquement créée
                  </p>
                </div>
              </div>
              <Switch
                id="repasse"
                checked={repasseRequired}
                onCheckedChange={setRepasseRequired}
              />
            </div>
            
            {repasseRequired && (
              <div className="mt-3 p-3 bg-destructive/10 rounded-md text-sm">
                <p className="font-medium text-destructive">⚡ Une tâche de repasse sera créée</p>
                <ul className="mt-2 space-y-1 text-muted-foreground text-xs">
                  <li>• Liée à ce signalement</li>
                  <li>• Assignée au même agent (modifiable)</li>
                  <li>• Comptabilisée dans les KPIs repasse</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!propertyName || issueTypes.length === 0 || !description.trim()}
            variant="destructive"
          >
            Déclarer le problème
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
