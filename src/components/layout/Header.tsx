
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
import { useNavigate } from 'react-router-dom';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const navigate = useNavigate();
  
  // Insights state
  const {
    insights,
    unreadCount,
    markAsRead,
    markAllAsRead,
    archiveInsight,
    disabledTypes,
    toggleTypeEnabled,
  } = useInsights();
  
  const [isInsightsPanelOpen, setIsInsightsPanelOpen] = useState(false);

  // Handle insight action
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
    }
  };

  // Add scroll event listener with cleanup
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={cn(
        "sticky top-0 z-30 w-full transition-all duration-200",
        scrolled ? "bg-background/95 backdrop-blur-sm border-b border-border/50" : "bg-transparent"
      )}>
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2 w-full max-w-sm">
            <Search className="text-muted-foreground h-4 w-4" />
            <Input 
              placeholder={t('search')} 
              className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm placeholder:text-muted-foreground/60"
            />
          </div>
          
          <div className="flex items-center gap-1">
            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="rounded-full h-9 w-9">
                  {resolvedTheme === 'dark' ? (
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Sun className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[140px]">
                <DropdownMenuItem 
                  onClick={() => setTheme('light')}
                  className={cn("text-sm gap-2", theme === 'light' && 'bg-muted')}
                >
                  <Sun className="h-4 w-4" />
                  Clair
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('dark')}
                  className={cn("text-sm gap-2", theme === 'dark' && 'bg-muted')}
                >
                  <Moon className="h-4 w-4" />
                  Sombre
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('system')}
                  className={cn("text-sm gap-2", theme === 'system' && 'bg-muted')}
                >
                  <Monitor className="h-4 w-4" />
                  Système
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="rounded-full h-9 w-9">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[120px]">
                <DropdownMenuItem 
                  onClick={() => setLanguage('fr')}
                  className={cn("text-sm", language === 'fr' && 'bg-muted')}
                >
                  Français
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLanguage('en')}
                  className={cn("text-sm", language === 'en' && 'bg-muted')}
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
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-8 w-8">
                      {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                      <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{t('header.role')}:</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {getRoleConfig(user.role).name}
                      </span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-sm">
                    {t('header.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button size="icon" variant="ghost" className="rounded-full h-9 w-9">
                <User className="h-4 w-4 text-muted-foreground" />
              </Button>
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
