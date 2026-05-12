import React from 'react';
import { Puzzle, ArrowDownRight } from 'lucide-react';

const CHANNEL_ITEMS = [
  { color: '#FF385C', label: 'Airbnb' },
  { color: '#003580', label: 'Booking' },
  { color: '#16A34A', label: 'Direct' },
  { color: '#9CA3AF', label: 'Bloqué', square: true },
];

export const CalendarLegend: React.FC = () => {
  return (
    <div
      className="flex items-center justify-center gap-4 flex-shrink-0 border-t flex-wrap"
      style={{
        minHeight: 36,
        backgroundColor: '#FFFFFF',
        borderColor: '#EEEEEE',
        padding: '6px 16px',
      }}
    >
      {CHANNEL_ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span
            style={{
              width: 10,
              height: 10,
              backgroundColor: item.color,
              borderRadius: item.square ? 2 : '50%',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 11, color: '#7A7A8C', fontWeight: 500 }}>{item.label}</span>
        </div>
      ))}

      {/* Visual separator */}
      <span style={{ width: 1, height: 14, background: '#EEEEEE' }} />

      {/* Cleaning chip */}
      <div className="flex items-center gap-1.5" title="Affiché sur le jour de check-out quand la couche Ménage est active">
        <span
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: '#FF5C1A', color: '#fff',
            width: 16, height: 16, borderRadius: 6, fontSize: 10, lineHeight: 1,
          }}
        >
          🧹
        </span>
        <span style={{ fontSize: 11, color: '#7A7A8C', fontWeight: 500 }}>Ménage (jour de check-out)</span>
      </div>

      {/* RM Gap Fill */}
      <div className="flex items-center gap-1.5" title="Règle Gap Fill : séjour minimum assoupli pour combler un trou de planning">
        <span
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 2,
            background: 'rgba(124,58,237,0.92)', color: '#fff',
            padding: '2px 5px', borderRadius: 6, fontSize: 10, fontWeight: 700, lineHeight: 1,
          }}
        >
          <Puzzle size={10} />
          <span>n</span>
        </span>
        <span style={{ fontSize: 11, color: '#7A7A8C', fontWeight: 500 }}>Gap Fill (min nuits assoupli)</span>
      </div>

      {/* RM Min stay release */}
      <div className="flex items-center gap-1.5" title="Relâche du séjour minimum à l'approche de la date">
        <span
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 2,
            background: 'rgba(245,158,11,0.92)', color: '#fff',
            padding: '2px 5px', borderRadius: 6, fontSize: 10, fontWeight: 700, lineHeight: 1,
          }}
        >
          <ArrowDownRight size={10} />
          <span>n</span>
        </span>
        <span style={{ fontSize: 11, color: '#7A7A8C', fontWeight: 500 }}>Relâche min nuits</span>
      </div>
    </div>
  );
};
