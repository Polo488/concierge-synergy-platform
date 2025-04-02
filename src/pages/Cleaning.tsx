
import { useEffect } from 'react';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { CleaningProvider } from '@/contexts/CleaningContext';
import { CleaningStats } from '@/components/cleaning/CleaningStats';
import { CleaningActions } from '@/components/cleaning/CleaningActions';
import { CleaningTabs } from '@/components/cleaning/CleaningTabs';
import { CleaningDialogs } from '@/components/cleaning/CleaningDialogs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const Cleaning = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const isCleaningAgent = user?.role === 'cleaning';
  
  useEffect(() => {
    document.title = t('cleaning.page.title');
  }, [t]);

  return (
    <CleaningProvider>
      <div className="space-y-8">
        {!isCleaningAgent && <CleaningActions />}
        
        {!isCleaningAgent && <CleaningStats />}
        
        <DashboardCard 
          title={isCleaningAgent ? t('cleaning.agent.title') : t('cleaning.planning.title')}
          description={isCleaningAgent ? t('cleaning.agent.description') : undefined}
        >
          <CleaningTabs initialTab={isCleaningAgent ? 'today' : undefined} />
        </DashboardCard>

        <CleaningDialogs />
      </div>
    </CleaningProvider>
  );
};

export default Cleaning;
