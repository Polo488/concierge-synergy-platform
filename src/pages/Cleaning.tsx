
import { useEffect } from 'react';
import { CleaningProvider } from '@/contexts/cleaning/CleaningContext';
import { CleaningStats } from '@/components/cleaning/CleaningStats';
import { CleaningHeader } from '@/components/cleaning/CleaningHeader';
import { CleaningTabs } from '@/components/cleaning/CleaningTabs';
import { CleaningDialogs } from '@/components/cleaning/CleaningDialogs';
import { CleaningDailyProgress } from '@/components/cleaning/CleaningDailyProgress';
import { useAuth } from '@/contexts/AuthContext';
import { TutorialTrigger } from '@/components/tutorial/TutorialTrigger';

const Cleaning = () => {
  const { user } = useAuth();
  const isCleaningAgent = user?.role === 'cleaning';

  useEffect(() => {
    document.title = 'Ménage';
  }, []);

  return (
    <CleaningProvider>
      <TutorialTrigger moduleId="cleaning" />
      <div className="space-y-4 pb-8">
        {!isCleaningAgent && <CleaningHeader />}

        <div className="px-4 space-y-4">
          {!isCleaningAgent && <CleaningDailyProgress />}
          {!isCleaningAgent && <CleaningStats />}

          <div className="bg-card rounded-2xl border border-border p-4">
            <div data-tutorial="cleaning-header">
              <CleaningTabs initialTab={isCleaningAgent ? 'today' : undefined} />
            </div>
          </div>
        </div>

        <CleaningDialogs />
      </div>
    </CleaningProvider>
  );
};

export default Cleaning;
