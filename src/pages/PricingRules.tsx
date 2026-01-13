import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StayRulesTab } from '@/components/pricing/StayRulesTab';
import { BlockingRulesTab } from '@/components/pricing/BlockingRulesTab';
import { ChannelRestrictionsTab } from '@/components/pricing/ChannelRestrictionsTab';
import { PromotionsTab } from '@/components/pricing/PromotionsTab';
import { PricingCalendarTab } from '@/components/pricing/PricingCalendarTab';
import { usePricingRules } from '@/hooks/usePricingRules';
import { CalendarCog, Ban, Building2, Tag, Calendar } from 'lucide-react';

export default function PricingRules() {
  const [activeTab, setActiveTab] = useState('stay-rules');
  const pricingRulesHook = usePricingRules();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tarifs & Règles</h1>
          <p className="text-muted-foreground">
            Gérez vos règles de séjour, blocages et promotions
          </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
            <TabsTrigger value="stay-rules" className="flex items-center gap-2">
              <CalendarCog className="h-4 w-4" />
              <span className="hidden sm:inline">Min/Max Séjour</span>
            </TabsTrigger>
            <TabsTrigger value="blocking" className="flex items-center gap-2">
              <Ban className="h-4 w-4" />
              <span className="hidden sm:inline">Blocages</span>
            </TabsTrigger>
            <TabsTrigger value="channels" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Canaux</span>
            </TabsTrigger>
            <TabsTrigger value="promotions" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span className="hidden sm:inline">Promotions</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Aperçu</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stay-rules">
            <StayRulesTab {...pricingRulesHook} />
          </TabsContent>

          <TabsContent value="blocking">
            <BlockingRulesTab {...pricingRulesHook} />
          </TabsContent>

          <TabsContent value="channels">
            <ChannelRestrictionsTab {...pricingRulesHook} />
          </TabsContent>

          <TabsContent value="promotions">
            <PromotionsTab {...pricingRulesHook} />
          </TabsContent>

          <TabsContent value="calendar">
            <PricingCalendarTab {...pricingRulesHook} />
          </TabsContent>
        </Tabs>
      </div>
  );
}
