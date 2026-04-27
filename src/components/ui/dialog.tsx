import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      // Apple-like scrim: neutral dim that flattens vivid colors behind the sheet,
      // light blur (no saturation boost — was creating iridescent halos).
      "fixed inset-0 z-50 bg-black/45 backdrop-blur-[8px]",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid translate-x-[-50%] translate-y-[-50%] gap-4 p-4 sm:p-6 text-foreground",
        // Always respect iOS gutter — never overflow the viewport on mobile.
        "w-[calc(100vw-2*var(--app-gutter,20px))] max-w-lg",
        "max-h-[calc(100dvh-2*var(--app-gutter,20px))] overflow-y-auto overscroll-contain",
        "rounded-[22px]",
        // Near-opaque sheet (Apple modal cards are not see-through). No saturation boost
        // → no iridescent halos from colored content (charts, photos) behind.
        "bg-[hsl(0,0%,99%)]/[0.96] dark:bg-[hsl(240,10%,12%)]/[0.94]",
        "backdrop-blur-[20px]",
        "border border-black/[0.06] dark:border-white/[0.08]",
        "shadow-[0_20px_48px_-12px_rgba(16,24,40,0.18),0_4px_12px_-4px_rgba(16,24,40,0.08),inset_0_1px_0_rgba(255,255,255,0.65)]",
        "dark:shadow-[0_24px_60px_rgba(0,0,0,0.55),0_8px_20px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.04)]",
        "duration-200",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className={cn(
        "absolute right-4 top-4 flex items-center justify-center w-7 h-7 rounded-full",
        "bg-foreground/[0.08] dark:bg-white/[0.10] text-foreground/70",
        "transition-all duration-150 hover:bg-foreground/[0.14] hover:text-foreground active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-ring/40 disabled:pointer-events-none"
      )}>
        <X className="h-3.5 w-3.5" strokeWidth={2.5} />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
