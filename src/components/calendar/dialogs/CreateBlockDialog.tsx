import React, { useState, useMemo } from 'react';
import { format, addDays, isSameDay, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar as CalendarIcon, 
  Ban, 
  Sparkles, 
  Clock, 
  User, 
  AlertTriangle,
  Building
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { 
  BlockedPeriod, 
  BlockReasonType, 
  CleaningDateRule, 
  BlockCleaningSchedule,
  CalendarProperty 
} from '@/types/calendar';
import type { CleaningTask } from '@/types/cleaning';

interface CreateBlockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: CalendarProperty;
  preselectedStartDate?: Date;
  preselectedEndDate?: Date;
  existingBlock?: BlockedPeriod;
  existingCleaningTasks?: CleaningTask[];
  cleaningAgents?: { id: string; name: string }[];
  onSubmit: (block: Omit<BlockedPeriod, 'id'>, shouldCreateCleaningTask: boolean) => void;
  onDelete?: (blockId: number, deleteLinkedCleaning: boolean) => void;
}

export const CreateBlockDialog: React.FC<CreateBlockDialogProps> = ({
  open,
  onOpenChange,
  property,
  preselectedStartDate,
  preselectedEndDate,
  existingBlock,
  existingCleaningTasks = [],
  cleaningAgents = [],
  onSubmit,
  onDelete,
}) => {
  const isEditMode = !!existingBlock;
  
  // Form state
  const [reasonType, setReasonType] = useState<BlockReasonType>(
    existingBlock?.reasonType || 'owner_stay'
  );
  const [customReason, setCustomReason] = useState(existingBlock?.reason || '');
  const [startDate, setStartDate] = useState<Date>(
    existingBlock?.startDate || preselectedStartDate || new Date()
  );
  const [endDate, setEndDate] = useState<Date>(
    existingBlock?.endDate || preselectedEndDate || new Date()
  );
  
  // Cleaning schedule state
  const [cleaningEnabled, setCleaningEnabled] = useState(
    existingBlock?.cleaningSchedule?.enabled || false
  );
  const [dateRule, setDateRule] = useState<CleaningDateRule>(
    existingBlock?.cleaningSchedule?.dateRule || 'day_after_block'
  );
  const [startTime, setStartTime] = useState(
    existingBlock?.cleaningSchedule?.startTime || '10:00'
  );
  const [endTime, setEndTime] = useState(
    existingBlock?.cleaningSchedule?.endTime || '14:00'
  );
  const [assignedAgent, setAssignedAgent] = useState(
    existingBlock?.cleaningSchedule?.assignedAgentId || ''
  );
  const [cleaningNotes, setCleaningNotes] = useState(
    existingBlock?.cleaningSchedule?.notes || ''
  );
  
  // Dialogs
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [duplicateAction, setDuplicateAction] = useState<'keep' | 'replace' | 'create'>('keep');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLinkedCleaning, setDeleteLinkedCleaning] = useState(false);

  // Calculate the cleaning date based on the rule
  const cleaningDate = useMemo(() => {
    if (!endDate) return null;
    return dateRule === 'last_blocked_day' 
      ? startOfDay(endDate) 
      : addDays(startOfDay(endDate), 1);
  }, [endDate, dateRule]);

  // Check for existing cleaning tasks on the cleaning date
  const existingCleaningOnDate = useMemo(() => {
    if (!cleaningDate || !property) return null;
    return existingCleaningTasks.find(task => 
      task.property === property.name && 
      task.date && 
      isSameDay(new Date(task.date), cleaningDate)
    );
  }, [cleaningDate, existingCleaningTasks, property]);

  // Get reason display
  const getReasonDisplay = () => {
    const labels: Record<BlockReasonType, string> = {
      owner_stay: 'Séjour propriétaire',
      maintenance: 'Maintenance',
      personal_use: 'Usage personnel',
      renovation: 'Travaux',
      other: 'Autre',
    };
    return reasonType === 'other' && customReason 
      ? customReason 
      : labels[reasonType];
  };

  const handleSubmit = () => {
    // Check for duplicate cleaning task
    if (cleaningEnabled && existingCleaningOnDate && !isEditMode) {
      setShowDuplicateWarning(true);
      return;
    }

    submitBlock();
  };

  const submitBlock = () => {
    const cleaningSchedule: BlockCleaningSchedule | undefined = cleaningEnabled ? {
      enabled: true,
      dateRule,
      startTime,
      endTime,
      assignedAgentId: assignedAgent || undefined,
      assignedAgentName: cleaningAgents.find(a => a.id === assignedAgent)?.name,
      notes: cleaningNotes || undefined,
      manuallyOverridden: existingBlock?.cleaningSchedule?.manuallyOverridden,
    } : undefined;

    const block: Omit<BlockedPeriod, 'id'> = {
      propertyId: property?.id || 0,
      startDate,
      endDate,
      reasonType,
      reason: reasonType === 'other' ? customReason : getReasonDisplay(),
      cleaningSchedule,
    };

    const shouldCreateCleaning = cleaningEnabled && 
      (!existingCleaningOnDate || duplicateAction === 'replace' || duplicateAction === 'create');

    onSubmit(block, shouldCreateCleaning);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (existingBlock && onDelete) {
      const hasLinkedCleaning = !!existingBlock.cleaningSchedule?.linkedCleaningTaskId;
      if (hasLinkedCleaning) {
        setShowDeleteConfirm(true);
      } else {
        onDelete(existingBlock.id, false);
        onOpenChange(false);
      }
    }
  };

  const confirmDelete = () => {
    if (existingBlock && onDelete) {
      onDelete(existingBlock.id, deleteLinkedCleaning);
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ban className="w-5 h-5 text-muted-foreground" />
              {isEditMode ? 'Modifier le blocage' : 'Bloquer des nuits'}
            </DialogTitle>
            <DialogDescription>
              Bloquez une période pour ce logement
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Property info */}
            {property && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Building className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{property.name}</p>
                  <p className="text-sm text-muted-foreground">{property.address}</p>
                </div>
              </div>
            )}

            {/* Date range display */}
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <CalendarIcon className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  {format(startDate, 'EEEE d MMMM yyyy', { locale: fr })}
                  {!isSameDay(startDate, endDate) && (
                    <>
                      {' → '}
                      {format(endDate, 'EEEE d MMMM yyyy', { locale: fr })}
                    </>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  {Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} nuit(s)
                </p>
              </div>
            </div>

            {/* Block reason */}
            <div className="space-y-2">
              <Label>Motif du blocage</Label>
              <Select value={reasonType} onValueChange={(v) => setReasonType(v as BlockReasonType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un motif" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner_stay">Séjour propriétaire</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="personal_use">Usage personnel</SelectItem>
                  <SelectItem value="renovation">Travaux</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
              
              {reasonType === 'other' && (
                <Input
                  placeholder="Préciser le motif..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="mt-2"
                />
              )}
            </div>

            <Separator />

            {/* Cleaning scheduling section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <Label htmlFor="cleaning-toggle" className="font-medium">
                    Programmer un ménage en fin de blocage
                  </Label>
                </div>
                <Switch
                  id="cleaning-toggle"
                  checked={cleaningEnabled}
                  onCheckedChange={setCleaningEnabled}
                />
              </div>

              {cleaningEnabled && (
                <div className="pl-6 space-y-4 animate-in fade-in slide-in-from-top-2">
                  {/* Cleaning date rule */}
                  <div className="space-y-3">
                    <Label>Date du ménage</Label>
                    <RadioGroup 
                      value={dateRule} 
                      onValueChange={(v) => setDateRule(v as CleaningDateRule)}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="last_blocked_day" id="last-day" />
                        <Label htmlFor="last-day" className="font-normal cursor-pointer">
                          Le dernier jour bloqué
                          <span className="text-muted-foreground ml-1">
                            ({cleaningDate && dateRule === 'last_blocked_day' 
                              ? format(endDate, 'd MMMM', { locale: fr }) 
                              : format(endDate, 'd MMMM', { locale: fr })})
                          </span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="day_after_block" id="day-after" />
                        <Label htmlFor="day-after" className="font-normal cursor-pointer">
                          Le lendemain du blocage
                          <span className="text-muted-foreground ml-1">
                            ({format(addDays(endDate, 1), 'd MMMM', { locale: fr })})
                          </span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Time window */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Heure de début
                      </Label>
                      <Input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Heure de fin
                      </Label>
                      <Input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Agent assignment */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Assigner un agent (optionnel)
                    </Label>
                    <Select value={assignedAgent || "non_assigne"} onValueChange={(v) => setAssignedAgent(v === "non_assigne" ? "" : v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Non assigné" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="non_assigne">Non assigné</SelectItem>
                        {cleaningAgents.map(agent => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label>Notes pour l'équipe de ménage</Label>
                    <Textarea
                      placeholder="Instructions spéciales, points d'attention..."
                      value={cleaningNotes}
                      onChange={(e) => setCleaningNotes(e.target.value)}
                      rows={2}
                    />
                  </div>

                  {/* Cleaning summary */}
                  <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm">
                      <span className="font-medium">Récapitulatif:</span> Un ménage sera programmé le{' '}
                      <span className="font-medium">
                        {cleaningDate && format(cleaningDate, 'EEEE d MMMM', { locale: fr })}
                      </span>
                      {startTime && endTime && (
                        <> de <span className="font-medium">{startTime}</span> à <span className="font-medium">{endTime}</span></>
                      )}
                      {assignedAgent && (
                        <>, assigné à <span className="font-medium">
                          {cleaningAgents.find(a => a.id === assignedAgent)?.name}
                        </span></>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {isEditMode && onDelete && (
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                className="sm:mr-auto"
              >
                Supprimer le blocage
              </Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              {isEditMode ? 'Modifier' : 'Bloquer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Duplicate cleaning warning */}
      <AlertDialog open={showDuplicateWarning} onOpenChange={setShowDuplicateWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Un ménage existe déjà
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  Un ménage est déjà programmé le{' '}
                  {cleaningDate && format(cleaningDate, 'd MMMM yyyy', { locale: fr })} pour ce logement.
                </p>
                <RadioGroup 
                  value={duplicateAction} 
                  onValueChange={(v) => setDuplicateAction(v as 'keep' | 'replace' | 'create')}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="keep" id="keep" />
                    <Label htmlFor="keep" className="font-normal cursor-pointer">
                      Garder le ménage existant (ne pas en créer un nouveau)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="replace" id="replace" />
                    <Label htmlFor="replace" className="font-normal cursor-pointer">
                      Remplacer par le nouveau ménage
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="create" id="create" />
                    <Label htmlFor="create" className="font-normal cursor-pointer">
                      Créer quand même (2 ménages le même jour)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={submitBlock}>Confirmer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete confirmation with linked cleaning */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le blocage ?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  Ce blocage a un ménage programmé associé. Que souhaitez-vous faire ?
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="delete-cleaning"
                    checked={deleteLinkedCleaning}
                    onChange={(e) => setDeleteLinkedCleaning(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="delete-cleaning" className="font-normal cursor-pointer">
                    Supprimer également le ménage associé
                  </Label>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
