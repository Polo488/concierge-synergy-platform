import { useFacturationMetier } from "@/hooks/useFacturationMetier";
import { formatMoney, shortDate } from "@/lib/facturationFormat";
import { CheckCircle2, AlertTriangle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";

export function EscrowTab() {
  const { escrow, escrowMovements, closingChecks, monthClosed, closeMonth } = useFacturationMetier();

  return (
    <div className="space-y-5">
      {/* Hero séquestre */}
      <div className="rounded-[20px] bg-white/[0.03] backdrop-blur-xl border border-white/[0.05] p-7">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Stat label="Solde actuel séquestre" value={formatMoney(escrow.currentBalance)} large />
          <Stat label="Total SEPA simulé" value={formatMoney(-escrow.sepaTotal)} sub={`${escrow.sepaTotal > 0 ? "Sortie prévue" : "Aucune sortie"}`} />
          <Stat
            label="Solde après SEPA"
            value={formatMoney(escrow.simulatedAfterSepa)}
            large
            accent={escrow.simulationOk ? "green" : "red"}
            sub={escrow.simulationOk ? "Simulation conforme ✓" : "INTERDIT — séquestre négatif"}
          />
        </div>
      </div>

      {/* Bannière clôture */}
      <div className={cn(
        "rounded-[16px] border px-5 py-4",
        monthClosed
          ? "bg-[#6B7AE8]/[0.08] border-[#6B7AE8]/[0.2]"
          : closingChecks.canClose
            ? "bg-[#4ADE80]/[0.06] border-[#4ADE80]/[0.2]"
            : "bg-[#F5C842]/[0.06] border-[#F5C842]/[0.2]"
      )}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            {monthClosed ? <Lock className="h-5 w-5 text-[#6B7AE8] mt-0.5" strokeWidth={1.5} />
              : closingChecks.canClose ? <CheckCircle2 className="h-5 w-5 text-[#4ADE80] mt-0.5" strokeWidth={1.5} />
              : <AlertTriangle className="h-5 w-5 text-[#F5C842] mt-0.5" strokeWidth={1.5} />}
            <div>
              <p className="text-sm font-semibold text-white">
                {monthClosed ? "Mois clôturé" : closingChecks.canClose ? "Prêt à clôturer le mois" : "Clôture impossible"}
              </p>
              {!monthClosed && closingChecks.blockers.length > 0 && (
                <ul className="mt-1 space-y-0.5">
                  {closingChecks.blockers.map((b) => (
                    <li key={b} className="text-xs text-white/65">• {b}</li>
                  ))}
                </ul>
              )}
              {monthClosed && (
                <p className="text-xs text-white/65 mt-0.5">Octobre 2026 verrouillé. BA et factures sont immuables.</p>
              )}
            </div>
          </div>
          {!monthClosed && (
            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={!closingChecks.canClose}
              onClick={() => { closeMonth(); toast.success("Mois clôturé — BA et factures verrouillés"); }}
              className="px-5 py-2.5 rounded-[12px] text-sm font-semibold bg-[#FF5C1A] hover:bg-[#FF5C1A]/90 text-white shadow-[0_4px_14px_rgba(255,92,26,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clôturer Octobre 2026
            </motion.button>
          )}
        </div>
      </div>

      {/* Mouvements */}
      <div className="rounded-[20px] bg-white/[0.02] border border-white/[0.04] overflow-hidden">
        <div className="px-6 py-3 border-b border-white/[0.05]">
          <h3 className="text-sm font-semibold text-white">Mouvements séquestre</h3>
          <p className="text-[11px] text-white/45 mt-0.5">Compte Carte G · Solde reporté + entrées du mois</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-[0.08em] text-white/45 border-b border-white/[0.06]">
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Libellé</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Référence</th>
              <th className="px-6 py-3 font-medium text-right">Montant</th>
            </tr>
          </thead>
          <tbody>
            {escrowMovements.map((m, i) => (
              <tr key={m.id} className={cn("border-t border-white/[0.04]", i % 2 === 1 && "bg-white/[0.015]")}>
                <td className="px-6 py-3 text-white/70">{shortDate(m.date)}</td>
                <td className="px-4 py-3 text-white/85 font-mono text-xs">{m.label}</td>
                <td className="px-4 py-3 text-white/65 text-xs">
                  {m.type === "ota_in" ? "Entrée OTA" : m.type === "sepa_out" ? "Sortie SEPA" : m.type === "fee" ? "Frais" : "Manuel"}
                </td>
                <td className="px-4 py-3 text-white/55 font-mono text-xs">{m.ref ?? "—"}</td>
                <td className={cn("px-6 py-3 text-right tabular-nums font-semibold", m.amount >= 0 ? "text-[#4ADE80]" : "text-[#F87171]")}>
                  {formatMoney(m.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value, large, sub, accent }: { label: string; value: string; large?: boolean; sub?: string; accent?: "green" | "red" }) {
  const valueColor = accent === "green" ? "text-[#4ADE80]" : accent === "red" ? "text-[#F87171]" : "text-white";
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.12em] text-white/45">{label}</p>
      <div className={cn("mt-2 font-semibold tabular-nums", valueColor)} style={large ? { fontSize: "clamp(28px, 6vw, 36px)", letterSpacing: "-0.025em", lineHeight: 1 } : { fontSize: 18 }}>
        {value}
      </div>
      {sub && <p className={cn("text-[11px] mt-1", accent === "red" ? "text-[#F87171]" : accent === "green" ? "text-[#4ADE80]" : "text-white/55")}>{sub}</p>}
    </div>
  );
}
