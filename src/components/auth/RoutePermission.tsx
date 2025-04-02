
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { getRoleConfig } from '@/utils/roleUtils';

interface RoutePermissionProps {
  children: React.ReactNode;
  permission: keyof ReturnType<typeof getRoleConfig>['permissions'];
}

export const RoutePermission = ({ children, permission }: RoutePermissionProps) => {
  const { hasPermission, user } = useAuth();

  // If user doesn't have permission, redirect to their default route
  if (!hasPermission(permission)) {
    const defaultRoute = user ? getRoleConfig(user.role).defaultRoute : '/';
    return <Navigate to={defaultRoute} replace />;
  }

  // If they have permission, render the children
  return <>{children}</>;
};
