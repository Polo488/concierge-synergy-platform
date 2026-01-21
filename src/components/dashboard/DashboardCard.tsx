
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  icon?: ReactNode;
  subtitle?: string;
}

export function DashboardCard({ 
  title, 
  children, 
  className, 
  actions, 
  footer, 
  icon,
  subtitle
}: DashboardCardProps) {
  return (
    <div className={cn(
      "bg-card rounded-xl animate-slide-up",
      className
    )}>
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2.5">
            {icon && <span className="text-muted-foreground">{icon}</span>}
            <h3 className="font-medium text-foreground">{title}</h3>
          </div>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="px-6 pb-6">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-border/50 text-sm text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  );
}
