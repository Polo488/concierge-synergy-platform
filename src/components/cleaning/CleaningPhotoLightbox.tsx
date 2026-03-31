import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { CleaningPhoto } from '@/types/cleaning';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CleaningPhotoLightboxProps {
  photos: CleaningPhoto[];
  initialIndex: number;
  onClose: () => void;
}

export const CleaningPhotoLightbox = ({ photos, initialIndex, onClose }: CleaningPhotoLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const current = photos[currentIndex];

  const goNext = useCallback(() => {
    setCurrentIndex(i => (i + 1) % photos.length);
  }, [photos.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex(i => (i - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, goNext, goPrev]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goPrev();
      else goNext();
    }
    setTouchStart(null);
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{ background: 'rgba(0,0,0,0.92)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4"
        style={{ background: 'linear-gradient(rgba(0,0,0,0.6), transparent)' }}>
        <div>
          <p className="text-[13px] font-semibold text-white">{current.agent}</p>
          <p className="text-xs text-white/70">
            {format(new Date(current.timestamp), "EEE d MMM · HH:mm", { locale: fr })}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center text-white"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          <X className="h-[18px] w-[18px]" />
        </button>
      </div>

      {/* Main image */}
      <div 
        className="flex-1 flex items-center justify-center px-4 py-[60px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img 
          src={current.url} 
          alt={current.caption}
          className="max-w-full max-h-full object-contain rounded-lg"
        />
      </div>

      {/* Nav buttons */}
      {photos.length > 1 && (
        <>
          <button 
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <ChevronLeft className="h-[22px] w-[22px]" />
          </button>
          <button 
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <ChevronRight className="h-[22px] w-[22px]" />
          </button>
        </>
      )}

      {/* Position indicator */}
      <p className="absolute bottom-[80px] left-1/2 -translate-x-1/2 text-[13px] text-white/70">
        {currentIndex + 1} / {photos.length}
      </p>

      {/* Thumbnail strip */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[72px] flex items-center gap-1.5 px-4 overflow-x-auto"
        style={{ background: 'rgba(0,0,0,0.6)', scrollbarWidth: 'none' }}
      >
        {photos.map((photo, i) => (
          <img
            key={photo.id}
            src={photo.url}
            alt={photo.caption}
            onClick={() => setCurrentIndex(i)}
            className={`w-14 h-14 flex-shrink-0 rounded-md object-cover cursor-pointer transition-all duration-150 border-2 ${
              i === currentIndex 
                ? 'opacity-100 border-primary' 
                : 'opacity-60 border-transparent hover:opacity-80'
            }`}
          />
        ))}
      </div>
    </div>,
    document.body
  );
};
