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
}
