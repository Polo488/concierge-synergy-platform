
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password'); // Demo password
    await login(demoEmail, 'password');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
          <CardDescription>
            Connectez-vous pour accéder à votre espace
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@domaine.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
            <div className="text-sm text-center text-gray-500 mt-4">
              Comptes de démonstration :
            </div>
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => handleDemoLogin('admin@example.com')}
              >
                Admin
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => handleDemoLogin('employee@example.com')}
              >
                Employé
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => handleDemoLogin('maintenance@example.com')}
              >
                Maintenance
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => handleDemoLogin('cleaning@example.com')}
              >
                Ménage
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
