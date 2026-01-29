import { ContactForm } from '@/components/portal/ContactForm';
import { Mail, Phone } from 'lucide-react';

export default function PortalContact() {
  return (
    <div>
      {/* Header */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight tracking-tight mb-6">
              Parlons de votre projet
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Une question ? Une demande de démo ? Nous sommes là pour vous aider. Remplissez le formulaire et nous vous répondrons rapidement.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-card rounded-2xl border border-border/50 p-6 sm:p-8">
                <ContactForm />
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-6">
                <div className="bg-card rounded-2xl border border-border/50 p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Autres moyens de nous joindre
                  </h3>
                  <div className="space-y-4">
                    <a
                      href="mailto:contact@noe.app"
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-sm">contact@noe.app</span>
                    </a>
                    <a
                      href="tel:+33123456789"
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-sm">+33 1 23 45 67 89</span>
                    </a>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Délai de réponse
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Nous répondons généralement sous 24 heures ouvrées. Pour les demandes urgentes, privilégiez le téléphone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
