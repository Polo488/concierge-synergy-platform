import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MessageCircle, Sparkles, BarChart3, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { CalendarPreview, CleaningPreview, MessagingPreview, StatsPreview, BillingPreview } from './previews';

interface PreviewThumbnail {
  id: string;
  icon: React.ElementType;
  preview?: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
}

const thumbnails: PreviewThumbnail[] = [
  { id: 'calendar', icon: Calendar, label: 'Calendrier', color: 'from-primary/20 to-primary/5', preview: CalendarPreview },
  { id: 'messaging', icon: MessageCircle, label: 'Messagerie', color: 'from-status-info/20 to-status-info/5', preview: MessagingPreview },
  { id: 'cleaning', icon: Sparkles, label: 'Ménage', color: 'from-status-success/20 to-status-success/5', preview: CleaningPreview },
  { id: 'stats', icon: BarChart3, label: 'Stats', color: 'from-nav-pilotage/20 to-nav-pilotage/5', preview: StatsPreview },
  { id: 'billing', icon: FileText, label: 'Facturation', color: 'from-nav-revenus/20 to-nav-revenus/5', preview: BillingPreview },
];

function MainPreview() {
  return (
    <div className="relative bg-card rounded-2xl border border-border/50 shadow-elevated overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-status-error/60" />
          <div className="w-3 h-3 rounded-full bg-status-warning/60" />
          <div className="w-3 h-3 rounded-full bg-status-success/60" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs text-muted-foreground">app.noe-conciergerie.com</span>
        </div>
      </div>

      {/* Main calendar preview */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-semibold text-foreground">Calendrier</h4>
            <p className="text-xs text-muted-foreground">Janvier 2026</p>
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">12 arrivées</div>
            <div className="px-3 py-1 bg-status-warning/10 text-status-warning text-xs font-medium rounded-full">8 départs</div>
          </div>
        </div>

        {/* Calendar grid simulation */}
        <div className="space-y-2">
          {/* Property rows */}
          {['Villa Sunset', 'Apt. Centre-Ville', 'Studio Plage'].map((property, i) => (
            <div key={property} className="flex gap-2">
              <div className="w-28 flex-shrink-0 py-2 text-xs font-medium text-foreground truncate">
                {property}
              </div>
              <div className="flex-1 flex gap-1">
                {/* Day cells with bookings */}
                {Array.from({ length: 14 }).map((_, j) => {
                  const hasBooking = (i === 0 && j >= 2 && j <= 8) || 
                                    (i === 1 && j >= 5 && j <= 12) || 
                                    (i === 2 && j >= 0 && j <= 4);
                  const isAirbnb = i === 0 || i === 2;
                  return (
                    <div
                      key={j}
                      className={cn(
                        "flex-1 h-8 rounded text-2xs flex items-center justify-center transition-colors",
                        hasBooking 
                          ? isAirbnb 
                            ? "bg-channel-airbnb/20 text-channel-airbnb" 
                            : "bg-channel-booking/20 text-channel-booking"
                          : "bg-muted/50"
                      )}
                    >
                      {j + 15}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Stats footer */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border/50">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">87%</p>
            <p className="text-2xs text-muted-foreground">Occupation</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-status-success">24 890€</p>
            <p className="text-2xs text-muted-foreground">Revenus</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">4.8</p>
            <p className="text-2xs text-muted-foreground">Note moyenne</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThumbnailPreview({ thumbnail }: { thumbnail: PreviewThumbnail }) {
  if (thumbnail.preview) {
    const PreviewComponent = thumbnail.preview;
    return <PreviewComponent />;
  }
  
  const Icon = thumbnail.icon;
  return (
    <div className={cn(
      "aspect-video bg-gradient-to-br rounded-xl border border-border/30 flex flex-col items-center justify-center p-8",
      thumbnail.color
    )}>
      <div className="w-16 h-16 rounded-2xl bg-card/80 backdrop-blur flex items-center justify-center mb-4 shadow-soft">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <p className="text-lg font-medium text-foreground">{thumbnail.label}</p>
      <p className="text-sm text-muted-foreground">Capture d'écran</p>
    </div>
  );
}

export function EnhancedHeroSection() {
  const [selectedThumbnail, setSelectedThumbnail] = useState<PreviewThumbnail | null>(null);

  return (
    <section className="relative overflow-hidden min-h-[95vh] flex items-center">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Content - Left Side */}
          <div className="lg:col-span-5 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium">Channel Manager + PMS</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-[1.1] tracking-tight mb-6">
              Le cockpit tout-en-un
              <br />
              <span className="text-muted-foreground">des conciergeries modernes.</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Réservations. Équipes. Opérations. Revenus. Qualité. Automatisation.
              <br className="hidden sm:block" />
              Tout ce qu'il faut pour structurer votre activité.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button size="lg" className="text-base px-8 h-12" asChild>
                <Link to="/contact">
                  Demander une démo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 h-12" asChild>
                <Link to="/produit">
                  Voir le produit
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-status-success" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8L6 12L14 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-status-success" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8L6 12L14 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Démo personnalisée</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-status-success" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8L6 12L14 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Onboarding inclus</span>
              </div>
            </div>
          </div>

          {/* Product Preview - Right Side */}
          <div className="lg:col-span-7 relative">
            {/* Glow effect */}
            <div className="absolute -inset-8 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-3xl blur-2xl opacity-60" />
            
            <div className="relative space-y-4">
              {/* Main Preview */}
              <MainPreview />

              {/* Thumbnails Row */}
              <div className="grid grid-cols-5 gap-2">
                {thumbnails.map((thumbnail) => {
                  const Icon = thumbnail.icon;
                  return (
                    <button
                      key={thumbnail.id}
                      onClick={() => setSelectedThumbnail(thumbnail)}
                      className="group relative bg-card rounded-xl border border-border/50 p-3 transition-all duration-300 hover:shadow-soft hover:border-primary/30 hover:scale-[1.02]"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-2xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                          {thumbnail.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-status-success/20 to-transparent rounded-2xl blur-xl" />
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={!!selectedThumbnail} onOpenChange={() => setSelectedThumbnail(null)}>
        <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden">
          {selectedThumbnail && <ThumbnailPreview thumbnail={selectedThumbnail} />}
        </DialogContent>
      </Dialog>
    </section>
  );
}
