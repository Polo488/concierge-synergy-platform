import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { toast } from '@/lib/toast';
import { MAX_SHORTCUTS } from '@/hooks/useSidebarShortcuts';

export type ShortcutOption = {
  path: string;
  name: string;
  icon: React.ElementType;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  options: ShortcutOption[];
  current: string[];
  onSave: (paths: string[]) => void;
}

export function ShortcutsPickerDialog({ open, onOpenChange, options, current, onSave }: Props) {
  const [selected, setSelected] = useState<string[]>(current);

  useEffect(() => {
    if (open) setSelected(current);
  }, [open, current]);

  const toggle = (path: string) => {
    setSelected(s => {
      if (s.includes(path)) return s.filter(p => p !== path);
      if (s.length >= MAX_SHORTCUTS) {
        toast.error(`Maximum ${MAX_SHORTCUTS} raccourcis`);
        return s;
      }
      return [...s, path];
    });
  };

  const handleSave = () => {
    onSave(selected);
    toast.success('Raccourcis mis à jour');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Raccourcis épinglés</DialogTitle>
          <DialogDescription>
            Sélectionne jusqu'à {MAX_SHORTCUTS} modules à afficher dans la barre latérale ({selected.length}/{MAX_SHORTCUTS}).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5 max-h-[55vh] overflow-y-auto py-1">
          {options.map(opt => {
            const isChecked = selected.includes(opt.path);
            const Icon = opt.icon;
            return (
              <label
                key={opt.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors',
                  isChecked
                    ? 'border-[hsl(var(--ios-orange))] bg-[hsl(var(--ios-orange)/0.06)]'
                    : 'border-border bg-card hover:bg-muted/50'
                )}
              >
                <Checkbox checked={isChecked} onCheckedChange={() => toggle(opt.path)} />
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{opt.name}</span>
              </label>
            );
          })}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSave}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
