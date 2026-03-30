
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

  const mainMargin = isMobile 
    ? "ml-0" 
    : isTablet 
      ? "ml-16" 
      : "ml-60";

  return (
    <div className="min-h-screen bg-background relative flex w-full max-w-[100vw]">
      {/* Subtle gradient overlay for depth */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 100% 60% at 50% -20%, hsla(var(--primary) / 0.04), transparent 60%),
            radial-gradient(circle at 20% 80%, hsla(var(--primary) / 0.02), transparent 30%),
            radial-gradient(circle at 80% 90%, hsla(var(--primary) / 0.02), transparent 30%)
          `
        }}
      />
      
      <Sidebar />
      
      <main className={cn(
        "relative transition-all duration-300 ease-out min-h-screen flex-1 w-0 max-w-full",
        mainMargin
      )}>
        <Header />
        
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
