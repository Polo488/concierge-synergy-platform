import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Receipt, FileDown, Plus, CheckCircle2, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { useAuth } from '@/contexts/AuthContext';

type LineItem = { date: string; property: string; amount: number };
type Invoice = { id: string; period: string; total: number; status: 'draft' | 'sent' | 'paid'; items: LineItem[] };

const CURRENT_MONTH_ITEMS: LineItem[] = [
  { date: '2026-05-01', property: 'Appartement 12 Rue du Port', amount: 45 },
  { date: '2026-05-02', property: 'Studio 8 Avenue des Fleurs', amount: 35 },
  { date: '2026-05-03', property: 'Maison 23 Rue de la Paix', amount: 65 },
  { date: '2026-05-04', property: 'Appartement 12 Rue du Port', amount: 45 },
  { date: '2026-05-05', property: 'Loft 72 Rue des Arts', amount: 55 },
  { date: '2026-05-06', property: 'Studio 8 Avenue des Fleurs', amount: 35 },
  { date: '2026-05-07', property: 'Maison 23 Rue de la Paix', amount: 65 },
  { date: '2026-05-08', property: 'Appartement 12 Rue du Port', amount: 45 },
];

const PAST_INVOICES: Invoice[] = [
  { id: 'INV-2026-04', period: 'Avril 2026', total: 1240, status: 'paid', items: [] },
  { id: 'INV-2026-03', period: 'Mars 2026', total: 1080, status: 'paid', items: [] },
  { id: 'INV-2026-02', period: 'Février 2026', total: 920, status: 'paid', items: [] },
];

const CleaningInvoicing = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>(PAST_INVOICES);

  useEffect(() => { document.title = 'Facturation'; }, []);

  const monthTotal = useMemo(() => CURRENT_MONTH_ITEMS.reduce((s, i) => s + i.amount, 0), []);
  const monthCount = CURRENT_MONTH_ITEMS.length;

  const generateInvoice = () => {
    const doc = new jsPDF();
    const date = new Date().toISOString().slice(0, 10);
    const id = `INV-${date.slice(0, 7)}`;

    doc.setFontSize(20);
    doc.text('Facture ménage', 20, 25);

    doc.setFontSize(11);
    doc.text(`Prestataire : ${user?.name || 'Cleaning Agent'}`, 20, 40);
    doc.text(`Période : Mai 2026`, 20, 47);
    doc.text(`N° : ${id}`, 20, 54);
    doc.text(`Date : ${date}`, 20, 61);

    doc.setFontSize(10);
    doc.text('Date', 20, 80);
    doc.text('Logement', 60, 80);
    doc.text('Montant', 170, 80, { align: 'right' });
    doc.line(20, 82, 190, 82);

    let y = 90;
    CURRENT_MONTH_ITEMS.forEach((item) => {
      doc.text(item.date, 20, y);
      doc.text(item.property.slice(0, 50), 60, y);
      doc.text(`${item.amount.toFixed(2)} €`, 170, y, { align: 'right' });
      y += 7;
    });

    doc.line(20, y + 2, 190, y + 2);
    doc.setFontSize(13);
    doc.text(`Total : ${monthTotal.toFixed(2)} €`, 170, y + 12, { align: 'right' });

    doc.save(`${id}.pdf`);

    setInvoices([
      { id, period: 'Mai 2026', total: monthTotal, status: 'draft', items: CURRENT_MONTH_ITEMS },
      ...invoices,
    ]);
    toast.success('Facture générée', { description: `${id}.pdf téléchargé` });
  };

  const send = (id: string) => {
    setInvoices(invoices.map((i) => (i.id === id ? { ...i, status: 'sent' } : i)));
    toast.success('Facture envoyée à la conciergerie');
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Receipt className="h-6 w-6 text-primary" />
          Facturation
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Suivi de vos prestations et émission des factures.</p>
      </header>

      {/* À facturer ce mois */}
      <Card className="border-primary/30 bg-primary/[0.03]">
        <CardContent className="pt-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">À facturer — Mai 2026</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-black tabular-nums text-foreground">{monthTotal.toFixed(2)}</span>
            <span className="text-2xl font-bold text-muted-foreground">€</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{monthCount} ménages effectués</p>
          <Button onClick={generateInvoice} className="mt-4 w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-1.5" />
            Générer la facture du mois
          </Button>
        </CardContent>
      </Card>

      {/* Détail */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-[15px] font-bold mb-3">Détail des prestations</h2>
          <div className="space-y-2">
            {CURRENT_MONTH_ITEMS.map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-foreground truncate">{item.property}</p>
                  <p className="text-[11px] text-muted-foreground">{item.date}</p>
                </div>
                <span className="text-[14px] font-bold tabular-nums">{item.amount.toFixed(2)} €</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historique factures */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-[15px] font-bold mb-3">Historique des factures</h2>
          <div className="space-y-2">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold">{inv.period}</p>
                  <p className="text-[11px] text-muted-foreground">{inv.id} · {inv.total.toFixed(2)} €</p>
                </div>
                <StatusBadge status={inv.status} />
                {inv.status === 'draft' && (
                  <Button size="sm" variant="outline" onClick={() => send(inv.id)} className="gap-1">
                    <Send className="h-3 w-3" /> Envoyer
                  </Button>
                )}
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <FileDown className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const StatusBadge = ({ status }: { status: Invoice['status'] }) => {
  if (status === 'paid')
    return <Badge className="bg-[hsl(120,39%,93%)] text-[hsl(120,30%,34%)] border-0 hover:bg-[hsl(120,39%,93%)]"><CheckCircle2 className="h-3 w-3 mr-1" />Payée</Badge>;
  if (status === 'sent')
    return <Badge className="bg-[hsl(210,100%,94%)] text-[hsl(213,84%,24%)] border-0 hover:bg-[hsl(210,100%,94%)]">Envoyée</Badge>;
  return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Brouillon</Badge>;
};

export default CleaningInvoicing;
