/**
 * Compatibility shim — l'ancien `useToast` (radix) est redirigé vers Sonner
 * pour garantir un rendu UNIFORME (capsule glass iOS 26) sur toute l'app.
 *
 * L'API historique est conservée :
 *   const { toast } = useToast();
 *   toast({ title, description, variant: 'destructive' | 'default' });
 *
 * Pour les nouveaux usages, préférer `import { toast } from "@/lib/toast"`.
 */
import * as React from "react";
import { toast as appToast, TOAST_DURATIONS } from "@/lib/toast";

type LegacyVariant = "default" | "destructive" | "success" | "warning" | "info";

interface LegacyToastInput {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: LegacyVariant;
  duration?: number;
  action?: React.ReactNode;
}

const renderNode = (node: React.ReactNode): string => {
  if (node == null || node === false) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  // Fallback : laisse Sonner afficher le ReactNode via description
  return "";
};

function toast(input: LegacyToastInput | string) {
  if (typeof input === "string") {
    return appToast(input);
  }

  const { title, description, variant = "default", duration } = input;
  const message = renderNode(title) || renderNode(description) || "";
  const opts = {
    description:
      typeof description === "string" || typeof description === "number"
        ? String(description)
        : description,
    duration,
  };

  switch (variant) {
    case "destructive":
      return appToast.error(message, opts);
    case "success":
      return appToast.success(message, opts);
    case "warning":
      return appToast.warning(message, opts);
    case "info":
      return appToast.info(message, opts);
    default:
      return appToast(message, opts);
  }
}

function useToast() {
  return {
    toast,
    dismiss: appToast.dismiss,
    toasts: [] as never[],
  };
}

export { useToast, toast, TOAST_DURATIONS };
