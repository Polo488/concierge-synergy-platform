
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQualityStats } from '@/hooks/useQualityStats';
import { QualityFilters } from '@/components/quality/QualityFilters';
import { KPICards } from '@/components/quality/KPICards';
import { QualityCharts } from '@/components/quality/QualityCharts';
import { PropertyRankingTable } from '@/components/quality/PropertyRankingTable';
import { AgentRankingTable } from '@/components/quality/AgentRankingTable';
import { BarChart3, Building, Users } from 'lucide-react';
import { toast } from 'sonner';

const QualityStats = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const {
    kpis, ratingDistribution, ratingTrend, reworkTrend, issueFrequency,
    propertyStats, agentProfiles, filters, updateFilters,
    availableProperties, availableAgents, availableChannels,
  } = useQualityStats();

  const handleExport = () => {
    toast.success('Export CSV en cours de préparation...');
  };

  const handleSelectProperty = (propertyId: string) => {
    updateFilters({ properties: [propertyId] });
    setActiveTab('properties');
  };

  const handleSelectAgent = (agentId: string) => {
    updateFilters({ agents: [agentId] });
    setActiveTab('agents');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Qualité & Stats Ménage</h1>
        <p className="text-muted-foreground">Analysez la qualité des nettoyages et les performances des agents</p>
      </div>

      <QualityFilters
        filters={filters}
        onFiltersChange={updateFilters}
        availableProperties={availableProperties}
        availableAgents={availableAgents}
        availableChannels={availableChannels}
        onExport={handleExport}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
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
          <KPICards kpis={kpis} />
          <QualityCharts
            ratingDistribution={ratingDistribution}
            ratingTrend={ratingTrend}
            reworkTrend={reworkTrend}
            issueFrequency={issueFrequency}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
    </div>
  );
};

export default QualityStats;
