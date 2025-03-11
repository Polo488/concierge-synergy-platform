
import { useState } from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  // Add scroll event listener
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setScrolled(window.scrollY > 10);
    });
  }

  return (
    <header className={cn(
      "sticky top-0 z-30 w-full transition-all duration-200",
      scrolled ? "glass shadow-sm border-b border-border/30" : "bg-transparent"
    )}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="mr-4">
            <img 
              src="/lovable-uploads/31f51bb4-a339-43a4-a602-8d4fbfb3380d.png" 
              alt="La Conciergerie Lyonnaise" 
              className="h-10"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full max-w-md">
            <Search className="text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Rechercher..." 
              className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button size="icon" variant="ghost" className="rounded-full relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 bg-primary rounded-full w-2.5 h-2.5" />
          </Button>
          
          <Button size="icon" variant="ghost" className="rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
