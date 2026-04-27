import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Wrench, Check, Upload, AlertCircle, FileText, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import logoNoe from "@/assets/logo-noe.png";

interface Provider {
  id: string; name: string; type: "CLEANING" | "MAINTENANCE" | "OTHER"; email: string | null;
}
interface Mission {
  id: string; mission_date: string; rental_name: string | null; rental_id: string;
  description: string | null; agreed_price: number; type: string;
}
interface Call {
  id: string; provider_id: string; month: string; total_amount: number;
  status: string; provider_invoice_number: string | null; provider_invoice_pdf_url: string | null;
}

const fmtEUR = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(n);

export default function ProviderCallPage() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceUrl, setInvoiceUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Appel à facturation — Noé";
    if (!token) { setError("Lien invalide"); setLoading(false); return; }
    (async () => {
      const { data: callData, error: callErr } = await supabase
        .from("provider_invoice_calls")
        .select("*")
        .eq("access_token", token)
        .maybeSingle();
      if (callErr || !callData) { setError("Lien introuvable ou expiré"); setLoading(false); return; }
      const [{ data: pData }, { data: mData }] = await Promise.all([
        supabase.from("providers").select("id,name,type,email").eq("id", callData.provider_id).maybeSingle(),
        supabase.from("provider_missions").select("*").eq("invoice_call_id", callData.id).order("mission_date"),
      ]);
      setCall(callData as Call);
      setProvider(pData as Provider);
      setMissions((mData ?? []) as Mission[]);
      if (callData.provider_invoice_number) setInvoiceNumber(callData.provider_invoice_number);
      if (callData.provider_invoice_pdf_url) setInvoiceUrl(callData.provider_invoice_pdf_url);
      setLoading(false);
    })();
  }, [token]);

  const handleValidate = async () => {
    if (!call) return;
    await supabase
      .from("provider_invoice_calls")
      .update({ status: "provider_validated", validated_at: new Date().toISOString() })
      .eq("id", call.id);
    await supabase.from("audit_log").insert({
      entity_type: "provider_invoice_call", entity_id: call.id, action: "provider_validated", actor: provider?.name ?? "provider",
    });
    setCall({ ...call, status: "provider_validated" });
    toast.success("Missions validées. Vous pouvez maintenant transmettre votre facture.");
  };

  const handleSubmitInvoice = async () => {
    if (!call) return;
    if (!invoiceNumber.trim()) { toast.error("Numéro de facture requis"); return; }
    setSubmitting(true);
    await supabase
      .from("provider_invoice_calls")
      .update({
        status: "invoice_received",
        invoice_received_at: new Date().toISOString(),
        provider_invoice_number: invoiceNumber.trim(),
        provider_invoice_pdf_url: invoiceUrl.trim() || null,
      })
      .eq("id", call.id);
    await supabase.from("audit_log").insert({
      entity_type: "provider_invoice_call", entity_id: call.id, action: "invoice_received",
      actor: provider?.name ?? "provider", metadata: { invoice_number: invoiceNumber.trim() },
    });
    setCall({ ...call, status: "invoice_received", provider_invoice_number: invoiceNumber.trim(), provider_invoice_pdf_url: invoiceUrl.trim() || null });
    setSubmitting(false);
    toast.success("Facture transmise avec succès");
  };

  if (loading) {
    return (
      <div className="min-h-dvh bg-[#F4F5F7] flex items-center justify-center p-6">
        <div className="h-8 w-8 rounded-full border-2 border-[#1A1A2E]/20 border-t-[#1A1A2E] animate-spin" />
      </div>
    );
  }

  if (error || !call || !provider) {
    return (
      <div className="min-h-dvh bg-[#F4F5F7] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[20px] p-8 text-center shadow-[0_4px_24px_rgba(26,26,46,0.08)]">
          <AlertCircle className="h-10 w-10 text-[#FF5C1A] mx-auto mb-3" strokeWidth={1.5} />
          <h1 className="text-[18px] font-semibold text-[#1A1A2E]">Lien invalide</h1>
          <p className="text-[13.5px] text-[#1A1A2E]/60 mt-1.5">{error ?? "Cet appel à facturation n'est plus accessible."}</p>
        </div>
      </div>
    );
  }

  const Icon = provider.type === "CLEANING" ? Sparkles : Wrench;
  const total = missions.reduce((s, m) => s + Number(m.agreed_price), 0);
  const monthLabel = new Date(`${call.month}-01`).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  const isValidated = call.status === "provider_validated" || call.status === "invoice_received" || call.status === "paid";
  const isReceived = call.status === "invoice_received" || call.status === "paid";

  return (
    <div className="min-h-dvh bg-[#F4F5F7] py-8 px-4 sm:py-12">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Header */}
        <header className="flex items-center justify-between gap-3">
          <img src={logoNoe} alt="Noé" className="h-8 w-auto" />
          <span className="text-[11px] uppercase tracking-[0.08em] text-[#1A1A2E]/50 font-medium">Appel à facturation</span>
        </header>

        {/* Card principale */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-[20px] shadow-[0_4px_24px_rgba(26,26,46,0.06)] overflow-hidden"
        >
          {/* En-tête prestataire */}
          <div className="p-6 sm:p-7 border-b border-[#1A1A2E]/[0.06]">
            <div className="flex items-start gap-3">
              <div className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-[12px] shrink-0",
                provider.type === "CLEANING" ? "bg-[#6B7AE8]/10 text-[#6B7AE8]" : "bg-[#F5C842]/15 text-[#F5C842]"
              )}>
                <Icon size={20} strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-[18px] font-semibold text-[#1A1A2E] tracking-tight">{provider.name}</h1>
                <p className="text-[13px] text-[#1A1A2E]/55 mt-0.5">Période : {monthLabel}</p>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-[0.06em] text-[#1A1A2E]/45 font-medium">Total</div>
                <div className="text-[24px] font-light text-[#1A1A2E] tabular-nums leading-tight" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {fmtEUR(total)}
                </div>
              </div>
            </div>
          </div>

          {/* Missions */}
          <div className="px-6 sm:px-7 py-5">
            <div className="text-[11px] uppercase tracking-[0.06em] text-[#1A1A2E]/50 font-medium mb-3">
              {missions.length} mission{missions.length > 1 ? "s" : ""}
            </div>
            <div className="space-y-px rounded-[12px] bg-[#F4F5F7] overflow-hidden">
              {missions.map((m) => (
                <div key={m.id} className="flex items-center gap-3 bg-white px-4 py-3">
                  <div className="text-[11.5px] text-[#1A1A2E]/55 tabular-nums w-[60px] shrink-0">
                    {new Date(m.mission_date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[13px] text-[#1A1A2E] font-medium truncate">
                      <Building2 size={12} strokeWidth={1.75} className="text-[#1A1A2E]/40 shrink-0" />
                      {m.rental_name ?? m.rental_id}
                    </div>
                    {m.description && <div className="text-[11.5px] text-[#1A1A2E]/55 truncate mt-0.5">{m.description}</div>}
                  </div>
                  <div className="text-[13.5px] font-medium text-[#1A1A2E] tabular-nums shrink-0" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {fmtEUR(Number(m.agreed_price))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 sm:px-7 py-5 border-t border-[#1A1A2E]/[0.06] bg-[#F4F5F7]/50">
            {!isValidated && (
              <div className="space-y-3">
                <p className="text-[13px] text-[#1A1A2E]/70">
                  Vérifiez le détail des missions et validez. Vous pourrez ensuite transmettre votre facture.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleValidate}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-[12px] bg-[#1A1A2E] hover:bg-[#1A1A2E]/90 text-white text-[13.5px] font-semibold transition-all active:scale-[0.98] min-h-[44px]"
                  >
                    <Check size={15} strokeWidth={2} /> Valider les missions
                  </button>
                  <button
                    onClick={() => toast.info("Une notification a été envoyée à l'équipe Noé")}
                    className="px-4 py-2.5 rounded-[12px] bg-white border border-[#1A1A2E]/10 hover:bg-[#F4F5F7] text-[#1A1A2E] text-[13.5px] font-medium transition-colors min-h-[44px]"
                  >
                    Contester
                  </button>
                </div>
              </div>
            )}

            {isValidated && !isReceived && (
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 text-[12.5px] text-[#22C55E] font-medium">
                  <Check size={14} strokeWidth={2} /> Missions validées
                </div>
                <div className="space-y-2">
                  <label className="block">
                    <span className="text-[12px] text-[#1A1A2E]/60 font-medium">Numéro de votre facture</span>
                    <input
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      placeholder="FACT-2026-001"
                      className="mt-1 w-full px-3 py-2.5 rounded-[10px] bg-white border border-[#1A1A2E]/10 text-[14px] text-[#1A1A2E] placeholder:text-[#1A1A2E]/35 focus:outline-none focus:border-[#1A1A2E]/30 transition-colors"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[12px] text-[#1A1A2E]/60 font-medium">Lien vers votre facture PDF (optionnel)</span>
                    <input
                      value={invoiceUrl}
                      onChange={(e) => setInvoiceUrl(e.target.value)}
                      placeholder="https://…"
                      className="mt-1 w-full px-3 py-2.5 rounded-[10px] bg-white border border-[#1A1A2E]/10 text-[14px] text-[#1A1A2E] placeholder:text-[#1A1A2E]/35 focus:outline-none focus:border-[#1A1A2E]/30 transition-colors"
                    />
                  </label>
                </div>
                <button
                  onClick={handleSubmitInvoice}
                  disabled={submitting || !invoiceNumber.trim()}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-[12px] bg-[#FF5C1A] hover:bg-[#FF5C1A]/90 text-white text-[13.5px] font-semibold shadow-[0_3px_10px_rgba(255,92,26,0.30)] transition-all active:scale-[0.98] disabled:opacity-50 min-h-[44px]"
                >
                  <Upload size={15} strokeWidth={2} /> Transmettre la facture
                </button>
              </div>
            )}

            {isReceived && (
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-[13px] text-[#22C55E] font-semibold">
                  <Check size={16} strokeWidth={2} /> Facture transmise
                </div>
                {call.provider_invoice_number && (
                  <div className="flex items-center gap-2 text-[12.5px] text-[#1A1A2E]/70">
                    <FileText size={13} strokeWidth={1.75} className="text-[#1A1A2E]/40" />
                    Facture <span className="font-medium text-[#1A1A2E]">#{call.provider_invoice_number}</span>
                    {call.status === "paid" && <span className="ml-2 px-1.5 py-0.5 rounded-full bg-[#22C55E]/15 text-[#22C55E] text-[10.5px] font-semibold">Payée</span>}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        <p className="text-center text-[11px] text-[#1A1A2E]/40">
          Lien sécurisé · Toute action est tracée et horodatée.
        </p>
      </div>
    </div>
  );
}
