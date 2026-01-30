import { EnhancedHeroSection } from '@/components/portal/EnhancedHeroSection';
import { WhyNoeSection } from '@/components/portal/WhyNoeSection';
import { ValueOutcomesSection } from '@/components/portal/ValueOutcomesSection';
import { PersonasSection } from '@/components/portal/PersonasSection';
import { StatsShowcaseSection } from '@/components/portal/StatsShowcaseSection';
import { ProductShowcase } from '@/components/portal/ProductShowcase';
import { EnhancedTestimonials } from '@/components/portal/EnhancedTestimonials';
import { PricingSection } from '@/components/portal/PricingSection';
import { SecuritySection } from '@/components/portal/SecuritySection';
import { FinalCTA } from '@/components/portal/FinalCTA';

export default function PortalHome() {
  return (
    <div>
      {/* Hero Section - Pilotage focus, copilot tone */}
      <EnhancedHeroSection />

      {/* Why Noé - Centralise, Éclaire, Aide à décider */}
      <WhyNoeSection />

      {/* Value Outcomes - Concrete metrics, first week results */}
      <ValueOutcomesSection />

      {/* STATS SHOWCASE - Key differentiator, immersive preview */}
      <StatsShowcaseSection />

      {/* Personas - Before/After by company size */}
      <PersonasSection />

      {/* Product Showcase - See, Understand, Decide structure */}
      <div id="product">
        <ProductShowcase />
      </div>

      {/* Testimonials - Enhanced with park size & problem */}
      <EnhancedTestimonials />

      {/* Pricing - Quick overview */}
      <PricingSection />

      {/* Security - Brief section */}
      <SecuritySection />

      {/* Final CTA */}
      <FinalCTA />
    </div>
  );
}
