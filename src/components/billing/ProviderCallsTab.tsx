import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wrench, Mail, Check, FileText, Copy, ExternalLink, Send, ChevronDown } from "lucide-react";
import { useProviderCalls, type CallStatus } from "@/hooks/useProviderCalls";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<CallStatus | "no_call", string> = {
  no_call: "À générer",
  draft: "Brouillon",
  sent_to_provider: "Envoyé",
  provider_validated: "Validé prestataire",
  invoice_received: "Facture reçue",
  paid: "Payé",
};

const STATUS_TONE: Record<string, string> = {
  no_call: "bg-white/[0.06] text-white/55",
  draft: "bg-white/[0.08] text-white/70",
  sent_to_provider: "bg-[#F5C842]/15 text-[#F5C842]",
  provider_validated: "bg-[#6B7AE8]/15 text-[#6B7AE8]",
  invoice_received: "bg-[#6B7AE8]/20 text-[#A8B4F0]",
  paid: "bg-[#22C55E]/15 text-[#4ADE80]",
};

const fmtEUR = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export function ProviderCallsTab() {
  const { providers, missions, calls, loading, callsByProvider, missionsByProvider, generateAllCalls, sendCall, markPaid } =
    useProviderCalls("2026-10");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const stats = useMemo(() => {
    const totalToBill = providers.reduce(
      (s, p) => s + missionsByProvider(p.id).reduce((x, m) => x + Number(m.agreed_price), 0),
      0
    );
    const sent = calls.filter((c) => c.status !== "draft").length;
    const pendingGen = providers.filter((p) => missionsByProvider(p.id).length > 0 && !callsByProvider(p.id)).length;
    return { totalToBill, sent, pendingGen, providersCount: providers.length };
  }, [providers, missions, calls]);

  const handleGenerateAll = async () => {
    setBusy(true);
    const n = await generateAllCalls();
    setBusy(false);
    if (n > 0) toast.success(`${n} appel${n > 1 ? "s" : ""} à facturation généré${n > 1 ? "s" : ""}`);
    else toast.info("Tous les appels du mois sont déjà générés");
  };

  const handleSend = async (callId: string, providerName: string, providerEmail: string | null) => {
    await sendCall(callId);
    toast.success(`Appel envoyé à ${providerName}`, {
      description: providerEmail ? `Lien sécurisé envoyé à ${providerEmail}` : "Lien sécurisé généré",
    });
  };

  const copyLink = async (token: string) => {
    const url = `${window.location.origin}/provider-call/${token}`;
    try { await navigator.clipboard.writeText(url); toast.success("Lien copié"); }
    catch { toast.error("Impossible de copier le lien"); }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-[112px] rounded-[20px] bg-white/[0.03] border border-white/[0.04] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Strip stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { label: "Prestataires actifs", value: stats.providersCount.toString() },
          { label: "Total à facturer", value: fmtEUR(stats.totalToBill) },
          { label: "Appels envoyés", value: `${stats.sent}/${calls.length || stats.providersCount}` },
          { label: "À générer", value: stats.pendingGen.toString(), warn: stats.pendingGen > 0 },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-[14px] border border-white/[0.05] bg-white/[0.025] backdrop-blur-xl p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
          >
            <div className="text-[11px] uppercase tracking-[0.06em] text-white/45 font-medium">{s.label}</div>
            <div
              className={cn(
                "mt-1 text-[20px] font-light tracking-tight tabular-nums",
                s.warn ? "text-[#F5C842]" : "text-white"
              )}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Bouton génération en lot */}
      {stats.pendingGen > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-3 rounded-[14px] border border-[#F5C842]/20 bg-[#F5C842]/[0.06] px-4 py-3"
        >
          <div className="flex items-center gap-2.5 text-[13px] text-white/85">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#F5C842]/15">
              <Mail size={14} strokeWidth={1.75} className="text-[#F5C842]" />
            </span>
            {stats.pendingGen} prestataire{stats.pendingGen > 1 ? "s" : ""} sans appel à facturation pour ce mois.
          </div>
          <button
            onClick={handleGenerateAll}
            disabled={busy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] bg-[#FF5C1A] hover:bg-[#FF5C1A]/90 text-white text-[12.5px] font-semibold shadow-[0_3px_10px_rgba(255,92,26,0.30)] disabled:opacity-50 transition-all active:scale-[0.98] min-h-[36px]"
          >
            <Send size={13} strokeWidth={1.75} /> Générer tous les appels
          </button>
        </motion.div>
      )}

      {/* Liste prestataires */}
      <div className="space-y-2.5">
        <AnimatePresence initial={false}>
          {providers.map((p) => {
            const ms = missionsByProvider(p.id);
            const call = callsByProvider(p.id);
            const total = ms.reduce((s, m) => s + Number(m.agreed_price), 0);
            const status: CallStatus | "no_call" = call?.status ?? (ms.length === 0 ? "no_call" : "no_call");
            const isOpen = expanded === p.id;
            const Icon = p.type === "CLEANING" ? Sparkles : Wrench;
            const tone = p.type === "CLEANING" ? "bg-[#6B7AE8]/12 text-[#A8B4F0]" : "bg-[#F5C842]/12 text-[#F5C842]";

            return (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-[18px] border border-white/[0.05] bg-white/[0.025] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : p.id)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-[10px]", tone)}>
                    <Icon size={16} strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold text-white truncate">{p.name}</span>
                      <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded-full text-[10.5px] font-medium", STATUS_TONE[status])}>
                        {STATUS_LABEL[status]}
                      </span>
                    </div>
                    <div className="text-[12px] text-white/50 mt-0.5">
                      {ms.length} mission{ms.length > 1 ? "s" : ""} · {p.email ?? "pas d'email"}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[16px] font-light text-white tabular-nums" style={{ fontVariantNumeric: "tabular-nums" }}>
                      {fmtEUR(total)}
                    </div>
                  </div>
                  <ChevronDown
                    size={16}
                    strokeWidth={1.75}
                    className={cn("text-white/40 transition-transform duration-200", isOpen && "rotate-180")}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden border-t border-white/[0.04]"
                    >
                      <div className="px-4 py-3.5 space-y-3">
                        {/* Liste missions */}
                        <div className="rounded-[12px] bg-white/[0.02] border border-white/[0.04] divide-y divide-white/[0.04]">
                          {ms.length === 0 && (
                            <div className="px-3.5 py-4 text-center text-[12.5px] text-white/45">Aucune mission ce mois.</div>
                          )}
                          {ms.map((m) => (
                            <div key={m.id} className="flex items-center gap-3 px-3.5 py-2.5">
                              <div className="text-[11px] text-white/45 tabular-nums w-[70px] shrink-0">
                                {new Date(m.mission_date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-[13px] text-white/90 truncate">{m.rental_name ?? m.rental_id}</div>
                                <div className="text-[11.5px] text-white/45 truncate">{m.description ?? "—"}</div>
                              </div>
                              <div className="text-[13px] text-white tabular-nums shrink-0" style={{ fontVariantNumeric: "tabular-nums" }}>
                                {fmtEUR(Number(m.agreed_price))}
                              </div>
                            </div>
                          ))}
                          {ms.length > 0 && (
                            <div className="flex items-center justify-between px-3.5 py-2.5 bg-white/[0.02]">
                              <span className="text-[11.5px] uppercase tracking-[0.06em] text-white/50 font-medium">Total à facturer</span>
                              <span className="text-[15px] font-medium text-white tabular-nums" style={{ fontVariantNumeric: "tabular-nums" }}>
                                {fmtEUR(total)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Détails appel */}
                        {call && (
                          <div className="rounded-[12px] bg-white/[0.02] border border-white/[0.04] p-3.5 space-y-2.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] uppercase tracking-[0.06em] text-white/50 font-medium">Appel à facturation</span>
                              <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded-full text-[10.5px] font-medium", STATUS_TONE[call.status])}>
                                {STATUS_LABEL[call.status]}
                              </span>
                            </div>
                            {call.provider_invoice_number && (
                              <div className="flex items-center gap-2 text-[12.5px] text-white/80">
                                <FileText size={13} strokeWidth={1.75} className="text-white/40" />
                                Facture prestataire <span className="font-medium text-white">#{call.provider_invoice_number}</span>
                              </div>
                            )}
                            <div className="flex flex-wrap gap-2 pt-1">
                              <button
                                onClick={() => copyLink(call.access_token)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[9px] bg-white/[0.05] hover:bg-white/[0.08] text-white/85 text-[12px] font-medium transition-colors"
                              >
                                <Copy size={12} strokeWidth={1.75} /> Copier lien sécurisé
                              </button>
                              <a
                                href={`/provider-call/${call.access_token}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[9px] bg-white/[0.05] hover:bg-white/[0.08] text-white/85 text-[12px] font-medium transition-colors"
                              >
                                <ExternalLink size={12} strokeWidth={1.75} /> Ouvrir vue prestataire
                              </a>
                              {call.status === "draft" && (
                                <button
                                  onClick={() => handleSend(call.id, p.name, p.email)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] bg-[#FF5C1A] hover:bg-[#FF5C1A]/90 text-white text-[12px] font-semibold shadow-[0_2px_8px_rgba(255,92,26,0.25)] transition-all active:scale-[0.98]"
                                >
                                  <Send size={12} strokeWidth={1.75} /> Envoyer l'appel
                                </button>
                              )}
                              {call.status === "invoice_received" && (
                                <button
                                  onClick={() => markPaid(call.id)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] bg-[#22C55E]/15 hover:bg-[#22C55E]/25 text-[#4ADE80] text-[12px] font-semibold transition-all active:scale-[0.98]"
                                >
                                  <Check size={12} strokeWidth={1.75} /> Marquer payé
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {!call && ms.length > 0 && (
                          <button
                            onClick={handleGenerateAll}
                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-[10px] bg-white/[0.05] hover:bg-white/[0.08] text-white text-[12.5px] font-medium transition-colors min-h-[40px]"
                          >
                            <Mail size={13} strokeWidth={1.75} /> Générer l'appel à facturation
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {providers.length === 0 && (
          <div className="rounded-[18px] border border-white/[0.05] bg-white/[0.02] backdrop-blur-xl p-10 text-center">
            <div className="text-[15px] text-white/70">Aucun prestataire actif</div>
            <div className="text-[12.5px] text-white/45 mt-1">Ajoutez vos prestataires de ménage et de maintenance pour démarrer.</div>
          </div>
        )}
      </div>
    </div>
  );
}
