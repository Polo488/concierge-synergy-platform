
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
          "flex items-center gap-3 h-9 px-3 mx-1 rounded-[8px] transition-colors duration-150 relative",
          isActive
            ? "bg-[hsl(var(--ios-orange)/_0.10)] text-[hsl(var(--ios-orange))] font-semibold"
            : "text-[hsl(var(--label-1))] hover:bg-black/[0.04]",
          isCollapsed && "justify-center mx-0 px-2"
        )}
      >
        <item.icon
          size={18}
          strokeWidth={2}
          className={cn(
            "flex-shrink-0",
            isActive ? "text-[hsl(var(--ios-orange))]" : "text-[hsl(240_6%_25%/_0.6)]"
          )}
        />
        {!isCollapsed && <span className="text-sm font-medium truncate">{item.name}</span>}
        {isBilling && (
          <span
            className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-[hsl(var(--bg-app))] animate-[billing-pulse_2s_ease-in-out_infinite]"
            style={{ background: '#FF5C1A' }}
          />
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
      
      {/* Mobile hamburger button — perfectly aligned with the glass top-bar (h:48 / top:8 / left:8) */}
      {isMobile && (
        <button
          className={cn(
            "fixed z-[250] transition-all duration-300",
            "glass-pill rounded-full h-9 w-9 flex items-center justify-center text-foreground shadow-sm",
            isOpen ? "left-[232px]" : "left-[14px]"
          )}
          style={{
            top: 'calc(env(safe-area-inset-top, 0px) + 14px)',
          }}
          aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
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
          "glass-thin",
          sidebarWidth,
          isMobile ? "z-[210]" : "z-40"
        )}
        style={{
          borderRight: '1px solid rgba(0,0,0,0.06)',
          borderRadius: 0,
        }}
      >
        {/* Logo */}
        <div className={cn(
          "flex items-center justify-center px-4 pt-5 pb-3 flex-shrink-0",
          isCollapsed && "px-0"
        )}>
          <img
            src={logoNoe}
            alt="Noé"
            className={cn(
              "h-10 w-auto object-contain max-w-full",
              isCollapsed && "h-7"
            )}
          />
        </div>
        
        {/* User info */}
        {user && (
          <div className={cn(
            "py-2 px-2 mb-3 flex-shrink-0",
            isCollapsed && "flex justify-center px-2"
          )}>
            <div className={cn(
              "flex items-center gap-3 rounded-[12px] p-2 transition-colors hover:bg-black/[0.04]",
              isCollapsed && "p-1"
            )}>
              <div className="h-8 w-8 rounded-full bg-[hsl(var(--label-3)/_0.15)] flex items-center justify-center overflow-hidden flex-shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="font-semibold text-[hsl(var(--label-1))] text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[hsl(var(--label-1))] truncate leading-tight">{user.name}</p>
                  <p className="text-[12px] text-[hsl(240_6%_25%/_0.6)] leading-tight">{user.role}</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="mx-4 h-px bg-black/[0.06] flex-shrink-0" />

        {/* Navigation */}
        <nav className="flex-1 py-3 px-1 overflow-y-auto space-y-0.5">
          {user?.role === 'owner' ? (
            <div className="space-y-px px-1">
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
                      "flex items-center gap-3 h-9 px-3 mx-1 rounded-[8px] transition-colors duration-150",
                      isActive
                        ? "bg-[hsl(var(--ios-orange)/_0.10)] text-[hsl(var(--ios-orange))] font-semibold"
                        : "text-[hsl(var(--label-1))] hover:bg-black/[0.04]",
                      isCollapsed && "justify-center mx-0 px-2"
                    )}
                  >
                    <item.icon
                      size={18}
                      strokeWidth={2}
                      className={cn(
                        "flex-shrink-0",
                        isActive ? "text-[hsl(var(--ios-orange))]" : "text-[hsl(240_6%_25%/_0.6)]"
                      )}
                    />
                    {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
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
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl glass-thick text-xs font-medium text-[hsl(var(--label-1))]">
                    <span>{activeSection.title}</span>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </nav>

        {/* Logout */}
        <div className="px-2 pb-2 flex-shrink-0">
          {isCollapsed ? (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={logout}
                    className="flex items-center justify-center w-full h-9 rounded-[8px] transition-colors text-[hsl(240_6%_25%/_0.6)] hover:text-[hsl(var(--label-1))] hover:bg-black/[0.04]"
                  >
                    <LogOut size={18} strokeWidth={2} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}><p>Déconnexion</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <button
              onClick={logout}
              className="flex items-center w-full gap-3 px-3 h-9 mx-1 rounded-[8px] transition-colors text-[hsl(var(--label-1))] hover:bg-black/[0.04]"
            >
              <LogOut size={18} strokeWidth={2} className="text-[hsl(240_6%_25%/_0.6)]" />
              <span className="text-sm font-medium">Déconnexion</span>
            </button>
          )}
        </div>

        {/* Collapse toggle (desktop only) — Apple glass pill */}
        {!isMobile && !isTablet && (
          <div className="flex p-3 justify-center flex-shrink-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="h-8 w-8 rounded-full glass-pill flex items-center justify-center transition-transform active:scale-95"
              aria-label={isOpen ? 'Réduire le menu' : 'Étendre le menu'}
            >
              <ChevronLeft
                size={14}
                strokeWidth={2}
                className={cn(
                  "transition-transform duration-300 text-[hsl(240_6%_25%/_0.6)]",
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
