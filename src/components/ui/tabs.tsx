import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

/**
 * Apple iOS 26 Segmented Control — pill container glass + indicateur (thumb) qui slide.
 * - Auto-scroll horizontal sans scrollbar sur mobile (overflow-x).
 * - Thumb animé qui suit l'onglet actif (cubic-bezier Apple).
 * - Compatible avec les usages existants (className grid grid-cols-N reste possible
 *   si l'appelant insiste, mais le défaut est le segmented pill scrollable).
 */
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...props }, ref) => {
  const listRef = React.useRef<HTMLDivElement | null>(null)
  const [thumb, setThumb] = React.useState<{ left: number; width: number; visible: boolean }>({
    left: 0,
    width: 0,
    visible: false,
  })

  // Merge external ref
  React.useImperativeHandle(ref, () => listRef.current as HTMLDivElement)

  const updateThumb = React.useCallback(() => {
    const container = listRef.current
    if (!container) return
    const active = container.querySelector<HTMLElement>('[data-state="active"]')
    if (!active) {
      setThumb((t) => ({ ...t, visible: false }))
      return
    }
    const cRect = container.getBoundingClientRect()
    const aRect = active.getBoundingClientRect()
    setThumb({
      left: aRect.left - cRect.left + container.scrollLeft,
      width: aRect.width,
      visible: true,
    })
  }, [])

  React.useEffect(() => {
    updateThumb()
    const container = listRef.current
    if (!container) return
    const ro = new ResizeObserver(() => updateThumb())
    ro.observe(container)
    Array.from(container.querySelectorAll('[role="tab"]')).forEach((el) => ro.observe(el))
    // Observe attribute changes (data-state) on triggers
    const mo = new MutationObserver(() => updateThumb())
    Array.from(container.querySelectorAll('[role="tab"]')).forEach((el) =>
      mo.observe(el, { attributes: true, attributeFilter: ["data-state"] })
    )
    container.addEventListener("scroll", updateThumb, { passive: true })
    window.addEventListener("resize", updateThumb)
    return () => {
      ro.disconnect()
      mo.disconnect()
      container.removeEventListener("scroll", updateThumb)
      window.removeEventListener("resize", updateThumb)
    }
  }, [updateThumb, children])

  return (
    <TabsPrimitive.List
      ref={listRef}
      className={cn(
        // Container iOS segmented — liquid glass translucide
        "relative inline-flex items-center gap-0 rounded-[9px] sm:rounded-[10px]",
        "p-[2px] sm:p-[3px]",
        "bg-[hsl(var(--label-1)/0.05)] dark:bg-white/[0.06]",
        "backdrop-blur-[20px] backdrop-saturate-[180%]",
        "border border-[hsl(var(--label-1)/0.04)] dark:border-white/[0.06]",
        "shadow-[inset_0_1px_0_hsl(0_0%_100%/0.4)] dark:shadow-[inset_0_1px_0_hsl(0_0%_100%/0.04)]",
        "text-muted-foreground align-top",
        // Scroll horizontal sans scrollbar (suppression complète webkit + firefox + edge)
        "max-w-full overflow-x-auto overflow-y-hidden whitespace-nowrap",
        "[scrollbar-width:none] [-ms-overflow-style:none]",
        "[&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:h-0",
        "[&::-webkit-scrollbar-track]:hidden [&::-webkit-scrollbar-thumb]:hidden",
        "[&::-webkit-scrollbar-corner]:hidden",
        // Hauteur compacte iOS — 30px mobile, 34px desktop
        "h-[30px] sm:h-[34px]",
        className
      )}
      {...props}
    >
      {/* Thumb glissant — vrai liquid glass */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-[2px] bottom-[2px] sm:top-[3px] sm:bottom-[3px]",
          "rounded-[7px] sm:rounded-[8px] z-0",
          "bg-gradient-to-b from-[hsl(var(--surface-1)/0.92)] to-[hsl(var(--surface-1)/0.78)]",
          "shadow-[inset_0_1px_0_hsl(0_0%_100%/0.7),0_1px_2px_hsl(var(--label-1)/0.08),0_2px_6px_hsl(var(--label-1)/0.06)]",
          "backdrop-blur-[12px] backdrop-saturate-[160%]",
          "dark:from-white/[0.16] dark:to-white/[0.10]",
          "dark:shadow-[inset_0_1px_0_hsl(0_0%_100%/0.12),0_1px_2px_hsl(0_0%_0%/0.4)]",
          "transition-[left,width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          !thumb.visible && "opacity-0"
        )}
        style={{ left: thumb.left, width: thumb.width }}
      />
      {children}
    </TabsPrimitive.List>
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
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
      "font-semibold tracking-[-0.01em]",
      "transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-0",
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
