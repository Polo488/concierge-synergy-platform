import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ALL_PROPERTY_COLUMNS,
  PropertyColumnKey,
  PropertyColumnsConfig,
} from '@/hooks/usePropertyColumns';
import { toast } from '@/lib/toast';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: PropertyColumnsConfig;
  onSave: (config: PropertyColumnsConfig) => void;
  onReset: () => void;
}

function SortableRow({ id, label, visible, onToggle }: { id: PropertyColumnKey; label: string; visible: boolean; onToggle: (v: boolean) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border bg-card"
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
        aria-label="Réordonner"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
      <Switch checked={visible} onCheckedChange={onToggle} />
    </div>
  );
}

export function PropertyColumnsDialog({ open, onOpenChange, config, onSave, onReset }: Props) {
  const [draft, setDraft] = useState<PropertyColumnsConfig>(config);

  useEffect(() => {
    if (open) setDraft(config);
  }, [open, config]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // Compute the full ordered list, ensuring any new columns appear at the end.
  const ordered: PropertyColumnKey[] = [
    ...draft.order.filter(k => ALL_PROPERTY_COLUMNS.some(c => c.key === k)),
    ...ALL_PROPERTY_COLUMNS.filter(c => !draft.order.includes(c.key)).map(c => c.key),
  ];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ordered.indexOf(active.id as PropertyColumnKey);
    const newIndex = ordered.indexOf(over.id as PropertyColumnKey);
    setDraft(d => ({ ...d, order: arrayMove(ordered, oldIndex, newIndex) }));
  };

  const toggleVisible = (key: PropertyColumnKey, v: boolean) => {
    setDraft(d => ({
      ...d,
      visible: v ? [...d.visible.filter(k => k !== key), key] : d.visible.filter(k => k !== key),
    }));
  };

  const handleSave = () => {
    if (draft.visible.length === 0) {
      toast.error('Au moins une colonne doit être visible');
      return;
    }
    onSave({ order: ordered, visible: draft.visible });
    toast.success('Colonnes mises à jour');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configurer les colonnes</DialogTitle>
          <DialogDescription>
            Active/désactive les colonnes et glisse-dépose pour les réordonner.
          </DialogDescription>
        </DialogHeader>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={ordered} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 max-h-[55vh] overflow-y-auto py-1">
              {ordered.map(key => {
                const def = ALL_PROPERTY_COLUMNS.find(c => c.key === key)!;
                return (
                  <SortableRow
                    key={key}
                    id={key}
                    label={def.label}
                    visible={draft.visible.includes(key)}
                    onToggle={v => toggleVisible(key, v)}
                  />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => { onReset(); onOpenChange(false); toast.success('Colonnes réinitialisées'); }}>
            Réinitialiser
          </Button>
          <Button onClick={handleSave}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
