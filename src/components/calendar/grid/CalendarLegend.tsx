import React from 'react';

const LEGEND_ITEMS = [
  { color: '#FF385C', label: 'Airbnb', shape: 'circle' as const },
  { color: '#003580', label: 'Booking', shape: 'circle' as const },
  { color: '#16A34A', label: 'Direct', shape: 'circle' as const },
  { color: '#9CA3AF', label: 'Bloqué', shape: 'square' as const },
];

export const CalendarLegend: React.FC = () => {
  return (
    <div
      className="flex items-center justify-center gap-5 flex-shrink-0 border-t"
      style={{
        height: 36,
        backgroundColor: '#FFFFFF',
        borderColor: '#EEEEEE',
        padding: '0 16px',
      }}
    >
      {LEGEND_ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span
            style={{
              width: 10,
              height: 10,
              backgroundColor: item.color,
              borderRadius: item.shape === 'circle' ? '50%' : 2,
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 11, color: '#7A7A8C', fontWeight: 500 }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};
