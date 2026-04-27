/**
 * Toast helpers — Apple iOS 26 capsule glass.
 *
 * Centralise les durées et variantes pour TOUTE l'app.
 * Utilise sonner sous le capot ; les classes glass sont définies dans
 * `src/components/ui/sonner.tsx` via le `<Toaster />` global.
 *
 * Durées standardisées :
 *  - success : 3500 ms (action validée → confirmation rapide)
 *  - info    : 3500 ms (info neutre)
 *  - warning : 4500 ms (vigilance → laisser le temps de lire)
 *  - error   : 5500 ms (échec → laisser le temps d'agir)
 *  - loading : Infinity (jusqu'à update/dismiss explicite)
 *
 * Usage recommandé :
 *   import { toast } from "@/lib/toast";
 *   toast.success("Logement enregistré");
 *   toast.error("Connexion impossible", { description: "Réessayez." });
 *
 * Compatibilité : `import { toast } from "sonner"` continue de fonctionner
 * (les classes glass viennent du Toaster global), mais utilisez ce module
 * pour bénéficier des durées standardisées.
 */
import { toast as sonnerToast, type ExternalToast } from "sonner";

export const TOAST_DURATIONS = {
  success: 3500,
  info: 3500,
  warning: 4500,
  error: 5500,
  loading: Infinity,
  default: 3500,
} as const;

type Opts = Omit<ExternalToast, "duration"> & { duration?: number };

const withDuration = (
  defaultDuration: number,
  opts?: Opts,
): ExternalToast => ({
  ...opts,
  duration: opts?.duration ?? defaultDuration,
});

export const toast = Object.assign(
  (message: string, opts?: Opts) =>
    sonnerToast(message, withDuration(TOAST_DURATIONS.default, opts)),
  {
    success: (message: string, opts?: Opts) =>
      sonnerToast.success(message, withDuration(TOAST_DURATIONS.success, opts)),
    error: (message: string, opts?: Opts) =>
      sonnerToast.error(message, withDuration(TOAST_DURATIONS.error, opts)),
    warning: (message: string, opts?: Opts) =>
      sonnerToast.warning(message, withDuration(TOAST_DURATIONS.warning, opts)),
    info: (message: string, opts?: Opts) =>
      sonnerToast.info(message, withDuration(TOAST_DURATIONS.info, opts)),
    loading: (message: string, opts?: Opts) =>
      sonnerToast.loading(message, withDuration(TOAST_DURATIONS.loading, opts)),
    message: (message: string, opts?: Opts) =>
      sonnerToast.message(message, withDuration(TOAST_DURATIONS.default, opts)),
    promise: sonnerToast.promise,
    dismiss: sonnerToast.dismiss,
    custom: sonnerToast.custom,
  },
);

export default toast;
