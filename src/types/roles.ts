
export type UserRole = 'admin' | 'supervisor' | 'cityManager' | 'employee' | 'maintenance' | 'cleaning';

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
  guestExperience: boolean;
  agenda: boolean;
  messaging: boolean;
  hrPlanning: boolean;
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
