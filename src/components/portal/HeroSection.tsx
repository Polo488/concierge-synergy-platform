import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MockDashboard } from './MockDashboard';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight tracking-tight">
              Tout ce dont une conciergerie a besoin.{' '}
              <span className="text-muted-foreground">Rien de superflu.</span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              Planifiez, synchronisez et pilotez vos logements depuis un seul outil, pensé pour le terrain.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" asChild>
                <Link to="/contact">Demander une démo</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/tarifs">Voir les tarifs</Link>
              </Button>
            </div>
          </div>

          {/* Mock Dashboard */}
          <div className="relative lg:pl-8">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl blur-2xl opacity-60" />
              <MockDashboard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
