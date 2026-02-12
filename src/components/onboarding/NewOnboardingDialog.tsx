
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface NewOnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    propertyName: string; propertyAddress: string; ownerName: string;
    ownerEmail: string; ownerPhone: string; source: string; city: string;
    assigneeName: string;
  }) => void;
}

export function NewOnboardingDialog({ open, onOpenChange, onSubmit }: NewOnboardingDialogProps) {
  const [form, setForm] = useState({
    propertyName: '', propertyAddress: '', ownerName: '',
    ownerEmail: '', ownerPhone: '', source: 'Recommandation',
    city: 'Lyon', assigneeName: '',
  });

  const handleSubmit = () => {
    if (!form.propertyName || !form.ownerName || !form.assigneeName) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    onSubmit(form);
    setForm({ propertyName: '', propertyAddress: '', ownerName: '', ownerEmail: '', ownerPhone: '', source: 'Recommandation', city: 'Lyon', assigneeName: '' });
    onOpenChange(false);
    toast.success('Onboarding créé avec succès');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nouvel onboarding</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Nom du bien *</Label>
              <Input value={form.propertyName} onChange={e => setForm(f => ({ ...f, propertyName: e.target.value }))} placeholder="Apt Bellecour 3P" />
            </div>
            <div className="space-y-1.5">
              <Label>Ville</Label>
              <Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Lyon" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Adresse</Label>
            <Input value={form.propertyAddress} onChange={e => setForm(f => ({ ...f, propertyAddress: e.target.value }))} placeholder="12 Place Bellecour, Lyon 2e" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Nom du propriétaire *</Label>
              <Input value={form.ownerName} onChange={e => setForm(f => ({ ...f, ownerName: e.target.value }))} placeholder="Marie Dupont" />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={form.ownerEmail} onChange={e => setForm(f => ({ ...f, ownerEmail: e.target.value }))} placeholder="marie@email.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Téléphone</Label>
              <Input value={form.ownerPhone} onChange={e => setForm(f => ({ ...f, ownerPhone: e.target.value }))} placeholder="06 12 34 56 78" />
            </div>
            <div className="space-y-1.5">
              <Label>Source</Label>
              <Select value={form.source} onValueChange={v => setForm(f => ({ ...f, source: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Recommandation">Recommandation</SelectItem>
                  <SelectItem value="Site web">Site web</SelectItem>
                  <SelectItem value="Réseau">Réseau</SelectItem>
                  <SelectItem value="Salon">Salon</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Responsable assigné *</Label>
            <Select value={form.assigneeName} onValueChange={v => setForm(f => ({ ...f, assigneeName: v }))}>
              <SelectTrigger><SelectValue placeholder="Choisir un responsable" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Sophie Martin">Sophie Martin</SelectItem>
                <SelectItem value="Thomas Bernard">Thomas Bernard</SelectItem>
                <SelectItem value="Lucas Petit">Lucas Petit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSubmit}>Créer l'onboarding</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
