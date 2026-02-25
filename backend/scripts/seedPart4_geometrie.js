// PARTIE 4 — GÉOMÉTRIE : du primaire à la Terminale (22 leçons)
export const LECONS_GEOMETRIE = [
  {
    slug: 'geo-triangle',
    title: 'Le triangle',
    category: 'geometrie', level: 'debutant',
    triggers: ['triangle','triangles','type de triangle','triangle rectangle','triangle equilateral','triangle isocele','triangle scalene','périmètre triangle','aire triangle'],
    answer: `Excellente question ! ✨

📐 **LE TRIANGLE**

Un triangle est une figure plane à **3 côtés** et **3 sommets**.

**Propriété fondamentale :**
La somme des 3 angles d'un triangle est toujours égale à **180°**.

---

**TYPES DE TRIANGLES**

| Type | Définition | Particularité |
|---|---|---|
| **Équilatéral** | 3 côtés égaux | 3 angles de 60° |
| **Isocèle** | 2 côtés égaux | 2 angles égaux |
| **Rectangle** | 1 angle de 90° | Hypoténuse = côté le plus long |
| **Scalène** | 3 côtés différents | 3 angles différents |

---

**PÉRIMÈTRE** = somme des 3 côtés
> P = a + b + c

**Exemple :** côtés 3 cm, 4 cm, 5 cm → P = 3 + 4 + 5 = **12 cm**

---

**AIRE (surface)**
> A = (base × hauteur) / 2

**Exemple :** base = 6 cm, hauteur = 4 cm → A = (6 × 4) / 2 = **12 cm²**

---

**Erreur fréquente :** La hauteur n'est pas forcément un côté ! C'est la perpendiculaire abaissée depuis un sommet sur le côté opposé.

Continue comme ça ! 💪`,
  },
  {
    slug: 'geo-rectangle',
    title: 'Le rectangle',
    category: 'geometrie', level: 'debutant',
    triggers: ['rectangle','rectangles','périmètre rectangle','aire rectangle','longueur largeur','figure rectangle'],
    answer: `Excellente question ! ✨

📐 **LE RECTANGLE**

Un rectangle est un quadrilatère (4 côtés) avec :
- **4 angles droits** (90°)
- **2 paires de côtés opposés égaux** (longueur L et largeur l)
- **2 diagonales égales** qui se coupent en leur milieu

---

**PÉRIMÈTRE :**
> P = 2 × (L + l)

**Exemple :** L = 8 cm, l = 5 cm → P = 2 × (8 + 5) = **26 cm**

---

**AIRE :**
> A = L × l

**Exemple :** L = 8 cm, l = 5 cm → A = 8 × 5 = **40 cm²**

---

**DIAGONALE** (longueur d) :
> d = √(L² + l²)   ← Théorème de Pythagore

**Exemple :** L = 8, l = 5 → d = √(64 + 25) = √89 ≈ **9,43 cm**

---

**Cas particulier :** Un carré est un rectangle avec L = l.

Continue comme ça ! 💪`,
  },
  {
    slug: 'geo-carre',
    title: 'Le carré',
    category: 'geometrie', level: 'debutant',
    triggers: ['carré','carrés','périmètre carré','aire carré','cote du carre','figure carré'],
    answer: `Excellente question ! ✨

📐 **LE CARRÉ**

Un carré est un quadrilatère avec :
- **4 côtés égaux** (côté = c)
- **4 angles droits** (90°)
- **2 diagonales égales** qui se coupent perpendiculairement en leur milieu

---

**PÉRIMÈTRE :**
> P = 4 × c

**Exemple :** c = 7 cm → P = 4 × 7 = **28 cm**

---

**AIRE :**
> A = c²

**Exemple :** c = 7 cm → A = 7² = **49 cm²**

---

**DIAGONALE :**
> d = c × √2 ≈ c × 1,414

**Exemple :** c = 5 cm → d = 5√2 ≈ **7,07 cm**

---

**À retenir :** Le carré est à la fois un rectangle et un losange. Il a toutes les propriétés des deux !

Continue comme ça ! 💪`,
  },
  {
    slug: 'geo-cercle',
    title: 'Le cercle',
    category: 'geometrie', level: 'debutant',
    triggers: ['cercle','disque','rayon','diamètre','circonférence','périmètre cercle','aire cercle','aire disque','pi','π'],
    answer: `Excellente question ! ✨

📐 **LE CERCLE ET LE DISQUE**

**Définitions :**
- **Cercle** : ensemble des points à égale distance (rayon r) d'un centre O — c'est la ligne courbe
- **Disque** : surface délimitée par un cercle (avec l'intérieur)
- **Diamètre** : d = 2r (corde passant par le centre)
- **π (pi)** ≈ 3,14159...

---

**PÉRIMÈTRE DU CERCLE** (= circonférence) :
> C = 2πr = πd

**Exemple :** r = 5 cm → C = 2 × π × 5 = **31,42 cm**

---

**AIRE DU DISQUE :**
> A = πr²

**Exemple :** r = 5 cm → A = π × 25 = **78,54 cm²**

---

**Tableau pratique :**

| Rayon r | Circonférence C | Aire A |
|---|---|---|
| 1 cm | 6,28 cm | 3,14 cm² |
| 5 cm | 31,42 cm | 78,54 cm² |
| 10 cm | 62,83 cm | 314,16 cm² |

---

**Erreur fréquente :** Ne pas confondre rayon (r) et diamètre (d = 2r) !

Continue comme ça ! 💪`,
  },
  {
    slug: 'geo-trapeze-parallelogramme',
    title: 'Trapèze et parallélogramme',
    category: 'geometrie', level: 'intermediaire',
    triggers: ['trapèze','trapeze','parallélogramme','parallelogramme','aire trapeze','aire parallelogramme','losange','périmètre losange'],
    answer: `Excellente question ! ✨

📐 **TRAPÈZE ET PARALLÉLOGRAMME**

---

**LE PARALLÉLOGRAMME**
Quadrilatère à 2 paires de côtés parallèles et égaux.
- Côtés : a (longueur) et b (largeur)
- Hauteur : h (perpendiculaire entre les 2 côtés parallèles)

> **Aire = base × hauteur = a × h**

**Exemple :** a = 8 cm, h = 5 cm → A = 8 × 5 = **40 cm²**

**LE LOSANGE** est un parallélogramme avec 4 côtés égaux.
> **Aire = (d₁ × d₂) / 2** (où d₁ et d₂ sont les diagonales)

---

**LE TRAPÈZE**
Quadrilatère avec **exactement 1 paire de côtés parallèles** : la grande base (B) et la petite base (b).

> **Aire = ((B + b) × h) / 2**

**Exemple :** B = 10 cm, b = 6 cm, h = 4 cm
> A = ((10 + 6) × 4) / 2 = (16 × 4) / 2 = **32 cm²**

---

**Trapèze rectangle :** un des côtés non parallèles est perpendiculaire aux bases.

Continue comme ça ! 💪`,
  },
  {
    slug: 'geo-pythagore',
    title: 'Théorème de Pythagore',
    category: 'geometrie', level: 'intermediaire',
    triggers: ['pythagore','théorème de pythagore','hypotenuse','triangle rectangle pythagore','a2 b2 c2','a²+b²','calculer hypotenuse','reciproque pythagore'],
    answer: `Excellente question ! ✨

📐 **THÉORÈME DE PYTHAGORE**

---

**Énoncé :** Dans un triangle rectangle, le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés.

> **c² = a² + b²**

- **c** = hypoténuse (côté opposé à l'angle droit, le plus long)
- **a** et **b** = les deux autres côtés (jambes)

---

**Exemples classiques :**

| a | b | c = √(a²+b²) |
|---|---|---|
| 3 | 4 | **5** |
| 5 | 12 | **13** |
| 8 | 15 | **17** |
| 6 | 8 | **10** |

---

**CALCULS POSSIBLES :**

1. **Chercher l'hypoténuse c :**
   > c = √(a² + b²)
   > Exemple : a=3, b=4 → c = √(9+16) = √25 = **5**

2. **Chercher un côté a (connaissant c et b) :**
   > a = √(c² - b²)
   > Exemple : c=13, b=5 → a = √(169-25) = √144 = **12**

---

**RÉCIPROQUE DE PYTHAGORE :**
Si c² = a² + b², alors le triangle est rectangle en C.
> 5² = 3² + 4² → 25 = 9 + 16 ✅ → Triangle rectangle !

---

**Erreur fréquente :** Toujours vérifier que c est bien l'hypoténuse (côté le plus long, en face de l'angle droit).

Continue comme ça ! 💪`,
  },
  {
    slug: 'geo-thales',
    title: 'Théorème de Thalès',
    category: 'geometrie', level: 'intermediaire',
    triggers: ['thales','théorème de thales','droites paralleles longueurs','rapports egalite thales','configuration thales','triangle thales'],
    answer: `Excellente question ! ✨

📐 **THÉORÈME DE THALÈS**

---

**Configuration :** Dans un triangle ABC, si (DE) est parallèle à (BC) avec D sur [AB] et E sur [AC], alors :

> **AD/AB = AE/AC = DE/BC**

Les longueurs sont proportionnelles !

---

**Exemple numérique :**
- AD = 4 cm, AB = 10 cm, DE = 6 cm
- On cherche BC

Comme DE ∥ BC :
> AD/AB = DE/BC → 4/10 = 6/BC → BC = (6 × 10) / 4 = **15 cm**

---

**RÉCIPROQUE DE THALÈS :**
Si AD/AB = AE/AC, alors (DE) est parallèle à (BC).

---

**Étapes pour résoudre un problème Thalès :**
1. Identifier la configuration (triangle avec droite parallèle)
2. Écrire les trois rapports d'égalité
3. Remplir avec les valeurs connues
4. Résoudre l'équation (produit en croix)

---

**Vérification : produit en croix**
> AD/AB = DE/BC → AD × BC = AB × DE

**Erreur fréquente :** Mélanger les numérateurs et dénominateurs. Toujours mettre les longueurs du même triangle ensemble.

Continue comme ça ! 💪`,
  },
  {
    slug: 'geo-trigonometrie',
    title: 'Trigonométrie dans le triangle rectangle',
    category: 'geometrie', level: 'intermediaire',
    triggers: ['trigonométrie','sinus','cosinus','tangente','sin cos tan','angle triangle rectangle','sohcahtoa','calculer angle','sin alpha'],
    answer: `Excellente question ! ✨

📐 **TRIGONOMÉTRIE DANS LE TRIANGLE RECTANGLE**

---

**Les 3 rapports trigonométriques** (pour un angle α dans un triangle rectangle) :

| Rapport | Formule | Moyen mémo |
|---|---|---|
| sin(α) | côté opposé / hypoténuse | **SOH** |
| cos(α) | côté adjacent / hypoténuse | **CAH** |
| tan(α) | côté opposé / côté adjacent | **TOA** |

**SOHCAHTOA** = SOH-CAH-TOA : le moyen mnémotechnique !

---

**Valeurs à connaître par cœur :**

| Angle | sin | cos | tan |
|---|---|---|---|
| 0° | 0 | 1 | 0 |
| 30° | 1/2 | √3/2 | 1/√3 |
| 45° | √2/2 | √2/2 | 1 |
| 60° | √3/2 | 1/2 | √3 |
| 90° | 1 | 0 | — |

---

**Exemple :** Triangle rectangle, hypoténuse = 10, angle α = 30°.
- Côté opposé = sin(30°) × 10 = 0,5 × 10 = **5**
- Côté adjacent = cos(30°) × 10 = 0,866 × 10 = **8,66**

---

**Trouver un angle inconnu :**
> Si sin(α) = 0,5 → α = arcsin(0,5) = **30°**

Continue comme ça ! 💪`,
  },
  {
    slug: 'geo-angles',
    title: 'Les angles',
    category: 'geometrie', level: 'debutant',
    triggers: ['angles','angle','angle aigu','angle obtus','angle droit','angle plat','angle plein','angles alternes','angles correspondants','bisectrice'],
    answer: `Excellente question ! ✨

📐 **LES ANGLES**

---

**TYPES D'ANGLES**

| Nom | Mesure | Description |
|---|---|---|
| Angle nul | 0° | Côtés confondus |
| **Angle aigu** | entre 0° et 90° | Plus petit qu'un angle droit |
| **Angle droit** | 90° | Marqué d'un petit carré |
| **Angle obtus** | entre 90° et 180° | Plus grand qu'un angle droit |
| **Angle plat** | 180° | Les deux côtés forment une droite |
| Angle plein | 360° | Tour complet |

---

**PAIRES D'ANGLES**

- **Angles complémentaires :** somme = 90° (ex. 30° et 60°)
- **Angles supplémentaires :** somme = 180° (ex. 120° et 60°)
- **Angles opposés par le sommet :** égaux (quand 2 droites se coupent)

---

**ANGLES FORMÉS PAR DES PARALLÈLES**
Quand une droite coupe deux droites parallèles :
- **Angles alternes-internes :** égaux (en Z)
- **Angles correspondants :** égaux (en F)
- **Angles co-internes :** supplémentaires (somme = 180°)

---

**SOMME DES ANGLES**
- Triangle : 180°
- Quadrilatère : 360°
- Polygone à n côtés : (n − 2) × 180°

Continue comme ça ! 💪`,
  },
  {
    slug: 'geo-volume-pave',
    title: 'Volume du pavé droit et du cube',
    category: 'geometrie', level: 'intermediaire',
    triggers: ['volume pavé','volume cube','pavé droit','pave droit','volume boite','volume cubique','volume longueur largeur hauteur','cm3','m3'],
    answer: `Excellente question ! ✨

📦 **VOLUME DU PAVÉ DROIT ET DU CUBE**

---

**LE PAVÉ DROIT** (= boîte rectangulaire)
Dimensions : longueur L, largeur l, hauteur h

> **Volume = L × l × h**

> **Aire de la surface totale = 2(Ll + Lh + lh)**

**Exemple :** L = 5 cm, l = 3 cm, h = 4 cm
> V = 5 × 3 × 4 = **60 cm³**
> Aire = 2(5×3 + 5×4 + 3×4) = 2(15+20+12) = 2×47 = **94 cm²**

---

**LE CUBE** (cas particulier avec L = l = h = a)

> **Volume = a³**

> **Aire totale = 6a²** (6 faces carrées identiques)

**Exemple :** a = 4 cm
> V = 4³ = **64 cm³**
> Aire = 6 × 16 = **96 cm²**

---

**Unités de volume :**
- 1 m³ = 1 000 dm³ = 1 000 000 cm³ = 1 000 000 000 mm³
- 1 litre = 1 dm³ = 1 000 cm³

**Exemple concret :** Un aquarium de 60 cm × 30 cm × 40 cm
> V = 60 × 30 × 40 = 72 000 cm³ = **72 litres**

Continue comme ça ! 💪`,
  },
  {
    slug: 'geo-volume-cylindre-cone-sphere',
    title: 'Volume du cylindre, du cône et de la sphère',
    category: 'geometrie', level: 'intermediaire',
    triggers: ['volume cylindre','volume cône','volume cone','volume sphère','volume sphere','cylindre','cône','sphère','volume solide de révolution'],
    answer: `Excellente question ! ✨

📐 **VOLUMES DES SOLIDES DE RÉVOLUTION**

---

**LE CYLINDRE** (rayon r, hauteur h)
> **V = πr²h**
> **Aire totale = 2πr² + 2πrh = 2πr(r + h)**

**Exemple :** r = 3 cm, h = 10 cm
> V = π × 9 × 10 = **90π ≈ 282,7 cm³**

---

**LE CÔNE** (rayon r, hauteur h)
> **V = (1/3) × πr²h** = un tiers du cylindre correspondant

**Exemple :** r = 3 cm, h = 6 cm
> V = (1/3) × π × 9 × 6 = **18π ≈ 56,5 cm³**

---

**LA SPHÈRE** (rayon r)
> **V = (4/3)πr³**
> **Aire = 4πr²**

**Exemple :** r = 5 cm
> V = (4/3) × π × 125 = **500π/3 ≈ 523,6 cm³**
> Aire = 4 × π × 25 = **100π ≈ 314,2 cm²**

---

**TABLEAU RÉCAPITULATIF**

| Solide | Volume | Formule |
|---|---|---|
| Cylindre | πr²h | |
| Cône | πr²h/3 | |
| Sphère | 4πr³/3 | |
| Pyramide | Aire base × h / 3 | |

---

**Astuce :** Le volume du cône = 1/3 du volume du cylindre de même base et hauteur !

Continue comme ça ! 💪`,
  },
  {
    slug: 'geo-volume-pyramide',
    title: 'Volume de la pyramide et du prisme',
    category: 'geometrie', level: 'intermediaire',
    triggers: ['volume pyramide','pyramide','volume prisme','prisme','base pyramide','hauteur pyramide','aire base'],
    answer: `Excellente question ! ✨

📐 **VOLUME DE LA PYRAMIDE ET DU PRISME**

---

**LA PYRAMIDE**
Une pyramide a une base polygonale et des faces triangulaires qui convergent vers un sommet (apex).

> **V = (Aire de la base × hauteur) / 3**

**Exemple — Pyramide à base carrée :**
- Base carrée de côté a = 6 cm, hauteur h = 9 cm
- Aire base = 6² = 36 cm²
> V = (36 × 9) / 3 = **108 cm³**

**Exemple — Pyramide à base rectangulaire :**
- Base 5 cm × 4 cm, hauteur h = 12 cm
- Aire base = 20 cm²
> V = (20 × 12) / 3 = **80 cm³**

---

**LE PRISME DROIT**
Un prisme a deux bases identiques (polygones) reliées par des faces rectangulaires.

> **V = Aire de la base × hauteur**

**Exemple — Prisme triangulaire :**
- Base triangulaire : base 6 cm, hauteur 4 cm → Aire = (6×4)/2 = 12 cm²
- Hauteur du prisme = 10 cm
> V = 12 × 10 = **120 cm³**

---

**Erreur fréquente :** Ne pas oublier de diviser par 3 pour la pyramide ! Le cône est une pyramide à base circulaire.

Continue comme ça ! 💪`,
  },
  {
    slug: 'geo-symetrie',
    title: 'Symétrie axiale et centrale',
    category: 'geometrie', level: 'intermediaire',
    triggers: ['symétrie','symetrie','symétrie axiale','symétrie centrale','axe de symétrie','centre de symétrie','symétrique','image par symétrie'],
    answer: `Excellente question ! ✨

📐 **SYMÉTRIE AXIALE ET CENTRALE**

---

**SYMÉTRIE AXIALE** (par rapport à un axe d)

Le symétrique d'un point M par rapport à un axe d est le point M' tel que :
- d est la médiatrice du segment [MM']
- M et M' sont à égale distance de d
- [MM'] est perpendiculaire à d

**Figures ayant un axe de symétrie :**
- Carré → 4 axes
- Rectangle → 2 axes
- Cercle → infinité d'axes
- Triangle équilatéral → 3 axes
- Triangle isocèle → 1 axe

---

**SYMÉTRIE CENTRALE** (par rapport à un point O)

Le symétrique d'un point M par rapport à un centre O est le point M' tel que :
- O est le milieu du segment [MM']
- OM = OM'

**Construction :** M' est tel que O = milieu de [MM']
→ Si M(x ; y) et O(a ; b), alors M'(2a−x ; 2b−y)

---

**Figures ayant un centre de symétrie :**
- Carré, rectangle, losange, parallélogramme
- Cercle
- Toute figure ayant un nombre pair d'axes de symétrie

---

**Propriétés conservées par la symétrie :**
Distances, angles, aires, longueurs → La figure conserve sa forme et ses dimensions.

Continue comme ça ! 💪`,
  },
  {
    slug: 'geo-vecteurs',
    title: 'Les vecteurs',
    category: 'geometrie', level: 'intermediaire',
    triggers: ['vecteur','vecteurs','coordonnées vecteur','norme vecteur','somme vecteurs','produit scalaire','colinéaire','vecteur directeur','vecteur nul','AB vecteur'],
    answer: `Excellente question ! ✨

📐 **LES VECTEURS**

---

**DÉFINITION**
Un vecteur est caractérisé par :
- Une **direction** (la droite qui le porte)
- Un **sens** (→ ou ←)
- Une **norme** (longueur, notée ||u⃗||)

Le vecteur AB⃗ va du point A au point B.

---

**COORDONNÉES D'UN VECTEUR**
Si A(x_A ; y_A) et B(x_B ; y_B) :
> **AB⃗ = (x_B − x_A ; y_B − y_A)**

**Exemple :** A(1 ; 3) et B(4 ; 7)
> AB⃗ = (4−1 ; 7−3) = **(3 ; 4)**

---

**NORME D'UN VECTEUR** u⃗(a ; b) :
> **||u⃗|| = √(a² + b²)**

**Exemple :** u⃗(3 ; 4) → ||u⃗|| = √(9+16) = √25 = **5**

---

**OPÉRATIONS SUR LES VECTEURS**

Addition :
> u⃗(a ; b) + v⃗(c ; d) = (a+c ; b+d)

Multiplication par un scalaire k :
> k × u⃗(a ; b) = (ka ; kb)

---

**VECTEURS COLINÉAIRES**
u⃗(a ; b) et v⃗(c ; d) sont colinéaires si :
> **ad − bc = 0** (déterminant nul)

---

**RELATION DE CHASLES :**
> AB⃗ + BC⃗ = AC⃗

Continue comme ça ! 💪`,
  },
  {
    slug: 'geo-repere-cartesien',
    title: 'Le repère cartésien et les coordonnées',
    category: 'geometrie', level: 'intermediaire',
    triggers: ['repère','coordonnées','abscisse','ordonnée','plan cartésien','repère cartésien','distance entre deux points','milieu segment','équation droite'],
    answer: `Excellente question ! ✨

📐 **LE REPÈRE CARTÉSIEN**

---

**DÉFINITION**
Un repère cartésien est défini par un point O (origine) et deux axes perpendiculaires :
- **Axe des abscisses** (horizontal) → x
- **Axe des ordonnées** (vertical) → y

Un point M a des coordonnées **(x_M ; y_M)**.

---

**DISTANCE ENTRE DEUX POINTS** A(x_A ; y_A) et B(x_B ; y_B) :
> **AB = √[(x_B − x_A)² + (y_B − y_A)²]**

**Exemple :** A(1 ; 2) et B(4 ; 6)
> AB = √[(4−1)² + (6−2)²] = √[9 + 16] = √25 = **5**

---

**MILIEU D'UN SEGMENT** [AB] :
> **M = ((x_A + x_B)/2 ; (y_A + y_B)/2)**

**Exemple :** A(2 ; 4) et B(8 ; 10)
> M = ((2+8)/2 ; (4+10)/2) = **(5 ; 7)**

---

**ÉQUATION D'UNE DROITE :**
> y = ax + b (forme pente-ordonnée à l'origine)
- **a** = pente (coefficient directeur)
- **b** = ordonnée à l'origine (valeur de y quand x = 0)

**Calcul de la pente** entre A(x_A ; y_A) et B(x_B ; y_B) :
> a = (y_B − y_A) / (x_B − x_A)

Continue comme ça ! 💪`,
  },
  {
    slug: 'geo-transformations',
    title: 'Translations, rotations et homothéties',
    category: 'geometrie', level: 'avance',
    triggers: ['translation','rotation','homothétie','homothetie','transformation géométrique','image par translation','centre de rotation','rapport homothétie'],
    answer: `Excellente question ! ✨

📐 **TRANSFORMATIONS GÉOMÉTRIQUES**

---

**LA TRANSLATION** de vecteur u⃗(a ; b)
Chaque point M(x ; y) → M'(x+a ; y+b)

**Propriétés :** conserve les distances, les angles, les longueurs, les aires. Les figures sont identiques, juste déplacées.

---

**LA ROTATION** de centre O, angle θ
Le point M est transformé en M' :
- OM = OM' (même distance au centre)
- Angle MOâ€M' = θ

En coordonnées (rotation autour de l'origine) :
> x' = x cos(θ) − y sin(θ)
> y' = x sin(θ) + y cos(θ)

**Cas particulier :** Rotation de 90° → (x ; y) → (−y ; x)

---

**L'HOMOTHÉTIE** de centre O, rapport k
> OM' = k × OM

- Si k > 1 : agrandissement
- Si 0 < k < 1 : réduction
- Si k < 0 : agrandissement + retournement

**Exemple :** k = 2 → toutes les distances doublent, les aires quadruplent (× k²)

---

**PROPRIÉTÉS CONSERVÉES**

| Transformation | Distances | Angles | Orientation |
|---|---|---|---|
| Translation | ✅ | ✅ | ✅ |
| Rotation | ✅ | ✅ | ✅ |
| Symétrie axiale | ✅ | ✅ | ❌ (retournée) |
| Homothétie | ❌ (× k) | ✅ | Selon signe k |

Continue comme ça ! 💪`,
  },
  {
    slug: 'geo-droites-paralleles',
    title: 'Droites parallèles et perpendiculaires',
    category: 'geometrie', level: 'debutant',
    triggers: ['droites parallèles','droites perpendiculaires','parallel','perpendiculaire','equerre','droites qui se croisent','droites sécantes','angle entre droites'],
    answer: `Excellente question ! ✨

📐 **DROITES PARALLÈLES ET PERPENDICULAIRES**

---

**DROITES PARALLÈLES**
Deux droites sont parallèles si elles ne se coupent jamais (même direction).

- Notation : d₁ ∥ d₂
- Dans un repère, deux droites y = ax + b et y = a'x + b' sont parallèles si **a = a'** (même pente)
- **Droites confondues** si de plus b = b' (même droite)

---

**DROITES PERPENDICULAIRES**
Deux droites sont perpendiculaires si elles se coupent à angle droit (90°).

- Notation : d₁ ⊥ d₂
- Dans un repère, droites de pentes a et a' : perpendiculaires si **a × a' = −1** (pentes inverses et opposées)

**Exemple :** Pentes 2 et −1/2 → 2 × (−1/2) = −1 ✅ Perpendiculaires !

---

**PROPRIÉTÉS UTILES**
- Si d₁ ∥ d₂ et d₃ ⊥ d₁, alors d₃ ⊥ d₂
- Toute droite perpendiculaire à l'axe x est verticale (pente infinie)
- La médiatrice d'un segment est perpendiculaire à ce segment et passe par son milieu

---

**CONSTRUCTION AU COMPAS ET À L'ÉQUERRE :**
- Droite parallèle : utiliser l'équerre en la glissant le long d'une règle
- Droite perpendiculaire : placer l'angle droit de l'équerre sur la droite

Continue comme ça ! 💪`,
  },
  {
    slug: 'geo-statistiques-base',
    title: 'Statistiques descriptives',
    category: 'statistiques', level: 'intermediaire',
    triggers: ['moyenne','médiane','mode','écart-type','variance','statistiques','quartiles','étendue','données statistiques','effectif','fréquence'],
    answer: `Excellente question ! ✨

📊 **STATISTIQUES DESCRIPTIVES**

---

**INDICATEURS DE POSITION**

**Moyenne (x̄) :** somme des valeurs / nombre de valeurs
> x̄ = (x₁ + x₂ + ... + xₙ) / n

**Exemple :** Notes : 8, 12, 15, 10, 15
> x̄ = (8+12+15+10+15) / 5 = 60/5 = **12**

**Médiane :** valeur centrale quand les données sont triées (50% en dessous, 50% au-dessus)
- Données triées : 8, 10, **12**, 15, 15 → Médiane = **12**
- Si n pair → moyenne des 2 valeurs centrales

**Mode :** valeur la plus fréquente → **15** (apparaît 2 fois)

**Étendue = max − min = 15 − 8 = 7**

---

**QUARTILES**
- Q1 = 1er quartile (25% des données en dessous)
- Q2 = médiane (50%)
- Q3 = 3ème quartile (75% des données en dessous)
- **Écart interquartile = Q3 − Q1** (mesure de dispersion robuste)

---

**INDICATEURS DE DISPERSION**

**Variance (σ²) :**
> σ² = (1/n) × Σ(xᵢ − x̄)²

**Écart-type (σ) = √variance**

**Exemple :** Notes 8, 12, 15, 10, 15 ; x̄ = 12
> σ² = [(8−12)² + (12−12)² + (15−12)² + (10−12)² + (15−12)²] / 5
> σ² = [16 + 0 + 9 + 4 + 9] / 5 = 38/5 = **7,6**
> σ = √7,6 ≈ **2,76**

Continue comme ça ! 💪`,
  },
  {
    slug: 'geo-probabilites-base',
    title: 'Probabilités — bases',
    category: 'probabilites', level: 'intermediaire',
    triggers: ['probabilité','probabilités','probabilite','chance','événement','lancer dé','tirage','pile ou face','espace probabilisé','fréquence relative','loi des grands nombres'],
    answer: `Excellente question ! ✨

🎲 **PROBABILITÉS — BASES**

---

**DÉFINITIONS**

- **Expérience aléatoire :** résultat imprévisible (lancer un dé, tirer une carte...)
- **Univers (Ω) :** ensemble de tous les résultats possibles
- **Événement :** sous-ensemble de Ω
- **Probabilité P(A) :** nombre entre 0 et 1

> **P(A) = Nombre de cas favorables / Nombre de cas possibles** (si équiprobabilité)

---

**EXEMPLE : Lancer un dé à 6 faces**
- Ω = {1, 2, 3, 4, 5, 6}
- P(obtenir 4) = 1/6 ≈ **0,167** (16,7%)
- P(obtenir pair) = 3/6 = **1/2** (50%)
- P(obtenir > 4) = 2/6 = **1/3** ≈ 33,3%

---

**PROPRIÉTÉS FONDAMENTALES**
- 0 ≤ P(A) ≤ 1
- P(Ω) = 1 (un résultat se produit toujours)
- P(∅) = 0 (événement impossible)
- **Complémentaire :** P(Ā) = 1 − P(A)

**Exemple :** P(ne pas obtenir 6) = 1 − 1/6 = **5/6**

---

**ÉVÉNEMENTS MUTUELLEMENT EXCLUSIFS** (incompatibles) :
> P(A ou B) = P(A) + P(B)

**ÉVÉNEMENTS INDÉPENDANTS** :
> P(A et B) = P(A) × P(B)

**Exemple :** P(pile ET croix en 2 lancers) = 1/2 × 1/2 = **1/4**

Continue comme ça ! 💪`,
  },
  {
    slug: 'geo-mesures-unites',
    title: 'Unités de mesure et conversions',
    category: 'mathematiques', level: 'debutant',
    triggers: ['unités','conversion','convertir','mesures','kilometre','centimetre','millimetre','kg','gramme','litre','centilitre','m2 cm2','cm3 dm3'],
    answer: `Excellente question ! ✨

📏 **UNITÉS DE MESURE ET CONVERSIONS**

---

**LONGUEURS**
km → hm → dam → **m** → dm → cm → mm
(× 10 en descendant, ÷ 10 en montant)

| De → Vers | Multiplier par |
|---|---|
| km → m | × 1 000 |
| m → cm | × 100 |
| cm → mm | × 10 |
| m → mm | × 1 000 |

**Exemple :** 2,5 km = 2 500 m = 250 000 cm

---

**MASSES**
t → kg → hg → dag → **g** → dg → cg → mg

**Exemple :** 1 kg = 1 000 g | 2,5 kg = 2 500 g | 500 g = 0,5 kg

---

**VOLUMES / CAPACITÉS**
kL → hL → daL → **L** → dL → cL → mL

- 1 L = 1 dm³ = 1 000 cm³ = 1 000 mL
- 1 m³ = 1 000 L
- 1 cL = 10 mL

---

**AIRES** (surfaces)
- 1 m² = 100 dm² = 10 000 cm²
- 1 km² = 1 000 000 m² = 100 hectares
- 1 hectare (ha) = 10 000 m²

---

**TEMPS**
- 1 min = 60 s
- 1 h = 60 min = 3 600 s
- 1 jour = 24 h = 1 440 min
- 1 an = 365 jours (366 les années bissextiles)

**Astuce :** Toujours partir de l'unité de référence (m, g, L) et compter le nombre de cases.

Continue comme ça ! 💪`,
  },
  {
    slug: 'geo-droite-equation',
    title: 'Équation d\'une droite dans le plan',
    category: 'geometrie', level: 'avance',
    triggers: ['équation droite','equation de la droite','pente droite','coefficient directeur','ordonnée à l origine','y=ax+b','forme cartesienne droite','droite passant par','point et pente'],
    answer: `Excellente question ! ✨

📐 **ÉQUATION D'UNE DROITE DANS LE PLAN**

---

**FORME GÉNÉRALE**
> y = ax + b

- **a** = coefficient directeur (pente)
- **b** = ordonnée à l'origine (où la droite coupe l'axe y)

---

**CALCUL DU COEFFICIENT DIRECTEUR**
Avec deux points A(x_A ; y_A) et B(x_B ; y_B) :
> **a = (y_B − y_A) / (x_B − x_A)**

**Interprétation :** Quand x augmente de 1, y augmente de a.
- a > 0 : droite croissante
- a < 0 : droite décroissante
- a = 0 : droite horizontale

---

**TROUVER L'ÉQUATION D'UNE DROITE**

**Méthode :** On connaît un point A(x_A ; y_A) et la pente a.
> b = y_A − a × x_A

**Exemple :** Pente a = 2, passe par A(3 ; 7)
> b = 7 − 2×3 = 7 − 6 = 1
> Équation : **y = 2x + 1**

---

**EXEMPLE COMPLET**
Droite passant par A(1 ; 3) et B(4 ; 9) :
1. a = (9−3)/(4−1) = 6/3 = **2**
2. b = 3 − 2×1 = **1**
3. Équation : **y = 2x + 1**

---

**FORMES PARTICULIÈRES**
- Droite verticale : x = k (pente infinie)
- Droite horizontale : y = k (pente = 0)
- Forme ax + by + c = 0 (forme cartésienne)

Continue comme ça ! 💪`,
  },
];
