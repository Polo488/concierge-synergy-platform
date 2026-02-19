import { HeroSection } from '@/components/portal/sections/HeroSection';
import { OperationsFlowSection } from '@/components/portal/sections/OperationsFlowSection';
import { DistributionEngineSection } from '@/components/portal/sections/DistributionEngineSection';
import { BillingEngineSection } from '@/components/portal/sections/BillingEngineSection';
import { ComplianceSection } from '@/components/portal/sections/ComplianceSection';
import { SocialProofSection } from '@/components/portal/sections/SocialProofSection';
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
        <ComplianceSection />
      </AmbientSection>
      <AmbientSection variant={4}>
        <SocialProofSection />
      </AmbientSection>
      <AmbientSection variant={5}>
        <PricingSection />
      </AmbientSection>
      <FinalCTASection />
    </div>
  );
}
