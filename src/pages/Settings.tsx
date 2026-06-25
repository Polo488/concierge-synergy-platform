import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { User, CreditCard, Radio, Zap, Plug } from 'lucide-react';

const TABS = [
  { id: 'account', label: 'Compte', Icon: User, desc: 'Profil, informations de connexion et préférences personnelles.' },
  { id: 'subscription', label: 'Abonnement', Icon: CreditCard, desc: 'Plan, facturation Noé et historique des paiements.' },
  { id: 'channels', label: 'Canaux', Icon: Radio, desc: 'Connexion Airbnb, Booking, Vrbo et plateformes de distribution.' },
  { id: 'automations', label: 'Automatisations', Icon: Zap, desc: 'Règles, déclencheurs et scénarios automatisés.' },
  { id: 'integrations', label: 'Intégrations', Icon: Plug, desc: 'Outils tiers, webhooks et API.' },
] as const;

type TabId = (typeof TABS)[number]['id'];

const Settings = () => {
  const { tab } = useParams<{ tab?: TabId }>();
  const navigate = useNavigate();
  const activeTab: TabId = (tab && TABS.some(t => t.id === tab) ? tab : 'account') as TabId;

  useEffect(() => {
    document.title = 'Paramètres - Noé';
  }, []);

  return (
    <div className="space-y-6 w-full overflow-x-hidden">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Paramètres</h1>
        <p className="text-sm text-muted-foreground mt-1">Configuration globale de votre espace Noé</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => navigate(`/app/settings/${v}`)}>
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full h-auto">
          {TABS.map(({ id, label, Icon }) => (
            <TabsTrigger key={id} value={id} className="gap-2 py-2">
              <Icon className="h-4 w-4" />
              <span className="text-sm">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map(({ id, label, Icon, desc }) => (
          <TabsContent key={id} value={id} className="mt-6">
            <Card>
              <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-[hsl(var(--ios-orange)/0.10)] flex items-center justify-center">
                  <Icon className="h-7 w-7 text-[hsl(var(--ios-orange))]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{label}</h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-md">{desc}</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">
                  Configuration à venir
                </span>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Settings;
