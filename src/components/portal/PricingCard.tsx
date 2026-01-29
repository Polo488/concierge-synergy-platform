import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PricingCardProps {
  title: string;
  subtitle: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  ctaLink: string;
  highlighted?: boolean;
  addon?: string;
}

export function PricingCard({
  title,
  subtitle,
  price,
  period,
  features,
  cta,
  ctaLink,
  highlighted = false,
  addon,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl p-6 sm:p-8 transition-all duration-300',
        highlighted
          ? 'bg-primary text-primary-foreground shadow-float scale-[1.02]'
          : 'bg-card border border-border/50 hover:shadow-card hover:border-border'
      )}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-foreground text-background text-xs font-medium rounded-full">
          Populaire
        </div>
      )}

      <div className="text-center mb-6">
        <h3
          className={cn(
            'text-xl font-semibold mb-1',
            highlighted ? 'text-primary-foreground' : 'text-foreground'
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            'text-sm',
            highlighted ? 'text-primary-foreground/80' : 'text-muted-foreground'
          )}
        >
          {subtitle}
        </p>
      </div>

      <div className="text-center mb-6">
        <div className="flex items-baseline justify-center gap-1">
          <span
            className={cn(
              'text-4xl font-bold',
              highlighted ? 'text-primary-foreground' : 'text-foreground'
            )}
          >
            {price}
          </span>
          <span
            className={cn(
              'text-sm',
              highlighted ? 'text-primary-foreground/80' : 'text-muted-foreground'
            )}
          >
            {period}
          </span>
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check
              className={cn(
                'h-5 w-5 flex-shrink-0 mt-0.5',
                highlighted ? 'text-primary-foreground' : 'text-primary'
              )}
            />
            <span
              className={cn(
                'text-sm',
                highlighted ? 'text-primary-foreground' : 'text-foreground'
              )}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {addon && (
        <div
          className={cn(
            'p-3 rounded-lg mb-6 text-sm',
            highlighted
              ? 'bg-primary-foreground/10 text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {addon}
        </div>
      )}

      <Button
        size="lg"
        className="w-full"
        variant={highlighted ? 'secondary' : 'default'}
        asChild
      >
        <Link to={ctaLink}>{cta}</Link>
      </Button>
    </div>
  );
}
