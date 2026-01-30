import { cn } from '@/lib/utils';
import { Quote, Building2 } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  parkSize: string;
  initialProblem: string;
  result: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Noé nous a permis de passer de 30 à 85 logements sans recruter. On voit enfin clair dans nos opérations.",
    author: "Marie D.",
    role: "Gérante, Conciergerie Côte d'Azur",
    parkSize: "85 logements",
    initialProblem: "Croissance bloquée par les process",
    result: "+55 logements sans embauche",
  },
  {
    quote: "Les stats m'ont ouvert les yeux. J'ai identifié 3 biens sous-performants et optimisé mes tarifs en 2 semaines.",
    author: "Thomas L.",
    role: "Property Manager, Lyon",
    parkSize: "120 logements",
    initialProblem: "Pilotage à l'aveugle",
    result: "+18% de revenus en 2 mois",
  },
  {
    quote: "Mes équipes terrain adorent. Ils savent quoi faire sans m'appeler, et moi je peux enfin déléguer sereinement.",
    author: "Sophie M.",
    role: "Directrice Opérations",
    parkSize: "78 logements",
    initialProblem: "Coordination équipes impossible",
    result: "-80% d'appels quotidiens",
  },
];

export function EnhancedTestimonials({ className }: { className?: string }) {
  return (
    <section className={cn("py-20 lg:py-28 bg-muted/30", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Ils nous font confiance
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Des conciergeries qui ont transformé leur quotidien
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pas des promesses. Des résultats concrets, mesurables, vérifiables.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl border border-border/50 p-6 hover:shadow-elevated transition-all duration-300 flex flex-col"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-primary/20 mb-4" />
              
              {/* Quote */}
              <p className="text-foreground leading-relaxed flex-1 mb-6">
                "{testimonial.quote}"
              </p>

              {/* Result badge */}
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-status-success/10 text-status-success text-sm font-medium">
                  {testimonial.result}
                </span>
              </div>

              {/* Author */}
              <div className="pt-4 border-t border-border/50">
                <p className="font-medium text-foreground">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                
                {/* Meta badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    <Building2 className="w-3 h-3" />
                    {testimonial.parkSize}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs">
                    {testimonial.initialProblem}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof bar */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            <span className="text-foreground font-medium">Noé a été construit avec des pros du terrain.</span>{' '}
            Chaque fonctionnalité répond à un besoin réel.
          </p>
        </div>
      </div>
    </section>
  );
}
