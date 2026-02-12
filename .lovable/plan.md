

# Editeur de document texte avec zones dynamiques

## Contexte du probleme

Actuellement, le systeme repose sur l'import d'un PDF puis le placement de zones par drag-and-drop sur le rendu du PDF. Le probleme : les zones sont positionnees visuellement mais ne sont pas liees au contenu du texte. L'utilisateur ne peut pas "surligner" un passage pour le rendre dynamique.

## Nouvelle approche

Remplacer l'import PDF par un editeur de texte riche integre ou l'utilisateur peut :
1. Coller ou rediger directement le contenu du mandat
2. Selectionner un passage de texte et le transformer en "variable dynamique" (ex: nom du proprietaire, adresse, commission)
3. Les variables apparaissent comme des badges colores dans le texte
4. Lors de la signature, les variables sont automatiquement remplacees par les vraies valeurs

## Fonctionnement utilisateur

1. Creer un nouveau modele --> un editeur de texte s'ouvre
2. Coller le texte du mandat de gestion
3. Selectionner "Jean Dupont" dans le texte --> cliquer sur "Nom du proprietaire" --> le texte est remplace par un placeholder `{{owner_name}}`
4. Repeter pour chaque champ variable (adresse, commission, date, etc.)
5. Ajouter les zones de signature/initiales/date en bas du document (celles-ci restent des zones positionnees)

## Changements techniques

### 1. Nouvelle colonne `document_content` sur `signature_templates`

Ajouter une colonne `document_content TEXT` dans la table `signature_templates` pour stocker le contenu du document avec les placeholders de variables (format texte avec marqueurs `{{field_key}}`).

### 2. Nouveau composant `DocumentContentEditor`

Creer `src/components/signature/DocumentContentEditor.tsx` :
- Un `<Textarea>` ou editeur de texte enrichi pour coller/rediger le contenu
- Un panneau lateral avec la liste des champs disponibles (`FIELD_KEY_OPTIONS`)
- Quand l'utilisateur selectionne du texte et clique sur un champ, le texte selectionne est remplace par `{{field_key}}` affiche comme un badge
- Pour la mise en forme, utiliser un systeme simple de rendu : le contenu est stocke en texte brut avec des marqueurs `{{owner_name}}`, `{{property_address}}`, etc.
- Affichage en temps reel avec les placeholders rendus en badges colores

### 3. Mise a jour de `SignatureZoneEditor`

- Remplacer le canvas PDF par le `DocumentContentEditor` pour la partie contenu textuel
- Garder la possibilite d'ajouter des zones de signature/initiales en bas du document (ces zones ne sont pas "dans" le texte)
- Supprimer la logique d'upload PDF et le rendu PDF canvas
- Conserver le panneau lateral pour les zones de signature/initiales uniquement

### 4. Mise a jour de `SignatureTemplatesList`

- Retirer la section d'upload PDF du dialogue de creation
- Ajouter un champ `<Textarea>` pour coller le contenu du document directement a la creation

### 5. Mise a jour de `SigningFlow`

- Le `DocumentPreview` affiche le contenu texte du template avec les variables remplacees par les vraies valeurs de la session
- Le texte est rendu dans un format document (police serif, marges, espacement)
- Les zones de signature/initiales restent en overlay en bas

### 6. Mise a jour de `useSignature.ts`

- `createTemplate` accepte un parametre `documentContent`
- `updateTemplate` supporte la mise a jour de `documentContent`
- `createSession` remplace les `{{field_key}}` par les valeurs reelles dans `fieldValues`

### 7. Mise a jour des types

- Ajouter `documentContent?: string` a `SignatureTemplate`

### 8. Export PDF admin

- Adapter `generateSignedPDF` dans `SignatureAdmin.tsx` pour rendre le contenu texte avec les variables resolues au lieu du contenu statique

## Fichiers concernes

- `supabase/migrations/` -- nouvelle migration pour `document_content`
- `src/types/signature.ts` -- ajout de `documentContent`
- `src/components/signature/DocumentContentEditor.tsx` -- nouveau composant
- `src/components/signature/SignatureZoneEditor.tsx` -- refactoring majeur
- `src/components/signature/SignatureTemplatesList.tsx` -- retrait upload PDF
- `src/components/signature/SigningFlow.tsx` -- rendu du contenu texte
- `src/hooks/useSignature.ts` -- support `documentContent`
- `src/pages/SignatureAdmin.tsx` -- adaptation export PDF

