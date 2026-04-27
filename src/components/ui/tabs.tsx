import { forwardRef } from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const shouldStayHidden = className?.split(/\s+/).includes("hidden")

  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        !shouldStayHidden && "ios-tabs-list !border-0 !shadow-none !outline-none !ring-0 !ring-offset-0",
        className
      )}
      {...props}
    />
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "relative z-10 inline-flex items-center justify-center whitespace-nowrap gap-1 sm:gap-1.5",
      // Compact iOS sizing — smaller on mobile
      "h-[26px] sm:h-[28px] rounded-[7px] sm:rounded-[8px]",
      "px-2.5 sm:px-3.5 text-[12px] sm:text-[13px]",
      "font-semibold tracking-normal",
      "!border-0 bg-transparent !shadow-none",
      "transition-[background,color,box-shadow,transform] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]",
      "!outline-none !ring-0 !ring-offset-0 focus:!outline-none focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0",
      "disabled:pointer-events-none disabled:opacity-50",
      "text-[hsl(var(--label-1)/0.55)] hover:text-[hsl(var(--label-1)/0.8)]",
      "data-[state=active]:text-[hsl(var(--label-1))]",
      "dark:data-[state=active]:text-white",
      "active:scale-[0.97]",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = forwardRef<
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
