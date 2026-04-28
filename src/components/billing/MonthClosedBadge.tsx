import { Lock } from "lucide-react";
import { useFacturationMetier } from "@/hooks/useFacturationMetier";

export function MonthClosedBadge() {
  const { monthClosed } = useFacturationMetier();
  if (!monthClosed) return null;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-semibold tracking-tight bg-[#6B7AE8]/15 text-[#6B7AE8] border border-[#6B7AE8]/25"
      title="Mois clôturé — BA et factures immuables"
    >
      <Lock className="h-3 w-3" strokeWidth={2.2} />
      Verrouillé
    </span>
  );
}
