import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { smartDefaults, DefaultsKeys } from "@/lib/smartDefaults";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  /** Debounce in ms applied to onDebouncedChange. Default 150 */
  debounce?: number;
  onDebouncedChange?: (v: string) => void;
  /** Suggestions shown below the field when empty */
  suggestions?: string[];
  /** Persist recent searches under this key */
  recentsKey?: string;
  className?: string;
  autoFocus?: boolean;
}

/**
 * Apple-style search bar — capsule glass, recents, fuzzy-friendly.
 * Sticky positioning is controlled by the parent.
 */
export function SearchBar({
  value,
  onChange,
  placeholder = "Rechercher…",
  debounce = 150,
  onDebouncedChange,
  suggestions = [],
  recentsKey,
  className,
  autoFocus = false,
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const [recents, setRecents] = useState<string[]>(() =>
    recentsKey ? smartDefaults.get<string[]>(`${DefaultsKeys.recentSearches}:${recentsKey}`, []) : []
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!onDebouncedChange) return;
    const t = setTimeout(() => onDebouncedChange(value), debounce);
    return () => clearTimeout(t);
  }, [value, debounce, onDebouncedChange]);

  const commitRecent = (q: string) => {
    if (!recentsKey || !q.trim()) return;
    const next = [q, ...recents.filter((r) => r !== q)].slice(0, 5);
    setRecents(next);
    smartDefaults.set(`${DefaultsKeys.recentSearches}:${recentsKey}`, next);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onChange("");
      inputRef.current?.blur();
    }
    if (e.key === "Enter" && value.trim()) {
      commitRecent(value.trim());
    }
  };

  const showRecents = focused && !value && (recents.length > 0 || suggestions.length > 0);
  const items = !value ? recents : suggestions;

  return (
    <div className={cn("relative w-full", className)}>
      <div
        className={cn(
          "flex items-center gap-2 px-4 h-11 rounded-full transition-all duration-200",
          "bg-muted/70 border border-border backdrop-blur-md",
          focused && "ring-2 ring-primary/40 border-primary/50 bg-card"
        )}
      >
        <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 120)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
          aria-label={placeholder}
        />
        {value && (
          <button
            type="button"
            aria-label="Effacer"
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            className="h-6 w-6 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/30 flex items-center justify-center transition"
          >
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        )}
      </div>

      {showRecents && items.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-30 rounded-2xl glass-strong border border-border p-2 shadow-xl animate-fade-in">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground px-3 py-1">
            {value ? "Suggestions" : "Recherches récentes"}
          </p>
          <div className="flex flex-wrap gap-1.5 px-2 pb-1">
            {items.slice(0, 6).map((it) => (
              <button
                key={it}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(it);
                  commitRecent(it);
                }}
                className="px-3 py-1.5 rounded-full text-xs bg-muted hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
              >
                {it}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Lightweight fuzzy match — returns true if all chars of needle appear in order in haystack.
 */
export function fuzzyMatch(haystack: string, needle: string): boolean {
  if (!needle) return true;
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase();
  let i = 0;
  for (const ch of h) {
    if (ch === n[i]) i++;
    if (i === n.length) return true;
  }
  return i === n.length;
}

export default SearchBar;
