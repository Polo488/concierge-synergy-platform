
import { useState, useEffect, useMemo } from 'react';
import logoNoe from '@/assets/logo-noe.png';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  LayoutDashboard,
  Package,
  Wrench,
  Sparkles,
  Home,
  Receipt,
  Menu,
  X,
  ChevronLeft,
  Calendar as CalendarIcon,
  Clock,
  ShoppingCart,
  LogOut,
  Lightbulb,
  BarChart3,
  MessageSquare,
  MessageCircle,
  ClipboardCheck,
  Users,
  Gauge,
  StickyNote,
  CalendarDays,
  Rocket,
  PenTool,
  Scale,
  BookOpen,
  Zap,
  TrendingUp,
  Bell,
  FileText,
} from 'lucide-react';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMenuOrder } from '@/hooks/useMenuOrder';
import { SortableSection } from './SortableSection';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type NavItem = {
  name: string;
  path: string;
  icon: React.ElementType;
  permission: string;
};

type NavSection = {
  id: string;
  title: string;
  colorClass: string;
  activeClass: string;
  bgClass: string;
  iconBgClass: string;
  items: NavItem[];
};

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const location = useLocation();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { hasPermission, logout, user } = useAuth();
  const { t } = useLanguage();
  const { sectionOrder, updateOrder, getOrderedSections, isLoaded } = useMenuOrder();
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  
  const navSections: NavSection[] = useMemo(() => [
    {
      id: 'pilotage',
      title: 'PILOTAGE',
      colorClass: 'text-muted-foreground',
      activeClass: 'bg-primary/10 text-foreground',
      bgClass: '',
      iconBgClass: '',
      items: [
        { name: t('sidebar.dashboard'), path: '/app', icon: Gauge, permission: 'properties' },
        { name: t('sidebar.qualityStats'), path: '/app/quality-stats', icon: BarChart3, permission: 'cleaning' },
        { name: t('sidebar.insights'), path: '/app/insights', icon: Lightbulb, permission: 'properties' },
        { name: 'Legal Watch', path: '/app/legal-watch', icon: Scale, permission: 'legalWatch' },
      ]
    },
    {
      id: 'operations',
      title: 'OPÉRATIONS',
      colorClass: 'text-muted-foreground',
      activeClass: 'bg-primary/10 text-foreground',
      bgClass: '',
      iconBgClass: '',
      items: [
        { name: t('sidebar.calendar'), path: '/app/calendar', icon: CalendarIcon, permission: 'calendar' },
        { name: t('sidebar.cleaning'), path: '/app/cleaning', icon: Sparkles, permission: 'cleaning' },
        { name: t('sidebar.maintenance'), path: '/app/maintenance', icon: Wrench, permission: 'maintenance' },
        { name: t('sidebar.inventory'), path: '/app/inventory', icon: Package, permission: 'inventory' },
        { name: t('sidebar.properties'), path: '/app/properties', icon: Home, permission: 'properties' },
        { name: 'Check Apartment', path: '/app/check-apartment', icon: ClipboardCheck, permission: 'checkApartment' },
      ]
    },
    {
      id: 'revenus',
      title: 'REVENUS',
      colorClass: 'text-muted-foreground',
      activeClass: 'bg-primary/10 text-foreground',
      bgClass: '',
      iconBgClass: '',
      items: [
        { name: t('sidebar.averageDuration'), path: '/app/moyenne-duree', icon: Clock, permission: 'moyenneDuree' },
        { name: t('sidebar.billing'), path: '/app/billing', icon: Receipt, permission: 'billing' },
        { name: t('sidebar.upsell'), path: '/app/upsell', icon: ShoppingCart, permission: 'upsell' },
        { name: 'LCD Transitoire', path: '/app/transitory', icon: Zap, permission: 'transitory' },
      ]
    },
    {
      id: 'experience',
      title: 'VOYAGEURS',
      colorClass: 'text-muted-foreground',
      activeClass: 'bg-primary/10 text-foreground',
      bgClass: '',
      iconBgClass: '',
      items: [
        { name: 'Messagerie', path: '/app/messaging', icon: MessageCircle, permission: 'messaging' },
        { name: 'Communication', path: '/app/guest-experience', icon: MessageSquare, permission: 'guestExperience' },
        { name: 'Livret d\'accueil', path: '/app/welcome-guide', icon: BookOpen, permission: 'welcomeGuide' },
      ]
    },
    {
      id: 'organisation',
      title: 'ORGANISATION',
      colorClass: 'text-muted-foreground',
      activeClass: 'bg-primary/10 text-foreground',
      bgClass: '',
      iconBgClass: '',
      items: [
        { name: 'Agenda', path: '/app/agenda', icon: StickyNote, permission: 'agenda' },
        { name: 'RH – Planning', path: '/app/hr-planning', icon: CalendarDays, permission: 'hrPlanning' },
        { name: 'Onboarding', path: '/app/onboarding', icon: Rocket, permission: 'onboarding' },
        { name: 'Signature', path: '/app/signature', icon: PenTool, permission: 'onboarding' },
        { name: 'Utilisateurs', path: '/app/user-management', icon: Users, permission: 'users' },
        { name: 'Boîte à idées', path: '/app/idea-box', icon: Lightbulb, permission: 'ideaBox' },
      ]
    }
  ], [t]);
  
  const orderedSections = useMemo(() => 
    getOrderedSections(navSections), 
    [navSections, getOrderedSections, sectionOrder]
  );

  const isCollapsed = isTablet || (!isOpen && !isMobile);
  
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  useEffect(() => {
    const activeSection = navSections.find(section => 
      section.items.some(item => item.path === location.pathname)
    );
    if (activeSection && !expandedSections.includes(activeSection.id)) {
      setExpandedSections(prev => [...prev, activeSection.id]);
    }
  }, [location.pathname, navSections]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const visibleSections = useMemo(() => 
    orderedSections
      .map(section => ({
        ...section,
        items: section.items.filter(item => hasPermission(item.permission as any))
      }))
      .filter(section => section.items.length > 0),
    [orderedSections, hasPermission]
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as string);
      const newIndex = sectionOrder.indexOf(over.id as string);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(sectionOrder, oldIndex, newIndex);
        updateOrder(newOrder);
        toast.success("Ordre du menu mis à jour");
      }
    }
  };

  const activeSection = activeId 
    ? visibleSections.find(s => s.id === activeId) 
    : null;

  if (!isLoaded) {
    return null;
  }

  const renderNavLink = (item: NavItem, section: NavSection) => {
    const isActive = location.pathname === item.path;
    const isBilling = item.path === '/app/billing';
    const linkContent = (
      <Link
        to={item.path}
        className={cn(
          "flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 relative min-h-[44px]",
          isActive
            ? "bg-primary/10 text-foreground font-semibold"
            : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]",
          isCollapsed && "justify-center px-2"
        )}
      >
        <item.icon size={18} className={cn("flex-shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
        {!isCollapsed && <span className="text-sm truncate">{item.name}</span>}
        {isBilling && (
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full border-2 border-background animate-[billing-pulse_2s_ease-in-out_infinite]" style={{ background: '#FF5C1A' }} />
        )}
      </Link>
    );

    if (isCollapsed) {
      return (
        <TooltipProvider key={item.path} delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              <p>{item.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return <div key={item.path}>{linkContent}</div>;
  };

  const sidebarWidth = isMobile 
    ? (isOpen ? "w-60" : "w-0") 
    : isTablet 
      ? "w-16" 
      : (isOpen ? "w-60" : "w-16");

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-[200]"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Mobile hamburger button */}
      {isMobile && (
        <button
          className={cn(
            "fixed z-[250] top-4 transition-all duration-300 safe-top",
            "glass-pill rounded-2xl p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground",
            isOpen ? "left-[232px]" : "left-3"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full transition-all duration-300 ease-out",
          "flex flex-col overflow-hidden",
          "glass-strong",
          sidebarWidth,
          isMobile ? "z-[210]" : "z-40"
        )}
        style={{
          borderRight: '1px solid hsl(var(--border) / 0.7)',
          borderRadius: 0,
        }}
      >
        {/* Logo */}
        <div className={cn(
          "h-16 flex items-center justify-center px-5 flex-shrink-0",
          isCollapsed && "px-0"
        )}>
          <img 
            src={logoNoe} 
            alt="Noé" 
            className={cn(
              "h-11 w-auto object-contain max-w-full",
              isCollapsed && "h-8"
            )}
          />
        </div>
        
        {/* User info */}
        {user && (
          <div className={cn(
            "py-4 px-4 flex-shrink-0",
            isCollapsed && "flex justify-center py-4 px-2"
          )}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-foreground/[0.06] flex items-center justify-center overflow-hidden flex-shrink-0 ring-1 ring-border">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="font-semibold text-foreground text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="mx-4 h-px bg-border flex-shrink-0" />
        
        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
          {user?.role === 'owner' ? (
            <div className="space-y-1">
              {[
                { name: 'Tableau de bord', path: '/app/owner', icon: LayoutDashboard },
                { name: 'Onboarding', path: '/app/owner/onboarding', icon: Rocket },
                { name: 'Factures', path: '/app/owner/invoices', icon: Receipt },
                { name: 'Documents', path: '/app/owner/documents', icon: FileText },
                { name: 'Revenus', path: '/app/owner/revenue', icon: TrendingUp },
                { name: 'Notifications', path: '/app/owner/notifications', icon: Bell },
              ].map(item => {
                const isActive = location.pathname === item.path;
                const link = (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 min-h-[44px]",
                      isActive
                        ? "bg-primary/10 text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]",
                      isCollapsed && "justify-center px-2"
                    )}
                  >
                    <item.icon size={18} className={cn("flex-shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                    {!isCollapsed && <span className="text-sm">{item.name}</span>}
                  </Link>
                );
                if (isCollapsed) {
                  return (
                    <TooltipProvider key={item.path} delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                        <TooltipContent side="right" sideOffset={8}><p>{item.name}</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                }
                return link;
              })}
            </div>
          ) : isCollapsed ? (
            <div className="space-y-1">
              {visibleSections.flatMap(section => 
                section.items.map(item => renderNavLink(item, section))
              )}
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={visibleSections.map(s => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {visibleSections.map((section) => (
                  <SortableSection
                    key={section.id}
                    section={section}
                    isExpanded={expandedSections.includes(section.id)}
                    isOpen={!isCollapsed}
                    onToggle={() => toggleSection(section.id)}
                  />
                ))}
              </SortableContext>
              
              <DragOverlay>
                {activeSection ? (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1A1A2E] shadow-float text-xs font-medium text-white/60">
                    <span>{activeSection.title}</span>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </nav>
        
        {/* Logout */}
        <div className="px-3 pb-3 flex-shrink-0">
          {isCollapsed ? (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={logout}
                    className="flex items-center justify-center w-full py-2.5 rounded-xl transition-all duration-200 text-white/40 hover:text-white/70"
                  >
                    <LogOut size={18} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}><p>Déconnexion</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <button
              onClick={logout}
              className="flex items-center w-full gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-white/40 hover:text-white/70"
            >
              <LogOut size={18} />
              <span className="text-sm">Déconnexion</span>
            </button>
          )}
        </div>
        
        {/* Collapse toggle (desktop only) */}
        {!isMobile && !isTablet && (
          <div className="flex p-3 justify-center flex-shrink-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white/40 hover:text-white/70 transition-colors p-2 rounded-xl hover:bg-white/[0.08] border border-white/10"
            >
              <ChevronLeft 
                size={16} 
                className={cn(
                  "transition-transform duration-300",
                  !isOpen && "rotate-180"
                )} 
              />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
