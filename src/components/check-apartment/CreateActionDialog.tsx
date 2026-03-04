
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InspectionSectionKey, SECTION_LABELS, CheckAction } from '@/types/checkApartment';
import { Wrench, Sparkles, Package, Bell } from 'lucide-react';

const ACTION_TYPES: { value: CheckAction['actionType']; label: string; icon: React.ElementType }[] = [
  { value: 'maintenance', label: 'Maintenance', icon: Wrench },
  { value: 'cleaning_repasse', label: 'Repasse ménage', icon: Sparkles },
  { value: 'stock_restock', label: 'Réapprovisionnement', icon: Package },
  { value: 'operational_reminder', label: 'Rappel opérationnel', icon: Bell },
];

const PRIORITIES: { value: CheckAction['priority']; label: string }[] = [
  { value: 'low', label: 'Basse' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'high', label: 'Haute' },
  { value: 'critical', label: 'Critique' },
];

interface CreateActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionKey: InspectionSectionKey;
  onCreateAction: (
    sectionKey: InspectionSectionKey,
    actionType: CheckAction['actionType'],
    title: string,
    priority: CheckAction['priority']
  ) => void;
}

export const CreateActionDialog: React.FC<CreateActionDialogProps> = ({
  open,
  onOpenChange,
  sectionKey,
  onCreateAction,
}) => {
  const [actionType, setActionType] = useState<CheckAction['actionType']>('maintenance');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<CheckAction['priority']>('medium');

  const handleCreate = () => {
    if (!title.trim()) return;
    onCreateAction(sectionKey, actionType, title, priority);
    setTitle('');
    setActionType('maintenance');
    setPriority('medium');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Créer une action — {SECTION_LABELS[sectionKey]}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Type d'action</Label>
            <Select value={actionType} onValueChange={(v) => setActionType(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTION_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    <span className="flex items-center gap-2">
                      <t.icon size={14} />
                      {t.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Titre *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Décrivez l'action..." />
          </div>

          <div className="space-y-2">
            <Label>Priorité</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleCreate} disabled={!title.trim()}>Créer l'action</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
