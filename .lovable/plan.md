

# Plan: Portail Marketing Noé

## Vue d'ensemble

Creation d'un site marketing public (portail) pour Noé, vivant aux cotes de l'application existante sans la modifier. Le design reutilisera strictement le systeme de design actuel (glassmorphisme, typographie Inter, palette de couleurs) tout en adoptant un ton convivial et axe sur les benefices, inspire de Hospitable.com.

---

## Architecture technique

```text
src/
├── pages/
│   └── portal/
│       ├── PortalHome.tsx          # Page d'accueil "/"
│       ├── PortalProduit.tsx       # /produit
│       ├── PortalModules.tsx       # /modules
│       ├── PortalTarifs.tsx        # /tarifs
│       ├── PortalSecurite.tsx      # /securite
│       ├── PortalContact.tsx       # /contact
│       └── PortalConnexion.tsx     # /connexion
├── components/
│   └── portal/
│       ├── PortalLayout.tsx        # Layout avec Header/Footer
│       ├── PortalHeader.tsx        # Navigation desktop/mobile
│       ├── PortalFooter.tsx        # Pied de page
│       ├── HeroSection.tsx         # Section hero page d'accueil
│       ├── ValueBlock.tsx          # Bloc de valeur reutilisable
│       ├── FeatureCard.tsx         # Carte module
│       ├── PricingCard.tsx         # Carte tarif
│       ├── FAQAccordion.tsx        # FAQ accordeon
│       ├── ContactForm.tsx         # Formulaire de contact
│       └── MockDashboard.tsx       # Visuel mock de l'app
```

---

## Strategie de routage

Le routage sera restructure pour separer les routes publiques (portail) des routes protegees (application).

**Nouvelle structure de App.tsx :**

```text
Routes
├── Routes Portail (publiques, sans authentification)
│   ├── / (PortalHome)
│   ├── /produit
│   ├── /modules
│   ├── /tarifs
│   ├── /securite
│   ├── /contact
│   └── /connexion (redirection vers /login)
│
├── /login (page de connexion existante)
│
└── Routes Application (protegees)
    └── /app/* (toutes les routes existantes sous /app)
        ├── /app (Dashboard)
        ├── /app/properties
        ├── /app/calendar
        └── ... (toutes les autres routes)
```

**Impact sur l'existant :**
- La page Dashboard actuelle sera accessible via `/app` au lieu de `/`
- Les liens dans l'application (Sidebar) seront mis a jour pour pointer vers `/app/*`
- Le AuthContext redirigera vers `/app` apres connexion
- Aucune modification du comportement ou des fonctionnalites existantes

---

## Composants principaux

### 1. PortalLayout

Layout englobant pour toutes les pages du portail :
- PortalHeader (navigation)
- Contenu de la page (via Outlet)
- PortalFooter

### 2. PortalHeader

**Desktop :**
- Logo Noe (gauche)
- Liens : Produit, Modules, Tarifs, Securite, Contact (centre)
- CTA "Connexion" (droite) - bouton primaire

**Mobile :**
- Logo (gauche)
- Menu hamburger (droite)
- Menu deroulant avec tous les liens + Connexion

Styles : `glass-panel` sur scroll, animations subtiles

### 3. PortalFooter

- Liens vers toutes les pages
- Liens legaux (Mentions legales, Confidentialite)
- Copyright

### 4. HeroSection

- Titre principal avec headline impactante
- Sous-titre explicatif
- Deux boutons CTA (primaire + secondaire)
- Visuel mock de l'application (MockDashboard)
- Gradient subtil en arriere-plan

### 5. MockDashboard

Representation visuelle simplifiee de l'interface :
- Simule un calendrier avec reservations colorees
- Cartes de statistiques avec chiffres fictifs
- Style identique a l'app (bg-card, rounded-xl, etc.)

---

## Contenu des pages

### Page Accueil (/)

1. **Hero Section**
   - Headline, subheadline, 2 CTAs
   - Mock visuel de l'app

2. **Value Blocks** (3 colonnes)
   - "Un outil qui s'adapte a votre facon de travailler"
   - "Une synchronisation fiable, sans prise de tete"
   - "Une vision claire, enfin"

3. **Social Proof**
   - Titre + texte explicatif
   - Logos partenaires (placeholders)

4. **Feature Highlights** (3 elements)
   - Calendrier, Menage/Maintenance, Statistiques
   - 2 lignes max par element

5. **Closing CTA**
   - Bouton "Demander une demo"

### Page Produit (/produit)

1. "Pourquoi Noe existe" - explication du probleme
2. "Ce que Noe centralise" - liste a puces
3. "Comment ca marche" - 4 etapes numerotees
4. "Resultats" - outcome section
5. CTAs finaux

### Page Modules (/modules)

Grille de cartes module (expandables) :
- Calendrier et planning
- Menage et maintenance
- Statistiques
- Moyenne duree
- Facturation
- Messagerie
- Experience voyageur

Chaque carte : titre + valeur + 3 outcomes

### Page Tarifs (/tarifs)

1. Texte d'introduction
2. **Deux cartes tarif** cote a cote :
   - **Noe** : 4€/mois/logement, liste features, CTA "Choisir Noe"
   - **Pimp my Noe** : 15€/mois/logement, liste features, CTA "Parler a un expert"
3. Add-on facturation mentionne
4. FAQ accordeon (4 questions)

### Page Securite (/securite)

3 sections rassurantes :
- "Vos donnees vous appartiennent"
- "Des acces maitrises"
- "Un outil pense pour durer"

### Page Contact (/contact)

Formulaire :
- Nom, Email, Societe, Nombre de logements, Message
- Bouton "Envoyer"
- Texte d'introduction convivial

### Page Connexion (/connexion)

Redirection vers /login ou affichage simple avec bouton vers /login

---

## Design et style

**Reutilisation stricte du DA existant :**
- Classes : `glass-panel`, `glass-subtle`, `bg-card`, `rounded-xl`, `rounded-2xl`
- Couleurs : `primary`, `muted`, `foreground`, `background`
- Typographie : Inter, memes tailles (text-sm, text-lg, text-3xl, etc.)
- Ombres : `shadow-glass`, `shadow-card`
- Animations : `animate-fade-in`, `animate-slide-up`

**Specifique au portail :**
- Sections avec `max-w-6xl mx-auto`
- Espacement genereux (`py-20`, `py-24`)
- Gradients subtils en arriere-plan (deja dans CSS global)

---

## Fichiers a creer

| Fichier | Description |
|---------|-------------|
| `src/components/portal/PortalLayout.tsx` | Layout avec Header/Footer |
| `src/components/portal/PortalHeader.tsx` | Navigation responsive |
| `src/components/portal/PortalFooter.tsx` | Pied de page |
| `src/components/portal/HeroSection.tsx` | Section hero |
| `src/components/portal/ValueBlock.tsx` | Bloc valeur reutilisable |
| `src/components/portal/FeatureCard.tsx` | Carte feature |
| `src/components/portal/ModuleCard.tsx` | Carte module expandable |
| `src/components/portal/PricingCard.tsx` | Carte tarif |
| `src/components/portal/FAQAccordion.tsx` | FAQ accordeon |
| `src/components/portal/ContactForm.tsx` | Formulaire contact |
| `src/components/portal/MockDashboard.tsx` | Visuel mock app |
| `src/components/portal/SocialProof.tsx` | Section temoignages |
| `src/pages/portal/PortalHome.tsx` | Page accueil |
| `src/pages/portal/PortalProduit.tsx` | Page produit |
| `src/pages/portal/PortalModules.tsx` | Page modules |
| `src/pages/portal/PortalTarifs.tsx` | Page tarifs |
| `src/pages/portal/PortalSecurite.tsx` | Page securite |
| `src/pages/portal/PortalContact.tsx` | Page contact |

---

## Fichiers a modifier

| Fichier | Modification |
|---------|--------------|
| `src/App.tsx` | Restructuration des routes (portail public + app sous /app) |
| `src/components/layout/Sidebar.tsx` | Prefixer tous les paths avec `/app` |
| `src/contexts/AuthContext.tsx` | Redirection post-login vers `/app` |
| `src/components/auth/ProtectedRoute.tsx` | Ajuster si necessaire |

---

## Section technique

### Modifications de App.tsx

```text
Routes
├── "/" → PortalLayout (public)
│   ├── index → PortalHome
│   ├── "produit" → PortalProduit
│   ├── "modules" → PortalModules
│   ├── "tarifs" → PortalTarifs
│   ├── "securite" → PortalSecurite
│   └── "contact" → PortalContact
├── "/connexion" → Redirect to "/login"
├── "/login" → Login (existant)
└── "/app" → ProtectedRoute + Layout (existant)
    ├── index → Dashboard
    ├── "properties" → Properties
    └── ... (toutes les routes actuelles)
```

### Modification Sidebar.tsx

Mise a jour de tous les chemins :
- `path: '/'` → `path: '/app'`
- `path: '/properties'` → `path: '/app/properties'`
- etc.

### Modification AuthContext.tsx

Apres login reussi, navigation vers `/app` au lieu de `/`

---

## Estimation

- **Composants portail** : 12 fichiers
- **Pages portail** : 6 fichiers
- **Modifications existant** : 3-4 fichiers (routes, sidebar, auth)

