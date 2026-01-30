import { useState } from 'react';
import { X, ZoomIn, Calendar, MessageCircle, Sparkles, BarChart3, FileText, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Screenshot {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: string;
}

const screenshots: Screenshot[] = [
  { id: 'calendar', title: 'Calendrier multi-lots', description: 'Vue unifiée de toutes vos réservations', icon: Calendar, category: 'Pilotage' },
  { id: 'cleaning', title: 'Planning ménage', description: 'Tâches assignées et suivies', icon: Sparkles, category: 'Opérations' },
  { id: 'messaging', title: 'Messagerie voyageurs', description: 'Tous les messages centralisés', icon: MessageCircle, category: 'Expérience' },
  { id: 'stats', title: 'Statistiques activité', description: 'Performance en temps réel', icon: BarChart3, category: 'Pilotage' },
  { id: 'maintenance', title: 'Tickets maintenance', description: 'Suivi des interventions', icon: Sparkles, category: 'Opérations' },
  { id: 'invoicing', title: 'Facturation', description: 'Générez vos factures en 1 clic', icon: FileText, category: 'Revenus' },
  { id: 'users', title: 'Gestion équipes', description: 'Rôles et accès par utilisateur', icon: Users, category: 'Organisation' },
  { id: 'agenda', title: 'Agenda opérationnel', description: 'Vue journée de vos équipes', icon: Calendar, category: 'Opérations' },
];

// Simulated screenshot placeholders
function ScreenshotPlaceholder({ screenshot, size = 'normal' }: { screenshot: Screenshot; size?: 'normal' | 'large' }) {
  const Icon = screenshot.icon;
  
  return (
    <div className={cn(
      "bg-gradient-to-br from-muted/50 to-muted rounded-xl border border-border/30 flex flex-col items-center justify-center",
      size === 'large' ? "aspect-video p-12" : "aspect-video p-6"
    )}>
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <p className="text-lg font-medium text-foreground mb-1">{screenshot.title}</p>
      <p className="text-sm text-muted-foreground">{screenshot.description}</p>
      <span className="mt-3 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
        {screenshot.category}
      </span>
    </div>
  );
}

export function ProductGallery({ className }: { className?: string }) {
  const [selectedScreenshot, setSelectedScreenshot] = useState<Screenshot | null>(null);

  return (
    <section className={cn("py-20 lg:py-28", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Galerie Produit
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Dans l'interface
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez les écrans clés qui font le quotidien des conciergeries utilisant Noé.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {screenshots.map((screenshot) => (
            <button
              key={screenshot.id}
              onClick={() => setSelectedScreenshot(screenshot)}
              className="group relative rounded-2xl overflow-hidden bg-card border border-border/50 transition-all duration-300 hover:shadow-elevated hover:scale-[1.02] hover:border-primary/30"
            >
              <ScreenshotPlaceholder screenshot={screenshot} />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 rounded-full p-3">
                  <ZoomIn className="w-5 h-5 text-foreground" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Lightbox Modal */}
        <Dialog open={!!selectedScreenshot} onOpenChange={() => setSelectedScreenshot(null)}>
          <DialogContent className="max-w-5xl p-0 gap-0 overflow-hidden">
            {selectedScreenshot && (
              <div className="relative">
                <ScreenshotPlaceholder screenshot={selectedScreenshot} size="large" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-6">
                  <h3 className="text-xl font-semibold text-foreground">{selectedScreenshot.title}</h3>
                  <p className="text-muted-foreground">{selectedScreenshot.description}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
