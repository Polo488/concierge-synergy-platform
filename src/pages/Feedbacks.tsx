
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Star, MessageSquare, TrendingUp, Clock, Search } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Feedback {
  id: string;
  rating: number;
  likes: string | null;
  missing: string | null;
  priority: string | null;
  author_name: string | null;
  author_email: string | null;
  created_at: string;
}

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const { data, error } = await (supabase.from as any)('feedbacks')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setFeedbacks(data as Feedback[]);
      }
      setLoading(false);
    };
    fetchFeedbacks();
  }, []);

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : '—';

  const filtered = feedbacks.filter(f => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      f.author_name?.toLowerCase().includes(q) ||
      f.author_email?.toLowerCase().includes(q) ||
      f.likes?.toLowerCase().includes(q) ||
      f.missing?.toLowerCase().includes(q) ||
      f.priority?.toLowerCase().includes(q)
    );
  });

  const stats = [
    {
      icon: MessageSquare,
      value: feedbacks.length.toString(),
      label: 'Avis reçus',
      color: '#FF5C1A',
    },
    {
      icon: Star,
      value: avgRating,
      label: 'Note moyenne',
      color: '#F59E0B',
    },
    {
      icon: TrendingUp,
      value: feedbacks.filter(f => f.rating >= 4).length.toString(),
      label: 'Satisfaits (4-5★)',
      color: '#16A34A',
    },
    {
      icon: Clock,
      value: feedbacks.length > 0
        ? format(new Date(feedbacks[0].created_at), 'dd MMM', { locale: fr })
        : '—',
      label: 'Dernier avis',
      color: '#6366F1',
    },
  ];

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={14}
          className={i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/20'}
        />
      ))}
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1A2E' }}>Avis utilisateurs</h1>
        <p style={{ fontSize: 13, color: '#7A7A8C', marginTop: 4 }}>
          Tous les retours soumis via le widget feedback
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="rounded-xl border bg-background p-4"
            style={{ borderColor: '#EEEEEE' }}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: 36,
                  height: 36,
                  background: `${stat.color}15`,
                }}
              >
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
            </div>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#1A1A2E' }}>{stat.value}</p>
            <p style={{ fontSize: 11, color: '#7A7A8C' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: '#8E8E93' }}
        />
        <input
          type="text"
          placeholder="Rechercher dans les avis..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-10 rounded-xl border bg-background pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          style={{ borderColor: '#EEEEEE' }}
        />
      </div>

      {/* Feedbacks list */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare size={48} style={{ color: '#CCCCCC', margin: '0 auto 12px' }} />
          <p style={{ fontSize: 14, color: '#9A9AAF' }}>
            {search ? 'Aucun résultat' : 'Aucun avis reçu pour le moment'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(feedback => (
            <div
              key={feedback.id}
              className="rounded-xl border bg-background p-4"
              style={{ borderColor: '#EEEEEE' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center rounded-full text-white font-bold"
                    style={{
                      width: 38,
                      height: 38,
                      fontSize: 14,
                      background: '#FF5C1A',
                    }}
                  >
                    {(feedback.author_name || '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E' }}>
                      {feedback.author_name || 'Anonyme'}
                    </p>
                    <p style={{ fontSize: 12, color: '#8E8E93' }}>
                      {feedback.author_email || '—'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {renderStars(feedback.rating)}
                  <p style={{ fontSize: 11, color: '#8E8E93', marginTop: 4 }}>
                    {format(new Date(feedback.created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {feedback.likes && (
                  <div className="rounded-lg p-3" style={{ background: '#F0FDF4' }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#16A34A', marginBottom: 4 }}>
                      💚 Ce qui plaît
                    </p>
                    <p style={{ fontSize: 13, color: '#1A1A2E' }}>{feedback.likes}</p>
                  </div>
                )}
                {feedback.missing && (
                  <div className="rounded-lg p-3" style={{ background: '#FFF7ED' }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#EA580C', marginBottom: 4 }}>
                      🔧 Ce qui manque
                    </p>
                    <p style={{ fontSize: 13, color: '#1A1A2E' }}>{feedback.missing}</p>
                  </div>
                )}
                {feedback.priority && (
                  <div className="rounded-lg p-3" style={{ background: '#F5F3FF' }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#7C3AED', marginBottom: 4 }}>
                      ⭐ Priorité
                    </p>
                    <p style={{ fontSize: 13, color: '#1A1A2E' }}>{feedback.priority}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feedbacks;
