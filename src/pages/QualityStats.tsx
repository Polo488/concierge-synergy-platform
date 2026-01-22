
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQualityStats } from '@/hooks/useQualityStats';
import { useStatsData } from '@/hooks/useStatsData';
import { QualityFilters } from '@/components/quality/QualityFilters';
import { KPICards } from '@/components/quality/KPICards';
import { QualityCharts } from '@/components/quality/QualityCharts';
import { PropertyRankingTable } from '@/components/quality/PropertyRankingTable';
import { AgentRankingTable } from '@/components/quality/AgentRankingTable';
import { PropertyDetailsDialog } from '@/components/quality/PropertyDetailsDialog';
import { AgentDetailsDialog } from '@/components/quality/AgentDetailsDialog';
import { StatsOverview } from '@/components/stats/StatsOverview';
import { StatsFinance } from '@/components/stats/StatsFinance';
import { TutorialTrigger } from '@/components/tutorial/TutorialTrigger';
import { TutorialButton } from '@/components/tutorial/TutorialButton';
import { LayoutDashboard, Sparkles, Euro, BarChart3, Building, Users } from 'lucide-react';

const QualityStats = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [menageSubTab, setMenageSubTab] = useState('dashboard');
  const [propertyDialogOpen, setPropertyDialogOpen] = useState(false);
  const [agentDialogOpen, setAgentDialogOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const {
    tasks,
    kpis, ratingDistribution, ratingTrend, repasseTrend, issueFrequency,
    propertyStats, agentProfiles, filters, updateFilters,
    availableProperties, availableAgents, availableChannels,
    getPropertyDetails, getAgentDetails, portfolioAverageRating,
  } = useQualityStats();

  const { overviewData, financeData } = useStatsData();

  const handleSelectProperty = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setPropertyDialogOpen(true);
  };

  const handleSelectAgent = (agentId: string) => {
    setSelectedAgentId(agentId);
    setAgentDialogOpen(true);
  };

  const selectedPropertyDetails = selectedPropertyId ? getPropertyDetails(selectedPropertyId) : null;
  const selectedAgentDetails = selectedAgentId ? getAgentDetails(selectedAgentId) : null;

  return (
    <div className="space-y-6">
      <TutorialTrigger moduleId="quality" />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stats</h1>
          <p className="text-muted-foreground">Hub central de statistiques : activité, finance, opérations</p>
        </div>
        <TutorialButton moduleId="quality" />
      </div>

      <QualityFilters
        filters={filters}
        onFiltersChange={updateFilters}
        availableProperties={availableProperties}
        availableAgents={availableAgents}
        availableChannels={availableChannels}
        tasks={tasks}
        agentProfiles={agentProfiles}
        propertyStats={propertyStats}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} data-tutorial="stats-tabs">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview" className="gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="menage" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Ménage
          </TabsTrigger>
          <TabsTrigger value="finance" className="gap-2">
            <Euro className="h-4 w-4" />
            Finance
          </TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <StatsOverview 
            activityKpis={overviewData.activityKpis}
            revenueKpis={overviewData.revenueKpis}
            operationsKpis={overviewData.operationsKpis}
          />
        </TabsContent>

        {/* Ménage Tab - Existing Content Preserved */}
        <TabsContent value="menage" className="space-y-6 mt-6">
          {/* Monthly Summary Card */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Récap mensuel ménage</h3>
                <p className="text-sm text-muted-foreground">
                  {kpis.tasks_completed} ménages • Note moyenne: {kpis.average_rating_overall.toFixed(1)}/5 • Taux repasse: {kpis.repasse_rate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Sub-tabs for Ménage section */}
          <Tabs value={menageSubTab} onValueChange={setMenageSubTab}>
            <TabsList className="bg-muted/30">
              <TabsTrigger value="dashboard" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="properties" className="gap-2">
                <Building className="h-4 w-4" />
                Propriétés
              </TabsTrigger>
              <TabsTrigger value="agents" className="gap-2">
                <Users className="h-4 w-4" />
                Agents
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6 mt-6">
              <div data-tutorial="quality-kpi">
                <KPICards kpis={kpis} />
              </div>
              <div data-tutorial="quality-charts">
                <QualityCharts
                  ratingDistribution={ratingDistribution}
                  ratingTrend={ratingTrend}
                  repasseTrend={repasseTrend}
                  issueFrequency={issueFrequency}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-tutorial="quality-ranking">
                <PropertyRankingTable properties={propertyStats} onSelectProperty={handleSelectProperty} />
                <AgentRankingTable agents={agentProfiles} onSelectAgent={handleSelectAgent} />
              </div>
            </TabsContent>

            <TabsContent value="properties" className="mt-6">
              <PropertyRankingTable properties={propertyStats} onSelectProperty={handleSelectProperty} />
            </TabsContent>

            <TabsContent value="agents" className="mt-6">
              <AgentRankingTable agents={agentProfiles} onSelectAgent={handleSelectAgent} />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Finance Tab */}
        <TabsContent value="finance" className="space-y-6 mt-6">
          <StatsFinance 
            kpis={financeData.kpis}
            revenueTrend={financeData.revenueTrend}
            occupancyTrend={financeData.occupancyTrend}
            revenuePerStayTrend={financeData.revenuePerStayTrend}
            channelData={financeData.channelData}
            comparison={financeData.comparison}
          />
        </TabsContent>
      </Tabs>

      {/* Property Details Dialog */}
      <PropertyDetailsDialog
        open={propertyDialogOpen}
        onOpenChange={setPropertyDialogOpen}
        stats={selectedPropertyDetails?.stats}
        tasks={selectedPropertyDetails?.tasks || []}
        agentPerformance={selectedPropertyDetails?.agentPerformance || []}
        portfolioAverageRating={portfolioAverageRating}
      />

      {/* Agent Details Dialog */}
      <AgentDetailsDialog
        open={agentDialogOpen}
        onOpenChange={setAgentDialogOpen}
        profile={selectedAgentDetails?.profile}
        tasks={selectedAgentDetails?.tasks || []}
        propertyPerformance={selectedAgentDetails?.propertyPerformance || []}
      />
    </div>
  );
};

export default QualityStats;
