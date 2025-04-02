
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, UserRole } from '@/types/roles';
import { Button } from '@/components/ui/button';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { UserPlus, UserCog } from 'lucide-react';
import { getRoleConfig } from '@/utils/roleUtils';

// Mock users for demonstration purposes
const MOCK_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Employee User', email: 'employee@example.com', role: 'employee', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Maintenance Agent', email: 'maintenance@example.com', role: 'maintenance', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'Cleaning Agent', email: 'cleaning@example.com', role: 'cleaning', avatar: 'https://i.pravatar.cc/150?u=4' },
];

const Users = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('employee');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  const handleAddUser = () => {
    if (!newUserName || !newUserEmail || !newUserRole) {
      toast({
        variant: "destructive",
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires.",
      });
      return;
    }

    const newId = (Math.max(...users.map(u => parseInt(u.id))) + 1).toString();
    const newUser: User = {
      id: newId,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      avatar: `https://i.pravatar.cc/150?u=${newId}`,
    };

    setUsers([...users, newUser]);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('employee');
    setAddDialogOpen(false);

    toast({
      title: "Utilisateur ajouté",
      description: `${newUserName} a été ajouté avec le rôle ${getRoleConfig(newUserRole).name}`,
    });
  };

  const handleEditUser = () => {
    if (!editingUser) return;
    
    const updatedUsers = users.map(u => {
      if (u.id === editingUser.id) {
        return editingUser;
      }
      return u;
    });
    
    setUsers(updatedUsers);
    setEditingUser(null);
    setEditDialogOpen(false);
    
    toast({
      title: "Utilisateur modifié",
      description: `Les informations de ${editingUser.name} ont été mises à jour`,
    });
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    if (editingUser) {
      setEditingUser({
        ...editingUser,
        role: newRole
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des utilisateurs</h1>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <UserPlus size={16} />
              Ajouter un utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un utilisateur</DialogTitle>
              <DialogDescription>
                Créez un nouvel utilisateur et définissez son rôle.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nom
                </Label>
                <Input
                  id="name"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Rôle
                </Label>
                <Select
                  value={newUserRole}
                  onValueChange={(value: UserRole) => setNewUserRole(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="employee">Employé</SelectItem>
                    <SelectItem value="maintenance">Agent de maintenance</SelectItem>
                    <SelectItem value="cleaning">Agent de ménage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddUser}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <DashboardCard title="Liste des utilisateurs">
        <div className="space-y-4">
          <div className="border rounded-md">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.avatar}
                            alt={user.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium">{user.name}</div>
                          {currentUser?.id === user.id && (
                            <div className="text-xs text-muted-foreground">(Vous)</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'employee' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'maintenance' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {getRoleConfig(user.role).name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Dialog open={editDialogOpen && editingUser?.id === user.id} onOpenChange={(open) => {
                        if (!open) setEditingUser(null);
                        setEditDialogOpen(open);
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setEditingUser(user)}
                          >
                            <UserCog className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Modifier l'utilisateur</DialogTitle>
                            <DialogDescription>
                              Modifiez les informations de {user.name}.
                            </DialogDescription>
                          </DialogHeader>
                          {editingUser && (
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-name" className="text-right">
                                  Nom
                                </Label>
                                <Input
                                  id="edit-name"
                                  value={editingUser.name}
                                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-email" className="text-right">
                                  Email
                                </Label>
                                <Input
                                  id="edit-email"
                                  type="email"
                                  value={editingUser.email}
                                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-role" className="text-right">
                                  Rôle
                                </Label>
                                <Select
                                  value={editingUser.role}
                                  onValueChange={(value: UserRole) => handleRoleChange(editingUser.id, value)}
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Sélectionner un rôle" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="admin">Administrateur</SelectItem>
                                    <SelectItem value="employee">Employé</SelectItem>
                                    <SelectItem value="maintenance">Agent de maintenance</SelectItem>
                                    <SelectItem value="cleaning">Agent de ménage</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button variant="outline" onClick={() => {
                              setEditingUser(null);
                              setEditDialogOpen(false);
                            }}>
                              Annuler
                            </Button>
                            <Button onClick={handleEditUser}>Enregistrer</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};

export default Users;
