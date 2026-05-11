# Plan — Modifications Noé suite retours équipe RM

5 chantiers à livrer dans l'ordre de priorité demandé. Tout est mock/frontend (pas de migration DB), réutilise les hooks existants (`useStatsData`, `useCalendarData`, `usePricingRules`, `useAlertRules`).

## 1. Calendrier — Système de couches (priorité 1)

**Fichiers touchés :**
- `src/pages/Calendar.tsx` — ajouter un `LayerSwitcher` (3 options radio : Réservations / Réservations + Prix / Réservations + Ménage)
- `src/components/calendar/grid/CalendarGrid.tsx` + `PropertyRow.tsx` + `DayCell.tsx` — recevoir `activeLayer: 'bookings' | 'pricing' | 'cleaning'` et adapter le rendu
- `src/hooks/calendar/mockData.ts` — densifier le jeu de démo (passer ~50% d'occupation à ~75% sur 2 mois autour d'aujourd'hui pour rendre les couches lisibles)

**Logique de rendu par case :**
- Layer `bookings` : comportement actuel (case blanche si vide)
- Layer `pricing` : si la case est vide → afficher le prix nuitée (déjà disponible via `dailyPrices`). Si réservée → masquer le prix, afficher la résa.
- Layer `cleaning` : sur chaque jour de check-out d'une réservation, badge "🧹 Ménage" en bas de case (small pill orange). Une mission par checkout.

## 2. Règles RM — Gap Fill + Relâche min stay (priorité 2)

**Fichiers touchés :**
- `src/types/calendar.ts` (ou nouveau `src/types/rmRules.ts`) — types `GapFillRule`, `MinStayReleaseRule`
- `src/hooks/calendar/usePricingRules.ts` — étendre avec `gapFillEnabled`, `minStayReleaseEnabled`, `minStayReleaseDaysBefore`, `minStayReleaseTarget`
- Nouveau composant `src/components/calendar/RMRulesPanel.tsx` — accordion dans la sidebar pricing avec :
  - Toggle Gap Fill + tooltip d'explication
  - Toggle Relâche auto + 2 inputs (J-X, min nuits cible)
- `CalendarGrid` : badge icône (Sparkles) sur cases concernées par un gap détecté

**Détection Gap Fill (utilitaire pur dans `src/utils/rmRules.ts`) :**
- Pour chaque propriété, parcourir les jours, trouver les segments libres consécutifs entre 2 résa
- Si `gap.length < currentMinStay` → marquer ces jours comme `gapFilled` (min stay temporaire = gap.length)

**Détection Relâche :**
- Pour chaque jour vide à `<= daysBefore` jours d'aujourd'hui, marquer min stay = `releaseTarget`

## 3. Stats — Comparaisons N-1 à date + YTD (priorité 3)

**Fichiers touchés :**
- `src/hooks/useStatsData.ts` — étendre chaque KPI avec `{ value, vsM1, vsN1ToDate, ytd, ytdN1 }`. Générer mock cohérent.
- `src/components/stats/StatsOverview.tsx` + `StatsFinance.tsx` — pour chaque KPI card, afficher 3 lignes de comparaison (vs M-1 / vs N-1 même période / YTD vs YTD N-1)
- Nouveau composant `src/components/stats/KPIComparisonBlock.tsx` réutilisable (3 deltas verticaux, flèches up/down, % colorés)
- Ajouter un toggle `Mensuel | Annuel (YTD)` en haut de la page Stats qui change la lecture des cards

S'assurer de **ne pas toucher** la section Qualité de ménage.

## 4. Santé Financière — KPI RevPAR vs Marché (priorité 4)

**Fichiers touchés :**
- `src/components/stats/FinancialHealth.tsx` — ajouter une 4e card à côté de Noé Score / Tréso Pulse / Perf Index
- Mock du delta marché dans le même hook (valeurs : conciergerie +25%, marché +10%)

**Card "RevPAR vs Marché" :**
- Titre + 2 valeurs côte à côte (Conciergerie / Marché)
- Delta en pts + badge couleur :
  - Vert si conciergerie > marché de >2 pts (Surperformance)
  - Orange si |delta| ≤ 2 pts (Aligné)
  - Rouge si conciergerie < marché de >2 pts (Sous-performance)

## 5. Insights — Wording alerte occupation (priorité 5)

**Fichiers touchés :**
- `src/hooks/useAlertRules.ts` ou `src/types/alertRules.ts` — renommer le label de la règle d'occupation pour expliciter "moyen du portefeuille"
- `src/components/insights/RuleBuilderDialog.tsx` + `RulesTable.tsx` — afficher "Taux d'occupation moyen du portefeuille en dessous du seuil paramétré" + helper text. Vérifier que le seuil est bien un input modifiable (pas hardcodé 65%).

## Sections explicitement non touchées
Stats Qualité ménage, architecture des alertes (hors wording), règle moyenne durée, facturation.

## Détails techniques

- Tous les composants utilisent les tokens iOS 26 existants (glass-surface, navy/orange).
- Pas de migration DB : tout en mock pour cohérence avec le reste du projet (le user a confirmé "fais du mock pour l'instant").
- Pas de modif sur les routes, AuthContext, sidebar.
- Réutilisation maximale : `usePricingRules`, `useStatsData`, `useAlertRules` étendus plutôt que dupliqués.
