
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  icon?: ReactNode;
  subtitle?: string; // Added subtitle prop
}

export function DashboardCard({ 
  title, 
  children, 
  className, 
  actions, 
  footer, 
  icon,
  subtitle // Added subtitle prop
}: DashboardCardProps) {
  return (
    <div className={cn(
      "glass rounded-xl border border-border/40 overflow-hidden shadow-soft animate-slide-up card-hover",
      className
    )}>
      <div className="flex items-center justify-between p-5 border-b border-border/30">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            {icon && <span className="text-muted-foreground">{icon}</span>}
            <h3 className="font-medium text-foreground">{title}</h3>
          </div>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>
      <div className="p-5">{children}</div>
      {footer && (
        <div className="px-5 py-3 bg-muted/30 border-t border-border/30">
          {footer}
        </div>
      )}
    </div>
  );
}
