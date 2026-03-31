
import { useEffect } from 'react';
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
    document.title = 'Ménage';
  }, []);

  return (
    <CleaningProvider>
      <TutorialTrigger moduleId="cleaning" />
      <div className="space-y-4">
        {!isCleaningAgent && (
          <div data-tutorial="cleaning-actions">
            <CleaningActions />
          </div>
        )}
        
        {!isCleaningAgent && <CleaningStats />}
        
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-bold text-foreground">Ménage</h2>
            <TutorialButton moduleId="cleaning" />
          </div>
          <div data-tutorial="cleaning-header">
            <CleaningTabs initialTab={isCleaningAgent ? 'today' : undefined} />
          </div>
        </div>

        <CleaningDialogs />
      </div>
    </CleaningProvider>
  );
};

export default Cleaning;
