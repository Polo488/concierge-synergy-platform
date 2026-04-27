import { toast } from "sonner";
import { haptic } from "@/lib/haptic";

interface UndoOptions {
  /** Message displayed in the toast */
  message: string;
  /** Called when user taps "Annuler" — revert your optimistic change here */
  onUndo: () => void | Promise<void>;
  /** Called when toast expires without undo — commit the change here */
  onCommit?: () => void | Promise<void>;
  /** Duration before commit (ms). Default 5000. */
  duration?: number;
  /** Optional sub-description */
  description?: string;
}

/**
 * Apple-style "Undo" toast — replaces destructive confirmation modals.
 * Action runs immediately (optimistic), this toast lets the user revert it.
 */
export function showUndoToast({
  message,
  onUndo,
  onCommit,
  duration = 5000,
  description,
}: UndoOptions) {
  let undone = false;
  haptic.warning();

  const id = toast(message, {
    description,
    duration,
    action: {
      label: "Annuler",
      onClick: () => {
        undone = true;
        haptic.selection();
        Promise.resolve(onUndo()).catch(() => {
          /* swallow */
        });
      },
    },
    onAutoClose: () => {
      if (!undone && onCommit) {
        Promise.resolve(onCommit()).catch(() => {
          /* swallow */
        });
      }
    },
  });

  return id;
}

export default showUndoToast;
