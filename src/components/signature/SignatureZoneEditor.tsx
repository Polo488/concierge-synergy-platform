
import { useState } from 'react';
import { SignatureTemplate, SignatureZone, SignatureZoneType, SignatureRole, ZONE_TYPE_CONFIG, FIELD_KEY_OPTIONS } from '@/types/signature';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, PenTool, Type, Calendar, AlignLeft, Plus, Trash2, 
  GripVertical, Move, Eye, FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Props {
  template: SignatureTemplate;
  onBack: () => void;
  onAddZone: (templateId: string, zone: Omit<SignatureZone, 'id' | 'templateId'>) => any;
  onUpdateZone: (templateId: string, zoneId: string, updates: Partial<SignatureZone>) => any;
  onRemoveZone: (templateId: string, zoneId: string) => any;
}

const zoneIcons: Record<SignatureZoneType, React.ElementType> = {
  signature: PenTool,
  initials: Type,
  date: Calendar,
  text: AlignLeft,
};

const CANVAS_WIDTH = 595; // A4 proportional
const CANVAS_HEIGHT = 842;

export function SignatureZoneEditor({ template, onBack, onAddZone, onUpdateZone, onRemoveZone }: Props) {
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [draggingZone, setDraggingZone] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const selectedZone = template.zones.find(z => z.id === selectedZoneId);

  const handleAddZone = (type: SignatureZoneType) => {
    const defaults: Record<SignatureZoneType, Partial<SignatureZone>> = {
      signature: { width: 200, height: 70, label: 'Signature' },
      initials: { width: 60, height: 40, label: 'Initiales' },
      date: { width: 150, height: 30, label: 'Date' },
      text: { width: 200, height: 30, label: 'Champ texte' },
    };
    const d = defaults[type];
    onAddZone(template.id, {
      zoneType: type,
      label: d.label || 'Zone',
      role: 'owner',
      pageNumber: 1,
      xPosition: 50 + Math.random() * 200,
      yPosition: 100 + Math.random() * 400,
      width: d.width || 200,
      height: d.height || 50,
      isRequired: true,
      sortOrder: template.zones.length + 1,
    });
    toast.success(`Zone "${ZONE_TYPE_CONFIG[type].label}" ajoutée`);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent, zoneId: string) => {
    e.stopPropagation();
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!rect) return;
    const zone = template.zones.find(z => z.id === zoneId);
    if (!zone) return;
    const scale = rect.width / CANVAS_WIDTH;
    setDraggingZone(zoneId);
    setDragOffset({
      x: e.clientX - zone.xPosition * scale - rect.left,
      y: e.clientY - zone.yPosition * scale - rect.top,
    });
    setSelectedZoneId(zoneId);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!draggingZone) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scale = rect.width / CANVAS_WIDTH;
    const x = Math.max(0, Math.min(CANVAS_WIDTH - 50, (e.clientX - rect.left - dragOffset.x) / scale));
    const y = Math.max(0, Math.min(CANVAS_HEIGHT - 30, (e.clientY - rect.top - dragOffset.y) / scale));
    onUpdateZone(template.id, draggingZone, { xPosition: Math.round(x), yPosition: Math.round(y) });
  };

  const handleCanvasMouseUp = () => {
    setDraggingZone(null);
  };

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
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h3 className="font-semibold text-foreground">{template.name}</h3>
          <p className="text-xs text-muted-foreground">Placez les zones interactives sur le document</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Canvas */}
        <div className="lg:col-span-2">
          <Card className="border border-border/50 overflow-hidden">
            <CardContent className="p-4">
              <div 
                className="relative bg-white border border-border rounded-lg shadow-inner mx-auto select-none"
                style={{ aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}`, maxWidth: '100%' }}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
              >
                {/* Document content background */}
                <div className="absolute inset-0 p-8 pointer-events-none opacity-30">
                  <div className="text-center mb-8">
                    <p className="text-sm font-bold text-foreground">MANDAT DE GESTION LOCATIVE</p>
                  </div>
                  <div className="space-y-1.5 text-[7px] text-muted-foreground leading-relaxed">
                    <p>Entre les soussignés :</p>
                    <p className="mt-2">Le Mandant : _________________________</p>
                    <p>Adresse du bien : _________________________</p>
                    <p className="mt-3">Et :</p>
                    <p>La société Noé Conciergerie, ci-après dénommée le Mandataire.</p>
                    <p className="mt-3">Article 1 – Objet du mandat</p>
                    <p>Le mandant confie au mandataire la gestion locative...</p>
                    <p className="mt-2">Article 2 – Commission</p>
                    <p>Le mandataire percevra une commission de ___% sur les revenus locatifs bruts.</p>
                    <p className="mt-2">Article 3 – Durée</p>
                    <p>Le présent mandat est conclu pour une durée d'un an renouvelable.</p>
                    <p className="mt-2">Article 4 – Obligations</p>
                    <p>Gestion des réservations, accueil des voyageurs, coordination du ménage...</p>
                    <p className="mt-6">Fait en deux exemplaires.</p>
                  </div>
                </div>

                {/* Zones */}
                {template.zones.map(zone => {
                  const Icon = zoneIcons[zone.zoneType];
                  const colorKey = `${zone.zoneType}-${zone.role}`;
                  const colorClass = zoneColorMap[colorKey] || 'border-border bg-muted/50';
                  const isSelected = zone.id === selectedZoneId;

                  return (
                    <div
                      key={zone.id}
                      className={cn(
                        'absolute border-2 border-dashed rounded-md flex items-center justify-center gap-1 cursor-move transition-shadow text-[8px] font-medium',
                        colorClass,
                        isSelected && 'ring-2 ring-primary ring-offset-1 shadow-lg',
                        draggingZone === zone.id && 'opacity-80'
                      )}
                      style={{
                        left: `${(zone.xPosition / CANVAS_WIDTH) * 100}%`,
                        top: `${(zone.yPosition / CANVAS_HEIGHT) * 100}%`,
                        width: `${(zone.width / CANVAS_WIDTH) * 100}%`,
                        height: `${(zone.height / CANVAS_HEIGHT) * 100}%`,
                      }}
                      onMouseDown={(e) => handleCanvasMouseDown(e, zone.id)}
                      onClick={(e) => { e.stopPropagation(); setSelectedZoneId(zone.id); }}
                    >
                      <Icon size={10} />
                      <span className="truncate">{zone.label}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          {/* Add zone buttons */}
          <Card className="border border-border/50">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-xs font-medium">Ajouter une zone</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 grid grid-cols-2 gap-2">
              {(Object.keys(ZONE_TYPE_CONFIG) as SignatureZoneType[]).map(type => {
                const cfg = ZONE_TYPE_CONFIG[type];
                const Icon = zoneIcons[type];
                return (
                  <Button key={type} variant="outline" size="sm" className="justify-start text-xs h-8" onClick={() => handleAddZone(type)}>
                    <Icon size={12} className={cn('mr-1', cfg.color)} />
                    {cfg.label}
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Zone list */}
          <Card className="border border-border/50">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-xs font-medium">{template.zones.length} zones</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-40">
                <div className="p-2 space-y-1">
                  {template.zones.sort((a, b) => a.sortOrder - b.sortOrder).map(zone => {
                    const Icon = zoneIcons[zone.zoneType];
                    return (
                      <div 
                        key={zone.id}
                        className={cn(
                          'flex items-center gap-2 p-1.5 rounded-md cursor-pointer hover:bg-accent/50 text-xs',
                          zone.id === selectedZoneId && 'bg-accent'
                        )}
                        onClick={() => setSelectedZoneId(zone.id)}
                      >
                        <Icon size={12} className={ZONE_TYPE_CONFIG[zone.zoneType].color} />
                        <span className="flex-1 truncate">{zone.label}</span>
                        <Badge variant="secondary" className="text-[9px] h-4 py-0">
                          {zone.role === 'owner' ? 'Prop.' : 'Conc.'}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={(e) => { e.stopPropagation(); onRemoveZone(template.id, zone.id); }}>
                          <Trash2 size={10} />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Selected zone properties */}
          {selectedZone && (
            <Card className="border border-primary/30">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-xs font-medium">Propriétés de la zone</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-3">
                <div className="space-y-1">
                  <Label className="text-[10px]">Libellé</Label>
                  <Input value={selectedZone.label} onChange={e => onUpdateZone(template.id, selectedZone.id, { label: e.target.value })} className="h-7 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">Assigné à</Label>
                  <Select value={selectedZone.role} onValueChange={(v: SignatureRole) => onUpdateZone(template.id, selectedZone.id, { role: v })}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Propriétaire</SelectItem>
                      <SelectItem value="conciergerie">Conciergerie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {selectedZone.zoneType === 'text' && (
                  <div className="space-y-1">
                    <Label className="text-[10px]">Pré-remplissage auto</Label>
                    <Select value={selectedZone.fieldKey || 'none'} onValueChange={v => onUpdateZone(template.id, selectedZone.id, { fieldKey: v === 'none' ? undefined : v })}>
                      <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Aucun</SelectItem>
                        {FIELD_KEY_OPTIONS.map(f => (
                          <SelectItem key={f.key} value={f.key}>{f.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <Label className="text-[10px]">Obligatoire</Label>
                  <Switch checked={selectedZone.isRequired} onCheckedChange={v => onUpdateZone(template.id, selectedZone.id, { isRequired: v })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[10px]">Largeur</Label>
                    <Input type="number" value={selectedZone.width} onChange={e => onUpdateZone(template.id, selectedZone.id, { width: +e.target.value })} className="h-7 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px]">Hauteur</Label>
                    <Input type="number" value={selectedZone.height} onChange={e => onUpdateZone(template.id, selectedZone.id, { height: +e.target.value })} className="h-7 text-xs" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
