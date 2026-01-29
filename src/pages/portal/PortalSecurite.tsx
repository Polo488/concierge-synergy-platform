import { Link } from 'react-router-dom';
import { Shield, Lock, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PortalSecurite() {
  const sections = [
    {
      icon: Shield,
      title: 'Vos données vous appartiennent',
      content:
        'Nous ne vendons pas vos données. Nous ne les partageons pas. Elles sont stockées de manière sécurisée et vous pouvez les exporter ou les supprimer à tout moment.',
    },
    {
      icon: Lock,
      title: 'Des accès maîtrisés',
      content:
        'Chaque utilisateur a des permissions adaptées à son rôle. Vos agents terrain voient ce dont ils ont besoin, rien de plus. Vous gardez le contrôle total sur qui accède à quoi.',
    },
    {
      icon: Server,
      title: 'Un outil pensé pour durer',
      content:
        'Infrastructure robuste, sauvegardes régulières, mises à jour transparentes. Noé est conçu pour être disponible quand vous en avez besoin, sans interruption.',
    },
  ];

  return (
    <div>
      {/* Header */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight tracking-tight mb-6">
              La sécurité, simplement
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Nous savons que vous nous confiez des données importantes. Voici comment nous les protégeons.
            </p>
          </div>
        </div>
      </section>

      {/* Security Sections */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-6 p-8 rounded-2xl bg-card border border-border/50"
              >
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <section.icon className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
            Ce que nous faisons concrètement
          </h2>
          <div className="bg-card rounded-2xl border border-border/50 p-6 sm:p-8">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">
                  Chiffrement des données en transit et au repos
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">
                  Hébergement sur des serveurs européens
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">
                  Sauvegardes automatiques quotidiennes
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">
                  Authentification sécurisée avec gestion fine des permissions
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">
                  Conformité RGPD
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Des questions sur la sécurité ?
          </h2>
          <p className="text-muted-foreground mb-8">
            Notre équipe est disponible pour répondre à toutes vos interrogations.
          </p>
          <Button size="lg" asChild>
            <Link to="/contact">Nous contacter</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
