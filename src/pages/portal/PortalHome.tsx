import { EnhancedHeroSection } from '@/components/portal/EnhancedHeroSection';
import { WhyNoeSection } from '@/components/portal/WhyNoeSection';
import { ValueOutcomesSection } from '@/components/portal/ValueOutcomesSection';
import { PersonasSection } from '@/components/portal/PersonasSection';
import { ProductTourSection } from '@/components/portal/ProductTourSection';
import { ProductShowcase } from '@/components/portal/ProductShowcase';
import { EnhancedTestimonials } from '@/components/portal/EnhancedTestimonials';
import { PricingSection } from '@/components/portal/PricingSection';
import { SecuritySection } from '@/components/portal/SecuritySection';
import { ProductGallery } from '@/components/portal/ProductGallery';
import { FinalCTA } from '@/components/portal/FinalCTA';

export default function PortalHome() {
  return (
    <div>
      {/* Hero Section - Product immersive */}
      <EnhancedHeroSection />

      {/* Why Noé - 3 columns pain→solution */}
      <WhyNoeSection />

      {/* Value Outcomes - What you gain in 7 days */}
      <ValueOutcomesSection />

      {/* Personas - Before/After by company size */}
      <PersonasSection />

      {/* Product Tour - 5 steps clickable */}
      <ProductTourSection />

      {/* Product Showcase - Scroll-driven discovery */}
      <div id="product">
        <ProductShowcase />
      </div>

      {/* Product Gallery - Screenshots grid */}
      <ProductGallery />

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
