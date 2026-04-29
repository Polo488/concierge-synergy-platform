// DEVELOPER NOTE: Form responses are stored in two places:
// 1. localStorage key "noe_beta_profile" (always, client-side)
// 2. Supabase table "beta_profiles" if Supabase is configured

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

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          style={{ zIndex: 99999, pointerEvents: 'auto' }}
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
                    Rejoins la bêta de Noé
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    Tu es à 30 secondes de tester l'outil. Dis-nous en un peu plus.
                  </p>
                </div>

                <div className="mt-6 space-y-5">
                  {/* Prénom */}
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Label htmlFor="prenom" className="text-sm font-medium">Prénom *</Label>
                    <Input
                      id="prenom"
                      value={prenom}
                      onChange={e => setPrenom(e.target.value)}
                      placeholder="Ton prénom"
                      className={errors.prenom ? 'border-destructive' : ''}
                    />
                    {errors.prenom && <p className="text-xs text-destructive mt-1">{errors.prenom}</p>}
                  </motion.div>

                  {/* Email */}
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="ton@email.com"
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    <p className="text-xs text-muted-foreground mt-1">(On ne t'enverra pas d'emails — tu seras juste prévenu au lancement)</p>
                    {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                  </motion.div>

                  {/* Logements */}
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Label className="text-sm font-medium">Nombre de logements gérés *</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {segmentedOptions.logements.map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setLogements(opt)}
                          className={`px-3 py-2 rounded-md text-sm font-medium border transition-all ${
                            logements === opt
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-muted/50 text-foreground border-border hover:bg-muted'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {errors.logements && <p className="text-xs text-destructive mt-1">{errors.logements}</p>}
                  </motion.div>

                  {/* Défis */}
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                    <Label className="text-sm font-medium">Tes plus gros défis au quotidien (max 2)</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {segmentedOptions.defis.map(d => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => handleDefiToggle(d)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            defis.includes(d)
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-muted/50 text-foreground border-border hover:bg-muted'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Channel Manager */}
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Tu utilises un Channel Manager ?</Label>
                      <Switch checked={hasChannelManager} onCheckedChange={setHasChannelManager} />
                    </div>
                    <AnimatePresence>
                      {hasChannelManager && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <Input
                            value={channelManager}
                            onChange={e => setChannelManager(e.target.value)}
                            placeholder="ex: Noé API, Smily, Lodgify..."
                            className="mt-2"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Co-creator strip */}
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    className="flex items-center justify-center gap-4 py-3 px-4 rounded-md bg-muted/30 border"
                  >
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Wrench className="w-3.5 h-3.5" /> Co-création
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Zap className="w-3.5 h-3.5" /> Accès prioritaire
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Gift className="w-3.5 h-3.5" /> Offre fondateur
                    </div>
                  </motion.div>

                  {/* Submit */}
                  <motion.div
                    animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="w-full h-11 text-sm font-semibold"
                    >
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Accéder à la bêta →
                    </Button>
                  </motion.div>

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
    </AnimatePresence>,
    document.body
  );
}
