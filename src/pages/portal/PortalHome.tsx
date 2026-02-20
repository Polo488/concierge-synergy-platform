import { HeroSection } from '@/components/portal/sections/HeroSection';
import { ChannelManagementSection } from '@/components/portal/sections/ChannelManagementSection';
import { OperationsFlowSection } from '@/components/portal/sections/OperationsFlowSection';
import { MaintenanceSection } from '@/components/portal/sections/MaintenanceSection';
import { MessagingSection } from '@/components/portal/sections/MessagingSection';
import { BillingEngineSection } from '@/components/portal/sections/BillingEngineSection';
import { InventorySection } from '@/components/portal/sections/InventorySection';
import { RevenueManagementSection } from '@/components/portal/sections/RevenueManagementSection';
import { AnalyticsSection } from '@/components/portal/sections/AnalyticsSection';
import { ComplianceSection } from '@/components/portal/sections/ComplianceSection';
import { OnboardingSection } from '@/components/portal/sections/OnboardingSection';
import { TeamManagementSection } from '@/components/portal/sections/TeamManagementSection';
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
      {/* 1. Hero — infrastructure positioning */}
      <HeroSection />

      {/* 2. Channel Management */}
      <AmbientSection variant={0}>
        <ChannelManagementSection />
      </AmbientSection>

      {/* 3. Operations Automation */}
      <AmbientSection variant={1}>
        <OperationsFlowSection />
      </AmbientSection>

      {/* 4. Cleaning workflows */}
      <AmbientSection variant={2}>
        <MaintenanceSection />
      </AmbientSection>

      {/* 5. Messaging */}
      <AmbientSection variant={3}>
        <MessagingSection />
      </AmbientSection>

      {/* 6. Automated Billing */}
      <AmbientSection variant={4}>
        <BillingEngineSection />
      </AmbientSection>

      {/* 7. Inventory Tracking */}
      <AmbientSection variant={5}>
        <InventorySection />
      </AmbientSection>

      {/* 8. Revenue Management */}
      <AmbientSection variant={0}>
        <RevenueManagementSection />
      </AmbientSection>

      {/* 9. Analytics */}
      <AmbientSection variant={1}>
        <AnalyticsSection />
      </AmbientSection>

      {/* 10. Compliance */}
      <AmbientSection variant={2}>
        <ComplianceSection />
      </AmbientSection>

      {/* 11. Digital Onboarding + Team */}
      <AmbientSection variant={3}>
        <OnboardingSection />
      </AmbientSection>

      <AmbientSection variant={4}>
        <TeamManagementSection />
      </AmbientSection>

      {/* 12. Early Access */}
      <AmbientSection variant={5}>
        <EarlyAccessSection />
      </AmbientSection>

      {/* 13. Social proof */}
      <AmbientSection variant={0}>
        <SocialProofSection />
      </AmbientSection>

      {/* 14. Pre-registration + Demo */}
      <PreRegistrationSection />
      <DemoBookingSection />

      {/* 15. Pricing — appears ONLY here */}
      <PricingSection />

      {/* 16. Final CTA */}
      <FinalCTASection />
    </div>
  );
}
