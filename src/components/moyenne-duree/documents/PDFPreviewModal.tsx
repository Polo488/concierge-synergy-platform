
import { useState, useEffect } from "react";
import { Download, X, ZoomIn, ZoomOut, Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import jsPDF from "jspdf";

interface PDFPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdf: jsPDF | null;
  title: string;
  filename: string;
}

export const PDFPreviewModal = ({
  open,
  onOpenChange,
  pdf,
  title,
  filename,
}: PDFPreviewModalProps) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    if (pdf && open) {
      const url = pdf.output("datauristring");
      setDataUrl(url);
    } else {
      setDataUrl(null);
      setZoom(100);
    }
  }, [pdf, open]);

  const handleDownload = () => {
    if (pdf) {
      pdf.save(`${filename}.pdf`);
    }
  };

  const handlePrint = () => {
    if (dataUrl) {
      const printWindow = window.open(dataUrl, "_blank");
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg">{title}</DialogTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm w-12 text-center">{zoom}%</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoom >= 200}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimer
              </Button>
              <Button size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 bg-muted/50">
          <div className="flex justify-center p-6">
            {dataUrl ? (
              <div
                className="bg-white shadow-lg rounded-sm overflow-hidden"
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top center",
                }}
              >
                <iframe
                  src={dataUrl}
                  className="border-0"
                  style={{
                    width: "210mm",
                    height: "297mm",
                    maxWidth: "none",
                  }}
                  title={title}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 text-muted-foreground">
                Chargement de l'aperçu...
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
