
import { ManagedUser, RoleDefinition } from '@/types/userManagement';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Shield, Home, Wrench, Save } from 'lucide-react';
import { useState } from 'react';

interface UserDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ManagedUser;
  roles: RoleDefinition[];
  properties: { id: string; name: string }[];
  onUpdateUser: (userId: string, updates: Partial<ManagedUser>) => void;
  onUpdatePropertyAccess: (userId: string, propertyAccess: 'all' | 'selected', selectedProperties: string[]) => void;
  onUpdateOperationalAssignments: (userId: string, propertyIds: string[]) => void;
}

export const UserDetailsSheet = ({
  open, onOpenChange, user, roles, properties,
  onUpdateUser, onUpdatePropertyAccess, onUpdateOperationalAssignments
}: UserDetailsSheetProps) => {
  const [editedUser, setEditedUser] = useState(user);
  const [selectedProps, setSelectedProps] = useState(user.selectedProperties);
  const [assignments, setAssignments] = useState(user.operationalAssignments);

  const handleSaveInfo = () => {
    onUpdateUser(user.id, { name: editedUser.name, email: editedUser.email, phone: editedUser.phone, roleId: editedUser.roleId, roleName: roles.find(r => r.id === editedUser.roleId)?.name || '' });
  };

  const handleSaveAccess = () => {
    onUpdatePropertyAccess(user.id, editedUser.propertyAccess, selectedProps);
  };

  const handleSaveAssignments = () => {
    onUpdateOperationalAssignments(user.id, assignments);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full" />
            {user.name}
          </SheetTitle>
        </SheetHeader>
        <Tabs defaultValue="info" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info"><User className="h-4 w-4" /></TabsTrigger>
            <TabsTrigger value="role"><Shield className="h-4 w-4" /></TabsTrigger>
            <TabsTrigger value="access"><Home className="h-4 w-4" /></TabsTrigger>
            <TabsTrigger value="ops"><Wrench className="h-4 w-4" /></TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div><Label>Nom</Label><Input value={editedUser.name} onChange={(e) => setEditedUser({...editedUser, name: e.target.value})} /></div>
              <div><Label>Email</Label><Input value={editedUser.email} onChange={(e) => setEditedUser({...editedUser, email: e.target.value})} /></div>
              <div><Label>Téléphone</Label><Input value={editedUser.phone || ''} onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})} /></div>
            </div>
            <Button onClick={handleSaveInfo} className="w-full gap-2"><Save className="h-4 w-4" />Enregistrer</Button>
          </TabsContent>
          <TabsContent value="role" className="space-y-4 mt-4">
            <Label>Rôle</Label>
            <Select value={editedUser.roleId} onValueChange={(v) => setEditedUser({...editedUser, roleId: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{roles.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
            </Select>
            <Button onClick={handleSaveInfo} className="w-full gap-2"><Save className="h-4 w-4" />Enregistrer</Button>
          </TabsContent>
          <TabsContent value="access" className="space-y-4 mt-4">
            <Select value={editedUser.propertyAccess} onValueChange={(v: 'all' | 'selected') => setEditedUser({...editedUser, propertyAccess: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les logements</SelectItem>
                <SelectItem value="selected">Sélection personnalisée</SelectItem>
              </SelectContent>
            </Select>
            {editedUser.propertyAccess === 'selected' && (
              <ScrollArea className="h-[200px] border rounded p-2">
                {properties.map(p => (
                  <div key={p.id} className="flex items-center gap-2 p-1">
                    <Checkbox checked={selectedProps.includes(p.id)} onCheckedChange={() => setSelectedProps(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])} />
                    <span className="text-sm">{p.name}</span>
                  </div>
                ))}
              </ScrollArea>
            )}
            <Button onClick={handleSaveAccess} className="w-full gap-2"><Save className="h-4 w-4" />Enregistrer</Button>
          </TabsContent>
          <TabsContent value="ops" className="space-y-4 mt-4">
            {['cleaning', 'maintenance'].includes(user.roleId) ? (
              <>
                <Label>Logements attribués</Label>
                <ScrollArea className="h-[200px] border rounded p-2">
                  {properties.map(p => (
                    <div key={p.id} className="flex items-center gap-2 p-1">
                      <Checkbox checked={assignments.includes(p.id)} onCheckedChange={() => setAssignments(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])} />
                      <span className="text-sm">{p.name}</span>
                    </div>
                  ))}
                </ScrollArea>
                <Button onClick={handleSaveAssignments} className="w-full gap-2"><Save className="h-4 w-4" />Enregistrer</Button>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">Les attributions opérationnelles sont réservées aux agents de ménage et maintenance.</p>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
