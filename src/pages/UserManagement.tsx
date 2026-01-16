
import { UserManagementTabs } from '@/components/user-management/UserManagementTabs';
import { Shield } from 'lucide-react';

const UserManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          Gestion des utilisateurs
        </h1>
        <p className="text-muted-foreground mt-1">
          Administrez les utilisateurs, rôles, accès et attributions opérationnelles
        </p>
      </div>

      <UserManagementTabs />
    </div>
  );
};

export default UserManagement;
