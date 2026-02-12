
import { useState, useRef } from 'react';
import { SignatureTemplate } from '@/types/signature';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FileText, Plus, PenTool, Trash2, Edit, Eye, Upload, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  templates: SignatureTemplate[];
  onCreateTemplate: (name: string, description?: string, documentUrl?: string) => any;
  onDeleteTemplate: (id: string) => any;
  onSelectTemplate: (template: SignatureTemplate) => void;
  onUpdateTemplate?: (id: string, updates: Partial<SignatureTemplate>) => any;
}

export function SignatureTemplatesList({ templates, onCreateTemplate, onDeleteTemplate, onSelectTemplate, onUpdateTemplate }: Props) {
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Seuls les fichiers PDF sont acceptés');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error('Le fichier ne doit pas dépasser 20 Mo');
      return;
    }
    setUploadedFile(file);
  };

  const uploadPDF = async (file: File): Promise<string | null> => {
    const fileName = `templates/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const { error } = await supabase.storage.from('signature-documents').upload(fileName, file, {
      contentType: 'application/pdf',
    });
    if (error) {
      console.error('Upload error:', error);
      toast.error("Erreur lors de l'upload du PDF");
      return null;
    }
    const { data: urlData } = supabase.storage.from('signature-documents').getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setUploading(true);
    let documentUrl: string | undefined;
    if (uploadedFile) {
      const url = await uploadPDF(uploadedFile);
      if (url) documentUrl = url;
    }
    await onCreateTemplate(newName.trim(), newDesc.trim() || undefined, documentUrl);
    setShowCreate(false);
    setNewName('');
    setNewDesc('');
    setUploadedFile(null);
    setUploading(false);
    toast.success('Template créé');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-primary" />
          <h3 className="font-semibold text-foreground">Modèles de documents</h3>
        </div>
        <Button onClick={() => setShowCreate(true)} size="sm">
          <Plus size={14} className="mr-1" />
          Nouveau modèle
        </Button>
      </div>

      {templates.length === 0 ? (
        <Card className="border border-dashed border-border/50">
          <CardContent className="p-8 text-center">
            <FileText size={32} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Aucun modèle de document. Créez votre premier template.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {templates.map(tpl => (
            <Card key={tpl.id} className="border border-border/50 hover:border-primary/30 transition-colors cursor-pointer" onClick={() => onSelectTemplate(tpl)}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium text-foreground text-sm">{tpl.name}</h4>
                    {tpl.description && <p className="text-xs text-muted-foreground">{tpl.description}</p>}
                  </div>
                  <Badge variant="outline" className={tpl.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}>
                    {tpl.isActive ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><PenTool size={10} />{tpl.zones.filter(z => z.zoneType === 'signature').length} signatures</span>
                  <span>{tpl.zones.length} zones au total</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={(e) => { e.stopPropagation(); onSelectTemplate(tpl); }}>
                    <Edit size={12} className="mr-1" />
                    Éditer
                  </Button>
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onDeleteTemplate(tpl.id); toast.success('Template supprimé'); }}>
                    <Trash2 size={12} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={v => { setShowCreate(v); if (!v) { setUploadedFile(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nouveau modèle de document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nom du modèle</Label>
              <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="ex: Mandat de gestion standard" />
            </div>
            <div className="space-y-1.5">
              <Label>Description (optionnel)</Label>
              <Textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={2} placeholder="Description du type de document..." />
            </div>
            <div className="space-y-1.5">
              <Label>Document PDF</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileSelect}
              />
              {uploadedFile ? (
                <div className="flex items-center gap-2 p-3 rounded-lg border border-emerald-200 bg-emerald-500/5">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span className="text-sm text-foreground flex-1 truncate">{uploadedFile.name}</span>
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setUploadedFile(null)}>
                    Supprimer
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full h-20 border-dashed flex flex-col gap-1"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={18} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Cliquez pour importer un PDF</span>
                </Button>
              )}
              <p className="text-[10px] text-muted-foreground">
                Importez votre mandat de gestion en PDF. Vous pourrez ensuite placer les zones de signature et les champs à remplir automatiquement.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Annuler</Button>
            <Button onClick={handleCreate} disabled={!newName.trim() || uploading}>
              {uploading ? 'Upload en cours...' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
