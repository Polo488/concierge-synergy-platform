import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

interface PDFPageRendererProps {
  documentUrl: string;
  pageNumber: number;
  width: number;
  onPageCount?: (count: number) => void;
  className?: string;
}

export function PDFPageRenderer({ documentUrl, pageNumber, width, onPageCount, className }: PDFPageRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 595, height: 842 });

  useEffect(() => {
    let cancelled = false;

    async function render() {
      if (!canvasRef.current || !documentUrl) return;
      setLoading(true);
      setError(false);

      try {
        const pdf = await pdfjsLib.getDocument(documentUrl).promise;
        if (cancelled) return;
        onPageCount?.(pdf.numPages);

        const page = await pdf.getPage(Math.min(pageNumber, pdf.numPages));
        if (cancelled) return;

        const viewport = page.getViewport({ scale: 1 });
        const scale = width / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        setDimensions({ width: scaledViewport.width, height: scaledViewport.height });

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        await page.render({ canvasContext: ctx, viewport: scaledViewport }).promise;
        setLoading(false);
      } catch (err) {
        console.error('PDF render error:', err);
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    render();
    return () => { cancelled = true; };
  }, [documentUrl, pageNumber, width, onPageCount]);

  if (error) {
    return (
      <div className={className} style={{ width, height: width * 1.414 }}>
        <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
          Impossible de charger le PDF
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ width: dimensions.width, height: dimensions.height, position: 'relative' }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
        </div>
      )}
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
