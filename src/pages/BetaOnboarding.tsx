import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Zap, Gift, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const segmentedOptions = {
  logements: ['1–10', '11–30', '31–60', '60+'],
  typeGestion: ['Propriétaires tiers', 'Mes propres biens', 'Les deux'],
  defis: [
    'Synchro des canaux', 'Gestion des ménages',
    'Facturation propriétaires', 'Messagerie voyageurs',
    'Suivi de performance', 'Rentabilité',
  ],
  source: ['Groupe Facebook', 'Instagram', 'Un formateur', 'Bouche à oreille', 'Autre'],
};

export default function BetaOnboarding() {
  const navigate = useNavigate();
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [logements, setLogements] = useState('');
  const [typeGestion, setTypeGestion] = useState('');
  const [defis, setDefis] = useState<string[]>([]);
  const [hasChannelManager, setHasChannelManager] = useState(false);
  const [channelManager, setChannelManager] = useState('');
  const [source, setSource] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('noe_onboarding_done') === 'true') {
      navigate('/app', { replace: true });
    }
  }, [navigate]);

  const handleDefiToggle = (d: string) => {
    setDefis(prev => {
      if (prev.includes(d)) return prev.filter(x => x !== d);
      if (prev.length >= 2) {
        toast('On garde tes 2 priorités 🎯', { duration: 2000 });
        return [prev[1], d];
      }
      return [...prev, d];
    });
  };

  const skip = () => {
    localStorage.setItem('noe_onboarding_done', 'true');
    navigate('/app', { replace: true });
  };

  const handleSubmit = async () => {
    const errs: Record<string, string> = {};
    if (!prenom.trim()) errs.prenom = 'Requis';
    if (!email.trim()) errs.email = 'Requis';
    if (!logements) errs.logements = 'Requis';
    if (!typeGestion) errs.typeGestion = 'Requis';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    const profile = {
      prenom, email, logements, typeGestion, defis,
      channelManager: hasChannelManager ? channelManager : null,
      source: source || null,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('noe_beta_profile', JSON.stringify(profile));
    localStorage.setItem('noe_onboarding_done', 'true');

    try {
      await supabase.from('beta_profiles' as any).insert({
        prenom, email, logements, type_gestion: typeGestion,
        defis: defis as any, channel_manager: hasChannelManager ? channelManager : null,
        source: source || null,
      });
    } catch {}

    setSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => navigate('/app', { replace: true }), 1800);
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-[10px] text-white placeholder:text-white/40 outline-none transition-colors duration-200 ${
      errors[field]
        ? 'bg-red-500/10 border border-red-500/50'
        : 'bg-white/[0.07] border border-white/[0.15] focus:border-[#FF5C1A]'
    }`;

  const segBtn = (selected: boolean, accent: 'orange' | 'yellow' = 'orange') => {
    const bg = accent === 'orange' ? 'bg-[#FF5C1A] border-transparent text-white font-semibold' : 'bg-[#F5C842] border-transparent text-[#0D0D1A] font-semibold';
    return `px-4 py-2.5 rounded-[10px] text-sm transition-all duration-150 cursor-pointer select-none ${
      selected ? bg : 'bg-white/[0.07] border border-white/[0.15] text-white/50 hover:text-white/70'
    }`;
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-[#0D0D1A] flex items-center justify-center z-[100]">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <Check className="text-green-400" size={40} />
          </div>
          <h2 className="font-['Syne'] text-2xl text-white font-bold">C'est noté, {prenom} 🙌</h2>
          <p className="text-white/50 font-['DM_Sans'] mt-2">Tu entres dans Noé. Bienvenue dans la bêta.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
      className="fixed inset-0 bg-[#0D0D1A] overflow-y-auto z-[100]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Decorative blobs */}
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.08]"
        style={{ background: 'radial-gradient(circle, #FF5C1A, transparent 70%)' }} />
      <div className="fixed bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full opacity-[0.1]"
        style={{ background: 'radial-gradient(circle, #F5C842, transparent 70%)' }} />
      <div className="fixed top-[30%] left-[50%] translate-x-[-50%] w-[600px] h-[600px] rounded-full opacity-[0.05] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FF5C1A, transparent 60%)' }} />

      <div className="relative max-w-[600px] mx-auto px-6 py-12 md:py-16">
        {/* Badge */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="flex justify-center mb-6">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[13px] text-[#FF5C1A] font-medium"
            style={{ background: 'rgba(255,92,26,0.15)', border: '1px solid rgba(255,92,26,0.4)' }}>
            🔒 Bêta privée — 47 conciergeries actives
          </span>
        </motion.div>

        {/* Hero */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-center mb-8">
          <h1 className="font-['Syne'] text-[28px] md:text-[36px] text-white font-bold">Bienvenue dans Noé 👋</h1>
          <p className="text-white/50 text-[17px] leading-relaxed mt-4 max-w-[520px] mx-auto">
            Tu fais partie des premiers à tester Noé en conditions réelles.
            Ce que tu vas nous dire ici va directement façonner les prochaines fonctionnalités. Prends 2 minutes — ça compte vraiment.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          className="rounded-[20px] p-6 md:p-8 mb-10"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
          <h2 className="font-['Syne'] text-[20px] text-white font-bold">Dis-nous qui tu es</h2>
          <p className="text-white/50 text-sm mb-6">Pour personnaliser ton expérience et prioriser la roadmap</p>

          <div className="space-y-5">
            {/* Prénom */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
              <label className="block text-white text-sm font-medium mb-1.5">Ton prénom</label>
              <input value={prenom} onChange={e => { setPrenom(e.target.value); setErrors(p => ({ ...p, prenom: '' })); }}
                className={inputClass('prenom')} placeholder="Prénom" />
              {errors.prenom && <p className="text-red-400 text-xs mt-1">{errors.prenom}</p>}
            </motion.div>

            {/* Email */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              <label className="block text-white text-sm font-medium mb-1.5">Ton email pro</label>
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                className={inputClass('email')} placeholder="ton@email.com" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </motion.div>

            {/* Logements */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}>
              <label className="block text-white text-sm font-medium mb-1.5">Combien de logements tu gères ?</label>
              <p className="text-white/40 text-[13px] mb-2">En direct ou pour des propriétaires</p>
              <div className="grid grid-cols-4 gap-2">
                {segmentedOptions.logements.map(o => (
                  <button key={o} onClick={() => { setLogements(o); setErrors(p => ({ ...p, logements: '' })); }}
                    className={segBtn(logements === o)}>{o}</button>
                ))}
              </div>
              {errors.logements && <p className="text-red-400 text-xs mt-1">{errors.logements}</p>}
            </motion.div>

            {/* Type gestion */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
              <label className="block text-white text-sm font-medium mb-1.5">Type de gestion</label>
              <div className="grid grid-cols-3 gap-2">
                {segmentedOptions.typeGestion.map(o => (
                  <button key={o} onClick={() => { setTypeGestion(o); setErrors(p => ({ ...p, typeGestion: '' })); }}
                    className={segBtn(typeGestion === o)}>{o}</button>
                ))}
              </div>
              {errors.typeGestion && <p className="text-red-400 text-xs mt-1">{errors.typeGestion}</p>}
            </motion.div>

            {/* Défis */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.55 }}>
              <label className="block text-white text-sm font-medium mb-1.5">Quel est ton plus grand défi aujourd'hui ?</label>
              <p className="text-[#F5C842] text-[13px] mb-2">✦ Tes choix priorisent directement notre roadmap</p>
              <div className="flex flex-wrap gap-2">
                {segmentedOptions.defis.map(d => (
                  <button key={d} onClick={() => handleDefiToggle(d)}
                    className={segBtn(defis.includes(d), 'yellow')}>{d}</button>
                ))}
              </div>
            </motion.div>

            {/* Channel Manager */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
              <label className="block text-white text-sm font-medium mb-2">Tu utilises déjà un Channel Manager ?</label>
              <div className="flex items-center gap-3">
                <span className="text-white/50 text-sm">Non</span>
                <button onClick={() => setHasChannelManager(!hasChannelManager)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${hasChannelManager ? 'bg-[#FF5C1A]' : 'bg-white/20'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${hasChannelManager ? 'translate-x-[26px]' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-white/50 text-sm">Oui</span>
              </div>
              <AnimatePresence>
                {hasChannelManager && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-3">
                    <input value={channelManager} onChange={e => setChannelManager(e.target.value)}
                      className={inputClass('')} placeholder="Lequel ? (Smily, Lodgify, Beds24...)" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Source */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.65 }}>
              <label className="block text-white text-sm font-medium mb-1.5">Comment tu as entendu parler de Noé ?</label>
              <p className="text-white/40 text-[13px] mb-2">Optionnel — mais ça nous aide beaucoup</p>
              <div className="flex flex-wrap gap-2">
                {segmentedOptions.source.map(s => (
                  <button key={s} onClick={() => setSource(source === s ? '' : s)}
                    className={segBtn(source === s)}>{s}</button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Submit */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }} className="mt-8">
            <button onClick={handleSubmit} disabled={submitting}
              className="w-full h-[52px] rounded-[14px] bg-[#FF5C1A] text-white font-['Syne'] font-bold text-[16px] hover:brightness-110 hover:scale-[1.02] transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2">
              {submitting ? <><Loader2 size={18} className="animate-spin" /> Enregistrement...</> : 'Accéder à la bêta Noé →'}
            </button>
            <button onClick={skip} className="w-full mt-3 text-white/40 text-[13px] hover:text-white/60 hover:underline transition-colors">
              Je préfère explorer d'abord →
            </button>
          </motion.div>
        </motion.div>

        {/* Manifesto */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}
          className="text-center mb-16">
          <h3 className="font-['Syne'] text-[22px] text-white font-bold mb-6">Tu n'es pas juste un testeur.</h3>
          <div className="space-y-4 max-w-[460px] mx-auto">
            {[
              { icon: Wrench, color: '#FF5C1A', text: 'Tes retours remontent directement dans notre backlog chaque semaine' },
              { icon: Zap, color: '#F5C842', text: 'Tu débloques les features en avant-première avant le lancement public' },
              { icon: Gift, color: '#FF5C1A', text: 'Les 20 premiers bêta-testeurs actifs → 3 mois offerts au lancement officiel' },
            ].map((r, i) => (
              <div key={i} className="flex items-start gap-3 text-left group cursor-default">
                <r.icon size={20} style={{ color: r.color, flexShrink: 0, marginTop: 2 }} />
                <p className="text-white/50 text-[15px] group-hover:text-white transition-colors duration-200">{r.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
