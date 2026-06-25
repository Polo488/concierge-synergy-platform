import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ChevronUp, ChevronDown } from 'lucide-react';
import {
  ALL_PROPERTY_COLUMNS,
  PropertyColumnKey,
  PropertyColumnsConfig,
} from '@/hooks/usePropertyColumns';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: PropertyColumnsConfig;
  onSave: (config: PropertyColumnsConfig) => void;
  onReset: () => void;
}

export function PropertyColumnsDialog({ open, onOpenChange, config, onSave, onReset }: Props) {
  const [draft, setDraft] = useState<PropertyColumnsConfig>(config);

  useEffect(() => {
    if (open) setDraft(config);
  }, [open, config]);

  const ordered: PropertyColumnKey[] = [
    ...draft.order.filter(k => ALL_PROPERTY_COLUMNS.some(c => c.key === k)),
    ...ALL_PROPERTY_COLUMNS.filter(c => !draft.order.includes(c.key)).map(c => c.key),
  ];

  const move = (key: PropertyColumnKey, dir: -1 | 1) => {
    const idx = ordered.indexOf(key);
    const next = idx + dir;
    if (next < 0 || next >= ordered.length) return;
    const newOrder = [...ordered];
    [newOrder[idx], newOrder[next]] = [newOrder[next], newOrder[idx]];
    setDraft(d => ({ ...d, order: newOrder }));
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
          <DialogTitle>Colonnes</DialogTitle>
          <DialogDescription>
            Active/désactive et réordonne avec les flèches.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
          {ordered.map((key, idx) => {
            const def = ALL_PROPERTY_COLUMNS.find(c => c.key === key)!;
            const visible = draft.visible.includes(key);
            const isFirst = idx === 0;
            const isLast = idx === ordered.length - 1;
            return (
              <div key={key} className="flex items-center gap-2 px-3 py-2.5">
                <div className="flex flex-col -my-1">
                  <button
                    type="button"
                    onClick={() => move(key, -1)}
                    disabled={isFirst}
                    aria-label="Monter"
                    className={cn(
                      "h-5 w-7 flex items-center justify-center rounded-md transition-colors",
                      isFirst
                        ? "text-muted-foreground/30 cursor-not-allowed"
                        : "text-[hsl(var(--ios-orange))] hover:bg-[hsl(var(--ios-orange)/0.08)] active:scale-95"
                    )}
                  >
                    <ChevronUp className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(key, 1)}
                    disabled={isLast}
                    aria-label="Descendre"
                    className={cn(
                      "h-5 w-7 flex items-center justify-center rounded-md transition-colors",
                      isLast
                        ? "text-muted-foreground/30 cursor-not-allowed"
                        : "text-[hsl(var(--ios-orange))] hover:bg-[hsl(var(--ios-orange)/0.08)] active:scale-95"
                    )}
                  >
                    <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                </div>
                <span className="flex-1 text-[15px] font-medium text-foreground pl-1">{def.label}</span>
                <Switch checked={visible} onCheckedChange={v => toggleVisible(key, v)} />
              </div>
            );
          })}
        </div>

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

