
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
  Users,
  Gauge,
  StickyNote,
  CalendarDays,
  Rocket,
  PenTool,
  Scale,
  BookOpen,
  Zap,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMenuOrder } from '@/hooks/useMenuOrder';
import { SortableSection } from './SortableSection';
import { toast } from 'sonner';

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
  const [expandedSections, setExpandedSections] = useState<string[]>(['pilotage', 'operations', 'experience', 'organisation']);
  const [activeId, setActiveId] = useState<string | null>(null);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { hasPermission, logout, user } = useAuth();
  const { t } = useLanguage();
  const { sectionOrder, updateOrder, getOrderedSections, isLoaded } = useMenuOrder();
  
  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Define navigation sections with color system
  const navSections: NavSection[] = useMemo(() => [
    {
      id: 'pilotage',
      title: 'PILOTAGE',
      colorClass: 'text-nav-pilotage',
      activeClass: 'bg-nav-pilotage-light text-nav-pilotage',
      bgClass: 'bg-nav-pilotage/5',
      iconBgClass: 'text-nav-pilotage',
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
      colorClass: 'text-nav-operations',
      activeClass: 'bg-nav-operations-light text-nav-operations',
      bgClass: 'bg-nav-operations/5',
      iconBgClass: 'text-nav-operations',
      items: [
        { name: t('sidebar.calendar'), path: '/app/calendar', icon: CalendarIcon, permission: 'calendar' },
        { name: t('sidebar.cleaning'), path: '/app/cleaning', icon: Sparkles, permission: 'cleaning' },
        { name: t('sidebar.maintenance'), path: '/app/maintenance', icon: Wrench, permission: 'maintenance' },
        { name: t('sidebar.inventory'), path: '/app/inventory', icon: Package, permission: 'inventory' },
        { name: t('sidebar.properties'), path: '/app/properties', icon: Home, permission: 'properties' },
      ]
    },
    {
      id: 'revenus',
      title: 'REVENUS',
      colorClass: 'text-nav-revenus',
      activeClass: 'bg-nav-revenus-light text-nav-revenus',
      bgClass: 'bg-nav-revenus/5',
      iconBgClass: 'text-nav-revenus',
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
      colorClass: 'text-nav-experience',
      activeClass: 'bg-nav-experience-light text-nav-experience',
      bgClass: 'bg-nav-experience/5',
      iconBgClass: 'text-nav-experience',
      items: [
        { name: 'Messagerie', path: '/app/messaging', icon: MessageCircle, permission: 'messaging' },
        { name: 'Communication', path: '/app/guest-experience', icon: MessageSquare, permission: 'guestExperience' },
        { name: 'Livret d\'accueil', path: '/app/welcome-guide', icon: BookOpen, permission: 'welcomeGuide' },
      ]
    },
    {
      id: 'organisation',
      title: 'ORGANISATION',
      colorClass: 'text-nav-organisation',
      activeClass: 'bg-nav-organisation-light text-nav-organisation',
      bgClass: 'bg-nav-organisation/5',
      iconBgClass: 'text-nav-organisation',
      items: [
        { name: 'Agenda', path: '/app/agenda', icon: StickyNote, permission: 'agenda' },
        { name: 'RH – Planning', path: '/app/hr-planning', icon: CalendarDays, permission: 'hrPlanning' },
        { name: 'Onboarding', path: '/app/onboarding', icon: Rocket, permission: 'onboarding' },
        { name: 'Signature', path: '/app/signature', icon: PenTool, permission: 'onboarding' },
        { name: 'Utilisateurs', path: '/app/user-management', icon: Users, permission: 'users' },
      ]
    }
  ], [t]);
  
  // Get ordered sections
  const orderedSections = useMemo(() => 
    getOrderedSections(navSections), 
    [navSections, getOrderedSections, sectionOrder]
  );
  
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

  // Auto-expand section containing active route
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

  // Filter sections based on permissions (but keep order for hidden sections)
  const visibleSections = useMemo(() => 
    orderedSections
      .map(section => ({
        ...section,
        items: section.items.filter(item => hasPermission(item.permission as any))
      }))
      .filter(section => section.items.length > 0),
    [orderedSections, hasPermission]
  );

  // Drag handlers
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

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/5 backdrop-blur-md z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar toggle button for mobile */}
      <button
        className={cn(
          "fixed md:hidden z-50 top-4 transition-all duration-300",
          "glass-panel rounded-xl p-2.5",
          isOpen ? "left-[232px]" : "left-4"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>
      
      {/* Sidebar container - Glass floating panel */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-out",
          "glass-panel flex flex-col",
          isOpen ? "w-60" : "w-0 md:w-[68px]",
          "overflow-hidden",
          isMobile ? "" : "m-3 rounded-2xl h-[calc(100%-24px)]"
        )}
      >
        {/* Logo */}
        <div 
          className={cn(
            "h-16 flex items-center justify-center px-5",
            !isOpen && "md:px-0"
          )}
        >
          <img 
            src={logoNoe} 
            alt="Noé" 
            className={cn(
              "h-8 w-auto object-contain",
              !isOpen && "md:h-6"
            )}
          />
        </div>
        
        {/* User info */}
        {user && (
          <div className={cn(
            "py-4 px-4",
            !isOpen && "md:flex md:justify-center md:py-4"
          )}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden flex-shrink-0 ring-1 ring-primary/10">
                {user.avatar ? (
                  <img 
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-medium text-primary text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className={cn("flex-1 min-w-0", !isOpen && "md:hidden")}>
                <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Subtle separator */}
        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        
        {/* Navigation sections */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
          {user?.role === 'owner' ? (
            /* Simplified sidebar for owner */
            <div className="space-y-1">
              <Link
                to="/app/owner"
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                  location.pathname === '/app/owner'
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <Home size={18} />
                <span className={cn("text-sm", !isOpen && "md:hidden")}>Mon espace</span>
              </Link>
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
                    isOpen={isOpen}
                    onToggle={() => toggleSection(section.id)}
                  />
                ))}
              </SortableContext>
              
              {/* Drag overlay for visual feedback */}
              <DragOverlay>
                {activeSection ? (
                  <div className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl",
                    "glass-panel shadow-float",
                    "text-xs font-medium",
                    activeSection.colorClass
                  )}>
                    <span>{activeSection.title}</span>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </nav>
        
        {/* Logout button */}
        <div className="px-3 pb-3">
          <button
            onClick={logout}
            className={cn(
              "flex items-center w-full gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
              "text-muted-foreground hover:text-foreground hover:bg-accent/50",
              !isOpen && "md:justify-center"
            )}
          >
            <LogOut size={18} />
            <span className={cn(
              "text-sm",
              !isOpen && "md:hidden"
            )}>
              Déconnexion
            </span>
          </button>
        </div>
        
        {/* Collapse button (desktop only) */}
        <div className="hidden md:flex p-3 justify-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-xl hover:bg-accent/50"
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
      </aside>
    </>
  );
}
