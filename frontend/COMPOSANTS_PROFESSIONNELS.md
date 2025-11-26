# 🎯 Guide d'utilisation des composants professionnels

Ce guide explique comment utiliser les nouveaux composants professionnels ajoutés à votre application.

## 📋 Composants disponibles

### 1. **Système de Notifications Toast** (`notify`)

Un système de notifications élégant avec différents types de messages.

#### Utilisation :

```typescript
import { notify } from "../utils/toast";

// Notification de succès
notify.success("Opération réussie !");

// Notification d'erreur
notify.error("Une erreur s'est produite");

// Notification d'avertissement
notify.warning("Attention : Cette action est irréversible");

// Notification d'information
notify.info("Information importante");

// Notification de chargement
const toastId = notify.loading("Chargement en cours...");
// ... faire quelque chose
toast.dismiss(toastId);
notify.success("Chargement terminé !");

// Notification avec Promise
notify.promise(
  fetchData(),
  {
    loading: "Chargement des données...",
    success: "Données chargées avec succès !",
    error: (err) => `Erreur : ${err.message}`
  }
);
```

---

### 2. **Skeleton Loaders** (`SkeletonLoader`)

Remplacez les "Chargement..." par des placeholders animés professionnels.

#### Utilisation :

```typescript
import { 
  SkeletonLoader, 
  SkeletonCard, 
  SkeletonTable, 
  SkeletonList,
  SkeletonDashboard 
} from "../components/SkeletonLoader";

// Skeleton basique
<SkeletonLoader variant="text" count={3} />
<SkeletonLoader variant="circular" className="w-16 h-16" />
<SkeletonLoader variant="rectangular" className="h-32 w-full" />
<SkeletonLoader variant="card" />

// Skeleton spécialisés
<SkeletonCard />        // Pour les cartes
<SkeletonTable />      // Pour les tableaux
<SkeletonList />       // Pour les listes
<SkeletonDashboard />  // Pour les dashboards
```

#### Exemple dans un composant :

```typescript
{isLoading ? (
  <SkeletonDashboard />
) : (
  <DashboardContent data={data} />
)}
```

---

### 3. **Pagination** (`Pagination`)

Composant de pagination professionnel pour les listes longues.

#### Utilisation :

```typescript
import { Pagination } from "../components/Pagination";

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={(page) => setCurrentPage(page)}
  itemsPerPage={10}
  totalItems={totalItems}
  showInfo={true}
/>
```

#### Avec le hook `usePagination` :

```typescript
import { usePagination } from "../hooks/usePagination";

const {
  currentItems,
  currentPage,
  totalPages,
  goToPage,
  nextPage,
  previousPage,
  canGoNext,
  canGoPrevious
} = usePagination({
  items: allItems,
  itemsPerPage: 10,
  initialPage: 1
});

return (
  <>
    {/* Afficher les items de la page actuelle */}
    {currentItems.map(item => <ItemCard key={item.id} item={item} />)}
    
    {/* Pagination */}
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={goToPage}
      itemsPerPage={10}
      totalItems={allItems.length}
    />
  </>
);
```

---

### 4. **Barre de recherche avancée** (`SearchBar`)

Barre de recherche avec filtres et debounce automatique.

#### Utilisation :

```typescript
import { SearchBar } from "../components/SearchBar";

const [searchResults, setSearchResults] = useState([]);

<SearchBar
  placeholder="Rechercher des utilisateurs..."
  onSearch={(query) => {
    // Recherche avec debounce automatique (300ms)
    performSearch(query);
  }}
  filters={[
    {
      label: "Région",
      key: "region",
      options: [
        { label: "Toutes les régions", value: "" },
        { label: "Conakry", value: "conakry" },
        { label: "Kindia", value: "kindia" },
      ]
    },
    {
      label: "Activité",
      key: "activity",
      options: [
        { label: "Toutes", value: "" },
        { label: "Commerce", value: "commerce" },
        { label: "Agriculture", value: "agriculture" },
      ]
    }
  ]}
  onFilterChange={(filters) => {
    // Filtres appliqués
    applyFilters(filters);
  }}
/>
```

---

### 5. **Breadcrumbs** (`Breadcrumbs`)

Fil d'Ariane pour la navigation hiérarchique.

#### Utilisation :

```typescript
import { Breadcrumbs } from "../components/Breadcrumbs";

<Breadcrumbs
  items={[
    { label: "Accueil", path: "/", icon: "🏠" },
    { label: "Famille", path: "/famille", icon: "👨‍👩‍👧‍👦" },
    { label: "Parents", path: "/famille/parents" },
    { label: "Détails" }, // Page actuelle (pas de path)
  ]}
/>
```

---

### 6. **Lazy Image** (`LazyImage`)

Chargement différé des images avec skeleton pendant le chargement.

#### Utilisation :

```typescript
import { LazyImage } from "../components/LazyImage";

<LazyImage
  src="/path/to/image.jpg"
  alt="Description de l'image"
  fallback="/placeholder.png"
  placeholder="skeleton"
  className="w-full h-64 rounded-lg"
/>

// Avec placeholder blur
<LazyImage
  src="/path/to/image.jpg"
  alt="Description"
  placeholder="blur"
  className="rounded-xl"
/>
```

---

### 7. **Error Boundary** (`ErrorBoundary`)

Gestion globale des erreurs (déjà intégré dans `main.tsx`).

#### Utilisation personnalisée :

```typescript
import { ErrorBoundary } from "../components/ErrorBoundary";

<ErrorBoundary fallback={<CustomErrorPage />}>
  <YourComponent />
</ErrorBoundary>
```

---

## 🎨 Exemples d'intégration complète

### Exemple 1 : Page avec recherche, pagination et skeleton

```typescript
import { useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { Pagination } from "../components/Pagination";
import { usePagination } from "../hooks/usePagination";
import { SkeletonList } from "../components/SkeletonLoader";
import { notify } from "../utils/toast";

export function UserList() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const {
    currentItems,
    currentPage,
    totalPages,
    goToPage,
    totalItems
  } = usePagination({
    items: filteredUsers,
    itemsPerPage: 10
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Filtrer les utilisateurs
  };

  if (isLoading) {
    return <SkeletonList />;
  }

  return (
    <div className="space-y-6">
      <SearchBar
        placeholder="Rechercher un utilisateur..."
        onSearch={handleSearch}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentItems.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        itemsPerPage={10}
        totalItems={totalItems}
      />
    </div>
  );
}
```

### Exemple 2 : Formulaire avec notifications

```typescript
import { notify } from "../utils/toast";

const handleSubmit = async (data) => {
  try {
    notify.loading("Enregistrement en cours...");
    
    const result = await saveData(data);
    
    notify.dismiss(); // Fermer le loading
    notify.success("Données enregistrées avec succès !");
  } catch (error) {
    notify.error(`Erreur : ${error.message}`);
  }
};
```

---

## 🚀 Prochaines étapes

Ces composants sont prêts à l'emploi et peuvent être utilisés partout dans votre application. Pour améliorer encore plus :

1. Ajoutez des transitions animées
2. Créez des composants de formulaire réutilisables
3. Implémentez un système de cache pour les données
4. Ajoutez des tests unitaires

---

**Bon développement ! 🎉**

