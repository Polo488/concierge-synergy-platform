import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductPreviewCalendar } from './ProductPreviewCalendar';
import { ProductPreviewStats } from './ProductPreviewStats';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Content - Left Side */}
          <div className="lg:col-span-5 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium">Channel Manager + PMS</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-[1.1] tracking-tight mb-6">
              Toutes vos opérations.
              <br />
              <span className="text-muted-foreground">Une seule plateforme.</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Channel Manager et PMS conçus pour les conciergeries qui veulent structurer leurs opérations, de la réservation à la facturation.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button size="lg" className="text-base px-6" asChild>
                <Link to="/contact">
                  Demander une démo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-6" asChild>
                <Link to="#product">
                  Explorer le produit
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[hsl(152,50%,45%)]" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8L6 12L14 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[hsl(152,50%,45%)]" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8L6 12L14 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Démo en 30 min</span>
              </div>
            </div>
          </div>

          {/* Product Preview - Right Side */}
          <div className="lg:col-span-7 relative">
            {/* Glow effect */}
            <div className="absolute -inset-8 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-3xl blur-2xl opacity-60" />
            
            {/* Main Product Preview */}
            <div className="relative space-y-4">
              {/* Calendar Preview */}
              <ProductPreviewCalendar />
              
              {/* Stats Row */}
              <ProductPreviewStats />
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-[hsl(152,50%,45%)]/20 to-transparent rounded-2xl blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
