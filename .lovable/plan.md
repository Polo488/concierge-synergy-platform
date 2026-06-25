
## Lot — 3 suggestions du PDF Noé

### #1 — Colonnes configurables (module Propriétés)
- Ajouter bouton **"Configurer"** (icône `Settings2`) en haut à droite de `Properties.tsx` (vue Liste uniquement).
- Nouveau composant `PropertyColumnsDialog.tsx` :
  - Liste des colonnes disponibles : N°, Adresse, Type, **Propriétaire**, Commission, Nuits, Chambres, Surface, Statut.
  - Pour chaque : toggle visible/caché + poignée drag-and-drop (réutilise `@dnd-kit` déjà installé) pour réordonner.
  - Boutons "Réinitialiser" / "Enregistrer".
- Persistance via `localStorage` key `noe.properties.columns`, hook `usePropertyColumns()`.
- `PropertyList.tsx` rend dynamiquement les colonnes selon la config (vue desktop). Vue mobile inchangée.

### #2 — Consolidation des Settings dans la bulle profil (header)
- Dans `Header.tsx`, enrichir le `DropdownMenu` de l'avatar avec un nouveau bloc **Paramètres** :
  - Compte (`/app/settings/account`)
  - Abonnement (`/app/settings/subscription`)
  - Canaux (`/app/settings/channels`)
  - Automatisations (`/app/settings/automations`)
  - Intégrations (`/app/settings/integrations`)
  - Séparateur, puis Déconnexion (existant).
- Créer `src/pages/Settings.tsx` : page unique avec onglets (Tabs shadcn) correspondant aux 5 sections, chacune en placeholder iOS-26 cohérent (titre, description, état "Configuration à venir"). Route catch `/app/settings/*` pointe vers ce composant et lit l'onglet via `useParams`.
- Aucun icône bas-gauche n'existe actuellement dans la sidebar — rien à supprimer côté UI.

### #3 — Barre de raccourcis personnalisable (bas sidebar)
- Nouveau composant `SidebarShortcuts.tsx` rendu en bas de `Sidebar.tsx` au-dessus de "Déconnexion" :
  - Jusqu'à **5 icônes** épinglées par utilisateur, choisies parmi les items de navigation existants.
  - En mode collapsed : grille verticale d'icônes. En mode expanded : ligne horizontale d'icônes (sans label).
  - Bouton "+" pour ouvrir `ShortcutsPickerDialog.tsx` (multi-select max 5 parmi les items autorisés par permission).
- Persistance localStorage key `noe.sidebar.shortcuts` (array de paths), hook `useSidebarShortcuts()`.
- Caché pour le rôle `owner` et `cleaning` (interfaces dédiées).

### Notes techniques
- Pas de changement DB : tout est local (localStorage), conforme aux autres préférences UI du projet (`useMenuOrder`).
- Réutilise les primitives iOS 26 existantes (`ios-popover`, `glass-thin`, `ios-btn-icon`).
- Aucune modification de logique métier.
