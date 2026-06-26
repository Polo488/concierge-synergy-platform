import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SortableSectionProps {
  sectionId: string;
  title: string;
  isExpanded: boolean;
  isOpen: boolean;
  onToggle: () => void;
  itemCount: number;
  children: React.ReactNode;
}

export function SortableSection({
  sectionId,
  title,
  isExpanded,
  isOpen,
  onToggle,
  itemCount,
  children,
}: SortableSectionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `sec:${sectionId}`,
  });

  // Droppable area for empty section so items can be dropped into it.
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: `drop:${sectionId}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn('transition-opacity duration-150 group/section', isDragging && 'opacity-50 z-50')}
    >
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <div className={cn('flex items-center mt-5 first:mt-0 px-2', !isOpen && 'md:hidden')}>
          <button
            {...attributes}
            {...listeners}
            className={cn(
              'p-1 rounded-md cursor-grab active:cursor-grabbing',
              'opacity-0 group-hover/section:opacity-100 transition-opacity duration-150',
              'text-[hsl(var(--label-3))] hover:text-[hsl(var(--label-1))]',
              'touch-none -ml-1'
            )}
            aria-label="Réorganiser la section"
          >
            <GripVertical size={11} strokeWidth={2} />
          </button>
          <CollapsibleTrigger className="flex items-center justify-between flex-1 px-1.5 py-1 rounded-md transition-colors">
            <span
              className="text-[11px] font-semibold uppercase text-[hsl(var(--label-3))]"
              style={{ letterSpacing: '0.06em' }}
            >
              {title}
            </span>
            <ChevronDown
              size={12}
              strokeWidth={2}
              className={cn(
                'transition-transform duration-200 text-[hsl(var(--label-3))]',
                isExpanded && 'rotate-180'
              )}
            />
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className={cn('space-y-px mt-1', !isOpen && 'md:hidden')}>
          <div
            ref={setDropRef}
            className={cn(
              'min-h-[8px] rounded-md transition-colors',
              isOver && 'bg-[hsl(var(--ios-orange)/0.06)] ring-1 ring-[hsl(var(--ios-orange)/0.3)]',
              itemCount === 0 && 'min-h-[36px] border border-dashed border-[hsl(var(--hairline))] mx-2'
            )}
          >
            {children}
          </div>
        </CollapsibleContent>

        {!isOpen && <div className="hidden md:flex flex-col items-center gap-0.5 py-1">{children}</div>}
      </Collapsible>
    </div>
  );
}
