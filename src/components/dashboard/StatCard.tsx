
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    label?: string;
  };
  className?: string;
  helpText?: string;
  footer?: ReactNode;
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  change, 
  className,
  helpText,
  footer
}: StatCardProps) {
  return (
    <div className={cn(
      "bg-card rounded-xl p-5 transition-all duration-200",
      "flex flex-col gap-4 animate-slide-up",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-semibold tracking-tight text-foreground">{value}</h3>
            {change && (
              <div className={cn(
                "flex items-center text-xs font-medium",
                change.type === 'increase' ? 'text-status-success' : 'text-status-error'
              )}>
                {change.type === 'increase' ? (
                  <ArrowUpIcon className="mr-0.5 h-3 w-3" />
                ) : (
                  <ArrowDownIcon className="mr-0.5 h-3 w-3" />
                )}
                {Math.abs(change.value)}%
              </div>
            )}
          </div>
          {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
        </div>
        
        <div className="rounded-lg p-2.5 bg-muted/50 text-muted-foreground">
          {icon}
        </div>
      </div>
      
      {footer && (
        <div className="pt-3 border-t border-border/50 text-sm text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  );
}
