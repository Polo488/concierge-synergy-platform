
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
        "transition-all duration-300 ease-in-out min-h-screen",
        isMobile ? "ml-0" : "ml-20 md:ml-64"
      )}>
        <Header />
        
        <div className="container py-6 px-4 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
