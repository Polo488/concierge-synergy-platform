import { Link } from 'react-router-dom';
import { Workflow, RefreshCw, BarChart3, Calendar, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroSection } from '@/components/portal/HeroSection';
import { ValueBlock } from '@/components/portal/ValueBlock';
import { FeatureCard } from '@/components/portal/FeatureCard';
import { SocialProof } from '@/components/portal/SocialProof';

export default function PortalHome() {
  return (
    <div>
      {/* Hero */}
      <HeroSection />

      {/* Value Blocks */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-6">
            <ValueBlock
              icon={Workflow}
              title="Un outil qui s'adapte à votre façon de travailler"
              description="Chaque conciergerie est différente. Noé s'adapte à vos équipes, vos processus et votre organisation."
              benefits={[
                'Planning centralisé pour toutes vos équipes',
                'Attribution automatique des tâches',
                'Suivi terrain en temps réel',
              ]}
            />
            <ValueBlock
              icon={RefreshCw}
              title="Une synchronisation fiable, sans prise de tête"
              description="Vos calendriers sont à jour. Automatiquement. Plus de doubles réservations."
              benefits={[
                'Connexion à toutes les plateformes',
                'Mise à jour instantanée des disponibilités',
                'Gestion centralisée des prix',
              ]}
            />
            <ValueBlock
              icon={BarChart3}
              title="Une vision claire, enfin"
              description="Prenez les bonnes décisions grâce à des données fiables et lisibles."
              benefits={[
                'Taux d\'occupation et revenus en un coup d\'œil',
                'Suivi qualité et performance',
                'Rapports exportables',
              ]}
            />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <SocialProof />

      {/* Feature Highlights */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4">
              Conçu pour le quotidien
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Chaque fonctionnalité a été pensée pour répondre aux défis réels des conciergeries et property managers.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-2">
            <FeatureCard
              icon={Calendar}
              title="Un calendrier que vos équipes comprennent"
              description="Vue claire des arrivées, départs et disponibilités. Tout le monde sait ce qu'il doit faire."
            />
            <FeatureCard
              icon={Sparkles}
              title="Le ménage et la maintenance enfin structurés"
              description="Chaque intervention est planifiée, assignée et suivie. Fini les oublis."
            />
            <FeatureCard
              icon={TrendingUp}
              title="Des statistiques utiles, pas décoratives"
              description="Les données qui comptent, présentées simplement. Pour agir, pas pour impressionner."
            />
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-primary/5 via-transparent to-primary/3">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4">
            Découvrez comment Noé peut s'adapter à votre organisation
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Chaque conciergerie est unique. Échangeons sur vos besoins et voyons ensemble comment Noé peut vous aider.
          </p>
          <Button size="lg" asChild>
            <Link to="/contact">Demander une démo</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
