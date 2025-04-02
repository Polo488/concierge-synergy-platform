
export type UserRole = 'admin' | 'employee' | 'maintenance' | 'cleaning';

export interface PermissionMap {
  properties: boolean;
  inventory: boolean;
  maintenance: boolean;
  cleaning: boolean;
  calendar: boolean;
  billing: boolean;
  moyenneDuree: boolean;
  upsell: boolean;
  users: boolean;
}

export interface RoleDefinition {
  name: string;
  permissions: PermissionMap;
  defaultRoute: string;
  canManageUsers: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}
