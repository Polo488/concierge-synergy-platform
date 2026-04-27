import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Apple iOS 26 Badge — pill tinted 12% opacity, label couleur saturée.
 * Style "Status pill" iOS façon System Settings.
 */
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-[-0.005em] transition-colors whitespace-nowrap",
  {
    variants: {
      variant: {
        default:
          "bg-primary/12 text-primary",
        secondary:
          "bg-foreground/8 text-foreground/80 dark:bg-white/10 dark:text-white/85",
        destructive:
          "bg-[hsl(var(--status-error)/0.12)] text-[hsl(var(--status-error))]",
        outline:
          "border border-border/60 bg-transparent text-muted-foreground backdrop-blur-sm",
        success:
          "bg-[hsl(var(--status-success)/0.12)] text-[hsl(var(--status-success))]",
        warning:
          "bg-[hsl(var(--status-warning)/0.12)] text-[hsl(var(--status-warning))]",
        info:
          "bg-[hsl(var(--status-info)/0.12)] text-[hsl(var(--status-info))]",
        pending:
          "bg-[hsl(var(--status-pending)/0.12)] text-[hsl(var(--status-pending))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
