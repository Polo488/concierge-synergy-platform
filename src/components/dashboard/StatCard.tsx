
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
      "glass rounded-xl border border-border/40 p-5 transition-all duration-300",
      "flex flex-col space-y-4 animate-slide-up card-hover",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-semibold tracking-tight">{value}</h3>
            {change && (
              <div className={cn(
                "flex items-center text-xs font-medium",
                change.type === 'increase' ? 'text-green-500' : 'text-red-500'
              )}>
                {change.type === 'increase' ? (
                  <ArrowUpIcon className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownIcon className="mr-1 h-3 w-3" />
                )}
                {Math.abs(change.value)}% {change.label && `(${change.label})`}
              </div>
            )}
          </div>
          {helpText && <p className="text-xs text-muted-foreground mt-1">{helpText}</p>}
        </div>
        
        <div className={cn(
          "rounded-full p-2.5 bg-primary/10",
          "flex items-center justify-center text-primary"
        )}>
          {icon}
        </div>
      </div>
      
      {footer && (
        <div className="pt-2 border-t border-border/30 text-sm text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  );
}
