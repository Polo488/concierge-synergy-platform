import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ValueBlockProps {
  icon: LucideIcon;
  title: string;
  description: string;
  benefits: string[];
  className?: string;
}

export function ValueBlock({
  icon: Icon,
  title,
  description,
  benefits,
  className,
}: ValueBlockProps) {
  return (
    <div
      className={cn(
        'group p-6 rounded-2xl bg-card border border-border/50 transition-all duration-300',
        'hover:shadow-card hover:border-border',
        className
      )}
    >
      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {description}
      </p>
      
      <ul className="space-y-2">
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
    </div>
  );
}
