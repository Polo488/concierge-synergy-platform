import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Download, Check, Pencil, Send } from "lucide-react";
import { useFacturation } from "@/hooks/useFacturation";
import { owners, properties, getOwnerByProperty, type Owner } from "@/mocks/facturation";
import { formatMoney, ownerHashColor } from "@/lib/facturationFormat";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface OwnerInvoice {
  owner: Owner;
  propertyCount: number;
  reservationCount: number;
  net: number;
}

function useOwnerInvoices(): OwnerInvoice[] {
  const { reservations, maintenance, cleaning, misc, negativeOps } = useFacturation();
  return useMemo(() => owners.map((o) => {
    const ownerProps = properties.filter((p) => p.ownerId === o.id);
    const propIds = new Set(ownerProps.map((p) => p.id));
    const ownerRes = reservations.filter((r) => propIds.has(r.propertyId));
    const net = ownerRes.reduce((a, r) => a + r.netOwner, 0)
      - maintenance.filter((m) => propIds.has(m.propertyId)).reduce((a, m) => a + m.billedPrice, 0)
      - cleaning.filter((c) => propIds.has(c.propertyId)).reduce((a, c) => a + c.billedPrice, 0)
      - misc.filter((m) => propIds.has(m.propertyId)).reduce((a, m) => a + m.amountHT * (1 + m.vatRate), 0)
      + negativeOps.filter((n) => propIds.has(n.propertyId) && n.decision === "owner").reduce((a, n) => a + n.amount, 0)
      + negativeOps.filter((n) => propIds.has(n.propertyId) && n.decision === "split").reduce((a, n) => a + n.amount / 2, 0);
    return {
      owner: o,
      propertyCount: ownerProps.length,
      reservationCount: ownerRes.length,
      net: Math.round(net * 100) / 100,
    };
  }).filter((i) => i.reservationCount > 0), [reservations, maintenance, cleaning, misc, negativeOps]);
}

function InvoiceCard({ inv, onClick, sent }: { inv: OwnerInvoice; onClick: () => void; sent: boolean }) {
  const c = ownerHashColor(inv.owner.name);
  const initials = inv.owner.name.split(" ").map((p) => p[0]).join("").slice(0, 2);
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="invoice-card relative w-full rounded-[20px] overflow-hidden text-left p-4 sm:p-5 group min-h-[140px]"
      style={{
        background: `linear-gradient(135deg, ${c.from} 0%, ${c.to} 100%)`,
        boxShadow: "0 1px 2px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.16)",
      }}
    >
      <div className="absolute inset-0 bg-white/[0.03] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/15" />
      <div className="relative flex flex-col gap-3 sm:gap-4 h-full">
        {/* Top row: avatar + name + amount */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="h-10 w-10 rounded-full bg-white/[0.12] border border-white/[0.18] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-[16px] sm:text-[17px] font-semibold text-white leading-tight truncate">{inv.owner.name}</h4>
              <p className="text-[11.5px] text-white/65 mt-0.5 leading-tight">
                {inv.propertyCount} logement{inv.propertyCount > 1 ? "s" : ""} · {inv.reservationCount} résa.
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[9.5px] uppercase tracking-[0.1em] text-white/55 leading-none">Net à reverser</p>
            <p
              className="font-semibold text-white tabular-nums leading-none mt-1.5 whitespace-nowrap"
              style={{ fontSize: "clamp(20px, 5.2vw, 24px)", letterSpacing: "-0.02em" }}
            >
              {formatMoney(inv.net)}
            </p>
          </div>
        </div>
        {/* Bottom row: status badges */}
        <div className="flex items-center gap-2 flex-wrap mt-auto">
          <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-medium",
            sent ? "bg-white/[0.18] text-white" : "bg-white/[0.12] text-white/85"
          )}>
            {sent ? "✓ Envoyée" : "Brouillon"}
          </span>
          <span className="text-[11px] text-white/60 inline-flex items-center gap-1">
            <Mail className="h-3 w-3" strokeWidth={1.8} /> mail + espace Noé
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function InvoicePreview({ inv, onClose }: { inv: OwnerInvoice | null; onClose: () => void }) {
  const { reservations, maintenance, cleaning, misc, negativeOps, periodLabel, cartG, markInvoiceSent } = useFacturation();

  if (!inv) return null;
  const propIds = new Set(properties.filter((p) => p.ownerId === inv.owner.id).map((p) => p.id));
  const ownerRes = reservations.filter((r) => propIds.has(r.propertyId));
  const ownerMaint = maintenance.filter((m) => propIds.has(m.propertyId));
  const ownerClean = cleaning.filter((c) => propIds.has(c.propertyId));
  const ownerMisc = misc.filter((m) => propIds.has(m.propertyId));
  const ownerNegs = negativeOps.filter((n) => propIds.has(n.propertyId) && n.decision !== null);

  const grossTotal = ownerRes.reduce((a, r) => a + r.gross, 0);
  const noeTotal = ownerRes.reduce((a, r) => a + r.noeFee, 0);

  return (
    <AnimatePresence>
      {inv && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="invoice-modal fixed inset-0 z-50 flex flex-col"
          >
            {/* TOOLBAR */}
            <div className="flex items-center justify-between gap-2 px-3 sm:px-6 py-2.5 sm:py-3 bg-[hsl(var(--bill-surface-1))]/95 backdrop-blur-xl border-b border-[hsl(var(--bill-stroke-soft))]">
              {/* Left: close + title */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-[hsl(var(--bill-surface-hover))] text-[hsl(var(--bill-label))] flex-shrink-0">
                  <X className="h-4 w-4" strokeWidth={1.8} />
                </button>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.1em] text-[hsl(var(--bill-label-3))] leading-none">Facture · {periodLabel}</p>
                  <p className="text-[13px] sm:text-sm font-semibold text-[hsl(var(--bill-label))] truncate leading-tight mt-0.5">{inv.owner.name}</p>
                </div>
              </div>
              {/* Right: actions — icons on mobile, icon+label sm+ */}
              <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                <ToolbarBtn icon={Download} label="PDF" onClick={() => toast.success("PDF téléchargé")} />
                <ToolbarBtn icon={Mail} label="Envoyer" onClick={() => { markInvoiceSent(inv.owner.id); toast.success(`Facture envoyée à ${inv.owner.name}`); onClose(); }} primary />
                <ToolbarBtn icon={Check} label="Marquée" onClick={() => { markInvoiceSent(inv.owner.id); toast.success("Statut mis à jour"); onClose(); }} />
                <ToolbarBtn icon={Pencil} label="Éditer" onClick={onClose} />
              </div>
            </div>
            {/* DOCUMENT */}
            <div className="flex-1 overflow-y-auto bg-[hsl(var(--bill-bg))]">
              <div className="px-3 sm:px-6 py-4 sm:py-8 flex justify-center">
                <div className="w-full max-w-3xl bg-[#FAF8F4] text-[#1a1a2e] rounded-[12px] shadow-[0_24px_64px_rgba(0,0,0,0.18)] p-5 sm:p-10 lg:p-12 font-body" style={{ fontFamily: "Inter, sans-serif" }}>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 pb-5 sm:pb-6 border-b border-black/10">
                    <div>
                      <p className="text-2xl font-heading font-semibold tracking-tight">Noé</p>
                      <p className="text-xs text-black/55 mt-1">Conciergerie STR · Paris</p>
                      <p className="text-xs text-black/55">SIRET 902 412 537 00018</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-[10px] uppercase tracking-[0.1em] text-black/45">Facture</p>
                      <p className="text-[13px] sm:text-base font-mono">FAC-{periodLabel.slice(0, 3).toUpperCase()}-{inv.owner.id.toUpperCase()}</p>
                      <p className="text-xs text-black/55 mt-1">Émise le {new Date().toLocaleDateString("fr-FR")}</p>
                      <p className="text-xs text-black/55">Période : {periodLabel}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 py-5 sm:py-6 border-b border-black/10 text-sm">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.1em] text-black/45">Adressée à</p>
                      <p className="mt-1 font-medium">{inv.owner.name}</p>
                      <p className="text-black/65 break-all text-[13px]">{inv.owner.email}</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-[10px] uppercase tracking-[0.1em] text-black/45">Coordonnées bancaires</p>
                      <p className="mt-1 font-mono text-[11px] sm:text-xs break-all">{inv.owner.iban}</p>
                      <p className="text-black/55 text-xs">{inv.owner.bic}</p>
                    </div>
                  </div>

                  <DocSection title={`Réservations (${ownerRes.length})`}>
                    <DocTable headers={["Date", "Voyageur", "Bien", "N.", "Brut", "Net prop."]}>
                      {ownerRes.map((r) => (
                        <tr key={r.id} className="border-t border-black/5">
                          <td className="py-1.5 text-[11px] sm:text-xs whitespace-nowrap">{new Date(r.checkIn).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })}</td>
                          <td className="py-1.5 text-[11px] sm:text-xs">{r.guest}</td>
                          <td className="py-1.5 text-[11px] sm:text-xs text-black/65">{properties.find(p => p.id === r.propertyId)?.name}</td>
                          <td className="py-1.5 text-[11px] sm:text-xs text-right">{r.nights}</td>
                          <td className="py-1.5 text-[11px] sm:text-xs text-right tabular-nums whitespace-nowrap">{formatMoney(r.gross)}</td>
                          <td className="py-1.5 text-[11px] sm:text-xs text-right tabular-nums font-medium whitespace-nowrap">{formatMoney(r.netOwner)}</td>
                        </tr>
                      ))}
                    </DocTable>
                  </DocSection>

                  {ownerNegs.length > 0 && (
                    <DocSection title="Opérations négatives traitées">
                      <DocTable headers={["Réf.", "Voyageur", "Décision", "Impact"]}>
                        {ownerNegs.map((n) => (
                          <tr key={n.id} className="border-t border-black/5">
                            <td className="py-1.5 text-[11px] sm:text-xs whitespace-nowrap">{n.ref}</td>
                            <td className="py-1.5 text-[11px] sm:text-xs">{n.guest}</td>
                            <td className="py-1.5 text-[11px] sm:text-xs text-black/65">
                              {n.decision === "owner" ? "Imputé propriétaire" : n.decision === "noe" ? "Absorbé Noé" : n.decision === "split" ? "Réparti 50/50" : "Personnalisé"}
                            </td>
                            <td className="py-1.5 text-[11px] sm:text-xs text-right tabular-nums text-[#B91C1C] whitespace-nowrap">{formatMoney(n.decision === "split" ? n.amount / 2 : n.decision === "owner" ? n.amount : 0)}</td>
                          </tr>
                        ))}
                      </DocTable>
                    </DocSection>
                  )}

                  <DocSection title="Prestations complémentaires">
                    <DocTable headers={["Date", "Type", "Bien", "Prix"]}>
                      {[
                        ...ownerMaint.map((m) => ({ id: m.id, date: m.date, type: "Maintenance", prop: m.propertyId, amount: m.billedPrice })),
                        ...ownerClean.map((c) => ({ id: c.id, date: c.date, type: c.type === "menage" ? "Ménage" : "Linge", prop: c.propertyId, amount: c.billedPrice })),
                        ...ownerMisc.map((m) => ({ id: m.id, date: m.date, type: m.label, prop: m.propertyId, amount: m.amountHT * (1 + m.vatRate) })),
                      ].map((l) => (
                        <tr key={l.id} className="border-t border-black/5">
                          <td className="py-1.5 text-[11px] sm:text-xs whitespace-nowrap">{new Date(l.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })}</td>
                          <td className="py-1.5 text-[11px] sm:text-xs">{l.type}</td>
                          <td className="py-1.5 text-[11px] sm:text-xs text-black/65">{properties.find(p => p.id === l.prop)?.name}</td>
                          <td className="py-1.5 text-[11px] sm:text-xs text-right tabular-nums whitespace-nowrap">{formatMoney(l.amount)}</td>
                        </tr>
                      ))}
                    </DocTable>
                  </DocSection>

                  <DocSection title="Honoraires conciergerie">
                    <div className="flex justify-between text-sm py-2 gap-3">
                      <span>Honoraires Noé ({(inv.owner.commissionRate * 100).toFixed(0)}% net OTA)</span>
                      <span className="tabular-nums whitespace-nowrap">{formatMoney(noeTotal)}</span>
                    </div>
                    <div className="flex justify-between text-xs py-1 text-black/55 gap-3">
                      <span>Sur un brut de</span>
                      <span className="tabular-nums whitespace-nowrap">{formatMoney(grossTotal)}</span>
                    </div>
                  </DocSection>

                  <div className="mt-6 sm:mt-8 flex justify-end">
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-[0.1em] text-black/45">Total net à reverser</p>
                      <p className="text-[28px] sm:text-3xl font-heading font-semibold tabular-nums" style={{ letterSpacing: "-0.02em" }}>{formatMoney(inv.net)}</p>
                      <p className="text-[10px] sm:text-[11px] text-black/50 mt-1">TVA non applicable, art. 293 B CGI</p>
                    </div>
                  </div>

                  {cartG && (
                    <p className="mt-8 sm:mt-10 text-[10px] text-black/45 leading-relaxed border-t border-black/10 pt-4">
                      Reversement effectué via le compte séquestre Carte G n° CG-2026-001 conformément à l'article 6 de la loi Hoguet et au mandat de gestion. IBAN bénéficiaire : <span className="font-mono break-all">{inv.owner.iban}</span>.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ToolbarBtn({ icon: Icon, label, onClick, primary }: { icon: any; label: string; onClick: () => void; primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-full text-[12.5px] font-medium transition-colors min-h-[36px]",
        primary
          ? "bg-[#FF5C1A] text-white hover:bg-[#FF5C1A]/90 px-2.5 sm:px-3.5"
          : "text-[hsl(var(--bill-label-2))] hover:bg-[hsl(var(--bill-surface-hover))] px-2.5 sm:px-3"
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={1.8} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
function DocSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h3 className="text-[11px] uppercase tracking-[0.1em] text-black/45 mb-2">{title}</h3>
      {children}
    </section>
  );
}
function DocTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-[10px] uppercase tracking-[0.08em] text-black/40">
          {headers.map((h, i) => (
            <th key={h} className={cn("py-1 font-medium", (i >= headers.length - 2) && "text-right")}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

export function InvoicesTab() {
  const invoices = useOwnerInvoices();
  const { sentOwnerIds, sendAllInvoices, generateInvoices, invoicesGenerated } = useFacturation();
  const [open, setOpen] = useState<OwnerInvoice | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [sending, setSending] = useState(false);

  const remaining = invoices.filter((i) => !sentOwnerIds.has(i.owner.id)).length;

  return (
    <div className="space-y-5">
      {!invoicesGenerated && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-[14px] bg-white/[0.04] border border-white/[0.06]">
          <p className="text-sm text-white/75">Les factures sont générées automatiquement à partir des données du mois. Vous pouvez les prévisualiser avant envoi.</p>
          <button
            onClick={() => { generateInvoices(); toast.success(`${invoices.length} factures générées`); }}
            className="px-4 py-2 rounded-[12px] text-sm font-medium bg-[#FF5C1A] hover:bg-[#FF5C1A]/90 text-white shadow-[0_4px_14px_rgba(255,92,26,0.3)] active:scale-[0.98] transition-all"
          >
            Générer maintenant
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {invoices.map((inv) => (
          <InvoiceCard key={inv.owner.id} inv={inv} sent={sentOwnerIds.has(inv.owner.id)} onClick={() => setOpen(inv)} />
        ))}
      </div>

      {remaining > 0 && (
        <div className="pt-2">
          <button
            onClick={() => setConfirm(true)}
            className="w-full px-6 py-4 rounded-[16px] text-sm font-semibold bg-[#FF5C1A] hover:bg-[#FF5C1A]/90 text-white shadow-[0_8px_24px_rgba(255,92,26,0.35)] active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2"
          >
            <Send className="h-4 w-4" strokeWidth={1.5} />
            Envoyer les {remaining} factures aux propriétaires
          </button>
        </div>
      )}

      <InvoicePreview inv={open} onClose={() => setOpen(null)} />

      <AnimatePresence>
        {confirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => !sending && setConfirm(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-sm rounded-[20px] bg-[#1a1a2e]/95 backdrop-blur-2xl border border-white/[0.08] p-6 text-center"
            >
              <h3 className="text-base font-semibold text-white">Envoyer {remaining} factures&nbsp;?</h3>
              <p className="text-sm text-white/60 mt-2">Les factures seront envoyées par email et déposées sur l'espace Noé de chaque propriétaire.</p>
              {sending && (
                <div className="mt-4 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: remaining * 0.12, ease: "linear" }} className="h-full bg-[#FF5C1A]" />
                </div>
              )}
              <div className="flex gap-2 mt-5">
                <button disabled={sending} onClick={() => setConfirm(false)} className="flex-1 px-4 py-2.5 rounded-[12px] text-sm bg-white/[0.05] text-white/85 hover:bg-white/[0.08]">Annuler</button>
                <button
                  disabled={sending}
                  onClick={async () => { setSending(true); await sendAllInvoices(); toast.success("Toutes les factures ont été envoyées"); setSending(false); setConfirm(false); }}
                  className="flex-1 px-4 py-2.5 rounded-[12px] text-sm font-semibold bg-[#FF5C1A] text-white hover:bg-[#FF5C1A]/90 disabled:opacity-60"
                >
                  {sending ? "Envoi…" : "Confirmer"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
