
import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { SignatureTemplate, SignatureSession, SignatureZone, SignatureZoneData, ZONE_TYPE_CONFIG } from '@/types/signature';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { SignaturePad } from './SignaturePad';
import { 
  CheckCircle2, ChevronRight, ChevronLeft, Shield, Clock,
  PenTool, Type, Calendar, AlignLeft, FileText, Eye, ArrowDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Props {
  template: SignatureTemplate;
  session: SignatureSession;
  zoneData: SignatureZoneData[];
  onCompleteZone: (sessionId: string, zoneId: string, value: string) => void;
  onSign: (sessionId: string) => void;
  onView: (sessionId: string) => void;
}

const zoneIcons: Record<string, React.ElementType> = {
  signature: PenTool,
  initials: PenTool,
  date: Calendar,
  text: AlignLeft,
};

const CANVAS_WIDTH = 595;
const CANVAS_HEIGHT = 842;

function DocumentPreview({ template, session, zoneData }: { template: SignatureTemplate; session: SignatureSession; zoneData: SignatureZoneData[] }) {
  const zoneColorMap: Record<string, string> = {
    'signature-owner': 'border-primary bg-primary/10',
    'signature-conciergerie': 'border-indigo-500 bg-indigo-500/10',
    'initials-owner': 'border-blue-500 bg-blue-500/10',
    'initials-conciergerie': 'border-blue-400 bg-blue-400/10',
    'date-owner': 'border-amber-500 bg-amber-500/10',
    'date-conciergerie': 'border-amber-400 bg-amber-400/10',
    'text-owner': 'border-emerald-500 bg-emerald-500/10',
    'text-conciergerie': 'border-emerald-400 bg-emerald-400/10',
  };

  return (
    <div 
      className="relative bg-white border border-border rounded-lg shadow-inner mx-auto"
      style={{ aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}`, maxWidth: '100%' }}
    >
      {/* Document content */}
      <div className="absolute inset-0 p-6 md:p-8 overflow-hidden">
        <div className="text-center mb-6">
          <p className="text-xs md:text-sm font-bold text-foreground tracking-wide">MANDAT DE GESTION LOCATIVE</p>
          <p className="text-[8px] md:text-[10px] text-muted-foreground mt-1">Conciergerie courte & moyenne durée</p>
        </div>
        <div className="space-y-2 text-[7px] md:text-[9px] text-foreground/80 leading-relaxed">
          <p className="font-semibold">Entre les soussignés :</p>
          <p className="mt-1"><span className="font-medium">Le Mandant :</span> {session.ownerName || '_________________________'}</p>
          <p><span className="font-medium">Adresse du bien :</span> {session.propertyAddress || '_________________________'}</p>
          <p className="mt-2"><span className="font-medium">Et :</span></p>
          <p>La société <span className="font-medium">Noé Conciergerie</span>, SAS au capital de 10 000€, ci-après dénommée le Mandataire.</p>
          <p className="mt-3 font-semibold">Article 1 – Objet du mandat</p>
          <p>Le mandant confie au mandataire, qui accepte, la gestion locative de son bien immobilier sis à l'adresse ci-dessus mentionnée, en vue de sa mise en location de courte et/ou moyenne durée sur les plateformes de réservation en ligne.</p>
          <p className="mt-2 font-semibold">Article 2 – Commission</p>
          <p>Le mandataire percevra une commission de <span className="font-medium">{session.commissionRate || '___'}%</span> hors taxes sur les revenus locatifs bruts générés par la location du bien, prélevée directement sur les versements des plateformes.</p>
          <p className="mt-2 font-semibold">Article 3 – Durée</p>
          <p>Le présent mandat est conclu pour une durée d'un an à compter de sa date de signature. Il est renouvelable par tacite reconduction pour des périodes successives d'un an, sauf dénonciation par l'une des parties avec un préavis de trois mois.</p>
          <p className="mt-2 font-semibold">Article 4 – Obligations du Mandataire</p>
          <p>Le mandataire s'engage à : gérer les réservations, accueillir les voyageurs, coordonner le ménage et la maintenance, assurer la communication avec les hôtes, et reverser les revenus selon les conditions convenues.</p>
          <p className="mt-2 font-semibold">Article 5 – Obligations du Mandant</p>
          <p>Le mandant s'engage à maintenir le bien en bon état, fournir les clés et accès nécessaires, et informer le mandataire de toute modification affectant la disponibilité du bien.</p>
          <p className="mt-4 text-center font-medium">Fait en deux exemplaires, à ________________, le ________________</p>
        </div>
      </div>

      {/* Zones overlay */}
      {template.zones.map(zone => {
        const colorKey = `${zone.zoneType}-${zone.role}`;
        const colorClass = zoneColorMap[colorKey] || 'border-border bg-muted/50';
        const data = zoneData.find(d => d.zoneId === zone.id);
        
        return (
          <div
            key={zone.id}
            className={cn(
              'absolute border-2 border-dashed rounded-md flex items-center justify-center gap-1 text-[7px] font-medium overflow-hidden',
              colorClass,
              data ? 'border-solid bg-emerald-50' : ''
            )}
            style={{
              left: `${(zone.xPosition / CANVAS_WIDTH) * 100}%`,
              top: `${(zone.yPosition / CANVAS_HEIGHT) * 100}%`,
              width: `${(zone.width / CANVAS_WIDTH) * 100}%`,
              height: `${(zone.height / CANVAS_HEIGHT) * 100}%`,
            }}
          >
            {data?.value?.startsWith('data:image') ? (
              <img src={data.value} alt={zone.label} className="max-w-full max-h-full object-contain" />
            ) : data?.value ? (
              <span className="text-[7px] text-foreground truncate px-1">{data.value}</span>
            ) : (
              <span className="truncate px-1 text-muted-foreground">{zone.label}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function SigningFlow({ template, session, zoneData, onCompleteZone, onSign, onView }: Props) {
  const [currentZoneIndex, setCurrentZoneIndex] = useState(0);
  const [phase, setPhase] = useState<'welcome' | 'preview' | 'signing' | 'completed'>(
    session.status === 'signed' ? 'completed' : 'welcome'
  );
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Only owner zones for signing flow
  const ownerZones = useMemo(() => 
    template.zones
      .filter(z => z.role === 'owner')
      .sort((a, b) => a.sortOrder - b.sortOrder),
    [template.zones]
  );

  const completedZones = useMemo(() => {
    const completedIds = new Set(zoneData.map(d => d.zoneId));
    return ownerZones.filter(z => completedIds.has(z.id));
  }, [ownerZones, zoneData]);

  const progress = ownerZones.length > 0 ? Math.round((completedZones.length / ownerZones.length) * 100) : 0;
  const allCompleted = completedZones.length === ownerZones.length;
  const currentZone = ownerZones[currentZoneIndex];

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setHasScrolledToBottom(true);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && phase === 'preview') {
      // Check if content is scrollable
      if (el.scrollHeight <= el.clientHeight + 20) {
        setHasScrolledToBottom(true);
      }
    }
  }, [phase]);

  const handleStart = () => {
    onView(session.id);
    setPhase('preview');
    setHasScrolledToBottom(false);
  };

  const handleProceedToSigning = () => {
    setPhase('signing');
  };

  const handleZoneComplete = (value: string) => {
    if (!currentZone) return;
    onCompleteZone(session.id, currentZone.id, value);
    if (currentZoneIndex < ownerZones.length - 1) {
      setCurrentZoneIndex(prev => prev + 1);
    }
  };

  const handleFinalize = () => {
    onSign(session.id);
    setPhase('completed');
  };

  const isZoneCompleted = (zoneId: string) => zoneData.some(d => d.zoneId === zoneId);

  // Welcome screen
  if (phase === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full border border-border/50 shadow-xl">
          <CardContent className="p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <FileText size={28} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Signature de votre mandat</h1>
              <p className="text-sm text-muted-foreground mt-2">
                {session.ownerName}, vous avez reçu un document à signer de la part de Noé Conciergerie.
              </p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-left">
              <p className="text-xs font-medium text-muted-foreground uppercase">Document</p>
              <p className="text-sm font-medium text-foreground">{template.name}</p>
              <p className="text-xs text-muted-foreground">Bien : {session.propertyAddress}</p>
              <p className="text-xs text-muted-foreground">{ownerZones.length} zones à compléter</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
              <Shield size={12} />
              <span>Signature électronique simple • Horodatée et tracée</span>
            </div>
            <Button size="lg" className="w-full" onClick={handleStart}>
              <Eye size={16} className="mr-2" />
              Consulter le document
              <ChevronRight size={16} className="ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Document preview screen (must scroll to bottom)
  if (phase === 'preview') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
        {/* Header */}
        <div className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-3xl mx-auto p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Lecture du document</p>
                  <p className="text-xs text-muted-foreground">Lisez l'intégralité du document avant de signer</p>
                </div>
              </div>
              <Badge variant="outline" className={cn(
                hasScrolledToBottom ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
              )}>
                {hasScrolledToBottom ? 'Document lu ✓' : 'Scrollez pour lire'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Document */}
        <div 
          ref={scrollRef} 
          className="flex-1 overflow-y-auto px-4 py-6"
          onScroll={handleScroll}
        >
          <div className="max-w-3xl mx-auto space-y-6">
            <DocumentPreview template={template} session={session} zoneData={zoneData} />
            
            {/* Scroll indicator */}
            {!hasScrolledToBottom && (
              <div className="text-center animate-bounce py-4">
                <ArrowDown size={20} className="text-muted-foreground mx-auto" />
                <p className="text-xs text-muted-foreground mt-1">Continuez à faire défiler</p>
              </div>
            )}

            {/* Bottom spacer to ensure scrolling is needed */}
            <div className="h-4" />
          </div>
        </div>

        {/* Footer CTA */}
        <div className="border-t border-border/50 bg-card/80 backdrop-blur-sm p-4">
          <div className="max-w-3xl mx-auto">
            <Button 
              size="lg" 
              className="w-full" 
              disabled={!hasScrolledToBottom}
              onClick={handleProceedToSigning}
            >
              {hasScrolledToBottom ? (
                <>
                  <PenTool size={16} className="mr-2" />
                  Procéder à la signature
                  <ChevronRight size={16} className="ml-1" />
                </>
              ) : (
                <>
                  <ArrowDown size={16} className="mr-2" />
                  Lisez l'intégralité du document pour continuer
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Completed screen
  if (phase === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-emerald-500/5 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full border border-emerald-200 shadow-xl">
          <CardContent className="p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Document signé !</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Votre mandat de gestion a été signé avec succès. Un récapitulatif vous sera envoyé par email.
              </p>
            </div>
            <div className="bg-emerald-500/5 rounded-xl p-4 space-y-2 text-left border border-emerald-200">
              <p className="text-xs font-medium text-emerald-700">Preuve de signature</p>
              <p className="text-xs text-muted-foreground">Signé le {format(new Date(), 'dd MMMM yyyy à HH:mm', { locale: fr })}</p>
              <p className="text-xs text-muted-foreground">IP : {session.signerIp || '0.0.0.0'}</p>
              <p className="text-xs text-muted-foreground">Document : {template.name}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
              <Shield size={12} />
              <span>Document horodaté et archivé de façon sécurisée</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Signing flow
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{template.name}</p>
              <p className="text-xs text-muted-foreground">{session.ownerName}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setPhase('preview')}>
                <Eye size={14} className="mr-1" />
                Revoir le document
              </Button>
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {completedZones.length}/{ownerZones.length}
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>

      {/* Zone navigation */}
      <div className="flex-1 max-w-2xl mx-auto w-full p-4 space-y-4">
        {/* Zone pills */}
        <div className="flex gap-2 flex-wrap">
          {ownerZones.map((zone, i) => {
            const Icon = zoneIcons[zone.zoneType] || AlignLeft;
            const done = isZoneCompleted(zone.id);
            return (
              <button
                key={zone.id}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                  i === currentZoneIndex && 'bg-primary text-primary-foreground shadow-sm',
                  done && i !== currentZoneIndex && 'bg-emerald-500/10 text-emerald-600',
                  !done && i !== currentZoneIndex && 'bg-muted text-muted-foreground'
                )}
                onClick={() => setCurrentZoneIndex(i)}
              >
                {done ? <CheckCircle2 size={12} /> : <Icon size={12} />}
                {zone.label}
              </button>
            );
          })}
        </div>

        {/* Current zone */}
        {currentZone && !isZoneCompleted(currentZone.id) && (
          <Card className="border border-primary/20 shadow-lg">
            <CardContent className="p-6">
              {currentZone.zoneType === 'signature' || currentZone.zoneType === 'initials' ? (
                <SignaturePad 
                  label={currentZone.label}
                  onComplete={handleZoneComplete}
                  width={currentZone.zoneType === 'initials' ? 200 : 400}
                  height={currentZone.zoneType === 'initials' ? 80 : 150}
                />
              ) : currentZone.zoneType === 'date' ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">{currentZone.label}</p>
                  <div className="flex items-center gap-3">
                    <Input 
                      type="date" 
                      defaultValue={format(new Date(), 'yyyy-MM-dd')}
                      className="flex-1"
                    />
                    <Button onClick={() => handleZoneComplete(format(new Date(), 'dd/MM/yyyy'))}>
                      Valider
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">{currentZone.label}</p>
                  <Input 
                    defaultValue={session.fieldValues[currentZone.id] || ''}
                    placeholder={`Saisissez ${currentZone.label.toLowerCase()}`}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleZoneComplete((e.target as HTMLInputElement).value);
                    }}
                  />
                  <Button className="w-full" onClick={(e) => {
                    const input = (e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement);
                    if (input?.value) handleZoneComplete(input.value);
                  }}>
                    Valider
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Already completed zone */}
        {currentZone && isZoneCompleted(currentZone.id) && (
          <Card className="border border-emerald-200">
            <CardContent className="p-6 text-center space-y-3">
              <CheckCircle2 size={24} className="text-emerald-500 mx-auto" />
              <p className="text-sm font-medium text-foreground">{currentZone.label} — Complété</p>
              {zoneData.find(d => d.zoneId === currentZone.id)?.value?.startsWith('data:image') ? (
                <img 
                  src={zoneData.find(d => d.zoneId === currentZone.id)?.value} 
                  alt="Signature" 
                  className="mx-auto border rounded-md max-h-20"
                />
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  {zoneData.find(d => d.zoneId === currentZone.id)?.value}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setCurrentZoneIndex(prev => Math.max(0, prev - 1))} 
            disabled={currentZoneIndex === 0}
          >
            <ChevronLeft size={14} className="mr-1" />
            Précédent
          </Button>
          {currentZoneIndex < ownerZones.length - 1 ? (
            <Button 
              className="flex-1"
              onClick={() => setCurrentZoneIndex(prev => prev + 1)}
            >
              Suivant
              <ChevronRight size={14} className="ml-1" />
            </Button>
          ) : allCompleted ? (
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={handleFinalize}>
              <CheckCircle2 size={14} className="mr-1" />
              Finaliser et signer
            </Button>
          ) : (
            <Button className="flex-1" disabled>
              Complétez toutes les zones
            </Button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 bg-card/50 py-3 text-center">
        <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
          <Shield size={10} />
          Propulsé par Noé Conciergerie • Signature électronique simple
        </p>
      </div>
    </div>
  );
}
