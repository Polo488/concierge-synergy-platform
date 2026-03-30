
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import logoNoe from '@/assets/logo-noe.png';

const HandwrittenAnnotation = () => (
  <>
    {/* Desktop: absolute left of card */}
    <motion.div
      className="hidden md:block absolute right-full mr-4 top-1/2 translate-y-4"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.8, ease: 'easeOut' }}
    >
      <div
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: '15px',
          fontWeight: 400,
          color: '#6B7AE8',
          lineHeight: 1.4,
          transform: 'rotate(-8deg)',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        <div>clique ici pour</div>
        <div>découvrir toutes les</div>
        <div>fonctionnalités</div>
      </div>
      <svg
        width="120"
        height="70"
        viewBox="0 0 120 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto mt-1"
        style={{ transform: 'rotate(-8deg)' }}
      >
        <path
          d="M 20 5 C 30 20, 15 45, 45 55 C 65 62, 90 58, 108 48"
          stroke="#6B7AE8"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 95 42 L 108 48 L 100 58"
          stroke="#6B7AE8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </motion.div>

  </>
);

const MobileAnnotation = () => (
  <motion.div
    className="flex flex-col items-center my-2"
    initial={{ opacity: 0, y: -6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.8, ease: 'easeOut' }}
  >
    <div
      style={{
        fontFamily: "'Caveat', cursive",
        fontSize: '13px',
        fontWeight: 400,
        color: '#6B7AE8',
        lineHeight: 1.4,
        transform: 'rotate(-4deg)',
        textAlign: 'center',
      }}
    >
      <div>clique ici pour</div>
      <div>découvrir toutes les</div>
      <div>fonctionnalités</div>
    </div>
    <svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mt-1"
    >
      <path
        d="M 25 5 C 20 15, 28 25, 22 35 C 18 42, 24 45, 25 48"
        stroke="#6B7AE8"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 19 40 L 25 48 L 31 40"
        stroke="#6B7AE8"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  </motion.div>
);

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
    setPassword('password');
    await login(demoEmail, 'password');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="relative">
        <HandwrittenAnnotation />
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

              {/* Mobile annotation between button and demo accounts */}
              <div className="md:hidden w-full">
                <HandwrittenAnnotation />
              </div>

              <div className="text-sm text-center text-muted-foreground mt-4">
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
                  onClick={() => handleDemoLogin('marie.dupont@email.com')}
                >
                  Côté propriétaire
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
