
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Label } from '@/components/ui/label';
import logoNoe from '@/assets/logo-noe.png';
import { motion } from 'framer-motion';

const TICKER_TEXT = "MÉNAGE ◆ ENTREPÔT ◆ FACTURATION ◆ MESSAGERIE ◆ STATISTIQUES ◆ MAINTENANCE ◆ PROPRIÉTÉS ◆ ";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    const labelTimer = setTimeout(() => setShowLabel(true), 300);
    return () => clearTimeout(labelTimer);
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
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden" style={{ background: '#1A1A2E' }}>
      {/* Glow radial haut gauche */}
      <div
        className="pointer-events-none"
        style={{
          position: 'fixed', top: -200, left: -200,
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,92,26,0.15) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />
      {/* Glow radial bas droite */}
      <div
        className="pointer-events-none"
        style={{
          position: 'fixed', bottom: -200, right: -200,
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(107,122,232,0.12) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />

      {/* Formes décoratives flottantes */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none"
        style={{
          position: 'fixed', top: '10%', right: '5%',
          width: 300, height: 300, borderRadius: '50%',
          border: '2px solid rgba(255,92,26,0.15)',
          zIndex: 0,
        }}
      />
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none"
        style={{
          position: 'fixed', bottom: '15%', left: '8%',
          width: 120, height: 120, borderRadius: 20,
          background: 'rgba(245,200,66,0.1)',
          transform: 'rotate(20deg)',
          zIndex: 0,
        }}
      />
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none"
        style={{
          position: 'fixed', top: '30%', left: '15%',
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(107,122,232,0.2)',
          zIndex: 0,
        }}
      />

      {/* Card de connexion */}
      <div
        className="relative w-full"
        style={{
          maxWidth: 420,
          zIndex: 10,
          background: '#FFFFFF',
          borderRadius: 24,
          padding: 40,
          boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div className="text-center mb-6">
          <img src={logoNoe} alt="Noé" className="h-12 w-auto mx-auto mb-4" />
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 24, color: '#1A1A2E' }}>
            Connexion
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: 14, color: 'rgba(26,26,46,0.5)', marginTop: 4 }}>
            Connectez-vous pour accéder à votre espace
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, color: '#1A1A2E' }}>
                Email
              </Label>
              <input
                id="email"
                type="email"
                placeholder="exemple@domaine.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full outline-none transition-colors"
                style={{
                  background: '#F8F8F8',
                  border: '1.5px solid rgba(0,0,0,0.08)',
                  borderRadius: 12,
                  padding: '13px 16px',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  color: '#1A1A2E',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#FF5C1A'; e.currentTarget.style.background = '#FFFFFF'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.background = '#F8F8F8'; }}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, color: '#1A1A2E' }}>
                Mot de passe
              </Label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none transition-colors"
                style={{
                  background: '#F8F8F8',
                  border: '1.5px solid rgba(0,0,0,0.08)',
                  borderRadius: 12,
                  padding: '13px 16px',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  color: '#1A1A2E',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#FF5C1A'; e.currentTarget.style.background = '#FFFFFF'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.background = '#F8F8F8'; }}
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 cursor-pointer disabled:opacity-50"
            style={{
              background: '#FF5C1A',
              color: '#FFFFFF',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              borderRadius: 12,
              padding: 14,
              border: 'none',
              transition: 'filter 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.05)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = 'none'; }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </motion.button>

          <div className="mt-6">
            <p className="text-center mb-3" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: 12, color: 'rgba(26,26,46,0.4)' }}>
              Comptes de démonstration :
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('admin@example.com')}
                  className="w-full cursor-pointer transition-colors hover:bg-gray-100"
                  style={{
                    background: '#F8F8F8',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: 8,
                    padding: '8px 12px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    fontSize: 13,
                    color: '#1A1A2E',
                  }}
                >
                  Admin
                </button>
                <span
                  className="mt-1 block transition-opacity duration-300"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    fontSize: 13,
                    color: '#6B7AE8',
                    opacity: showLabel ? 1 : 0,
                  }}
                >
                  👆 Commence ici
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleDemoLogin('marie.dupont@email.com')}
                className="w-full cursor-pointer transition-colors hover:bg-gray-100"
                style={{
                  background: '#F8F8F8',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: 13,
                  color: '#1A1A2E',
                }}
              >
                Côté propriétaire
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Ticker banner bas */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 40,
          background: '#FF5C1A',
          zIndex: 20,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="login-ticker" style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          fontFamily: "'Syne', 'Plus Jakarta Sans', sans-serif",
          fontWeight: 700,
          fontSize: 12,
          color: '#FFFFFF',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          <span className="login-ticker-text">{TICKER_TEXT.repeat(6)}</span>
          <span className="login-ticker-text">{TICKER_TEXT.repeat(6)}</span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&display=swap');
        .login-ticker {
          animation: ticker-scroll 20s linear infinite;
        }
        .login-ticker-text {
          padding-right: 0;
        }
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default Login;
