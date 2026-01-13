
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
  Clock,
  ShoppingCart,
  Users,
  LogOut,
  Lightbulb
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

type NavItem = {
  name: string;
  path: string;
  icon: React.ElementType;
  permission: string;
};

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { hasPermission, logout, user } = useAuth();
  const { t } = useLanguage();
  
  const navItems: NavItem[] = [
    { name: t('sidebar.dashboard'), path: '/', icon: LayoutDashboard, permission: 'properties' },
    { name: t('sidebar.inventory'), path: '/inventory', icon: Package, permission: 'inventory' },
    { name: t('sidebar.maintenance'), path: '/maintenance', icon: Wrench, permission: 'maintenance' },
    { name: t('sidebar.cleaning'), path: '/cleaning', icon: Sparkles, permission: 'cleaning' },
    { name: t('sidebar.calendar'), path: '/calendar', icon: CalendarIcon, permission: 'calendar' },
    { name: t('sidebar.properties'), path: '/properties', icon: Home, permission: 'properties' },
    { name: t('sidebar.averageDuration'), path: '/moyenne-duree', icon: Clock, permission: 'moyenneDuree' },
    { name: t('sidebar.upsell'), path: '/upsell', icon: ShoppingCart, permission: 'upsell' },
    { name: t('sidebar.billing'), path: '/billing', icon: Receipt, permission: 'billing' },
    { name: t('sidebar.insights'), path: '/insights', icon: Lightbulb, permission: 'properties' },
  ];
  
  // Add users management if user has permission
  if (hasPermission('users')) {
    navItems.push({ name: 'Utilisateurs', path: '/users', icon: Users, permission: 'users' });
  }
  
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

  // Filter nav items based on user permissions
  const filteredNavItems = navItems.filter(item => hasPermission(item.permission as any));

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
        
        {/* User info */}
        {user && (
          <div className={cn(
            "py-3 px-4 border-b border-border/30",
            !isOpen && "md:flex md:justify-center md:py-3"
          )}>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img 
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-medium text-primary">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className={cn("flex-1 truncate", !isOpen && "md:hidden")}>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation items */}
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item, index) => {
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
        
        {/* Logout button */}
        <div className="px-4 pb-4">
          <button
            onClick={logout}
            className={cn(
              "flex items-center w-full px-2 py-3 rounded-lg transition-all duration-200",
              "text-red-500 hover:bg-red-50 hover:text-red-600"
            )}
          >
            <LogOut size={20} />
            <span className={cn(
              "ml-3 font-medium text-sm",
              !isOpen && "md:hidden"
            )}>
              Déconnexion
            </span>
          </button>
        </div>
        
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
