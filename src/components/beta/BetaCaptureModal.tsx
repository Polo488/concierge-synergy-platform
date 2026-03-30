import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Zap, Gift, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

export default function BetaCaptureModal() {
  const [visible, setVisible] = useState(false);
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
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('noe_beta_done') === 'true') return;
    const timer = setTimeout(() => setVisible(true), 1500);
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
    if (!typeGestion) e.typeGestion = 'Ce champ est requis';
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
    const profile = {
      prenom: prenom.trim(),
      email: email.trim(),
      logements,
      typeGestion,
      defis,
      channelManager: hasChannelManager ? channelManager : null,
      source: source || null,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('noe_beta_profile', JSON.stringify(profile));
    localStorage.setItem('noe_beta_done', 'true');
    try {
      await supabase.from('beta_profiles').insert({
        prenom: profile.prenom,
        email: profile.email,
        logements: profile.logements,
        type_gestion: profile.typeGestion,
        defis: profile.defis as any,
        channel_manager: profile.channelManager,
        source: profile.source,
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
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 9999, background: 'rgba(26,26,46,0.85)', backdropFilter: 'blur(6px)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative w-[calc(100%-32px)] max-w-[520px] max-h-[90vh] overflow-y-auto rounded-[20px]"
            style={{
              background: '#FFFFFF',
              boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
              padding: 'clamp(24px, 4vw, 36px)',
            }}
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
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                  style={{ background: 'rgba(255,92,26,0.12)' }}
                >
                  <Check className="w-8 h-8" style={{ color: '#FF5C1A' }} />
                </motion.div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, color: '#1A1A2E', fontWeight: 700 }}>
                  C'est noté, {prenom} 🙌
                </h3>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#7A7A8C', marginTop: 8 }}>
                  Tu entres dans Noé. Bienvenue dans la bêta.
                </p>
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <div className="flex flex-col items-center text-center">
                  <div className="text-3xl font-bold mb-5" style={{ color: '#FF5C1A', fontFamily: 'Syne, sans-serif' }}>
                    noé
                  </div>
                  <div
                    className="inline-flex items-center mx-auto rounded-full"
                    style={{
                      background: 'rgba(255,92,26,0.10)',
                      border: '1px solid rgba(255,92,26,0.30)',
                      padding: '5px 14px',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: 12,
                      color: '#FF5C1A',
                      fontWeight: 500,
                    }}
                  >
                    🔒 Bêta privée · 47 conciergeries actives
                  </div>
                  <h2
                    className="mt-4"
                    style={{
                      fontFamily: 'Syne, sans-serif',
                      fontSize: 'clamp(22px, 4vw, 26px)',
                      color: '#1A1A2E',
                      fontWeight: 700,
                      lineHeight: 1.3,
                    }}
                  >
                    Avant d'entrer, dis-nous qui tu es 👋
                  </h2>
                  <p
                    className="mx-auto mt-2"
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: 15,
                      color: '#7A7A8C',
                      maxWidth: 400,
                      lineHeight: 1.6,
                    }}
                  >
                    Tes réponses façonnent directement les prochaines fonctionnalités de Noé.
                  </p>
                </div>

                <div style={{ borderTop: '1px solid #EEEEEE', margin: '24px 0' }} />

                {/* Form */}
                <div className="flex flex-col gap-5">
                  {/* Field 1 — Prénom */}
                  <div>
                    <FieldLabel>Ton prénom</FieldLabel>
                    <FieldInput value={prenom} onChange={setPrenom} error={errors.prenom} />
                    <FieldError error={errors.prenom} />
                  </div>

                  {/* Field 2 — Email */}
                  <div>
                    <FieldLabel>Ton email pro</FieldLabel>
                    <FieldInput value={email} onChange={setEmail} type="email" placeholder="ton@email.com" error={errors.email} />
                    <FieldError error={errors.email} />
                  </div>

                  {/* Field 3 — Logements */}
                  <div>
                    <FieldLabel>Combien de logements tu gères ?</FieldLabel>
                    <FieldHelper>En direct ou pour des propriétaires</FieldHelper>
                    <SegmentedGroup options={segmentedOptions.logements} value={logements} onChange={setLogements} error={errors.logements} />
                    <FieldError error={errors.logements} />
                  </div>

                  {/* Field 4 — Type gestion */}
                  <div>
                    <FieldLabel>Tu gères les biens de...</FieldLabel>
                    <SegmentedGroup options={segmentedOptions.typeGestion} value={typeGestion} onChange={setTypeGestion} error={errors.typeGestion} />
                    <FieldError error={errors.typeGestion} />
                  </div>

                  {/* Field 5 — Défis */}
                  <div>
                    <FieldLabel>Ton plus grand défi aujourd'hui ?</FieldLabel>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#FF5C1A', fontWeight: 500, marginBottom: 8 }}>
                      ✦ Tes choix priorisent directement notre roadmap
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {segmentedOptions.defis.map(d => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => handleDefiToggle(d)}
                          className="transition-all duration-150"
                          style={{
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: 13,
                            padding: '8px 16px',
                            borderRadius: 99,
                            border: defis.includes(d) ? '1px solid transparent' : '1px solid #EEEEEE',
                            background: defis.includes(d) ? '#F5C842' : '#F7F7F9',
                            color: '#1A1A2E',
                            fontWeight: defis.includes(d) ? 600 : 400,
                            cursor: 'pointer',
                          }}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Field 6 — Channel Manager */}
                  <div>
                    <FieldLabel>Tu utilises déjà un Channel Manager ?</FieldLabel>
                    <div className="flex items-center gap-3 mt-1">
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#7A7A8C' }}>Non</span>
                      <button
                        type="button"
                        onClick={() => setHasChannelManager(!hasChannelManager)}
                        className="relative w-11 h-6 rounded-full transition-colors duration-200"
                        style={{ background: hasChannelManager ? '#FF5C1A' : '#EEEEEE' }}
                      >
                        <div
                          className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200"
                          style={{ transform: hasChannelManager ? 'translateX(22px)' : 'translateX(2px)' }}
                        />
                      </button>
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#7A7A8C' }}>Oui</span>
                    </div>
                    <motion.div
                      initial={false}
                      animate={{ height: hasChannelManager ? 'auto' : 0, opacity: hasChannelManager ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2">
                        <FieldInput value={channelManager} onChange={setChannelManager} placeholder="Lequel ? (Smily, Lodgify, Beds24...)" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Field 7 — Source */}
                  <div>
                    <FieldLabel>Comment tu as connu Noé ?</FieldLabel>
                    <FieldHelper>Optionnel</FieldHelper>
                    <div className="flex flex-wrap gap-2">
                      {segmentedOptions.source.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSource(source === s ? '' : s)}
                          className="transition-all duration-150"
                          style={{
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: 13,
                            padding: '8px 16px',
                            borderRadius: 99,
                            border: source === s ? '1px solid transparent' : '1px solid #EEEEEE',
                            background: source === s ? '#FF5C1A' : '#F7F7F9',
                            color: source === s ? '#FFFFFF' : '#1A1A2E',
                            fontWeight: source === s ? 600 : 400,
                            cursor: 'pointer',
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Co-creator strip */}
                  <div
                    className="flex flex-col gap-2 rounded-xl"
                    style={{
                      background: 'rgba(255,92,26,0.06)',
                      border: '1px solid rgba(255,92,26,0.15)',
                      padding: '14px 16px',
                    }}
                  >
                    {[
                      { Icon: Wrench, text: 'Tes retours remontent dans notre backlog chaque semaine' },
                      { Icon: Zap, text: 'Tu accèdes aux features en avant-première' },
                      { Icon: Gift, text: 'Les 20 premiers bêta-testeurs actifs → 3 mois offerts au lancement' },
                    ].map(({ Icon, text }) => (
                      <div key={text} className="flex items-start gap-2">
                        <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#FF5C1A' }} />
                        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#7A7A8C' }}>{text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    animate={shake ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className="w-full flex items-center justify-center gap-2 transition-all duration-150"
                    style={{
                      height: 52,
                      borderRadius: 12,
                      background: '#FF5C1A',
                      color: '#FFFFFF',
                      fontFamily: 'Syne, sans-serif',
                      fontSize: 16,
                      fontWeight: 700,
                      border: 'none',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      opacity: submitting ? 0.7 : 1,
                      marginTop: 4,
                    }}
                    whileHover={!submitting ? { scale: 1.02, background: '#E04D10' } : {}}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      'Accéder à la bêta →'
                    )}
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Sub-components ─── */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: 'block',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: 14,
        fontWeight: 500,
        color: '#1A1A2E',
        marginBottom: 6,
      }}
    >
      {children}
    </label>
  );
}

function FieldHelper({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#9A9AAF', marginBottom: 8 }}>
      {children}
    </p>
  );
}

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#EF4444', marginTop: 4 }}>
      {error}
    </p>
  );
}

function FieldInput({
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full outline-none transition-all duration-150"
      style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: 14,
        padding: '10px 14px',
        borderRadius: 10,
        background: '#F7F7F9',
        border: `1px solid ${error ? '#EF4444' : '#EEEEEE'}`,
        color: '#1A1A2E',
      }}
      onFocus={e => {
        e.currentTarget.style.borderColor = '#FF5C1A';
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,92,26,0.10)';
      }}
      onBlur={e => {
        e.currentTarget.style.borderColor = error ? '#EF4444' : '#EEEEEE';
        e.currentTarget.style.boxShadow = 'none';
      }}
    />
  );
}

function SegmentedGroup({
  options,
  value,
  onChange,
  error,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(options.length, 4)}, 1fr)` }}>
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className="transition-all duration-150"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 13,
            height: 40,
            borderRadius: 10,
            border: value === opt ? '1px solid transparent' : `1px solid ${error ? '#EF4444' : '#EEEEEE'}`,
            background: value === opt ? '#FF5C1A' : '#F7F7F9',
            color: value === opt ? '#FFFFFF' : '#7A7A8C',
            fontWeight: value === opt ? 600 : 400,
            cursor: 'pointer',
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
