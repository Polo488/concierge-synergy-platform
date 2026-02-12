
import { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PenTool, Type, RotateCcw } from 'lucide-react';

interface Props {
  onComplete: (value: string) => void;
  label?: string;
  width?: number;
  height?: number;
}

export function SignaturePad({ onComplete, label = 'Signature', width = 400, height = 150 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [typedName, setTypedName] = useState('');
  const [mode, setMode] = useState<'draw' | 'type'>('draw');

  const getCtx = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    return ctx;
  }, []);

  useEffect(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const canvas = canvasRef.current!;
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 2;
  }, [getCtx, width, height]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const ctx = getCtx();
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const ctx = getCtx();
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const ctx = getCtx();
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    setHasDrawn(false);
  };

  const handleConfirm = () => {
    if (mode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas || !hasDrawn) return;
      const dataUrl = canvas.toDataURL('image/png');
      onComplete(dataUrl);
    } else {
      if (!typedName.trim()) return;
      // Generate text-based signature as data URL
      const canvas = document.createElement('canvas');
      canvas.width = width * 2;
      canvas.height = height * 2;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(2, 2);
      ctx.fillStyle = 'transparent';
      ctx.fillRect(0, 0, width, height);
      ctx.font = 'italic 28px "Georgia", serif';
      ctx.fillStyle = '#1a1a2e';
      ctx.textBaseline = 'middle';
      ctx.fillText(typedName, 20, height / 2);
      const dataUrl = canvas.toDataURL('image/png');
      onComplete(dataUrl);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">{label}</p>

      <Tabs value={mode} onValueChange={v => setMode(v as 'draw' | 'type')}>
        <TabsList className="w-full">
          <TabsTrigger value="draw" className="flex-1 text-xs">
            <PenTool size={12} className="mr-1" />
            Dessiner
          </TabsTrigger>
          <TabsTrigger value="type" className="flex-1 text-xs">
            <Type size={12} className="mr-1" />
            Saisir
          </TabsTrigger>
        </TabsList>

        <TabsContent value="draw" className="mt-3">
          <div className="relative border-2 border-dashed border-border rounded-lg overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              style={{ width, height, touchAction: 'none' }}
              className="cursor-crosshair"
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
            />
            {!hasDrawn && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-sm text-muted-foreground/50">Signez ici</p>
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={clearCanvas} disabled={!hasDrawn}>
              <RotateCcw size={12} className="mr-1" />
              Effacer
            </Button>
            <Button size="sm" className="flex-1" onClick={handleConfirm} disabled={!hasDrawn}>
              Valider la signature
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="type" className="mt-3 space-y-3">
          <Input 
            value={typedName} 
            onChange={e => setTypedName(e.target.value)} 
            placeholder="Entrez votre nom complet"
            className="text-lg"
          />
          {typedName && (
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-white text-center" style={{ minHeight: height / 2 }}>
              <p className="text-2xl italic font-serif text-foreground">{typedName}</p>
            </div>
          )}
          <Button size="sm" className="w-full" onClick={handleConfirm} disabled={!typedName.trim()}>
            Valider la signature
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
