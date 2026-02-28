# Logique des notes et des liens famille

## Ce que vous voulez (résumé)

1. **Notes parent → enfant**  
   - Le **parent** note son **enfant** (depuis « Mes Enfants »).  
   - Dans l’**espace de l’enfant** (« Mes Parents »), l’enfant **ne voit que le tableau des notes** (celles que ses parents lui ont données), **sans** bouton « Ajouter une note ».

2. **Notes mari → femme**  
   - Le **mari** note sa **femme** (depuis « Ma Femme »).  
   - La **femme** (depuis « Mon Homme ») **ne voit que le tableau des notes** (celles que son mari lui a données), **sans** bouton « Ajouter une note ».

3. **Lien parent–enfant**  
   - C’est le **parent** qui **ajoute** l’enfant (demande de liaison).  
   - C’est l’**enfant** qui **confirme** (ou refuse).  
   → Déjà en place : parent envoie, enfant reçoit une invitation et peut confirmer.

4. **Liens créés depuis l’arbre**  
   - Les liaisons demandées depuis l’arbre (demande d’accès), une fois **confirmées par le parent**, doivent **s’appliquer** aussi comme lien parent–enfant (pour que parent/enfant soient bien liés partout dans l’appli).  
   → À renforcer : à la confirmation d’accès arbre, créer ou activer le lien `ParentChildLink` si besoin.

---

## Ce qui était en place avant les changements

| Élément | État |
|--------|------|
| Parent ajoute enfant, enfant confirme | ✅ Déjà fait (liaison avec statut `pending` → `active`) |
| Notes parent → enfant (stockage) | ❌ Uniquement en local (state) dans « Mes Enfants », pas d’API |
| Enfant voit les notes reçues (sans bouton ajouter) | ❌ Page « Mes Parents » affichait un bloc « Notes de mes parents » **avec** bouton ajouter (notes que l’enfant donnait à ses parents, pas l’inverse) |
| Notes mari → femme (stockage) | ❌ Uniquement en local (state) dans la page partenaire |
| Femme voit seulement le tableau (sans ajouter) | ❌ Les deux (mari et femme) voyaient le formulaire d’ajout |
| Confirmation arbre → crée lien parent–enfant | ❌ La confirmation arbre ajoutait l’enfant à l’arbre mais ne créait pas de `ParentChildLink` |

---

## Ce qui a été mis en place (logique appliquée)

1. **Backend – Notes parent → enfant**  
   - Modèle `ParentChildRating` (parent_numero_h, child_numero_h, annee, note).  
   - **POST** : le parent ajoute une note pour un enfant (vérification : l’utilisateur est bien le parent de cet enfant).  
   - **GET** : l’enfant récupère toutes les notes que ses parents lui ont données (où child_numero_h = lui).

2. **Backend – Notes partenaire (mari → femme)**  
   - Modèle `PartnerRating` (from_numero_h, to_numero_h, annee, note).  
   - **POST** : le mari (from = lui, to = partenaire) ajoute une note.  
   - **GET** : la femme récupère les notes que son partenaire lui a données (to_numero_h = elle).

3. **Page « Mes Parents » (enfant)**  
   - Titre : **« Notes que mes parents m’ont données »**.  
   - **Uniquement le tableau** des notes (chargées via l’API), **pas** de formulaire ni bouton « Ajouter une note ».

4. **Page « Mes Enfants » (parent)**  
   - Pour chaque enfant sélectionné : **formulaire d’ajout + tableau** des notes.  
   - Les notes sont **enregistrées et chargées via l’API** (parent_numero_h / child_numero_h).

5. **Page partenaire (Ma Femme / Mon Homme)**  
   - **Si l’utilisateur est un homme** (page « Ma Femme ») : **formulaire d’ajout + tableau** des notes (il note sa femme).  
   - **Si l’utilisateur est une femme** (page « Mon Homme ») : **uniquement le tableau** des notes (celles que son mari lui a données), **pas** de bouton ajouter.

6. **Confirmation d’accès depuis l’arbre**  
   - Lorsqu’un parent **confirme l’accès** d’un enfant à l’arbre (`POST /api/family-tree/confirm-access/:id`), le backend **crée ou active** aussi le lien parent–enfant (`ParentChildLink`) pour que la liaison soit valable partout (arbre + pages Mes Parents / Mes Enfants).

---

## Récap : qui voit quoi

| Page | Utilisateur | Bloc notes | Bouton « Ajouter une note » |
|------|-------------|------------|-----------------------------|
| Mes Parents | Enfant | Tableau « Notes que mes parents m’ont données » | Non |
| Mes Enfants | Parent | Tableau + formulaire par enfant | Oui (parent note l’enfant) |
| Ma Femme | Mari | Tableau + formulaire | Oui (mari note la femme) |
| Mon Homme | Femme | Tableau uniquement | Non |

Les données de notes sont **persistées en base** et partagées entre les bons profils (parent/enfant, mari/femme) via les APIs.
