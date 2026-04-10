
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
    { icon: MessageSquare, value: feedbacks.length.toString(), label: 'Avis reçus', color: '#FF5C1A' },
    { icon: Star, value: avgRating, label: 'Note moyenne', color: '#F59E0B' },
    { icon: TrendingUp, value: feedbacks.filter(f => f.rating >= 4).length.toString(), label: 'Satisfaits (4-5★)', color: '#16A34A' },
    { icon: Clock, value: feedbacks.length > 0 ? format(new Date(feedbacks[0].created_at), 'dd MMM', { locale: fr }) : '—', label: 'Dernier avis', color: '#6366F1' },
  ];

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={14} className={i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/20'} />
      ))}
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-[22px] font-bold font-heading text-foreground">Avis utilisateurs</h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          Tous les retours soumis via le widget feedback
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, idx) => (
          <div key={idx} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex items-center justify-center rounded-lg w-9 h-9" style={{ background: `${stat.color}15` }}>
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-[20px] font-bold text-foreground">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher dans les avis..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-10 rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare size={48} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {search ? 'Aucun résultat' : 'Aucun avis reçu pour le moment'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(feedback => (
            <div key={feedback.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center rounded-full text-white font-bold w-[38px] h-[38px] text-sm bg-primary">
                    {(feedback.author_name || '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {feedback.author_name || 'Anonyme'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {feedback.author_email || '—'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {renderStars(feedback.rating)}
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {format(new Date(feedback.created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {feedback.likes && (
                  <div className="rounded-lg p-3 bg-status-success-light">
                    <p className="text-[11px] font-semibold text-status-success mb-1">💚 Ce qui plaît</p>
                    <p className="text-[13px] text-foreground">{feedback.likes}</p>
                  </div>
                )}
                {feedback.missing && (
                  <div className="rounded-lg p-3 bg-status-warning-light">
                    <p className="text-[11px] font-semibold text-status-warning mb-1">🔧 Ce qui manque</p>
                    <p className="text-[13px] text-foreground">{feedback.missing}</p>
                  </div>
                )}
                {feedback.priority && (
                  <div className="rounded-lg p-3 bg-status-pending-light">
                    <p className="text-[11px] font-semibold text-status-pending mb-1">⭐ Priorité</p>
                    <p className="text-[13px] text-foreground">{feedback.priority}</p>
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
