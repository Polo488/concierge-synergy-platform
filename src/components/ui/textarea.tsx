import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/**
 * Apple iOS 26 Textarea — même langage glass que Input.
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[88px] w-full rounded-xl px-3.5 py-2.5 text-[15px] tracking-[-0.01em]",
          "bg-white/55 dark:bg-white/[0.06]",
          "backdrop-blur-[30px] backdrop-saturate-150",
          "border border-white/60 dark:border-white/10",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(0,0,0,0.04)]",
          "dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
          "text-foreground placeholder:text-muted-foreground/70",
          "transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]",
          "focus-visible:outline-none",
          "focus-visible:bg-white/85 dark:focus-visible:bg-white/[0.10]",
          "focus-visible:border-primary/50",
          "focus-visible:shadow-[0_0_0_4px_hsl(var(--primary)/0.18),inset_0_1px_0_rgba(255,255,255,0.7)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "resize-y",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
