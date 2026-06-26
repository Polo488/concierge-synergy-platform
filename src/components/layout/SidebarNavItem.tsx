import { Link, useLocation } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type SidebarNavLeaf = {
  name: string;
  path: string;
  icon: React.ElementType;
};

interface Props {
  item: SidebarNavLeaf;
  isCollapsed: boolean;
  /** Visual emphasis variant — top zone uses a slightly stronger style. */
  variant?: 'default' | 'top';
}

export function SidebarNavItem({ item, isCollapsed, variant = 'default' }: Props) {
  const location = useLocation();
  const isActive = location.pathname === item.path;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `item:${item.path}`,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const Icon = item.icon;
  const link = (
    <Link
      to={item.path}
      className={cn(
        'flex items-center gap-3 h-9 px-3 mx-1 rounded-[8px] transition-colors duration-150 select-none',
        isActive
          ? 'bg-[hsl(var(--ios-orange)/_0.10)] text-[hsl(var(--ios-orange))] font-semibold'
          : 'text-[hsl(var(--label-1))] hover:bg-[hsl(var(--label-1)/0.06)] dark:hover:bg-white/5',
        variant === 'top' && !isActive && 'bg-black/[0.02] dark:bg-white/[0.03]',
        isCollapsed && 'justify-center mx-0 px-2'
      )}
    >
      <Icon
        size={18}
        strokeWidth={2}
        className={cn(
          'flex-shrink-0',
          isActive ? 'text-[hsl(var(--ios-orange))]' : 'text-[hsl(var(--label-2))]'
        )}
      />
      {!isCollapsed && <span className="text-sm font-medium truncate">{item.name}</span>}
    </Link>
  );

  const inner = isCollapsed ? (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          <p>{item.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    link
  );

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
      {inner}
    </div>
  );
}
