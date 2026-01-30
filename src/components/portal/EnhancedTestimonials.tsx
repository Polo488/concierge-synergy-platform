import { cn } from '@/lib/utils';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  parkSize: string;
  initialProblem: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Enfin un outil qui comprend notre métier. On a divisé par deux le temps passé sur la planification.",
    author: "Marie D.",
    role: "Gérante, Conciergerie Côte d'Azur",
    parkSize: "45 logements",
    initialProblem: "Planning ingérable sur Excel",
  },
  {
    quote: "La synchronisation est fiable. Plus de doubles réservations depuis qu'on utilise Noé.",
    author: "Thomas L.",
    role: "Property Manager, Lyon",
    parkSize: "120 logements",
    initialProblem: "Trop d'outils dispersés",
  },
  {
    quote: "Mes équipes terrain adorent. L'interface est claire et ça marche, tout simplement.",
    author: "Sophie M.",
    role: "Directrice Opérations",
    parkSize: "78 logements",
    initialProblem: "Coordination équipes difficile",
  },
];

export function EnhancedTestimonials({ className }: { className?: string }) {
  return (
    <section className={cn("py-20 lg:py-28 bg-muted/30", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Témoignages
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Ce que disent nos utilisateurs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des conciergeries de toutes tailles utilisent Noé au quotidien.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl border border-border/50 p-6 hover:shadow-elevated transition-all duration-300"
            >
              {/* Quote */}
              <div className="mb-6">
                <svg
                  className="w-8 h-8 text-primary/20 mb-4"
                  viewBox="0 0 32 32"
                  fill="currentColor"
                >
                  <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                </svg>
                <p className="text-foreground leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </div>

              {/* Author */}
              <div className="pt-4 border-t border-border/50">
                <p className="font-medium text-foreground">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                
                {/* Meta badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
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
          <p className="text-sm text-muted-foreground">
            Noé a été pensé avec des professionnels du terrain. Chaque fonctionnalité répond à un besoin réel.
          </p>
        </div>
      </div>
    </section>
  );
}
