
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, FileText, Calendar, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CALENDLY_LINK = 'https://calendly.com';
const CONTACT_EMAIL = 'contact@noe.app';

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} onClick={() => onChange(i)} className="transition-transform hover:scale-110">
          <Star size={28} className={i <= value ? 'fill-primary text-primary' : 'text-muted-foreground/30'} />
        </button>
      ))}
    </div>
  );
}

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'menu' | 'form' | 'thanks'>('menu');
  const [rating, setRating] = useState(0);
  const [likes, setLikes] = useState('');
  const [missing, setMissing] = useState('');
  const [priority, setPriority] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const prenom = (() => {
    try { return JSON.parse(localStorage.getItem('noe_beta_profile') || '{}').prenom || ''; } catch { return ''; }
  })();

  const getProfileInfo = () => {
    try {
      const profile = JSON.parse(localStorage.getItem('noe_beta_profile') || '{}');
      return { name: profile.prenom || '', email: profile.email || '' };
    } catch { return { name: '', email: '' }; }
  };

  const submitFeedback = async () => {
    setSubmitting(true);
    const { name, email } = getProfileInfo();

    const { error } = await (supabase.from as any)('feedbacks').insert({
      rating,
      likes: likes || null,
      missing: missing || null,
      priority: priority || null,
      author_name: name || null,
      author_email: email || null,
    });

    if (error) {
      toast({ title: 'Erreur', description: "Impossible d'envoyer l'avis", variant: 'destructive' });
      setSubmitting(false);
      return;
    }

    setView('thanks');
    setSubmitting(false);
    setTimeout(() => {
      setOpen(false);
      setView('menu');
      setRating(0);
      setLikes('');
      setMissing('');
      setPriority('');
    }, 2000);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => { setOpen(true); setView('menu'); }}
        className="fixed bottom-6 right-6 z-[100000] pointer-events-auto h-11 px-5 rounded-full bg-primary text-primary-foreground flex items-center gap-2 shadow-lg hover:scale-[1.04] transition-all duration-200"
      >
        <MessageCircle size={18} />
        <span className="text-sm font-semibold">Donner mon avis</span>
      </button>

      <AnimatePresence>
        {open && createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ zIndex: 100001, background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-[480px] rounded-lg p-8 relative bg-background border shadow-lg"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
                <X size={20} />
              </button>

              <AnimatePresence mode="wait">
                {view === 'menu' && (
                  <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h2 className="text-xl font-bold text-foreground">Ton avis compte vraiment.</h2>
                    <p className="text-muted-foreground text-sm mb-6">Choisis comment tu veux nous faire un retour :</p>
                    <div className="space-y-3">
                      <button onClick={() => setView('form')} className="w-full p-4 rounded-lg bg-muted/50 border text-left flex items-start gap-3 hover:border-primary hover:bg-primary/5 transition-all">
                        <FileText size={20} className="text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-foreground font-semibold">📝 Laisser un retour écrit</p>
                          <p className="text-muted-foreground text-xs">2 min • Le plus utile pour nous</p>
                        </div>
                      </button>
                      <a href={CALENDLY_LINK} target="_blank" rel="noopener" onClick={() => setOpen(false)}
                        className="w-full p-4 rounded-lg bg-muted/50 border text-left flex items-start gap-3 hover:border-primary hover:bg-primary/5 transition-all block">
                        <Calendar size={20} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-foreground font-semibold">📅 Booker un appel de 20 min</p>
                          <p className="text-muted-foreground text-xs">Pour un retour en profondeur — on adore ces calls</p>
                        </div>
                      </a>
                      <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Candidature Conseil Bêta Noé')}&body=${encodeURIComponent('Bonjour,\n\nJe souhaite rejoindre le conseil bêta de Noé.\nJe gère [X] logements et voici pourquoi je serais un bon candidat :\n\n')}`}
                        onClick={() => setOpen(false)}
                        className="w-full p-4 rounded-lg bg-muted/50 border text-left flex items-start gap-3 hover:border-primary hover:bg-primary/5 transition-all block">
                        <Star size={20} className="text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-foreground font-semibold">⭐ Rejoindre le Conseil Bêta</p>
                          <p className="text-muted-foreground text-xs">5 places • Accès roadmap en direct + influence directe sur le produit</p>
                        </div>
                      </a>
                    </div>
                  </motion.div>
                )}

                {view === 'form' && (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h2 className="text-lg font-bold text-foreground mb-4">📝 Ton retour</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="text-muted-foreground text-sm block mb-2">Ton impression globale</label>
                        <StarRating value={rating} onChange={setRating} />
                      </div>
                      <div>
                        <label className="text-muted-foreground text-sm block mb-1.5">Ce que j'aime</label>
                        <textarea value={likes} onChange={e => setLikes(e.target.value)} rows={2}
                          className="w-full px-4 py-3 rounded-md bg-muted/50 border text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm resize-none"
                          placeholder="Ce qui me plaît vraiment dans Noé..." />
                      </div>
                      <div>
                        <label className="text-muted-foreground text-sm block mb-1.5">Ce qui manque</label>
                        <textarea value={missing} onChange={e => setMissing(e.target.value)} rows={2}
                          className="w-full px-4 py-3 rounded-md bg-muted/50 border text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm resize-none"
                          placeholder="J'aimerais pouvoir..." />
                      </div>
                      <div>
                        <label className="text-muted-foreground text-sm block mb-1.5">Ma fonctionnalité prioritaire</label>
                        <input value={priority} onChange={e => setPriority(e.target.value)}
                          className="w-full px-4 py-3 rounded-md bg-muted/50 border text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                          placeholder="ex: export comptable, app mobile..." />
                      </div>
                      <button onClick={submitFeedback} disabled={submitting}
                        className="w-full h-11 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all disabled:opacity-50">
                        {submitting ? 'Envoi...' : 'Envoyer mon retour →'}
                      </button>
                    </div>
                  </motion.div>
                )}

                {view === 'thanks' && (
                  <motion.div key="thanks" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8">
                    <p className="text-xl text-foreground font-bold">Merci {prenom} 🙏</p>
                    <p className="text-muted-foreground text-sm mt-2">On lit tout.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>
    </>
  );
}
