import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Star, MessageSquare, Search, Sparkles, CheckCircle2, Clock, TrendingUp, Filter } from 'lucide-react';
import { toast } from 'sonner';

type Platform = 'Airbnb' | 'Booking' | 'Direct';

// Critères officiels (Airbnb 1-5 / Booking 1-10)
const AIRBNB_CRITERIA = ['cleanliness', 'accuracy', 'checkin', 'communication', 'location', 'value'] as const;
const BOOKING_CRITERIA = ['staff', 'cleanliness', 'comfort', 'location', 'facilities', 'value', 'wifi'] as const;

const CRITERIA_LABELS: Record<string, string> = {
  cleanliness: 'Propreté',
  accuracy: 'Exactitude annonce',
  checkin: 'Arrivée',
  communication: 'Communication',
  location: 'Emplacement',
  value: 'Rapport qualité-prix',
  staff: 'Personnel',
  comfort: 'Confort',
  facilities: 'Équipements',
  wifi: 'WiFi gratuit',
};

type Review = {
  id: string;
  platform: Platform;
  property: string;
  guestName: string;
  date: string;
  rating: number; // normalisé /5
  rawRating: number; // dans l'échelle native de la plateforme
  scale: 5 | 10;
  comment: string;
  criteria: Record<string, number>; // valeurs natives
  reply?: string;
  stayNights?: number;
};

const MOCK: Review[] = [
  {
    id: 'r1', platform: 'Airbnb', property: 'Appartement 12 Rue du Port',
    guestName: 'Sophie M.', date: '2026-04-28', rating: 5, rawRating: 5, scale: 5,
    comment: "Logement impeccable, parfaitement conforme à l'annonce. Hôte très réactif !",
    criteria: { cleanliness: 5, accuracy: 5, checkin: 5, communication: 5, location: 5, value: 4 },
    stayNights: 3,
  },
  {
    id: 'r2', platform: 'Booking', property: 'Studio 8 Avenue des Fleurs',
    guestName: 'Markus W.', date: '2026-04-22', rating: 4.6, rawRating: 9.2, scale: 10,
    comment: "Très bon séjour, juste un peu de bruit la nuit. Wifi excellent.",
    criteria: { staff: 9, cleanliness: 10, comfort: 9, location: 8, facilities: 9, value: 9, wifi: 10 },
    reply: "Merci Markus, nous prenons note pour le bruit, à bientôt !",
    stayNights: 2,
  },
  {
    id: 'r3', platform: 'Airbnb', property: 'Loft 72 Rue des Arts',
    guestName: 'Élise R.', date: '2026-04-19', rating: 3.8, rawRating: 3.8, scale: 5,
    comment: "Beau loft mais ménage à revoir dans la salle de bain.",
    criteria: { cleanliness: 3, accuracy: 4, checkin: 4, communication: 5, location: 4, value: 3 },
    stayNights: 4,
  },
  {
    id: 'r4', platform: 'Booking', property: 'Maison 23 Rue de la Paix',
    guestName: 'Anna L.', date: '2026-04-15', rating: 4.9, rawRating: 9.8, scale: 10,
    comment: "Magnifique maison, tout était parfait. On reviendra !",
    criteria: { staff: 10, cleanliness: 10, comfort: 10, location: 9, facilities: 10, value: 10, wifi: 9 },
    reply: "Merci infiniment Anna, à très bientôt !",
    stayNights: 5,
  },
  {
    id: 'r5', platform: 'Direct', property: 'Appartement 45 Boulevard Central',
    guestName: 'Pierre D.', date: '2026-04-12', rating: 4.5, rawRating: 4.5, scale: 5,
    comment: "Excellent rapport qualité-prix, équipe au top.",
    criteria: { cleanliness: 5, accuracy: 4, checkin: 5, communication: 5, location: 4, value: 5 },
    stayNights: 2,
  },
  {
    id: 'r6', platform: 'Airbnb', property: 'Studio 15 Rue des Lilas',
    guestName: 'Julie B.', date: '2026-04-08', rating: 4.2, rawRating: 4.2, scale: 5,
    comment: "Très bien situé, literie un peu ferme.",
    criteria: { cleanliness: 4, accuracy: 4, checkin: 5, communication: 5, location: 5, value: 4 },
    stayNights: 3,
  },
  {
    id: 'r7', platform: 'Booking', property: 'Appartement 28 Avenue Victor Hugo',
    guestName: 'Karl S.', date: '2026-04-02', rating: 4.8, rawRating: 9.5, scale: 10,
    comment: "Wonderful stay, super clean and modern.",
    criteria: { staff: 10, cleanliness: 10, comfort: 9, location: 10, facilities: 9, value: 9, wifi: 10 },
    stayNights: 6,
  },
];

const formatRating = (r: Review) => r.scale === 10 ? `${r.rawRating.toFixed(1)}/10` : `${r.rawRating.toFixed(1)}/5`;

const Stars = ({ value, size = 14 }: { value: number; size?: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} size={size}
        className={i <= Math.round(value) ? 'fill-[hsl(var(--ios-orange))] text-[hsl(var(--ios-orange))]' : 'text-muted-foreground/30'}
      />
    ))}
  </div>
);

const platformBadge = (p: Platform) => {
  const map: Record<Platform, string> = {
    Airbnb: 'bg-[hsl(0,72%,95%)] text-[hsl(0,72%,40%)] border-[hsl(0,72%,80%)]',
    Booking: 'bg-[hsl(213,84%,95%)] text-[hsl(213,84%,35%)] border-[hsl(213,84%,80%)]',
    Direct: 'bg-muted text-foreground border-border',
  };
  return map[p];
};

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>(MOCK);
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState<'all' | Platform>('all');
  const [property, setProperty] = useState<string>('all');
  const [status, setStatus] = useState<'all' | 'replied' | 'pending'>('all');
  const [tab, setTab] = useState('list');
  const [replyOpen, setReplyOpen] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState('');

  const properties = useMemo(() => Array.from(new Set(reviews.map((r) => r.property))), [reviews]);

  const filtered = useMemo(() => reviews.filter((r) => {
    if (platform !== 'all' && r.platform !== platform) return false;
    if (property !== 'all' && r.property !== property) return false;
    if (status === 'replied' && !r.reply) return false;
    if (status === 'pending' && r.reply) return false;
    if (search && !(`${r.guestName} ${r.property} ${r.comment}`.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  }), [reviews, platform, property, status, search]);

  const kpis = useMemo(() => {
    const total = reviews.length;
    const avg = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
    const replied = reviews.filter((r) => r.reply).length;
    const pending = total - replied;
    const rate = total ? Math.round((replied / total) * 100) : 0;
    return { total, avg, replied, pending, rate };
  }, [reviews]);

  // Moyennes par critère (normalisées /5)
  const criteriaAverages = useMemo(() => {
    const all = [...AIRBNB_CRITERIA, ...BOOKING_CRITERIA];
    const unique = Array.from(new Set(all));
    return unique.map((c) => {
      const vals = reviews
        .filter((r) => r.criteria[c] !== undefined)
        .map((r) => (r.scale === 10 ? r.criteria[c] / 2 : r.criteria[c]));
      const avg = vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : 0;
      return { key: c, label: CRITERIA_LABELS[c], avg, count: vals.length };
    }).sort((a, b) => b.avg - a.avg);
  }, [reviews]);

  // Logements à relancer (avec et sans avis)
  const propertyCoverage = useMemo(() => properties.map((p) => {
    const subset = reviews.filter((r) => r.property === p);
    const avg = subset.reduce((s, r) => s + r.rating, 0) / (subset.length || 1);
    const pending = subset.filter((r) => !r.reply).length;
    return { property: p, count: subset.length, avg, pending };
  }), [properties, reviews]);

  const handleReply = (r: Review) => {
    setReplyOpen(r);
    setReplyText(r.reply || '');
  };

  const sendReply = () => {
    if (!replyOpen) return;
    setReviews((prev) => prev.map((r) => r.id === replyOpen.id ? { ...r, reply: replyText } : r));
    toast.success('Réponse envoyée', { description: `Avis de ${replyOpen.guestName} — ${replyOpen.platform}` });
    setReplyOpen(null);
    setReplyText('');
  };

  return (
    <div className="w-full box-border px-4 pt-4 pb-8 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-[22px] md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Avis
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          Tous les avis voyageurs Airbnb, Booking & directs — répondez et suivez vos critères.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Note moyenne</span>
            <Star className="h-4 w-4 text-[hsl(var(--ios-orange))]" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold">{kpis.avg.toFixed(2)}</span>
            <span className="text-xs text-muted-foreground">/5</span>
          </div>
          <Stars value={kpis.avg} />
        </CardContent></Card>

        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Total avis</span>
            <MessageSquare className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-1 text-2xl font-bold">{kpis.total}</div>
          <span className="text-[11px] text-muted-foreground">{properties.length} logements</span>
        </CardContent></Card>

        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Taux réponse</span>
            <CheckCircle2 className="h-4 w-4 text-[hsl(142,76%,36%)]" />
          </div>
          <div className="mt-1 text-2xl font-bold">{kpis.rate}%</div>
          <span className="text-[11px] text-muted-foreground">{kpis.replied} répondus</span>
        </CardContent></Card>

        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">À traiter</span>
            <Clock className="h-4 w-4 text-[hsl(var(--ios-orange))]" />
          </div>
          <div className="mt-1 text-2xl font-bold">{kpis.pending}</div>
          <span className="text-[11px] text-muted-foreground">en attente de réponse</span>
        </CardContent></Card>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="list" className="gap-1.5"><MessageSquare className="h-3.5 w-3.5" />Avis</TabsTrigger>
          <TabsTrigger value="criteria" className="gap-1.5"><Star className="h-3.5 w-3.5" />Critères</TabsTrigger>
          <TabsTrigger value="properties" className="gap-1.5"><TrendingUp className="h-3.5 w-3.5" />Logements</TabsTrigger>
        </TabsList>

        {/* LISTE */}
        <TabsContent value="list" className="space-y-3 mt-4">
          {/* Filters */}
          <Card><CardContent className="pt-4 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <div className="relative md:col-span-2">
                <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9 h-10" placeholder="Rechercher voyageur, logement, mot-clé…"
                  value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={platform} onValueChange={(v: any) => setPlatform(v)}>
                <SelectTrigger className="h-10"><SelectValue placeholder="Plateforme" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes plateformes</SelectItem>
                  <SelectItem value="Airbnb">Airbnb</SelectItem>
                  <SelectItem value="Booking">Booking</SelectItem>
                  <SelectItem value="Direct">Direct</SelectItem>
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="pending">À répondre</SelectItem>
                  <SelectItem value="replied">Répondus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-2">
              <Select value={property} onValueChange={setProperty}>
                <SelectTrigger className="h-10"><Filter className="h-3.5 w-3.5 mr-1.5" /><SelectValue placeholder="Logement" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les logements</SelectItem>
                  {properties.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent></Card>

          {/* Cards */}
          <div className="space-y-3">
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">Aucun avis ne correspond à ces filtres.</p>
            )}
            {filtered.map((r) => (
              <Card key={r.id}>
                <CardContent className="pt-5 pb-4 space-y-3">
                  <div className="flex items-start gap-3 flex-wrap">
                    <Avatar className="h-9 w-9"><AvatarFallback className="text-xs bg-muted">{r.guestName.split(' ').map((n) => n[0]).join('')}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[14px] font-semibold">{r.guestName}</span>
                        <Badge variant="outline" className={`text-[10px] ${platformBadge(r.platform)}`}>{r.platform}</Badge>
                        {!r.reply && <Badge variant="outline" className="text-[10px] bg-[hsl(var(--ios-orange))]/10 text-[hsl(var(--ios-orange))] border-[hsl(var(--ios-orange))]/30">À répondre</Badge>}
                      </div>
                      <p className="text-[12px] text-muted-foreground truncate">{r.property} · {new Date(r.date).toLocaleDateString('fr-FR')}{r.stayNights ? ` · ${r.stayNights} nuits` : ''}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-[14px] font-bold">{formatRating(r)}</div>
                      <Stars value={r.rating} />
                    </div>
                  </div>

                  <p className="text-[13px] leading-relaxed text-foreground">{r.comment}</p>

                  {/* Critères de l'avis */}
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(r.criteria).map(([k, v]) => (
                      <Badge key={k} variant="outline" className="text-[10px] font-normal">
                        {CRITERIA_LABELS[k] || k} · <span className="font-semibold ml-1">{v}{r.scale === 10 ? '/10' : '/5'}</span>
                      </Badge>
                    ))}
                  </div>

                  {r.reply && (
                    <div className="rounded-lg border border-border bg-muted/40 p-3">
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">Votre réponse</p>
                      <p className="text-[13px]">{r.reply}</p>
                    </div>
                  )}

                  <div className="flex justify-end">
                    {r.reply && (r.platform === 'Airbnb' || r.platform === 'Booking') ? (
                      <Badge variant="outline" className="text-[10px] bg-muted text-muted-foreground border-border">
                        Réponse publiée sur {r.platform} — non modifiable
                      </Badge>
                    ) : (
                      <Button size="sm" variant={r.reply ? 'outline' : 'default'} onClick={() => handleReply(r)} className="gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {r.reply ? 'Modifier la réponse' : 'Répondre'}
                      </Button>
                    )}
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* CRITERES */}
        <TabsContent value="criteria" className="space-y-3 mt-4">
          <Card><CardContent className="pt-5 pb-4 space-y-3">
            <div>
              <h3 className="text-[15px] font-bold">Performance par critère</h3>
              <p className="text-[12px] text-muted-foreground">
                Critères officiels Airbnb (propreté, exactitude, arrivée, communication, emplacement, rapport qualité-prix) et Booking (personnel, propreté, confort, emplacement, équipements, rapport qualité-prix, WiFi). Notes normalisées sur 5.
              </p>
            </div>
            <div className="space-y-2.5">
              {criteriaAverages.filter((c) => c.count > 0).map((c) => {
                const pct = (c.avg / 5) * 100;
                const color = c.avg >= 4.5 ? 'bg-[hsl(142,76%,36%)]' : c.avg >= 3.8 ? 'bg-[hsl(var(--ios-orange))]' : 'bg-destructive';
                return (
                  <div key={c.key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] font-medium">{c.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-muted-foreground">{c.count} avis</span>
                        <span className="text-[13px] font-bold">{c.avg.toFixed(2)}/5</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent></Card>
        </TabsContent>

        {/* LOGEMENTS */}
        <TabsContent value="properties" className="space-y-3 mt-4">
          <Card><CardContent className="pt-5 pb-4 space-y-3">
            <div>
              <h3 className="text-[15px] font-bold">Couverture par logement</h3>
              <p className="text-[12px] text-muted-foreground">Identifiez les logements qui n'ont pas encore reçu d'avis et ceux en attente de réponse.</p>
            </div>
            <div className="space-y-2">
              {propertyCoverage.sort((a, b) => b.pending - a.pending).map((p) => (
                <div key={p.property} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold truncate">{p.property}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Stars value={p.avg} size={12} />
                      <span className="text-[11px] text-muted-foreground">{p.avg.toFixed(2)}/5 · {p.count} avis</span>
                    </div>
                  </div>
                  {p.pending > 0 ? (
                    <Badge variant="outline" className="text-[10px] bg-[hsl(var(--ios-orange))]/10 text-[hsl(var(--ios-orange))] border-[hsl(var(--ios-orange))]/30">
                      {p.pending} à répondre
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] bg-[hsl(142,76%,95%)] text-[hsl(142,76%,30%)] border-[hsl(142,76%,70%)]">
                      À jour
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>

      {/* Reply dialog */}
      <Dialog open={!!replyOpen} onOpenChange={(o) => !o && setReplyOpen(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Répondre à {replyOpen?.guestName}</DialogTitle>
            <DialogDescription>
              {replyOpen?.platform} · {replyOpen?.property}
            </DialogDescription>
          </DialogHeader>
          {replyOpen && (
            <div className="space-y-3">
              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <Stars value={replyOpen.rating} />
                <p className="text-[13px] mt-2">{replyOpen.comment}</p>
              </div>
              <Textarea
                placeholder="Votre réponse publique au voyageur…"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={5}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyOpen(null)}>Annuler</Button>
            <Button onClick={sendReply} disabled={!replyText.trim()}>Envoyer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reviews;
