import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FinalCTA() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8">
          <Calendar size={16} />
          <span className="text-sm font-medium">Disponible pour une démo</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight tracking-tight mb-6">
          Découvrez comment Noé peut simplifier vos opérations
        </h2>
        
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          30 minutes pour comprendre comment Noé s'adapte à votre organisation. Sans engagement, sans pression commerciale.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-base px-8" asChild>
            <Link to="/contact">
              Demander une démo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-base px-8" asChild>
            <Link to="/tarifs">Voir les tarifs</Link>
          </Button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Conçu avec des professionnels du terrain. Utilisé par des conciergeries de toutes tailles.
        </p>
      </div>
    </section>
  );
}
