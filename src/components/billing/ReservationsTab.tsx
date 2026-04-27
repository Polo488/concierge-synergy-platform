import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, RefreshCcw, Search, MoreHorizontal, X } from "lucide-react";
import { useFacturation } from "@/hooks/useFacturation";
import { getProperty, getOwnerByProperty, type Reservation, type Platform } from "@/mocks/facturation";
import { formatMoney, relativeTime, shortDate } from "@/lib/facturationFormat";
import { cn } from "@/lib/utils";

const PLATFORM_DOT: Record<Platform, string> = {
  booking: "bg-[#003580]",
  airbnb: "bg-[#FF5A5F]",
  direct: "bg-white/30",
};
const PLATFORM_LABEL: Record<Platform, string> = { booking: "Booking", airbnb: "Airbnb", direct: "Direct" };

function StatusBadge({ status }: { status: Reservation["status"] }) {
  const map = {
    confirmed: { label: "Confirmée", cls: "bg-[#4ADE80]/12 text-[#4ADE80]" },
    cancelled: { label: "Annulée", cls: "bg-[#F87171]/12 text-[#F87171]" },
    to_check: { label: "À vérifier", cls: "bg-[#F5C842]/15 text-[#F5C842]" },
  } as const;
  const v = map[status];
  return <span className={cn("px-2 py-0.5 rounded-full text-[10.5px] font-medium", v.cls)}>{v.label}</span>;
}

function Dropzone() {
  const { bookingFile, airbnbFile, importBooking, importAirbnb } = useFacturation();
  if (!bookingFile && !airbnbFile) {
    return (
      <div
        onClick={() => { importBooking(); importAirbnb(); }}
        className="rounded-[20px] border border-dashed border-white/10 bg-white/[0.02] p-8 text-center cursor-pointer hover:bg-white/[0.04] transition-colors"
      >
        <UploadCloud className="h-8 w-8 mx-auto text-white/40" strokeWidth={1.5} />
        <p className="mt-3 text-sm text-white/70">Glissez vos exports Booking et Airbnb ici, ou cliquez pour parcourir</p>
        <p className="mt-1 text-xs text-white/40">.csv jusqu'à 10 Mo</p>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {[bookingFile, airbnbFile].filter(Boolean).map((f, i) => (
        <div key={i} className="flex items-center gap-3 rounded-full bg-white/[0.05] border border-white/[0.06] pl-3 pr-2 py-1.5 text-xs">
          <span className={cn("h-1.5 w-1.5 rounded-full", i === 0 ? "bg-[#003580]" : "bg-[#FF5A5F]")} />
          <span className="text-white/85 font-medium">{f!.name}</span>
          <span className="text-white/40">• {f!.rows} lignes</span>
          <span className="text-white/40">• {relativeTime(f!.importedAt)}</span>
          <button
            onClick={() => i === 0 ? importBooking() : importAirbnb()}
            className="ml-1 p-1 rounded-full hover:bg-white/[0.08] transition-colors"
            title="Réimporter"
          >
            <RefreshCcw className="h-3 w-3 text-white/60" strokeWidth={1.5} />
          </button>
        </div>
      ))}
    </div>
  );
}

function ReservationDrawer({ res, onClose }: { res: Reservation | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {res && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] z-50 bg-[#1a1a2e]/95 backdrop-blur-2xl border-l border-white/[0.06] overflow-y-auto"
          >
            <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#1a1a2e]/90 backdrop-blur-xl">
              <div>
                <p className="text-[10px] uppercase tracking-[0.12em] text-white/40">Réservation</p>
                <h3 className="text-base font-semibold text-white">{res.ref}</h3>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/[0.06]">
                <X className="h-4 w-4 text-white/70" strokeWidth={1.5} />
              </button>
            </div>
            <div className="p-6 space-y-5 text-sm">
              <Section title="Voyageur"><Row k="Nom" v={res.guest} /><Row k="Plateforme" v={PLATFORM_LABEL[res.platform]} /></Section>
              <Section title="Logement">
                <Row k="Bien" v={getProperty(res.propertyId).name} />
                <Row k="Ville" v={getProperty(res.propertyId).city} />
                <Row k="Propriétaire" v={getOwnerByProperty(res.propertyId).name} />
              </Section>
              <Section title="Séjour">
                <Row k="Check-in" v={shortDate(res.checkIn)} />
                <Row k="Check-out" v={shortDate(res.checkOut)} />
                <Row k="Nuits" v={`${res.nights}`} />
              </Section>
              <Section title="Financier">
                <Row k="Brut" v={formatMoney(res.gross)} />
                <Row k="Commission OTA" v={formatMoney(-res.otaCommission)} className="text-[#F87171]" />
                <Row k="Taxe séjour" v={formatMoney(res.touristTax)} />
                <Row k="Honoraires Noé" v={formatMoney(res.noeFee)} />
                <Row k="Net propriétaire" v={formatMoney(res.netOwner)} className="font-semibold text-white" />
              </Section>
              <Section title="Note interne">
                <textarea
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-[14px] p-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#FF5C1A]/40"
                  rows={3}
                  placeholder="Ajouter une note interne pour cette réservation…"
                />
              </Section>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[16px] bg-white/[0.03] border border-white/[0.04] p-4">
      <p className="text-[10px] uppercase tracking-[0.12em] text-white/40 mb-2">{title}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}
function Row({ k, v, className }: { k: string; v: string; className?: string }) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="text-white/55">{k}</span>
      <span className={cn("text-white/90 tabular-nums", className)}>{v}</span>
    </div>
  );
}

export function ReservationsTab() {
  const { reservations } = useFacturation();
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState<"all" | Platform>("all");
  const [drawer, setDrawer] = useState<Reservation | null>(null);

  const filtered = useMemo(() => reservations.filter((r) => {
    if (platform !== "all" && r.platform !== platform) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!r.guest.toLowerCase().includes(q) && !r.ref.toLowerCase().includes(q) && !getProperty(r.propertyId).name.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [reservations, search, platform]);

  const totals = useMemo(() => ({
    gross: filtered.reduce((a, r) => a + r.gross, 0),
    ota: filtered.reduce((a, r) => a + r.otaCommission, 0),
    tax: filtered.reduce((a, r) => a + r.touristTax, 0),
    noe: filtered.reduce((a, r) => a + r.noeFee, 0),
    net: filtered.reduce((a, r) => a + r.netOwner, 0),
  }), [filtered]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
        <Dropzone />
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" strokeWidth={1.5} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher…"
              className="pl-9 pr-3 py-2 w-56 bg-white/[0.04] border border-white/[0.06] rounded-[12px] text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#FF5C1A]/30"
            />
          </div>
          {(["all", "booking", "airbnb", "direct"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={cn(
                "px-3 py-2 rounded-[12px] text-xs font-medium border transition-colors",
                platform === p
                  ? "bg-white/[0.08] border-white/[0.12] text-white"
                  : "bg-transparent border-white/[0.06] text-white/55 hover:text-white/80"
              )}
            >
              {p === "all" ? "Tous" : PLATFORM_LABEL[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[20px] bg-white/[0.02] border border-white/[0.04] overflow-hidden">
        <div className="overflow-x-auto max-h-[640px]">
          <table className="w-full text-sm" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
            <thead className="sticky top-0 bg-[#1a1a2e] z-10">
              <tr className="text-left text-[11px] uppercase tracking-[0.08em] text-white/45 border-b border-white/[0.06]">
                <Th>Plateforme</Th>
                <Th>Voyageur</Th>
                <Th>Logement</Th>
                <Th>Propriétaire</Th>
                <Th>Période</Th>
                <Th right>Brut</Th>
                <Th right>Comm. OTA</Th>
                <Th right>Taxe séj.</Th>
                <Th right>Hon. Noé</Th>
                <Th right>Net prop.</Th>
                <Th>Statut</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => (
                <tr
                  key={r.id}
                  onClick={() => setDrawer(r)}
                  className={cn(
                    "border-b border-white/[0.03] cursor-pointer transition-colors",
                    idx % 2 === 1 && "bg-white/[0.015]",
                    "hover:bg-white/[0.04]"
                  )}
                >
                  <Td>
                    <span className="inline-flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full", PLATFORM_DOT[r.platform])} />
                      <span className="text-white/85 text-xs">{PLATFORM_LABEL[r.platform]}</span>
                    </span>
                  </Td>
                  <Td className="text-white">{r.guest}</Td>
                  <Td>
                    <div className="text-white/90">{getProperty(r.propertyId).name}</div>
                    <div className="text-[11px] text-white/40">{getProperty(r.propertyId).city}</div>
                  </Td>
                  <Td className="text-white/80">{getOwnerByProperty(r.propertyId).name}</Td>
                  <Td className="text-white/70 text-xs">{shortDate(r.checkIn)} → {shortDate(r.checkOut)} • {r.nights} nuits</Td>
                  <Td right mono>{formatMoney(r.gross)}</Td>
                  <Td right mono className="text-[#F87171]/90">{r.otaCommission > 0 ? formatMoney(-r.otaCommission) : "—"}</Td>
                  <Td right mono className="text-white/70">{formatMoney(r.touristTax)}</Td>
                  <Td right mono className="text-white/80">{formatMoney(r.noeFee)}</Td>
                  <Td right mono className="font-semibold text-white">{formatMoney(r.netOwner)}</Td>
                  <Td><StatusBadge status={r.status} /></Td>
                  <Td>
                    <button onClick={(e) => { e.stopPropagation(); }} className="p-1.5 rounded-full hover:bg-white/[0.08]">
                      <MoreHorizontal className="h-4 w-4 text-white/50" strokeWidth={1.5} />
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
            <tfoot className="sticky bottom-0 bg-[#1a1a2e]/95 backdrop-blur-xl">
              <tr className="border-t border-[#FF5C1A]/30 text-white">
                <Td colSpan={5} className="font-semibold text-[11px] uppercase tracking-[0.08em] text-white/60">Totaux ({filtered.length} rés.)</Td>
                <Td right mono className="font-semibold">{formatMoney(totals.gross)}</Td>
                <Td right mono className="font-semibold text-[#F87171]/90">{formatMoney(-totals.ota)}</Td>
                <Td right mono className="font-semibold">{formatMoney(totals.tax)}</Td>
                <Td right mono className="font-semibold">{formatMoney(totals.noe)}</Td>
                <Td right mono className="font-semibold">{formatMoney(totals.net)}</Td>
                <Td colSpan={2}></Td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <ReservationDrawer res={drawer} onClose={() => setDrawer(null)} />
    </div>
  );
}

function Th({ children, right }: { children?: React.ReactNode; right?: boolean }) {
  return <th className={cn("px-4 py-3 font-medium", right && "text-right")}>{children}</th>;
}
function Td({ children, right, mono, className, colSpan }: { children?: React.ReactNode; right?: boolean; mono?: boolean; className?: string; colSpan?: number }) {
  return (
    <td
      colSpan={colSpan}
      className={cn("px-4 py-3", right && "text-right", mono && "tabular-nums", className)}
    >
      {children}
    </td>
  );
}
