import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ProviderType = "CLEANING" | "MAINTENANCE" | "OTHER";
export type CallStatus = "draft" | "sent_to_provider" | "provider_validated" | "invoice_received" | "paid";
export type MissionStatus = "planned" | "done" | "billed" | "paid";

export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  email: string | null;
  phone: string | null;
  iban: string | null;
  default_pricing_mode: "PER_MISSION" | "FORFAIT";
  default_rate: number | null;
  is_active: boolean;
}

export interface ProviderMission {
  id: string;
  provider_id: string;
  rental_id: string;
  rental_name: string | null;
  mission_date: string;
  type: ProviderType;
  description: string | null;
  pricing_mode: "PER_MISSION" | "FORFAIT";
  agreed_price: number;
  status: MissionStatus;
  invoice_call_id: string | null;
}

export interface ProviderInvoiceCall {
  id: string;
  provider_id: string;
  month: string;
  total_amount: number;
  status: CallStatus;
  access_token: string;
  sent_at: string | null;
  validated_at: string | null;
  invoice_received_at: string | null;
  paid_at: string | null;
  provider_invoice_number: string | null;
  provider_invoice_pdf_url: string | null;
  notes: string | null;
}

export function useProviderCalls(month = "2026-10") {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [missions, setMissions] = useState<ProviderMission[]>([]);
  const [calls, setCalls] = useState<ProviderInvoiceCall[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [{ data: pData }, { data: mData }, { data: cData }] = await Promise.all([
      supabase.from("providers").select("*").eq("is_active", true).order("name"),
      supabase.from("provider_missions").select("*").gte("mission_date", `${month}-01`).lte("mission_date", `${month}-31`),
      supabase.from("provider_invoice_calls").select("*").eq("month", month),
    ]);
    setProviders((pData ?? []) as Provider[]);
    setMissions((mData ?? []) as ProviderMission[]);
    setCalls((cData ?? []) as ProviderInvoiceCall[]);
    setLoading(false);
  }, [month]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const generateAllCalls = useCallback(async () => {
    const byProvider = new Map<string, ProviderMission[]>();
    for (const m of missions) {
      if (m.invoice_call_id) continue;
      if (!byProvider.has(m.provider_id)) byProvider.set(m.provider_id, []);
      byProvider.get(m.provider_id)!.push(m);
    }
    const created: ProviderInvoiceCall[] = [];
    for (const [providerId, ms] of byProvider.entries()) {
      const existing = calls.find((c) => c.provider_id === providerId);
      if (existing) continue;
      const total = ms.reduce((s, x) => s + Number(x.agreed_price), 0);
      const { data, error } = await supabase
        .from("provider_invoice_calls")
        .insert({ provider_id: providerId, month, total_amount: total, status: "draft" })
        .select()
        .single();
      if (error || !data) continue;
      created.push(data as ProviderInvoiceCall);
      await supabase
        .from("provider_missions")
        .update({ invoice_call_id: data.id })
        .in("id", ms.map((x) => x.id));
    }
    if (created.length > 0) await fetchAll();
    return created.length;
  }, [missions, calls, month, fetchAll]);

  const sendCall = useCallback(async (callId: string) => {
    await supabase
      .from("provider_invoice_calls")
      .update({ status: "sent_to_provider", sent_at: new Date().toISOString() })
      .eq("id", callId);
    await supabase.from("audit_log").insert({
      entity_type: "provider_invoice_call",
      entity_id: callId,
      action: "sent_to_provider",
      actor: "demo",
    });
    await fetchAll();
  }, [fetchAll]);

  const markPaid = useCallback(async (callId: string) => {
    await supabase
      .from("provider_invoice_calls")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", callId);
    await fetchAll();
  }, [fetchAll]);

  const callsByProvider = (id: string) => calls.find((c) => c.provider_id === id) ?? null;
  const missionsByProvider = (id: string) => missions.filter((m) => m.provider_id === id);

  return {
    providers,
    missions,
    calls,
    loading,
    callsByProvider,
    missionsByProvider,
    generateAllCalls,
    sendCall,
    markPaid,
    refresh: fetchAll,
  };
}
