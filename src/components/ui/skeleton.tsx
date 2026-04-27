import { cn } from "@/lib/utils";

/**
 * Apple-style shimmer skeleton.
 * Uses a moving linear gradient (background-position animation).
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-md bg-muted/60 animate-shimmer-fast",
        "bg-[length:200%_100%]",
        "bg-[linear-gradient(90deg,hsl(var(--muted))_0%,hsl(var(--muted)/0.4)_50%,hsl(var(--muted))_100%)]",
        "motion-reduce:animate-pulse motion-reduce:bg-muted",
        className
      )}
      aria-busy="true"
      aria-live="polite"
      {...props}
    />
  );
}

export { Skeleton };
