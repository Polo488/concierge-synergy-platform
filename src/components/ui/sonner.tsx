import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

/**
 * Apple iOS 26 Toast — capsule glass blur 50px saturate 200%, bottom-center.
 * Forme rounded-full, bordure semi-transparente, shadow douce, swipe-to-dismiss.
 * Variants tintés (success vert iOS / error rouge iOS) en 12% opacity sur le fond glass.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-center"
      className="toaster group"
      visibleToasts={4}
      gap={10}
      offset={24}
      toastOptions={{
        // Durée par défaut standardisée — variantes peuvent overrider via lib/toast.ts
        duration: 3500,
        classNames: {
          toast: [
            "group toast",
            "group-[.toaster]:!rounded-2xl",
            "group-[.toaster]:bg-white/72 dark:group-[.toaster]:bg-[hsl(240,10%,12%)]/72",
            "group-[.toaster]:backdrop-blur-[50px] group-[.toaster]:saturate-200",
            "group-[.toaster]:text-foreground",
            "group-[.toaster]:border group-[.toaster]:border-black/[0.06] dark:group-[.toaster]:border-white/[0.08]",
            "group-[.toaster]:shadow-[0_16px_40px_rgba(0,0,0,0.16),0_4px_12px_rgba(0,0,0,0.08)]",
            "group-[.toaster]:py-3 group-[.toaster]:px-4 group-[.toaster]:min-h-[56px]",
            "group-[.toaster]:font-medium group-[.toaster]:tracking-[-0.01em]",
          ].join(" "),
          description:
            "group-[.toast]:text-muted-foreground group-[.toast]:text-[13px] group-[.toast]:font-normal",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-full group-[.toast]:px-3.5 group-[.toast]:h-8 group-[.toast]:font-semibold group-[.toast]:text-[13px]",
          cancelButton:
            "group-[.toast]:bg-foreground/[0.08] group-[.toast]:text-foreground group-[.toast]:rounded-full group-[.toast]:px-3.5 group-[.toast]:h-8 group-[.toast]:font-medium",
          error: [
            "group-[.toaster]:!bg-[hsl(var(--status-error)/0.12)] dark:group-[.toaster]:!bg-[hsl(var(--status-error)/0.20)]",
            "group-[.toaster]:!text-[hsl(var(--status-error))]",
            "group-[.toaster]:!border-[hsl(var(--status-error)/0.25)]",
          ].join(" "),
          success: [
            "group-[.toaster]:!bg-[hsl(var(--status-success)/0.12)] dark:group-[.toaster]:!bg-[hsl(var(--status-success)/0.20)]",
            "group-[.toaster]:!text-[hsl(var(--status-success))]",
            "group-[.toaster]:!border-[hsl(var(--status-success)/0.25)]",
          ].join(" "),
          warning: [
            "group-[.toaster]:!bg-[hsl(var(--status-warning)/0.12)] dark:group-[.toaster]:!bg-[hsl(var(--status-warning)/0.20)]",
            "group-[.toaster]:!text-[hsl(var(--status-warning))]",
            "group-[.toaster]:!border-[hsl(var(--status-warning)/0.25)]",
          ].join(" "),
          info: [
            "group-[.toaster]:!bg-[hsl(var(--status-info)/0.12)] dark:group-[.toaster]:!bg-[hsl(var(--status-info)/0.20)]",
            "group-[.toaster]:!text-[hsl(var(--status-info))]",
            "group-[.toaster]:!border-[hsl(var(--status-info)/0.25)]",
          ].join(" "),
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
