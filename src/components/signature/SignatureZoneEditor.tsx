
import { useState, useRef, useEffect } from 'react';
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
  ArrowLeft, PenTool, Type, Calendar, AlignLeft, Plus, Trash2, 
  Upload, ChevronLeft, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { PDFPageRenderer } from './PDFPageRenderer';
import { supabase } from '@/integrations/supabase/client';

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

const CANVAS_WIDTH = 595;
const CANVAS_HEIGHT = 842;

export function SignatureZoneEditor({ template, onBack, onAddZone, onUpdateZone, onRemoveZone, onUpdateTemplate }: Props) {
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [draggingZone, setDraggingZone] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(595);

  useEffect(() => {
    const el = canvasContainerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect.width;
      if (w) setContainerWidth(Math.min(w - 32, 700));
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleUploadPDF = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      toast.error('Seuls les fichiers PDF sont acceptés');
      return;
    }
    setUploading(true);
    const fileName = `templates/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const { error } = await supabase.storage.from('signature-documents').upload(fileName, file, { contentType: 'application/pdf' });
    if (error) {
      toast.error("Erreur lors de l'upload");
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from('signature-documents').getPublicUrl(fileName);
    onUpdateTemplate?.(template.id, { documentUrl: urlData.publicUrl });
    setUploading(false);
    toast.success('PDF importé avec succès');
  };

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
      pageNumber: currentPage,
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

  const pageZones = template.zones.filter(z => z.pageNumber === currentPage);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={18} />
        </Button>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{template.name}</h3>
          <p className="text-xs text-muted-foreground">
            {template.documentUrl 
              ? 'Placez les zones sur le document PDF importé'
              : 'Importez un PDF puis placez les zones interactives'}
          </p>
        </div>
        {/* Upload / replace PDF */}
        <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleUploadPDF} />
        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          <Upload size={14} className="mr-1.5" />
          {uploading ? 'Upload...' : template.documentUrl ? 'Remplacer le PDF' : 'Importer un PDF'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Canvas */}
        <div className="lg:col-span-2" ref={canvasContainerRef}>
          <Card className="border border-border/50 overflow-hidden">
            <CardContent className="p-4">
              {/* Page navigation */}
              {template.documentUrl && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}>
                    <ChevronLeft size={14} />
                  </Button>
                  <span className="text-xs text-muted-foreground">Page {currentPage} / {totalPages}</span>
                  <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                    <ChevronRight size={14} />
                  </Button>
                </div>
              )}

              <div 
                className="relative bg-white border border-border rounded-lg shadow-inner mx-auto select-none overflow-hidden"
                style={{ aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}`, maxWidth: '100%' }}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
              >
                {/* PDF background or placeholder */}
                {template.documentUrl ? (
                  <div className="absolute inset-0 pointer-events-none">
                    <PDFPageRenderer
                      documentUrl={template.documentUrl}
                      pageNumber={currentPage}
                      width={containerWidth}
                      onPageCount={setTotalPages}
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <Upload size={32} className="text-muted-foreground/30 mb-2" />
                    <p className="text-xs text-muted-foreground/50">Importez un PDF pour commencer</p>
                  </div>
                )}

                {/* Zones */}
                {pageZones.map(zone => {
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
                        onClick={() => { setSelectedZoneId(zone.id); setCurrentPage(zone.pageNumber); }}
                      >
                        <Icon size={12} className={ZONE_TYPE_CONFIG[zone.zoneType].color} />
                        <span className="flex-1 truncate">{zone.label}</span>
                        {totalPages > 1 && (
                          <span className="text-[9px] text-muted-foreground">p.{zone.pageNumber}</span>
                        )}
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
                    <p className="text-[9px] text-muted-foreground">
                      Le champ sera rempli automatiquement avec les données du propriétaire
                    </p>
                  </div>
                )}
                {totalPages > 1 && (
                  <div className="space-y-1">
                    <Label className="text-[10px]">Page</Label>
                    <Select value={selectedZone.pageNumber.toString()} onValueChange={v => onUpdateZone(template.id, selectedZone.id, { pageNumber: parseInt(v) })}>
                      <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: totalPages }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>Page {i + 1}</SelectItem>
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
