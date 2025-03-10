
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

export function DashboardCard({ title, children, className, actions }: DashboardCardProps) {
  return (
    <div className={cn(
      "glass rounded-xl border border-border/40 overflow-hidden shadow-soft animate-slide-up card-hover",
      className
    )}>
      <div className="flex items-center justify-between p-5 border-b border-border/30">
        <h3 className="font-medium text-foreground">{title}</h3>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
