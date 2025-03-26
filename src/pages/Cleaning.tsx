
import { useEffect } from 'react';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { CleaningProvider } from '@/contexts/CleaningContext';
import { CleaningStats } from '@/components/cleaning/CleaningStats';
import { CleaningActions } from '@/components/cleaning/CleaningActions';
import { CleaningTabs } from '@/components/cleaning/CleaningTabs';
import { CleaningDialogs } from '@/components/cleaning/CleaningDialogs';

const Cleaning = () => {
  useEffect(() => {
    document.title = 'Ménage - GESTION BNB LYON';
  }, []);

  return (
    <CleaningProvider>
      <div className="space-y-8">
        <CleaningActions />
        
        <CleaningStats />
        
        <DashboardCard title="Planification des ménages">
          <CleaningTabs />
        </DashboardCard>

        <CleaningDialogs />
      </div>
    </CleaningProvider>
  );
};

export default Cleaning;
