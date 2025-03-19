import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MainNav } from './MainNav';
import { ModeToggle } from './ModeToggle';
import { UserNav } from './UserNav';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold inline-block">GESTION BNB LYON</span>
          </Link>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <MobileLink
                to="/"
                className="flex items-center"
                onOpenChange={setIsOpen}
              >
                <span className="font-bold">GESTION BNB LYON</span>
              </MobileLink>
              <div className="flex flex-col space-y-3 mt-4">
                <MobileLink to="/dashboard" onOpenChange={setIsOpen}>
                  Tableau de bord
                </MobileLink>
                <MobileLink to="/properties" onOpenChange={setIsOpen}>
                  Logements
                </MobileLink>
                <MobileLink to="/cleaning" onOpenChange={setIsOpen}>
                  Ménage
                </MobileLink>
                <MobileLink to="/maintenance" onOpenChange={setIsOpen}>
                  Maintenance
                </MobileLink>
                <MobileLink to="/inventory" onOpenChange={setIsOpen}>
                  Entrepôt
                </MobileLink>
                <MobileLink to="/billing" onOpenChange={setIsOpen}>
                  Facturation
                </MobileLink>
                <MobileLink to="/settings" onOpenChange={setIsOpen}>
                  Paramètres
                </MobileLink>
              </div>
            </SheetContent>
          </Sheet>
          <nav className="hidden md:flex">
            <MainNav />
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}

interface MobileLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

function MobileLink({
  to,
  children,
  className,
  onOpenChange,
}: MobileLinkProps) {
  return (
    <Link
      to={to}
      onClick={() => {
        onOpenChange?.(false);
      }}
      className={className}
    >
      {children}
    </Link>
  );
}
