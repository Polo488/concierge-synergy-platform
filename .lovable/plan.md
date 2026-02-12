

# Portail Proprietaire

## Resume

Creer un espace dedie aux proprietaires ou ils peuvent se connecter, suivre l'avancement de l'onboarding de leur bien, et signer leur mandat de gestion directement depuis leur compte. Cela remplace le systeme de tokens/liens publics actuel.

## Fonctionnement utilisateur

1. L'administrateur cree un onboarding pour un bien --> il renseigne l'email du proprietaire
2. L'admin clique sur "Inviter le proprietaire" --> un compte `owner` est cree avec un mot de passe temporaire (ou visible pour la demo)
3. Le proprietaire se connecte via la page `/login` avec son email
4. Il arrive sur son portail `/app/owner` ou il voit :
   - L'avancement de son onboarding (les 8 etapes avec leur statut)
   - Le mandat a signer quand l'etape est active
   - Les informations de son bien
5. Il signe le mandat depuis son portail --> l'etape "Mandat" passe automatiquement en "completed"

## Changements techniques

### 1. Nouveau role `owner`

Ajouter le role `owner` dans le systeme de roles existant :
- **`src/types/roles.ts`** : ajouter `'owner'` au type `UserRole`, ajouter `ownerPortal: boolean` dans `PermissionMap`
- **`src/utils/roleUtils.ts`** : ajouter la config du role `owner` avec uniquement la permission `ownerPortal: true`, route par defaut `/app/owner`

### 2. Page du portail proprietaire

Creer **`src/pages/OwnerPortal.tsx`** :
- Affiche les onboardings lies a l'email du proprietaire connecte
- Pour chaque onboarding : une timeline verticale des 8 etapes avec leur statut (icones vertes/grises/orange)
- Section "Document a signer" quand l'etape mandat est active : affiche le contenu du mandat avec les variables resolues et le bouton pour signer
- Section "Informations du bien" avec l'adresse, le type, le responsable assigne
- Design epure et professionnel, adapte a un utilisateur non-technique

### 3. Mise a jour du routing

**`src/App.tsx`** :
- Ajouter la route `/app/owner` avec `RoutePermission` sur `ownerPortal`
- Supprimer la route publique `/sign` (plus necessaire)

### 4. Mise a jour de l'authentification

**`src/contexts/AuthContext.tsx`** :
- Ajouter un utilisateur mock `owner` (ex: `marie.dupont@email.com`)
- Ajouter `/app/owner` dans la liste des chemins verifies pour les permissions
- Le role `owner` redirige automatiquement vers `/app/owner`

### 5. Mise a jour de la page Login

**`src/pages/Login.tsx`** :
- Ajouter un bouton de demo "Proprietaire" pour se connecter rapidement

### 6. Mise a jour du Sidebar

**`src/components/layout/Sidebar.tsx`** :
- Pour le role `owner`, afficher un sidebar simplifie avec uniquement "Mon espace" et "Deconnexion"
- Pas de sections PILOTAGE, OPERATIONS, etc.

### 7. Invitation du proprietaire depuis l'onboarding

**`src/components/onboarding/OnboardingDetail.tsx`** ou equivalent :
- Ajouter un bouton "Inviter le proprietaire" dans l'etape Mandat
- Ce bouton cree le compte mock du proprietaire et affiche un toast de confirmation

### 8. Integration signature dans le portail

- Reutiliser le composant `SigningFlow` existant directement dans `OwnerPortal.tsx`
- Le proprietaire voit le document, scrolle, signe --> confettis
- La signature met a jour le statut de l'etape mandat dans l'onboarding

## Fichiers concernes

- `src/types/roles.ts` -- ajout du role `owner` et permission `ownerPortal`
- `src/utils/roleUtils.ts` -- config du role `owner`
- `src/pages/OwnerPortal.tsx` -- nouveau fichier, page principale du portail
- `src/App.tsx` -- ajout route `/app/owner`
- `src/contexts/AuthContext.tsx` -- mock user owner, gestion permission `/app/owner`
- `src/pages/Login.tsx` -- bouton demo proprietaire
- `src/components/layout/Sidebar.tsx` -- sidebar simplifie pour owner

