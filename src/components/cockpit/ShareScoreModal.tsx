import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';

interface ShareScoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  score: number;
}

export function ShareScoreModal({ open, onOpenChange, score }: ShareScoreModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!open || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, 0, 1920);
    grad.addColorStop(0, '#1A1A2E');
    grad.addColorStop(1, '#0F0F1E');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);

    ctx.fillStyle = '#FF5C1A';
    ctx.font = 'bold 80px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Mon Score Cockpit', 540, 700);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 360px sans-serif';
    ctx.fillText(String(score), 540, 1100);

    ctx.font = '48px sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('Noé · Cockpit Financier', 540, 1300);
  }, [open, score]);

  const download = () => {
    const url = canvasRef.current?.toDataURL('image/png');
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `cockpit-score-${score}.png`;
    a.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Partager mon score</DialogTitle>
          <DialogDescription>Story 1080×1920 prête à publier.</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <canvas ref={canvasRef} className="w-full max-w-[240px] rounded-lg border border-border" />
        </div>
        <Button onClick={download} className="w-full">Télécharger l'image</Button>
      </DialogContent>
    </Dialog>
  );
}
