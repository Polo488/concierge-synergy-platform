
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
            <Rocket size={22} className="text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">Onboarding de biens</h1>
            <p className="text-[13px] sm:text-sm text-muted-foreground line-clamp-2">Industrialisez l'entrée de nouveaux logements dans votre système</p>
          </div>
        </div>
        <Button onClick={() => setShowNewDialog(true)} className="w-full sm:w-auto shrink-0">
          <Plus size={16} className="mr-1" />
          <span className="sm:hidden">Nouvel onboarding</span>
          <span className="hidden sm:inline">Nouvel onboarding</span>
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
