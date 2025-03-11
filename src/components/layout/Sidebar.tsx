import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  Wrench,
  Sparkles,
  Home,
  Receipt,
  Menu,
  X,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

type NavItem = {
  name: string;
  path: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { name: 'Tableau de bord', path: '/', icon: LayoutDashboard },
  { name: 'Entrepôt', path: '/inventory', icon: Package },
  { name: 'Maintenance', path: '/maintenance', icon: Wrench },
  { name: 'Ménage', path: '/cleaning', icon: Sparkles },
  { name: 'Calendrier', path: '/calendar', icon: CalendarIcon },
  { name: 'Logements', path: '/properties', icon: Home },
  { name: 'Moyenne Durée', path: '/moyenne-duree', icon: Clock },
  { name: 'Facturation', path: '/billing', icon: Receipt },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isMobile]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar toggle button for mobile */}
      <button
        className={cn(
          "fixed md:hidden z-50 top-4 transition-all duration-300 glass rounded-full p-2",
          isOpen ? "left-[240px]" : "left-4"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      {/* Sidebar container */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-in-out glass",
          "border-r border-border/30 shadow-soft flex flex-col",
          isOpen ? "w-64" : "w-0 md:w-20",
          "overflow-hidden"
        )}
      >
        {/* Logo */}
        <div 
          className={cn(
            "h-16 flex items-center px-6 border-b border-border/30",
            !isOpen && "md:justify-center md:px-0"
          )}
        >
          <span className={cn(
            "font-semibold text-primary text-xl tracking-tight",
            !isOpen && "md:hidden"
          )}>
            GESTION BNB LYON
          </span>
          {!isOpen && (
            <span className="hidden md:block text-primary">
              <LayoutDashboard size={24} />
            </span>
          )}
        </div>
        
        {/* Navigation items */}
        <nav className="flex-1 py-6 px-4 space-y-1">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-2 py-3 rounded-lg transition-all duration-200",
                  "group hover:bg-primary/5",
                  isActive ? "bg-primary/10 text-primary" : "text-foreground/80",
                  "animate-slide-in",
                  `stagger-${index + 1}`
                )}
              >
                <item.icon className={cn(
                  "flex-shrink-0",
                  isActive ? "text-primary" : "text-foreground/70 group-hover:text-primary/80"
                )} 
                size={20} 
                />
                
                <span className={cn(
                  "ml-3 font-medium text-sm",
                  !isOpen && "md:hidden"
                )}>
                  {item.name}
                </span>
                
                {isActive && !isOpen && (
                  <div className="hidden md:block absolute right-0 w-1 h-8 bg-primary rounded-l-md" />
                )}
              </Link>
            );
          })}
        </nav>
        
        {/* Collapse button (desktop only) */}
        <div className="hidden md:flex border-t border-border/30 p-4 justify-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight 
              size={20} 
              className={cn(
                "transition-transform duration-300",
                !isOpen && "rotate-180"
              )} 
            />
          </button>
        </div>
      </aside>
    </>
  );
}
