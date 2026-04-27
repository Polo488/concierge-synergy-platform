
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Link, useLocation } from 'react-router-dom';

type NavItem = {
  name: string;
  path: string;
  icon: React.ElementType;
  permission: string;
};

type NavSection = {
  id: string;
  title: string;
  colorClass: string;
  activeClass: string;
  bgClass: string;
  iconBgClass: string;
  items: NavItem[];
};

interface SortableSectionProps {
  section: NavSection;
  isExpanded: boolean;
  isOpen: boolean;
  onToggle: () => void;
  isDragging?: boolean;
}

export function SortableSection({
  section,
  isExpanded,
  isOpen,
  onToggle,
  isDragging: externalIsDragging,
}: SortableSectionProps) {
  const location = useLocation();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: localIsDragging,
  } = useSortable({ id: section.id });

  const isDragging = externalIsDragging || localIsDragging;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "transition-opacity duration-150 group/section",
        isDragging && "opacity-50 z-50"
      )}
    >
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <div className={cn(
          "flex items-center mt-5 first:mt-0 px-2",
          !isOpen && "md:hidden"
        )}>
          {/* Drag handle — invisible by default, shows only on hover (Apple style) */}
          <button
            {...attributes}
            {...listeners}
            className={cn(
              "p-1 rounded-md cursor-grab active:cursor-grabbing",
              "opacity-0 group-hover/section:opacity-100 transition-opacity duration-150",
              "text-[hsl(var(--label-3))] hover:text-[hsl(var(--label-1))]",
              "touch-none -ml-1"
            )}
            title="Réorganiser"
            aria-label="Réorganiser la section"
          >
            <GripVertical size={11} strokeWidth={2} />
          </button>

          <CollapsibleTrigger className={cn(
            "flex items-center justify-between flex-1 px-1.5 py-1 rounded-md",
            "transition-colors"
          )}>
            <span
              className="text-[11px] font-semibold uppercase text-[hsl(var(--label-3))]"
              style={{ letterSpacing: '0.06em' }}
            >
              {section.title}
            </span>
            <ChevronDown
              size={12}
              strokeWidth={2}
              className={cn(
                "transition-transform duration-200 text-[hsl(var(--label-3))]",
                isExpanded && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className={cn("space-y-px mt-1", !isOpen && "md:hidden")}>
          {section.items.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 h-9 px-3 mx-2 rounded-[8px] transition-colors duration-150",
                  isActive
                    ? "bg-[hsl(var(--ios-orange)/_0.10)] text-[hsl(var(--ios-orange))] font-semibold"
                    : "text-[hsl(var(--label-1))] hover:bg-[hsl(var(--label-1)/0.06)] dark:hover:bg-white/5",
                  !isOpen && "md:mx-0 md:justify-center md:px-2"
                )}
              >
                <item.icon
                  size={18}
                  strokeWidth={2}
                  className={cn(
                    "flex-shrink-0",
                    isActive ? "text-[hsl(var(--ios-orange))]" : "text-[hsl(var(--label-2))]"
                  )}
                />

                <span className={cn(
                  "text-sm font-medium",
                  !isOpen && "md:hidden"
                )}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </CollapsibleContent>

        {/* Collapsed state - show only icons */}
        {!isOpen && (
          <div className="hidden md:flex flex-col items-center gap-0.5 py-1">
            {section.items.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={item.name}
                  className={cn(
                    "relative h-9 w-9 flex items-center justify-center rounded-[8px] transition-colors duration-150",
                    isActive
                      ? "bg-[hsl(var(--ios-orange)/_0.10)] text-[hsl(var(--ios-orange))]"
                      : "text-[hsl(240_6%_25%/_0.6)] hover:bg-black/[0.04]"
                  )}
                >
                  <item.icon size={18} strokeWidth={2} />
                </Link>
              );
            })}
          </div>
        )}
      </Collapsible>
    </div>
  );
}
