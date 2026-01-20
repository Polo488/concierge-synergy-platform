
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '@/types/roles';
import { getRoleConfig } from '@/utils/roleUtils';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  updateUserRole: (userId: string, newRole: UserRole) => Promise<void>;
  getCurrentUserPermissions: () => Record<string, boolean>;
  hasPermission: (permission: keyof ReturnType<typeof getRoleConfig>['permissions']) => boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Marie Dupont', email: 'supervisor@example.com', role: 'supervisor', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Jean Martin', email: 'citymanager@example.com', role: 'cityManager', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'Employee User', email: 'employee@example.com', role: 'employee', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', name: 'Maintenance Agent', email: 'maintenance@example.com', role: 'maintenance', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: '6', name: 'Cleaning Agent', email: 'cleaning@example.com', role: 'cleaning', avatar: 'https://i.pravatar.cc/150?u=6' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for saved session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Redirect based on role
  useEffect(() => {
    if (user) {
      const roleConfig = getRoleConfig(user.role);
      const currentPath = window.location.pathname;

      // Check if user has permission for current path
      const hasPermissionForCurrentPath = Object.entries(roleConfig.permissions).some(
        ([key, hasPermission]) => {
          if (!hasPermission) return false;
          
          if (key === 'properties' && (currentPath === '/properties' || currentPath === '/insights')) return true;
          if (key === 'inventory' && currentPath === '/inventory') return true;
          if (key === 'maintenance' && currentPath === '/maintenance') return true;
          if (key === 'cleaning' && (currentPath === '/cleaning' || currentPath === '/quality-stats')) return true;
          if (key === 'calendar' && currentPath === '/calendar') return true;
          if (key === 'billing' && currentPath === '/billing') return true;
          if (key === 'moyenneDuree' && currentPath === '/moyenne-duree') return true;
          if (key === 'upsell' && currentPath === '/upsell') return true;
          if (key === 'users' && (currentPath === '/users' || currentPath === '/user-management')) return true;
          if (key === 'guestExperience' && currentPath === '/guest-experience') return true;
          if (key === 'agenda' && currentPath.startsWith('/agenda')) return true;
          
          return currentPath === '/';
        }
      );
      
      // If user doesn't have permission for current page or is at root, redirect to default page
      if (!hasPermissionForCurrentPath || currentPath === '/') {
        navigate(roleConfig.defaultRoute);
      }
    }
  }, [user, navigate]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock login - in a real app, you'd validate with an API
      const foundUser = MOCK_USERS.find(u => u.email === email);
      if (foundUser) {
        // Simulate successful login
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        
        // Get role configuration
        const roleConfig = getRoleConfig(foundUser.role);
        
        // Redirect to the default route for this role
        navigate(roleConfig.defaultRoute);
        
        toast({
          title: "Connexion réussie",
          description: `Bienvenue, ${foundUser.name}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Une erreur est survenue lors de la tentative de connexion",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    setLoading(true);
    try {
      // Mock register - in a real app, you'd call an API
      // Create new mock user with incremented ID
      const newId = (Math.max(...MOCK_USERS.map(u => parseInt(u.id))) + 1).toString();
      const newUser: User = {
        id: newId,
        name,
        email,
        role,
        avatar: `https://i.pravatar.cc/150?u=${newId}`,
      };
      
      // Add to mock users array (in real app, this would be DB)
      MOCK_USERS.push(newUser);
      
      toast({
        title: "Utilisateur créé",
        description: `${name} a été ajouté avec succès avec le rôle ${role}`,
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Erreur d'enregistrement",
        description: "Une erreur est survenue lors de la création de l'utilisateur",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    setLoading(true);
    try {
      // Find user in mock data and update
      const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        MOCK_USERS[userIndex].role = newRole;
        
        // If updating the current user, update the session
        if (user && user.id === userId) {
          const updatedUser = { ...user, role: newRole };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          // Redirect to the new default route
          const roleConfig = getRoleConfig(newRole);
          navigate(roleConfig.defaultRoute);
        }
        
        toast({
          title: "Rôle mis à jour",
          description: `Le rôle de l'utilisateur a été modifié avec succès`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Utilisateur non trouvé",
        });
      }
    } catch (error) {
      console.error("Role update error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du rôle",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUserPermissions = () => {
    if (!user) return {};
    return getRoleConfig(user.role).permissions;
  };

  const hasPermission = (permission: keyof ReturnType<typeof getRoleConfig>['permissions']) => {
    if (!user) return false;
    return getRoleConfig(user.role).permissions[permission];
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      register,
      updateUserRole,
      getCurrentUserPermissions,
      hasPermission,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
