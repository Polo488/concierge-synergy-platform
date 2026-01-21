
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
    <div className="min-h-screen bg-background relative">
      {/* Subtle gradient overlay for depth */}
      <div 
        className="fixed inset-0 pointer-events-none"
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
        "relative transition-all duration-300 ease-out min-h-screen",
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
