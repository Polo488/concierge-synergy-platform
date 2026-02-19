import { HeroSection } from '@/components/portal/sections/HeroSection';
import { OperationsFlowSection } from '@/components/portal/sections/OperationsFlowSection';
import { DistributionEngineSection } from '@/components/portal/sections/DistributionEngineSection';
import { BillingEngineSection } from '@/components/portal/sections/BillingEngineSection';
import { ComplianceSection } from '@/components/portal/sections/ComplianceSection';
import { SocialProofSection } from '@/components/portal/sections/SocialProofSection';
import { PricingSection } from '@/components/portal/sections/PricingSection';
import { FinalCTASection } from '@/components/portal/sections/FinalCTASection';

export default function PortalHome() {
  return (
    <div>
      <HeroSection />
      <OperationsFlowSection />
      <DistributionEngineSection />
      <BillingEngineSection />
      <ComplianceSection />
      <SocialProofSection />
      <PricingSection />
      <FinalCTASection />
    </div>
  );
}
