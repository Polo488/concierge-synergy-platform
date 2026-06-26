
import { useEffect } from 'react';
import { CleaningProvider } from '@/contexts/cleaning/CleaningContext';
import { CleaningTeamProvider, useCleaningTeam } from '@/contexts/CleaningTeamContext';
import { CleaningHeader } from '@/components/cleaning/CleaningHeader';
import { CleaningTodayBoard } from '@/components/cleaning/CleaningTodayBoard';
import { CleaningOnboarding } from '@/components/cleaning/CleaningOnboarding';
import { CleaningDialogs } from '@/components/cleaning/CleaningDialogs';
import { CleaningTabs } from '@/components/cleaning/CleaningTabs';
import { useAuth } from '@/contexts/AuthContext';
import { TutorialTrigger } from '@/components/tutorial/TutorialTrigger';

const CleaningInner = () => {
  const { user } = useAuth();
  const isCleaningAgent = user?.role === 'cleaning';
  const { agencies } = useCleaningTeam();
  const needsOnboarding = !isCleaningAgent && agencies.length === 0;

  return (
    <div className="space-y-4 pb-8">
      {!isCleaningAgent && <CleaningHeader />}

      <div className="px-4 space-y-6">
        {needsOnboarding ? (
          <CleaningOnboarding />
        ) : !isCleaningAgent ? (
          <>
            <CleaningTodayBoard />

            {/* Secondary, collapsible "Tout voir" — kept available without competing */}
            <details className="group">
              <summary className="cursor-pointer text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground transition-colors px-1 list-none flex items-center gap-1.5">
                <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground/40 group-open:bg-primary" />
                Tout voir (vue détaillée)
              </summary>
              <div className="mt-3 bg-card rounded-2xl border border-border p-4">
                <CleaningTabs />
              </div>
            </details>
          </>
        ) : (
          // Agent view — keep simple list
          <div className="bg-card rounded-2xl border border-border p-4">
            <CleaningTabs initialTab="today" />
          </div>
        )}
      </div>

      <CleaningDialogs />
    </div>
  );
};

const Cleaning = () => {
  useEffect(() => {
    document.title = 'Ménage';
  }, []);

  return (
    <CleaningTeamProvider>
      <CleaningProvider>
        <TutorialTrigger moduleId="cleaning" />
        <CleaningInner />
      </CleaningProvider>
    </CleaningTeamProvider>
  );
};

export default Cleaning;
