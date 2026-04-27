import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  variant?: "first-time" | "no-results" | "all-caught-up";
  className?: string;
}

/**
 * Apple-style empty states. Three variants:
 *  - first-time: invite to start
 *  - no-results: filter/search returned nothing
 *  - all-caught-up: positive zero-state
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  variant = "first-time",
  className,
}: EmptyStateProps) {
  const iconTint =
    variant === "all-caught-up"
      ? "text-emerald-500 bg-emerald-500/10"
      : variant === "no-results"
      ? "text-muted-foreground bg-muted"
      : "text-primary bg-primary/10";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center px-6 py-12 md:py-16 animate-fade-in",
        className
      )}
    >
      {Icon && (
        <div
          className={cn(
            "h-20 w-20 rounded-3xl flex items-center justify-center mb-5 ring-1 ring-border/40",
            iconTint
          )}
        >
          <Icon className="h-9 w-9" strokeWidth={1.6} />
        </div>
      )}
      <h3 className="text-lg md:text-xl font-semibold font-heading text-foreground max-w-md">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-2 max-w-md leading-relaxed">
          {description}
        </p>
      )}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-2 mt-6">
          {action && (
            <Button onClick={action.onClick} className="min-h-[44px] rounded-full px-6">
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="ghost"
              onClick={secondaryAction.onClick}
              className="min-h-[44px] rounded-full px-6"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
