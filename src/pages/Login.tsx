
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import logoNoe from '@/assets/logo-noe.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const [showPulse, setShowPulse] = useState(true);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    const labelTimer = setTimeout(() => setShowLabel(true), 300);
    const pulseTimer = setTimeout(() => setShowPulse(false), 6000);
    return () => { clearTimeout(labelTimer); clearTimeout(pulseTimer); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password');
    await login(demoEmail, 'password');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1 text-center">
          <img src={logoNoe} alt="Noé" className="h-12 w-auto mx-auto mb-2" />
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

            <div className="text-sm text-center text-muted-foreground mt-4">
              Comptes de démonstration :
            </div>
            <div className="grid grid-cols-2 gap-2 w-full">
              <div className="flex flex-col items-center">
                <span
                  className="text-[11px] font-medium mb-1 block transition-opacity duration-400"
                  style={{
                    color: '#6B7AE8',
                    opacity: showLabel ? 1 : 0,
                  }}
                >
                  👆 Commence ici
                </span>
                <div className="relative w-full">
                  {showPulse && (
                    <>
                      <span
                        className="absolute rounded-md pointer-events-none"
                        style={{
                          inset: '-6px',
                          border: '2px solid #6B7AE8',
                          borderRadius: 'inherit',
                          animation: 'noe-ping 2s ease-out infinite',
                        }}
                      />
                      <span
                        className="absolute rounded-md pointer-events-none"
                        style={{
                          inset: '-3px',
                          border: '2px solid #6B7AE8',
                          borderRadius: 'inherit',
                          animation: 'noe-ping 2s ease-out infinite',
                          animationDelay: '0.4s',
                        }}
                      />
                    </>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full relative z-[1]"
                    onClick={() => handleDemoLogin('admin@example.com')}
                  >
                    Admin
                  </Button>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('marie.dupont@email.com')}
              >
                Côté propriétaire
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
