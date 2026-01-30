import { cn } from '@/lib/utils';
import { FileText, Download, Send, Euro, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface Invoice {
  id: string;
  number: string;
  client: string;
  property: string;
  amount: string;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'FAC-2026-0045',
    client: 'SCI Bellecour',
    property: 'Apt. Bellecour',
    amount: '1 250,00€',
    status: 'paid',
    date: '15/01/2026',
  },
  {
    id: '2',
    number: 'FAC-2026-0044',
    client: 'M. Dupont',
    property: 'Studio Confluence',
    amount: '890,50€',
    status: 'pending',
    date: '10/01/2026',
  },
  {
    id: '3',
    number: 'FAC-2026-0043',
    client: 'Mme Lambert',
    property: 'Villa Presqu\'île',
    amount: '2 100,00€',
    status: 'overdue',
    date: '28/12/2025',
  },
  {
    id: '4',
    number: 'FAC-2026-0042',
    client: 'SAS Immo Lyon',
    property: 'Loft Part-Dieu',
    amount: '1 450,00€',
    status: 'paid',
    date: '20/12/2025',
  },
];

const statusConfig = {
  paid: { label: 'Payée', color: 'bg-status-success/10 text-status-success', icon: CheckCircle2 },
  pending: { label: 'En attente', color: 'bg-status-warning/10 text-status-warning', icon: Clock },
  overdue: { label: 'En retard', color: 'bg-status-error/10 text-status-error', icon: AlertCircle },
};

export function BillingPreview({ className }: { className?: string }) {
  return (
    <div className={cn("bg-card rounded-2xl border border-border/50 shadow-elevated overflow-hidden", className)}>
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-status-error/60" />
          <div className="w-3 h-3 rounded-full bg-status-warning/60" />
          <div className="w-3 h-3 rounded-full bg-status-success/60" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs text-muted-foreground">app.noe-conciergerie.com/billing</span>
        </div>
      </div>

      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Facturation</h3>
            <p className="text-xs text-muted-foreground">Gérez vos factures</p>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg">
            <FileText className="w-3.5 h-3.5" />
            Nouvelle facture
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-muted/30">
        <div className="text-center">
          <p className="text-xl font-bold text-status-success">12 450€</p>
          <p className="text-2xs text-muted-foreground">Encaissé ce mois</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-status-warning">3 240€</p>
          <p className="text-2xs text-muted-foreground">En attente</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-status-error">2 100€</p>
          <p className="text-2xs text-muted-foreground">En retard</p>
        </div>
      </div>

      {/* Invoices table */}
      <div className="p-3">
        <div className="bg-background rounded-xl border border-border/50 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-muted/50 text-2xs font-medium text-muted-foreground">
            <div className="col-span-2">N° Facture</div>
            <div className="col-span-3">Client</div>
            <div className="col-span-3">Propriété</div>
            <div className="col-span-2 text-right">Montant</div>
            <div className="col-span-2 text-center">Statut</div>
          </div>

          {/* Table rows */}
          {mockInvoices.map((invoice) => {
            const status = statusConfig[invoice.status];
            const StatusIcon = status.icon;

            return (
              <div
                key={invoice.id}
                className="grid grid-cols-12 gap-2 px-3 py-2.5 border-t border-border/30 items-center hover:bg-muted/30 transition-colors"
              >
                <div className="col-span-2">
                  <span className="text-xs font-medium text-primary">{invoice.number}</span>
                </div>
                <div className="col-span-3">
                  <span className="text-xs text-foreground">{invoice.client}</span>
                </div>
                <div className="col-span-3">
                  <span className="text-xs text-muted-foreground">{invoice.property}</span>
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-xs font-semibold text-foreground">{invoice.amount}</span>
                </div>
                <div className="col-span-2 flex justify-center">
                  <span className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-medium", status.color)}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
