import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Apple iOS 26 Input — translucide blur, focus ring orange diffus.
 * Forme rounded-xl, fond glass blanc 55% + blur 30px, border 1px semi-transparente.
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl px-3.5 py-2 text-[15px] tracking-[-0.01em]",
          "bg-white/55 dark:bg-white/[0.06]",
          "backdrop-blur-[30px] backdrop-saturate-150",
          "border border-white/60 dark:border-white/10",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(0,0,0,0.04)]",
          "dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
          "text-foreground placeholder:text-muted-foreground/70",
          "transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "focus-visible:outline-none",
          "focus-visible:bg-white/85 dark:focus-visible:bg-white/[0.10]",
          "focus-visible:border-primary/50",
          "focus-visible:shadow-[0_0_0_4px_hsl(var(--primary)/0.18),inset_0_1px_0_rgba(255,255,255,0.7)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
