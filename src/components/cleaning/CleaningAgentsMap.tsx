import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCleaningTeam } from '@/contexts/CleaningTeamContext';

// Demo positions (Lyon-ish) — in production, derived from last validated cleaning + OSRM
const AGENT_PINS: { id: string; lat: number; lng: number; status: 'enroute' | 'cleaning' | 'done' | 'late' }[] = [
  { id: 'a1', lat: 45.7626, lng: 4.8357, status: 'cleaning' },
  { id: 'a2', lat: 45.7700, lng: 4.8200, status: 'enroute' },
  { id: 'a3', lat: 45.7589, lng: 4.8414, status: 'done' },
  { id: 'a4', lat: 45.7485, lng: 4.8467, status: 'late' },
];

const STATUS_COLOR = {
  enroute: '#6B7AE8',
  cleaning: '#F5C842',
  done: '#22c55e',
  late: '#FF5C1A',
};

const STATUS_LABEL = {
  enroute: 'En route',
  cleaning: 'En ménage',
  done: 'Terminé',
  late: 'En retard',
};

export const CleaningAgentsMap = () => {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const { agencies } = useCleaningTeam();

  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;

    const map = L.map(mapEl.current, {
      center: [45.764, 4.835],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const layer = L.layerGroup().addTo(map);

    AGENT_PINS.forEach((pin) => {
      const agency = agencies.find((a) => a.id === pin.id);
      const color = STATUS_COLOR[pin.status];
      const name = agency?.name || pin.id;

      const html = `
        <div style="display:flex;align-items:center;gap:6px;">
          <div style="
            width:22px;height:22px;border-radius:50%;
            background:${color};
            border:3px solid #fff;
            box-shadow:0 2px 8px rgba(0,0,0,0.25);
            position:relative;
          ">
            <span style="
              position:absolute;inset:-6px;border-radius:50%;
              background:${color};opacity:.25;
              animation:noe-pulse 2s ease-out infinite;
            "></span>
          </div>
          <div style="
            background:rgba(255,255,255,0.95);
            backdrop-filter:blur(8px);
            border:1px solid rgba(0,0,0,0.06);
            padding:3px 8px;border-radius:999px;
            font-family:-apple-system,system-ui,sans-serif;
            font-size:11px;font-weight:600;color:#1A1A2E;
            white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.08);
          ">${name} · ${STATUS_LABEL[pin.status]}</div>
        </div>
      `;
      const icon = L.divIcon({ html, className: '', iconSize: [0, 0], iconAnchor: [11, 11] });
      L.marker([pin.lat, pin.lng], { icon }).addTo(layer);
    });

    return () => {
      layer.remove();
    };
  }, [agencies]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border bg-card">
      <div ref={mapEl} className="h-[320px] w-full" />
      <div className="absolute bottom-3 left-3 z-[400] bg-card/95 backdrop-blur-md rounded-xl border border-border px-3 py-2 shadow-sm">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
          Statut prestataires
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          {(['enroute', 'cleaning', 'done', 'late'] as const).map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: STATUS_COLOR[s] }}
              />
              <span className="text-[11px] text-foreground">{STATUS_LABEL[s]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute top-3 left-3 z-[400] bg-card/95 backdrop-blur-md rounded-full border border-border px-3 py-1.5 shadow-sm">
        <p className="text-[11px] font-medium text-foreground">
          <span className="text-muted-foreground">Vue</span> tous prestataires
        </p>
      </div>
    </div>
  );
};
