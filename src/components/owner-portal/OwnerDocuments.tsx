
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileCheck, FileClock, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Document {
  id: string;
  name: string;
  type: 'mandate' | 'contract' | 'inventory' | 'insurance' | 'other';
  property: string;
  date: string;
  status: 'signed' | 'pending' | 'expired';
  version?: number;
}

const MOCK_DOCUMENTS: Document[] = [
  { id: '1', name: 'Mandat de gestion locative', type: 'mandate', property: 'Appartement Marais', date: '2025-06-15', status: 'signed', version: 2 },
  { id: '2', name: 'État des lieux d\'entrée', type: 'inventory', property: 'Appartement Marais', date: '2025-06-20', status: 'signed' },
  { id: '3', name: 'Attestation d\'assurance PNO', type: 'insurance', property: 'Appartement Marais', date: '2025-05-10', status: 'signed' },
  { id: '4', name: 'Mandat de gestion locative', type: 'mandate', property: 'Studio Montmartre', date: '2026-02-01', status: 'pending' },
  { id: '5', name: 'Conditions générales de service', type: 'contract', property: 'Général', date: '2025-01-01', status: 'signed' },
];

const typeConfig: Record<string, { label: string; icon: React.ElementType }> = {
  mandate: { label: 'Mandat', icon: FileCheck },
  contract: { label: 'Contrat', icon: FileText },
  inventory: { label: 'État des lieux', icon: FileText },
  insurance: { label: 'Assurance', icon: FileText },
  other: { label: 'Autre', icon: FileText },
};

const statusConfig = {
  signed: { label: 'Signé', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
  pending: { label: 'En attente', className: 'bg-amber-500/10 text-amber-600 border-amber-200' },
  expired: { label: 'Expiré', className: 'bg-red-500/10 text-red-600 border-red-200' },
};

export function OwnerDocuments() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Documents</h1>
        <p className="text-muted-foreground mt-1">Retrouvez l'ensemble de vos documents contractuels</p>
      </div>

      <div className="space-y-3">
        {MOCK_DOCUMENTS.map(doc => {
          const type = typeConfig[doc.type] || typeConfig.other;
          const status = statusConfig[doc.status];
          const TypeIcon = type.icon;
          return (
            <Card key={doc.id} className="border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <TypeIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm truncate">{doc.name}</h3>
                    {doc.version && doc.version > 1 && (
                      <span className="text-xs text-muted-foreground">v{doc.version}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-muted-foreground">{doc.property}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{new Date(doc.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                <Badge variant="outline" className={cn("text-xs flex-shrink-0", status.className)}>
                  {status.label}
                </Badge>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info('Aperçu du document')}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.success('Téléchargement en cours...')}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
