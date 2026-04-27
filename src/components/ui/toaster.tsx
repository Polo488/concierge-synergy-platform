/**
 * Legacy Toaster — désormais un no-op.
 *
 * Toute l'app utilise <Sonner /> (composant `Toaster` exporté par
 * `@/components/ui/sonner`) pour un rendu uniforme en capsule glass iOS 26.
 * Ce composant est conservé pour ne pas casser les imports existants.
 */
export function Toaster() {
  return null;
}
