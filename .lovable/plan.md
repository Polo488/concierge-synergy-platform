
# Cockpit Financier — Plan de build

Module unifié de pilotage de la rentabilité, route `/app/cockpit-financier`, icône `Gauge`, catégorie **Pilotage** dans la sidebar. Refactorise et regroupe Noé Score, Tréso Pulse et Perf Index, ajoute un radar de diagnostic, une analyse ménage, un import bancaire CSV et une page de prise de RDV audit.

## Architecture globale

- **Route** : `/app/cockpit-financier` (+ alias non préfixé qui redirige)
- **Permission** : nouvelle clé `cockpitFinancier` dans `PermissionMap`, accordée aux rôles Admin / Supervisor / City Manager / Owner (Owner en lecture seule)
- **Sidebar** : nouvelle entrée dans la section PILOTAGE, juste sous le Tableau de bord, icône `Gauge`
- **Header persistant** : badge Score Cockpit (calculé : 40% Noé Score + 30% Perf Index + 20% Tréso Pulse + 10% pénalité failles), niveaux Critique/Fragile/Acceptable/Solide/Excellent, comparaison percentile anonymisée, bouton "Partager mon Score"
- **5 onglets** en navigation horizontale scrollable (sans scrollbar visible mobile) : Vue d'ensemble · Diagnostic · Ménage · Charges réelles · Audit financier (badge orange "Offert")

## Phasage

```text
Phase 1  Fondation        — route, sidebar, layout, header, mocks, score global
Phase 2  Vue d'ensemble   — 3 cards refactorisées + sparklines + Bilan flash
Phase 3  Diagnostic       — radar SVG animé + failles + drawer + confetti
Phase 4  Ménage           — cards logements + drawer 4 leviers + simulateur
Phase 5  Charges réelles  — dropzone CSV + animation 3 phases + validation
Phase 6  Audit            — pitch + calendrier + témoignages + ressources
Phase 7  Partage          — génération carte 1080×1920 + Web Share API
```

## Composants principaux

```text
src/pages/CockpitFinancier.tsx
src/components/cockpit/
├── CockpitHeader.tsx              // score global + partage
├── CockpitTabs.tsx                // navigation 5 onglets
├── overview/
│   ├── OverviewAlertBanner.tsx
│   ├── NoeScoreCard.tsx
│   ├── TresoPulseCard.tsx
│   ├── PerfIndexCard.tsx
│   ├── EvolutionStrip.tsx         // sparklines Recharts
│   └── BilanFlashModal.tsx        // 5 questions, 1 par écran
├── diagnostic/
│   ├── RadarVisualization.tsx     // SVG, 4 phases d'animation
│   ├── RadarScanButton.tsx
│   ├── FlawsList.tsx + FlawCard.tsx
│   ├── FlawDetailDrawer.tsx
│   └── ScanHistory.tsx
├── cleaning/
│   ├── CleaningOverviewBanner.tsx
│   ├── PropertyCleaningCard.tsx
│   ├── CleaningLeversDrawer.tsx
│   ├── LeverSimulator.tsx
│   └── NegotiationTemplate.tsx
├── csv/
│   ├── CSVImportDropzone.tsx
│   ├── CSVImportAnimation.tsx
│   ├── CSVValidationView.tsx + CSVRowCard.tsx
│   ├── CSVResultCard.tsx          // donut Recharts
│   └── CSVMemorizedRules.tsx
├── audit/
│   ├── AuditPitchSection.tsx
│   ├── AuditCalendar.tsx
│   └── AuditTestimonials.tsx
├── shared/
│   ├── ShareScoreModal.tsx
│   ├── AuditCTAModal.tsx
│   └── CockpitConfetti.tsx
src/hooks/cockpit/
├── useCockpitScore.ts
├── useRadarScan.ts
├── useCSVParser.ts
└── useAuditCTA.ts                 // gestion cookies / triggers
src/data/cockpit-mock.ts           // toutes les données beta
```

## Détails techniques par onglet

### 1. Vue d'ensemble
3 cards (border-left 4px : orange / bleu #6B7AE8 / jaune #F5C842), CountUp animés, mini-graph horizontal segmenté pour Noé Score, jauge BFR pour Tréso, ring SVG pour Perf Index. Bandeau évolution 6 mois en sparklines Recharts. Bilan flash : modal plein écran, slide horizontal entre questions, barre de progression, retour final avec 3 axes prioritaires + CTA Audit inline.

### 2. Diagnostic — radar
SVG radar (320px desktop / 240px mobile), 4 cercles concentriques + croix diagonale, logo Noé centré. Animation de scan en 4 phases : préparation 300ms → balayage 4–5s (ligne radar avec gradient + trail, points d'alerte qui pop-in 600ms, halo pulse) → fin 500ms → résumé slide-up. 8 catégories de failles mockées, 3 sévérités (Critique rouge / Important orange / À surveiller jaune). Drawer détail : diagnostic, mini bar chart Toi vs marché, 3 actions, gain potentiel CountUp. Animation de correction : confetti orange (60 particules max, 1.5s), card devient verte, toast, mise à jour décrémentale du compteur global. Trigger Audit après correction d'une faille critique (cookie 7 jours). Historique des scans repliable.

### 3. Ménage
Banner stats (équilibrés / sous-facturés / à valider). Cards par logement avec border-left coloré, barre de progression écart €. Filtres pills. Drawer 4 leviers :
- **Levier 1** : mini-simulateur avec stepper +/- 5€ et calcul live de l'équilibre
- **Levier 2** : template message prestataire copiable / envoyable via messagerie
- **Levier 3** : bar chart comparatif Toi vs médiane vs top 25%
- **Levier 4** : passage en débours + check contrat

Animation succès post-action + trigger CTA Audit.

### 4. Charges réelles — CSV
État vide avec dropzone drag & drop (animation pulse au hover fichier). Parser multi-format (BNP / CA / SG / CIC / Boursorama / Qonto) — détection séparateur, encoding, colonnes. Animation 3 phases : détection 1–2s → pré-classification 2–3s avec faisceau scanner et compteur live → résultats 3 cards slide-up. Vue de validation 3 colonnes (essentielles vert / non essentielles rouge / à valider jaune) — desktop : boutons ✓/✗ au hover, mobile : swipe gauche/droite + 1 colonne à la fois en swipe horizontal. Mémorisation : règles stockées avec toast discret. Carte résultat avec donut Recharts + résultat net en CountUp. Plan d'action : 3 optimisations chiffrées. Modal CTA Audit auto 2s après le résultat (cookie permanent 1ère fois). Historique des imports + drawer "Règles mémorisées".

### 5. Audit financier
Header pitch, 3 cards d'avantages, calendrier (iframe Calendly OU widget custom 14 jours), choix 30 ou 60 min, 3 témoignages mockés, ressources (PDF / replay / calculateur). Pas de pop-up, badge orange "Offert" sur l'onglet.

### Partage social
Carte image 1080×1920 générée via `<canvas>` (pas de dépendance externe) : gradient navy, logo Noé, score Plus Jakarta Sans 700 200px, 3 mini-stats, tagline. Boutons : Télécharger PNG / Partager (`navigator.share`) / Copier le lien.

## Données mockées
Fichier `src/data/cockpit-mock.ts` avec : `getCockpitScore`, `generateRadarScan`, `getCleaningAnalysis` (41 logements), `getCSVImportMock`, `getAuditSlots`. Pas d'écriture en base pour la beta — état local + localStorage pour persistance entre sessions (clés `cockpit_*`). Le CTA Audit utilise des cookies `audit_last_dismissed` (7 jours) et `audit_first_csv_shown` (permanent).

## Design system & contraintes
- Couleurs : navy `#1A1A2E`, orange `#FF5C1A`, bleu `#6B7AE8`, jaune `#F5C842`, rouge `#E84545`, vert `#34C759` — toutes ajoutées en HSL aux tokens `index.css` / `tailwind.config.ts`
- Typographies : Plus Jakarta Sans 700 (titres), Inter (corps), `tabular-nums` sur tous les chiffres monétaires
- Easing global : `cubic-bezier(0.16, 1, 0.3, 1)` — durations 300–500ms (4–5s pour le radar)
- `prefers-reduced-motion` strictement respecté : rotation radar remplacée par fade-in séquentiel, pas de confetti
- Mobile : 100% no-overflow, drawers full-screen slide-up, CTA sticky bottom si pertinent, inputs ≥16px
- Conformité memory iOS 26 : primitives glass-surface, halos visibles sur le body, pas de bounce/spring exagéré
- Aucune mention d'IA dans la copy utilisateur, jargon comptable expliqué la 1ère fois, percentile anonymisé uniquement, pas de notification push agressive

## Permissions & rôles
Mise à jour : `src/types/roles.ts` (ajout `cockpitFinancier: boolean`), `src/utils/roleUtils.ts` (Admin / Supervisor / City Manager : true ; Owner : true mais lecture seule sur certains onglets ; Employee / Cleaning / Maintenance : false).

## Hors scope (à valider)
- Intégration réelle Calendly ou widget custom à confirmer (par défaut : iframe Calendly placeholder)
- Pas d'écriture Supabase en phase beta — uniquement mocks + localStorage
- Calculateur de seuil de rentabilité (ressource) : juste un lien, pas le mini-outil lui-même

## Estimation
~15 jours dev linéaire. Livraison incrémentale onglet par onglet à valider après chaque phase.
