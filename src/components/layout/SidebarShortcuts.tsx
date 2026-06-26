import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebarShortcuts, MAX_SHORTCUTS } from '@/hooks/useSidebarShortcuts';
import { ShortcutsPickerDialog, ShortcutOption } from './ShortcutsPickerDialog';
import { useLongPress } from '@/hooks/useLongPress';

interface Props {
  options: ShortcutOption[];
  isCollapsed: boolean;
}

/**
 * iOS-style shortcuts: icons only, centered, no labels.
 * Long-press to enter edit mode (jiggle + remove badges).
 * In edit mode, a "+" slot opens the picker.
 */
export function SidebarShortcuts({ options, isCollapsed }: Props) {
  const { shortcuts, save, isLoaded } = useSidebarShortcuts();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { handlers } = useLongPress({
    delay: 450,
    onLongPress: () => setEditMode(true),
  });

  // Click outside or escape to exit edit mode
  useEffect(() => {
    if (!editMode) return;
    const onDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setEditMode(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setEditMode(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [editMode]);

  if (!isLoaded) return null;

  const pinned = shortcuts
    .map(path => options.find(o => o.path === path))
    .filter((o): o is ShortcutOption => Boolean(o));

  const remove = (path: string) => save(shortcuts.filter(p => p !== path));

  return (
    <>
      <style>{`
        @keyframes noe-jiggle {
          0% { transform: rotate(-1.2deg); }
          50% { transform: rotate(1.2deg); }
          100% { transform: rotate(-1.2deg); }
        }
        .noe-jiggle { animation: noe-jiggle 0.28s ease-in-out infinite; transform-origin: center; }
      `}</style>

      <div
        ref={containerRef}
        className="px-2 pt-3 pb-2 flex-shrink-0"
        {...handlers}
      >
        <div
          className={cn(
            'flex gap-2',
            isCollapsed ? 'flex-col items-center' : 'flex-row flex-wrap items-center justify-center'
          )}
        >
          {pinned.map(item => {
            const Icon = item.icon;
            const slot = (
              <div className={cn('relative', editMode && 'noe-jiggle')}>
                {!editMode ? (
                  <Link
                    to={item.path}
                    className="flex items-center justify-center h-9 w-9 rounded-[10px] bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.10] transition-colors"
                    aria-label={item.name}
                  >
                    <Icon size={17} strokeWidth={2} className="text-[hsl(var(--label-1))]" />
                  </Link>
                ) : (
                  <button
                    onClick={() => remove(item.path)}
                    className="flex items-center justify-center h-9 w-9 rounded-[10px] bg-black/[0.04] dark:bg-white/[0.06]"
                    aria-label={`Retirer ${item.name}`}
                  >
                    <Icon size={17} strokeWidth={2} className="text-[hsl(var(--label-1))]" />
                  </button>
                )}
                {editMode && (
                  <span
                    onClick={() => remove(item.path)}
                    className="absolute -top-1.5 -left-1.5 h-4 w-4 rounded-full bg-[hsl(var(--label-1))] text-white flex items-center justify-center shadow cursor-pointer"
                  >
                    <X size={9} strokeWidth={3} />
                  </span>
                )}
              </div>
            );
            return (
              <TooltipProvider key={item.path} delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>{slot}</TooltipTrigger>
                  <TooltipContent side={isCollapsed ? 'right' : 'top'} sideOffset={8}>
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}

          {editMode && pinned.length < MAX_SHORTCUTS && (
            <button
              onClick={() => setPickerOpen(true)}
              className="flex items-center justify-center h-9 w-9 rounded-[10px] border border-dashed border-[hsl(var(--label-3))] text-[hsl(var(--label-2))] hover:text-[hsl(var(--label-1))] hover:border-[hsl(var(--label-1))] transition-colors noe-jiggle"
              aria-label="Ajouter"
            >
              <Plus size={16} strokeWidth={2} />
            </button>
          )}

          {!editMode && pinned.length === 0 && (
            <button
              onClick={() => setEditMode(true)}
              className="text-[10px] text-[hsl(var(--label-3))] px-2 py-1 hover:text-[hsl(var(--label-1))]"
            >
              ⌘ maintenir
            </button>
          )}
        </div>
      </div>

      <ShortcutsPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        options={options}
        current={shortcuts}
        onSave={save}
      />
    </>
  );
}
