// PARTIE 8 — ALGÈBRE AVANCÉE ET ANALYSE (Lycée → Terminale) — 20 leçons
export const LECONS_ANALYSE_AVANCEE = [
  {
    slug: 'math-derivees-regles',
    title: 'Les dérivées — règles complètes',
    category: 'mathematiques', level: 'avance',
    triggers: ['derivee','derives','derivation','regle derivation','f prime','f\'(x)','derive somme','derive produit','derive quotient','derive composee','tableau derivees','comment deriver'],
    answer: `Excellente question ! ✨

📐 **LES DÉRIVÉES — RÈGLES COMPLÈTES**

---

**TABLEAU DES DÉRIVÉES USUELLES**

| Fonction f(x) | Dérivée f\'(x) |
|---|---|
| constante k | 0 |
| x | 1 |
| xⁿ (n entier) | n × xⁿ⁻¹ |
| √x | 1 / (2√x) |
| 1/x | -1/x² |
| eˣ | eˣ |
| ln(x) | 1/x |
| sin(x) | cos(x) |
| cos(x) | -sin(x) |
| tan(x) | 1/cos²(x) |

---

**RÈGLES DE CALCUL**

**Somme :** (u + v)' = u' + v'
> (3x² + 5x)' = 6x + 5

**Produit :** (u × v)' = u'v + uv'
> (x² × eˣ)' = 2x × eˣ + x² × eˣ = eˣ(2x + x²)

**Quotient :** (u/v)' = (u'v - uv') / v²
> (x/sinx)' = (1 × sinx - x × cosx) / sin²x

**Composée :** (f ∘ g)'(x) = g'(x) × f'(g(x))
> (e^(3x))' = 3 × e^(3x)
> (ln(2x+1))' = 2/(2x+1)
> (sin(x²))' = 2x × cos(x²)

---

**EXEMPLES COMPLETS**

1. f(x) = 3x⁴ - 2x² + 7
   f\'(x) = 12x³ - 4x

2. f(x) = (2x+1)⁵
   f\'(x) = 5 × (2x+1)⁴ × 2 = **10(2x+1)⁴**

3. f(x) = ln(x² + 3)
   f\'(x) = 2x/(x² + 3)

---

**ÉQUATION DE LA TANGENTE** en x = a :
> y = f\'(a)(x - a) + f(a)

**Exemple :** f(x) = x², tangente en a = 2
f\'(x) = 2x → f\'(2) = 4 | f(2) = 4
y = 4(x - 2) + 4 = **4x - 4**

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-etude-fonction',
    title: "Étude complète d'une fonction",
    category: 'mathematiques', level: 'avance',
    triggers: ["etude de fonction","etude fonction","tableau de variation","tableau de signe","sens variation","maximum minimum","extremum","croissante decroissante","asymptote","limites fonction"],
    answer: `Excellente question ! ✨

📐 **ÉTUDE COMPLÈTE D'UNE FONCTION**

---

**MÉTHODE EN 7 ÉTAPES**

**1. DOMAINE DE DÉFINITION (Df)**
- Interdire les x qui annulent un dénominateur ou rendent un ln/√ impossible
- f(x) = 1/(x-2) → Df = ℝ \\ {2}
- f(x) = ln(x) → Df = ]0 ; +∞[
- f(x) = √x → Df = [0 ; +∞[

**2. PARITÉ (optionnel)**
- f(-x) = f(x) → **paire** (symétrique / axe Oy)
- f(-x) = -f(x) → **impaire** (symétrique / origine O)

**3. LIMITES AUX BORNES**
- Calculer lim f(x) quand x → ±∞, et aux points exclus du domaine
- Détecter les **asymptotes verticales** (x = a si lim = ±∞)
- Détecter les **asymptotes horizontales** (y = L si lim = L)

**4. DÉRIVÉE f\'(x)**
- Calculer f\'(x) avec les règles de dérivation

**5. TABLEAU DE SIGNE DE f\'(x)**
- Résoudre f\'(x) = 0 et f\'(x) > 0 / f\'(x) < 0
- f\'(x) > 0 → f croissante | f\'(x) < 0 → f décroissante

**6. TABLEAU DE VARIATIONS**

| x | -∞ | ... | a | ... | +∞ |
|---|---|---|---|---|---|
| f\'(x) | - | - | 0 | + | + |
| f(x) | ↘ | ↘ | min | ↗ | ↗ |

**7. REPRÉSENTATION GRAPHIQUE**
- Placer les extrema, les asymptotes, quelques points clés

---

**EXEMPLE : f(x) = x³ - 3x**
- Df = ℝ
- f\'(x) = 3x² - 3 = 3(x² - 1) = 3(x-1)(x+1)
- f\'(x) = 0 → x = -1 ou x = 1
- f(-1) = 2 (maximum local) | f(1) = -2 (minimum local)

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-limites',
    title: 'Les limites de fonctions',
    category: 'mathematiques', level: 'avance',
    triggers: ['limites','limite','lim','limite infini','forme indeterminee','levee indetermination','limite en l infini','asymptote horizontale','asymptote verticale','limite en 0'],
    answer: `Excellente question ! ✨

📐 **LES LIMITES DE FONCTIONS**

---

**DÉFINITIONS**

- lim f(x) = +∞ quand x → +∞ : f(x) croît sans borne
- lim f(x) = L (réel) quand x → a : f(x) se rapproche de L

---

**OPÉRATIONS SUR LES LIMITES**

| Opération | Résultat | Remarque |
|---|---|---|
| L₁ + L₂ | L₁ + L₂ | |
| +∞ + L | +∞ | |
| **+∞ + (-∞)** | **F.I.** | Forme indéterminée ! |
| L × +∞ (L > 0) | +∞ | |
| 0 × ∞ | **F.I.** | |
| L / ∞ | 0 | |
| ∞ / ∞ | **F.I.** | |
| L / 0⁺ | +∞ | |

**F.I. = Forme Indéterminée** → il faut lever l'indétermination

---

**LEVÉE D'INDÉTERMINATION — MÉTHODES**

**1. Factoriser par le terme dominant** (pour ∞/∞ ou ∞ - ∞)
> lim (3x² + 5x) / (2x² - 1) = lim x²(3 + 5/x) / x²(2 - 1/x²)
> = (3 + 0) / (2 - 0) = **3/2**

**2. Multiplier par l'expression conjuguée** (pour √ - √ → 0/0)
> lim (√(x+1) - 1) / x quand x→0
> = lim (x+1-1) / (x(√(x+1)+1)) = lim 1/(√(x+1)+1) = **1/2**

**3. Croissances comparées** (très utile en Terminale)
> lim eˣ/xⁿ = +∞ quand x → +∞ (l'exponentielle l'emporte toujours)
> lim xⁿ × ln(x) = 0 quand x → 0⁺ (x^n l'emporte sur ln)

---

**ASYMPTOTES**
- **Asymptote verticale x = a** : lim f(x) = ±∞ quand x → a
- **Asymptote horizontale y = L** : lim f(x) = L quand x → ±∞
- **Asymptote oblique y = ax + b** : lim [f(x) - (ax+b)] = 0

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-integrales',
    title: 'Le calcul intégral',
    category: 'mathematiques', level: 'avance',
    triggers: ['integrale','integrales','calcul integral','primitive','primitives','integrale definie','valeur moyenne','aire sous courbe','integrer','tableau primitives','theoreme fondamental'],
    answer: `Excellente question ! ✨

📐 **LE CALCUL INTÉGRAL**

---

**PRIMITIVES USUELLES**

| f(x) | Primitive F(x) |
|---|---|
| k (constante) | kx + C |
| xⁿ (n ≠ -1) | xⁿ⁺¹/(n+1) + C |
| 1/x | ln|x| + C |
| eˣ | eˣ + C |
| e^(ax) | e^(ax)/a + C |
| sin(x) | -cos(x) + C |
| cos(x) | sin(x) + C |
| 1/x² | -1/x + C |
| 1/√x | 2√x + C |

---

**L'INTÉGRALE DÉFINIE**

> ∫[a;b] f(x)dx = F(b) - F(a)

où F est une primitive de f.

**Exemple :** ∫[0;2] 3x² dx
F(x) = x³ → F(2) - F(0) = 8 - 0 = **8**

---

**PROPRIÉTÉS**

- ∫[a;b] f(x)dx = -∫[b;a] f(x)dx
- ∫[a;b] [f(x) + g(x)]dx = ∫[a;b]f dx + ∫[a;b]g dx
- ∫[a;b] k·f(x)dx = k × ∫[a;b]f dx

---

**VALEUR MOYENNE d'une fonction sur [a;b] :**
> μ = 1/(b-a) × ∫[a;b] f(x)dx

**Exemple :** f(x) = 2x sur [0;3]
μ = 1/3 × ∫[0;3] 2x dx = 1/3 × [x²]₀³ = 1/3 × 9 = **3**

---

**AIRE ENTRE DEUX COURBES**

Si f(x) ≥ g(x) sur [a;b] :
> Aire = ∫[a;b] [f(x) - g(x)]dx

---

**INTÉGRATION PAR PARTIES** :
> ∫ u'v dx = [uv] - ∫ uv' dx

**Exemple :** ∫ x·eˣ dx
u' = eˣ → u = eˣ | v = x → v' = 1
= [x·eˣ] - ∫ eˣ dx = x·eˣ - eˣ + C = **eˣ(x-1) + C**

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-equations-differentielles',
    title: 'Les équations différentielles',
    category: 'mathematiques', level: 'avance',
    triggers: ["equation differentielle","equations differentielles","y' = ay","y prime","solution generale","condition initiale","y' = ay + b","croissance exponentielle","decroissance"],
    answer: `Excellente question ! ✨

📐 **LES ÉQUATIONS DIFFÉRENTIELLES**

---

**TYPE 1 : y' = ay** (a réel ≠ 0)

**Solution générale :**
> y = C × e^(ax) où C ∈ ℝ est une constante

**Méthode de résolution :**
1. Identifier a
2. Écrire y = Ce^(ax)
3. Appliquer la condition initiale pour trouver C

**Exemple :** y' = 3y avec y(0) = 2
- Solution générale : y = Ce^(3x)
- Condition : y(0) = C × e⁰ = C = 2
- Solution particulière : **y = 2e^(3x)**

---

**TYPE 2 : y' = ay + b** (a ≠ 0, b ≠ 0)

**Méthode :**
1. Trouver la **solution particulière constante** : y' = 0 → 0 = ay₀ + b → **y₀ = -b/a**
2. La **solution générale** est : y = Ce^(ax) + (-b/a)

**Exemple :** y' = 2y + 4 avec y(0) = 5
- Solution particulière : y₀ = -4/2 = -2
- Solution générale : y = Ce^(2x) - 2
- Condition : y(0) = C - 2 = 5 → C = 7
- Solution : **y = 7e^(2x) - 2**

---

**INTERPRÉTATIONS**

| Type | Modèle | Exemple |
|---|---|---|
| y' = ay, a > 0 | Croissance exponentielle | Population, intérêts composés |
| y' = ay, a < 0 | Décroissance exponentielle | Radioactivité, refroidissement |
| y' = ay + b | Équilibre vers -b/a | Température ambiante (Newton) |

---

**VÉRIFICATION :** Toujours dériver y et vérifier que y' = ay (ou y' = ay + b).

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-loi-normale',
    title: 'La loi normale — N(μ, σ)',
    category: 'probabilites', level: 'avance',
    triggers: ['loi normale','loi normale terminale','N mu sigma','variable aleatoire normale','standardisation','loi centree reduite','table loi normale','intervalle confiance','esperance variance loi normale'],
    answer: `Excellente question ! ✨

📐 **LA LOI NORMALE N(μ, σ)**

---

**DÉFINITION**

La loi normale modélise des phénomènes naturels continus (taille, poids, notes...).
X suit une loi normale N(μ, σ) où :
- **μ** = espérance (moyenne) = centre de la cloche
- **σ** = écart-type (largeur de la cloche)

---

**PROPRIÉTÉS**

La courbe est une **cloche de Gauss** (symétrique par rapport à μ) :
- P(X < μ) = P(X > μ) = 0,5
- **68%** des valeurs sont dans [μ - σ ; μ + σ]
- **95%** des valeurs dans [μ - 2σ ; μ + 2σ]
- **99,7%** dans [μ - 3σ ; μ + 3σ]

---

**STANDARDISATION (centrer-réduire)**

Pour utiliser la table de la loi normale centrée réduite N(0,1) :
> **Z = (X - μ) / σ**

P(X < x) = P(Z < z) où z = (x - μ) / σ

**Exemple :** X suit N(100, 15). Calculer P(X < 120).
z = (120 - 100) / 15 = **20/15 ≈ 1,33**
P(X < 120) = P(Z < 1,33) ≈ **0,9082** (table)

---

**INTERVALLE DE CONFIANCE au niveau 95%**

Pour une proportion p inconnue, estimée sur n observations :
> IC à 95% = [p̂ - 1,96 × √(p̂(1-p̂)/n) ; p̂ + 1,96 × √(p̂(1-p̂)/n)]

**Exemple :** 60 succès sur 200 → p̂ = 0,3
√(0,3 × 0,7 / 200) = √(0,00105) ≈ 0,0324
IC = [0,3 - 0,063 ; 0,3 + 0,063] = **[0,237 ; 0,363]**

---

**VALEURS DE LA TABLE N(0,1) À RETENIR**
- P(Z < 1,645) ≈ 0,95
- P(Z < 1,96) ≈ 0,975
- P(Z < 2,576) ≈ 0,995

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-matrices',
    title: 'Les matrices — opérations et applications',
    category: 'mathematiques', level: 'avance',
    triggers: ['matrice','matrices','produit matrices','inverse matrice','determinant','systeme matriciel','AX=B','resolution systeme matrice','matrice carree','matrice 2x2','matrice identite'],
    answer: `Excellente question ! ✨

📐 **LES MATRICES**

---

**DÉFINITION**

Une matrice est un tableau de nombres organisé en lignes et colonnes.
Une matrice A de type m × n a m lignes et n colonnes.

---

**OPÉRATIONS FONDAMENTALES**

**Addition** (matrices de même taille) :
> (A + B)ᵢⱼ = Aᵢⱼ + Bᵢⱼ

**Multiplication par un scalaire k :**
> (kA)ᵢⱼ = k × Aᵢⱼ

**Produit de matrices A(m×n) × B(n×p) = C(m×p) :**
> Cᵢⱼ = Σ Aᵢₖ × Bₖⱼ (ligne i de A × colonne j de B)

**Attention :** AB ≠ BA en général ! (non commutatif)

---

**DÉTERMINANT d'une matrice 2×2**

Pour A = [[a, b], [c, d]] :
> **det(A) = ad - bc**

Si det(A) ≠ 0 → A est inversible

---

**INVERSE d'une matrice 2×2**

> A⁻¹ = (1/det(A)) × [[d, -b], [-c, a]]

**Exemple :**
A = [[3, 1], [2, 1]] → det(A) = 3×1 - 1×2 = 1
A⁻¹ = [[1, -1], [-2, 3]]

**Vérification :** A × A⁻¹ = I (matrice identité)

---

**RÉSOLUTION D'UN SYSTÈME AX = B**

Si A est inversible : **X = A⁻¹ × B**

**Exemple :**
Système : { 3x + y = 5 ; 2x + y = 4 }
→ A = [[3,1],[2,1]], B = [[5],[4]]
X = A⁻¹ × B = [[1,-1],[-2,3]] × [[5],[4]] = [[1],[-2]]
→ **x = 1, y = -2**

---

**MATRICE IDENTITÉ** I_n : diagonale = 1, reste = 0
A × I = I × A = A

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-logarithme',
    title: 'Le logarithme népérien ln(x)',
    category: 'mathematiques', level: 'avance',
    triggers: ['logarithme','log','ln','ln x','proprietes ln','logarithme neperien','logarithme decimal','log10','equation avec ln','ln e','ln exponentielle'],
    answer: `Excellente question ! ✨

📐 **LE LOGARITHME NÉPÉRIEN ln(x)**

---

**DÉFINITION**

ln(x) est la fonction inverse de l'exponentielle eˣ.
- ln(eˣ) = x pour tout x ∈ ℝ
- e^(ln(x)) = x pour x > 0
- **Domaine :** Df = ]0 ; +∞[
- ln(1) = 0 | ln(e) = 1 | ln(e²) = 2

---

**PROPRIÉTÉS ALGÉBRIQUES** (à apprendre par cœur)

| Propriété | Formule |
|---|---|
| Produit | ln(a × b) = ln(a) + ln(b) |
| Quotient | ln(a/b) = ln(a) - ln(b) |
| Puissance | ln(aⁿ) = n × ln(a) |
| Racine | ln(√a) = ln(a)/2 |
| Réciproque | ln(1/a) = -ln(a) |

---

**DÉRIVÉE et VARIATIONS**

- f(x) = ln(x) → f\'(x) = 1/x
- f(x) = ln(u(x)) → f\'(x) = u\'(x)/u(x)

**Variations :**
- ln est **strictement croissante** sur ]0 ; +∞[
- lim ln(x) = -∞ quand x → 0⁺
- lim ln(x) = +∞ quand x → +∞

---

**RÉSOUDRE UNE ÉQUATION avec ln**

**Exemple 1 :** ln(x) = 3
→ x = e³ ≈ **20,09**

**Exemple 2 :** ln(2x + 1) = ln(5)
→ 2x + 1 = 5 → x = **2**

**Exemple 3 :** ln(x) + ln(x-1) = ln(6)
→ ln(x(x-1)) = ln(6) → x² - x - 6 = 0 → (x-3)(x+2) = 0
→ x = 3 (x = -2 refusé car ln(-2) non défini)
→ **x = 3**

---

**CROISSANCES COMPARÉES**

> lim x^n × ln(x) = 0 quand x → 0⁺ (pour n > 0)
> lim ln(x)/x^n = 0 quand x → +∞ (pour n > 0)

Signification : x^n l'emporte sur ln(x) dans les deux cas.

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-exponentielle-avancee',
    title: "La fonction exponentielle — propriétés avancées",
    category: 'mathematiques', level: 'avance',
    triggers: ["exponentielle","fonction exponentielle","e puissance x","ex","proprietes exponentielle","equation exponentielle","croissance exponentielle","derivee exponentielle","e a la puissance"],
    answer: `Excellente question ! ✨

📐 **LA FONCTION EXPONENTIELLE**

---

**DÉFINITION ET VALEURS CLÉS**

- **e** ≈ 2,71828... (constante d'Euler)
- e⁰ = 1 | e¹ = e ≈ 2,718 | e⁻¹ = 1/e ≈ 0,368

**Inverse de ln :** e^(ln(x)) = x et ln(eˣ) = x

---

**PROPRIÉTÉS ALGÉBRIQUES**

| Propriété | Formule |
|---|---|
| Produit | eᵃ × eᵇ = e^(a+b) |
| Quotient | eᵃ / eᵇ = e^(a-b) |
| Puissance | (eᵃ)ⁿ = e^(an) |
| Négatif | e^(-a) = 1/eᵃ |
| Produit général | e^(f(x)) × e^(g(x)) = e^(f(x)+g(x)) |

---

**DÉRIVÉE et VARIATIONS**

- (eˣ)' = eˣ (la dérivée de eˣ est eˣ elle-même !)
- (e^(ax))' = a × e^(ax)
- (e^(u(x)))' = u'(x) × e^(u(x))

**Variations :** eˣ est **strictement croissante** sur ℝ
- lim eˣ = 0 quand x → -∞
- lim eˣ = +∞ quand x → +∞

---

**RÉSOUDRE UNE ÉQUATION avec eˣ**

**Exemple 1 :** eˣ = 5 → x = **ln(5)** ≈ 1,609

**Exemple 2 :** e^(2x-1) = 3
→ 2x - 1 = ln(3) → x = **(1 + ln(3))/2**

**Exemple 3 :** e^(2x) - 5eˣ + 6 = 0 (équation du second degré)
- Poser X = eˣ (X > 0)
- X² - 5X + 6 = 0 → (X-2)(X-3) = 0
- X = 2 → eˣ = 2 → x = ln(2)
- X = 3 → eˣ = 3 → x = ln(3)
- Solutions : **x = ln(2) ou x = ln(3)**

---

**MODÈLES EXPONENTIELS**

Croissance : N(t) = N₀ × e^(at) avec a > 0
Décroissance (radioactivité) : N(t) = N₀ × e^(-λt) avec λ > 0
Demi-vie T : N₀/2 = N₀ × e^(-λT) → T = **ln(2)/λ**

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-trigonometrie-avancee-lycee',
    title: 'Trigonométrie avancée — formules et équations',
    category: 'mathematiques', level: 'avance',
    triggers: ['formules trigonometrie','sin a+b','cos a+b','angle double','equation trigonometrique','sin x = ','cos x = ','arcsin','arccos','radians conversions avancees','resoudre sin cos'],
    answer: `Excellente question ! ✨

📐 **TRIGONOMÉTRIE AVANCÉE**

---

**FORMULES D'ADDITION**

> sin(a + b) = sin(a)cos(b) + cos(a)sin(b)
> sin(a - b) = sin(a)cos(b) - cos(a)sin(b)
> cos(a + b) = cos(a)cos(b) - sin(a)sin(b)
> cos(a - b) = cos(a)cos(b) + sin(a)sin(b)

---

**FORMULES DE L'ANGLE DOUBLE** (a = b dans les formules ci-dessus)

> sin(2a) = 2sin(a)cos(a)
> cos(2a) = cos²(a) - sin²(a) = 2cos²(a) - 1 = 1 - 2sin²(a)
> tan(2a) = 2tan(a) / (1 - tan²(a))

---

**IDENTITÉS FONDAMENTALES**

> cos²(a) + sin²(a) = 1 ← la plus importante !
> 1 + tan²(a) = 1/cos²(a)

**Formes utiles :**
> cos²(a) = (1 + cos(2a)) / 2
> sin²(a) = (1 - cos(2a)) / 2

---

**RÉSOUDRE UNE ÉQUATION TRIGONOMÉTRIQUE**

**sin(x) = k** (avec -1 ≤ k ≤ 1) :
> Solutions : x = arcsin(k) + 2kπ  ou  x = π - arcsin(k) + 2kπ

**cos(x) = k** (avec -1 ≤ k ≤ 1) :
> Solutions : x = ±arccos(k) + 2kπ

**Exemple :** cos(x) = 1/2 sur [0 ; 2π]
arccos(1/2) = π/3
x = π/3 ou x = -π/3 + 2π = **5π/3**

**Exemple :** sin(x) = √3/2 sur [0 ; 2π]
arcsin(√3/2) = π/3
x = π/3 ou x = π - π/3 = **2π/3**

---

**CONVERSION DEGRÉS ↔ RADIANS**

> rad = degrés × π/180
> degrés = rad × 180/π

| Degrés | Radians |
|---|---|
| 30° | π/6 |
| 45° | π/4 |
| 60° | π/3 |
| 90° | π/2 |
| 180° | π |
| 360° | 2π |

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-second-degre-complet',
    title: "Équation du second degré — étude complète",
    category: 'mathematiques', level: 'intermediaire',
    triggers: ["second degre","deuxieme degre","ax2+bx+c","discriminant","delta","racines equation","forme factorisee","forme canonique","somme produit racines","signe trinome"],
    answer: `Excellente question ! ✨

📐 **ÉQUATION DU SECOND DEGRÉ ax² + bx + c = 0**

---

**LE DISCRIMINANT Δ (delta)**

> **Δ = b² - 4ac**

| Δ | Nombre de solutions | Racines |
|---|---|---|
| **Δ > 0** | 2 racines réelles distinctes | x₁ = (-b - √Δ)/2a et x₂ = (-b + √Δ)/2a |
| **Δ = 0** | 1 racine double | x₀ = -b/2a |
| **Δ < 0** | Pas de solution réelle | (racines complexes) |

---

**EXEMPLE COMPLET**

2x² - 5x + 3 = 0
- a = 2, b = -5, c = 3
- Δ = (-5)² - 4(2)(3) = 25 - 24 = **1 > 0**
- x₁ = (5 - 1) / 4 = **1**
- x₂ = (5 + 1) / 4 = **3/2**

---

**FORME FACTORISÉE** (si Δ ≥ 0)

> ax² + bx + c = **a(x - x₁)(x - x₂)**

Exemple : 2x² - 5x + 3 = **2(x - 1)(x - 3/2)**

---

**FORME CANONIQUE**

> ax² + bx + c = a(x + b/2a)² - Δ/4a

Exemple : 2x² - 5x + 3 = 2(x - 5/4)² - 1/8

---

**RELATIONS DE VIÈTE** (somme et produit des racines)

Si x₁ et x₂ sont les racines :
> **x₁ + x₂ = -b/a**
> **x₁ × x₂ = c/a**

Exemple : 2x² - 5x + 3 → x₁ + x₂ = 5/2 ✓ (1 + 3/2) | x₁ × x₂ = 3/2 ✓ (1 × 3/2)

---

**SIGNE DU TRINÔME ax² + bx + c**

- Si Δ < 0 : même signe que a pour tout x
- Si Δ ≥ 0 : signe de a entre les racines, signe opposé à a à l'extérieur

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-fonctions-references',
    title: 'Fonctions de référence — tableaux complets',
    category: 'mathematiques', level: 'intermediaire',
    triggers: ['fonctions references','fonction affine','fonction carre','fonction cube','fonction inverse','fonction racine','courbe representative','parabole','hyperbole','tableau valeurs fonctions'],
    answer: `Excellente question ! ✨

📐 **FONCTIONS DE RÉFÉRENCE**

---

**FONCTION AFFINE : f(x) = ax + b**

- Représentation : **droite**
- Pente a : si a > 0 croissante, a < 0 décroissante, a = 0 constante
- Ordonnée à l'origine : b (point (0, b))
- Zéro : x = -b/a

---

**FONCTION CARRÉ : f(x) = x²**

- Domaine : ℝ | Image : [0 ; +∞[
- Représentation : **parabole** tournée vers le haut, sommet en O(0,0)
- **Paire** : f(-x) = f(x) → symétrie / axe Oy
- Décroissante sur ]-∞ ; 0] | Croissante sur [0 ; +∞[
- Minimum : f(0) = 0

---

**FONCTION INVERSE : f(x) = 1/x**

- Domaine : ℝ* = ℝ \ {0}
- Représentation : **hyperbole** (2 branches)
- **Impaire** : f(-x) = -f(x)
- Décroissante sur ]-∞ ; 0[ et sur ]0 ; +∞[
- Asymptotes : x = 0 (verticale) et y = 0 (horizontale)

---

**FONCTION RACINE CARRÉE : f(x) = √x**

- Domaine : [0 ; +∞[
- Représentation : **demi-parabole** couchée
- Croissante sur [0 ; +∞[
- f\'(x) = 1/(2√x)

---

**FONCTION VALEUR ABSOLUE : f(x) = |x|**

- Domaine : ℝ | Image : [0 ; +∞[
- Représentation : **V** (angle en O)
- Paire, minimum en 0
- |x| = x si x ≥ 0 et |x| = -x si x < 0

---

**TABLEAU RÉCAPITULATIF**

| Fonction | Df | Sens variation | Forme |
|---|---|---|---|
| ax + b | ℝ | selon a | Droite |
| x² | ℝ | ↘ puis ↗ | Parabole |
| x³ | ℝ | ↗ | Cubique |
| 1/x | ℝ* | ↘ sur chaque intervalle | Hyperbole |
| √x | [0;+∞[ | ↗ | Demi-parabole |
| eˣ | ℝ | ↗ | Exponentielle |
| ln(x) | ]0;+∞[ | ↗ | Logarithmique |

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-probabilites-conditionnelles',
    title: 'Probabilités conditionnelles et indépendance',
    category: 'probabilites', level: 'avance',
    triggers: ['probabilite conditionnelle','probabilite sachant','P(A sachant B)','P(A|B)','independance','evenements independants','formule bayes','probabilite totale','arbre probabilites'],
    answer: `Excellente question ! ✨

📐 **PROBABILITÉS CONDITIONNELLES**

---

**DÉFINITION**

La probabilité de A sachant que B est réalisé :
> **P(A|B) = P(A ∩ B) / P(B)** (si P(B) > 0)

On peut aussi écrire : **P(A ∩ B) = P(B) × P(A|B)**

---

**FORMULE DES PROBABILITÉS TOTALES**

Si B₁, B₂, ..., Bₙ forment une partition de l'univers Ω :
> **P(A) = P(A|B₁)×P(B₁) + P(A|B₂)×P(B₂) + ... + P(A|Bₙ)×P(Bₙ)**

**Exemple (arbre) :** Une urne contient 4 rouges et 6 bleues.
On tire 2 boules sans remise.
- P(1ère rouge) = 4/10
- P(2ème rouge | 1ère rouge) = 3/9
- P(2 rouges) = 4/10 × 3/9 = **12/90 = 2/15**

---

**FORMULE DE BAYES**

> P(Bᵢ|A) = P(A|Bᵢ) × P(Bᵢ) / P(A)

**Exemple :** Test médical avec 2% de malades.
- Test positif si malade : P(+|M) = 0,98
- Test positif si sain : P(+|S) = 0,05
- P(M) = 0,02, P(S) = 0,98

P(M|+) = P(+|M)×P(M) / P(+)
P(+) = 0,98×0,02 + 0,05×0,98 = 0,0196 + 0,049 = 0,0686
P(M|+) = 0,0196 / 0,0686 ≈ **28,6%**

---

**ÉVÉNEMENTS INDÉPENDANTS**

A et B sont indépendants si et seulement si :
> **P(A ∩ B) = P(A) × P(B)**

Équivalent : P(A|B) = P(A) (B ne change pas la probabilité de A)

**Exemple :** Lancer deux dés. P(1er = 6 et 2ème = 6) = 1/6 × 1/6 = **1/36**
(Les lancers sont indépendants)

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-loi-binomiale',
    title: 'La loi binomiale B(n, p)',
    category: 'probabilites', level: 'avance',
    triggers: ['loi binomiale','binomiale','B(n,p)','P(X=k)','combinaison','coefficient binomial','esperance binomiale','variance binomiale','schema bernoulli','epreuve bernoulli'],
    answer: `Excellente question ! ✨

📐 **LA LOI BINOMIALE B(n, p)**

---

**CONTEXTE : Schéma de Bernoulli**

On répète n fois la **même épreuve indépendante** à 2 issues :
- "Succès" avec probabilité p
- "Échec" avec probabilité 1 - p = q

X = nombre de succès → X suit la loi **B(n, p)**

---

**FORMULE**

> **P(X = k) = C(n,k) × pᵏ × (1-p)^(n-k)**

où **C(n,k) = n! / (k! × (n-k)!)** = coefficient binomial "k parmi n"

**Exemples de C(n,k) :**
- C(5,0) = 1 | C(5,1) = 5 | C(5,2) = 10 | C(5,3) = 10 | C(5,4) = 5 | C(5,5) = 1

---

**EXEMPLE**

Un joueur marque un penalty avec p = 0,7. Il tire 5 penaltys.
X = nombre de penaltys marqués → X suit B(5, 0,7)

P(X = 3) = C(5,3) × 0,7³ × 0,3²
= 10 × 0,343 × 0,09 = **0,3087**

P(X ≥ 4) = P(X=4) + P(X=5)
= C(5,4)×0,7⁴×0,3 + C(5,5)×0,7⁵×0,3⁰
= 5×0,2401×0,3 + 1×0,16807
= 0,36015 + 0,16807 = **0,52822**

---

**ESPÉRANCE ET VARIANCE**

> **E(X) = n × p** (nombre moyen de succès)
> **V(X) = n × p × (1-p)**
> **σ = √V(X)** (écart-type)

Exemple : B(5, 0,7) → E(X) = **3,5** | V(X) = 5×0,7×0,3 = **1,05** | σ ≈ 1,02

---

**CONDITIONS D'UTILISATION :**
1. n épreuves identiques ✓
2. Épreuves indépendantes ✓
3. Même probabilité p à chaque épreuve ✓

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-suites-avancees',
    title: 'Suites — récurrence et convergence',
    category: 'mathematiques', level: 'avance',
    triggers: ['raisonnement par recurrence','recurrence','suite convergente','limite suite','suite monotone','suite bornee','suite croissante','suite decroissante','suite adjacentes','convergence suite'],
    answer: `Excellente question ! ✨

📐 **SUITES — RÉCURRENCE ET CONVERGENCE**

---

**RAISONNEMENT PAR RÉCURRENCE**

Pour démontrer qu'une propriété P(n) est vraie pour tout n ≥ n₀ :

**Étape 1 — Initialisation :** Vérifier P(n₀) est vraie.
**Étape 2 — Hérédité :** Supposer P(n) vraie (hypothèse de récurrence), puis montrer P(n+1) est vraie.
**Conclusion :** Par le principe de récurrence, P(n) est vraie pour tout n ≥ n₀.

**Exemple :** Montrer que Σₖ₌₁ⁿ k = n(n+1)/2
- n=1 : Σ = 1 = 1×2/2 ✓
- Si vrai au rang n : Σₖ₌₁ⁿ⁺¹ k = n(n+1)/2 + (n+1) = (n+1)(n+2)/2 ✓

---

**CONVERGENCE D'UNE SUITE**

Une suite (uₙ) **converge** vers L si lim uₙ = L (finie).
Si lim uₙ = ±∞ → **diverge**. Si pas de limite → **diverge** aussi.

**Suites monotones bornées :**
Toute suite croissante et majorée converge.
Toute suite décroissante et minorée converge.

---

**SUITES DÉFINIES PAR uₙ₊₁ = f(uₙ)**

1. Chercher le(s) point(s) fixe(s) : résoudre f(x) = x → solution(s) = limite possible
2. Étudier f et f'
3. Si |f'(l)| < 1 → la suite converge vers l

**Exemple :** uₙ₊₁ = (uₙ + 2)/2, u₀ = 0
Point fixe : x = (x+2)/2 → 2x = x + 2 → x = 2
f'(x) = 1/2 < 1 → converge vers **2**

---

**SUITES ARITHMÉTIQUES ET GÉOMÉTRIQUES RAPPEL**

Arithmétique : uₙ = u₁ + (n-1)r | Sₙ = n(u₁ + uₙ)/2
Géométrique : uₙ = u₁ × q^(n-1) | Sₙ = u₁(1 - qⁿ)/(1 - q) si q ≠ 1

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-calcul-vectoriel',
    title: 'Calcul vectoriel — produit scalaire',
    category: 'geometrie', level: 'avance',
    triggers: ['produit scalaire','vecteur produit scalaire','AB.CD','orthogonalite vecteurs','formule produit scalaire','cos angle vecteurs','norme vecteur avance','vecteurs perpendiculaires'],
    answer: `Excellente question ! ✨

📐 **LE PRODUIT SCALAIRE**

---

**DÉFINITION**

Pour deux vecteurs u⃗ et v⃗ :
> **u⃗ · v⃗ = ||u⃗|| × ||v⃗|| × cos(θ)**

où θ est l'angle entre les deux vecteurs.

---

**FORMULE EN COORDONNÉES**

Si u⃗(a ; b) et v⃗(c ; d) dans le plan :
> **u⃗ · v⃗ = ac + bd**

Si u⃗(a ; b ; c) et v⃗(d ; e ; f) dans l'espace :
> **u⃗ · v⃗ = ad + be + cf**

---

**PROPRIÉTÉS**

- Commutatif : u⃗ · v⃗ = v⃗ · u⃗
- **||u⃗||² = u⃗ · u⃗ = a² + b²**
- Bilinéaire : u⃗ · (v⃗ + w⃗) = u⃗ · v⃗ + u⃗ · w⃗

---

**ORTHOGONALITÉ**

u⃗ et v⃗ sont **orthogonaux** (perpendiculaires) si et seulement si :
> **u⃗ · v⃗ = 0**

**Exemple :** u⃗(3 ; -2) et v⃗(2 ; 3)
u⃗ · v⃗ = 3×2 + (-2)×3 = 6 - 6 = **0** → Orthogonaux ✓

---

**CALCULER UN ANGLE**

> cos(θ) = (u⃗ · v⃗) / (||u⃗|| × ||v⃗||)

**Exemple :** u⃗(1 ; 2) et v⃗(3 ; 1)
- u⃗ · v⃗ = 3 + 2 = 5
- ||u⃗|| = √5 | ||v⃗|| = √10
- cos(θ) = 5 / (√5 × √10) = 5/√50 = 1/√2
- **θ = 45°**

---

**IDENTITÉS REMARQUABLES VECTORIELLES**

> ||u⃗ + v⃗||² = ||u⃗||² + 2(u⃗ · v⃗) + ||v⃗||²
> ||u⃗ - v⃗||² = ||u⃗||² - 2(u⃗ · v⃗) + ||v⃗||²
> u⃗ · v⃗ = (1/4)(||u⃗ + v⃗||² - ||u⃗ - v⃗||²)

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-statistiques-avancees',
    title: 'Statistiques avancées — écart-type et régression',
    category: 'statistiques', level: 'avance',
    triggers: ['statistiques avancees','regression lineaire','correlation','coefficient correlation','droite de regression','moindres carres','covariance','nuage de points','ajustement lineaire'],
    answer: `Excellente question ! ✨

📊 **STATISTIQUES AVANCÉES — RÉGRESSION LINÉAIRE**

---

**RAPPELS FONDAMENTAUX**

**Moyenne :** x̄ = (1/n) × Σxᵢ
**Variance :** V(x) = (1/n) × Σ(xᵢ - x̄)² = (1/n)Σxᵢ² - x̄²
**Écart-type :** σₓ = √V(x)

---

**COVARIANCE** entre deux séries x et y :

> **Cov(x,y) = (1/n) × Σ(xᵢ - x̄)(yᵢ - ȳ) = (1/n)Σxᵢyᵢ - x̄×ȳ**

Si Cov > 0 → lien positif | Cov < 0 → lien négatif | Cov = 0 → pas de lien linéaire

---

**COEFFICIENT DE CORRÉLATION LINÉAIRE r**

> **r = Cov(x,y) / (σₓ × σᵧ)**

- r proche de 1 → forte corrélation positive
- r proche de -1 → forte corrélation négative
- r proche de 0 → pas de corrélation linéaire
- |r| > 0,9 → lien linéaire très fort

---

**DROITE DE RÉGRESSION DE y EN x** (méthode des moindres carrés)

> **y = ax + b** où :
> **a = Cov(x,y) / V(x)**
> **b = ȳ - a × x̄**

La droite passe toujours par le point moyen (x̄ ; ȳ).

**Exemple :**
Données : x = {1, 2, 3, 4, 5} | y = {2, 4, 5, 4, 5}
x̄ = 3, ȳ = 4
Σxᵢyᵢ = 2+8+15+16+25 = 66 → (1/n)Σxᵢyᵢ = 13,2
Cov = 13,2 - 3×4 = 1,2
V(x) = (1/5)(1+4+9+16+25) - 9 = 11 - 9 = 2
a = 1,2/2 = **0,6** | b = 4 - 0,6×3 = **2,2**
Droite : **y = 0,6x + 2,2**

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-complexes-intro',
    title: 'Les nombres complexes — introduction',
    category: 'mathematiques', level: 'avance',
    triggers: ['nombres complexes','complexes','imaginaire','i carre','partie reelle','partie imaginaire','module argument','forme algebrique','forme trigonometrique','z conjugue'],
    answer: `Excellente question ! ✨

📐 **LES NOMBRES COMPLEXES**

---

**DÉFINITION**

i est le nombre imaginaire tel que **i² = -1**.

Un nombre complexe z s'écrit : **z = a + bi**
- **a** = Re(z) = partie réelle
- **b** = Im(z) = partie imaginaire

**Exemples :** 3 + 2i | -1 - 5i | 4i (a=0) | 7 (b=0)

---

**CONJUGUÉ**

> z̄ = a - bi (on change le signe de la partie imaginaire)

**Propriétés :**
- z + z̄ = 2a (réel)
- z × z̄ = a² + b² (réel positif)

---

**OPÉRATIONS**

**Addition :** (a + bi) + (c + di) = (a+c) + (b+d)i

**Multiplication :**
(a + bi)(c + di) = ac + adi + bci + bdi²
= **(ac - bd) + (ad + bc)i**

**Division :** Multiplier par le conjugué du dénominateur.
> (2 + 3i)/(1 - i) = (2+3i)(1+i)/((1-i)(1+i)) = (2+2i+3i+3i²)/(1+1)
> = (-1 + 5i)/2 = **-1/2 + 5i/2**

---

**MODULE**

> **|z| = √(a² + b²)** (= distance de z à l'origine dans le plan complexe)

**Propriété :** |z₁ × z₂| = |z₁| × |z₂|

---

**FORME TRIGONOMÉTRIQUE / EXPONENTIELLE**

> z = r(cos θ + i sin θ) = r × e^(iθ)

où r = |z| et θ = arg(z) = argument

**Formule d'Euler :** e^(iπ) + 1 = 0 (la plus belle formule des maths !)

Continue comme ça ! 💪`,
  },
  {
    slug: 'math-geometrie-espace',
    title: 'Géométrie dans l\'espace — droites et plans',
    category: 'geometrie', level: 'avance',
    triggers: ['geometrie espace','droite espace','plan espace','vecteur normal','equation plan','droite perpendiculaire plan','parallelisme espace','intersection plan droite','repere 3d','coordonnees 3d'],
    answer: `Excellente question ! ✨

📐 **GÉOMÉTRIE DANS L'ESPACE**

---

**LE REPÈRE 3D**

Un point M a trois coordonnées (x ; y ; z) dans un repère orthonormé (O ; i⃗, j⃗, k⃗).

**Vecteur dans l'espace** : AB⃗(xB-xA ; yB-yA ; zB-zA)
**Norme** : ||AB⃗|| = √[(xB-xA)² + (yB-yA)² + (zB-zA)²]

---

**L'ÉQUATION D'UN PLAN**

Tout plan d'équation **ax + by + cz + d = 0** admet pour **vecteur normal** n⃗(a ; b ; c).

**Trouver l'équation d'un plan :**
1. Connaître le vecteur normal n⃗(a ; b ; c)
2. Connaître un point A(x₀ ; y₀ ; z₀) du plan
3. ax + by + cz = ax₀ + by₀ + cz₀

**Exemple :** Plan passant par A(1 ; 2 ; 3) de vecteur normal n⃗(2 ; -1 ; 1)
2x - y + z = 2×1 - 1×2 + 1×3 = 3
**Équation : 2x - y + z = 3**

---

**POSITIONS RELATIVES**

**Deux droites dans l'espace :**
- **Sécantes** : se coupent en un point
- **Parallèles** : même direction, ne se coupent pas
- **Gauches** : pas parallèles et ne se coupent pas (spécifique à l'espace)

**Droite perpendiculaire à un plan :**
La droite de vecteur directeur u⃗ est ⊥ au plan de vecteur normal n⃗ si et seulement si **u⃗ ∥ n⃗** (colinéaires).

---

**DISTANCE D'UN POINT À UN PLAN**

Distance du point M(x₀ ; y₀ ; z₀) au plan ax + by + cz + d = 0 :
> d = |ax₀ + by₀ + cz₀ + d| / √(a² + b² + c²)

Continue comme ça ! 💪`,
  },
];
