
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { OwnerDashboard } from '@/components/owner-portal/OwnerDashboard';
import { OwnerOnboarding } from '@/components/owner-portal/OwnerOnboarding';
import { OwnerInvoices } from '@/components/owner-portal/OwnerInvoices';
import { OwnerDocuments } from '@/components/owner-portal/OwnerDocuments';
import { OwnerRevenue } from '@/components/owner-portal/OwnerRevenue';
import { OwnerNotifications } from '@/components/owner-portal/OwnerNotifications';
import { useLocation } from 'react-router-dom';

export default function OwnerPortal() {
  const { user, changePassword } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const location = useLocation();

  // First login: force password change
  if (user?.mustChangePassword) {
    const handleChangePassword = () => {
      if (newPassword.length < 6) {
        toast.error('Le mot de passe doit contenir au moins 6 caractères');
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error('Les mots de passe ne correspondent pas');
        return;
      }
      changePassword(newPassword);
      toast.success('Mot de passe modifié avec succès !');
    };

    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-[400px]">
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <KeyRound className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Modifier votre mot de passe</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Bienvenue {user.name} ! Pour des raisons de sécurité, veuillez choisir un nouveau mot de passe.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nouveau mot de passe</Label>
              <Input id="new-password" type="password" placeholder="Min. 6 caractères" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
              <Input id="confirm-password" type="password" placeholder="Confirmez votre mot de passe" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </div>
            <Button onClick={handleChangePassword} className="w-full" disabled={!newPassword || !confirmPassword}>
              Valider mon nouveau mot de passe
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Determine which section to show based on route
  const path = location.pathname;
  
  if (path === '/app/owner/onboarding') return <OwnerOnboarding />;
  if (path === '/app/owner/invoices') return <OwnerInvoices />;
  if (path === '/app/owner/documents') return <OwnerDocuments />;
  if (path === '/app/owner/revenue') return <OwnerRevenue />;
  if (path === '/app/owner/notifications') return <OwnerNotifications />;

  return <OwnerDashboard userName={user?.name || 'Propriétaire'} />;
}
