export function SocialProof() {
  const testimonials = [
    {
      quote: "Enfin un outil qui comprend notre métier. On a divisé par deux le temps passé sur la planification.",
      author: "Marie D.",
      role: "Gérante, Conciergerie Côte d'Azur",
    },
    {
      quote: "La synchronisation est fiable. Plus de doubles réservations depuis qu'on utilise Noé.",
      author: "Thomas L.",
      role: "Property Manager, Lyon",
    },
    {
      quote: "Mes équipes terrain adorent. L'interface est claire et ça marche.",
      author: "Sophie M.",
      role: "Directrice, 45 biens",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4">
            Pensé avec des professionnels du terrain
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Noé a été construit main dans la main avec des conciergeries et property managers. Chaque fonctionnalité répond à un besoin réel.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 border border-border/50"
            >
              <p className="text-foreground leading-relaxed mb-4">
                "{testimonial.quote}"
              </p>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {testimonial.author}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
