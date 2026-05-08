
# Plan — Évolutions Ménage, Tarification & Espace Équipes Ménage

Le périmètre est large (4 chantiers, ~10 nouvelles surfaces UI, 1 nouveau rôle, plusieurs tables). Je propose de découper en **3 phases livrables** comme suggéré dans ton brief, et de commencer par la Phase 1 dans ce sprint. Chaque phase est testable indépendamment.

---

## Phase 1 — Opérationnel ménage quotidien (ce sprint)

### 1A. Auto-assignation prestataires (par logement)
- Fiche logement (`PropertyDetailsDialog`) → nouvelle section **Équipe ménage assignée**
  - Multi-select prestataires (avatars/chips, pattern existant)
  - Mode : `rotation` (round-robin) ou `priorité` (fallback)
  - Toggle **Auto-assignation ON/OFF**
- À la création d'une tâche ménage (depuis réservation), appliquer la règle
- Override manuel possible depuis module Ménage (inchangé)
- Badge tâche : `Auto` / `Manuel` + log (qui, quand)

### 1B. Bandeau progression journalière
- Composant `CleaningDailyProgress` sticky en haut du module Ménage
- Format : `X / Y ménages effectués aujourd'hui` + barre animée (Framer Motion)
- Couleurs : 0–50 % orange, 50–80 % jaune, 80–100 % vert
- Popover au clic : breakdown (Effectués / En cours / Restants / Check-in J)

### 1C. Check-in jour J & alertes
- Détection auto : tâche ménage + réservation check-in même date/logement → flag `is_same_day_checkin`
- Badge **CHECK-IN 16H** orange, filtre dédié, section prioritaires en haut
- Système d'alertes (in-app dans cette phase ; email/SMS Phase 2 via edge function)
  - Seuils H-1 / H-30 / H-0
  - Page **Settings → Notifications ménage** : toggles canaux, multi-select seuils, destinataires
  - Centre notifs in-app : toast persistant pour critique, escalade manager si H-1 ignorée
  - Actions rapides : Contacter / Réassigner / Marquer fait

---

## Phase 2 — Onglet Tarification fiche logement
- Nouvel onglet **Tarification** dans la fiche logement
- Carte **Ménage** : prix prestataire (HT/TTC), forfait facturé voyageur + description, toggle push API, marge auto (€ + %)
- Carte **Location** : nuitée standard, min, max
- Bouton **Pousser sur les plateformes** + statut sync par plateforme (Airbnb / Booking / Abritel) — UI seulement, l'intégration API plateformes sera mockée (pas de vraie clé Airbnb dans ce projet)

---

## Phase 3 — Espace Équipes de ménage (nouveau rôle)
- Rôle `cleaningTeam` ajouté (déjà `cleaning` existe → on **renomme/étend** ce rôle plutôt que doubler)
- Routes `/app/cleaning-team/*` : Dashboard, Mes ménages, Facturation, Performance, Profil
- Mobile-first strict (ce rôle bossera depuis téléphone)
- Facturation : calcul auto `nb ménages × prix prestataire`, génération PDF (jsPDF déjà en place)
- Performance : note moyenne, évolution, comparatif anonymisé
- RLS strict : la team ne voit QUE ses logements/ménages, jamais prix voyageur ni marges

---

## Backend (Supabase) — vue d'ensemble

Tables touchées (3 migrations, une par phase) :

**Phase 1**
- `properties` : `default_cleaning_team_ids[]`, `cleaning_assignment_mode`, `cleaning_auto_assign`
- `cleaning_tasks` : `is_same_day_checkin`, `assigned_via`, `alert_h1_triggered`, `alert_h30_triggered`, `validated_at`, `last_assignment_actor`, `last_assignment_at`
- `notification_preferences` : nouvelle table avec scope ménage

**Phase 2**
- `properties` : `cleaning_provider_price`, `cleaning_provider_price_vat`, `cleaning_guest_fee`, `cleaning_fee_includes`, `cleaning_fee_push_api`, `nightly_rate_standard`, `nightly_rate_min`, `nightly_rate_max`, `platform_sync_status` (jsonb)

**Phase 3**
- `cleaning_team_profiles` (id, user_id, name, iban, contact, …)
- `cleaning_team_invoices` (period_start, period_end, total_amount, status, pdf_url, line_items)
- `user_roles` : ajouter valeur `cleaning_team` à l'enum
- RLS strictes sur toutes les tables ménage côté `cleaning_team`

**Note honnête** : aujourd'hui le projet tourne en **mock data** (pas de vraies tables `properties` / `cleaning_tasks` côté Supabase — cf. `src/contexts/cleaning/initialState.ts`, `mockPropertyGenerator`). Pour rester cohérent et ne **rien casser**, je propose d'implémenter Phase 1 et 2 **sur le mock data** (extension des types + state), et de matérialiser les tables Supabase **uniquement en Phase 3** où l'auth réelle d'un prestataire externe l'exige. Si tu veux qu'on bascule TOUT sur Supabase dès maintenant, c'est un chantier à part (migration des mocks → DB) qu'il faut décider explicitement.

---

## Points à confirmer avant de coder

1. **Mock vs DB réelle** pour Phase 1/2 : on reste sur les mocks (rapide, pas de régression) OU on migre `properties`/`cleaning_tasks` vers Supabase d'abord (gros chantier additionnel) ?
2. **Rôle `cleaning` existant vs nouveau `cleaning_team`** : je préfère **étendre** le rôle `cleaning` existant (déjà câblé partout : sidebar, RBAC, route `/app/cleaning`) plutôt qu'en créer un second qui ferait doublon. OK ?
3. **Email/SMS d'alerte** : besoin d'une edge function + Resend (email Lovable Cloud) + provider SMS (Twilio = secret à ajouter). On fait **in-app uniquement Phase 1**, et email/SMS en Phase 2 quand tu valides l'ajout de Twilio ?
4. **Push API plateformes** (Airbnb/Booking) : pas de vraies clés dispo → UI + statut mockés. OK ?

---

## Livraison ce sprint si tu valides

Phase 1 complète : auto-assignation + barre progression + check-in J + alertes in-app + page settings notifications. Pas de régression sur les modules existants. Phases 2 et 3 dans des sprints suivants.

Réponds-moi sur les 4 points ci-dessus et je démarre Phase 1 immédiatement.
