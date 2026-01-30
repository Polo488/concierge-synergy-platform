import { cn } from '@/lib/utils';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "On a enfin un outil qui comprend notre métier. Plus de tableaux Excel, plus de messages dans tous les sens.",
    author: 'Marie D.',
    role: 'Gérante',
    company: 'Conciergerie Côte d\'Azur',
    properties: '45 biens',
  },
  {
    quote: "Mes équipes savent exactement quoi faire chaque jour. C'est simple, c'est clair, ça marche.",
    author: 'Thomas L.',
    role: 'Directeur opérationnel',
    company: 'City Apartments',
    properties: '120 biens',
  },
  {
    quote: "Le temps gagné sur l'administratif, on le passe avec nos voyageurs. C'est tout bénéfice.",
    author: 'Sophie M.',
    role: 'Fondatrice',
    company: 'Provence Homes',
    properties: '28 biens',
  },
];

export function Testimonials() {
  return (
    <section className="py-24 lg:py-32 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary mb-3 tracking-wide uppercase">Témoignages</p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground leading-tight tracking-tight mb-4">
            Pensé avec des professionnels du terrain
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Noé est né des besoins réels des conciergeries. Chaque fonctionnalité répond à un problème concret.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-card rounded-2xl border border-border/50 p-6 hover:shadow-lg transition-shadow"
            >
              {/* Quote icon */}
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Quote size={20} className="text-primary" />
              </div>

              {/* Quote text */}
              <blockquote className="text-foreground leading-relaxed mb-6">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{testimonial.author}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role} · {testimonial.company}</div>
                </div>
              </div>

              {/* Properties badge */}
              <div className="absolute top-6 right-6">
                <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                  {testimonial.properties}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
