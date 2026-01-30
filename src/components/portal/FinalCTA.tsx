import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Phone, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function FinalCTA({ className }: { className?: string }) {
  return (
    <section className={cn("py-20 lg:py-28 relative overflow-hidden", className)}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6 leading-tight">
          Prêt à piloter votre activité
          <br />
          <span className="text-muted-foreground">sans naviguer à vue ?</span>
        </h2>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          On vous montre Noé en 30 minutes. Pas de pitch commercial, juste une démo personnalisée selon vos besoins.
        </p>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mb-10">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>30 min chrono</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-primary" />
            <span>Démo personnalisée</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span>Sans engagement</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="text-base px-8 h-14 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30" 
            asChild
          >
            <Link to="/contact">
              Demander une démo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-base px-8 h-14" 
            asChild
          >
            <Link to="/tarifs">
              Voir les tarifs
            </Link>
          </Button>
        </div>

        {/* Bottom message */}
        <p className="mt-12 text-muted-foreground">
          <span className="text-foreground font-medium">On est là pour vous simplifier la vie,</span>{' '}
          pas pour ajouter une couche de complexité.
        </p>
      </div>
    </section>
  );
}
