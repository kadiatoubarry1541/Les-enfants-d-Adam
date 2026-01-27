# Base de données complète de cours de français professionnels
# Organisée par niveaux : DÉBUTANT, INTERMÉDIAIRE, AVANCÉ

COURS_FRANCAIS = {
    "niveau_debutant": {
        "alphabet": {
            "titre": "L'Alphabet Français",
            "contenu": """L'alphabet français compte 26 lettres : A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z.

**Les accents en français :**
- é (accent aigu) : café, été, éléphant
- è (accent grave) : père, mère, frère
- ê (accent circonflexe) : fête, tête, bête
- à (accent grave) : là, voilà
- ù (accent grave) : où
- ç (cédille) : français, garçon, leçon

**Prononciation de base :**
Chaque lettre a un nom et un son. Exemple : A se prononce "a" comme dans "ami".""",
            "exemples": ["A comme ami", "B comme bonjour", "C comme chat", "É comme été"]
        },
        
        "articles": {
            "titre": "Les Articles (Le, La, Les, Un, Une, Des)",
            "contenu": """Les articles sont des petits mots qui précèdent les noms.

**Articles définis (on sait de quoi on parle) :**
- Le (masculin singulier) : le chat, le livre
- La (féminin singulier) : la table, la maison
- Les (pluriel) : les chats, les tables

**Articles indéfinis (on ne sait pas précisément) :**
- Un (masculin singulier) : un chat, un livre
- Une (féminin singulier) : une table, une maison
- Des (pluriel) : des chats, des tables

**Règle importante :**
Le genre (masculin/féminin) est souvent arbitraire en français. Il faut l'apprendre avec chaque mot.""",
            "exemples": ["Le chat (masculin)", "La table (féminin)", "Un livre (masculin)", "Une pomme (féminin)"]
        },
        
        "pronoms": {
            "titre": "Les Pronoms Personnels (Je, Tu, Il, Elle, Nous, Vous, Ils, Elles)",
            "contenu": """Les pronoms remplacent les noms pour éviter les répétitions.

**Pronoms sujets :**
- Je (moi) : Je mange
- Tu (toi) : Tu manges
- Il (lui, masculin) : Il mange
- Elle (elle, féminin) : Elle mange
- Nous (nous) : Nous mangeons
- Vous (vous) : Vous mangez
- Ils (eux, masculin ou mixte) : Ils mangent
- Elles (elles, féminin uniquement) : Elles mangent

**Utilisation :**
Les pronoms indiquent QUI fait l'action.""",
            "exemples": ["Je suis content", "Tu es gentil", "Il est grand", "Elle est belle"]
        },
        
        "verbes_etre_avoir": {
            "titre": "Les Verbes Être et Avoir (Les Plus Importants)",
            "contenu": """ÊTRE et AVOIR sont les deux verbes les plus importants en français.

**ÊTRE (to be) - Présent :**
- Je suis
- Tu es
- Il/Elle est
- Nous sommes
- Vous êtes
- Ils/Elles sont

**AVOIR (to have) - Présent :**
- J'ai
- Tu as
- Il/Elle a
- Nous avons
- Vous avez
- Ils/Elles ont

**Utilisation :**
- ÊTRE : état, identité (Je suis étudiant, Il est grand)
- AVOIR : possession (J'ai un livre, Tu as une voiture)""",
            "exemples": ["Je suis content", "Tu es professeur", "J'ai un chat", "Il a une voiture"]
        },
        
        "phrases_simples": {
            "titre": "Construire des Phrases Simples",
            "contenu": """Une phrase simple = Sujet + Verbe + Complément

**Structure de base :**
1. Le sujet (qui fait l'action) : Je, Tu, Il, Le chat...
2. Le verbe (l'action) : mange, va, est...
3. Le complément (ce qui complète) : une pomme, à l'école, content...

**Exemples :**
- Je mange une pomme (Sujet + Verbe + Complément)
- Le chat est noir (Sujet + Verbe + Attribut)
- Tu vas à l'école (Sujet + Verbe + Complément de lieu)""",
            "exemples": ["Je mange", "Tu es content", "Il va à l'école", "Nous sommes étudiants"]
        }
    },
    
    "niveau_intermediaire": {
        "conjugaison_present": {
            "titre": "La Conjugaison au Présent",
            "contenu": """Le présent indique une action qui se passe maintenant.

**Groupes de verbes :**

**1er groupe (-er) :**
- Parler : je parle, tu parles, il parle, nous parlons, vous parlez, ils parlent
- Manger : je mange, tu manges, il mange, nous mangeons, vous mangez, ils mangent

**2ème groupe (-ir) :**
- Finir : je finis, tu finis, il finit, nous finissons, vous finissez, ils finissent

**3ème groupe (-re, -oir, -ir irréguliers) :**
- Prendre : je prends, tu prends, il prend, nous prenons, vous prenez, ils prennent
- Voir : je vois, tu vois, il voit, nous voyons, vous voyez, ils voient

**Règles importantes :**
- Les terminaisons changent selon la personne
- Certains verbes sont irréguliers (être, avoir, faire, aller...)""",
            "exemples": ["Je parle français", "Tu finis tes devoirs", "Il prend le bus", "Nous voyons un film"]
        },
        
        "genres_et_accords": {
            "titre": "Les Genres (Masculin/Féminin) et les Accords",
            "contenu": """En français, les noms ont un genre : masculin ou féminin.

**Règles de base :**
- Le masculin : le chat, un livre, un garçon
- Le féminin : la table, une pomme, une fille

**Accord des adjectifs :**
L'adjectif s'accorde avec le nom qu'il qualifie.
- Un chat noir (masculin)
- Une table noire (féminin)
- Des chats noirs (masculin pluriel)
- Des tables noires (féminin pluriel)

**Accord des verbes :**
Le verbe s'accorde avec son sujet.
- Le chat mange (singulier)
- Les chats mangent (pluriel)""",
            "exemples": ["Un grand homme", "Une grande femme", "Les grands hommes", "Les grandes femmes"]
        },
        
        "pluriel": {
            "titre": "Le Pluriel des Noms",
            "contenu": """Le pluriel indique plusieurs choses.

**Règles générales :**
- Singulier → Pluriel : + S
  - Un chat → Des chats
  - Une table → Des tables

**Exceptions importantes :**
- Mots en -al → -aux : un cheval → des chevaux
- Mots en -eau → -eaux : un château → des châteaux
- Mots en -eu → -eux : un feu → des feux
- Mots en -ou → -oux : un bijou → des bijoux
- Mots invariables : un enfant → des enfants (pas de changement)

**Attention :**
Certains mots ne changent pas : un souris → des souris""",
            "exemples": ["Un chat → Des chats", "Un cheval → Des chevaux", "Un château → Des châteaux"]
        },
        
        "temps_passes": {
            "titre": "Les Temps du Passé (Passé Composé et Imparfait)",
            "contenu": """Il existe plusieurs façons de parler du passé.

**PASSÉ COMPOSÉ (action terminée) :**
Formation : AVOIR ou ÊTRE + participe passé
- J'ai mangé (action terminée)
- Je suis allé (action terminée)

**IMPARFAIT (action en cours dans le passé) :**
Formation : radical + terminaisons -ais, -ais, -ait, -ions, -iez, -aient
- Je mangeais (action en cours)
- Il était content (état dans le passé)

**Quand utiliser quoi ?**
- Passé composé : action précise, terminée (Hier, j'ai mangé)
- Imparfait : description, habitude (Quand j'étais enfant, je jouais)""",
            "exemples": ["J'ai mangé hier", "Je mangeais souvent", "Il était content", "Nous avons parlé"]
        },
        
        "adjectifs": {
            "titre": "Les Adjectifs Qualificatifs",
            "contenu": """Les adjectifs décrivent les noms.

**Place de l'adjectif :**
- Avant le nom (petit, grand, beau, bon, mauvais, jeune, vieux...) : un petit chat
- Après le nom (la plupart) : une table noire, un livre intéressant

**Accord :**
L'adjectif s'accorde en genre et en nombre avec le nom.
- Un chat noir → Des chats noirs
- Une table noire → Des tables noires

**Degrés de comparaison :**
- Comparatif : plus grand que, moins grand que, aussi grand que
- Superlatif : le plus grand, le moins grand""",
            "exemples": ["Un grand homme", "Une belle femme", "Plus grand que", "Le plus grand"]
        }
    },
    
    "niveau_avance": {
        "subjonctif": {
            "titre": "Le Subjonctif (Mode et Temps)",
            "contenu": """Le subjonctif exprime le doute, le souhait, l'émotion, l'obligation.

**Formation :**
Radical du présent + terminaisons : -e, -es, -e, -ions, -iez, -ent
- Que je parle, que tu parles, qu'il parle, que nous parlions, que vous parliez, qu'ils parlent

**Utilisation :**
Après certaines expressions :
- Il faut que tu viennes (obligation)
- Je veux que tu sois là (souhait)
- Je doute qu'il vienne (doute)
- Je suis content que tu sois là (émotion)

**Verbes irréguliers au subjonctif :**
- Être : que je sois, que tu sois, qu'il soit...
- Avoir : que j'aie, que tu aies, qu'il ait...
- Faire : que je fasse, que tu fasses, qu'il fasse...""",
            "exemples": ["Il faut que je parte", "Je veux que tu viennes", "Je doute qu'il soit là"]
        },
        
        "conditionnel": {
            "titre": "Le Conditionnel (Temps et Mode)",
            "contenu": """Le conditionnel exprime une action qui dépend d'une condition.

**Formation :**
Radical du futur + terminaisons de l'imparfait : -ais, -ais, -ait, -ions, -iez, -aient
- Je parlerais, tu parlerais, il parlerait, nous parlerions, vous parleriez, ils parleraient

**Utilisations :**
1. **Politesse :** Je voudrais un café (au lieu de "je veux")
2. **Hypothèse :** Si j'avais de l'argent, j'achèterais une voiture
3. **Information incertaine :** Il serait parti (on n'est pas sûr)

**Si + imparfait → conditionnel présent :**
- Si j'étais riche, je voyagerais""",
            "exemples": ["Je voudrais un café", "Si j'avais le temps, je viendrais", "Il serait parti"]
        },
        
        "analyse_logique": {
            "titre": "L'Analyse Logique de la Phrase",
            "contenu": """L'analyse logique étudie la fonction des mots dans la phrase.

**Les fonctions essentielles :**

**1. Le Sujet :**
- Qui fait l'action ? Le chat mange (sujet : le chat)

**2. Le Verbe :**
- L'action ou l'état : Le chat mange (verbe : mange)

**3. Les Compléments :**
- **COD (Complément d'Objet Direct)** : répond à "quoi ?" ou "qui ?"
  - Je mange une pomme (COD : une pomme)
  
- **COI (Complément d'Objet Indirect)** : répond à "à qui ?", "à quoi ?", "de qui ?", "de quoi ?"
  - Je parle à mon ami (COI : à mon ami)
  
- **CC (Complément Circonstanciel)** : répond à "où ?", "quand ?", "comment ?", "pourquoi ?"
  - Je vais à l'école (CC de lieu : à l'école)
  - Je viens demain (CC de temps : demain)

**4. L'Attribut du Sujet :**
- Qualifie le sujet avec le verbe "être" : Il est content (attribut : content)""",
            "exemples": [
                "Je mange une pomme (COD)",
                "Je parle à mon ami (COI)",
                "Je vais à l'école (CC de lieu)",
                "Il est content (Attribut)"
            ]
        },
        
        "orthographe_avancee": {
            "titre": "Orthographe Avancée et Règles Complexes",
            "contenu": """**Règles d'orthographe avancées :**

**1. Accord du participe passé :**
- Avec AVOIR : pas d'accord sauf si COD avant (Les pommes que j'ai mangées)
- Avec ÊTRE : accord avec le sujet (Elle est partie, Ils sont partis)

**2. Homophones (mots qui se prononcent pareil) :**
- a/à : Il a (verbe) / Il va à l'école (préposition)
- et/est : Le chat et le chien / Il est content
- son/sont : Son chat (possessif) / Ils sont là (verbe)
- ces/ses : Ces chats (démonstratif) / Ses chats (possessif)

**3. Doubles consonnes :**
- Après une voyelle courte : appeler, arriver, occuper
- Règles spécifiques : -ss- (passer), -ll- (aller), -tt- (mettre)

**4. Accents et cédille :**
- É (accent aigu) : été, café
- È (accent grave) : père, mère
- Ê (circonflexe) : fête, tête
- Ç (cédille) : français, garçon""",
            "exemples": [
                "J'ai mangé (pas d'accord)", "Les pommes que j'ai mangées (accord)",
                "Il a / Il va à", "Ces chats / Ses chats"
            ]
        },
        
        "syntaxe_complexe": {
            "titre": "Syntaxe Complexe et Subordination",
            "contenu": """**Phrases complexes :**

**1. Coordination :**
Liaison de deux phrases indépendantes avec : et, ou, mais, donc, car, ni
- Je mange et je bois (deux actions)

**2. Subordination :**
Une phrase dépend d'une autre.

**Types de subordonnées :**
- **Relative (qui, que, dont, où)** : Le livre que je lis
- **Complétive (que + indicatif/subjonctif)** : Je pense qu'il vient
- **Circonstancielle :**
  - Temporelle (quand, pendant que) : Quand je viens, il part
  - Causale (parce que, puisque) : Je reste parce qu'il pleut
  - Conditionnelle (si) : Si tu viens, je serai content
  - Concessive (bien que, quoique) : Bien qu'il pleuve, je sors

**Ordre des mots :**
En français, l'ordre est généralement : Sujet + Verbe + Compléments""",
            "exemples": [
                "Le livre que je lis (relative)",
                "Je pense qu'il vient (complétive)",
                "Quand je viens, il part (temporelle)",
                "Si tu viens, je serai content (conditionnelle)"
            ]
        },
        
        "conjugaison_avancee": {
            "titre": "Conjugaison Avancée (Tous les Temps)",
            "contenu": """**Tous les temps et modes en français :**

**INDICATIF :**
- Présent : Je mange
- Passé composé : J'ai mangé
- Imparfait : Je mangeais
- Plus-que-parfait : J'avais mangé
- Passé simple : Je mangeai (littéraire)
- Futur simple : Je mangerai
- Futur antérieur : J'aurai mangé

**CONDITIONNEL :**
- Conditionnel présent : Je mangerais
- Conditionnel passé : J'aurais mangé

**SUBJONCTIF :**
- Subjonctif présent : Que je mange
- Subjonctif passé : Que j'aie mangé
- Subjonctif imparfait : Que je mangeasse (littéraire)
- Subjonctif plus-que-parfait : Que j'eusse mangé (littéraire)

**IMPÉRATIF :**
- Présent : Mange ! (tu), Mangeons ! (nous), Mangez ! (vous)

**PARTICIPE :**
- Présent : Mangeant
- Passé : Mangé""",
            "exemples": [
                "Je mange (présent)",
                "J'ai mangé (passé composé)",
                "Je mangerai (futur)",
                "Je mangerais (conditionnel)",
                "Que je mange (subjonctif)"
            ]
        }
    }
}

# Fonction pour obtenir un cours par niveau et sujet
def obtenir_cours(niveau, sujet):
    """Retourne le cours correspondant au niveau et au sujet"""
    if niveau in COURS_FRANCAIS and sujet in COURS_FRANCAIS[niveau]:
        return COURS_FRANCAIS[niveau][sujet]
    return None

# Fonction pour lister tous les cours d'un niveau
def lister_cours_niveau(niveau):
    """Retourne la liste de tous les cours d'un niveau"""
    if niveau in COURS_FRANCAIS:
        return list(COURS_FRANCAIS[niveau].keys())
    return []

# Fonction pour rechercher un cours par mot-clé
def rechercher_cours(mot_cle):
    """Recherche un cours contenant le mot-clé"""
    resultats = []
    mot_cle_lower = mot_cle.lower()
    
    for niveau, cours in COURS_FRANCAIS.items():
        for sujet, contenu in cours.items():
            if (mot_cle_lower in sujet.lower() or 
                mot_cle_lower in contenu["titre"].lower() or
                mot_cle_lower in contenu["contenu"].lower()):
                resultats.append({
                    "niveau": niveau,
                    "sujet": sujet,
                    "cours": contenu
                })
    
    return resultats
