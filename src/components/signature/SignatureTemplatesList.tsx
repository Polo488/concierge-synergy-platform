
import { useState } from 'react';
import { SignatureTemplate } from '@/types/signature';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FileText, Plus, PenTool, Trash2, Edit, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  templates: SignatureTemplate[];
  onCreateTemplate: (name: string, description?: string) => any;
  onDeleteTemplate: (id: string) => any;
  onSelectTemplate: (template: SignatureTemplate) => void;
}

export function SignatureTemplatesList({ templates, onCreateTemplate, onDeleteTemplate, onSelectTemplate }: Props) {
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleCreate = () => {
    if (!newName.trim()) return;
    onCreateTemplate(newName.trim(), newDesc.trim() || undefined);
    setShowCreate(false);
    setNewName('');
    setNewDesc('');
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

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Annuler</Button>
            <Button onClick={handleCreate} disabled={!newName.trim()}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
