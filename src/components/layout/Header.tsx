
import { useState, useEffect } from 'react';
import { Search, User, Globe, Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getRoleConfig } from '@/utils/roleUtils';
import { InsightsBell } from '@/components/insights/InsightsBell';
import { InsightsPanel } from '@/components/insights/InsightsPanel';
import { useInsights } from '@/hooks/useInsights';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  sidebarOffset?: number;
}

export function Header({ sidebarOffset = 0 }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const {
    insights,
    unreadCount,
    markAsRead,
    markAllAsRead,
    archiveInsight,
    disabledTypes,
    toggleTypeEnabled,
    injectOnboardingProcesses,
  } = useInsights();

  const { allProcesses } = useOnboarding();
  
  useEffect(() => {
    injectOnboardingProcesses(allProcesses);
  }, [allProcesses, injectOnboardingProcesses]);
  
  const [isInsightsPanelOpen, setIsInsightsPanelOpen] = useState(false);

  const handleInsightAction = (action: string, propertyId: number) => {
    setIsInsightsPanelOpen(false);
    switch (action) {
      case 'open_pricing':
      case 'open_rules':
        navigate('/calendar');
        break;
      case 'open_property':
        navigate('/properties');
        break;
      case 'open_calendar':
        navigate('/calendar');
        break;
      case 'open_onboarding':
        navigate('/app/onboarding');
        break;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        data-scrolled={scrolled ? "true" : "false"}
        className={cn(
          "fixed z-30 glass-topbar pointer-events-auto"
        )}
        style={{
          top: isMobile ? 8 : 12,
          left: isMobile ? 8 : `calc(${sidebarOffset}px + 16px)`,
          right: isMobile ? 8 : 16,
        }}
      >
        <div className="flex h-12 items-center justify-between pl-3 pr-2 md:pl-4 md:pr-2 gap-2 max-w-full">
          {/* Search — capsule iOS Spotlight */}
          {isMobile ? (
            <div className="flex items-center gap-2 ml-10 flex-1">
              {searchOpen ? (
                <div className="ios-search flex-1">
                  <Search className="absolute left-3 h-4 w-4 text-[hsl(240_6%_25%/_0.5)]" strokeWidth={2} />
                  <input
                    placeholder={t('search')}
                    autoFocus
                    onBlur={() => setSearchOpen(false)}
                    aria-label={t('search') as string}
                  />
                </div>
              ) : (
                <button
                  className="ios-btn-icon"
                  onClick={() => setSearchOpen(true)}
                  aria-label={t('search') as string}
                >
                  <Search className="h-4 w-4 text-[hsl(var(--label-2))]" strokeWidth={2} />
                </button>
              )}
            </div>
          ) : (
            <div className="ios-search max-w-[440px]">
              <Search className="absolute left-3 h-4 w-4 text-[hsl(240_6%_25%/_0.5)]" strokeWidth={2} />
              <input placeholder={t('search') as string} aria-label={t('search') as string} />
              <span className="ios-kbd ml-2 flex-shrink-0">⌘K</span>
            </div>
          )}

          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ios-btn-icon" aria-label="Theme">
                  {resolvedTheme === 'dark' ? (
                    <Moon className="h-[18px] w-[18px] text-[hsl(var(--label-1))]" strokeWidth={2} />
                  ) : (
                    <Sun className="h-[18px] w-[18px] text-[hsl(var(--label-1))]" strokeWidth={2} />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[140px] ios-popover border-0 shadow-none">
                <DropdownMenuItem
                  onClick={() => setTheme('light')}
                  className={cn("text-sm gap-2 ios-popover-item", theme === 'light' && 'bg-black/5')}
                >
                  <Sun className="h-4 w-4" strokeWidth={2} /> Clair
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme('dark')}
                  className={cn("text-sm gap-2 ios-popover-item", theme === 'dark' && 'bg-black/5')}
                >
                  <Moon className="h-4 w-4" strokeWidth={2} /> Sombre
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme('system')}
                  className={cn("text-sm gap-2 ios-popover-item", theme === 'system' && 'bg-black/5')}
                >
                  <Monitor className="h-4 w-4" strokeWidth={2} /> Système
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ios-btn-icon" aria-label="Langue">
                  <Globe className="h-[18px] w-[18px] text-[hsl(var(--label-1))]" strokeWidth={2} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[120px] ios-popover border-0 shadow-none">
                <DropdownMenuItem
                  onClick={() => setLanguage('fr')}
                  className={cn("text-sm ios-popover-item", language === 'fr' && 'bg-black/5')}
                >
                  Français
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage('en')}
                  className={cn("text-sm ios-popover-item", language === 'en' && 'bg-black/5')}
                >
                  English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Insights Bell */}
            <InsightsBell
              insights={insights}
              unreadCount={unreadCount}
              onOpenPanel={() => setIsInsightsPanelOpen(true)}
              onMarkAsRead={markAsRead}
            />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="relative h-9 w-9 rounded-full flex items-center justify-center transition-transform active:scale-95"
                    aria-label="Profil"
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-white shadow-[0_2px_8px_rgba(0,0,0,0.10)]">
                      {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                      <AvatarFallback className="bg-[hsl(var(--label-3)/_0.15)] text-[hsl(var(--label-1))] text-sm font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 ios-popover border-0 shadow-none">
                  <DropdownMenuLabel className="font-normal px-3 py-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold text-[hsl(var(--label-1))]">{user.name}</p>
                      <p className="text-xs text-[hsl(var(--label-3))]">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-black/[0.06]" />
                  <DropdownMenuItem className="text-sm ios-popover-item">
                    <div className="flex items-center gap-2">
                      <span className="text-[hsl(var(--label-3))]">{t('header.role')}:</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-black/[0.06] text-[hsl(var(--label-1))]">
                        {getRoleConfig(user.role).name}
                      </span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-black/[0.06]" />
                  <DropdownMenuItem onClick={logout} className="text-sm ios-popover-item">
                    {t('header.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button className="ios-btn-icon" aria-label="Profil">
                <User className="h-[18px] w-[18px] text-[hsl(var(--label-1))]" strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
      </header>
      
      {/* Insights Panel */}
      <InsightsPanel
        open={isInsightsPanelOpen}
        onOpenChange={setIsInsightsPanelOpen}
        insights={insights}
        unreadCount={unreadCount}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onArchive={archiveInsight}
        onAction={handleInsightAction}
        disabledTypes={disabledTypes}
        onToggleType={toggleTypeEnabled}
      />
    </>
  );
}
