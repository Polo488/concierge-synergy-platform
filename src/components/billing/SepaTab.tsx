import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, FileDown } from "lucide-react";
import { useFacturation } from "@/hooks/useFacturation";
import { owners, properties, currentUser } from "@/mocks/facturation";
import { formatMoney, maskIban } from "@/lib/facturationFormat";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function SepaTab() {
  const { reservations, maintenance, cleaning, misc, negativeOps, periodLabel, generateSepa, sepaGenerated, sepaTransmitted, markSepaTransmitted } = useFacturation();

  const transfers = useMemo(() => owners.map((o) => {
    const propIds = new Set(properties.filter((p) => p.ownerId === o.id).map((p) => p.id));
    const ownerRes = reservations.filter((r) => propIds.has(r.propertyId));
    const net = ownerRes.reduce((a, r) => a + r.netOwner, 0)
      - maintenance.filter((m) => propIds.has(m.propertyId)).reduce((a, m) => a + m.billedPrice, 0)
      - cleaning.filter((c) => propIds.has(c.propertyId)).reduce((a, c) => a + c.billedPrice, 0)
      - misc.filter((m) => propIds.has(m.propertyId)).reduce((a, m) => a + m.amountHT * (1 + m.vatRate), 0)
      + negativeOps.filter((n) => propIds.has(n.propertyId) && n.decision === "owner").reduce((a, n) => a + n.amount, 0);
    return { owner: o, amount: Math.round(net * 100) / 100, ref: `FAC-${periodLabel.slice(0, 3).toUpperCase()}-${o.id.toUpperCase()}`, hasReservations: ownerRes.length > 0 };
  }).filter((t) => t.hasReservations && t.amount > 0), [reservations, maintenance, cleaning, misc, negativeOps, periodLabel]);

  const total = transfers.reduce((a, t) => a + t.amount, 0);
  const [executionDate, setExecutionDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [generating, setGenerating] = useState(false);
  const [fileHash, setFileHash] = useState<string | null>(null);

  async function handleGenerate() {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 900));
    const xml = generateSepa();
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `noe_sepa_${periodLabel.toLowerCase().replace(/\s/g, "_")}.xml`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    setFileHash(`SHA-${Math.random().toString(36).slice(2, 10).toUpperCase()}`);
    setGenerating(false);
    toast.success("Fichier XML SEPA généré");
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[20px] bg-white/[0.03] backdrop-blur-xl border border-white/[0.05] p-5 sm:p-7 lg:p-9">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Stat label="Total à virer" value={formatMoney(total)} large />
          <Stat label="Bénéficiaires" value={`${transfers.length}`} />
          <Stat label="IBAN émetteur" value={maskIban(currentUser.sepaIban)} mono />
          <Stat label="Date d'exécution" value={
            <input
              type="date"
              value={executionDate}
              onChange={(e) => setExecutionDate(e.target.value)}
              className="bg-transparent border border-white/[0.08] rounded-[10px] px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#FF5C1A]/40 w-full min-h-[36px]"
            />
          } />
        </div>
      </div>

      {/* MOBILE: card list */}
      <div className="space-y-2 lg:hidden">
        {transfers.map((t) => (
          <div key={t.owner.id} className="rounded-[16px] bg-white/[0.03] border border-white/[0.05] p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0">
                <p className="font-semibold text-white text-[15px] truncate">{t.owner.name}</p>
                <p className="text-[11px] font-mono text-white/55 mt-0.5 truncate">{maskIban(t.owner.iban)}</p>
              </div>
              <p className="text-[18px] font-semibold text-white tabular-nums whitespace-nowrap flex-shrink-0">{formatMoney(t.amount)}</p>
            </div>
            <div className="flex items-center justify-between gap-2 mt-2">
              <span className="text-[10.5px] font-mono text-white/45 truncate">{t.ref}</span>
              <span className={cn("px-2 py-0.5 rounded-full text-[10.5px] font-medium flex-shrink-0",
                sepaTransmitted ? "bg-[#4ADE80]/15 text-[#4ADE80]" : sepaGenerated ? "bg-[#6B7AE8]/15 text-[#6B7AE8]" : "bg-white/[0.08] text-white/65"
              )}>
                {sepaTransmitted ? "Exécuté" : sepaGenerated ? "Inclus dans XML" : "À générer"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP: table */}
      <div className="hidden lg:block rounded-[20px] bg-white/[0.02] border border-white/[0.04] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.08em] text-white/45 border-b border-white/[0.06]">
              <th className="px-6 py-3 text-left font-medium">Bénéficiaire</th>
              <th className="px-4 py-3 text-left font-medium">IBAN</th>
              <th className="px-4 py-3 text-left font-medium">BIC</th>
              <th className="px-4 py-3 text-left font-medium">Référence</th>
              <th className="px-4 py-3 text-right font-medium">Montant</th>
              <th className="px-6 py-3 text-left font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((t, i) => (
              <tr key={t.owner.id} className={cn("border-t border-white/[0.04]", i % 2 === 1 && "bg-white/[0.015]")}>
                <td className="px-6 py-3 text-white">{t.owner.name}</td>
                <td className="px-4 py-3 text-white/65 font-mono text-xs">{maskIban(t.owner.iban)}</td>
                <td className="px-4 py-3 text-white/55 font-mono text-xs">{t.owner.bic}</td>
                <td className="px-4 py-3 text-white/65 font-mono text-xs">{t.ref}</td>
                <td className="px-4 py-3 text-right tabular-nums text-white font-semibold">{formatMoney(t.amount)}</td>
                <td className="px-6 py-3">
                  <span className={cn("px-2 py-0.5 rounded-full text-[10.5px] font-medium",
                    sepaTransmitted ? "bg-[#4ADE80]/15 text-[#4ADE80]" : sepaGenerated ? "bg-[#6B7AE8]/15 text-[#6B7AE8]" : "bg-white/[0.08] text-white/65"
                  )}>
                    {sepaTransmitted ? "Exécuté" : sepaGenerated ? "Inclus dans XML" : "À générer"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center gap-3 pt-2">
        {!sepaGenerated ? (
          <motion.button
            disabled={generating || transfers.length === 0}
            onClick={handleGenerate}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto sm:min-w-[320px] px-5 sm:px-6 py-4 rounded-[16px] text-[14px] sm:text-sm font-semibold bg-[#FF5C1A] hover:bg-[#FF5C1A]/90 text-white shadow-[0_8px_24px_rgba(255,92,26,0.35)] disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2 justify-center min-h-[48px]"
          >
            {generating ? (
              <motion.span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} />
            ) : <FileDown className="h-4 w-4 flex-shrink-0" strokeWidth={1.8} />}
            <span className="truncate">{generating ? "Génération…" : "Générer le XML SEPA"}</span>
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl rounded-[16px] bg-[#4ADE80]/[0.06] border border-[#4ADE80]/[0.2] p-5 text-center"
          >
            <CheckCircle2 className="h-8 w-8 text-[#4ADE80] mx-auto" strokeWidth={1.5} />
            <p className="mt-3 text-sm text-white/85">Fichier généré et téléchargé.</p>
            <p className="text-xs text-white/45 mt-1">Hash : <span className="font-mono">{fileHash}</span> • {new Date().toLocaleString("fr-FR")}</p>
            {!sepaTransmitted && (
              <button
                onClick={() => { markSepaTransmitted(); toast.success("Marqué comme transmis à la banque"); }}
                className="mt-4 px-4 py-2 rounded-[12px] text-sm bg-white/[0.06] hover:bg-white/[0.1] text-white/85"
              >
                Marquer comme transmis à la banque
              </button>
            )}
            {sepaTransmitted && (
              <p className="mt-4 text-xs text-[#4ADE80]">✓ Transmis à la banque</p>
            )}
          </motion.div>
        )}
      </div>

      <p className="text-[11px] text-white/40 leading-relaxed pt-3 max-w-3xl">
        Conformément à l'article 6 de la loi Hoguet et au mandat de gestion, les fonds détenus pour le compte des propriétaires sont reversés via le compte séquestre Carte G n° {currentUser.sepaAccountRef}.
      </p>
    </div>
  );
}

function Stat({ label, value, large, mono }: { label: string; value: React.ReactNode; large?: boolean; mono?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.12em] text-white/45">{label}</p>
      <div className={cn("mt-2 text-white", large ? "text-[36px] font-light leading-none tracking-tight" : "text-base", mono && "font-mono text-sm")} style={large ? { fontVariantNumeric: "tabular-nums" } : undefined}>
        {value}
      </div>
    </div>
  );
}
