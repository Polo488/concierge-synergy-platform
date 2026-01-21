
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
  const hasActiveItem = section.items.some(item => item.path === location.pathname);

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
        "transition-opacity duration-150",
        isDragging && "opacity-50 z-50"
      )}
    >
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <div className={cn(
          "flex items-center gap-0.5 rounded-lg",
          !isOpen && "md:hidden"
        )}>
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            className={cn(
              "p-1.5 rounded-md cursor-grab active:cursor-grabbing",
              "text-muted-foreground/50 hover:text-muted-foreground",
              "transition-colors touch-none"
            )}
            title="Réorganiser la section"
          >
            <GripVertical size={12} />
          </button>

          <CollapsibleTrigger className={cn(
            "flex items-center justify-between flex-1 px-2 py-2 rounded-lg",
            "text-[10px] font-medium tracking-widest uppercase",
            "hover:bg-muted/30 transition-colors",
            "text-muted-foreground"
          )}>
            <span>{section.title}</span>
            <ChevronDown 
              size={12} 
              className={cn(
                "transition-transform duration-150",
                isExpanded && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="space-y-0.5 mt-0.5">
          {section.items.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150",
                  "group ml-4",
                  isActive 
                    ? "bg-muted text-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  !isOpen && "md:ml-0 md:justify-center"
                )}
              >
                <item.icon size={16} className="flex-shrink-0" />
                
                <span className={cn(
                  "text-sm",
                  !isOpen && "md:hidden",
                  isActive && "font-medium"
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
                    "relative p-2.5 rounded-lg transition-all duration-150",
                    isActive 
                      ? "bg-muted text-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon size={18} />
                </Link>
              );
            })}
          </div>
        )}
      </Collapsible>
    </div>
  );
}
