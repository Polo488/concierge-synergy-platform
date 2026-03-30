import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, FileText, Calendar, Star } from 'lucide-react';

const CALENDLY_LINK = 'https://calendly.com';
const CONTACT_EMAIL = 'contact@noe.app';

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} onClick={() => onChange(i)} className="transition-transform hover:scale-110">
          <Star size={28} className={i <= value ? 'fill-[#F5C842] text-[#F5C842]' : 'text-[#EEEEEE]'} />
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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(localStorage.getItem('noe_onboarding_done') === 'true');
  }, []);

  if (!visible) return null;

  const prenom = (() => {
    try { return JSON.parse(localStorage.getItem('noe_beta_profile') || '{}').prenom || ''; } catch { return ''; }
  })();

  const submitFeedback = () => {
    const data = { rating, likes, missing, priority, timestamp: new Date().toISOString() };
    localStorage.setItem(`noe_feedback_${Date.now()}`, JSON.stringify(data));
    setView('thanks');
    setTimeout(() => { setOpen(false); setView('menu'); setRating(0); setLikes(''); setMissing(''); setPriority(''); }, 2000);
  };

  const inputClass = "w-full px-4 py-3 rounded-[10px] bg-[#F7F7F9] border border-[#EEEEEE] text-[#1A1A2E] placeholder:text-[#7A7A8C] outline-none focus:border-[#FF5C1A] focus:shadow-[0_0_0_3px_rgba(255,92,26,0.12)] transition-all text-sm";

  return (
    <>
      {/* Floating button */}
      <motion.button onClick={() => { setOpen(true); setView('menu'); }}
        className="fixed bottom-6 right-6 z-[90] h-11 px-5 rounded-full bg-[#FF5C1A] text-white flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
        animate={{ scale: [1, 1.04, 1], opacity: [1, 0.85, 1] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        whileHover={{ scale: 1.05 }}
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <MessageCircle size={18} />
        <span className="text-sm font-semibold">Donner mon avis</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setOpen(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-[480px] rounded-[20px] p-8 relative bg-white border border-[#EEEEEE]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              onClick={e => e.stopPropagation()}>
              <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-[#7A7A8C] hover:text-[#1A1A2E] transition-colors">
                <X size={20} />
              </button>

              <AnimatePresence mode="wait">
                {view === 'menu' && (
                  <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h2 className="font-['Syne'] text-[22px] text-[#1A1A2E] font-bold">Ton avis compte vraiment.</h2>
                    <p className="text-[#7A7A8C] text-sm mb-6">Choisis comment tu veux nous faire un retour :</p>
                    <div className="space-y-3">
                      <button onClick={() => setView('form')} className="w-full p-4 rounded-[14px] bg-[#F7F7F9] border border-[#EEEEEE] text-left flex items-start gap-3 hover:border-[#FF5C1A] hover:bg-[rgba(255,92,26,0.04)] transition-all">
                        <FileText size={20} className="text-[#FF5C1A] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-['Syne'] text-[#1A1A2E] font-semibold text-[16px]">📝 Laisser un retour écrit</p>
                          <p className="text-[#7A7A8C] text-[13px]">2 min • Le plus utile pour nous</p>
                        </div>
                      </button>
                      <a href={CALENDLY_LINK} target="_blank" rel="noopener" onClick={() => setOpen(false)}
                        className="w-full p-4 rounded-[14px] bg-[#F7F7F9] border border-[#EEEEEE] text-left flex items-start gap-3 hover:border-[#FF5C1A] hover:bg-[rgba(255,92,26,0.04)] transition-all block">
                        <Calendar size={20} className="text-[#F5C842] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-['Syne'] text-[#1A1A2E] font-semibold text-[16px]">📅 Booker un appel de 20 min</p>
                          <p className="text-[#7A7A8C] text-[13px]">Pour un retour en profondeur — on adore ces calls</p>
                        </div>
                      </a>
                      <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Candidature Conseil Bêta Noé')}&body=${encodeURIComponent('Bonjour,\n\nJe souhaite rejoindre le conseil bêta de Noé.\nJe gère [X] logements et voici pourquoi je serais un bon candidat :\n\n')}`}
                        onClick={() => setOpen(false)}
                        className="w-full p-4 rounded-[14px] bg-[#F7F7F9] border border-[#EEEEEE] text-left flex items-start gap-3 hover:border-[#FF5C1A] hover:bg-[rgba(255,92,26,0.04)] transition-all block">
                        <Star size={20} className="text-[#FF5C1A] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-['Syne'] text-[#1A1A2E] font-semibold text-[16px]">⭐ Rejoindre le Conseil Bêta</p>
                          <p className="text-[#7A7A8C] text-[13px]">5 places • Accès roadmap en direct + influence directe sur le produit</p>
                        </div>
                      </a>
                    </div>
                  </motion.div>
                )}

                {view === 'form' && (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h2 className="font-['Syne'] text-[20px] text-[#1A1A2E] font-bold mb-4">📝 Ton retour</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[#7A7A8C] text-sm block mb-2">Ton impression globale</label>
                        <StarRating value={rating} onChange={setRating} />
                      </div>
                      <div>
                        <label className="text-[#7A7A8C] text-sm block mb-1.5">Ce que j'aime</label>
                        <textarea value={likes} onChange={e => setLikes(e.target.value)} rows={2}
                          className={inputClass} placeholder="Ce qui me plaît vraiment dans Noé..." />
                      </div>
                      <div>
                        <label className="text-[#7A7A8C] text-sm block mb-1.5">Ce qui manque</label>
                        <textarea value={missing} onChange={e => setMissing(e.target.value)} rows={2}
                          className={inputClass} placeholder="J'aimerais pouvoir..." />
                      </div>
                      <div>
                        <label className="text-[#7A7A8C] text-sm block mb-1.5">Ma fonctionnalité prioritaire</label>
                        <input value={priority} onChange={e => setPriority(e.target.value)}
                          className={inputClass} placeholder="ex: export comptable, app mobile..." />
                      </div>
                      <button onClick={submitFeedback}
                        className="w-full h-11 rounded-[12px] bg-[#FF5C1A] text-white font-['Syne'] font-semibold hover:bg-[#E04D10] transition-all">
                        Envoyer mon retour →
                      </button>
                    </div>
                  </motion.div>
                )}

                {view === 'thanks' && (
                  <motion.div key="thanks" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8">
                    <p className="font-['Syne'] text-xl text-[#1A1A2E] font-bold">Merci {prenom} 🙏</p>
                    <p className="text-[#7A7A8C] text-sm mt-2">On lit tout.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
