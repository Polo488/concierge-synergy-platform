
import { useState } from 'react';
import { RoleDefinition, ModulePermission, MODULE_LABELS, PERMISSION_LEVELS, PermissionLevel } from '@/types/userManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<RoleDefinition, 'id'>) => void;
  role?: RoleDefinition;
}

const defaultPermissions: ModulePermission = {
  dashboard: 'read', calendar: 'none', properties: 'none', cleaning: 'none',
  maintenance: 'none', inventory: 'none', billing: 'none', qualityStats: 'none',
  guestExperience: 'none', insights: 'none', settings: 'none', moyenneDuree: 'none',
  upsell: 'none', userManagement: 'none',
};

export const RoleFormDialog = ({ open, onOpenChange, onSubmit, role }: RoleFormDialogProps) => {
  const [name, setName] = useState(role?.name || '');
  const [description, setDescription] = useState(role?.description || '');
  const [permissions, setPermissions] = useState<ModulePermission>(role?.permissions || defaultPermissions);

  const handleSubmit = () => {
    onSubmit({ name, description, permissions, isSystem: false, canManageUsers: permissions.userManagement !== 'none' });
    setName(''); setDescription(''); setPermissions(defaultPermissions);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{role ? 'Modifier le rôle' : 'Créer un rôle'}</DialogTitle>
          <DialogDescription>Définissez les permissions pour ce rôle</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Nom</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="space-y-2">
            <Label>Permissions par module</Label>
            <ScrollArea className="h-[300px] border rounded-lg p-3">
              {Object.entries(MODULE_LABELS).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm">{label}</span>
                  <Select value={permissions[key as keyof ModulePermission]} onValueChange={(v: PermissionLevel) => setPermissions({...permissions, [key]: v})}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PERMISSION_LEVELS.map(l => <SelectItem key={l.value} value={l.value}><Badge className={l.color}>{l.label}</Badge></SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSubmit}>{role ? 'Enregistrer' : 'Créer'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
