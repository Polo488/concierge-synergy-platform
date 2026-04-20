
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export function Layout() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { language } = useLanguage();
  const { user } = useAuth();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const sidebarWidth = isMobile ? 0 : isTablet ? 64 : 240;
  const sidebarOffset = isMobile ? 0 : isTablet ? 64 : 240;

  return (
    <div className="min-h-screen relative w-full max-w-[100vw] bg-background">
      <Sidebar />
      
      <Header sidebarOffset={sidebarOffset} />
      
      <main
        style={{
          marginLeft: isMobile ? 0 : `${sidebarOffset}px`,
          paddingTop: '64px',
        }}
        className="min-h-screen w-auto max-w-full transition-all duration-300 ease-out"
      >
        <div className={cn(
          "mx-auto max-w-[1280px] animate-fade-in box-border w-full",
          "py-8 px-6",
          "max-lg:py-6 max-lg:px-4",
          "max-md:py-4 max-md:px-3"
        )}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
