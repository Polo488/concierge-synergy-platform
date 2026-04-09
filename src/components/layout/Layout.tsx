
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

  // Sidebar widths: mobile=0, tablet=64px (w-16), desktop=240px (w-60)
  const sidebarWidth = isMobile ? 0 : isTablet ? 64 : 240;
  // Account for sidebar margin/padding on desktop (m-3 = 12px each side)
  const sidebarOffset = isMobile ? 0 : isTablet ? 64 + 12 : 240 + 12;

  return (
    <div className="min-h-screen relative w-full max-w-[100vw]" style={{ background: '#F4F5F7' }}>
      <Sidebar />
      
      <Header sidebarOffset={sidebarOffset} />
      
      <main
        style={{
          marginLeft: isMobile ? 0 : `${sidebarOffset}px`,
          paddingTop: '56px', // h-14 = 56px header height
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
