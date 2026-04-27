// Helpers de formatage Facturation
export function formatMoney(n: number, opts: { signed?: boolean } = {}) {
  const sign = opts.signed && n > 0 ? "+" : "";
  return sign + new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatPct(n: number) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1).replace(".", ",")}%`;
}

export function maskIban(iban: string) {
  const clean = iban.replace(/\s/g, "");
  if (clean.length < 8) return iban;
  return `${clean.slice(0, 4)} •••• •••• ${clean.slice(-4)}`;
}

export function ownerHashColor(name: string): { from: string; to: string } {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const palettes = [
    { from: "#1a1a2e", to: "#252544" },
    { from: "#1f2148", to: "#2a2c5b" },
    { from: "#1a1a2e", to: "#2a3260" },
    { from: "#202142", to: "#2c2e5a" },
    { from: "#1d2040", to: "#34376e" },
    { from: "#1a2540", to: "#2d3a6a" },
  ];
  return palettes[h % palettes.length];
}

export function relativeTime(d: Date) {
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  return `il y a ${Math.floor(diff / 86400)} j`;
}

export function shortDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
