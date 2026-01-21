
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export function Layout() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const { user } = useAuth();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Set HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className={cn(
        "transition-all duration-200 ease-out min-h-screen",
        isMobile ? "ml-0" : "ml-[68px] md:ml-60"
      )}>
        <Header />
        
        <div className="container py-8 px-6 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
