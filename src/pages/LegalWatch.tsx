import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, Shield, History, Settings, Scale } from 'lucide-react';
import { useLegalWatch } from '@/hooks/useLegalWatch';
import { LegalWatchMap } from '@/components/legal-watch/LegalWatchMap';
import { RiskOverview } from '@/components/legal-watch/RiskOverview';
import { AnalysisResults } from '@/components/legal-watch/AnalysisResults';
import { WatchHistory } from '@/components/legal-watch/WatchHistory';
import { WatchSettings } from '@/components/legal-watch/WatchSettings';

export default function LegalWatch() {
  const [activeTab, setActiveTab] = useState('map');
  const watchData = useLegalWatch();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Scale className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold text-foreground">Legal Watch & Risk Scoring</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Veille juridique stratégique et évaluation du risque réglementaire
        </p>
      </div>

      {/* Risk Overview Cards */}
      <RiskOverview
        globalScore={watchData.globalRiskScore}
        globalLevel={watchData.globalRiskLevel}
        distribution={watchData.riskDistribution}
        propertyCount={watchData.properties.length}
        riskHistory={watchData.riskHistory}
        isAnalyzing={watchData.isAnalyzing}
        onLaunchGlobal={() => watchData.launchAnalysis('global')}
      />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="map" className="gap-2">
            <Map className="h-4 w-4" />
            Carte & Veille
          </TabsTrigger>
          <TabsTrigger value="analysis" className="gap-2">
            <Shield className="h-4 w-4" />
            Analyse
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            Historique
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Planification
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="mt-4">
          <LegalWatchMap
            properties={watchData.properties}
            cityStats={watchData.cityStats}
            availableCities={watchData.availableCities}
            filters={watchData.filters}
            onFiltersChange={watchData.setFilters}
            onLaunchAnalysis={watchData.launchAnalysis}
            isAnalyzing={watchData.isAnalyzing}
          />
        </TabsContent>

        <TabsContent value="analysis" className="mt-4">
          <AnalysisResults
            analyses={watchData.analyses}
            isAnalyzing={watchData.isAnalyzing}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <WatchHistory
            analyses={watchData.analyses}
            riskHistory={watchData.riskHistory}
          />
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <WatchSettings
            schedules={watchData.schedules}
            onUpdateSchedules={watchData.setSchedules}
            availableCities={watchData.availableCities}
          />
        </TabsContent>
      </Tabs>

      {/* Legal disclaimer */}
      <div className="text-xs text-muted-foreground text-center py-4 border-t border-border/50">
        ⚖️ Cette analyse constitue une aide à la décision et ne remplace pas un conseil juridique.
      </div>
    </div>
  );
}
