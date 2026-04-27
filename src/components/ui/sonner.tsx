import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

/**
 * Apple-style toast — capsule glass, bottom-center, swipe to dismiss.
 * Used for undo toasts, success confirmations, and errors.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-center"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast !rounded-full group-[.toaster]:bg-card/90 group-[.toaster]:backdrop-blur-xl group-[.toaster]:saturate-150 group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-border/60 group-[.toaster]:shadow-2xl group-[.toaster]:py-3 group-[.toaster]:px-5 group-[.toaster]:min-h-[56px]",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-xs",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-full group-[.toast]:px-4 group-[.toast]:h-8 group-[.toast]:font-semibold",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-full",
          error:
            "group-[.toaster]:bg-destructive/95 group-[.toaster]:text-destructive-foreground group-[.toaster]:border-destructive/60",
          success:
            "group-[.toaster]:bg-emerald-500/95 group-[.toaster]:text-white group-[.toaster]:border-emerald-500/60",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
