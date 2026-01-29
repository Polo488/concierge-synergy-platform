import { useState } from 'react';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModuleCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  benefits: string[];
  details?: string;
}

export function ModuleCard({
  icon: Icon,
  title,
  subtitle,
  benefits,
  details,
}: ModuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="group rounded-2xl bg-card border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-card hover:border-border">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 text-left"
      >
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>

          <ChevronDown
            className={cn(
              'h-5 w-5 text-muted-foreground transition-transform flex-shrink-0',
              isExpanded && 'rotate-180'
            )}
          />
        </div>

        <ul className="mt-4 space-y-2">
          {benefits.map((benefit, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-foreground"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </button>

      {isExpanded && details && (
        <div className="px-6 pb-6 pt-0">
          <div className="p-4 rounded-xl bg-muted/50 text-sm text-muted-foreground leading-relaxed">
            {details}
          </div>
        </div>
      )}
    </div>
  );
}
