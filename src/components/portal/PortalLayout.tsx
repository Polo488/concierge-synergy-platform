import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { PortalHeader } from './PortalHeader';
import { EnhancedFooter } from './EnhancedFooter';
import { CinematicIntro } from './CinematicIntro';

export function PortalLayout() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('noe-intro-seen');
    if (!hasSeenIntro) {
      setShowIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('noe-intro-seen', 'true');
    setShowIntro(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}
      <PortalHeader />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <EnhancedFooter />
    </div>
  );
}
