# Components Internal - Documentation

## Vue d'ensemble

Le dossier `components/internal` contient un système de visualisation des boundaries (limites) pour l'application Next.js. Ce système permet aux développeurs de visualiser et comprendre les différents modes de rendu (rendering) et d'hydratation (hydration) des composants React dans une application Next.js 16.

## Composants

### 1. BoundaryProvider

**Fichier:** `BoundaryProvider.tsx`

#### Description
Provider React qui gère l'état global du mode d'affichage des boundaries à travers toute l'application via Context API.

#### Fonctionnalités
- Gère trois modes d'affichage : `'off'`, `'hydration'`, `'rendering'`
- Persiste le mode sélectionné dans `localStorage` pour maintenir la préférence entre les sessions
- Fournit un contexte accessible à tous les composants enfants

#### Utilisation
```tsx
import { BoundaryProvider } from '@/components/internal/BoundaryProvider';

// Dans app/layout.tsx (racine de l'application)
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <BoundaryProvider>
          {children}
        </BoundaryProvider>
      </body>
    </html>
  );
}
```

#### Hook personnalisé
```tsx
import { useBoundaryMode } from '@/components/internal/BoundaryProvider';

function MyComponent() {
  const { mode, setMode, toggleMode } = useBoundaryMode();
  // mode: 'off' | 'hydration' | 'rendering'
  // setMode: (mode: BoundaryMode) => void
  // toggleMode: () => void
}
```

---

### 2. BoundaryToggle

**Fichier:** `BoundaryToggle.tsx`

#### Description
Interface utilisateur fixe (bouton toggle) permettant de basculer entre les différents modes de visualisation des boundaries.

#### Caractéristiques
- Position fixe en bas à droite de l'écran (`fixed right-8 bottom-4 z-50`)
- Trois boutons pour changer de mode :
  - **Off** (icône Square) : Désactive l'affichage des boundaries
  - **Hydration** (icône Droplets) : Affiche les types d'hydratation des composants
  - **Rendering** (icône Layers) : Affiche les modes de rendu
- Design responsive avec texte masqué sur petits écrans
- Support mode sombre/clair

#### Utilisation
```tsx
import BoundaryToggle from './internal/BoundaryToggle';

// Dans Header.tsx
export default function Header() {
  return (
    <>
      <header>...</header>
      <BoundaryToggle />
    </>
  );
}
```

---

### 3. Boundary

**Fichier:** `Boundary.tsx`

#### Description
Composant wrapper qui entoure visuellement les composants avec des bordures colorées et des labels pour indiquer leur type de rendu et d'hydratation.

#### Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `children` | `React.ReactNode` | **requis** | Contenu à entourer |
| `rendering` | `'static' \| 'dynamic' \| 'hybrid'` | `undefined` | Type de rendu du composant |
| `hydration` | `'server' \| 'client' \| 'hybrid'` | `undefined` | Type d'hydratation du composant |
| `label` | `string` | auto-généré | Label personnalisé à afficher |
| `showLabel` | `boolean` | `true` | Afficher ou masquer le label |
| `cached` | `boolean` | `false` | Indique si le composant utilise le cache |

#### Codes couleurs

##### Mode Rendering
- 🔴 **Rouge** (`static`) : Rendu statique
- 🔵 **Bleu** (`dynamic`) : Rendu dynamique
- 🟣 **Violet** (`hybrid`) : Rendu hybride

##### Mode Hydration
- 🔴 **Rouge** (`server`) : Composant serveur
- 🔵 **Bleu** (`client`) : Composant client
- 🟣 **Violet** (`hybrid`) : Composant hybride

##### Badge Cached
- 🟢 **Vert** : Indique que le composant utilise `'use cache'` (Next.js 16)

#### Comportement adaptatif
- **Taille normale** : Affiche une bordure en pointillés avec un label positionné en haut à gauche
- **Petite taille** (< 60px) : Affiche uniquement un petit cercle coloré en haut à droite pour ne pas surcharger l'interface

#### Utilisation

```tsx
import Boundary from '@/components/internal/Boundary';

// Exemple 1: Composant serveur avec rendu statique
export default function Layout({ children }) {
  return (
    <Boundary rendering="static" hydration="server">
      <div>{children}</div>
    </Boundary>
  );
}

// Exemple 2: Composant client interactif
'use client';
export default function Search() {
  return (
    <Boundary hydration="client">
      <input type="search" />
    </Boundary>
  );
}

// Exemple 3: Composant avec cache
export default async function Hero() {
  'use cache';
  
  return (
    <Boundary rendering="hybrid" hydration="server" cached>
      <div>Hero content</div>
    </Boundary>
  );
}

// Exemple 4: Label personnalisé
<Boundary rendering="dynamic" hydration="server" label="User Data">
  <UserProfile />
</Boundary>
```

---

## Guide de choix des valeurs

### Choisir la valeur de `rendering`

Le paramètre `rendering` indique **comment Next.js génère le HTML** de votre composant.

#### `rendering="static"` - Rendu Statique
**Utiliser quand :**
- Le contenu ne change jamais ou très rarement
- Aucune donnée utilisateur ou requête n'influence le rendu
- Le composant peut être généré au moment du build

**Exemples dans ce projet :**
```tsx
// app/layout.tsx - Layout global de l'application
<Boundary rendering="static" hydration="server">
  <div className="flex min-h-screen flex-col">
    {/* Structure HTML fixe */}
  </div>
</Boundary>
```

#### `rendering="dynamic"` - Rendu Dynamique
**Utiliser quand :**
- Le contenu dépend de données utilisateur (cookies, session, auth)
- Le contenu change à chaque requête
- Impossible de pré-rendre le contenu

**Exemples dans ce projet :**
```tsx
// features/user/components/UserProfile.tsx
<Boundary rendering="dynamic" hydration="server">
  {/* Affiche des données spécifiques à l'utilisateur connecté */}
</Boundary>

// features/user/components/SavedProducts.tsx
<Boundary rendering="dynamic" hydration="server">
  {/* Liste des produits sauvegardés par l'utilisateur */}
</Boundary>
```

#### `rendering="hybrid"` - Rendu Hybride
**Utiliser quand :**
- Le composant peut être partiellement pré-rendu
- Utilise des données qui peuvent être mises en cache
- Combine aspects statiques et dynamiques

**Exemples dans ce projet :**
```tsx
// features/product/components/Hero.tsx (avec 'use cache')
<Boundary rendering="hybrid" hydration="server" cached>
  {/* Produit vedette - données cachées mais peuvent être invalidées */}
</Boundary>

// features/product/components/ProductList.tsx
<Boundary rendering="hybrid" hydration="server">
  {/* Liste de produits avec pagination - peut utiliser le cache */}
</Boundary>
```

---

### Choisir la valeur de `hydration`

Le paramètre `hydration` indique **où le composant s'exécute** et comment il devient interactif.

#### `hydration="server"` - Composant Serveur
**Utiliser quand :**
- Aucune interactivité requise (pas d'événements onClick, onChange, etc.)
- Pas besoin de hooks React comme `useState`, `useEffect`
- Composant affiche uniquement des données (async/await autorisé)
- Pas besoin de la directive `'use client'`

**Exemples dans ce projet :**
```tsx
// features/category/components/FeaturedCategories.tsx
export default async function FeaturedCategories() {
  'use cache';
  const categories = await getCategoriesWithCount();
  
  return (
    <Boundary rendering="hybrid" hydration="server" cached>
      {/* Affichage simple de catégories, pas d'interactivité */}
    </Boundary>
  );
}
```

#### `hydration="client"` - Composant Client
**Utiliser quand :**
- Composant nécessite de l'interactivité
- Utilise des hooks React (`useState`, `useEffect`, `useTransition`, etc.)
- Utilise des événements navigateur (click, input, etc.)
- Requiert la directive `'use client'`

**Exemples dans ce projet :**
```tsx
// components/Search.tsx
'use client';
export default function Search() {
  const [isPending, startTransition] = useTransition();
  
  return (
    <Boundary hydration="client">
      <input onChange={...} /> {/* Interactivité */}
    </Boundary>
  );
}

// components/ui/Button.tsx
'use client';
export default function Button({ onClick, ... }) {
  const { pending } = useFormStatus(); // Hook client
  
  return (
    <Boundary hydration="client">
      <button onClick={onClick}>...</button>
    </Boundary>
  );
}
```

#### `hydration="hybrid"` - Composant Hybride
**Utiliser quand :**
- Composant contient à la fois du code serveur et client
- Architecture mixte avec Server Components imbriqués dans Client Components
- Cas d'usage avancés

**Note :** Ce mode n'est pas utilisé dans le projet actuel. La plupart des composants sont soit entièrement serveur, soit entièrement client.

---

### Choisir la valeur de `cached`

Le paramètre `cached` indique si le composant utilise le **système de cache de Next.js 16**.

#### `cached={true}`
**Utiliser quand :**
- Le composant utilise la directive `'use cache'` (Next.js 16)
- Les données sont mises en cache côté serveur
- Utilise `cacheTag()` pour l'invalidation du cache

**Exemples dans ce projet :**
```tsx
// features/product/components/Hero.tsx
export default async function Hero() {
  'use cache';
  cacheTag('featured-product');
  
  const products = await getFeaturedProducts(1);
  
  return (
    <Boundary rendering="hybrid" hydration="server" cached>
      {/* ✅ cached={true} car utilise 'use cache' */}
    </Boundary>
  );
}

// features/category/components/FeaturedCategories.tsx
export default async function FeaturedCategories() {
  'use cache';
  const categories = await getCategoriesWithCount();
  
  return (
    <Boundary rendering="hybrid" hydration="server" cached>
      {/* ✅ cached={true} car utilise 'use cache' */}
    </Boundary>
  );
}
```

#### `cached={false}` (défaut)
**Utiliser quand :**
- Le composant n'utilise pas `'use cache'`
- Les données doivent être fraîches à chaque requête
- Composant client (pas de cache côté serveur)

```tsx
// features/user/components/SavedProducts.tsx
export default async function SavedProducts() {
  // ❌ Pas de 'use cache' - données spécifiques à l'utilisateur
  const savedProducts = await getSavedProducts();
  
  return (
    <Boundary rendering="dynamic" hydration="server">
      {/* cached par défaut = false */}
    </Boundary>
  );
}
```

---

## Arbre de décision

```
┌─────────────────────────────────────────┐
│ Le composant est-il interactif ?        │
│ (onClick, onChange, hooks React)        │
└────────────┬────────────────────────────┘
             │
    ┌────────┴─────────┐
    │ OUI              │ NON
    ▼                  ▼
hydration="client"   hydration="server"
                       │
                       │
        ┌──────────────┴────────────────┐
        │ Les données changent-elles    │
        │ pour chaque utilisateur ?     │
        └──────────┬────────────────────┘
                   │
          ┌────────┴─────────┐
          │ OUI              │ NON
          ▼                  ▼
    rendering="dynamic"   Le composant utilise-t-il
                          'use cache' ?
                            │
                     ┌──────┴───────┐
                     │ OUI          │ NON
                     ▼              ▼
              rendering="hybrid"  rendering="static"
              cached={true}        ou "hybrid"
```

---

## Exemples de patterns courants

### Pattern 1: Layout statique
```tsx
// Structure HTML globale, jamais modifiée
<Boundary rendering="static" hydration="server">
  <div className="layout">...</div>
</Boundary>
```

### Pattern 2: Données utilisateur
```tsx
// Données spécifiques à l'utilisateur connecté
<Boundary rendering="dynamic" hydration="server">
  <UserProfile />
</Boundary>
```

### Pattern 3: Contenu en cache
```tsx
// Données en cache avec invalidation
export default async function ProductList() {
  'use cache';
  
  return (
    <Boundary rendering="hybrid" hydration="server" cached>
      {/* ... */}
    </Boundary>
  );
}
```

### Pattern 4: Composant interactif
```tsx
'use client';

export default function SearchBar() {
  return (
    <Boundary hydration="client">
      <input type="search" onChange={...} />
    </Boundary>
  );
}
```

### Pattern 5: Bouton avec état
```tsx
'use client';

export default function SaveButton() {
  return (
    <Boundary hydration="client" rendering="dynamic">
      <button onClick={...}>Save</button>
    </Boundary>
  );
}
```

---

## Meilleures pratiques

### 1. Cohérence des props
- Si `hydration="client"`, le rendering est généralement `"dynamic"`
- Si `cached={true}`, assurez-vous d'avoir `'use cache'` dans le composant
- Si `rendering="static"`, utilisez `hydration="server"`

### 2. Placement stratégique
- Placez les Boundaries aux **points de transition** importants
- Ne sur-utilisez pas : trop de boundaries rend l'UI confuse
- Utilisez des labels descriptifs pour les zones complexes

### 3. Mode développement uniquement
- Les Boundaries sont des outils de **développement et débogage**
- En production, le mode est généralement `'off'`
- Utilisez-les pour comprendre et optimiser le rendu

### 4. Documentation vivante
- Les Boundaries servent de **documentation visuelle**
- Elles aident à comprendre l'architecture de l'application
- Utiles pour l'onboarding de nouveaux développeurs

---

## Dépannage

### Le Boundary ne s'affiche pas
- Vérifiez que le mode n'est pas sur `'off'`
- Assurez-vous que `rendering` ou `hydration` est défini
- Le mode doit correspondre à la prop (rendering/hydration)

### Mauvaise couleur affichée
- Vérifiez que les valeurs correspondent bien au comportement réel
- Pour `cached={true}`, vérifiez la présence de `'use cache'`

### Cercle au lieu de bordure
- Le composant est trop petit (< 60px)
- C'est un comportement normal pour économiser l'espace
- Passez la souris pour voir le label dans le tooltip

---

## Ressources supplémentaires

- [Next.js 16 Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Next.js 16 Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [Next.js 16 Caching](https://nextjs.org/docs/app/building-your-application/caching)
- [React Server Components](https://react.dev/reference/rsc/server-components)

---

## Contribution

Pour modifier ou étendre le système de Boundaries :

1. **BoundaryProvider** : Ajouter de nouveaux modes dans le type `BoundaryMode`
2. **BoundaryToggle** : Ajouter de nouveaux boutons dans l'array `modes`
3. **Boundary** : Ajouter de nouvelles couleurs dans `renderingColors` ou `componentColors`

Exemple d'ajout d'un nouveau mode :
```tsx
// Dans BoundaryProvider.tsx
export type BoundaryMode = 'off' | 'hydration' | 'rendering' | 'performance';

// Dans BoundaryToggle.tsx
const modes = [
  { icon: <Square />, label: 'Off', mode: 'off' },
  { icon: <Droplets />, label: 'Hydration', mode: 'hydration' },
  { icon: <Layers />, label: 'Rendering', mode: 'rendering' },
  { icon: <Zap />, label: 'Performance', mode: 'performance' },
];
```
