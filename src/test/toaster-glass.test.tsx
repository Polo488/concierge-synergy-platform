/**
 * Régression visuelle — `<Toaster />` Apple iOS 26 capsule glass.
 *
 * Vérifie que la config sonner exposée par `src/components/ui/sonner.tsx`
 * contient bien :
 *  - duration globale 3500ms
 *  - position bottom-center, visibleToasts 4
 *  - classes glass : backdrop-blur-[50px], saturate-200, rounded-2xl
 *  - classes tintées par variante (success/error/warning/info)
 *  - shadow Apple douce
 *
 * On capture les props passées à `Sonner` via mock plutôt que de tester
 * le DOM réel (sonner ne rend rien tant qu'aucun toast n'est émis).
 */
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

let capturedProps: any = null;

vi.mock("sonner", () => ({
  Toaster: (props: any) => {
    capturedProps = props;
    return null;
  },
  toast: vi.fn(),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light" }),
}));

import { Toaster } from "@/components/ui/sonner";

describe("<Toaster /> — Apple iOS 26 capsule glass", () => {
  it("est configuré bottom-center avec 4 toasts visibles max", () => {
    render(<Toaster />);
    expect(capturedProps).toBeTruthy();
    expect(capturedProps.position).toBe("bottom-center");
    expect(capturedProps.visibleToasts).toBe(4);
  });

  it("durée par défaut = 3500ms (standard success/info)", () => {
    render(<Toaster />);
    expect(capturedProps.toastOptions.duration).toBe(3500);
  });

  it("classes glass : blur 50px + saturate 200% + rounded-2xl", () => {
    render(<Toaster />);
    const toastClasses = capturedProps.toastOptions.classNames.toast as string;
    expect(toastClasses).toContain("backdrop-blur-[50px]");
    expect(toastClasses).toContain("saturate-200");
    expect(toastClasses).toContain("rounded-2xl");
  });

  it("shadow douce Apple (16px + 4px)", () => {
    render(<Toaster />);
    const toastClasses = capturedProps.toastOptions.classNames.toast as string;
    expect(toastClasses).toContain("shadow-[0_16px_40px_rgba(0,0,0,0.16)");
  });

  it("padding capsule + min-height 56px + medium tracking serré", () => {
    render(<Toaster />);
    const toastClasses = capturedProps.toastOptions.classNames.toast as string;
    expect(toastClasses).toContain("min-h-[56px]");
    expect(toastClasses).toContain("font-medium");
    expect(toastClasses).toContain("tracking-[-0.01em]");
  });

  it.each([
    ["success", "--status-success"],
    ["error", "--status-error"],
    ["warning", "--status-warning"],
    ["info", "--status-info"],
  ])("variante %s utilise le token %s avec opacité 12%%", (variant, token) => {
    render(<Toaster />);
    const cls = capturedProps.toastOptions.classNames[variant] as string;
    expect(cls).toContain(token);
    expect(cls).toContain("/0.12");
  });

  it("description en muted + 13px (sous-titre Apple)", () => {
    render(<Toaster />);
    const descClasses = capturedProps.toastOptions.classNames.description as string;
    expect(descClasses).toContain("text-muted-foreground");
    expect(descClasses).toContain("text-[13px]");
  });
});
