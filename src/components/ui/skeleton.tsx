import { cn } from "@/lib/utils";

/**
 * Apple-style shimmer skeleton.
 * Uses a moving gradient overlay rather than a flat pulse.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted/60",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent",
        "before:animate-[shimmer-fast_1.6s_ease-in-out_infinite]",
        "motion-reduce:before:hidden motion-reduce:animate-pulse",
        className
      )}
      aria-busy="true"
      aria-live="polite"
      {...props}
    />
  );
}

export { Skeleton };
