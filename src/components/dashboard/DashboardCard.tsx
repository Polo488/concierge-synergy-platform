
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
      "bg-white rounded-[14px] animate-slide-up",
      className
    )} style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2.5">
            {icon && <span className="text-muted-foreground">{icon}</span>}
            <h3 className="font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '16px', color: '#1A1A2E' }}>{title}</h3>
          </div>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="px-6 pb-6">{children}</div>
      {footer && (
        <div className="px-6 py-4 text-sm text-muted-foreground" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          {footer}
        </div>
      )}
    </div>
  );
}
