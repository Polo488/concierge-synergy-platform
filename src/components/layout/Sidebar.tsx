
import { useState, useEffect, useMemo } from 'react';
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
  ChevronRight,
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
  const [expandedSections, setExpandedSections] = useState<string[]>(['pilotage', 'operations', 'experience']);
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
      title: 'PILOTAGE & ANALYSE',
      colorClass: 'text-nav-pilotage',
      activeClass: 'bg-nav-pilotage-light text-nav-pilotage border-l-nav-pilotage',
      bgClass: 'bg-nav-pilotage/10',
      iconBgClass: 'bg-nav-pilotage/15 text-nav-pilotage',
      items: [
        { name: t('sidebar.dashboard'), path: '/', icon: Gauge, permission: 'properties' },
        { name: t('sidebar.qualityStats'), path: '/quality-stats', icon: BarChart3, permission: 'cleaning' },
        { name: t('sidebar.insights'), path: '/insights', icon: Lightbulb, permission: 'properties' },
      ]
    },
    {
      id: 'operations',
      title: 'OPÉRATIONS',
      colorClass: 'text-nav-operations',
      activeClass: 'bg-nav-operations-light text-nav-operations border-l-nav-operations',
      bgClass: 'bg-nav-operations/10',
      iconBgClass: 'bg-nav-operations/15 text-nav-operations',
      items: [
        { name: t('sidebar.calendar'), path: '/calendar', icon: CalendarIcon, permission: 'calendar' },
        { name: t('sidebar.cleaning'), path: '/cleaning', icon: Sparkles, permission: 'cleaning' },
        { name: t('sidebar.maintenance'), path: '/maintenance', icon: Wrench, permission: 'maintenance' },
        { name: t('sidebar.inventory'), path: '/inventory', icon: Package, permission: 'inventory' },
        { name: t('sidebar.properties'), path: '/properties', icon: Home, permission: 'properties' },
      ]
    },
    {
      id: 'revenus',
      title: 'REVENUS',
      colorClass: 'text-nav-revenus',
      activeClass: 'bg-nav-revenus-light text-nav-revenus border-l-nav-revenus',
      bgClass: 'bg-nav-revenus/10',
      iconBgClass: 'bg-nav-revenus/15 text-nav-revenus',
      items: [
        { name: t('sidebar.averageDuration'), path: '/moyenne-duree', icon: Clock, permission: 'moyenneDuree' },
        { name: t('sidebar.billing'), path: '/billing', icon: Receipt, permission: 'billing' },
        { name: t('sidebar.upsell'), path: '/upsell', icon: ShoppingCart, permission: 'upsell' },
      ]
    },
    {
      id: 'experience',
      title: 'EXPÉRIENCE VOYAGEUR',
      colorClass: 'text-nav-experience',
      activeClass: 'bg-nav-experience-light text-nav-experience border-l-nav-experience',
      bgClass: 'bg-nav-experience/10',
      iconBgClass: 'bg-nav-experience/15 text-nav-experience',
      items: [
        { name: 'Messagerie Voyageur', path: '/messaging', icon: MessageCircle, permission: 'messaging' },
        { name: 'Communication Intelligente', path: '/guest-experience', icon: MessageSquare, permission: 'guestExperience' },
      ]
    },
    {
      id: 'organisation',
      title: 'ORGANISATION',
      colorClass: 'text-nav-organisation',
      activeClass: 'bg-nav-organisation-light text-nav-organisation border-l-nav-organisation',
      bgClass: 'bg-nav-organisation/10',
      iconBgClass: 'bg-nav-organisation/15 text-nav-organisation',
      items: [
        { name: 'Agenda', path: '/agenda', icon: StickyNote, permission: 'agenda' },
        { name: 'Gestion des utilisateurs', path: '/user-management', icon: Users, permission: 'users' },
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
    return null; // Or a skeleton loader
  }

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
        
        {/* Navigation sections with drag and drop */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-2">
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
                  "flex items-center gap-2 px-3 py-2 rounded-lg",
                  "bg-card shadow-lg border border-border",
                  "text-xs font-semibold tracking-wider",
                  activeSection.colorClass
                )}>
                  <span>{activeSection.title}</span>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </nav>
        
        {/* Logout button */}
        <div className="px-3 pb-3">
          <button
            onClick={logout}
            className={cn(
              "flex items-center w-full gap-3 px-2 py-2.5 rounded-lg transition-all duration-200",
              "text-destructive hover:bg-destructive/10",
              !isOpen && "md:justify-center"
            )}
          >
            <div className="p-1.5 rounded-md bg-destructive/10">
              <LogOut size={16} />
            </div>
            <span className={cn(
              "font-medium text-sm",
              !isOpen && "md:hidden"
            )}>
              Déconnexion
            </span>
          </button>
        </div>
        
        {/* Collapse button (desktop only) */}
        <div className="hidden md:flex border-t border-border/30 p-3 justify-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted/50"
          >
            <ChevronRight 
              size={18} 
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
