
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Shield, Home, Wrench } from 'lucide-react';
import { UsersListSection } from './sections/UsersListSection';
import { RolesPermissionsSection } from './sections/RolesPermissionsSection';
import { PropertyAccessSection } from './sections/PropertyAccessSection';
import { OperationalAssignmentsSection } from './sections/OperationalAssignmentsSection';
import { useUserManagement } from '@/hooks/useUserManagement';

export const UserManagementTabs = () => {
  const userManagement = useUserManagement();

  return (
    <Tabs defaultValue="users" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-6">
        <TabsTrigger value="users" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Utilisateurs</span>
        </TabsTrigger>
        <TabsTrigger value="roles" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">Rôles & Permissions</span>
        </TabsTrigger>
        <TabsTrigger value="properties" className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Accès Logements</span>
        </TabsTrigger>
        <TabsTrigger value="operations" className="flex items-center gap-2">
          <Wrench className="h-4 w-4" />
          <span className="hidden sm:inline">Attributions</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="users">
        <UsersListSection {...userManagement} />
      </TabsContent>

      <TabsContent value="roles">
        <RolesPermissionsSection {...userManagement} />
      </TabsContent>

      <TabsContent value="properties">
        <PropertyAccessSection {...userManagement} />
      </TabsContent>

      <TabsContent value="operations">
        <OperationalAssignmentsSection {...userManagement} />
      </TabsContent>
    </Tabs>
  );
};
