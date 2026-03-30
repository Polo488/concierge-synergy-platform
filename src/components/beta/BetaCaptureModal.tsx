// DEVELOPER NOTE: Form responses are stored in two places:
// 1. localStorage key "noe_beta_profile" (always, client-side)
// 2. Supabase table "beta_profiles" if Supabase is configured
//    → Check your Supabase dashboard > Table Editor > beta_profiles
//    → If the table doesn't exist yet, create it with columns:
//       id (uuid), prenom (text), email (text), logements (text),
//       type_gestion (text), defis (text[]), channel_manager (text),
//       source (text), created_at (timestamptz)

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Zap, Gift, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import logoNoe from '@/assets/logo-noe.png';

const segmentedOptions = {
  logements: ['1–10', '11–30', '31–60', '60+'],
  defis: [
    'Synchro des canaux', 'Gestion des ménages',
    'Facturation propriétaires', 'Messagerie voyageurs',
    'Suivi de performance', 'Rentabilité',
  ],
};

const isDev = typeof window !== 'undefined' && (window.location.hostname.includes('lovable') || window.location.hostname === 'localhost');

export default function BetaCaptureModal() {
  const [visible, setVisible] = useState(false);
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [logements, setLogements] = useState('');
  const [defis, setDefis] = useState<string[]>([]);
  const [hasChannelManager, setHasChannelManager] = useState(false);
  const [channelManager, setChannelManager] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('noe_beta_done') === 'true') return;
    const timer = setTimeout(() => setVisible(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [visible]);

  const handleDefiToggle = (d: string) => {
    setDefis(prev => {
      if (prev.includes(d)) return prev.filter(x => x !== d);
      if (prev.length >= 2) return [prev[1], d];
      return [...prev, d];
    });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!prenom.trim()) e.prenom = 'Ce champ est requis';
    if (!email.trim()) e.email = 'Ce champ est requis';
    if (!logements) e.logements = 'Ce champ est requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setSubmitting(true);
    const data = {
      prenom: prenom.trim(),
      email: email.trim(),
      logements,
      defis,
      channelManager: hasChannelManager ? channelManager : null,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('noe_beta_profile', JSON.stringify(data));
    localStorage.setItem('noe_beta_done', 'true');
    try {
      await supabase.from('beta_profiles').insert({
        prenom: data.prenom,
        email: data.email,
        logements: data.logements,
        type_gestion: 'non spécifié',
        defis: data.defis as any,
        channel_manager: data.channelManager,
      });
    } catch {}
    setSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setVisible(false);
    }, 1800);
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onKeyDown={e => e.key === 'Escape' && e.preventDefault()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative w-[calc(100%-32px)] max-w-[520px] max-h-[90vh] overflow-y-auto rounded-lg border bg-background p-6 md:p-8 shadow-lg"
          >
            {showSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-primary/10"
                >
                  <Check className="w-8 h-8 text-primary" />
                </motion.div>
                <h3 className="text-2xl font-bold text-foreground">
                  C'est noté, {prenom} 🙌
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Tu entres dans Noé. Bienvenue dans la bêta.
                </p>
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <div className="flex flex-col items-center text-center">
                  <img src={logoNoe} alt="Noé" className="h-10 w-auto mx-auto mb-5" />
                  <div className="inline-flex items-center mx-auto rounded-full bg-primary/10 border border-primary/30 px-3 py-1 text-xs font-medium text-primary">
                    🔒 Bêta privée · 47 conciergeries actives
                  </div>
                  <h2 className="mt-4 text-xl md:text-2xl font-bold text-foreground leading-tight">
                    Avant d'entrer, dis-nous qui tu es 👋
                  </h2>
                  <p className="mx-auto mt-2 text-sm text-muted-foreground max-w-[400px] leading-relaxed">
                    Tes réponses façonnent directement les prochaines fonctionnalités de Noé.
                  </p>
                </div>

                <div className="border-t my-6" />

                {/* Form */}
                <div className="flex flex-col gap-5">
                  {/* Field 1 — Prénom */}
                  <div className="space-y-1.5">
                    <Label>Ton prénom</Label>
                    <Input
                      value={prenom}
                      onChange={e => setPrenom(e.target.value)}
                      className={errors.prenom ? 'border-destructive' : ''}
                    />
                    {errors.prenom && <p className="text-xs text-destructive">{errors.prenom}</p>}
                  </div>

                  {/* Field 2 — Email */}
                  <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="ton@email.com"
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email ? (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">
                        (On ne t'enverra pas d'emails — tu seras juste prévenu au lancement)
                      </p>
                    )}
                  </div>

                  {/* Field 3 — Logements */}
                  <div className="space-y-1.5">
                    <Label>Combien de logements tu gères ?</Label>
                    <p className="text-xs text-muted-foreground">En direct ou pour des propriétaires</p>
                    <div className="grid grid-cols-4 gap-2">
                      {segmentedOptions.logements.map(opt => (
                        <Button
                          key={opt}
                          type="button"
                          variant={logements === opt ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setLogements(opt)}
                          className={`${errors.logements && logements !== opt ? 'border-destructive' : ''}`}
                        >
                          {opt}
                        </Button>
                      ))}
                    </div>
                    {errors.logements && <p className="text-xs text-destructive">{errors.logements}</p>}
                  </div>

                  {/* Field 4 — Défis */}
                  <div className="space-y-1.5">
                    <Label>Ton plus grand défi aujourd'hui ?</Label>
                    <p className="text-xs text-primary font-medium">
                      ✦ Tes choix priorisent directement notre roadmap
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {segmentedOptions.defis.map(d => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => handleDefiToggle(d)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-150 ${
                            defis.includes(d)
                              ? 'bg-yellow-400 border-yellow-400 text-foreground font-semibold'
                              : 'bg-muted border-border text-foreground hover:bg-muted/80'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Field 5 — Channel Manager */}
                  <div className="space-y-1.5">
                    <Label>Tu utilises déjà un Channel Manager ?</Label>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">Non</span>
                      <Switch checked={hasChannelManager} onCheckedChange={setHasChannelManager} />
                      <span className="text-xs text-muted-foreground">Oui</span>
                    </div>
                    <motion.div
                      initial={false}
                      animate={{ height: hasChannelManager ? 'auto' : 0, opacity: hasChannelManager ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2">
                        <Input
                          value={channelManager}
                          onChange={e => setChannelManager(e.target.value)}
                          placeholder="Lequel ? (Smily, Lodgify, Beds24...)"
                        />
                      </div>
                    </motion.div>
                  </div>

                  {/* Co-creator strip */}
                  <div className="flex flex-col gap-2 rounded-lg bg-primary/5 border border-primary/15 p-3">
                    {[
                      { Icon: Wrench, text: 'Tes retours remontent dans notre backlog chaque semaine' },
                      { Icon: Zap, text: 'Tu accèdes aux features en avant-première' },
                      { Icon: Gift, text: 'Les 20 premiers bêta-testeurs actifs → 3 mois offerts au lancement' },
                    ].map(({ Icon, text }) => (
                      <div key={text} className="flex items-start gap-2">
                        <Icon className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                        <span className="text-xs text-muted-foreground">{text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Submit */}
                  <motion.div
                    animate={shake ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="w-full h-12 text-base font-bold"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Enregistrement...
                        </>
                      ) : (
                        'Accéder à la bêta →'
                      )}
                    </Button>
                  </motion.div>

                  {/* Dev-only storage info */}
                  {isDev && (
                    <div className="border-t pt-3 mt-2 text-center">
                      <p className="text-[11px] text-muted-foreground">
                        📦 Données stockées dans : localStorage (clé: noe_beta_profile) + Supabase table: beta_profiles (si configuré)
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
