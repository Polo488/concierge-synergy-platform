
import { useState } from 'react';
import { SignatureTemplate, SignatureZone, SignatureZoneType, SignatureRole, ZONE_TYPE_CONFIG, FIELD_KEY_OPTIONS } from '@/types/signature';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, PenTool, Type, Calendar, AlignLeft, Plus, Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { DocumentContentEditor } from './DocumentContentEditor';

interface Props {
  template: SignatureTemplate;
  onBack: () => void;
  onAddZone: (templateId: string, zone: Omit<SignatureZone, 'id' | 'templateId'>) => any;
  onUpdateZone: (templateId: string, zoneId: string, updates: Partial<SignatureZone>) => any;
  onRemoveZone: (templateId: string, zoneId: string) => any;
  onUpdateTemplate?: (id: string, updates: Partial<SignatureTemplate>) => any;
}

const zoneIcons: Record<SignatureZoneType, React.ElementType> = {
  signature: PenTool,
  initials: Type,
  date: Calendar,
  text: AlignLeft,
};

export function SignatureZoneEditor({ template, onBack, onAddZone, onUpdateZone, onRemoveZone, onUpdateTemplate }: Props) {
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

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
      xPosition: 0,
      yPosition: 0,
      width: d.width || 200,
      height: d.height || 50,
      isRequired: true,
      sortOrder: template.zones.length + 1,
    });
    toast.success(`Zone "${ZONE_TYPE_CONFIG[type].label}" ajoutée`);
  };

  const handleContentChange = (content: string) => {
    onUpdateTemplate?.(template.id, { documentContent: content });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={18} />
        </Button>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{template.name}</h3>
          <p className="text-xs text-muted-foreground">
            Éditez le contenu du document et ajoutez des variables dynamiques
          </p>
        </div>
      </div>

      {/* Document content editor */}
      <DocumentContentEditor
        content={template.documentContent || ''}
        onChange={handleContentChange}
      />

      {/* Signature zones section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="border border-border/50">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-xs font-medium">Zones de signature en bas de document</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-[10px] text-muted-foreground mb-3">
                Ces zones apparaîtront en bas du document lors de la signature. Elles ne sont pas dans le corps du texte.
              </p>
              {template.zones.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Aucune zone ajoutée. Utilisez les boutons à droite.</p>
              ) : (
                <div className="space-y-1">
                  {template.zones.sort((a, b) => a.sortOrder - b.sortOrder).map(zone => {
                    const Icon = zoneIcons[zone.zoneType];
                    return (
                      <div
                        key={zone.id}
                        className={cn(
                          'flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-accent/50 text-xs',
                          zone.id === selectedZoneId && 'bg-accent'
                        )}
                        onClick={() => setSelectedZoneId(zone.id)}
                      >
                        <Icon size={14} className={ZONE_TYPE_CONFIG[zone.zoneType].color} />
                        <span className="flex-1 truncate font-medium">{zone.label}</span>
                        <Badge variant="outline" className="text-[9px] h-5">
                          {ZONE_TYPE_CONFIG[zone.zoneType].label}
                        </Badge>
                        <Badge variant="secondary" className="text-[9px] h-5">
                          {zone.role === 'owner' ? 'Propriétaire' : 'Conciergerie'}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); onRemoveZone(template.id, zone.id); }}>
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: add zones + properties */}
        <div className="space-y-3">
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
                {(selectedZone.zoneType === 'text' || selectedZone.zoneType === 'date') && (
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
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
