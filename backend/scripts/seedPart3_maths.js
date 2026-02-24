// PARTIE 3 — MATHÉMATIQUES : du CP à la Terminale (50 leçons)
export const LECONS_MATHS = [
  // ── ARITHMÉTIQUE DE BASE (CP → CM2) ────────────────────────────────────────
  {
    slug: 'math-addition',
    title: "L'addition",
    category: 'mathematiques', level: 'debutant',
    triggers: ['addition','additionner','plus','somme','calcul addition','ajouter','a plus b','la somme de'],
    answer: `Excellente question ! ✨

🧮 **L'ADDITION**

L'addition consiste à **réunir** plusieurs quantités pour obtenir leur **somme**.

**Symbole :** + (plus)

**Vocabulaire :**
- Les **termes** (ou **addends**) : les nombres qu'on additionne
- La **somme** : le résultat

**Exemples :** 5 + 3 = 8 | 12 + 7 = 19 | 100 + 250 = 350

**Propriétés fondamentales :**
- **Commutativité :** a + b = b + a → 5 + 3 = 3 + 5 = 8
- **Associativité :** (a + b) + c = a + (b + c) → (2 + 3) + 4 = 2 + (3 + 4) = 9
- **Élément neutre :** a + 0 = a → 7 + 0 = 7

**Technique posée (pour grands nombres) :**
On aligne les unités, on additionne colonne par colonne en reportant les retenues.
   247
 + 138
 ─────
   385  (7+8=15, on pose 5 et retient 1; 4+3+1=8; 2+1=3)

**Application :** J'ai 35 billes, j'en gagne 17. J'en ai 35 + 17 = **52** billes.

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-soustraction',
    title: 'La soustraction',
    category: 'mathematiques', level: 'debutant',
    triggers: ['soustraction','soustraire','moins','différence','retirer','enlever','a moins b','calcul soustraction'],
    answer: `Excellente question ! ✨

🧮 **LA SOUSTRACTION**

La soustraction consiste à **retirer** une quantité d'une autre. Le résultat s'appelle la **différence**.

**Symbole :** − (moins)

**Vocabulaire :**
- **Minuende** : le nombre de départ
- **Soustrahende** : ce qu'on enlève
- **Différence** : le résultat

**Exemple :** 15 − 6 = 9
- Vérification : 6 + 9 = 15 ✅ (la soustraction est l'opération inverse de l'addition)

**Propriétés :**
- **Non commutative :** 10 − 3 ≠ 3 − 10
- 10 − 3 = 7 mais 3 − 10 = −7 (nombre négatif)
- a − 0 = a | a − a = 0

**Technique posée :**
   534
 − 278
 ─────
   256  (4<8 → on emprunte : 14−8=6 ; 2<7 → on emprunte : 12−7=5 ; 4−2=2)

**Application :** J'avais 50 € et j'ai dépensé 23 €. Il me reste 50 − 23 = **27 €**.

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-multiplication',
    title: 'La multiplication',
    category: 'mathematiques', level: 'debutant',
    triggers: ['multiplication','multiplier','fois','produit','table de multiplication','tables','facteur','a fois b','calcul multiplication'],
    answer: `Excellente question ! ✨

🧮 **LA MULTIPLICATION**

La multiplication est une **addition répétée**. Le résultat s'appelle le **produit**.

**Symboles :** × ou * (fois)

**Vocabulaire :**
- **Facteurs** : les nombres multipliés entre eux
- **Produit** : le résultat

**Exemples :** 4 × 3 = 12 | 7 × 8 = 56 | 25 × 4 = 100

**Propriétés fondamentales :**
- **Commutativité :** a × b = b × a → 4 × 3 = 3 × 4 = 12
- **Associativité :** (a × b) × c = a × (b × c)
- **Distributivité :** a × (b + c) = a × b + a × c → 3 × (4 + 2) = 3×4 + 3×2 = 18
- **Élément neutre :** a × 1 = a | **Élément absorbant :** a × 0 = 0

**Tables indispensables à connaître (1 à 10) :**
Table de 2 : 2,4,6,8,10,12,14,16,18,20
Table de 5 : 5,10,15,20,25,30,35,40,45,50
Table de 9 : 9,18,27,36,45,54,63,72,81,90

**Application :** 6 boîtes de 12 œufs → 6 × 12 = **72 œufs**.

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-division',
    title: 'La division',
    category: 'mathematiques', level: 'debutant',
    triggers: ['division','diviser','partager','quotient','reste','diviseur','dividende','divise par','division euclidienne'],
    answer: `Excellente question ! ✨

🧮 **LA DIVISION**

La division sert à **partager en parts égales** ou à trouver combien de fois un nombre est contenu dans un autre.

**Symboles :** ÷ ou /

**Vocabulaire :**
- **Dividende** : le nombre qu'on divise
- **Diviseur** : le nombre par lequel on divise
- **Quotient** : le résultat
- **Reste** : ce qui reste (si la division n'est pas exacte)

**Division euclidienne :** dividende = diviseur × quotient + reste

**Exemple :** 17 ÷ 5 = 3 reste 2
→ Vérification : 5 × 3 + 2 = 17 ✅

**Division exacte :** 20 ÷ 4 = 5 (reste = 0)

**Règles importantes :**
- Division par 0 : **impossible** (non définie)
- a ÷ 1 = a | 0 ÷ a = 0 (si a ≠ 0)
- La division n'est pas commutative : 12 ÷ 4 ≠ 4 ÷ 12

**Lien avec la multiplication :** si a × b = c, alors c ÷ b = a et c ÷ a = b.
Ex : 4 × 5 = 20 → 20 ÷ 5 = 4 et 20 ÷ 4 = 5

**Application :** 24 élèves répartis en 4 groupes → 24 ÷ 4 = **6 élèves** par groupe.

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-priorites',
    title: "Priorité des opérations",
    category: 'mathematiques', level: 'debutant',
    triggers: ['priorité','priorités','ordre opérations','parenthèses','ordre de calcul','puissance priorité','règle priorité','calcul avec plusieurs opérations'],
    answer: `Excellente question ! ✨

🧮 **PRIORITÉ DES OPÉRATIONS**

Quand une expression contient plusieurs opérations, on suit un **ordre strict**.

**La règle — du plus prioritaire au moins prioritaire :**
1. 🥇 **Parenthèses** : ( ) — on calcule d'abord tout ce qui est entre parenthèses
2. 🥈 **Puissances** : 2³, 5² — on calcule ensuite les exposants
3. 🥉 **× et ÷** — de gauche à droite
4. 🏅 **+ et −** — de gauche à droite

**Exemples détaillés :**

**Ex. 1 :** 2 + 3 × 4
→ Priorité à × : 2 + **12** = **14** (et non 5 × 4 = 20 ❌)

**Ex. 2 :** (2 + 3) × 4
→ Parenthèses d'abord : **5** × 4 = **20**

**Ex. 3 :** 3 × 2² + 5 ÷ (1 + 4)
→ Parenthèses : 3 × 2² + 5 ÷ **5**
→ Puissances : 3 × **4** + 5 ÷ 5
→ × et ÷ : **12** + **1**
→ + : **13**

**Astuce mémo :** **P**riorités → **E**xposants → **M**ultiplication/**D**ivision → **A**ddition/**S**oustraction = **PEMDAS** (ou **PEDMAS**)

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-fractions',
    title: 'Les fractions',
    category: 'mathematiques', level: 'debutant',
    triggers: ['fraction','fractions','numérateur','dénominateur','demi','tiers','quart','fraction irréductible','1/2','3/4','numérateur dénominateur'],
    answer: `Excellente question ! ✨

🧮 **LES FRACTIONS**

Une fraction représente une **partie d'un tout**.

**Écriture :** a/b (ou a sur b) — a est le **numérateur**, b est le **dénominateur** (b ≠ 0)

**Lecture :** 1/2 = un demi | 2/3 = deux tiers | 3/4 = trois quarts | 5/6 = cinq sixièmes

**Fraction décimale :** quand le dénominateur est 10, 100, 1000…
- 3/10 = 0,3 | 7/100 = 0,07 | 125/1000 = 0,125

**Fraction irréductible :** quand le numérateur et le dénominateur n'ont pas de diviseur commun autre que 1.
- 4/6 → on divise par 2 → **2/3** (irréductible)
- Pour simplifier : diviser en haut et en bas par le PGCD.

**Fractions équivalentes :** représentent la même quantité.
- 1/2 = 2/4 = 3/6 = 4/8 → on multiplie ou divise en haut et en bas par le même nombre.

**Comparer deux fractions (même dénominateur) :**
- 3/7 < 5/7 (même dénominateur → on compare les numérateurs)
- Dénominateurs différents → on les réduit au même dénominateur.

**Fraction > 1 :** ex. 7/4 = 1 + 3/4 = 1 et 3/4 (nombre mixte)

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-fractions-operations',
    title: 'Opérations sur les fractions',
    category: 'mathematiques', level: 'intermediaire',
    triggers: ['addition fractions','soustraction fractions','multiplication fractions','division fractions','opérations fractions','calcul fractions','additionner fractions','multiplier fractions','diviser fractions'],
    answer: `Excellente question ! ✨

🧮 **OPÉRATIONS SUR LES FRACTIONS**

**1. ADDITION / SOUSTRACTION**
Règle : même dénominateur → on additionne/soustrait les numérateurs.

Même dénominateur :
3/7 + 2/7 = (3+2)/7 = **5/7**
5/8 − 3/8 = (5−3)/8 = **2/8 = 1/4**

Dénominateurs différents → on réduit au même dénominateur (PPCM) :
1/3 + 1/4 → PPCM(3,4) = 12
= 4/12 + 3/12 = **7/12**

**2. MULTIPLICATION**
Règle : on multiplie numérateur × numérateur et dénominateur × dénominateur.

2/3 × 4/5 = (2×4)/(3×5) = **8/15**
3/4 × 8/9 = 24/36 → simplifier : **2/3** (diviser par 12)

**Astuce :** Simplifier avant de multiplier.
3/4 × 8/9 = (3×8)/(4×9) → 3 et 9 se simplifient (÷3), 8 et 4 se simplifient (÷4) → (1×2)/(1×3) = **2/3**

**3. DIVISION**
Règle : diviser par une fraction = multiplier par son inverse.

2/3 ÷ 4/5 = 2/3 × 5/4 = **10/12 = 5/6**
3/7 ÷ 9/14 = 3/7 × 14/9 = 42/63 = **2/3**

**Résumé :** + et − → même dénominateur | × → numérateur × numérateur | ÷ → inverser et multiplier.

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-decimaux',
    title: 'Les nombres décimaux',
    category: 'mathematiques', level: 'debutant',
    triggers: ['décimal','décimaux','virgule','nombre à virgule','partie décimale','partie entière','dixième','centième','millième','0,5','3,14'],
    answer: `Excellente question ! ✨

🧮 **LES NOMBRES DÉCIMAUX**

Un nombre décimal a une **partie entière** et une **partie décimale**, séparées par une **virgule** (en français).

**Structure :** 47,358
- 47 = partie entière
- 3 = dixièmes (3/10)
- 5 = centièmes (5/100)
- 8 = millièmes (8/1000)

**Lire un décimal :** 3,14 = "trois virgule quatorze"

**Opérations avec les décimaux :**

**Addition / Soustraction → aligner les virgules :**
  12,45
+  3,7
──────
  16,15  (on aligne 3,7 avec 3,70)

**Multiplication :**
2,3 × 1,4 → on ignore les virgules : 23 × 14 = 322
Nombre de décimales total : 1 + 1 = 2 → résultat : **3,22**

**Division → déplacer la virgule du diviseur pour le rendre entier :**
12,6 ÷ 0,3 → multiplier les deux par 10 → 126 ÷ 3 = **42**

**Conversion fraction ↔ décimal :**
1/4 = 0,25 | 3/5 = 0,6 | 1/3 = 0,333... (infini périodique)

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-pourcentages',
    title: 'Les pourcentages',
    category: 'mathematiques', level: 'intermediaire',
    triggers: ['pourcentage','pourcentages','%','taux','réduction','augmentation','soldes','calculer pourcentage','50%','taux de réussite','proportion'],
    answer: `Excellente question ! ✨

🧮 **LES POURCENTAGES**

Un pourcentage exprime une **proportion sur 100**. Le symbole est **%**.

**Définition :** p% = p/100

**Calculer p% d'une quantité :**
- p% de N = (p × N) / 100 = N × p/100

**Exemples :**
- 20% de 150 = 150 × 20/100 = 150 × 0,20 = **30**
- 15% de 80 = 80 × 0,15 = **12**
- TVA 20% sur 50 € = 50 × 0,20 = 10 € → prix TTC = **60 €**

**Augmentation de p% :** multiplier par (1 + p/100)
- Prix de 200 € augmenté de 10% → 200 × 1,10 = **220 €**

**Réduction de p% :** multiplier par (1 − p/100)
- Article 80 € avec −25% → 80 × 0,75 = **60 €**

**Calculer le taux (trouver p%) :**
p% = (partie / total) × 100
- 15 élèves réussis sur 60 → 15/60 × 100 = **25%**

**Augmentations / réductions successives :**
+20% puis −20% ≠ 0% → 100 × 1,20 × 0,80 = **96** (perte de 4%)

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-proportionnalite',
    title: 'La proportionnalité',
    category: 'mathematiques', level: 'intermediaire',
    triggers: ['proportionnalité','proportionnel','tableau de proportionnalité','règle de trois','produit en croix','4e proportionnelle','grandeurs proportionnelles','échelle'],
    answer: `Excellente question ! ✨

🧮 **LA PROPORTIONNALITÉ**

Deux grandeurs sont **proportionnelles** si leur quotient est constant (= le coefficient de proportionnalité k).

**Tableau de proportionnalité :**
| x | 2 | 5 | 8 |
|---|---|---|---|
| y | 6 | 15 | 24 |
k = y/x = 6/2 = 15/5 = 24/8 = **3**

**Règle de trois (produit en croix) :**
Si a/b = c/d, alors **a × d = b × c**

**Exemple :** Si 3 kg de pommes coûtent 4,50 €, combien coûtent 5 kg ?
3/4,50 = 5/x → x = (5 × 4,50)/3 = **7,50 €**

**Autre exemple :** Une voiture parcourt 360 km en 4 h. Quelle distance en 7 h ?
360/4 = x/7 → x = 360 × 7/4 = **630 km**

**Échelle (carte/plan) :**
Échelle 1/25 000 → 1 cm sur la carte = 25 000 cm = 250 m en réalité.
Distance réelle = distance carte × dénominateur de l'échelle.

**Vitesse, distance, temps (V = d/t) :**
- d = V × t | t = d/V

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-pgcd-ppcm',
    title: 'PGCD et PPCM',
    category: 'mathematiques', level: 'intermediaire',
    triggers: ['PGCD','PPCM','plus grand diviseur commun','plus petit multiple commun','diviseur commun','algorithme euclide','simplifier fraction','PGCD PPCM'],
    answer: `Excellente question ! ✨

🧮 **PGCD ET PPCM**

**PGCD = Plus Grand Commun Diviseur**
C'est le plus grand entier qui divise à la fois a et b.

**Méthode 1 : Décomposition en facteurs premiers**
PGCD(60, 36) :
60 = 2² × 3 × 5
36 = 2² × 3²
PGCD = 2² × 3 = **12**

**Méthode 2 : Algorithme d'Euclide (plus rapide)**
PGCD(60, 36) :
60 = 1 × 36 + 24
36 = 1 × 24 + 12
24 = 2 × 12 + 0 → **PGCD = 12**

**Usage :** simplifier les fractions → diviser numérateur et dénominateur par le PGCD.
60/36 ÷ 12 = **5/3**

---

**PPCM = Plus Petit Commun Multiple**
C'est le plus petit entier qui est multiple à la fois de a et de b.

**Formule :** PPCM(a,b) = (a × b) / PGCD(a,b)
PPCM(60, 36) = (60 × 36) / 12 = 2160/12 = **180**

**Usage :** réduire des fractions au même dénominateur.
1/12 + 1/18 → PPCM(12,18) = 36
= 3/36 + 2/36 = **5/36**

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-puissances',
    title: 'Les puissances',
    category: 'mathematiques', level: 'intermediaire',
    triggers: ['puissance','puissances','exposant','carré','cube','2 au carré','10 puissance','a exposant n','puissance de 10','puissance entière','puissance négative'],
    answer: `Excellente question ! ✨

🧮 **LES PUISSANCES**

**Définition :** aⁿ = a × a × a × … × a (n fois) — a est la **base**, n est l'**exposant**.

**Exemples :**
- 2³ = 2 × 2 × 2 = **8**
- 5² = 5 × 5 = **25** ("5 au carré")
- 10⁴ = 10 × 10 × 10 × 10 = **10 000**

**Cas particuliers :**
- a⁰ = **1** (pour tout a ≠ 0)
- a¹ = **a**
- a⁻ⁿ = **1/aⁿ** (puissance négative)
  Ex : 2⁻³ = 1/2³ = 1/8

**Règles de calcul :**
- aᵐ × aⁿ = **aᵐ⁺ⁿ** → 2³ × 2⁴ = 2⁷ = 128
- aᵐ ÷ aⁿ = **aᵐ⁻ⁿ** → 3⁵ ÷ 3² = 3³ = 27
- (aᵐ)ⁿ = **aᵐˣⁿ** → (2³)² = 2⁶ = 64
- (a × b)ⁿ = **aⁿ × bⁿ** → (2 × 3)² = 4 × 9 = 36

**Puissances de 10 :**
10¹=10 | 10²=100 | 10³=1000 | 10⁶=1 000 000 | 10⁻¹=0,1 | 10⁻²=0,01

**Notation scientifique :** a × 10ⁿ avec 1 ≤ a < 10
Ex : 3 400 000 = **3,4 × 10⁶** | 0,00045 = **4,5 × 10⁻⁴**

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-racines-carrees',
    title: 'Les racines carrées',
    category: 'mathematiques', level: 'intermediaire',
    triggers: ['racine carrée','racine','√','sqrt','radical','racine de 2','racine de 9','simplifier racine','propriétés racine','racine cubique'],
    answer: `Excellente question ! ✨

🧮 **LES RACINES CARRÉES**

**Définition :** √a est le nombre positif dont le carré est a.
√a = b  ⟺  b² = a et b ≥ 0

**Exemples :**
- √9 = 3 (car 3² = 9)
- √25 = 5 | √100 = 10 | √144 = 12 | √0 = 0

**Racines carrées à connaître :**
√1=1 | √4=2 | √9=3 | √16=4 | √25=5 | √36=6 | √49=7 | √64=8 | √81=9 | √100=10

**Propriétés :**
- √(a × b) = √a × √b → √12 = √4 × √3 = 2√3
- √(a/b) = √a / √b
- (√a)² = a (pour a ≥ 0)
- √a n'est pas définie si a < 0 (dans ℝ)

**Simplifier une racine :**
√72 = √(36 × 2) = √36 × √2 = **6√2**
√48 = √(16 × 3) = **4√3**

**Calculer une valeur approchée :**
√2 ≈ 1,414 | √3 ≈ 1,732 | √5 ≈ 2,236 | √7 ≈ 2,646

**Lien avec les puissances :** √a = a^(1/2)

Continue comme ça ! 💪`,
  },
  // ── ALGÈBRE (Collège → Lycée) ───────────────────────────────────────────────
  {
    slug: 'math-identites-remarquables',
    title: 'Les identités remarquables',
    category: 'mathematiques', level: 'intermediaire',
    triggers: ['identités remarquables','identité remarquable','carré d\'une somme','carré d\'une différence','produit somme différence','(a+b)²','(a-b)²','(a+b)(a-b)','développer identité'],
    answer: `Excellente question ! ✨

🧮 **LES IDENTITÉS REMARQUABLES**

Ces formules permettent de **développer** ou **factoriser** rapidement des expressions.

**Les 3 identités fondamentales :**

**🔵 Carré d'une somme :**
(a + b)² = a² + 2ab + b²

Exemple : (x + 3)² = x² + 6x + 9
Exemple : (2 + 5)² = 4 + 20 + 25 = 49 = 7² ✅

**🔴 Carré d'une différence :**
(a − b)² = a² − 2ab + b²

Exemple : (x − 4)² = x² − 8x + 16
Exemple : (10 − 1)² = 100 − 20 + 1 = 81 = 9² ✅

**🟢 Produit de la somme et la différence :**
(a + b)(a − b) = a² − b²

Exemple : (x + 5)(x − 5) = x² − 25
Exemple : 19 × 21 = (20+1)(20−1) = 400 − 1 = **399** (astuce de calcul mental !)

**Utilisation en factorisation (lecture inverse) :**
x² + 6x + 9 = (x + 3)²
x² − 10x + 25 = (x − 5)²
x² − 16 = (x + 4)(x − 4)

**Astuce :** Reconnaître la forme a² ± 2ab + b² pour factoriser en (a ± b)².

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-factorisation',
    title: 'La factorisation',
    category: 'mathematiques', level: 'intermediaire',
    triggers: ['factoriser','factorisation','factor commun','mettre en facteur','facteur commun','développer factoriser','ax + bx','ab + ac'],
    answer: `Excellente question ! ✨

🧮 **LA FACTORISATION**

Factoriser une expression, c'est la transformer en un **produit de facteurs**.
C'est l'opération inverse du développement.

**Méthode 1 : Facteur commun**
ax + ay = **a(x + y)**

Exemples :
- 6x + 10 = **2(3x + 5)**
- 3x² − 9x = **3x(x − 3)**
- 15a²b + 25ab² = **5ab(3a + 5b)**

**Méthode 2 : Identités remarquables**
- x² + 6x + 9 = **(x + 3)²** (carré d'une somme)
- 4x² − 12x + 9 = **(2x − 3)²** (carré d'une différence)
- x² − 25 = **(x + 5)(x − 5)** (produit somme × différence)

**Méthode 3 : Factorisation d'un trinôme du 2nd degré**
ax² + bx + c → trouver les racines x₁ et x₂ puis écrire :
a(x − x₁)(x − x₂)

Exemple : x² − 5x + 6
Racines : x₁ = 2, x₂ = 3 (car 2+3=5 et 2×3=6)
→ **(x − 2)(x − 3)**

**Pourquoi factoriser ?**
- Simplifier des fractions : (x²−4)/(x−2) = (x+2)(x−2)/(x−2) = x+2
- Résoudre des équations produit = 0

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-equations-1er-degre',
    title: 'Équations du 1er degré',
    category: 'mathematiques', level: 'intermediaire',
    triggers: ['équation','équation 1er degré','équation premier degré','résoudre équation','trouver x','inconnue','équation linéaire','résolution','ax+b=c','2x+3=7'],
    answer: `Excellente question ! ✨

🧮 **ÉQUATIONS DU 1ER DEGRÉ**

Une équation du 1er degré est de la forme **ax + b = c** (x est l'inconnue).
Résoudre = trouver la valeur de x qui vérifie l'équation.

**Principe :** On effectue les mêmes opérations des deux côtés pour isoler x.

**Exemple 1 :** 3x + 5 = 20
→ 3x = 20 − 5 = 15
→ x = 15/3 = **x = 5**
Vérification : 3(5) + 5 = 15 + 5 = 20 ✅

**Exemple 2 :** 2x − 7 = 4x + 3
→ 2x − 4x = 3 + 7 (on regroupe les x d'un côté, les nombres de l'autre)
→ −2x = 10
→ x = 10/(−2) = **x = −5**

**Exemple 3 :** (x + 3)/2 = 5
→ x + 3 = 10 (on multiplie par 2)
→ x = **7**

**Types de solutions :**
- **Une solution unique :** cas général, x = valeur
- **Aucune solution :** ex. 2x + 1 = 2x + 5 → 1 = 5 (impossible)
- **Infinité de solutions :** ex. 3x + 6 = 3(x + 2) → 0 = 0 (toujours vrai)

**Toujours vérifier** en remplaçant x par la solution trouvée.

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-inequations',
    title: 'Les inéquations',
    category: 'mathematiques', level: 'intermediaire',
    triggers: ['inéquation','inéquations','inégalité','résoudre inéquation','ax+b > c','strictement supérieur','inférieur ou égal','ensemble solution','intervalle solution'],
    answer: `Excellente question ! ✨

🧮 **LES INÉQUATIONS**

Une inéquation est une **inégalité avec une inconnue**. La solution est un ensemble de valeurs (un intervalle).

**Symboles :** < (strictement inférieur) | > (strictement supérieur) | ≤ (inférieur ou égal) | ≥ (supérieur ou égal)

**Résolution — mêmes principes que les équations SAUF :**
⚠️ **Si on multiplie ou divise par un nombre négatif, le sens de l'inégalité s'inverse !**

**Exemple 1 :** 2x + 3 < 11
→ 2x < 11 − 3 = 8
→ x < 8/2
→ **x < 4** → Solution : ]−∞ ; 4[

**Exemple 2 :** −3x + 6 ≥ 0
→ −3x ≥ −6
→ x ≤ 2 (on divise par −3, le sens s'inverse !)
→ **x ≤ 2** → Solution : ]−∞ ; 2]

**Exemple 3 :** −1 ≤ 2x + 1 < 5 (double inéquation)
→ −1 − 1 ≤ 2x < 5 − 1
→ −2 ≤ 2x < 4
→ **−1 ≤ x < 2** → Solution : [−1 ; 2[

**Notation des intervalles :**
- ] a ; b [ = a < x < b (bornes exclues)
- [ a ; b ] = a ≤ x ≤ b (bornes incluses)
- ]−∞ ; a[ = x < a

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-systemes-equations',
    title: "Systèmes d'équations",
    category: 'mathematiques', level: 'intermediaire',
    triggers: ['système','systèmes d\'équations','système 2 équations','substitution','combinaison','deux inconnues','x et y','résoudre système'],
    answer: `Excellente question ! ✨

🧮 **SYSTÈMES D'ÉQUATIONS**

Un système de 2 équations à 2 inconnues cherche les valeurs de x et y qui vérifient les 2 équations simultanément.

**Méthode 1 : SUBSTITUTION**
(2x + y = 7   [1]
(x − y = 2    [2]

De [2] : x = y + 2 → on substitue dans [1] :
2(y + 2) + y = 7 → 2y + 4 + y = 7 → 3y = 3 → **y = 1**
x = 1 + 2 = **x = 3**
Solution : **(3 ; 1)**

**Méthode 2 : COMBINAISON (addition/soustraction)**
(2x + 3y = 12  [1]
(4x − 3y = 6   [2]

On additionne [1] + [2] : 6x = 18 → **x = 3**
Dans [1] : 6 + 3y = 12 → 3y = 6 → **y = 2**
Solution : **(3 ; 2)**

**Vérification :** remplacer dans les 2 équations.

**Types de systèmes :**
- **1 solution unique :** droites sécantes (cas général)
- **Aucune solution :** droites parallèles (ex. 2x+y=5 et 2x+y=7)
- **Infinité de solutions :** mêmes droites (équations proportionnelles)

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-equations-2nd-degre',
    title: 'Équations du 2nd degré',
    category: 'mathematiques', level: 'avance',
    triggers: ['équation 2nd degré','équation du second degré','équation quadratique','ax²+bx+c=0','discriminant','racines équation','résoudre second degré','x carré'],
    answer: `Excellente question ! ✨

🧮 **ÉQUATIONS DU 2ND DEGRÉ**

Une équation du 2nd degré est de la forme **ax² + bx + c = 0** (a ≠ 0).

**Méthode : Calculer le discriminant Δ (delta)**

**Δ = b² − 4ac**

**Cas 1 : Δ > 0** → deux solutions réelles distinctes :
x₁ = (−b + √Δ) / (2a)   et   x₂ = (−b − √Δ) / (2a)

**Cas 2 : Δ = 0** → une solution double :
x₁ = x₂ = −b / (2a)

**Cas 3 : Δ < 0** → pas de solution réelle (dans ℝ)

**Exemple complet :** x² − 5x + 6 = 0 (a=1, b=−5, c=6)
Δ = (−5)² − 4×1×6 = 25 − 24 = **1 > 0** → 2 solutions
x₁ = (5 + 1)/2 = **3** | x₂ = (5 − 1)/2 = **2**

**Exemple 2 :** 2x² + 4x + 2 = 0
Δ = 16 − 16 = **0** → x = −4/4 = **−1** (racine double)

**Exemple 3 :** x² + 1 = 0
Δ = 0 − 4 = −4 < 0 → **pas de solution réelle**

**Factorisation :** si Δ ≥ 0 → ax²+bx+c = a(x−x₁)(x−x₂)

Continue comme ça ! 💪`,
  },
  // ── FONCTIONS (3e → Terminale) ──────────────────────────────────────────────
  {
    slug: 'math-fonctions-definition',
    title: 'Notion de fonction',
    category: 'mathematiques', level: 'intermediaire',
    triggers: ['fonction','fonctions','notion de fonction','f(x)','image','antécédent','ensemble définition','domaine définition','courbe représentative','variable'],
    answer: `Excellente question ! ✨

🧮 **LA NOTION DE FONCTION**

Une **fonction** f associe à chaque valeur x de son domaine de définition une valeur unique f(x).
On note : f : x ↦ f(x)   ou   y = f(x)

**Vocabulaire :**
- **x** = variable / antécédent
- **f(x)** = image de x par f
- **Domaine de définition D** = ensemble des x pour lesquels f(x) est défini
- **Courbe représentative (Cₓ)** = ensemble des points M(x ; f(x))

**Lire une image et un antécédent :**
Si f(x) = 2x + 1 :
- Image de 3 : f(3) = 2(3)+1 = **7**
- Antécédent de 7 : résoudre f(x) = 7 → 2x+1=7 → x = **3**

**Domaine de définition — restrictions courantes :**
- Dénominateur ≠ 0 : f(x) = 1/(x−3) → D = ℝ \ {3}
- Sous une racine ≥ 0 : f(x) = √(x−2) → x−2 ≥ 0 → D = [2 ; +∞[

**Types de fonctions :**
Linéaire : f(x) = ax | Affine : f(x) = ax + b | Quadratique : f(x) = ax² + bx + c
Exponentielle : f(x) = eˣ | Logarithme : f(x) = ln(x)

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-fonctions-affines',
    title: 'Fonctions linéaires et affines',
    category: 'mathematiques', level: 'intermediaire',
    triggers: ['fonction linéaire','fonction affine','f(x)=ax+b','droite','coefficient directeur','ordonnée à l\'origine','pente','représentation graphique droite','fonction de la forme ax'],
    answer: `Excellente question ! ✨

🧮 **FONCTIONS LINÉAIRES ET AFFINES**

**FONCTION LINÉAIRE :** f(x) = **ax** (passe par l'origine)
- a = coefficient directeur (pente)
- Si a > 0 : croissante | Si a < 0 : décroissante

Exemples : f(x) = 3x | g(x) = −2x | h(x) = 0,5x

**FONCTION AFFINE :** f(x) = **ax + b**
- a = coefficient directeur (pente)
- b = ordonnée à l'origine (valeur de f(0))
- Représentation : une **droite** dans le plan

Exemple : f(x) = 2x + 3
- f(0) = 3 → la droite coupe l'axe y en (0 ; 3)
- f(x) = 0 → 2x + 3 = 0 → x = −3/2 → la droite coupe l'axe x en (−3/2 ; 0)

**Tracer une droite :** trouver 2 points.
f(x) = 2x + 1 :
| x | 0 | 2 |
|---|---|---|
| y | 1 | 5 |

**Coefficient directeur entre 2 points :** a = (y₂ − y₁)/(x₂ − x₁)
A(1; 3) et B(4; 9) → a = (9−3)/(4−1) = 6/3 = **2**

**Fonction constante :** f(x) = b → droite horizontale

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-fonctions-second-degre',
    title: 'Fonction du second degré',
    category: 'mathematiques', level: 'avance',
    triggers: ['fonction second degré','parabole','f(x)=ax²+bx+c','sommet parabole','axe symétrie','forme canonique','forme factorisée','trinôme'],
    answer: `Excellente question ! ✨

🧮 **FONCTION DU SECOND DEGRÉ**

**Forme développée :** f(x) = ax² + bx + c  (a ≠ 0)
La courbe représentative est une **parabole**.

**Sens de la parabole :**
- a > 0 → parabole tournée vers le **haut** (minimum)
- a < 0 → parabole tournée vers le **bas** (maximum)

**Sommet de la parabole :**
x_S = −b/(2a)   et   y_S = f(x_S)

Exemple : f(x) = x² − 4x + 3 (a=1, b=−4, c=3)
x_S = 4/2 = **2** | y_S = 4 − 8 + 3 = **−1** → sommet : **(2 ; −1)**

**Forme canonique :** f(x) = a(x − x_S)² + y_S
f(x) = (x − 2)² − 1

**Axe de symétrie :** droite verticale x = x_S = **x = 2**

**Racines (intersections avec l'axe x) :** résoudre f(x) = 0 via le discriminant.
Δ = (−4)²−4(1)(3) = 16−12 = 4 → x₁ = (4+2)/2 = **3** | x₂ = (4−2)/2 = **1**

**Forme factorisée :** f(x) = (x − 1)(x − 3)

**Tableau de signe de ax² + bx + c :**
Si Δ > 0 : signe de f = signe de a entre les racines, opposé à l'extérieur.

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-derivation',
    title: 'La dérivation',
    category: 'mathematiques', level: 'avance',
    triggers: ['dérivée','dérivation','f\'(x)','nombre dérivé','taux de variation','tangente','calcul dérivée','dériver une fonction','dérivée en un point'],
    answer: `Excellente question ! ✨

🧮 **LA DÉRIVATION**

**Définition :** La dérivée f'(x) mesure le **taux de variation instantané** de f en x.
Géométriquement : f'(a) est le **coefficient directeur de la tangente** à la courbe en x = a.

**Formule du nombre dérivé en a :**
f'(a) = lim[h→0] [f(a+h) − f(a)] / h

**Règles de dérivation à connaître :**

| Fonction f(x) | Dérivée f'(x) |
|--------------|--------------|
| k (constante) | 0 |
| x | 1 |
| xⁿ | n·xⁿ⁻¹ |
| √x | 1/(2√x) |
| 1/x | −1/x² |
| eˣ | eˣ |
| ln(x) | 1/x |
| sin(x) | cos(x) |
| cos(x) | −sin(x) |

**Règles de combinaison :**
- (f + g)' = f' + g'
- (kf)' = k·f'
- (f × g)' = f'g + fg'
- (f/g)' = (f'g − fg')/g²
- (f ∘ g)'(x) = g'(x) × f'(g(x))

**Exemples :**
- f(x) = 3x² + 2x − 5 → f'(x) = **6x + 2**
- g(x) = x³ − 4x → g'(x) = **3x² − 4**

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-tableau-variation',
    title: 'Tableau de variations',
    category: 'mathematiques', level: 'avance',
    triggers: ['tableau de variations','tableau variation','variations','sens variation','croissant décroissant','extremum','maximum minimum local','f croissante','f décroissante','étude fonction'],
    answer: `Excellente question ! ✨

🧮 **TABLEAU DE VARIATIONS**

Le tableau de variations résume le comportement d'une fonction sur son domaine.

**Méthode :**
1. Calculer f'(x)
2. Résoudre f'(x) = 0 → trouver les **valeurs critiques**
3. Étudier le signe de f'(x) :
   - f'(x) > 0 → f est **croissante** (↗)
   - f'(x) < 0 → f est **décroissante** (↘)
4. Calculer f aux valeurs critiques et aux bornes du domaine

**Exemple :** f(x) = x³ − 3x + 2 sur ℝ
f'(x) = 3x² − 3 = 3(x²−1) = 3(x+1)(x−1)
f'(x) = 0 → x = −1 ou x = 1
f'(x) > 0 pour x < −1 ou x > 1 → croissante
f'(x) < 0 pour −1 < x < 1 → décroissante

f(−1) = −1 + 3 + 2 = **4** (maximum local)
f(1) = 1 − 3 + 2 = **0** (minimum local)

**Tableau :**
| x | −∞ | −1 | 1 | +∞ |
|---|-----|-----|---|-----|
| f'(x) | + | 0 | − | 0 | + |
| f(x) | ↗ | **4** | ↘ | **0** | ↗ |

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-integrales',
    title: "L'intégrale",
    category: 'mathematiques', level: 'avance',
    triggers: ['intégrale','intégration','primitives','∫','calcul intégral','intégrale de a à b','aire sous la courbe','primitives fonction','calculer intégrale'],
    answer: `Excellente question ! ✨

🧮 **L'INTÉGRALE**

**Primitive :** F est une primitive de f si F'(x) = f(x).

**Primitives à connaître :**
| f(x) | F(x) |
|------|------|
| k | kx |
| xⁿ (n ≠ −1) | xⁿ⁺¹/(n+1) |
| 1/x | ln|x| |
| eˣ | eˣ |
| sin(x) | −cos(x) |
| cos(x) | sin(x) |

**Intégrale définie (de a à b) :**
∫[a,b] f(x) dx = F(b) − F(a) = [F(x)]ₐᵇ

**Exemple :** ∫[1,3] (2x + 1) dx
Primitive : F(x) = x² + x
= F(3) − F(1) = (9 + 3) − (1 + 1) = 12 − 2 = **10**

**Interprétation géométrique :**
Si f(x) ≥ 0 sur [a ; b], alors ∫[a,b] f(x) dx = **aire** entre la courbe et l'axe des abscisses.

**Calcul d'aire entre deux courbes :**
Aire = ∫[a,b] |f(x) − g(x)| dx
Si f ≥ g sur [a;b] : Aire = ∫[a,b] [f(x) − g(x)] dx

**Propriétés :**
- ∫[a,b] = −∫[b,a]
- ∫[a,b] + ∫[b,c] = ∫[a,c]
- ∫[a,a] = 0

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-fonction-exponentielle',
    title: "La fonction exponentielle",
    category: 'mathematiques', level: 'avance',
    triggers: ['exponentielle','fonction exponentielle','e exposant','eˣ','exp(x)','e=2,718','croissance exponentielle','propriétés exponentielle','dérivée exponentielle'],
    answer: `Excellente question ! ✨

🧮 **LA FONCTION EXPONENTIELLE**

**Définition :** La fonction exponentielle est la fonction f(x) = **eˣ**, où e ≈ **2,71828...**
C'est l'unique fonction dérivable telle que f' = f et f(0) = 1.

**Propriétés fondamentales :**
- Domaine : ℝ | Image : ]0 ; +∞[ (toujours strictement positive)
- eˣ > 0 pour tout x ∈ ℝ
- e⁰ = 1
- **Dérivée :** (eˣ)' = **eˣ** (remarquable !)
- **(eᵘ)' = u' × eᵘ** (règle de la chaîne)

**Règles de calcul (comme pour les puissances) :**
- eᵃ × eᵇ = **eᵃ⁺ᵇ**
- eᵃ / eᵇ = **eᵃ⁻ᵇ**
- (eᵃ)ᵇ = **eᵃᵇ**
- 1/eˣ = **e⁻ˣ**

**Variations :** eˣ est **strictement croissante** sur ℝ
- Quand x → −∞ : eˣ → **0** (asymptote horizontale y = 0)
- Quand x → +∞ : eˣ → **+∞**

**Liens :** eˣ est l'inverse de ln(x) : e^(ln x) = x et ln(eˣ) = x

**Exemples :** e²ˣ → dérivée = **2e²ˣ** | e^(3x+1) → dérivée = **3e^(3x+1)**

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-fonction-logarithme',
    title: 'La fonction logarithme',
    category: 'mathematiques', level: 'avance',
    triggers: ['logarithme','logarithme naturel','ln','log','fonction logarithme','ln(x)','propriétés logarithme','dérivée logarithme','log népérien'],
    answer: `Excellente question ! ✨

🧮 **LA FONCTION LOGARITHME NÉPÉRIEN**

**Définition :** ln(x) est l'inverse de eˣ.
ln(x) = a  ⟺  eᵃ = x  (pour x > 0)

**Propriétés fondamentales :**
- Domaine : **]0 ; +∞[** (définie uniquement pour x > 0)
- ln(1) = 0 | ln(e) = 1
- **Dérivée :** (ln x)' = **1/x** | (ln u)' = **u'/u**

**Règles de calcul :**
- ln(a × b) = **ln a + ln b**
- ln(a/b) = **ln a − ln b**
- ln(aⁿ) = **n × ln a**
- ln(√a) = **ln a / 2**
- ln(1/a) = **−ln a**

**Exemples :**
- ln(6) = ln(2 × 3) = ln 2 + ln 3
- ln(e³) = 3
- ln(1) = 0

**Variations :** ln est **strictement croissante** sur ]0 ; +∞[
- x → 0⁺ : ln(x) → **−∞**
- x → +∞ : ln(x) → **+∞**
- Courbe passe par (1 ; 0) et (e ; 1)

**Résoudre ln(x) = 2 :** x = **e²**
**Résoudre eˣ = 5 :** x = **ln(5)**

Continue comme ça ! 💪`,
  },
  // ── SUITES (Terminale) ──────────────────────────────────────────────────────
  {
    slug: 'math-suites',
    title: 'Les suites numériques',
    category: 'mathematiques', level: 'avance',
    triggers: ['suite','suites','suite numérique','terme général','suite explicite','suite récurrente','u_n','sens variation suite','limite suite','suite convergente'],
    answer: `Excellente question ! ✨

🧮 **LES SUITES NUMÉRIQUES**

Une **suite** est une liste ordonnée de nombres : u₀, u₁, u₂, …, uₙ, …

**Deux façons de définir une suite :**

**1. Terme général (forme explicite) :** uₙ = formule en n
- uₙ = 2n + 1 → u₀=1, u₁=3, u₂=5, u₃=7…
- uₙ = n² → u₀=0, u₁=1, u₂=4, u₃=9…

**2. Relation de récurrence :** uₙ₊₁ = formule utilisant uₙ
- uₙ₊₁ = uₙ + 3, u₀ = 1 → 1, 4, 7, 10, 13…

**Sens de variation :**
- Croissante si uₙ₊₁ ≥ uₙ (ou uₙ₊₁ − uₙ ≥ 0)
- Décroissante si uₙ₊₁ ≤ uₙ (ou uₙ₊₁ − uₙ ≤ 0)

**Limite d'une suite :**
- lim(n→+∞) uₙ = L : la suite **converge** vers L
- lim(n→+∞) uₙ = ±∞ : la suite **diverge**

**Suites usuelles :**
- Arithmétique : uₙ = u₀ + n·r
- Géométrique : uₙ = u₀ × qⁿ

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-suites-arithmetiques',
    title: 'Suites arithmétiques',
    category: 'mathematiques', level: 'avance',
    triggers: ['suite arithmétique','arithmétique','raison suite','terme suite arithmétique','somme termes arithmétique','progression arithmétique','u_n = u_0 + nr'],
    answer: `Excellente question ! ✨

🧮 **SUITES ARITHMÉTIQUES**

Une suite est **arithmétique** si chaque terme s'obtient en ajoutant une constante r (la **raison**) au terme précédent.
uₙ₊₁ = uₙ + r    ⟺    uₙ = u₀ + n·r  (terme général)

**Exemples :**
- u₀ = 3, r = 5 → uₙ = 3 + 5n → u₀=3, u₁=8, u₂=13, u₃=18…
- u₀ = 10, r = −2 → uₙ = 10 − 2n → u₀=10, u₁=8, u₂=6…

**Propriétés :**
- r > 0 : suite **croissante**
- r < 0 : suite **décroissante**
- r = 0 : suite **constante**
- Terme d'indice n : **uₙ = u₁ + (n−1)·r**

**Somme des n premiers termes :**
u₁ + u₂ + … + uₙ = n × (u₁ + uₙ)/2 = **n × (premier + dernier) / 2**

**Exemple :** somme de 1 à 100 (suite 1,2,3,…,100)
S = 100 × (1 + 100)/2 = 100 × 101/2 = **5050**

**Exemple 2 :** u₁=5, u₂=8, u₃=11… — Trouver u₁₀.
r = 8−5 = 3 → u₁₀ = 5 + 9×3 = 5 + 27 = **32**

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-suites-geometriques',
    title: 'Suites géométriques',
    category: 'mathematiques', level: 'avance',
    triggers: ['suite géométrique','géométrique','raison géométrique','suite avec q','terme géométrique','somme géométrique','progression géométrique','u_n = u_0 × q^n','intérêts composés'],
    answer: `Excellente question ! ✨

🧮 **SUITES GÉOMÉTRIQUES**

Une suite est **géométrique** si chaque terme s'obtient en **multipliant** par un constante q (la **raison**) le terme précédent.
uₙ₊₁ = uₙ × q    ⟺    uₙ = u₀ × qⁿ

**Exemples :**
- u₀ = 2, q = 3 → uₙ = 2 × 3ⁿ → 2, 6, 18, 54…
- u₀ = 100, q = 0,5 → uₙ = 100 × 0,5ⁿ → 100, 50, 25, 12,5…

**Propriétés :**
- q > 1 : suite **croissante** (si u₀ > 0)
- 0 < q < 1 : suite **décroissante** (si u₀ > 0)
- q < 0 : suite **alternée** (termes de signes alternés)
- q = 1 : suite **constante**

**Limite :**
- |q| < 1 → qⁿ → 0 donc uₙ → 0
- q > 1 et u₀ > 0 → uₙ → +∞

**Somme des n premiers termes (q ≠ 1) :**
u₀ + u₁ + … + uₙ₋₁ = u₀ × (1 − qⁿ)/(1 − q)

**Application — intérêts composés :**
Capital C₀, taux r annuel : Cₙ = C₀ × (1 + r)ⁿ
1000 € à 5%/an pendant 10 ans : C₁₀ = 1000 × 1,05¹⁰ ≈ **1629 €**

Continue comme ça ! 💪`,
  },
  // ── GÉOMÉTRIE ───────────────────────────────────────────────────────────────
  {
    slug: 'math-pythagore',
    title: 'Le théorème de Pythagore',
    category: 'mathematiques', level: 'intermediaire',
    triggers: ['pythagore','théorème de pythagore','triangle rectangle','hypoténuse','a²+b²=c²','côté triangle','calcul hypoténuse','réciproque pythagore'],
    answer: `Excellente question ! ✨

📐 **LE THÉORÈME DE PYTHAGORE**

**Dans un triangle rectangle**, le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés.

Si ABC est rectangle en C (l'angle droit est en C) :
**AB² = AC² + BC²**
- AB = hypoténuse (le côté opposé à l'angle droit, le plus long)
- AC et BC = les deux côtés de l'angle droit (cathètes)

**Exemples :**
- AC = 3, BC = 4 → AB² = 9 + 16 = 25 → AB = **5** (triangle 3-4-5)
- AC = 5, AB = 13 → BC² = 169 − 25 = 144 → BC = **12** (triangle 5-12-13)

**Réciproque de Pythagore :**
Si AC² + BC² = AB², alors le triangle est **rectangle en C**.
Exemple : AC=6, BC=8, AB=10 → 36+64=100=10² → triangle rectangle ✅

**Contre-réciproque :**
Si AC² + BC² ≠ AB², alors le triangle n'est **pas** rectangle.

**Application pratique :**
La diagonale d'un rectangle de 3m × 4m = √(9 + 16) = √25 = **5 m**

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-trigonometrie',
    title: 'La trigonométrie',
    category: 'mathematiques', level: 'avance',
    triggers: ['trigonométrie','sin','cos','tan','sinus','cosinus','tangente','angle','formule trigonométrie','triangle rectangle trigo','cosinus sinus tangente','SOH CAH TOA'],
    answer: `Excellente question ! ✨

📐 **LA TRIGONOMÉTRIE**

Dans un **triangle rectangle**, pour un angle aigu α :

| Rapport | Formule | Mémo |
|---------|---------|------|
| **sin(α)** | côté opposé / hypoténuse | SOH |
| **cos(α)** | côté adjacent / hypoténuse | CAH |
| **tan(α)** | côté opposé / adjacent | TOA |

**SOH-CAH-TOA** → moyen mémo-technique classique

**Valeurs à connaître :**

| Angle | 0° | 30° | 45° | 60° | 90° |
|-------|-----|------|------|------|------|
| sin | 0 | 1/2 | √2/2 | √3/2 | 1 |
| cos | 1 | √3/2 | √2/2 | 1/2 | 0 |
| tan | 0 | 1/√3 | 1 | √3 | — |

**Relations fondamentales :**
- sin²(α) + cos²(α) = **1**
- tan(α) = sin(α)/cos(α)

**Exemple :** Triangle rectangle, hypoténuse = 10, angle α = 30°
- Côté opposé = 10 × sin(30°) = 10 × 0,5 = **5**
- Côté adjacent = 10 × cos(30°) = 10 × (√3/2) ≈ **8,66**

**Cercle trigonométrique :** angles en radians : π/6 = 30°, π/4 = 45°, π/3 = 60°, π/2 = 90°, π = 180°

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-vecteurs',
    title: 'Les vecteurs',
    category: 'mathematiques', level: 'avance',
    triggers: ['vecteur','vecteurs','coordonnées vecteur','norme vecteur','addition vecteurs','vecteur directeur','colinéaire','AB vecteur','représenter vecteur'],
    answer: `Excellente question ! ✨

📐 **LES VECTEURS**

Un **vecteur** est défini par une **direction**, un **sens** et une **norme** (longueur).
Notation : $\vec{AB}$ ou $\vec{u}$

**Coordonnées d'un vecteur :**
Si A(xₐ ; yₐ) et B(xᵦ ; yᵦ), alors $\vec{AB}$ = (xᵦ − xₐ ; yᵦ − yₐ)

**Norme (longueur) :**
||$\vec{AB}$|| = √((xᵦ − xₐ)² + (yᵦ − yₐ)²)

**Exemple :** A(1;2), B(4;6)
$\vec{AB}$ = (3 ; 4) | ||$\vec{AB}$|| = √(9+16) = √25 = **5**

**Opérations sur les vecteurs :**
- **Addition :** $\vec{u}$(a;b) + $\vec{v}$(c;d) = (a+c ; b+d)
- **Multiplication par un scalaire k :** k·$\vec{u}$(a;b) = (ka ; kb)
- **Règle de Chasles :** $\vec{AB}$ + $\vec{BC}$ = $\vec{AC}$

**Vecteurs colinéaires :**
$\vec{u}$(a;b) et $\vec{v}$(c;d) sont colinéaires si **ad − bc = 0**
(Déterminant nul)

**Vecteurs égaux :** même direction, même sens, même norme.

**Application :** Vérifier l'alignement de 3 points A, B, C :
A, B, C alignés ⟺ $\vec{AB}$ et $\vec{AC}$ colinéaires.

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-produit-scalaire',
    title: 'Le produit scalaire',
    category: 'mathematiques', level: 'avance',
    triggers: ['produit scalaire','vecteurs perpendiculaires','angle entre vecteurs','formule produit scalaire','cos angle vecteur','orthogonalité','u.v','projection'],
    answer: `Excellente question ! ✨

📐 **LE PRODUIT SCALAIRE**

Le produit scalaire de deux vecteurs $\vec{u}$ et $\vec{v}$ est un **nombre réel** (un scalaire).

**Formules :**

**1. Avec les coordonnées :**
$\vec{u}$(a;b) · $\vec{v}$(c;d) = **ac + bd**

**2. Avec l'angle θ entre les vecteurs :**
$\vec{u}$ · $\vec{v}$ = ||$\vec{u}$|| × ||$\vec{v}$|| × **cos(θ)**

**3. Avec les normes et une diagonale :**
$\vec{AB}$ · $\vec{AC}$ = ½(||$\vec{AB}$||² + ||$\vec{AC}$||² − ||$\vec{BC}$||²) (formule d'Al-Kashi)

**Propriété fondamentale — Orthogonalité :**
$\vec{u}$ ⊥ $\vec{v}$  ⟺  $\vec{u}$ · $\vec{v}$ = **0**

**Exemple :** $\vec{u}$(3;4), $\vec{v}$(−4;3)
$\vec{u}$ · $\vec{v}$ = 3×(−4) + 4×3 = −12 + 12 = **0** → perpendiculaires ✅

**Trouver un angle :**
cos(θ) = ($\vec{u}$ · $\vec{v}$) / (||$\vec{u}$|| × ||$\vec{v}$||)

$\vec{u}$(1;1), $\vec{v}$(1;0) :
$\vec{u}$ · $\vec{v}$ = 1 | ||$\vec{u}$|| = √2 | ||$\vec{v}$|| = 1
cos θ = 1/√2 → θ = **45°**

Continue comme ça ! 💪`,
  },
  // ── PROBABILITÉS ET STATISTIQUES ───────────────────────────────────────────
  {
    slug: 'math-statistiques',
    title: 'Les statistiques descriptives',
    category: 'mathematiques', level: 'intermediaire',
    triggers: ['statistiques','statistique','moyenne','médiane','mode','étendue','variance','écart-type','données statistiques','série statistique','fréquence'],
    answer: `Excellente question ! ✨

📊 **LES STATISTIQUES DESCRIPTIVES**

**Indicateurs de position (centre) :**

**Moyenne :** x̄ = (somme de toutes les valeurs) / (nombre de valeurs)
Ex : 5, 7, 8, 6, 9 → x̄ = 35/5 = **7**

**Médiane :** valeur qui partage la série ordonnée en deux moitiés égales.
Ex : 5, 6, 7, 8, 9 → médiane = **7** (3e valeur)
Si n pair : médiane = moyenne des 2 valeurs centrales.

**Mode :** valeur la plus fréquente.
Ex : 3, 5, 5, 7, 5, 8 → mode = **5**

---

**Indicateurs de dispersion :**

**Étendue :** max − min
Ex : 5,7,8,6,9 → 9 − 5 = **4**

**Variance (σ²) :** moyenne des carrés des écarts à la moyenne.
σ² = (1/n) × Σ(xᵢ − x̄)²

**Écart-type (σ) :** σ = √(variance)
Plus σ est grand, plus les données sont dispersées.

**Quartiles :**
- Q₁ = 1er quartile (25% des données en-dessous)
- Q₂ = médiane (50%)
- Q₃ = 3e quartile (75%)
- Écart interquartile = Q₃ − Q₁

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-probabilites',
    title: 'Les probabilités',
    category: 'mathematiques', level: 'intermediaire',
    triggers: ['probabilité','probabilités','événement','expérience aléatoire','univers','proba','P(A)','probabilité d\'un événement','calcul probabilité','fréquence probabilité'],
    answer: `Excellente question ! ✨

📊 **LES PROBABILITÉS**

La probabilité mesure la **chance qu'un événement se produise**, entre 0 (impossible) et 1 (certain).

**Vocabulaire :**
- **Expérience aléatoire** : dont le résultat est incertain (lancer un dé, tirer une carte…)
- **Univers Ω** : ensemble de tous les résultats possibles
- **Événement A** : sous-ensemble de Ω
- **P(A)** : probabilité de A

**Formule (cas équiprobable) :**
P(A) = (nombre de cas favorables à A) / (nombre de cas possibles)

**Exemples :**
- Dé équilibré : P(6) = 1/6 | P(pair) = 3/6 = 1/2
- Tirage d'une carte rouge dans un jeu de 52 : P = 26/52 = 1/2

**Opérations sur les événements :**
- **Complémentaire :** P(Ā) = 1 − P(A)
- **Union :** P(A ∪ B) = P(A) + P(B) − P(A ∩ B)
- **Si A et B incompatibles (A ∩ B = ∅) :** P(A ∪ B) = P(A) + P(B)
- **Si A et B indépendants :** P(A ∩ B) = P(A) × P(B)

**Probabilité conditionnelle :**
P(A|B) = P(A ∩ B) / P(B) (probabilité de A sachant B)

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-combinatoire',
    title: 'Dénombrement et combinatoire',
    category: 'mathematiques', level: 'avance',
    triggers: ['combinatoire','dénombrement','arrangement','combinaison','permutation','factorielle','C(n,k)','coefficients binomiaux','n!','arrangement','triangle Pascal'],
    answer: `Excellente question ! ✨

📊 **DÉNOMBREMENT ET COMBINATOIRE**

**Factorielle :** n! = n × (n−1) × … × 2 × 1
0! = 1 | 1! = 1 | 4! = 24 | 5! = 120

**ARRANGEMENTS — ordre important, sans répétition :**
Aₙᵏ = n! / (n−k)! = n × (n−1) × … × (n−k+1)

Exemple : 5 coureurs, les 3 premières places → A₅³ = 5×4×3 = **60** podiums possibles

**COMBINAISONS — ordre non important, sans répétition :**
C(n,k) = n! / (k! × (n−k)!)  (aussi noté "n parmi k" ou Cₙᵏ)

Exemple : Choisir 3 élèves parmi 10 (ordre indifférent)
C(10,3) = 10!/(3!×7!) = (10×9×8)/(3×2×1) = **120** façons

**Triangle de Pascal :** chaque coefficient = somme des deux au-dessus.
Row 0: 1
Row 1: 1 1
Row 2: 1 2 1
Row 3: 1 3 3 1
Row 4: 1 4 6 4 1

**Formule du binôme de Newton :**
(a + b)ⁿ = Σₖ C(n,k) × aⁿ⁻ᵏ × bᵏ

Exemple : (x + 1)³ = x³ + 3x² + 3x + 1

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-loi-binomiale',
    title: 'La loi binomiale',
    category: 'mathematiques', level: 'avance',
    triggers: ['loi binomiale','loi de Bernoulli','binomial','B(n,p)','schéma de Bernoulli','répétition épreuves','succès échec','espérance binomiale','variance binomiale','P(X=k)'],
    answer: `Excellente question ! ✨

📊 **LA LOI BINOMIALE**

**Schéma de Bernoulli :** n expériences identiques et indépendantes, chacune avec :
- Probabilité de succès p | Probabilité d'échec 1−p = q

**X = nombre de succès** → X suit la loi **B(n, p)**

**Formule de probabilité :**
**P(X = k) = C(n,k) × pᵏ × (1−p)ⁿ⁻ᵏ**

**Exemple :** Lancer 5 fois un dé, P(obtenir un 6) = 1/6. Probabilité d'avoir exactement 2 fois le 6 ?
P(X=2) = C(5,2) × (1/6)² × (5/6)³
= 10 × (1/36) × (125/216)
= 10 × 125 / 7776 ≈ **0,161** soit ≈ 16,1%

**Espérance (moyenne) :** E(X) = **n × p**
Si n=10, p=0,3 → E(X) = 3 (en moyenne, 3 succès)

**Variance :** V(X) = **n × p × (1−p)**
**Écart-type :** σ = √(n × p × (1−p))

**Propriété :** On peut approcher B(n,p) par une loi normale quand n grand et np(1−p) > 9.

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-loi-normale',
    title: 'La loi normale',
    category: 'mathematiques', level: 'avance',
    triggers: ['loi normale','distribution normale','courbe de Gauss','loi gaussienne','espérance variance','N(μ,σ²)','probabilité loi normale','loi normale centrée réduite','Z'],
    answer: `Excellente question ! ✨

📊 **LA LOI NORMALE**

La loi normale (ou loi de Gauss) est la plus importante des lois continues.

**Notation :** X suit **N(μ, σ²)** où :
- **μ** = espérance (moyenne)
- **σ²** = variance | **σ** = écart-type

**Propriétés :**
- Courbe en **cloche** symétrique par rapport à μ
- P(X = x) = 0 (variable continue)
- On calcule des probabilités sur des intervalles

**Règle des 1, 2, 3 sigma :**
- P(μ − σ < X < μ + σ) ≈ **0,683** (68,3%)
- P(μ − 2σ < X < μ + 2σ) ≈ **0,954** (95,4%)
- P(μ − 3σ < X < μ + 3σ) ≈ **0,997** (99,7%)

**Loi normale centrée réduite N(0,1) :**
Z = (X − μ) / σ  → Z suit N(0,1)

**Utilisation des tables :**
P(Z ≤ z) = valeur lue dans la table de la loi N(0,1)

**Exemple :** X ~ N(100, 25) (μ=100, σ=5)
P(X < 110) = P(Z < (110−100)/5) = P(Z < 2) ≈ **0,977** = 97,7%

**Applications :** tailles, poids, notes, mesures physiques…

Continue comme ça ! 💪`,
  },
];
