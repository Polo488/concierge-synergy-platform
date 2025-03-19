
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  // Note: Ce composant est implémenté comme un placeholder
  // Dans une vraie application, vous implémenteriez un switch pour le mode sombre
  
  return (
    <Button variant="ghost" size="icon">
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
