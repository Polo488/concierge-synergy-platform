import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Calendar,
  Sparkles,
  Wrench,
  Building2,
  Users,
  MessageSquare,
  StickyNote,
  Receipt,
  Lightbulb,
  Zap,
  Bell,
  ShieldCheck,
  ClipboardCheck,
  BookOpen,
  PieChart,
  UserCog,
  ScrollText,
  PenLine,
  Heart,
  Plus,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  group: "Pilotage" | "Opérations" | "Revenus" | "Expérience" | "Organisation";
}

const NAV: NavItem[] = [
  { label: "Tableau de bord", to: "/app", icon: LayoutDashboard, group: "Pilotage" },
  { label: "Calendrier", to: "/app/calendar", icon: Calendar, group: "Pilotage" },
  { label: "Statistiques qualité", to: "/app/quality-stats", icon: PieChart, group: "Pilotage" },
  { label: "Insights & Alertes", to: "/app/insights", icon: Bell, group: "Pilotage" },

  { label: "Logements", to: "/app/properties", icon: Building2, group: "Opérations" },
  { label: "Ménage", to: "/app/cleaning", icon: Sparkles, group: "Opérations" },
  { label: "Maintenance", to: "/app/maintenance", icon: Wrench, group: "Opérations" },
  { label: "Inventaire", to: "/app/inventory", icon: ClipboardCheck, group: "Opérations" },
  { label: "Check Apartment", to: "/app/check-apartment", icon: ClipboardCheck, group: "Opérations" },
  { label: "Onboarding logements", to: "/app/onboarding", icon: BookOpen, group: "Opérations" },

  { label: "Facturation", to: "/app/billing", icon: Receipt, group: "Revenus" },
  { label: "Upsell", to: "/app/upsell", icon: Plus, group: "Revenus" },
  { label: "Moyenne durée", to: "/app/moyenne-duree", icon: Calendar, group: "Revenus" },
  { label: "Transitoire", to: "/app/transitory", icon: Zap, group: "Revenus" },

  { label: "Messagerie", to: "/app/messaging", icon: MessageSquare, group: "Expérience" },
  { label: "Communication intelligente", to: "/app/guest-experience", icon: Sparkles, group: "Expérience" },
  { label: "Livret d'accueil", to: "/app/welcome-guide", icon: BookOpen, group: "Expérience" },
  { label: "Portail propriétaire", to: "/app/owner", icon: Heart, group: "Expérience" },

  { label: "Agenda interne", to: "/app/agenda", icon: StickyNote, group: "Organisation" },
  { label: "Planning RH", to: "/app/hr-planning", icon: Users, group: "Organisation" },
  { label: "Utilisateurs", to: "/app/user-management", icon: UserCog, group: "Organisation" },
  { label: "Veille juridique", to: "/app/legal-watch", icon: ShieldCheck, group: "Organisation" },
  { label: "Signature électronique", to: "/app/signature", icon: PenLine, group: "Organisation" },
  { label: "Boîte à idées", to: "/app/idea-box", icon: Lightbulb, group: "Organisation" },
  { label: "Feedbacks", to: "/app/feedbacks", icon: ScrollText, group: "Organisation" },
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  const go = (to: string) => {
    onOpenChange(false);
    setTimeout(() => navigate(to), 50);
  };

  const groups: NavItem["group"][] = [
    "Pilotage",
    "Opérations",
    "Revenus",
    "Expérience",
    "Organisation",
  ];

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Rechercher une page, une action…" />
      <CommandList className="max-h-[60vh]">
        <CommandEmpty>Aucun résultat.</CommandEmpty>

        {groups.map((g) => {
          const items = NAV.filter((n) => n.group === g);
          return (
            <CommandGroup key={g} heading={g}>
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.to}
                    value={`${item.label} ${item.group}`}
                    onSelect={() => go(item.to)}
                  >
                    <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{item.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          );
        })}

        <CommandSeparator />
        <CommandGroup heading="Apparence">
          <CommandItem onSelect={() => { setTheme("light"); onOpenChange(false); }}>
            Thème clair
          </CommandItem>
          <CommandItem onSelect={() => { setTheme("dark"); onOpenChange(false); }}>
            Thème sombre
          </CommandItem>
          <CommandItem onSelect={() => { setTheme("system"); onOpenChange(false); }}>
            Thème système
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />
        <CommandGroup heading="Aide">
          <CommandItem onSelect={() => { onOpenChange(false); window.dispatchEvent(new CustomEvent("noe:show-shortcuts")); }}>
            Afficher les raccourcis clavier
            <CommandShortcut>⌘/</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

/**
 * Mounts the command palette and binds the ⌘K / Ctrl+K shortcut globally.
 */
export function CommandPaletteProvider() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return <CommandPalette open={open} onOpenChange={setOpen} />;
}

export default CommandPaletteProvider;
