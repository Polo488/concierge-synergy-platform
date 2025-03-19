
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export const MainNav: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link
        to="/dashboard"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        {t('dashboard.title')}
      </Link>
      <Link
        to="/inventory"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        {t('inventory.title')}
      </Link>
      <Link
        to="/cleaning"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        {t('dashboard.cleaning')}
      </Link>
      <Link
        to="/maintenance"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        {t('dashboard.maintenance')}
      </Link>
      <Link
        to="/calendar"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Calendrier
      </Link>
    </nav>
  );
}
