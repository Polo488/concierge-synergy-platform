
import { useEffect } from 'react';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { CleaningProvider } from '@/contexts/CleaningContext';
import { CleaningStats } from '@/components/cleaning/CleaningStats';
import { CleaningActions } from '@/components/cleaning/CleaningActions';
import { CleaningTabs } from '@/components/cleaning/CleaningTabs';
import { CleaningDialogs } from '@/components/cleaning/CleaningDialogs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { TutorialTrigger } from '@/components/tutorial/TutorialTrigger';
import { TutorialButton } from '@/components/tutorial/TutorialButton';

const Cleaning = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const isCleaningAgent = user?.role === 'cleaning';
  
  useEffect(() => {
    document.title = t('cleaning.page.title');
  }, [t]);

  return (
    <CleaningProvider>
      <TutorialTrigger moduleId="cleaning" />
      <div className="space-y-8">
        {!isCleaningAgent && (
          <div data-tutorial="cleaning-actions">
            <CleaningActions />
          </div>
        )}
        
        {!isCleaningAgent && <CleaningStats />}
        
        <DashboardCard 
          title={isCleaningAgent ? t('cleaning.agent.title') : t('cleaning.planning.title')}
          subtitle={isCleaningAgent ? t('cleaning.agent.description') : undefined}
          actions={<TutorialButton moduleId="cleaning" />}
        >
          <div data-tutorial="cleaning-header">
            <CleaningTabs initialTab={isCleaningAgent ? 'today' : undefined} />
          </div>
        </DashboardCard>

        <CleaningDialogs />
      </div>
    </CleaningProvider>
  );
};

export default Cleaning;

