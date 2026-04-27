import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { haptic } from "@/lib/haptic";

interface InlineEditProps {
  value: string;
  onSave: (next: string) => void | Promise<void>;
  /** Validation — return error string or null */
  validate?: (v: string) => string | null;
  placeholder?: string;
  className?: string;
  /** Tailwind classes applied to the displayed text */
  textClassName?: string;
  /** HTML input type (text, number, email…) */
  type?: "text" | "number" | "email" | "tel";
  /** Disable editing */
  disabled?: boolean;
  /** Render a custom preview instead of plain text */
  renderDisplay?: (v: string) => React.ReactNode;
  /** Select content on focus. Default true. */
  selectOnFocus?: boolean;
  ariaLabel?: string;
}

/**
 * Tap on a value to edit in-place. Enter/blur saves. Esc cancels.
 * Optimistic — UI updates immediately. Subtle orange flash on success.
 */
export function InlineEdit({
  value,
  onSave,
  validate,
  placeholder = "—",
  className,
  textClassName,
  type = "text",
  disabled = false,
  renderDisplay,
  selectOnFocus = true,
  ariaLabel,
}: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      if (selectOnFocus) inputRef.current.select();
    }
  }, [editing, selectOnFocus]);

  const commit = async () => {
    if (draft === value) {
      setEditing(false);
      return;
    }
    if (validate) {
      const err = validate(draft);
      if (err) {
        setError(err);
        haptic.error();
        return;
      }
    }
    setEditing(false);
    setError(null);
    setFlash(true);
    setTimeout(() => setFlash(false), 600);
    haptic.selection();
    try {
      await onSave(draft);
    } catch {
      haptic.error();
    }
  };

  const cancel = () => {
    setDraft(value);
    setError(null);
    setEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
  };

  if (editing && !disabled) {
    return (
      <div className={cn("inline-flex flex-col", className)}>
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            if (error) setError(null);
          }}
          onBlur={commit}
          onKeyDown={onKeyDown}
          type={type}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-invalid={!!error}
          className={cn(
            "bg-transparent outline-none border-b-2 border-primary px-1 -mx-1",
            "text-inherit font-inherit min-w-[60px]",
            error && "border-destructive",
            textClassName
          )}
        />
        {error && (
          <span className="text-[11px] text-destructive mt-0.5">{error}</span>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && setEditing(true)}
      className={cn(
        "inline-flex items-center text-left rounded px-1 -mx-1 transition-colors",
        !disabled && "hover:bg-muted/60 cursor-text",
        flash && "bg-primary/20",
        className
      )}
      aria-label={ariaLabel}
    >
      <span className={cn(textClassName, !value && "text-muted-foreground italic")}>
        {renderDisplay ? renderDisplay(value) : value || placeholder}
      </span>
    </button>
  );
}

export default InlineEdit;
