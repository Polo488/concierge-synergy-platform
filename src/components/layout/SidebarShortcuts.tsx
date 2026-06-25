import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebarShortcuts } from '@/hooks/useSidebarShortcuts';
import { ShortcutsPickerDialog, ShortcutOption } from './ShortcutsPickerDialog';

interface Props {
  options: ShortcutOption[];
  isCollapsed: boolean;
}

export function SidebarShortcuts({ options, isCollapsed }: Props) {
  const { shortcuts, save, isLoaded } = useSidebarShortcuts();
  const [pickerOpen, setPickerOpen] = useState(false);

  if (!isLoaded) return null;

  const pinned = shortcuts
    .map(path => options.find(o => o.path === path))
    .filter((o): o is ShortcutOption => Boolean(o));

  return (
    <>
      <div className="px-2 pt-2 pb-1 flex-shrink-0">
        {!isCollapsed && (
          <div className="flex items-center justify-between px-3 pb-1.5">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1">
              <Pin className="h-3 w-3" /> Raccourcis
            </span>
            <button
              onClick={() => setPickerOpen(true)}
              className="text-[10px] text-[hsl(var(--ios-orange))] hover:underline font-medium"
            >
              Modifier
            </button>
          </div>
        )}

        <div
          className={cn(
            'flex gap-1',
            isCollapsed ? 'flex-col items-center' : 'flex-row flex-wrap px-1'
          )}
        >
          {pinned.map(item => {
            const Icon = item.icon;
            const link = (
              <Link
                to={item.path}
                className="flex items-center justify-center h-8 w-8 rounded-[8px] text-[hsl(var(--label-1))] hover:bg-black/[0.04] transition-colors"
                aria-label={item.name}
              >
                <Icon size={16} strokeWidth={2} className="text-[hsl(240_6%_25%/_0.7)]" />
              </Link>
            );
            return (
              <TooltipProvider key={item.path} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side={isCollapsed ? 'right' : 'top'} sideOffset={8}>
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}

          {pinned.length < 5 && (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setPickerOpen(true)}
                    className="flex items-center justify-center h-8 w-8 rounded-[8px] border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                    aria-label="Ajouter un raccourci"
                  >
                    <Plus size={14} strokeWidth={2} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side={isCollapsed ? 'right' : 'top'} sideOffset={8}>
                  <p>Ajouter un raccourci</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
