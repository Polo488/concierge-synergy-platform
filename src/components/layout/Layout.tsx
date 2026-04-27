
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
    <div className="relative w-full max-w-[100vw]">
      {/* Apple ambient bg — F5F5F7 + subtle warm orange tint */}
      <div className="liquid-bg" aria-hidden="true" />

      <Sidebar />

      <Header sidebarOffset={sidebarOffset} />

      <main
        style={{
          marginLeft: isMobile ? 0 : `${sidebarOffset}px`,
          paddingTop: 'calc(72px + env(safe-area-inset-top, 0px))',
        }}
        className="w-auto max-w-full transition-all duration-300 ease-out relative z-10"
      >
        <div className={cn(
          "mx-auto max-w-[1280px] animate-fade-in box-border w-full safe-left safe-right safe-bottom",
          "py-[clamp(1rem,3vw,2rem)] px-[clamp(0.75rem,3vw,1.5rem)]"
        )}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
