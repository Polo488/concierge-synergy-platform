import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useFacturation } from "@/hooks/useFacturation";
import { getProperty, getOwnerByProperty, properties } from "@/mocks/facturation";
import { formatMoney, shortDate } from "@/lib/facturationFormat";
import { cn } from "@/lib/utils";

function SettingsGroup({ title, count, total, children }: { title: string; count: number; total: number; children: React.ReactNode }) {
  return (
    <section className="rounded-[20px] bg-white/[0.025] border border-white/[0.05] overflow-hidden">
      <header className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-white/[0.05]">
        <div className="min-w-0">
          <h3 className="text-[14px] sm:text-sm font-semibold text-white truncate">{title}</h3>
          <p className="text-[11px] text-white/45">{count} ligne{count > 1 ? "s" : ""}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[10px] uppercase tracking-[0.1em] text-white/40">Total</p>
          <p className="text-[15px] sm:text-base font-semibold tabular-nums text-white whitespace-nowrap">{formatMoney(total)}</p>
        </div>
      </header>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

function PriceCell({ value, defaultValue, onChange }: { value: number; defaultValue: number; onChange: (v: number) => void }) {
  const modified = value !== defaultValue;
  return (
    <div className="flex items-center justify-end gap-1.5">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-24 px-2 py-1 text-right tabular-nums bg-transparent border border-transparent rounded-md text-white text-sm hover:bg-white/[0.04] focus:bg-white/[0.06] focus:border-white/[0.1] focus:outline-none transition-colors"
      />
      <span className={cn("h-1.5 w-1.5 rounded-full", modified ? "bg-[#6B7AE8]" : "bg-transparent")} />
    </div>
  );
}

export function ComplementsTab() {
  const { maintenance, setMaintenancePrice, cleaning, setCleaningPrice, misc, addMisc, removeMisc } = useFacturation();
  const totalMaint = maintenance.reduce((a, m) => a + m.billedPrice, 0);
  const totalClean = cleaning.reduce((a, c) => a + c.billedPrice, 0);
  const totalMisc = misc.reduce((a, m) => a + m.amountHT * (1 + m.vatRate), 0);

  const [draft, setDraft] = useState({ propertyId: properties[0].id, label: "", amountHT: 0 });

  return (
    <div className="space-y-5">
      <SettingsGroup title="Maintenance" count={maintenance.length} total={totalMaint}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.08em] text-white/45">
              <th className="px-6 py-2 text-left font-medium">Date</th>
              <th className="px-4 py-2 text-left font-medium">Logement</th>
              <th className="px-4 py-2 text-left font-medium">Propriétaire</th>
              <th className="px-4 py-2 text-left font-medium">Description</th>
              <th className="px-4 py-2 text-right font-medium">Matériel</th>
              <th className="px-4 py-2 text-right font-medium">M.O.</th>
              <th className="px-6 py-2 text-right font-medium">Prix facturé</th>
            </tr>
          </thead>
          <tbody>
            {maintenance.map((m, i) => (
              <tr key={m.id} className={cn("border-t border-white/[0.04]", i % 2 === 1 && "bg-white/[0.015]")}>
                <td className="px-6 py-2.5 text-white/70">{shortDate(m.date)}</td>
                <td className="px-4 py-2.5 text-white/85">{getProperty(m.propertyId).name}</td>
                <td className="px-4 py-2.5 text-white/65">{getOwnerByProperty(m.propertyId).name}</td>
                <td className="px-4 py-2.5 text-white/85">{m.description}</td>
                <td className="px-4 py-2.5 text-right tabular-nums text-white/65">{formatMoney(m.materialCost)}</td>
                <td className="px-4 py-2.5 text-right tabular-nums text-white/65">{formatMoney(m.laborCost)}</td>
                <td className="px-6 py-2.5"><PriceCell value={m.billedPrice} defaultValue={m.defaultPrice} onChange={(v) => setMaintenancePrice(m.id, v)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SettingsGroup>

      <SettingsGroup title="Ménage & linge" count={cleaning.length} total={totalClean}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.08em] text-white/45">
              <th className="px-6 py-2 text-left font-medium">Date</th>
              <th className="px-4 py-2 text-left font-medium">Logement</th>
              <th className="px-4 py-2 text-left font-medium">Propriétaire</th>
              <th className="px-4 py-2 text-left font-medium">Type</th>
              <th className="px-6 py-2 text-right font-medium">Prix facturé</th>
            </tr>
          </thead>
          <tbody>
            {cleaning.map((c, i) => (
              <tr key={c.id} className={cn("border-t border-white/[0.04]", i % 2 === 1 && "bg-white/[0.015]")}>
                <td className="px-6 py-2.5 text-white/70">{shortDate(c.date)}</td>
                <td className="px-4 py-2.5 text-white/85">{getProperty(c.propertyId).name}</td>
                <td className="px-4 py-2.5 text-white/65">{getOwnerByProperty(c.propertyId).name}</td>
                <td className="px-4 py-2.5 text-white/85 capitalize">{c.type === "menage" ? "Ménage" : "Linge"}</td>
                <td className="px-6 py-2.5"><PriceCell value={c.billedPrice} defaultValue={c.defaultPrice} onChange={(v) => setCleaningPrice(c.id, v)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SettingsGroup>

      <SettingsGroup title="Frais divers" count={misc.length} total={totalMisc}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.08em] text-white/45">
              <th className="px-6 py-2 text-left font-medium">Date</th>
              <th className="px-4 py-2 text-left font-medium">Logement</th>
              <th className="px-4 py-2 text-left font-medium">Libellé</th>
              <th className="px-4 py-2 text-right font-medium">HT</th>
              <th className="px-4 py-2 text-right font-medium">TVA</th>
              <th className="px-4 py-2 text-right font-medium">TTC</th>
              <th className="px-6 py-2 text-center font-medium">Just.</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {misc.map((m, i) => (
              <tr key={m.id} className={cn("border-t border-white/[0.04]", i % 2 === 1 && "bg-white/[0.015]")}>
                <td className="px-6 py-2.5 text-white/70">{shortDate(m.date)}</td>
                <td className="px-4 py-2.5 text-white/85">{getProperty(m.propertyId).name}</td>
                <td className="px-4 py-2.5 text-white/85">{m.label}</td>
                <td className="px-4 py-2.5 text-right tabular-nums text-white/85">{formatMoney(m.amountHT)}</td>
                <td className="px-4 py-2.5 text-right tabular-nums text-white/55">{(m.vatRate * 100).toFixed(0)}%</td>
                <td className="px-4 py-2.5 text-right tabular-nums text-white">{formatMoney(m.amountHT * (1 + m.vatRate))}</td>
                <td className="px-6 py-2.5 text-center text-white/60 text-xs">{m.hasReceipt ? "✓" : "—"}</td>
                <td className="px-2"><button onClick={() => removeMisc(m.id)} className="p-1.5 rounded-full hover:bg-white/[0.06] text-white/40"><Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} /></button></td>
              </tr>
            ))}
            <tr className="border-t border-white/[0.04]">
              <td className="px-6 py-2.5 text-white/40 text-xs">{shortDate(new Date().toISOString())}</td>
              <td className="px-4 py-2">
                <select
                  value={draft.propertyId}
                  onChange={(e) => setDraft({ ...draft, propertyId: e.target.value })}
                  className="bg-white/[0.04] border border-white/[0.06] rounded-md px-2 py-1 text-xs text-white/85 focus:outline-none"
                >
                  {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </td>
              <td className="px-4 py-2">
                <input
                  value={draft.label}
                  onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                  placeholder="Libellé…"
                  className="w-full bg-white/[0.04] border border-white/[0.06] rounded-md px-2 py-1 text-xs text-white placeholder:text-white/30 focus:outline-none"
                />
              </td>
              <td className="px-4 py-2 text-right">
                <input
                  type="number"
                  value={draft.amountHT || ""}
                  onChange={(e) => setDraft({ ...draft, amountHT: Number(e.target.value) })}
                  placeholder="0.00"
                  className="w-20 bg-white/[0.04] border border-white/[0.06] rounded-md px-2 py-1 text-xs text-right tabular-nums text-white focus:outline-none"
                />
              </td>
              <td colSpan={3} className="px-4 py-2 text-right">
                <button
                  onClick={() => {
                    if (!draft.label || draft.amountHT <= 0) return;
                    addMisc({ date: new Date().toISOString().slice(0, 10), propertyId: draft.propertyId, label: draft.label, amountHT: draft.amountHT, vatRate: 0.20, hasReceipt: false });
                    setDraft({ propertyId: properties[0].id, label: "", amountHT: 0 });
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.06] text-xs text-white/85"
                >
                  <Plus className="h-3 w-3" strokeWidth={1.5} /> Ajouter
                </button>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </SettingsGroup>
    </div>
  );
}
