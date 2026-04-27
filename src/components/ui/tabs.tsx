import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

/**
 * Apple iOS 26 Segmented Control — pill container glass + indicateur blanc qui slide.
 * Easing Apple cubic-bezier(0.32, 0.72, 0, 1).
 */
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center gap-0.5 rounded-full p-1",
      "bg-foreground/[0.06] dark:bg-white/[0.06]",
      "backdrop-blur-[20px] backdrop-saturate-150",
      "border border-white/40 dark:border-white/[0.08]",
      "shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]",
      "text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap gap-1.5",
      "h-7 rounded-full px-3.5 text-[13px] font-semibold tracking-[-0.01em]",
      "transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-0",
      "disabled:pointer-events-none disabled:opacity-50",
      "text-foreground/60 hover:text-foreground/80",
      "data-[state=active]:bg-white data-[state=active]:text-foreground",
      "data-[state=active]:shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.08)]",
      "dark:data-[state=active]:bg-white/[0.14] dark:data-[state=active]:text-white",
      "active:scale-[0.97]",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-3 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
