import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
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

// Apple spring — same easing family as iOS list reorder
const APPLE_SPRING = { type: 'spring' as const, stiffness: 520, damping: 38, mass: 0.9 };

export function PropertyColumnsDialog({ open, onOpenChange, config, onSave, onReset }: Props) {
  const [draft, setDraft] = useState<PropertyColumnsConfig>(config);
  const [movingKey, setMovingKey] = useState<PropertyColumnKey | null>(null);

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
    setMovingKey(key);
    // Haptic-ish flash; clear after spring settles
    window.setTimeout(() => setMovingKey(k => (k === key ? null : k)), 480);
    if ('vibrate' in navigator) {
      try { navigator.vibrate?.(8); } catch { /* noop */ }
    }
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

        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <LayoutGroup>
            <motion.ul layout className="divide-y divide-border">
              {ordered.map((key, idx) => {
                const def = ALL_PROPERTY_COLUMNS.find(c => c.key === key)!;
                const visible = draft.visible.includes(key);
                const isFirst = idx === 0;
                const isLast = idx === ordered.length - 1;
                const isMoving = movingKey === key;
                return (
                  <motion.li
                    key={key}
                    layout
                    layoutId={`col-${key}`}
                    transition={APPLE_SPRING}
                    animate={{
                      scale: isMoving ? 1.02 : 1,
                      zIndex: isMoving ? 5 : 0,
                      boxShadow: isMoving
                        ? '0 12px 28px -10px hsl(var(--ios-orange) / 0.35), 0 2px 6px -2px hsl(0 0% 0% / 0.12)'
                        : '0 0px 0px hsl(0 0% 0% / 0)',
                    }}
                    className={cn(
                      'relative flex items-center gap-2 px-3 py-2.5 bg-card',
                      isMoving && 'bg-[hsl(var(--ios-orange)/0.04)]'
                    )}
                  >
                    {/* Position indicator rail */}
                    <AnimatePresence>
                      {isMoving && (
                        <motion.span
                          initial={{ opacity: 0, scaleY: 0.4 }}
                          animate={{ opacity: 1, scaleY: 1 }}
                          exit={{ opacity: 0, scaleY: 0.4 }}
                          transition={{ duration: 0.18 }}
                          className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-[hsl(var(--ios-orange))] origin-center"
                        />
                      )}
                    </AnimatePresence>

                    <div className="flex flex-col -my-1">
                      <motion.button
                        type="button"
                        onClick={() => move(key, -1)}
                        disabled={isFirst}
                        whileTap={isFirst ? undefined : { scale: 0.82 }}
                        transition={APPLE_SPRING}
                        aria-label="Monter"
                        className={cn(
                          'h-5 w-7 flex items-center justify-center rounded-md transition-colors',
                          isFirst
                            ? 'text-muted-foreground/30 cursor-not-allowed'
                            : 'text-[hsl(var(--ios-orange))] hover:bg-[hsl(var(--ios-orange)/0.08)]'
                        )}
                      >
                        <ChevronUp className="h-4 w-4" strokeWidth={2.5} />
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => move(key, 1)}
                        disabled={isLast}
                        whileTap={isLast ? undefined : { scale: 0.82 }}
                        transition={APPLE_SPRING}
                        aria-label="Descendre"
                        className={cn(
                          'h-5 w-7 flex items-center justify-center rounded-md transition-colors',
                          isLast
                            ? 'text-muted-foreground/30 cursor-not-allowed'
                            : 'text-[hsl(var(--ios-orange))] hover:bg-[hsl(var(--ios-orange)/0.08)]'
                        )}
                      >
                        <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
                      </motion.button>
                    </div>

                    <span className="flex-1 text-[15px] font-medium text-foreground pl-1">{def.label}</span>

                    {/* Position pill — animates the index in/out */}
                    <motion.span
                      key={`pos-${idx}`}
                      initial={{ opacity: 0, y: -4, scale: 0.85 }}
                      animate={{
                        opacity: isMoving ? 1 : 0.55,
                        y: 0,
                        scale: isMoving ? 1.06 : 1,
                      }}
                      transition={APPLE_SPRING}
                      className={cn(
                        'min-w-[28px] h-6 px-2 rounded-full text-[11px] font-semibold tabular-nums inline-flex items-center justify-center',
                        isMoving
                          ? 'bg-[hsl(var(--ios-orange))] text-white'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {idx + 1}
                    </motion.span>

                    <Switch checked={visible} onCheckedChange={v => toggleVisible(key, v)} />
                  </motion.li>
                );
              })}
            </motion.ul>
          </LayoutGroup>
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
