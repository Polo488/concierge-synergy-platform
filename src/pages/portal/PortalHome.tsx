import { HeroSection } from '@/components/portal/sections/HeroSection';
import { OperationsFlowSection } from '@/components/portal/sections/OperationsFlowSection';
import { DistributionEngineSection } from '@/components/portal/sections/DistributionEngineSection';
import { BillingEngineSection } from '@/components/portal/sections/BillingEngineSection';
import { InventorySection } from '@/components/portal/sections/InventorySection';
import { MaintenanceSection } from '@/components/portal/sections/MaintenanceSection';
import { MessagingSection } from '@/components/portal/sections/MessagingSection';
import { AnalyticsSection } from '@/components/portal/sections/AnalyticsSection';
import { ComplianceSection } from '@/components/portal/sections/ComplianceSection';
import { EarlyAccessSection } from '@/components/portal/sections/EarlyAccessSection';
import { SocialProofSection } from '@/components/portal/sections/SocialProofSection';
import { PreRegistrationSection } from '@/components/portal/sections/PreRegistrationSection';
import { DemoBookingSection } from '@/components/portal/sections/DemoBookingSection';
import { PricingSection } from '@/components/portal/sections/PricingSection';
import { FinalCTASection } from '@/components/portal/sections/FinalCTASection';
import { AmbientSection } from '@/components/portal/AmbientLines';

export default function PortalHome() {
  return (
    <div>
      <HeroSection />
      <AmbientSection variant={0}>
        <OperationsFlowSection />
      </AmbientSection>
      <AmbientSection variant={1}>
        <DistributionEngineSection />
      </AmbientSection>
      <AmbientSection variant={2}>
        <BillingEngineSection />
      </AmbientSection>
      <AmbientSection variant={3}>
        <InventorySection />
      </AmbientSection>
      <AmbientSection variant={4}>
        <MaintenanceSection />
      </AmbientSection>
      <AmbientSection variant={5}>
        <MessagingSection />
      </AmbientSection>
      <AmbientSection variant={0}>
        <AnalyticsSection />
      </AmbientSection>
      <AmbientSection variant={1}>
        <ComplianceSection />
      </AmbientSection>
      <AmbientSection variant={2}>
        <EarlyAccessSection />
      </AmbientSection>
      <AmbientSection variant={3}>
        <SocialProofSection />
      </AmbientSection>
      <PreRegistrationSection />
      <DemoBookingSection />
      <PricingSection />
      <FinalCTASection />
    </div>
  );
}
