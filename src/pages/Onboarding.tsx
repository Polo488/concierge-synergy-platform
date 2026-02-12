
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Rocket } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOnboarding } from '@/hooks/useOnboarding';
import { OnboardingStats } from '@/components/onboarding/OnboardingStats';
import { OnboardingPortfolio } from '@/components/onboarding/OnboardingPortfolio';
import { OnboardingDetail } from '@/components/onboarding/OnboardingDetail';
import { OnboardingFilters } from '@/components/onboarding/OnboardingFilters';
import { NewOnboardingDialog } from '@/components/onboarding/NewOnboardingDialog';
import { BottlenecksPanel } from '@/components/onboarding/BottlenecksPanel';

export default function Onboarding() {
  const {
    processes, allProcesses, selectedProcess, setSelectedProcessId,
    filters, setFilters, kpis, updateStepAction,
    createOnboarding, cities,
  } = useOnboarding();
  const [showNewDialog, setShowNewDialog] = useState(false);

  if (selectedProcess) {
    return (
      <div className="space-y-6">
        <OnboardingDetail
          process={selectedProcess}
          onBack={() => setSelectedProcessId(null)}
          onUpdateStepAction={updateStepAction}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <Rocket size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Onboarding de biens</h1>
            <p className="text-sm text-muted-foreground">Industrialisez l'entrée de nouveaux logements dans votre système</p>
          </div>
        </div>
        <Button onClick={() => setShowNewDialog(true)}>
          <Plus size={16} className="mr-1" />
          Nouvel onboarding
        </Button>
      </div>

      <OnboardingStats kpis={kpis} />

      <Tabs defaultValue="portfolio" className="space-y-4">
        <TabsList>
          <TabsTrigger value="portfolio">Portefeuille</TabsTrigger>
          <TabsTrigger value="bottlenecks">Goulots d'étranglement</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-4">
          <OnboardingFilters filters={filters} onFiltersChange={setFilters} cities={cities} />
          <OnboardingPortfolio processes={processes} onSelect={setSelectedProcessId} />
        </TabsContent>

        <TabsContent value="bottlenecks">
          <BottlenecksPanel kpis={kpis} processes={allProcesses} />
        </TabsContent>
      </Tabs>

      <NewOnboardingDialog
        open={showNewDialog}
        onOpenChange={setShowNewDialog}
        onSubmit={createOnboarding}
      />
    </div>
  );
}
