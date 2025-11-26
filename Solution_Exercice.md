# Solution de l'exercice - Équation quadratique

## Équation donnée
**2x² + 7x + 5 = 0**

X1 et X2 sont les racines de cette équation.

---

## ÉTAPE 1: Identification des coefficients

Pour une équation quadratique de la forme **ax² + bx + c = 0** :

- **a = 2** (coefficient de x²)
- **b = 7** (coefficient de x)
- **c = 5** (terme constant)

---

## ÉTAPE 2: Relations de Viète (formules fondamentales)

Pour toute équation quadratique **ax² + bx + c = 0** avec racines X1 et X2, on a :

- **Somme des racines**: X1 + X2 = **-b/a**
- **Produit des racines**: X1 × X2 = **c/a**

⚠️ **IMPORTANT**: Ces formules sont vraies **SANS avoir besoin de calculer X1 et X2 explicitement** ! C'est la beauté des relations de Viète.

---

## RÉSOLUTION DE CHAQUE QUESTION

### a) X1 + X2

**Formule utilisée**: X1 + X2 = -b/a

**Calcul**:
```
X1 + X2 = -b/a
        = -7/2
        = -3.5
```

**RÉSULTAT**: **X1 + X2 = -7/2 = -3.5**

---

### b) X1 × X2

**Formule utilisée**: X1 × X2 = c/a

**Calcul**:
```
X1 × X2 = c/a
        = 5/2
        = 2.5
```

**RÉSULTAT**: **X1 × X2 = 5/2 = 2.5**

---

### c) 1/X1 + 1/X2

**Méthode**: On met au même dénominateur

**Explication étape par étape**:
```
1/X1 + 1/X2 = X2/(X1×X2) + X1/(X1×X2)
            = (X1 + X2)/(X1 × X2)
```

On utilise les résultats précédents :
- X1 + X2 = -7/2
- X1 × X2 = 5/2

**Calcul**:
```
1/X1 + 1/X2 = (X1 + X2)/(X1 × X2)
            = (-7/2)/(5/2)
            = (-7/2) × (2/5)
            = -7/5
            = -1.4
```

**RÉSULTAT**: **1/X1 + 1/X2 = -7/5 = -1.4**

---

### d) X1² + X2²

**Méthode**: Utilisation d'une identité remarquable

**Explication étape par étape**:

On sait que : **(X1 + X2)² = X1² + 2X1X2 + X2²**

En réorganisant cette égalité :
```
X1² + X2² = (X1 + X2)² - 2X1X2
```

On utilise les résultats précédents :
- X1 + X2 = -7/2
- X1 × X2 = 5/2

**Calcul**:
```
X1² + X2² = (X1 + X2)² - 2(X1 × X2)
          = (-7/2)² - 2(5/2)
          = 49/4 - 10/2
          = 49/4 - 20/4
          = 29/4
          = 7.25
```

**RÉSULTAT**: **X1² + X2² = 29/4 = 7.25**

---

### e) 1/X1² + 1/X2²

**Méthode**: Mise au même dénominateur

**Explication étape par étape**:
```
1/X1² + 1/X2² = X2²/(X1²×X2²) + X1²/(X1²×X2²)
              = (X1² + X2²)/(X1² × X2²)
```

Mais **X1² × X2² = (X1 × X2)²**

Donc :
```
1/X1² + 1/X2² = (X1² + X2²)/(X1 × X2)²
```

On utilise les résultats précédents :
- X1² + X2² = 29/4
- X1 × X2 = 5/2
- (X1 × X2)² = (5/2)² = 25/4

**Calcul**:
```
1/X1² + 1/X2² = (29/4)/(25/4)
              = (29/4) × (4/25)
              = 29/25
              = 1.16
```

**RÉSULTAT**: **1/X1² + 1/X2² = 29/25 = 1.16**

---

### f) (X1 - X2)²

**Méthode**: Développement d'une identité remarquable

**Explication étape par étape**:

On développe : **(X1 - X2)² = X1² - 2X1X2 + X2²**

En réorganisant :
```
(X1 - X2)² = X1² + X2² - 2X1X2
```

On utilise les résultats précédents :
- X1² + X2² = 29/4
- X1 × X2 = 5/2

**Calcul**:
```
(X1 - X2)² = X1² + X2² - 2(X1 × X2)
           = 29/4 - 2(5/2)
           = 29/4 - 10/2
           = 29/4 - 20/4
           = 9/4
           = 2.25
```

**RÉSULTAT**: **(X1 - X2)² = 9/4 = 2.25**

---

## VÉRIFICATION (optionnelle)

Pour vérifier nos résultats, calculons explicitement X1 et X2 avec la formule quadratique :

**Formule quadratique**: x = (-b ± √(b² - 4ac)) / (2a)

**Calcul du discriminant**:
```
Δ = b² - 4ac
  = 7² - 4(2)(5)
  = 49 - 40
  = 9
```

**Calcul des racines**:
```
X1 = (-7 + √9) / (2×2) = (-7 + 3)/4 = -4/4 = -1
X2 = (-7 - √9) / (2×2) = (-7 - 3)/4 = -10/4 = -5/2 = -2.5
```

**Vérification**:
- X1 + X2 = -1 + (-2.5) = -3.5 ✓ (correspond à -7/2)
- X1 × X2 = (-1) × (-2.5) = 2.5 ✓ (correspond à 5/2)

Tous nos résultats sont corrects !

---

## RÉSUMÉ DES RÉSULTATS

| Question | Expression | Résultat |
|----------|------------|----------|
| **a)** | X1 + X2 | **-7/2 = -3.5** |
| **b)** | X1 × X2 | **5/2 = 2.5** |
| **c)** | 1/X1 + 1/X2 | **-7/5 = -1.4** |
| **d)** | X1² + X2² | **29/4 = 7.25** |
| **e)** | 1/X1² + 1/X2² | **29/25 = 1.16** |
| **f)** | (X1 - X2)² | **9/4 = 2.25** |

---

## POINTS CLÉS À RETENIR

1. **Relations de Viète** : Pour ax² + bx + c = 0
   - X1 + X2 = -b/a
   - X1 × X2 = c/a

2. **Identités utiles** :
   - X1² + X2² = (X1 + X2)² - 2X1X2
   - (X1 - X2)² = X1² + X2² - 2X1X2

3. **Fractions** : Pour 1/X1 + 1/X2, mettre au même dénominateur donne (X1 + X2)/(X1 × X2)

4. **Pas besoin de calculer les racines** : On peut résoudre toutes ces questions en utilisant uniquement les relations de Viète !

