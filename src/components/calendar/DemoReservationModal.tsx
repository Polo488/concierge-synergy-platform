import React, { useEffect } from 'react';
import { Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DemoReservationModalProps {
  open: boolean;
  onClose: () => void;
  onRequestAccess?: () => void;
}

export const DemoReservationModal: React.FC<DemoReservationModalProps> = ({
  open,
  onClose,
  onRequestAccess,
}) => {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 9999, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-white text-center"
            style={{
              borderRadius: 16,
              padding: '32px 28px',
              maxWidth: 340,
              width: 'calc(100% - 32px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Lock size={40} color="#FF5C1A" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>
              Réservation démo
            </h3>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#7A7A8C', lineHeight: 1.6, marginBottom: 24 }}>
              Le détail des réservations n'est pas disponible en mode démo.
            </p>
            <button
              onClick={onClose}
              style={{
                width: '100%',
                height: 44,
                borderRadius: 10,
                background: '#FF5C1A',
                color: '#FFFFFF',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 14,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Compris
            </button>
            {onRequestAccess && (
              <button
                onClick={() => { onClose(); onRequestAccess(); }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 13,
                  color: '#FF5C1A',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  marginTop: 12,
                  display: 'block',
                  width: '100%',
                }}
              >
                Demander un accès complet →
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
