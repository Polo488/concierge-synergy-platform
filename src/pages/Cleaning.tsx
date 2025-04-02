
import { useEffect } from 'react';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { CleaningProvider } from '@/contexts/CleaningContext';
import { CleaningStats } from '@/components/cleaning/CleaningStats';
import { CleaningActions } from '@/components/cleaning/CleaningActions';
import { CleaningTabs } from '@/components/cleaning/CleaningTabs';
import { CleaningDialogs } from '@/components/cleaning/CleaningDialogs';
import { useLanguage } from '@/contexts/LanguageContext';

const Cleaning = () => {
  const { t } = useLanguage();
  
  useEffect(() => {
    document.title = t('cleaning.page.title');
  }, [t]);

  return (
    <CleaningProvider>
      <div className="space-y-8">
        <CleaningActions />
        
        <CleaningStats />
        
        <DashboardCard title={t('cleaning.planning.title')}>
          <CleaningTabs />
        </DashboardCard>

        <CleaningDialogs />
      </div>
    </CleaningProvider>
  );
};

export default Cleaning;
