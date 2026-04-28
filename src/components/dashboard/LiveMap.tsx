import { useEffect, useMemo, useRef, useState } from 'react';
import maplibregl, { Map as MLMap, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './live-map/livemap.css';
import { Compass, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLiveLogementsStatus, checkinProgress, seededDelay } from './live-map/useLiveLogementsStatus';
import type { Logement, LogementStatus } from '@/mocks/dashboard';

type FilterKey = 'all' | 'occupied' | 'checkin' | 'free';

const STYLE_DARK =
  'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
const STYLE_LIGHT =
  'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

const STORAGE_KEY = 'noe_map_theme';

interface PopoverState {
  logement: Logement;
  x: number;
  y: number;
}

export function LiveMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MLMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new globalThis.Map());

  const [mapTheme, setMapTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark';
    return (localStorage.getItem(STORAGE_KEY) as 'dark' | 'light') || 'dark';
  });
  const [filter, setFilter] = useState<FilterKey>('all');
  const [popover, setPopover] = useState<PopoverState | null>(null);
  const [now, setNow] = useState(() => new Date());

  const { logements, tick } = useLiveLogementsStatus();

  // Horloge live (affichage minute)
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const counts = useMemo(() => {
    const c = { occupied: 0, checkin: 0, free: 0 };
    logements.forEach((l) => { c[l.status]++; });
    return c;
  }, [logements]);

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const lats = logements.map((l) => l.lat);
    const lngs = logements.map((l) => l.lng);
    const center: [number, number] = [
      (Math.min(...lngs) + Math.max(...lngs)) / 2,
      (Math.min(...lats) + Math.max(...lats)) / 2,
    ];

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: mapTheme === 'dark' ? STYLE_DARK : STYLE_LIGHT,
      center,
      zoom: 11,
      attributionControl: { compact: true },
      cooperativeGestures: false,
    });

    map.on('load', () => {
      // Auto-fit bounding box
      const bounds = new maplibregl.LngLatBounds();
      logements.forEach((l) => bounds.extend([l.lng, l.lat]));
      map.fitBounds(bounds, { padding: 60, duration: 800, maxZoom: 13 });
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Theme toggle (re-set style)
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(mapTheme === 'dark' ? STYLE_DARK : STYLE_LIGHT);
    localStorage.setItem(STORAGE_KEY, mapTheme);
  }, [mapTheme]);

  // Render markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Filter logements
    const visible = logements.filter((l) => filter === 'all' || l.status === filter);
    const visibleIds = new Set(visible.map((l) => l.id));

    // Remove markers no longer visible
    markersRef.current.forEach((m, id) => {
      if (!visibleIds.has(id)) {
        m.remove();
        markersRef.current.delete(id);
      }
    });

    // Compute enter delay (ripple from center)
    const lats = visible.map((l) => l.lat);
    const lngs = visible.map((l) => l.lng);
    const cLat = lats.length ? (Math.min(...lats) + Math.max(...lats)) / 2 : 0;
    const cLng = lngs.length ? (Math.min(...lngs) + Math.max(...lngs)) / 2 : 0;

    visible.forEach((l) => {
      if (markersRef.current.has(l.id)) {
        // Update ring progress for checkin markers
        if (l.status === 'checkin') {
          const el = markersRef.current.get(l.id)!.getElement();
          updateRing(el, checkinProgress(l.checkinAt));
        }
        return;
      }

      const dist = Math.hypot(l.lat - cLat, l.lng - cLng);
      const enterDelay = Math.min(0.9, dist * 25); // ripple
      const el = buildMarkerEl(l, enterDelay);

      el.addEventListener('mouseenter', () => {
        const point = map.project([l.lng, l.lat]);
        setPopover({ logement: l, x: point.x, y: point.y });
      });
      el.addEventListener('mouseleave', () => setPopover(null));
      el.addEventListener('click', () => {
        const point = map.project([l.lng, l.lat]);
        setPopover({ logement: l, x: point.x, y: point.y });
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([l.lng, l.lat])
        .addTo(map);
      markersRef.current.set(l.id, marker);
    });
  }, [logements, filter, tick, mapTheme]);

  // Recentrer
  const recenter = () => {
    const map = mapRef.current;
    if (!map) return;
    const visible = logements.filter((l) => filter === 'all' || l.status === filter);
    if (!visible.length) return;
    const bounds = new maplibregl.LngLatBounds();
    visible.forEach((l) => bounds.extend([l.lng, l.lat]));
    map.fitBounds(bounds, { padding: 60, duration: 600, maxZoom: 13 });
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-[20px] bg-[#1A1A2E]">
      <div ref={containerRef} className="absolute inset-0" />

      {/* Bandeau supérieur */}
      <div className="absolute top-0 left-0 right-0 z-10 p-3 sm:p-4 flex items-center justify-between gap-2 pointer-events-none">
        <div
          className="flex items-center gap-1.5 sm:gap-2 rounded-full px-2 py-1.5 backdrop-blur-md pointer-events-auto overflow-x-auto max-w-[calc(100%-110px)] sm:max-w-none"
          style={{ background: 'rgba(26,26,46,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <FilterChip active={filter === 'all'} onClick={() => setFilter('all')} label="Tous" count={logements.length} dotColor="rgba(255,255,255,0.7)" />
          <FilterChip active={filter === 'occupied'} onClick={() => setFilter('occupied')} label="occupés" count={counts.occupied} dotColor="#4ADE80" />
          <FilterChip active={filter === 'checkin'} onClick={() => setFilter('checkin')} label="check-ins" count={counts.checkin} dotColor="#FF5C1A" />
          <FilterChip active={filter === 'free'} onClick={() => setFilter('free')} label="libres" count={counts.free} dotColor="rgba(255,255,255,0.5)" />
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <span
            className="hidden sm:inline-block text-[11px] tabular-nums px-2.5 py-1.5 rounded-full backdrop-blur-md text-white/60"
            style={{ background: 'rgba(26,26,46,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <IconBtn onClick={recenter} aria-label="Recentrer">
            <Compass className="h-4 w-4" strokeWidth={1.5} />
          </IconBtn>
          <IconBtn
            onClick={() => setMapTheme(mapTheme === 'dark' ? 'light' : 'dark')}
            aria-label="Changer thème carte"
          >
            {mapTheme === 'dark' ? <Sun className="h-4 w-4" strokeWidth={1.5} /> : <Moon className="h-4 w-4" strokeWidth={1.5} />}
          </IconBtn>
        </div>
      </div>

      {/* Popover */}
      <AnimatePresence>
        {popover && (
          <motion.div
            key={popover.logement.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: -8 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-20 pointer-events-none"
            style={{
              left: popover.x,
              top: popover.y,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div
              className="w-[280px] rounded-[14px] p-4 shadow-2xl pointer-events-auto"
              style={{
                background: 'rgba(26,26,46,0.92)',
                backdropFilter: 'blur(24px) saturate(180%)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <div className="flex items-start gap-3">
                <div className="h-[60px] w-[60px] rounded-[10px] flex items-center justify-center text-3xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  {popover.logement.photo}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-semibold text-white truncate">{popover.logement.name}</div>
                  <div className="text-[12px] text-white/60 truncate">{popover.logement.address}</div>
                  <StatusLine logement={popover.logement} />
                </div>
              </div>
              {popover.logement.guestName && (
                <div className="mt-3 pt-3 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-[12px] text-white/70 truncate">{popover.logement.guestName}</span>
                  {popover.logement.channel && <ChannelChip channel={popover.logement.channel} />}
                </div>
              )}
              <button
                className="mt-3 w-full text-[12px] font-medium text-white/80 hover:text-white py-2 rounded-[10px] transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)' }}
                onClick={() => { /* navigate to logement (à brancher) */ }}
              >
                Ouvrir la fiche
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ========= Sub-components ========= */

function FilterChip({
  active, onClick, label, count, dotColor,
}: { active: boolean; onClick: () => void; label: string; count: number; dotColor: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-medium whitespace-nowrap transition-all',
        active ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white/85'
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: dotColor }} />
      <span className="tabular-nums">{count}</span>
      <span>{label}</span>
    </button>
  );
}

function IconBtn({ children, onClick, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={onClick}
      className="h-8 w-8 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors backdrop-blur-md"
      style={{ background: 'rgba(26,26,46,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}
      {...rest}
    >
      {children}
    </button>
  );
}

function StatusLine({ logement }: { logement: Logement }) {
  if (logement.status === 'occupied') {
    return <div className="text-[12px] mt-1" style={{ color: '#4ADE80' }}>● Occupé jusqu'à {logement.guestUntil}</div>;
  }
  if (logement.status === 'checkin' && logement.checkinAt) {
    const h = Math.max(0, Math.round((new Date(logement.checkinAt).getTime() - Date.now()) / 3_600_000));
    return <div className="text-[12px] mt-1" style={{ color: '#FF5C1A' }}>● Check-in dans {h}h</div>;
  }
  return <div className="text-[12px] mt-1 text-white/50">○ Libre</div>;
}

function ChannelChip({ channel }: { channel: 'airbnb' | 'booking' | 'direct' }) {
  const map = {
    airbnb: { bg: 'rgba(255,90,95,0.18)', text: '#FF5A5F', label: 'Airbnb' },
    booking: { bg: 'rgba(0,53,128,0.28)', text: '#7FB3FF', label: 'Booking' },
    direct: { bg: 'rgba(107,122,232,0.22)', text: '#A5AFEF', label: 'Direct' },
  } as const;
  const c = map[channel];
  return (
    <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full" style={{ background: c.bg, color: c.text }}>
      {c.label}
    </span>
  );
}

/* ========= Marker DOM builder ========= */

function buildMarkerEl(l: Logement, enterDelay: number): HTMLDivElement {
  const el = document.createElement('div');
  el.className = `noe-marker noe-marker--${l.status}`;
  el.tabIndex = 0;
  el.setAttribute('role', 'button');
  el.setAttribute('aria-label', `${l.name} – ${labelStatus(l.status)}`);
  el.style.setProperty('--noe-enter-delay', `${enterDelay}s`);

  if (l.status === 'occupied') {
    el.style.setProperty('--noe-delay', `${seededDelay(l.id)}s`);
    el.innerHTML = `<div class="noe-marker__halo"></div><div class="noe-marker__core"></div>`;
  } else if (l.status === 'checkin') {
    el.innerHTML = `
      <svg class="noe-marker__ring" viewBox="0 0 28 28">
        <circle cx="14" cy="14" r="12" fill="none" stroke="rgba(255,92,26,0.18)" stroke-width="2"/>
        <circle class="noe-ring-progress" cx="14" cy="14" r="12" fill="none" stroke="rgba(255,92,26,0.85)" stroke-width="2"
          stroke-linecap="round" stroke-dasharray="${2 * Math.PI * 12}" stroke-dashoffset="${2 * Math.PI * 12}"
          transform="rotate(-90 14 14)"/>
      </svg>
      <div class="noe-marker__core"></div>`;
    updateRing(el, checkinProgress(l.checkinAt));
  } else {
    el.innerHTML = `<div class="noe-marker__core"></div>`;
  }
  return el;
}

function updateRing(el: HTMLElement, progress: number) {
  const circ = 2 * Math.PI * 12;
  const ring = el.querySelector<SVGCircleElement>('.noe-ring-progress');
  if (ring) ring.style.strokeDashoffset = `${circ * (1 - progress)}`;
}

function labelStatus(s: LogementStatus) {
  return s === 'occupied' ? 'occupé' : s === 'checkin' ? 'check-in à venir' : 'libre';
}
