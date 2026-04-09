
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
      "bg-white rounded-2xl animate-slide-up",
      className
    )} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2.5">
            {icon && <span className="text-muted-foreground">{icon}</span>}
            <h3 className="font-bold text-[17px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1A1A2E' }}>{title}</h3>
          </div>
          {subtitle && <p className="text-[13px]" style={{ color: 'rgba(26,26,46,0.4)', fontFamily: 'Inter' }}>{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }} />
      <div className="px-6 pb-6 pt-4">{children}</div>
      {footer && (
        <div className="px-6 py-4 text-sm text-muted-foreground" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          {footer}
        </div>
      )}
    </div>
  );
}
