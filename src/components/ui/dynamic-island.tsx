import { useProgressTasks, progressTasks } from "@/stores/progressTasks";
import { Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Apple Dynamic Island-style floating pill for background tasks.
 * Renders top-center under the nav. Stacks vertically when multiple tasks.
 */
export function DynamicIsland() {
  const tasks = useProgressTasks();

  if (tasks.length === 0) return null;

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2 pointer-events-none"
      style={{ top: "calc(72px + env(safe-area-inset-top, 0px))" }}
      aria-live="polite"
    >
      {tasks.map((t) => {
        const isRunning = t.status === "running";
        const isSuccess = t.status === "success";
        const isError = t.status === "error";

        return (
          <button
            key={t.id}
            type="button"
            onClick={t.onClick ?? (() => progressTasks.dismiss(t.id))}
            className={cn(
              "pointer-events-auto group flex items-center gap-2.5 px-4 h-11 rounded-full",
              "backdrop-blur-2xl saturate-150 shadow-2xl border transition-all duration-300",
              "max-w-[min(92vw,360px)] animate-[notification-pop_0.4s_cubic-bezier(0.34,1.56,0.64,1)]",
              isSuccess && "bg-emerald-500/95 border-emerald-400/60 text-white",
              isError && "bg-destructive/95 border-destructive/60 text-destructive-foreground",
              !isSuccess && !isError && "bg-foreground/90 border-border/40 text-background"
            )}
          >
            <span className="flex-shrink-0 flex items-center justify-center h-5 w-5">
              {isRunning && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSuccess && <Check className="h-4 w-4 animate-check-in" strokeWidth={3} />}
              {isError && <X className="h-4 w-4" strokeWidth={3} />}
            </span>
            <span className="text-sm font-medium truncate">{t.label}</span>
            {t.detail && (
              <span className="text-xs opacity-70 flex-shrink-0">{t.detail}</span>
            )}
            {isRunning && t.progress !== undefined && (
              <span className="text-xs font-mono opacity-80 flex-shrink-0">
                {Math.round(t.progress * 100)}%
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default DynamicIsland;
