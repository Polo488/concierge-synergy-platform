import { HeroSection } from '@/components/portal/HeroSection';
import { ProductShowcase } from '@/components/portal/ProductShowcase';
import { HowItWorks } from '@/components/portal/HowItWorks';
import { ModulesGrid } from '@/components/portal/ModulesGrid';
import { Testimonials } from '@/components/portal/Testimonials';
import { PricingSection } from '@/components/portal/PricingSection';
import { SecuritySection } from '@/components/portal/SecuritySection';
import { FinalCTA } from '@/components/portal/FinalCTA';

export default function PortalHome() {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Product Showcase - Scroll-driven discovery */}
      <div id="product">
        <ProductShowcase />
      </div>

      {/* How It Works */}
      <HowItWorks />

      {/* Modules Grid */}
      <ModulesGrid />

      {/* Testimonials */}
      <Testimonials />

      {/* Pricing */}
      <PricingSection />

      {/* Security */}
      <SecuritySection />

      {/* Final CTA */}
      <FinalCTA />
    </div>
  );
}
