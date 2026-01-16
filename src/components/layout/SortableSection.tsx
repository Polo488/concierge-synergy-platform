
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
import { ReactNode } from 'react';

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
        "transition-opacity duration-200",
        isDragging && "opacity-50 z-50"
      )}
    >
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <div className={cn(
          "flex items-center gap-1 rounded-lg",
          hasActiveItem && section.bgClass,
          !isOpen && "md:hidden"
        )}>
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            className={cn(
              "p-1.5 rounded-md cursor-grab active:cursor-grabbing",
              "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              "transition-colors touch-none"
            )}
            title="Réorganiser la section"
          >
            <GripVertical size={14} />
          </button>

          <CollapsibleTrigger className={cn(
            "flex items-center justify-between flex-1 px-2 py-2 rounded-lg",
            "text-xs font-semibold tracking-wider",
            "hover:bg-muted/50 transition-colors",
            section.colorClass
          )}>
            <span>{section.title}</span>
            <ChevronDown 
              size={14} 
              className={cn(
                "transition-transform duration-200",
                isExpanded && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="space-y-0.5 mt-1">
          {section.items.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-2 py-2.5 rounded-lg transition-all duration-200",
                  "group hover:bg-muted/50 border-l-2 border-transparent ml-1",
                  isActive && section.activeClass,
                  !isOpen && "md:ml-0 md:justify-center"
                )}
              >
                <div className={cn(
                  "flex-shrink-0 p-1.5 rounded-md transition-colors",
                  isActive ? section.iconBgClass : "bg-muted/50 text-muted-foreground group-hover:bg-muted"
                )}>
                  <item.icon size={16} />
                </div>
                
                <span className={cn(
                  "font-medium text-sm",
                  !isOpen && "md:hidden",
                  !isActive && "text-foreground/80"
                )}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </CollapsibleContent>
        
        {/* Collapsed state - show only icons */}
        {!isOpen && (
          <div className="hidden md:flex flex-col items-center gap-1 py-1">
            {section.items.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={item.name}
                  className={cn(
                    "relative p-2 rounded-lg transition-all duration-200",
                    "hover:bg-muted/50",
                    isActive && section.iconBgClass
                  )}
                >
                  <item.icon size={18} />
                  {isActive && (
                    <div 
                      className={cn(
                        "absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-l-md",
                        section.colorClass.replace('text-', 'bg-')
                      )} 
                    />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </Collapsible>
    </div>
  );
}
