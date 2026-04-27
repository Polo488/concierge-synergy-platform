import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Shortcut {
  keys: string[];
  label: string;
  group: string;
}

const SHORTCUTS: Shortcut[] = [
  { keys: ["⌘", "K"], label: "Ouvrir la palette de commandes", group: "Navigation" },
  { keys: ["⌘", "/"], label: "Afficher cette aide", group: "Navigation" },
  { keys: ["⌘", "B"], label: "Afficher / masquer le menu", group: "Navigation" },
  { keys: ["⌘", "F"], label: "Focus sur la recherche", group: "Navigation" },
  { keys: ["Esc"], label: "Fermer la modale ou le panneau actif", group: "Navigation" },
  { keys: ["⌘", "1"], label: "Tableau de bord", group: "Aller à" },
  { keys: ["⌘", "2"], label: "Calendrier", group: "Aller à" },
  { keys: ["⌘", "3"], label: "Logements", group: "Aller à" },
  { keys: ["⌘", "4"], label: "Ménage", group: "Aller à" },
  { keys: ["⌘", "5"], label: "Maintenance", group: "Aller à" },
  { keys: ["⌘", "6"], label: "Messagerie", group: "Aller à" },
  { keys: ["⌘", "7"], label: "Facturation", group: "Aller à" },
  { keys: ["⌘", "8"], label: "Statistiques qualité", group: "Aller à" },
  { keys: ["⌘", "9"], label: "Utilisateurs", group: "Aller à" },
];

const SHORTCUT_TO_PATH: Record<string, string> = {
  "1": "/app",
  "2": "/app/calendar",
  "3": "/app/properties",
  "4": "/app/cleaning",
  "5": "/app/maintenance",
  "6": "/app/messaging",
  "7": "/app/billing",
  "8": "/app/quality-stats",
  "9": "/app/user-management",
};

/**
 * Global keyboard shortcuts:
 *  - ⌘+1..9 : navigate to main sections
 *  - ⌘/    : open shortcut help
 *  - ⌘F    : focus on first search input on the page
 *  - Esc   : (handled natively by Radix dialogs / sheets)
 */
export function GlobalShortcuts() {
  const navigate = useNavigate();
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const showHelp = () => setHelpOpen(true);
    window.addEventListener("noe:show-shortcuts", showHelp);
    return () => window.removeEventListener("noe:show-shortcuts", showHelp);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isTyping =
        tag === "input" ||
        tag === "textarea" ||
        target?.isContentEditable;

      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;

      // ⌘/  → help
      if (e.key === "/") {
        e.preventDefault();
        setHelpOpen((v) => !v);
        return;
      }

      // ⌘F → focus first search input
      if (e.key.toLowerCase() === "f") {
        const search = document.querySelector<HTMLInputElement>(
          'input[type="search"], input[placeholder*="Rechercher" i], input[aria-label*="Rechercher" i]'
        );
        if (search) {
          e.preventDefault();
          search.focus();
        }
        return;
      }

      // ⌘1..9
      if (!isTyping && /^[1-9]$/.test(e.key)) {
        const path = SHORTCUT_TO_PATH[e.key];
        if (path) {
          e.preventDefault();
          navigate(path);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const groups = Array.from(new Set(SHORTCUTS.map((s) => s.group)));

  return (
    <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Raccourcis clavier</DialogTitle>
          <DialogDescription>
            Naviguez dans Noé sans quitter votre clavier.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 mt-2">
          {groups.map((g) => (
            <div key={g}>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
                {g}
              </p>
              <div className="space-y-1.5">
                {SHORTCUTS.filter((s) => s.group === g).map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <span className="text-sm text-foreground">{s.label}</span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {s.keys.map((k, i) => (
                        <kbd
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-background border border-border text-[11px] font-mono text-muted-foreground shadow-sm min-w-[24px] text-center"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default GlobalShortcuts;
