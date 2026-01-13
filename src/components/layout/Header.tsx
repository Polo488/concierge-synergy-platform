
import { useState, useEffect } from 'react';
import { Search, User, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
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
        scrolled ? "glass shadow-sm border-b border-border/30" : "bg-transparent"
      )}>
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 w-full max-w-md">
            <Search className="text-muted-foreground h-4 w-4" />
            <Input 
              placeholder={t('search')} 
              className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="rounded-full">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => setLanguage('fr')}
                  className={language === 'fr' ? 'bg-muted' : ''}
                >
                  Français
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLanguage('en')}
                  className={language === 'en' ? 'bg-muted' : ''}
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
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">{t('header.role')}:</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'employee' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'maintenance' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {getRoleConfig(user.role).name}
                      </span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    {t('header.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button size="icon" variant="ghost" className="rounded-full">
                <User className="h-5 w-5" />
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
