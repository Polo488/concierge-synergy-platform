import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Apple iOS 26 Liquid Glass Button
 * Refonte globale : tous les <Button> de l'app héritent automatiquement du style Apple.
 * - Pill rounded-full, font 15/600, letter-spacing -0.01em
 * - Active scale 0.97 avec easing Apple cubic-bezier(0.32, 0.72, 0, 1)
 * - Variants: primary (orange gradient), secondary (glass), ghost, outline (glass thin),
 *   destructive (red gradient), link, icon
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-semibold tracking-[-0.01em]",
    "transition-[transform,box-shadow,background-color,color,border-color] duration-200",
    "ease-[cubic-bezier(0.32,0.72,0,1)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    "active:scale-[0.97] cursor-pointer select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary — orange gradient liquid glass
        default: [
          "rounded-full text-white",
          "bg-gradient-to-b from-[#FF6B2C] to-[#FF5C1A]",
          "shadow-[0_8px_24px_rgba(255,92,26,0.30),inset_0_1px_0_rgba(255,255,255,0.25)]",
          "hover:shadow-[0_10px_28px_rgba(255,92,26,0.40),inset_0_1px_0_rgba(255,255,255,0.30)]",
          "hover:brightness-[1.03]",
        ].join(" "),

        // Destructive — red gradient liquid glass
        destructive: [
          "rounded-full text-white",
          "bg-gradient-to-b from-[#FF453A] to-[#FF3B30]",
          "shadow-[0_8px_24px_rgba(255,59,48,0.30),inset_0_1px_0_rgba(255,255,255,0.25)]",
          "hover:brightness-[1.03]",
        ].join(" "),

        // Outline / Secondary glass — translucide blur
        outline: [
          "rounded-full text-foreground",
          "bg-white/55 dark:bg-white/[0.06]",
          "backdrop-blur-[40px] backdrop-saturate-150",
          "border border-white/50 dark:border-white/10",
          "shadow-[0_4px_12px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.7)]",
          "dark:shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]",
          "hover:bg-white/80 dark:hover:bg-white/[0.10]",
        ].join(" "),

        secondary: [
          "rounded-full text-foreground",
          "bg-white/55 dark:bg-white/[0.06]",
          "backdrop-blur-[40px] backdrop-saturate-150",
          "border border-white/50 dark:border-white/10",
          "shadow-[0_4px_12px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.7)]",
          "dark:shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]",
          "hover:bg-white/80 dark:hover:bg-white/[0.10]",
        ].join(" "),

        // Ghost — tertiaire iOS, accent orange au hover
        ghost: [
          "rounded-xl text-foreground",
          "bg-transparent",
          "hover:bg-foreground/[0.06] dark:hover:bg-white/[0.08]",
        ].join(" "),

        link: "text-primary underline-offset-4 hover:underline rounded-md",
      },
      size: {
        default: "h-10 px-5 text-[15px]",
        sm: "h-9 px-4 text-[14px]",
        lg: "h-12 px-7 text-[16px]",
        icon: "h-10 w-10 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
