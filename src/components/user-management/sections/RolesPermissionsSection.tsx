
import { useState } from 'react';
import { RoleDefinition, ModulePermission, MODULE_LABELS, PERMISSION_LEVELS, PermissionLevel } from '@/types/userManagement';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Shield,
  ChevronDown,
  ChevronRight,
  Lock
} from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { RoleFormDialog } from '../dialogs/RoleFormDialog';

interface RolesPermissionsSectionProps {
  roles: RoleDefinition[];
  addRole: (roleData: Omit<RoleDefinition, 'id'>) => RoleDefinition;
  updateRole: (roleId: string, updates: Partial<RoleDefinition>) => void;
  deleteRole: (roleId: string) => boolean;
}

export const RolesPermissionsSection = ({
  roles,
  addRole,
  updateRole,
  deleteRole,
}: RolesPermissionsSectionProps) => {
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null);

  const getPermissionBadge = (level: PermissionLevel) => {
    const config = PERMISSION_LEVELS.find(p => p.value === level);
    if (!config) return null;
    return (
      <Badge className={`${config.color} hover:opacity-80`}>
        {config.label}
      </Badge>
    );
  };

  const handlePermissionChange = (roleId: string, module: keyof ModulePermission, value: PermissionLevel) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;
    
    updateRole(roleId, {
      permissions: {
        ...role.permissions,
        [module]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <DashboardCard title="Rôles & Permissions">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground -mt-2 mb-2">Définissez les droits d'accès pour chaque rôle</p>
          {/* Add Role Button */}
          <div className="flex justify-end">
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Créer un rôle
            </Button>
          </div>

          {/* Roles List */}
          <div className="space-y-3">
            {roles.map(role => (
              <Collapsible 
                key={role.id}
                open={expandedRole === role.id}
                onOpenChange={(open) => setExpandedRole(open ? role.id : null)}
              >
                <div className="border rounded-lg">
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4 hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        {expandedRole === role.id ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <Shield className="h-5 w-5 text-primary" />
                        <div className="text-left">
                          <div className="font-medium flex items-center gap-2">
                            {role.name}
                            {role.isSystem && (
                              <Lock className="h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{role.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setEditingRole(role)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {!role.isSystem && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteRole(role.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="border-t p-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[250px]">Module</TableHead>
                            <TableHead>Niveau d'accès</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(MODULE_LABELS).map(([key, label]) => (
                            <TableRow key={key}>
                              <TableCell className="font-medium">{label}</TableCell>
                              <TableCell>
                                <Select
                                  value={role.permissions[key as keyof ModulePermission]}
                                  onValueChange={(value: PermissionLevel) => 
                                    handlePermissionChange(role.id, key as keyof ModulePermission, value)
                                  }
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue>
                                      {getPermissionBadge(role.permissions[key as keyof ModulePermission])}
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {PERMISSION_LEVELS.map(level => (
                                      <SelectItem key={level.value} value={level.value}>
                                        <Badge className={`${level.color}`}>{level.label}</Badge>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        </div>
      </DashboardCard>

      {/* Add Role Dialog */}
      <RoleFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={(data) => {
          addRole(data);
          setIsAddDialogOpen(false);
        }}
      />

      {/* Edit Role Dialog */}
      {editingRole && (
        <RoleFormDialog
          open={!!editingRole}
          onOpenChange={(open) => !open && setEditingRole(null)}
          role={editingRole}
          onSubmit={(data) => {
            updateRole(editingRole.id, data);
            setEditingRole(null);
          }}
        />
      )}
    </div>
  );
};
