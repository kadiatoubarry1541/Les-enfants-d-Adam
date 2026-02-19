from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import openai
import requests
import uuid
from datetime import datetime
import re

# psycopg2 optionnel - l'IA fonctionne sans base de données
try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    PSYCOPG2_OK = True
except ImportError:
    PSYCOPG2_OK = False

# Charger les variables d'environnement
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration de l'API
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
HUGGINGFACE_API_KEY = os.getenv('HUGGINGFACE_API_KEY')
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/IAscience')
DIANGOU_API_URL = os.getenv('DIANGOU_API_URL', 'http://localhost:5002/api')

def get_response_from_diangou(message: str):
    """Interroge le backend Diangou pour récupérer une réponse stockée en base.
    
    Si aucune réponse n'est trouvée ou en cas d'erreur, retourne None
    pour permettre au mode démo de continuer à fonctionner normalement.
    """
    if not message:
        return None

    try:
        base_url = (DIANGOU_API_URL or '').rstrip('/')
        if not base_url:
            return None

        url = f"{base_url}/ia/search"
        resp = requests.post(
            url,
            json={'question': message},
            timeout=5
        )

        if resp.status_code != 200:
            return None

        data = resp.json()
        if data.get('success') and data.get('answer'):
            return data['answer']

        return None
    except Exception as e:
        print(f"[IA SC] Erreur lors de l'appel au backend Diangou pour la connaissance IA: {e}")
        return None

def log_conversation_to_diangou(session_id: str, message: str, response: str):
    """Envoie le couple question/réponse au backend Diangou pour archivage."""
    try:
        base_url = (DIANGOU_API_URL or '').rstrip('/')
        if not base_url:
            return

        url = f"{base_url}/ia/log"
        payload = {
            'sessionId': session_id,
            'question': message,
            'response': response,
            'source': 'professeur_ia'
        }
        # On ne bloque jamais la réponse de l'IA sur un problème de log
        requests.post(url, json=payload, timeout=3)
    except Exception as e:
        print(f"[IA SC] Erreur lors de l'enregistrement de la conversation dans Diangou: {e}")

# Fonction pour se connecter à la base de données
def get_db_connection():
    """Crée une connexion à la base de données PostgreSQL"""
    if not PSYCOPG2_OK:
        return None
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"Erreur de connexion à la base de données: {e}")
        return None

# Initialiser le client OpenAI si la clé est disponible
openai_client = None
if OPENAI_API_KEY:
    try:
        openai_client = openai.OpenAI(api_key=OPENAI_API_KEY)
    except:
        # Fallback pour ancienne version de la bibliothèque
        openai.api_key = OPENAI_API_KEY

# Prompt système — Professeur Expert FRANÇAIS et MATHÉMATIQUES — Niveau STPL
PROFESSEUR_PROMPT = """Tu es un professeur EXPERT en FRANÇAIS et en MATHÉMATIQUES, spécialisé dans le programme officiel du lycée de la SECONDE jusqu'en TERMINALE STPL (Sciences et Technologies du Produit et du Laboratoire). Tu as un niveau d'excellence absolue (100%) dans ces deux matières et tu prépares les élèves au baccalauréat STPL.

🔴 RÈGLES FONDAMENTALES :
- Tu réponds UNIQUEMENT en français. Toutes tes réponses sont en français.
- Tu enseignes UNIQUEMENT le FRANÇAIS et les MATHÉMATIQUES.
- Tu couvres TOUS les niveaux : Seconde, Première STPL, Terminale STPL.
- Si la question porte sur une autre matière, dis : "Je suis spécialisé en français et mathématiques du niveau Seconde à Terminale STPL."

📐 MATHÉMATIQUES STPL — CE QUE TU MAÎTRISES À 100% :

Seconde : nombres (ℕ, ℤ, ℚ, ℝ), puissances, racines ; équations 1er/2nd degré, systèmes ; fonctions de référence (affine, carré, inverse, racine) ; vecteurs, géométrie analytique ; statistiques (moyenne, médiane, quartiles, variance, écart-type) ; probabilités de base.

Première STPL : dérivées (règles : somme, produit, quotient, composée) ; tableaux de variations, extrema, tangente ; suites arithmétiques et géométriques ; trigonométrie (sin, cos, tan, valeurs remarquables, radians) ; exponentielle eˣ et logarithme ln(x) ; loi binomiale B(n,p) : formule, E(X), V(X).

Terminale STPL : calcul intégral (primitives, intégrales définies, valeur moyenne, aires) ; équations différentielles y' = ay et y' = ay + b ; loi normale N(μ, σ) : standardisation, table, intervalle de confiance ; matrices (opérations, déterminant, inverse, résolution de systèmes AX = B) ; logarithmes et exponentielles approfondis.

📚 FRANÇAIS LYCÉE — CE QUE TU MAÎTRISES À 100% :

Langue : conjugaison complète (tous temps/modes), accord du participe passé (avec être, avec avoir selon le COD), verbes pronominaux, orthographe avancée (homophones, pièges), registres de langue.

Analyse littéraire : figures de style (métaphore, comparaison, hyperbole, anaphore, antithèse, oxymore, litote, euphémisme, personnification, allégorie, gradation, chiasme, allitération, assonance) ; genres (roman, poésie, théâtre, essai) ; registres (lyrique, épique, tragique, comique, satirique) ; point de vue, focalisation, schéma narratif.

Mouvements littéraires : Humanisme (Rabelais, Montaigne) ; Baroque ; Classicisme (Molière, Racine, La Fontaine) ; Lumières (Voltaire, Rousseau, Diderot) ; Romantisme (Hugo, Lamartine) ; Réalisme (Balzac, Flaubert, Stendhal) ; Naturalisme (Zola) ; Symbolisme (Baudelaire, Verlaine, Rimbaud) ; Surréalisme (Breton, Aragon).

Méthodes EAF (Première) : commentaire composé (accroche + problématique + plan → procédés + citations + effets → conclusion) ; dissertation (analyse du sujet → problématique → plan dialectique thèse/antithèse/synthèse) ; analyse linéaire (mouvements + procédés + effets + sens).

Terminale : Grand Oral (structure, conseils, exemples de questions STPL) ; argumentation avancée (types d'arguments, connecteurs logiques, réfutation).

🎯 MÉTHODE PÉDAGOGIQUE :
1. Identifier le niveau (Seconde / Première / Terminale STPL)
2. Définir clairement le concept demandé
3. Expliquer la règle ou la méthode, avec formules si nécessaire
4. Donner 1 ou 2 exemples concrets et bien choisis
5. Signaler les erreurs fréquentes et les pièges
6. Encourager l'élève

📝 FORMAT :
- Titres en gras (**Titre**)
- Tableaux pour formules et conjugaisons
- Formules mathématiques clairement présentées
- Citations littéraires entre guillemets « »
- Sauts de ligne pour aérer

✅ RÈGLES D'OR :
✅ Réponds DIRECTEMENT et COMPLÈTEMENT
✅ Sois PRÉCIS et RIGOUREUX (formules mathématiques exactes, citations correctes)
✅ Adapte le niveau à l'élève (Seconde / Première / Terminale STPL)
✅ Montre TOUTES les étapes de calcul en maths
✅ Identifie les PROCÉDÉS STYLISTIQUES en français (ne pas paraphraser)
✅ Encourage avec bienveillance

❌ Ne dis JAMAIS "je ne peux pas répondre"
❌ Ne donne JAMAIS une liste de 20 exercices
❌ Ne paraphrase JAMAIS un texte littéraire sans analyser les procédés
❌ N'invente JAMAIS une formule mathématique incorrecte

Tu es un PROFESSEUR EXPERT, BIENVEILLANT et RIGOUREUX qui prépare les élèves au baccalauréat STPL avec excellence."""

def get_response_openai(message, conversation_history):
    """Utilise OpenAI pour générer une réponse"""
    try:
        messages = [
            {"role": "system", "content": PROFESSEUR_PROMPT}
        ]
        
        # Ajouter l'historique de conversation
        for hist in conversation_history[-5:]:  # Garder les 5 derniers échanges
            messages.append({"role": "user", "content": hist["question"]})
            messages.append({"role": "assistant", "content": hist["reponse"]})
        
        # Ajouter le message actuel
        messages.append({"role": "user", "content": message})
        
        # Utiliser la nouvelle API OpenAI si disponible
        if openai_client:
            response = openai_client.chat.completions.create(
                model="gpt-4o-mini",  # Modèle plus puissant pour le niveau STPL
                messages=messages,
                temperature=0.4,  # Bas pour précision et rigueur (maths et français)
                max_tokens=3000,  # Réponses détaillées pour enseigner à 100%
                frequency_penalty=0.3,
                presence_penalty=0.2
            )
            return response.choices[0].message.content.strip()
        else:
            # Fallback pour ancienne version
            response = openai.ChatCompletion.create(
                model="gpt-4o-mini",
                messages=messages,
                temperature=0.4,
                max_tokens=3000
            )
            return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Cher(e) élève, je rencontre un petit problème technique : {str(e)}. Peux-tu réessayer dans un instant ?"

def calculer_expression(expression):
    """Calcule une expression mathématique simple (+, -, *, /, parenthèses, nombres décimaux)."""
    try:
        # Nettoyer : symboles × ÷ et virgule, et "x" uniquement entre nombres (multiplication)
        expr = expression.replace('×', '*').replace('÷', '/').replace(',', '.')
        expr = re.sub(r'(\d)\s*x\s*(\d)', r'\1*\2', expr, flags=re.IGNORECASE)
        expr = ''.join(c for c in expr if c in '0123456789+-*/(). ')
        if not expr or not re.search(r'[+*/-]', expr) or not re.search(r'\d', expr):
            return None
        resultat = eval(expr, {"__builtins__": {}}, {})
        return resultat if isinstance(resultat, (int, float)) and not isinstance(resultat, bool) else None
    except Exception:
        return None


def reponse_calcul_if_any(message):
    """
    Si le message contient un calcul mathématique, retourne la réponse formatée.
    Sinon retourne None (pour laisser les autres handlers répondre).
    """
    if not message or not message.strip():
        return None
    # Détection : au moins un opérateur et des chiffres (avec x, ×, ÷ possibles)
    if not re.search(r'\d', message) or not any(op in message for op in ['+', '-', '*', '/', 'x', '×', '÷']):
        return None
    # Extraire une expression (chiffres, opérateurs, espaces, parenthèses, point)
    calcul_match = re.search(r'([0-9+\-*/().\sx×÷]+)', message)
    if not calcul_match:
        return None
    expression = calcul_match.group(1).strip()
    resultat = calculer_expression(expression)
    if resultat is None:
        return None
    return f"""Excellente question ! ✨

**Calcul :** {expression}

**Résultat :** {resultat}

**Explication :**
J'ai calculé l'expression mathématique que tu m'as donnée.

Continue comme ça ! 💪"""

def get_response_demo(message):
    """Mode démonstration : réponses pédagogiques basiques sans API - répond directement.
    
    Avant d'utiliser les règles codées en dur, on vérifie d'abord si une réponse
    existe dans la base de données Diangou (via le backend Node).
    """
    # 1) Essayer d'abord de répondre avec le contenu stocké dans la base Diangou
    db_answer = get_response_from_diangou(message)
    if db_answer:
        return db_answer

    # 2) Sinon, on applique les règles de démo intégrées en Python
    # (Les calculs sont déjà gérés en priorité dans la route /chat via reponse_calcul_if_any)
    message_lower = message.lower().strip()
    
    # Détection de questions sur saluer / politesse - RÉPONSE PÉDAGOGIQUE COMPLÈTE (AVANT les simples salutations)
    if any(mot in message_lower for mot in ['saluer', 'saluer les gens', 'comment saluer', 'apprendre à saluer', 'enseigner saluer', 'politesse']):
        return """Excellente question ! ✨

Saluer les gens, c'est dire bonjour de manière polie.

C'est très important pour être respectueux.

**Comment saluer en français :**

1. **Le matin** (avant midi) :
   - "Bonjour !" (formel et poli)
   - "Salut !" (familier, avec des amis)
   - "Bonjour, comment allez-vous ?" (très poli)

2. **L'après-midi** :
   - "Bonjour !" (jusqu'à environ 18h)
   - "Bonsoir !" (après 18h, le soir)

3. **Le soir / la nuit** :
   - "Bonsoir !" (le soir)
   - "Bonne nuit !" (quand on va dormir)

**Exemples concrets :**
- Au magasin : "Bonjour, je voudrais..." 
- Avec un ami : "Salut ! Ça va ?"
- Le soir : "Bonsoir, comment allez-vous ?"

**Les gestes :**
- Sourire en disant bonjour
- Regarder la personne dans les yeux
- Serrer la main ou faire la bise (en France)

En résumé : saluer, c'est dire bonjour poliment selon le moment de la journée.

Continue comme ça ! 💪"""
    
    # Réponses pédagogiques pour questions courantes - ENSEIGNEMENT ACTIF
    elif any(mot in message_lower for mot in ['bonjour', 'salut', 'hello', 'bonsoir']) and not any(mot in message_lower for mot in ['saluer', 'comment', 'apprendre', 'enseigner']):
        return """Bonjour mon cher(e) élève ! ✨

Je suis ravi(e) de te rencontrer !

Je suis ton professeur virtuel.

Je suis ici pour t'aider à apprendre.

**Comment ça fonctionne ?**

Tu peux me poser n'importe quelle question sur n'importe quel sujet.

Je vais :
- T'expliquer clairement et simplement
- Partir des bases pour être sûr(e) que tu comprends
- Te donner des exemples concrets de la vie quotidienne
- T'encourager à chaque étape

**Pour une expérience complète :**

Configure une clé API OpenAI dans le fichier .env.

Cela permet d'avoir des explications encore plus détaillées et personnalisées.

**Motivation** 💪

Chaque question que tu poses est un pas vers la connaissance !

N'hésite pas, pose-moi tes questions maintenant ! 📚"""
    
    elif any(mot in message_lower for mot in ['merci', 'à bientôt', 'au revoir']):
        return """De rien, cher(e) élève ! C'était un plaisir de t'aider. Continue comme ça, tu progresses bien ! À bientôt ! 👋"""
    
    # Détection de questions sur l'alphabet - RÉPONSE COMPLÈTE AVEC LES 26 LETTRES
    elif any(mot in message_lower for mot in ['alphabet', 'lettres', '26 lettres', 'cite les lettres', 'liste les lettres', 'lettres de l\'alphabet', 'abc']):
        return """Excellente question ! ✨

L'alphabet français a 26 lettres. Voici toutes les lettres :

**Les 26 lettres de l'alphabet français :**

A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z

**En détail :**
- **A** (a) - comme dans "ami"
- **B** (bé) - comme dans "bonjour"
- **C** (cé) - comme dans "chat"
- **D** (dé) - comme dans "dimanche"
- **E** (e) - comme dans "école"
- **F** (èf) - comme dans "fleur"
- **G** (gé) - comme dans "garçon"
- **H** (ache) - comme dans "hôtel"
- **I** (i) - comme dans "île"
- **J** (ji) - comme dans "jardin"
- **K** (ka) - comme dans "kilo"
- **L** (èl) - comme dans "lune"
- **M** (èm) - comme dans "maison"
- **N** (èn) - comme dans "nuit"
- **O** (o) - comme dans "orange"
- **P** (pé) - comme dans "pomme"
- **Q** (cu) - comme dans "question"
- **R** (èr) - comme dans "rouge"
- **S** (ès) - comme dans "soleil"
- **T** (té) - comme dans "table"
- **U** (u) - comme dans "univers"
- **V** (vé) - comme dans "voiture"
- **W** (double vé) - comme dans "wagon"
- **X** (iks) - comme dans "xylophone"
- **Y** (i grec) - comme dans "yoga"
- **Z** (zède) - comme dans "zèbre"

**Les accents en français :**
En plus des 26 lettres, le français utilise des accents :
- é (accent aigu) - comme dans "café"
- è (accent grave) - comme dans "père"
- ê (accent circonflexe) - comme dans "fête"
- ç (cédille) - comme dans "français"

En résumé : l'alphabet français a 26 lettres de A à Z, plus des accents spéciaux.

Continue comme ça ! 💪"""
    
    # Détection de questions sur le français - RÉPONSE SIMPLE ET PRÉCISE
    elif any(mot in message_lower for mot in ['français', 'francais', 'france', 'langue française', 'francais stpl', 'français stpl']):
        return """Excellente question ! ✨

Le français, c'est une langue. Une langue, c'est un moyen de communiquer avec des mots.

Le français utilise 26 lettres comme l'anglais, mais avec des accents spéciaux : é, è, ç.

Exemple : le mot 'café' a un accent é. Le mot 'français' a un ç.

En français, chaque mot a un genre : masculin ou féminin.
- "Le chat" (masculin)
- "La table" (féminin)

Les verbes changent selon qui parle :
- "Je mange" (moi)
- "Tu manges" (toi)

En résumé : le français est une langue avec des règles de grammaire, des genres et des accents.

Continue comme ça ! 💪"""
    
    # Détection de questions sur les BASES du français
    elif any(mot in message_lower for mot in ['base', 'bases', 'débutant', 'débutants', 'commencer', 'premier', 'première', 'par où commencer', 'comment commencer', 'enseigner la base', 'les bases']):
        return """Excellente question ! ✨

Oui, je suis prêt à enseigner les BASES du français ! Je commence toujours par les bases.

**LES BASES DU FRANÇAIS - Par où commencer :**

**1. L'ALPHABET (Première étape) :**
- Les 26 lettres : A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z
- Les accents : é, è, ê, à, ù, ç
- Comment prononcer chaque lettre

**2. LES MOTS DE BASE :**
- Les salutations : Bonjour, Bonsoir, Salut, Au revoir
- Les mots de politesse : Merci, S'il vous plaît, Pardon, Excusez-moi
- Les mots courants : Oui, Non, Bonjour, Merci

**3. LES ARTICLES (Très important) :**
- Le, La, Les (définis)
- Un, Une, Des (indéfinis)
- Quand utiliser chaque article

**4. LES PRONOMS (Pour parler) :**
- Je, Tu, Il, Elle, Nous, Vous, Ils, Elles
- Comment les utiliser

**5. LES VERBES DE BASE :**
- Être (je suis, tu es, il est...)
- Avoir (j'ai, tu as, il a...)
- Aller (je vais, tu vas...)
- Faire (je fais, tu fais...)

**6. LES PHRASES SIMPLES :**
- "Je suis..." (I am...)
- "J'ai..." (I have...)
- "Je vais..." (I go...)
- "Je fais..." (I do...)

**7. LE VOCABULAIRE DE BASE :**
- La famille : père, mère, frère, sœur
- Les nombres : un, deux, trois...
- Les couleurs : rouge, bleu, vert...
- Les jours : lundi, mardi, mercredi...

**8. LES EXPRESSIONS UTILES :**
- "Comment allez-vous ?" (How are you?)
- "Je m'appelle..." (My name is...)
- "Où est...?" (Where is...?)
- "Combien ça coûte ?" (How much does it cost?)

**COMMENT JE T'ENSEIGNE LES BASES :**
1. Je commence par le plus simple
2. J'explique chaque mot comme si tu ne le connaissais pas
3. Je donne des exemples concrets
4. Je t'encourage à chaque étape
5. Je réponds à toutes tes questions

**Pose-moi tes questions sur les bases :**
- "C'est quoi l'alphabet français ?"
- "Comment dire bonjour ?"
- "C'est quoi un article ?"
- "Comment utiliser je, tu, il ?"
- "Quels sont les verbes de base ?"
- "Comment faire une phrase simple ?"

Je suis là pour t'enseigner les bases du français du début à la fin ! Pose-moi tes questions maintenant ! 📚✨"""
    
    # Détection de questions sur la compétence en français
    elif any(mot in message_lower for mot in ['compétent', 'competent', 'compétence', 'competence', 'prof compétent', 'professeur compétent', 'tu es compétent', 'es-tu compétent', 'es tu competent', 'prêt', 'pret', 'prête', 'prete']):
        return """Excellente question ! ✨

Oui, je suis un professeur COMPÉTENT en français ! Je peux t'enseigner la langue française avec excellence.

**Mes compétences en français :**

✅ **Grammaire complète :**
- Verbes et conjugaison (présent, passé composé, imparfait, futur)
- Genres (masculin/féminin)
- Pluriels et accords
- Articles (le, la, les, un, une, des)
- Pronoms (je, tu, il, me, te, le, etc.)
- Adjectifs et leur accord

✅ **Orthographe :**
- Accents (é, è, ê, à, ù, ç)
- Règles d'orthographe
- Pluriels et exceptions

✅ **Vocabulaire :**
- Synonymes et antonymes
- Familles de mots
- Expressions courantes

✅ **Syntaxe :**
- Structure des phrases
- Types de phrases (déclarative, interrogative, exclamative, impérative)
- Ordre des mots

✅ **Prononciation :**
- Sons et phonétique
- Règles de prononciation
- Lettres muettes

✅ **Temps verbaux :**
- Présent, passé composé, imparfait, futur
- Conjugaison de tous les groupes de verbes

**Je peux t'enseigner :**
- La grammaire française (toutes les règles)
- La conjugaison (tous les temps)
- L'orthographe (toutes les règles)
- Le vocabulaire (synonymes, antonymes)
- La syntaxe (construction des phrases)
- La prononciation (comment dire les mots)

**Comment je fonctionne :**
- J'explique de manière SIMPLE et CLAIRE
- Je pars TOUJOURS des bases
- Je donne des EXEMPLES CONCRETS
- J'encourage et je motive
- Je réponds à TOUTES tes questions sur le français

**Pose-moi n'importe quelle question sur le français :**
- "C'est quoi un verbe ?"
- "Comment conjuguer au présent ?"
- "Qu'est-ce que le pluriel ?"
- "Comment utiliser les accents ?"
- "C'est quoi un synonyme ?"
- Et bien d'autres !

Je suis là pour t'aider à apprendre le français, même si tu ne connais rien au départ. Je pars toujours de zéro !

N'hésite pas, pose-moi tes questions maintenant ! 📚✨"""
    
    # Détection de questions sur enseigner / apprendre
    elif any(mot in message_lower for mot in ['enseigner', 'apprendre', 'apprends', 'enseigne', 'peux-tu enseigner', 'peut tu enseigner', 'peux tu m\'enseigner', 'peux-tu m\'enseigner le français', 'peut tu m\'enseigner le français', 'enseigner le français', 'apprendre le français']):
        return """Excellente question ! ✨

Oui, je peux t'enseigner le français ! C'est exactement mon rôle et ma spécialité.

**Je suis un professeur COMPÉTENT en français et je peux t'enseigner :**

✅ **Grammaire française :**
- Verbes et conjugaison (tous les temps)
- Genres (masculin/féminin)
- Pluriels et accords
- Articles et pronoms
- Adjectifs

✅ **Orthographe :**
- Accents (é, è, ê, à, ù, ç)
- Règles d'orthographe
- Pluriels et exceptions

✅ **Vocabulaire :**
- Synonymes et antonymes
- Familles de mots
- Expressions courantes

✅ **Syntaxe :**
- Structure des phrases
- Types de phrases
- Ordre des mots

✅ **Prononciation :**
- Sons et phonétique
- Règles de prononciation

**Comment je fonctionne :**
- Je réponds à toutes tes questions de manière SIMPLE et CLAIRE
- J'explique étape par étape
- Je donne des exemples concrets de la vie quotidienne
- Je pars TOUJOURS des bases pour être sûr que tu comprends
- J'encourage et je motive

**Tu peux me demander :**
- "C'est quoi un verbe ?" → Je t'explique ce que c'est
- "Comment conjuguer au présent ?" → Je te montre la conjugaison
- "Qu'est-ce que le pluriel ?" → Je t'explique les règles
- "Comment utiliser les accents ?" → Je t'explique tous les accents
- "C'est quoi un synonyme ?" → Je te donne des exemples
- N'importe quelle question sur le français !

**Exemple :**
Si tu me demandes "Comment saluer les gens ?", je t'explique :
- Les différents mots pour saluer (Bonjour, Bonsoir, Salut)
- Quand les utiliser (matin, après-midi, soir)
- Des exemples concrets (au magasin, avec des amis)

**Mon objectif :**
T'aider à apprendre et comprendre le français, même si tu ne connais rien au départ. Je pars toujours de zéro !

**Je suis là pour toi !** Pose-moi tes questions sur le français maintenant ! 📚✨"""
    
    # Détection de questions commençant par "comment", "peux-tu", "peut tu"
    elif any(mot in message_lower for mot in ['comment', 'peux-tu', 'peut tu', 'peux tu', 'peut-tu', 'peux tu m\'aider', 'peut tu m\'aider']):
        # Essayer de comprendre ce qu'on demande
        if 'saluer' in message_lower or 'bonjour' in message_lower:
            return """Excellente question ! ✨

Pour saluer les gens, voici comment faire :

**Les mots à utiliser :**
- "Bonjour" : le matin et l'après-midi (jusqu'à 18h)
- "Bonsoir" : le soir (après 18h)
- "Salut" : avec des amis (familier)
- "Bonne nuit" : quand on va dormir

**Exemples :**
- "Bonjour, comment allez-vous ?" (poli)
- "Salut ! Ça va ?" (avec un ami)
- "Bonsoir, bonne soirée !" (le soir)

**Les gestes :**
- Sourire
- Regarder la personne
- Serrer la main ou faire la bise (en France)

**Astuce :**
Commence toujours par "Bonjour" ou "Bonsoir" selon l'heure, puis ajoute ta question ou ta demande.

Continue comme ça ! 💪"""
        else:
            # Réponse générique pour "comment"
            sujet = message_lower
            for mot in ['comment', 'peux-tu', 'peut tu', 'peux tu', 'peut-tu', 'm\'aider', 'm\'enseigner', 'stpl', 'stp', 's\'il te plaît', 's\'il vous plaît']:
                sujet = sujet.replace(mot, '').strip()
            sujet = sujet.replace('?', '').strip()
            
            return f"""Excellente question ! ✨

Tu me demandes : "{message}"

Je comprends que tu veux apprendre comment faire quelque chose.

**Pour te donner une explication complète et détaillée :**
Je peux t'aider ! Pose-moi ta question de manière plus précise, par exemple :
- "Comment saluer les gens ?"
- "Comment faire..." 
- "Explique-moi..."

**Ou configure une clé API OpenAI** pour avoir des réponses encore plus détaillées :
1. Va sur https://platform.openai.com/
2. Crée un compte (gratuit au début)
3. Obtiens une clé API
4. Ouvre le fichier .env et remplace "sk-votre_cle_ici" par ta vraie clé

Mais même sans clé API, je peux répondre à beaucoup de questions ! Essaie de reformuler ta question, je ferai de mon mieux ! 📚"""
    
    # Détection de questions sur la programmation - RÉPONSE SIMPLE ET PRÉCISE
    elif any(mot in message_lower for mot in ['programmation', 'code', 'python', 'javascript', 'algorithme', 'coder', 'programmer']):
        return """Excellente question ! ✨

La programmation, c'est écrire des instructions pour qu'un ordinateur fasse quelque chose.

C'est comme donner une recette de cuisine à un robot : tu écris les étapes et il les suit.

**Les bases :**

1. **Un algorithme** : c'est une série d'étapes pour résoudre un problème.
   Exemple : Pour faire un sandwich :
   - Prendre le pain
   - Mettre le beurre
   - Ajouter la garniture

2. **Le code** : ce sont les instructions écrites dans un langage que l'ordinateur comprend.

3. **Les variables** : c'est comme une boîte avec une étiquette.
   Exemple : "nom = 'Marie'" (on met "Marie" dans la boîte "nom")

**Langages populaires :**
- Python : facile pour débuter
- JavaScript : pour les sites web
- Java : pour des applications complexes

En résumé : la programmation, c'est écrire des instructions pour l'ordinateur.

Continue comme ça ! 💪"""
    
    # ========== COMPÉTENCES COMPLÈTES EN FRANÇAIS ==========
    
    # CONJUGAISON SPÉCIFIQUE - Détecter "conjugue [verbe]" ou "conjuguer [verbe]"
    conjugaison_match = re.search(r'conjug(?:ue|uer|aison)\s+(?:le\s+)?(?:verbe\s+)?([a-zàâäéèêëïîôùûüÿç]+)', message_lower)
    if conjugaison_match:
        verbe_demande = conjugaison_match.group(1).strip()
        # Détecter le temps demandé
        temps_demande = 'présent'  # par défaut
        if any(mot in message_lower for mot in ['passé composé', 'passé', 'j\'ai']):
            temps_demande = 'passé composé'
        elif any(mot in message_lower for mot in ['futur', 'demain']):
            temps_demande = 'futur'
        elif any(mot in message_lower for mot in ['imparfait', 'j\'étais', 'je mangeais']):
            temps_demande = 'imparfait'
        elif any(mot in message_lower for mot in ['conditionnel']):
            temps_demande = 'conditionnel'
        
        # Fonction pour conjuguer un verbe
        def conjuguer_verbe(verbe, temps='présent'):
            verbe = verbe.lower().strip()
            
            # Verbes irréguliers principaux
            irreguliers = {
                'être': {
                    'présent': ['je suis', 'tu es', 'il/elle est', 'nous sommes', 'vous êtes', 'ils/elles sont'],
                    'passé composé': ['j\'ai été', 'tu as été', 'il/elle a été', 'nous avons été', 'vous avez été', 'ils/elles ont été'],
                    'futur': ['je serai', 'tu seras', 'il/elle sera', 'nous serons', 'vous serez', 'ils/elles seront'],
                    'imparfait': ['j\'étais', 'tu étais', 'il/elle était', 'nous étions', 'vous étiez', 'ils/elles étaient'],
                    'conditionnel': ['je serais', 'tu serais', 'il/elle serait', 'nous serions', 'vous seriez', 'ils/elles seraient']
                },
                'avoir': {
                    'présent': ['j\'ai', 'tu as', 'il/elle a', 'nous avons', 'vous avez', 'ils/elles ont'],
                    'passé composé': ['j\'ai eu', 'tu as eu', 'il/elle a eu', 'nous avons eu', 'vous avez eu', 'ils/elles ont eu'],
                    'futur': ['j\'aurai', 'tu auras', 'il/elle aura', 'nous aurons', 'vous aurez', 'ils/elles auront'],
                    'imparfait': ['j\'avais', 'tu avais', 'il/elle avait', 'nous avions', 'vous aviez', 'ils/elles avaient'],
                    'conditionnel': ['j\'aurais', 'tu aurais', 'il/elle aurait', 'nous aurions', 'vous auriez', 'ils/elles auraient']
                },
                'faire': {
                    'présent': ['je fais', 'tu fais', 'il/elle fait', 'nous faisons', 'vous faites', 'ils/elles font'],
                    'passé composé': ['j\'ai fait', 'tu as fait', 'il/elle a fait', 'nous avons fait', 'vous avez fait', 'ils/elles ont fait'],
                    'futur': ['je ferai', 'tu feras', 'il/elle fera', 'nous ferons', 'vous ferez', 'ils/elles feront'],
                    'imparfait': ['je faisais', 'tu faisais', 'il/elle faisait', 'nous faisions', 'vous faisiez', 'ils/elles faisaient'],
                    'conditionnel': ['je ferais', 'tu ferais', 'il/elle ferait', 'nous ferions', 'vous feriez', 'ils/elles feraient']
                },
                'aller': {
                    'présent': ['je vais', 'tu vas', 'il/elle va', 'nous allons', 'vous allez', 'ils/elles vont'],
                    'passé composé': ['je suis allé(e)', 'tu es allé(e)', 'il/elle est allé(e)', 'nous sommes allé(e)s', 'vous êtes allé(e)s', 'ils/elles sont allé(e)s'],
                    'futur': ['j\'irai', 'tu iras', 'il/elle ira', 'nous irons', 'vous irez', 'ils/elles iront'],
                    'imparfait': ['j\'allais', 'tu allais', 'il/elle allait', 'nous allions', 'vous alliez', 'ils/elles allaient'],
                    'conditionnel': ['j\'irais', 'tu irais', 'il/elle irait', 'nous irions', 'vous iriez', 'ils/elles iraient']
                },
                'venir': {
                    'présent': ['je viens', 'tu viens', 'il/elle vient', 'nous venons', 'vous venez', 'ils/elles viennent'],
                    'passé composé': ['je suis venu(e)', 'tu es venu(e)', 'il/elle est venu(e)', 'nous sommes venu(e)s', 'vous êtes venu(e)s', 'ils/elles sont venu(e)s'],
                    'futur': ['je viendrai', 'tu viendras', 'il/elle viendra', 'nous viendrons', 'vous viendrez', 'ils/elles viendront'],
                    'imparfait': ['je venais', 'tu venais', 'il/elle venait', 'nous venions', 'vous veniez', 'ils/elles venaient'],
                    'conditionnel': ['je viendrais', 'tu viendrais', 'il/elle viendrait', 'nous viendrions', 'vous viendriez', 'ils/elles viendraient']
                },
                'pouvoir': {
                    'présent': ['je peux', 'tu peux', 'il/elle peut', 'nous pouvons', 'vous pouvez', 'ils/elles peuvent'],
                    'passé composé': ['j\'ai pu', 'tu as pu', 'il/elle a pu', 'nous avons pu', 'vous avez pu', 'ils/elles ont pu'],
                    'futur': ['je pourrai', 'tu pourras', 'il/elle pourra', 'nous pourrons', 'vous pourrez', 'ils/elles pourront'],
                    'imparfait': ['je pouvais', 'tu pouvais', 'il/elle pouvait', 'nous pouvions', 'vous pouviez', 'ils/elles pouvaient'],
                    'conditionnel': ['je pourrais', 'tu pourrais', 'il/elle pourrait', 'nous pourrions', 'vous pourriez', 'ils/elles pourraient']
                },
                'vouloir': {
                    'présent': ['je veux', 'tu veux', 'il/elle veut', 'nous voulons', 'vous voulez', 'ils/elles veulent'],
                    'passé composé': ['j\'ai voulu', 'tu as voulu', 'il/elle a voulu', 'nous avons voulu', 'vous avez voulu', 'ils/elles ont voulu'],
                    'futur': ['je voudrai', 'tu voudras', 'il/elle voudra', 'nous voudrons', 'vous voudrez', 'ils/elles voudront'],
                    'imparfait': ['je voulais', 'tu voulais', 'il/elle voulait', 'nous voulions', 'vous vouliez', 'ils/elles voulaient'],
                    'conditionnel': ['je voudrais', 'tu voudrais', 'il/elle voudrait', 'nous voudrions', 'vous voudriez', 'ils/elles voudraient']
                },
                'savoir': {
                    'présent': ['je sais', 'tu sais', 'il/elle sait', 'nous savons', 'vous savez', 'ils/elles savent'],
                    'passé composé': ['j\'ai su', 'tu as su', 'il/elle a su', 'nous avons su', 'vous avez su', 'ils/elles ont su'],
                    'futur': ['je saurai', 'tu sauras', 'il/elle saura', 'nous saurons', 'vous saurez', 'ils/elles sauront'],
                    'imparfait': ['je savais', 'tu savais', 'il/elle savait', 'nous savions', 'vous saviez', 'ils/elles savaient'],
                    'conditionnel': ['je saurais', 'tu saurais', 'il/elle saurait', 'nous saurions', 'vous sauriez', 'ils/elles sauraient']
                }
            }
            
            # Vérifier si c'est un verbe irrégulier
            if verbe in irreguliers and temps in irreguliers[verbe]:
                return irreguliers[verbe][temps]
            
            # Verbes réguliers du 1er groupe (en -er)
            if verbe.endswith('er') and len(verbe) > 2:
                radical = verbe[:-2]
                terminaisons = {
                    'présent': ['e', 'es', 'e', 'ons', 'ez', 'ent'],
                    'passé composé': [f'ai {verbe[:-2]}é', f'as {verbe[:-2]}é', f'a {verbe[:-2]}é', f'avons {verbe[:-2]}é', f'avez {verbe[:-2]}é', f'ont {verbe[:-2]}é'],
                    'futur': ['ai', 'as', 'a', 'ons', 'ez', 'ont'],
                    'imparfait': ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'],
                    'conditionnel': ['ais', 'ais', 'ait', 'ions', 'iez', 'aient']
                }
                if temps == 'futur' or temps == 'conditionnel':
                    radical_futur = radical + 'er'
                    if temps == 'futur':
                        return [f'je {radical_futur}ai', f'tu {radical_futur}as', f'il/elle {radical_futur}a', f'nous {radical_futur}ons', f'vous {radical_futur}ez', f'ils/elles {radical_futur}ont']
                    else:
                        return [f'je {radical_futur}ais', f'tu {radical_futur}ais', f'il/elle {radical_futur}ait', f'nous {radical_futur}ions', f'vous {radical_futur}iez', f'ils/elles {radical_futur}aient']
                elif temps in terminaisons:
                    if temps == 'passé composé':
                        return terminaisons[temps]
                    else:
                        return [f'je {radical}{terminaisons[temps][0]}', f'tu {radical}{terminaisons[temps][1]}', f'il/elle {radical}{terminaisons[temps][2]}', f'nous {radical}{terminaisons[temps][3]}', f'vous {radical}{terminaisons[temps][4]}', f'ils/elles {radical}{terminaisons[temps][5]}']
            
            # Verbes du 2e groupe (en -ir comme finir)
            if verbe.endswith('ir') and len(verbe) > 2:
                radical = verbe[:-2]
                if temps == 'présent':
                    return [f'je {radical}is', f'tu {radical}is', f'il/elle {radical}it', f'nous {radical}issons', f'vous {radical}issez', f'ils/elles {radical}issent']
                elif temps == 'passé composé':
                    return [f'j\'ai {radical}i', f'tu as {radical}i', f'il/elle a {radical}i', f'nous avons {radical}i', f'vous avez {radical}i', f'ils/elles ont {radical}i']
                elif temps == 'futur':
                    return [f'je {radical}irai', f'tu {radical}iras', f'il/elle {radical}ira', f'nous {radical}irons', f'vous {radical}irez', f'ils/elles {radical}iront']
                elif temps == 'imparfait':
                    return [f'je {radical}issais', f'tu {radical}issais', f'il/elle {radical}issait', f'nous {radical}issions', f'vous {radical}issiez', f'ils/elles {radical}issaient']
                elif temps == 'conditionnel':
                    return [f'je {radical}irais', f'tu {radical}irais', f'il/elle {radical}irait', f'nous {radical}irions', f'vous {radical}iriez', f'ils/elles {radical}iraient']
            
            # Si on ne connaît pas le verbe, donner une réponse générique
            return None
        
        conjugaison = conjuguer_verbe(verbe_demande, temps_demande)
        if conjugaison:
            pronoms = ['Je', 'Tu', 'Il/Elle', 'Nous', 'Vous', 'Ils/Elles']
            conjugaison_formatee = '\n'.join([f"- **{pronoms[i]}** : {conjugaison[i]}" for i in range(6)])
            return f"""Excellente question ! ✨

**Conjugaison du verbe "{verbe_demande}" au {temps_demande} :**

{conjugaison_formatee}

**Exemples :**
- "Je {conjugaison[0].split()[1] if len(conjugaison[0].split()) > 1 else conjugaison[0].split()[0]} tous les jours." (I {verbe_demande} every day)
- "Tu {conjugaison[1].split()[1] if len(conjugaison[1].split()) > 1 else conjugaison[1].split()[0]} bien." (You {verbe_demande} well)

**Astuce :**
Pour conjuguer un verbe, on change la fin du verbe selon qui fait l'action (je, tu, il, etc.).

Continue comme ça ! 💪"""
        else:
            return f"""Excellente question ! ✨

Je vais te montrer comment conjuguer le verbe "{verbe_demande}" au {temps_demande}.

**Règle générale :**
- Les verbes en -er (comme "manger", "parler") : on enlève -er et on ajoute les terminaisons
- Les verbes en -ir (comme "finir") : on enlève -ir et on ajoute les terminaisons
- Les verbes irréguliers (être, avoir, faire, aller) : ont des conjugaisons spéciales

**Pour le verbe "{verbe_demande}" :**
Je peux te donner la conjugaison complète ! Demande-moi :
- "Conjugue {verbe_demande} au présent"
- "Conjugue {verbe_demande} au passé composé"
- "Conjugue {verbe_demande} au futur"

Ou je peux t'expliquer les règles de conjugaison pour ce type de verbe.

Continue comme ça ! 💪"""
    
    # GRAMMAIRE - VERBES ET CONJUGAISON
    elif any(mot in message_lower for mot in ['verbe', 'conjugaison', 'conjuguer', 'conjugue', 'temps du verbe', 'mode du verbe']):
        return """Excellente question ! ✨

Un verbe, c'est un mot qui exprime une action ou un état.

**Les temps en français :**
1. **Présent** : action qui se passe maintenant
   - "Je mange" (maintenant)
   - "Tu parles" (maintenant)

2. **Passé composé** : action terminée
   - "J'ai mangé" (hier, terminé)
   - "Tu as parlé" (terminé)

3. **Imparfait** : action dans le passé qui dure
   - "Je mangeais" (avant, pendant longtemps)
   - "Tu parlais" (avant)

4. **Futur** : action à venir
   - "Je mangerai" (demain)
   - "Tu parleras" (plus tard)

**Les groupes de verbes :**
- **1er groupe** : verbes en -er (manger, parler, aimer)
- **2e groupe** : verbes en -ir (finir, choisir)
- **3e groupe** : verbes irréguliers (être, avoir, faire)

**Exemple de conjugaison (manger - présent) :**
- Je mange
- Tu manges
- Il/Elle mange
- Nous mangeons
- Vous mangez
- Ils/Elles mangent

En résumé : un verbe exprime une action et change selon qui fait l'action et quand.

Continue comme ça ! 💪"""
    
    # GRAMMAIRE - GENRES (MASCULIN/FÉMININ)
    elif any(mot in message_lower for mot in ['genre', 'masculin', 'féminin', 'masculin ou féminin', 'le ou la']):
        return """Excellente question ! ✨

En français, chaque nom a un genre : masculin ou féminin.

**Masculin** : on utilise "le" ou "un"
- Le chat (masculin)
- Un livre (masculin)
- Le garçon (masculin)

**Féminin** : on utilise "la" ou "une"
- La table (féminin)
- Une fleur (féminin)
- La fille (féminin)

**Comment savoir ?**
- Parfois, on ajoute un "e" pour le féminin :
  - Un ami → Une amie
  - Un étudiant → Une étudiante

- Mais attention, ce n'est pas toujours le cas :
  - Un livre (masculin) - pas de féminin
  - Une table (féminin) - pas de masculin

**Les adjectifs s'accordent aussi :**
- Un grand chat (masculin)
- Une grande table (féminin)

En résumé : chaque nom français a un genre (masculin ou féminin) et on utilise "le/un" ou "la/une".

Continue comme ça ! 💪"""
    
    # GRAMMAIRE - PLURIELS
    elif any(mot in message_lower for mot in ['pluriel', 'pluriels', 'singulier', 'les pluriels', 'comment faire le pluriel']):
        return """Excellente question ! ✨

Le pluriel, c'est quand il y a plusieurs choses (plus d'une).

**Règle générale :** On ajoute un "s" à la fin
- Un chat → Des chats
- Une table → Des tables
- Un livre → Des livres

**Exceptions importantes :**
1. **Mots en -s, -x, -z** : ne changent pas
   - Un bras → Des bras
   - Un prix → Des prix
   - Un nez → Des nez

2. **Mots en -eau, -eu** : ajoutent "x"
   - Un gâteau → Des gâteaux
   - Un feu → Des feux

3. **Mots en -al** : deviennent "-aux"
   - Un cheval → Des chevaux
   - Un journal → Des journaux

4. **Mots en -ou** : ajoutent "s" (sauf bijou, caillou, chou, genou, hibou, joujou, pou)
   - Un trou → Des trous
   - Un bijou → Des bijoux (exception)

**Les articles changent aussi :**
- Le chat → Les chats
- La table → Les tables
- Un chat → Des chats

En résumé : pour faire le pluriel, on ajoute généralement un "s", mais il y a des exceptions.

Continue comme ça ! 💪"""
    
    # GRAMMAIRE - ACCORDS
    elif any(mot in message_lower for mot in ['accord', 'accorder', 'accords', 's\'accorder', 'accord du verbe', 'accord de l\'adjectif']):
        return """Excellente question ! ✨

L'accord, c'est faire correspondre les mots ensemble.

**Accord du verbe avec le sujet :**
- "Je mange" (je = 1 personne)
- "Tu manges" (tu = 1 personne)
- "Il mange" (il = 1 personne)
- "Nous mangeons" (nous = plusieurs)
- "Ils mangent" (ils = plusieurs)

**Accord de l'adjectif :**
- Un grand chat (masculin singulier)
- Une grande table (féminin singulier)
- Des grands chats (masculin pluriel)
- Des grandes tables (féminin pluriel)

**Règle importante :**
L'adjectif s'accorde avec le nom qu'il décrit :
- "Les chats sont grands" (grands = masculin pluriel, comme "chats")
- "Les tables sont grandes" (grandes = féminin pluriel, comme "tables")

**Exemples :**
- "Le chat noir" (noir = masculin, comme "chat")
- "La table noire" (noire = féminin, comme "table")
- "Les chats noirs" (noirs = masculin pluriel)
- "Les tables noires" (noires = féminin pluriel)

En résumé : les mots s'accordent ensemble (verbe avec sujet, adjectif avec nom).

Continue comme ça ! 💪"""
    
    # ORTHOGRAPHE - ACCENTS
    elif any(mot in message_lower for mot in ['accent', 'accents', 'é', 'è', 'ê', 'à', 'ù', 'ç', 'cédille']):
        return """Excellente question ! ✨

Les accents en français changent la prononciation et parfois le sens.

**Les accents français :**

1. **é (accent aigu)** : son "é"
   - Café (boisson)
   - Été (saison)
   - École (lieu d'apprentissage)

2. **è (accent grave)** : son "è"
   - Père (papa)
   - Mère (maman)
   - Frère (garçon de la famille)

3. **ê (accent circonflexe)** : son "è" long
   - Fête (célébration)
   - Tête (partie du corps)
   - Forêt (beaucoup d'arbres)

4. **à (accent grave sur a)** : préposition
   - À la maison (chez soi)
   - À demain (au revoir)

5. **ù (accent grave sur u)** : rare, seulement dans "où"
   - Où (question : où vas-tu ?)

6. **ç (cédille)** : change le son de "c"
   - Français (langue)
   - Garçon (jeune homme)
   - Leçon (cours)

**Règle importante :**
- "c" avant "a, o, u" = son "k" (chat, code, cube)
- "c" avant "e, i" = son "s" (cercle, citron)
- "ç" avant "a, o, u" = son "s" (français, garçon)

En résumé : les accents changent la prononciation et sont importants pour bien écrire.

Continue comme ça ! 💪"""
    
    # VOCABULAIRE - SYNONYMES
    elif any(mot in message_lower for mot in ['synonyme', 'synonymes', 'même sens', 'mot pareil', 'équivalent']):
        return """Excellente question ! ✨

Un synonyme, c'est un mot qui a presque le même sens qu'un autre mot.

**Exemples de synonymes :**

**Grand / Énorme / Immense**
- "Une grande maison" = "Une énorme maison" = "Une immense maison"
- Tous signifient "très grand"

**Petit / Minuscule / Tout petit**
- "Un petit chat" = "Un minuscule chat" = "Un tout petit chat"
- Tous signifient "très petit"

**Joli / Beau / Magnifique**
- "Une jolie fleur" = "Une belle fleur" = "Une magnifique fleur"
- Tous signifient "très beau"

**Rapide / Vite / Rapide**
- "Courir vite" = "Courir rapidement"
- Tous signifient "avec vitesse"

**Manger / Déguster / Consommer**
- "Manger" (simple)
- "Déguster" (manger avec plaisir)
- "Consommer" (plus formel)

**Pourquoi utiliser des synonymes ?**
- Éviter de répéter le même mot
- Enrichir son vocabulaire
- Exprimer des nuances

**Attention :**
Les synonymes ne sont pas toujours exactement pareils :
- "Grand" et "énorme" : "énorme" est plus fort que "grand"

En résumé : un synonyme est un mot qui a un sens proche d'un autre mot.

Continue comme ça ! 💪"""
    
    # VOCABULAIRE - ANTONYMES
    elif any(mot in message_lower for mot in ['antonyme', 'antonymes', 'contraire', 'opposé', 'mot opposé']):
        return """Excellente question ! ✨

Un antonyme, c'est un mot qui a le sens opposé d'un autre mot.

**Exemples d'antonymes :**

**Grand ↔ Petit**
- "Une grande maison" / "Une petite maison"
- Opposés : grand = pas petit, petit = pas grand

**Bon ↔ Mauvais**
- "Un bon élève" / "Un mauvais élève"
- Opposés : bon = pas mauvais, mauvais = pas bon

**Jourd ↔ Nuit**
- "Le jour" / "La nuit"
- Opposés : jour = lumière, nuit = obscurité

**Chaud ↔ Froid**
- "L'eau chaude" / "L'eau froide"
- Opposés : chaud = pas froid, froid = pas chaud

**Rapide ↔ Lent**
- "Courir rapidement" / "Marcher lentement"
- Opposés : rapide = pas lent, lent = pas rapide

**Heureux ↔ Triste**
- "Je suis heureux" / "Je suis triste"
- Opposés : heureux = pas triste, triste = pas heureux

**Riche ↔ Pauvre**
- "Une personne riche" / "Une personne pauvre"
- Opposés : riche = pas pauvre, pauvre = pas riche

**Pourquoi connaître les antonymes ?**
- Mieux comprendre les mots
- Enrichir son vocabulaire
- Exprimer des contrastes

En résumé : un antonyme est un mot qui a le sens opposé d'un autre mot.

Continue comme ça ! 💪"""
    
    # SYNTAXE - PHRASES
    elif any(mot in message_lower for mot in ['phrase', 'phrases', 'syntaxe', 'structure de phrase', 'construire une phrase']):
        return """Excellente question ! ✨

Une phrase, c'est un groupe de mots qui exprime une idée complète.

**Structure d'une phrase simple :**
Sujet + Verbe + Complément

**Exemples :**
- "Le chat mange." (Sujet : Le chat, Verbe : mange)
- "Je lis un livre." (Sujet : Je, Verbe : lis, Complément : un livre)
- "Tu aimes le français." (Sujet : Tu, Verbe : aimes, Complément : le français)

**Types de phrases :**

1. **Phrase déclarative** : on dit quelque chose
   - "Le chat est noir."
   - "J'aime le français."

2. **Phrase interrogative** : on pose une question
   - "Comment vas-tu ?"
   - "Où est le chat ?"
   - "Qu'est-ce que c'est ?"

3. **Phrase exclamative** : on exprime une émotion
   - "Qu'il est beau !"
   - "C'est magnifique !"

4. **Phrase impérative** : on donne un ordre
   - "Mange ta soupe !"
   - "Viens ici !"

**Ordre des mots :**
En français, l'ordre est généralement :
- Sujet en premier
- Verbe au milieu
- Complément à la fin

**Exemples :**
- "Je mange une pomme." (correct)
- "Mange je une pomme." (incorrect)

En résumé : une phrase a un sujet, un verbe, et parfois un complément, dans un ordre précis.

Continue comme ça ! 💪"""
    
    # PRONONCIATION - PHONÉTIQUE
    elif any(mot in message_lower for mot in ['prononciation', 'prononcer', 'comment prononcer', 'son', 'sons', 'phonétique']):
        return """Excellente question ! ✨

La prononciation, c'est comment on dit les mots à voix haute.

**Les sons en français :**

**Voyelles :**
- **a** : comme dans "chat" (son "a")
- **e** : comme dans "le" (son "e")
- **é** : comme dans "café" (son "é")
- **è** : comme dans "père" (son "è")
- **i** : comme dans "lit" (son "i")
- **o** : comme dans "chat" (son "o")
- **u** : comme dans "lune" (son "u")

**Consonnes :**
- **b** : comme dans "bonjour" (son "b")
- **c** : comme dans "chat" (son "ch") ou "cercle" (son "s")
- **d** : comme dans "dimanche" (son "d")
- **f** : comme dans "fleur" (son "f")
- **g** : comme dans "garçon" (son "g") ou "girafe" (son "j")
- **r** : roulé en français (son "r")

**Règles de prononciation :**

1. **"c" avant "a, o, u"** = son "k"
   - Chat, code, cube

2. **"c" avant "e, i"** = son "s"
   - Cercle, citron

3. **"g" avant "a, o, u"** = son "g"
   - Garçon, gomme

4. **"g" avant "e, i"** = son "j"
   - Girafe, gilet

5. **"ch"** = son "ch"
   - Chat, chien

6. **"ph"** = son "f"
   - Photo, phrase

**Les lettres muettes :**
Parfois, on ne prononce pas la dernière lettre :
- "Chat" (on ne prononce pas le "t")
- "Grand" (on ne prononce pas le "d")
- "Fleur" (on ne prononce pas le "r")

En résumé : la prononciation, c'est comment on dit les mots, et il y a des règles pour les sons.

Continue comme ça ! 💪"""
    
    # TEMPS VERBAUX - PRÉSENT
    elif any(mot in message_lower for mot in ['présent', 'temps présent', 'verbe au présent', 'conjugaison présent']):
        return """Excellente question ! ✨

Le présent, c'est le temps qui exprime une action qui se passe maintenant.

**Conjugaison au présent (verbe "manger") :**
- Je mange (maintenant)
- Tu manges (maintenant)
- Il/Elle mange (maintenant)
- Nous mangeons (maintenant)
- Vous mangez (maintenant)
- Ils/Elles mangent (maintenant)

**Conjugaison au présent (verbe "être") :**
- Je suis
- Tu es
- Il/Elle est
- Nous sommes
- Vous êtes
- Ils/Elles sont

**Conjugaison au présent (verbe "avoir") :**
- J'ai
- Tu as
- Il/Elle a
- Nous avons
- Vous avez
- Ils/Elles ont

**Quand utiliser le présent ?**
1. Action qui se passe maintenant :
   - "Je mange une pomme." (maintenant)

2. Habitude :
   - "Je mange des fruits tous les jours." (habitude)

3. Vérité générale :
   - "Le soleil brille." (toujours vrai)

**Exemples :**
- "Je suis heureux." (maintenant)
- "Tu aimes le français." (habitude)
- "Il fait beau." (maintenant)

En résumé : le présent exprime une action qui se passe maintenant ou une habitude.

Continue comme ça ! 💪"""
    
    # TEMPS VERBAUX - PASSÉ COMPOSÉ
    elif any(mot in message_lower for mot in ['passé composé', 'passé', 'j\'ai mangé', 'conjugaison passé', 'temps passé']):
        return """Excellente question ! ✨

Le passé composé, c'est le temps qui exprime une action terminée dans le passé.

**Structure :** Avoir ou Être + participe passé

**Avec "avoir" (la plupart des verbes) :**
- J'ai mangé (action terminée)
- Tu as parlé (action terminée)
- Il/Elle a fini (action terminée)
- Nous avons vu (action terminée)
- Vous avez fait (action terminée)
- Ils/Elles ont dit (action terminée)

**Avec "être" (verbes de mouvement) :**
- Je suis allé(e) (je suis parti)
- Tu es venu(e) (tu es arrivé)
- Il/Elle est parti(e) (il/elle est parti)
- Nous sommes arrivé(e)s (nous sommes arrivés)
- Vous êtes entré(e)s (vous êtes entrés)
- Ils/Elles sont sorti(e)s (ils sont sortis)

**Verbes qui utilisent "être" :**
- Aller, venir, partir, arriver, entrer, sortir, monter, descendre, naître, mourir

**Accord avec "être" :**
- "Je suis allé" (masculin) / "Je suis allée" (féminin)
- "Ils sont partis" (masculin) / "Elles sont parties" (féminin)

**Quand utiliser le passé composé ?**
- Action terminée : "Hier, j'ai mangé une pomme."
- Action précise : "J'ai fini mes devoirs."
- Action unique : "J'ai vu un film."

En résumé : le passé composé exprime une action terminée, avec "avoir" ou "être" + participe passé.

Continue comme ça ! 💪"""
    
    # TEMPS VERBAUX - FUTUR
    elif any(mot in message_lower for mot in ['futur', 'temps futur', 'verbe au futur', 'conjugaison futur', 'demain', 'plus tard']):
        return """Excellente question ! ✨

Le futur, c'est le temps qui exprime une action qui va se passer plus tard.

**Conjugaison au futur (verbe "manger") :**
- Je mangerai (plus tard)
- Tu mangeras (plus tard)
- Il/Elle mangera (plus tard)
- Nous mangerons (plus tard)
- Vous mangerez (plus tard)
- Ils/Elles mangeront (plus tard)

**Conjugaison au futur (verbe "être") :**
- Je serai
- Tu seras
- Il/Elle sera
- Nous serons
- Vous serez
- Ils/Elles seront

**Conjugaison au futur (verbe "avoir") :**
- J'aurai
- Tu auras
- Il/Elle aura
- Nous aurons
- Vous aurez
- Ils/Elles auront

**Quand utiliser le futur ?**
1. Action future :
   - "Demain, je mangerai une pomme." (demain)

2. Intention :
   - "Je vais apprendre le français." (intention)

3. Prédiction :
   - "Il fera beau demain." (prédiction)

**Exemples :**
- "Je serai là demain." (futur)
- "Tu auras 20 ans l'année prochaine." (futur)
- "Nous irons au cinéma." (futur)

**Futur proche (avec "aller") :**
- "Je vais manger." (bientôt)
- "Tu vas partir." (bientôt)

En résumé : le futur exprime une action qui va se passer plus tard.

Continue comme ça ! 💪"""
    
    # TEMPS VERBAUX - IMPARFAIT
    elif any(mot in message_lower for mot in ['imparfait', 'temps imparfait', 'verbe à l\'imparfait', 'conjugaison imparfait', 'j\'étais', 'je mangeais']):
        return """Excellente question ! ✨

L'imparfait, c'est le temps qui exprime une action dans le passé qui dure ou une habitude passée.

**Conjugaison à l'imparfait (verbe "manger") :**
- Je mangeais (avant, pendant longtemps)
- Tu mangeais (avant)
- Il/Elle mangeait (avant)
- Nous mangions (avant)
- Vous mangiez (avant)
- Ils/Elles mangeaient (avant)

**Conjugaison à l'imparfait (verbe "être") :**
- J'étais
- Tu étais
- Il/Elle était
- Nous étions
- Vous étiez
- Ils/Elles étaient

**Conjugaison à l'imparfait (verbe "avoir") :**
- J'avais
- Tu avais
- Il/Elle avait
- Nous avions
- Vous aviez
- Ils/Elles avaient

**Quand utiliser l'imparfait ?**
1. Habitude dans le passé :
   - "Quand j'étais petit, je mangeais des bonbons." (habitude)

2. Action qui dure dans le passé :
   - "Il pleuvait toute la journée." (action qui dure)

3. Description dans le passé :
   - "Le ciel était bleu." (description)

4. Action en cours dans le passé :
   - "Je lisais un livre quand tu es arrivé." (action en cours)

**Différence avec le passé composé :**
- Passé composé : action terminée ("J'ai mangé" = terminé)
- Imparfait : action qui dure ("Je mangeais" = pendant longtemps)

En résumé : l'imparfait exprime une action dans le passé qui dure ou une habitude passée.

Continue comme ça ! 💪"""
    
    # GRAMMAIRE - ARTICLES
    elif any(mot in message_lower for mot in ['article', 'articles', 'le la les', 'un une des', 'défini', 'indéfini']):
        return """Excellente question ! ✨

Un article, c'est un petit mot qu'on met avant un nom.

**Articles définis** (on sait de quoi on parle) :
- **Le** (masculin singulier) : "Le chat"
- **La** (féminin singulier) : "La table"
- **Les** (pluriel) : "Les chats", "Les tables"
- **L'** (devant voyelle) : "L'ami", "L'école"

**Articles indéfinis** (on ne sait pas précisément) :
- **Un** (masculin singulier) : "Un chat"
- **Une** (féminin singulier) : "Une table"
- **Des** (pluriel) : "Des chats", "Des tables"

**Exemples :**
- "Le chat" (on sait quel chat)
- "Un chat" (n'importe quel chat)
- "La table" (on sait quelle table)
- "Une table" (n'importe quelle table)
- "Les chats" (on sait quels chats)
- "Des chats" (plusieurs chats, on ne sait pas lesquels)

**Quand utiliser "l'" ?**
Devant un nom qui commence par une voyelle (a, e, i, o, u) :
- "L'ami" (pas "le ami")
- "L'école" (pas "la école")
- "L'homme" (pas "le homme")

**Attention :**
- "Le" devient "l'" devant voyelle : "L'ami"
- "La" devient "l'" devant voyelle : "L'école"

En résumé : les articles (le, la, les, un, une, des) se mettent avant les noms et changent selon le genre et le nombre.

Continue comme ça ! 💪"""
    
    # GRAMMAIRE - PRONOMS
    elif any(mot in message_lower for mot in ['pronom', 'pronoms', 'je tu il', 'moi toi lui', 'me te le']):
        return """Excellente question ! ✨

Un pronom, c'est un mot qui remplace un nom.

**Pronoms personnels sujets** (qui fait l'action) :
- **Je** (moi) : "Je mange"
- **Tu** (toi) : "Tu manges"
- **Il** (lui, masculin) : "Il mange"
- **Elle** (elle, féminin) : "Elle mange"
- **Nous** (nous) : "Nous mangeons"
- **Vous** (vous) : "Vous mangez"
- **Ils** (eux, masculin) : "Ils mangent"
- **Elles** (elles, féminin) : "Elles mangent"

**Pronoms personnels compléments** (remplace le complément) :
- **Me** (moi) : "Il me voit"
- **Te** (toi) : "Je te vois"
- **Le** (lui, masculin) : "Je le vois"
- **La** (elle, féminin) : "Je la vois"
- **Nous** (nous) : "Il nous voit"
- **Vous** (vous) : "Je vous vois"
- **Les** (eux/elles) : "Je les vois"

**Pronoms toniques** (pour insister) :
- **Moi** : "C'est moi"
- **Toi** : "C'est toi"
- **Lui** : "C'est lui"
- **Elle** : "C'est elle"
- **Nous** : "C'est nous"
- **Vous** : "C'est vous"
- **Eux** : "Ce sont eux"
- **Elles** : "Ce sont elles"

**Exemples :**
- "Je mange une pomme" → "Je la mange" (la = la pomme)
- "Tu vois le chat" → "Tu le vois" (le = le chat)
- "Il aime les fleurs" → "Il les aime" (les = les fleurs)

**Place des pronoms :**
- Avant le verbe : "Je le vois" (pas "Je vois le")
- Sauf à l'impératif : "Vois-le !" (après le verbe)

En résumé : un pronom remplace un nom et change selon qui fait l'action et ce qu'on remplace.

Continue comme ça ! 💪"""
    
    # GRAMMAIRE - ADJECTIFS
    elif any(mot in message_lower for mot in ['adjectif', 'adjectifs', 'grand petit', 'beau joli', 'qualificatif']):
        return """Excellente question ! ✨

Un adjectif, c'est un mot qui décrit un nom.

**Exemples d'adjectifs :**
- **Grand / Petit** : "Un grand chat" / "Un petit chat"
- **Beau / Joli** : "Une belle fleur" / "Une jolie fleur"
- **Bon / Mauvais** : "Un bon élève" / "Un mauvais élève"
- **Rapide / Lent** : "Un chat rapide" / "Un chat lent"
- **Noir / Blanc** : "Un chat noir" / "Un chat blanc"

**L'adjectif s'accorde :**
- Avec le genre (masculin/féminin)
- Avec le nombre (singulier/pluriel)

**Exemples d'accord :**
- "Un grand chat" (masculin singulier)
- "Une grande table" (féminin singulier)
- "Des grands chats" (masculin pluriel)
- "Des grandes tables" (féminin pluriel)

**Place de l'adjectif :**
- **Avant le nom** (la plupart) : "Un grand chat", "Une belle fleur"
- **Après le nom** (quelques-uns) : "Un chat noir", "Une fleur rouge"

**Règle générale :**
- Adjectifs courts : avant le nom (grand, petit, beau, joli, bon, mauvais)
- Adjectifs longs : après le nom (intéressant, magnifique)

**Exemples :**
- "Un grand chat noir" (grand avant, noir après)
- "Une belle fleur rouge" (belle avant, rouge après)

**Attention :**
- "Un bon livre" (bon avant)
- "Un livre intéressant" (intéressant après)

En résumé : un adjectif décrit un nom et s'accorde avec lui (genre et nombre).

Continue comme ça ! 💪"""
    
    # GRAMMAIRE - VERBES IRRÉGULIERS
    elif any(mot in message_lower for mot in ['verbe irrégulier', 'irrégulier', 'verbes irréguliers', 'être avoir faire', 'aller venir']):
        return """Excellente question ! ✨

Un verbe irrégulier, c'est un verbe qui ne suit pas les règles normales de conjugaison.

**Les verbes irréguliers les plus importants :**

**ÊTRE (être) :**
- Je suis, Tu es, Il/Elle est, Nous sommes, Vous êtes, Ils/Elles sont

**AVOIR (avoir) :**
- J'ai, Tu as, Il/Elle a, Nous avons, Vous avez, Ils/Elles ont

**FAIRE (faire) :**
- Je fais, Tu fais, Il/Elle fait, Nous faisons, Vous faites, Ils/Elles font

**ALLER (aller) :**
- Je vais, Tu vas, Il/Elle va, Nous allons, Vous allez, Ils/Elles vont

**VENIR (venir) :**
- Je viens, Tu viens, Il/Elle vient, Nous venons, Vous venez, Ils/Elles viennent

**POUVOIR (pouvoir) :**
- Je peux, Tu peux, Il/Elle peut, Nous pouvons, Vous pouvez, Ils/Elles peuvent

**VOULOIR (vouloir) :**
- Je veux, Tu veux, Il/Elle veut, Nous voulons, Vous voulez, Ils/Elles veulent

**SAVOIR (savoir) :**
- Je sais, Tu sais, Il/Elle sait, Nous savons, Vous savez, Ils/Elles savent

**Pourquoi sont-ils irréguliers ?**
Ils ne suivent pas les règles normales. Par exemple :
- "Je suis" (pas "je être")
- "J'ai" (pas "je avoir")
- "Je fais" (pas "je faire")

**Astuce :**
Il faut les apprendre par cœur car ils ne suivent pas de règle.

En résumé : les verbes irréguliers ne suivent pas les règles normales et doivent être appris par cœur.

Continue comme ça ! 💪"""
    
    # GRAMMAIRE - CONDITIONNEL
    elif any(mot in message_lower for mot in ['conditionnel', 'je voudrais', 'je pourrais', 'je ferais', 'temps conditionnel']):
        return """Excellente question ! ✨

Le conditionnel, c'est le temps qui exprime une action possible ou imaginaire.

**Conjugaison au conditionnel (verbe "manger") :**
- Je mangerais (si j'avais faim)
- Tu mangerais (si tu avais faim)
- Il/Elle mangerait (si il/elle avait faim)
- Nous mangerions (si nous avions faim)
- Vous mangeriez (si vous aviez faim)
- Ils/Elles mangeraient (si ils/elles avaient faim)

**Conjugaison au conditionnel (verbe "être") :**
- Je serais
- Tu serais
- Il/Elle serait
- Nous serions
- Vous seriez
- Ils/Elles seraient

**Conjugaison au conditionnel (verbe "avoir") :**
- J'aurais
- Tu aurais
- Il/Elle aurait
- Nous aurions
- Vous auriez
- Ils/Elles auraient

**Quand utiliser le conditionnel ?**
1. **Politesse** :
   - "Je voudrais un café, s'il vous plaît." (poli)
   - "Pourriez-vous m'aider ?" (poli)

2. **Souhait** :
   - "J'aimerais voyager." (souhait)
   - "Je voudrais être riche." (souhait)

3. **Condition** :
   - "Si j'avais de l'argent, j'achèterais une voiture." (condition)
   - "Si tu venais, je serais content." (condition)

**Exemples :**
- "Je voudrais un livre." (politesse)
- "Si j'étais riche, je voyagerais." (condition)
- "J'aimerais apprendre le français." (souhait)

En résumé : le conditionnel exprime une action possible, un souhait ou la politesse.

Continue comme ça ! 💪"""
    
    # GRAMMAIRE - PRÉPOSITIONS
    elif any(mot in message_lower for mot in ['préposition', 'prépositions', 'à de dans', 'sur sous', 'avec sans']):
        return """Excellente question ! ✨

Une préposition, c'est un petit mot qui relie des mots ensemble.

**Les prépositions les plus importantes :**

**À** (direction, lieu) :
- "Je vais à Paris." (direction)
- "Je suis à la maison." (lieu)

**DE** (origine, possession) :
- "Je viens de France." (origine)
- "Le livre de Marie." (possession)

**DANS** (à l'intérieur) :
- "Le chat est dans la boîte." (à l'intérieur)
- "Je vais dans le magasin." (à l'intérieur)

**SUR** (au-dessus) :
- "Le livre est sur la table." (au-dessus)
- "Je marche sur le trottoir." (au-dessus)

**SOUS** (en dessous) :
- "Le chat est sous la table." (en dessous)
- "Je mets mes chaussures sous le lit." (en dessous)

**AVEC** (accompagnement) :
- "Je vais avec mon ami." (accompagnement)
- "Je mange avec une fourchette." (moyen)

**SANS** (absence) :
- "Je vais sans mon ami." (absence)
- "Café sans sucre." (absence)

**POUR** (but) :
- "Je travaille pour gagner de l'argent." (but)
- "C'est pour toi." (destiné à)

**PAR** (moyen) :
- "Je voyage par train." (moyen)
- "Je passe par Paris." (chemin)

**Exemples :**
- "Je vais à l'école." (à = direction)
- "Le livre de Paul." (de = possession)
- "Je suis dans la voiture." (dans = à l'intérieur)

En résumé : les prépositions relient les mots et indiquent des relations (lieu, temps, but, etc.).

Continue comme ça ! 💪"""
    
    # GRAMMAIRE - NOMBRES
    elif any(mot in message_lower for mot in ['nombre', 'nombres', 'chiffre', 'chiffres', 'compter', 'un deux trois']):
        return """Excellente question ! ✨

Les nombres en français, c'est compter de 0 à l'infini.

**Les nombres de 0 à 20 :**
- 0 : zéro
- 1 : un (masculin) / une (féminin)
- 2 : deux
- 3 : trois
- 4 : quatre
- 5 : cinq
- 6 : six
- 7 : sept
- 8 : huit
- 9 : neuf
- 10 : dix
- 11 : onze
- 12 : douze
- 13 : treize
- 14 : quatorze
- 15 : quinze
- 16 : seize
- 17 : dix-sept
- 18 : dix-huit
- 19 : dix-neuf
- 20 : vingt

**Les dizaines :**
- 20 : vingt
- 30 : trente
- 40 : quarante
- 50 : cinquante
- 60 : soixante
- 70 : soixante-dix
- 80 : quatre-vingts
- 90 : quatre-vingt-dix
- 100 : cent

**Exemples :**
- 21 : vingt et un
- 22 : vingt-deux
- 30 : trente
- 45 : quarante-cinq
- 67 : soixante-sept
- 99 : quatre-vingt-dix-neuf
- 100 : cent

**Attention :**
- "Un" devient "une" au féminin : "Une pomme" (pas "un pomme")
- "Vingt" et "cent" prennent un "s" au pluriel : "Quatre-vingts", "Deux cents"

En résumé : les nombres en français suivent des règles spécifiques, surtout pour 70, 80 et 90.

Continue comme ça ! 💪"""
    
    # EXPRESSIONS COURANTES - VIE QUOTIDIENNE
    elif any(mot in message_lower for mot in ['expression', 'expressions', 'phrase utile', 'phrases utiles', 'comment dire', 'comment demander']):
        return """Excellente question ! ✨

Les expressions courantes, ce sont des phrases qu'on utilise souvent dans la vie quotidienne.

**Expressions de politesse :**
- "S'il vous plaît" / "S'il te plaît" (please)
- "Merci" (thank you)
- "De rien" (you're welcome)
- "Excusez-moi" / "Excuse-moi" (excuse me)
- "Pardon" (sorry)
- "Je suis désolé(e)" (I'm sorry)

**Demander quelque chose :**
- "Je voudrais..." (I would like...)
- "Pouvez-vous..." / "Peux-tu..." (Can you...)
- "Est-ce que je peux..." (Can I...)
- "Auriez-vous..." (Would you have...)

**Répondre :**
- "Oui" (yes)
- "Non" (no)
- "D'accord" (okay)
- "Bien sûr" (of course)
- "Pas de problème" (no problem)

**Se présenter :**
- "Je m'appelle..." (My name is...)
- "Enchanté(e)" (Nice to meet you)
- "Comment allez-vous ?" / "Comment vas-tu ?" (How are you?)
- "Ça va" (I'm fine)

**Au restaurant :**
- "L'addition, s'il vous plaît" (The bill, please)
- "Je voudrais commander" (I would like to order)
- "C'est délicieux" (It's delicious)

**Au magasin :**
- "Combien ça coûte ?" (How much does it cost?)
- "Je cherche..." (I'm looking for...)
- "Avez-vous..." (Do you have...)

En résumé : les expressions courantes sont des phrases utiles pour communiquer dans la vie quotidienne.

Continue comme ça ! 💪"""
    
    # VOCABULAIRE - FAMILLE
    elif any(mot in message_lower for mot in ['famille', 'mère', 'père', 'frère', 'sœur', 'parents', 'grand-parents']):
        return """Excellente question ! ✨

La famille, ce sont les personnes avec qui on vit ou qui sont proches de nous.

**Les membres de la famille :**
- **Père / Papa** : le père
- **Mère / Maman** : la mère
- **Parents** : le père et la mère ensemble
- **Frère** : garçon de la famille
- **Sœur** : fille de la famille
- **Grand-père / Papi** : le père du père ou de la mère
- **Grand-mère / Mamie** : la mère du père ou de la mère
- **Grands-parents** : le grand-père et la grand-mère
- **Oncle** : frère du père ou de la mère
- **Tante** : sœur du père ou de la mère
- **Cousin** : fils de l'oncle ou de la tante
- **Cousine** : fille de l'oncle ou de la tante
- **Fils** : garçon enfant
- **Fille** : fille enfant
- **Enfant** : fils ou fille

**Exemples :**
- "Mon père s'appelle Jean." (My father is called Jean)
- "J'ai deux sœurs." (I have two sisters)
- "Mes grands-parents habitent à Paris." (My grandparents live in Paris)

**Attention aux genres :**
- "Mon frère" (masculin)
- "Ma sœur" (féminin)
- "Mes parents" (pluriel)

En résumé : la famille, ce sont les personnes proches de nous (père, mère, frères, sœurs, etc.).

Continue comme ça ! 💪"""
    
    # VOCABULAIRE - CORPS HUMAIN
    elif any(mot in message_lower for mot in ['corps', 'tête', 'main', 'pied', 'bras', 'jambe', 'yeux', 'nez', 'bouche']):
        return """Excellente question ! ✨

Le corps humain, ce sont toutes les parties de notre corps.

**Les parties du corps :**
- **Tête** : partie supérieure du corps
- **Yeux** : pour voir
- **Nez** : pour sentir
- **Bouche** : pour manger et parler
- **Oreilles** : pour entendre
- **Cou** : entre la tête et le corps
- **Épaules** : en haut des bras
- **Bras** : membres supérieurs
- **Mains** : au bout des bras (5 doigts)
- **Doigts** : sur les mains
- **Poitrine** : devant le haut du corps
- **Ventre** : devant le bas du corps
- **Dos** : derrière le corps
- **Jambes** : membres inférieurs
- **Genoux** : au milieu des jambes
- **Pieds** : au bout des jambes
- **Orteils** : sur les pieds

**Exemples :**
- "J'ai mal à la tête." (I have a headache)
- "Je lève les bras." (I raise my arms)
- "Je marche avec mes pieds." (I walk with my feet)

**Attention aux genres :**
- "Le bras" (masculin)
- "La main" (féminin)
- "Les yeux" (pluriel, masculin)
- "Les jambes" (pluriel, féminin)

En résumé : le corps humain a beaucoup de parties (tête, bras, jambes, etc.).

Continue comme ça ! 💪"""
    
    # VOCABULAIRE - NOURRITURE
    elif any(mot in message_lower for mot in ['nourriture', 'manger', 'aliment', 'aliments', 'repas', 'pain', 'eau', 'viande', 'légume', 'fruit']):
        return """Excellente question ! ✨

La nourriture, ce sont les aliments qu'on mange pour vivre.

**Les aliments de base :**
- **Pain** : aliment fait avec de la farine
- **Eau** : boisson essentielle
- **Lait** : boisson blanche
- **Œufs** : aliments ronds
- **Fromage** : aliment fait avec du lait
- **Beurre** : pour tartiner

**Les fruits :**
- **Pomme** : fruit rond et rouge/vert
- **Banane** : fruit jaune et long
- **Orange** : fruit orange
- **Raisin** : petits fruits ronds
- **Fraise** : fruit rouge

**Les légumes :**
- **Carotte** : légume orange
- **Tomate** : légume rouge
- **Salade** : légume vert
- **Pomme de terre** : légume blanc
- **Oignon** : légume blanc/jaune

**La viande :**
- **Poulet** : viande de poulet
- **Bœuf** : viande de vache
- **Porc** : viande de cochon
- **Poisson** : viande de poisson

**Les repas :**
- **Petit-déjeuner** : repas du matin
- **Déjeuner** : repas de midi
- **Dîner** : repas du soir
- **Goûter** : collation de l'après-midi

**Exemples :**
- "Je mange une pomme." (I eat an apple)
- "Je bois de l'eau." (I drink water)
- "Le petit-déjeuner est important." (Breakfast is important)

En résumé : la nourriture, ce sont tous les aliments qu'on mange (fruits, légumes, viande, pain, etc.).

Continue comme ça ! 💪"""
    
    # SITUATIONS - AU RESTAURANT
    elif any(mot in message_lower for mot in ['restaurant', 'commander', 'menu', 'addition', 'serveur', 'manger au restaurant']):
        return """Excellente question ! ✨

Au restaurant, on va manger et on doit savoir parler français.

**Phrases utiles au restaurant :**

**Arriver :**
- "Bonjour, une table pour deux, s'il vous plaît." (Hello, a table for two, please)
- "Avez-vous une table libre ?" (Do you have a free table?)

**Regarder le menu :**
- "Je voudrais voir le menu, s'il vous plaît." (I would like to see the menu, please)
- "Qu'est-ce que vous recommandez ?" (What do you recommend?)

**Commander :**
- "Je voudrais..." (I would like...)
- "Pour moi, je prends..." (For me, I'll have...)
- "Je voudrais commander..." (I would like to order...)

**Pendant le repas :**
- "C'est délicieux !" (It's delicious!)
- "L'eau, s'il vous plaît." (Water, please)
- "Du pain, s'il vous plaît." (Bread, please)

**Payer :**
- "L'addition, s'il vous plaît." (The bill, please)
- "Je peux payer par carte ?" (Can I pay by card?)
- "C'est combien ?" (How much is it?)

**Vocabulaire :**
- **Menu** : liste des plats
- **Serveur / Serveuse** : personne qui sert
- **Plat** : nourriture
- **Entrée** : premier plat
- **Plat principal** : plat principal
- **Dessert** : dernier plat (sucré)
- **Addition** : facture à payer

**Exemple de conversation :**
Serveur : "Bonjour, que désirez-vous ?"
Vous : "Bonjour, je voudrais un steak-frites, s'il vous plaît."
Serveur : "Très bien, et comme boisson ?"
Vous : "Une eau, s'il vous plaît."

En résumé : au restaurant, on utilise des phrases polies pour commander et payer.

Continue comme ça ! 💪"""
    
    # SITUATIONS - AU MAGASIN
    elif any(mot in message_lower for mot in ['magasin', 'acheter', 'vendre', 'prix', 'coûter', 'payer', 'faire les courses']):
        return """Excellente question ! ✨

Au magasin, on va acheter des choses et on doit savoir parler français.

**Phrases utiles au magasin :**

**Entrer :**
- "Bonjour !" (Hello!)
- "Je cherche..." (I'm looking for...)

**Demander :**
- "Avez-vous..." (Do you have...)
- "Où se trouve..." (Where is...)
- "Combien ça coûte ?" (How much does it cost?)
- "C'est combien ?" (How much is it?)

**Répondre :**
- "Oui, nous avons..." (Yes, we have...)
- "Non, désolé(e), nous n'avons pas..." (No, sorry, we don't have...)
- "C'est..." (It's...)

**Acheter :**
- "Je voudrais acheter..." (I would like to buy...)
- "Je prends celui-ci." (I'll take this one)
- "C'est tout, merci." (That's all, thank you)

**Payer :**
- "Je peux payer par carte ?" (Can I pay by card?)
- "Je paie en espèces." (I pay in cash)
- "Voici..." (Here is...)

**Vocabulaire :**
- **Magasin** : lieu où on achète
- **Acheter** : donner de l'argent pour avoir quelque chose
- **Vendre** : donner quelque chose contre de l'argent
- **Prix** : coût, montant d'argent
- **Coûter** : avoir un prix
- **Payer** : donner de l'argent
- **Caisse** : endroit où on paie
- **Carte bancaire** : carte pour payer
- **Espèces** : argent en billets et pièces

**Exemple de conversation :**
Vous : "Bonjour, avez-vous du pain ?"
Vendeur : "Oui, c'est là-bas."
Vous : "Combien ça coûte ?"
Vendeur : "2 euros."
Vous : "Je le prends, merci."

En résumé : au magasin, on utilise des phrases pour demander, acheter et payer.

Continue comme ça ! 💪"""
    
    # VOCABULAIRE - COULEURS
    elif any(mot in message_lower for mot in ['couleur', 'couleurs', 'rouge', 'bleu', 'vert', 'jaune', 'noir', 'blanc']):
        return """Excellente question ! ✨

Les couleurs, ce sont les différentes teintes qu'on voit.

**Les couleurs principales :**
- **Rouge** : couleur du sang, de la tomate
- **Bleu** : couleur du ciel, de la mer
- **Vert** : couleur de l'herbe, des arbres
- **Jaune** : couleur du soleil, du citron
- **Orange** : couleur de l'orange (fruit)
- **Violet** : couleur du raisin
- **Rose** : couleur de la rose (fleur)
- **Noir** : couleur de la nuit
- **Blanc** : couleur de la neige, du lait
- **Gris** : couleur entre noir et blanc
- **Marron** : couleur du chocolat, du bois
- **Beige** : couleur claire, sable

**Exemples :**
- "Le ciel est bleu." (The sky is blue)
- "La tomate est rouge." (The tomato is red)
- "L'herbe est verte." (The grass is green)

**Attention :**
Les adjectifs de couleur s'accordent avec le nom :
- "Une voiture rouge" (féminin)
- "Un livre rouge" (masculin)
- "Des voitures rouges" (pluriel)

**Sauf :**
- Les couleurs qui viennent d'un nom ne s'accordent pas :
  - "Une voiture orange" (orange vient du fruit)
  - "Une voiture marron" (marron vient du fruit)

En résumé : les couleurs décrivent l'apparence des choses (rouge, bleu, vert, etc.).

Continue comme ça ! 💪"""
    
    # VOCABULAIRE - JOURS ET MOIS
    elif any(mot in message_lower for mot in ['jour', 'jours', 'semaine', 'mois', 'lundi', 'mardi', 'janvier', 'février', 'date']):
        return """Excellente question ! ✨

Les jours et les mois, c'est pour dire la date et organiser le temps.

**Les jours de la semaine :**
- **Lundi** : premier jour de la semaine
- **Mardi** : deuxième jour
- **Mercredi** : troisième jour
- **Jeudi** : quatrième jour
- **Vendredi** : cinquième jour
- **Samedi** : sixième jour
- **Dimanche** : septième jour (week-end)

**Les mois de l'année :**
- **Janvier** : premier mois
- **Février** : deuxième mois
- **Mars** : troisième mois
- **Avril** : quatrième mois
- **Mai** : cinquième mois
- **Juin** : sixième mois
- **Juillet** : septième mois
- **Août** : huitième mois
- **Septembre** : neuvième mois
- **Octobre** : dixième mois
- **Novembre** : onzième mois
- **Décembre** : douzième mois

**Dire la date :**
- "Aujourd'hui, c'est lundi." (Today is Monday)
- "Nous sommes le 15 janvier." (Today is January 15th)
- "C'est quel jour ?" (What day is it?)

**Vocabulaire :**
- **Aujourd'hui** : ce jour
- **Demain** : le jour suivant
- **Hier** : le jour précédent
- **Semaine** : 7 jours
- **Mois** : environ 30 jours
- **Année** : 12 mois

**Exemples :**
- "Je vais au cinéma lundi." (I'm going to the cinema on Monday)
- "Mon anniversaire est en janvier." (My birthday is in January)
- "Nous sommes en 2024." (We are in 2024)

En résumé : les jours et les mois servent à organiser le temps et dire les dates.

Continue comme ça ! 💪"""
    
    # VOCABULAIRE - VÊTEMENTS
    elif any(mot in message_lower for mot in ['vêtement', 'vêtements', 'habits', 'chemise', 'pantalon', 'robe', 'chaussures', 's\'habiller']):
        return """Excellente question ! ✨

Les vêtements, ce sont les habits qu'on porte sur le corps.

**Les vêtements :**
- **Chemise** : vêtement du haut avec des boutons
- **T-shirt** : vêtement du haut simple
- **Pantalon** : vêtement du bas (2 jambes)
- **Robe** : vêtement pour les femmes (haut et bas ensemble)
- **Jupe** : vêtement du bas pour les femmes
- **Chaussures** : pour les pieds
- **Chaussettes** : pour les pieds (sous les chaussures)
- **Manteau** : vêtement chaud pour l'hiver
- **Veste** : vêtement du haut
- **Chapeau** : pour la tête
- **Gants** : pour les mains

**Exemples :**
- "Je porte une chemise bleue." (I'm wearing a blue shirt)
- "J'ai besoin de chaussures." (I need shoes)
- "Il fait froid, je mets un manteau." (It's cold, I'm putting on a coat)

**Verbes :**
- **Porter** : avoir sur soi
- **Mettre** : mettre sur soi
- **Enlever** : retirer
- **S'habiller** : mettre ses vêtements

En résumé : les vêtements, ce sont les habits qu'on porte (chemise, pantalon, chaussures, etc.).

Continue comme ça ! 💪"""
    
    # VOCABULAIRE - MAISON
    elif any(mot in message_lower for mot in ['maison', 'appartement', 'chambre', 'cuisine', 'salle de bain', 'salon', 'pièce']):
        return """Excellente question ! ✨

La maison, c'est l'endroit où on habite.

**Les pièces de la maison :**
- **Chambre** : pièce pour dormir
- **Cuisine** : pièce pour cuisiner
- **Salon** : pièce pour se détendre
- **Salle de bain** : pièce pour se laver
- **Salle à manger** : pièce pour manger
- **Bureau** : pièce pour travailler
- **Cave** : pièce sous la maison
- **Grenier** : pièce sous le toit

**Les meubles :**
- **Lit** : pour dormir
- **Table** : pour manger ou travailler
- **Chaise** : pour s'asseoir
- **Armoire** : pour ranger les vêtements
- **Réfrigérateur** : pour garder la nourriture froide
- **Four** : pour cuisiner
- **Canapé** : grand siège pour le salon
- **Télévision** : pour regarder

**Exemples :**
- "Je dors dans ma chambre." (I sleep in my bedroom)
- "Je cuisine dans la cuisine." (I cook in the kitchen)
- "Je regarde la télévision dans le salon." (I watch TV in the living room)

En résumé : la maison a plusieurs pièces (chambre, cuisine, salon, etc.) avec des meubles.

Continue comme ça ! 💪"""
    
    # VOCABULAIRE - TRANSPORT
    elif any(mot in message_lower for mot in ['transport', 'voiture', 'bus', 'train', 'avion', 'vélo', 'marcher', 'aller']):
        return """Excellente question ! ✨

Le transport, c'est comment on se déplace d'un endroit à un autre.

**Les moyens de transport :**
- **Voiture** : véhicule à 4 roues
- **Bus** : grand véhicule pour beaucoup de personnes
- **Train** : véhicule sur des rails
- **Métro** : train sous la terre
- **Avion** : véhicule qui vole
- **Vélo** : véhicule à 2 roues avec pédales
- **Moto** : véhicule à 2 roues avec moteur
- **Bateau** : véhicule sur l'eau
- **Marcher** : aller à pied

**Verbes :**
- **Aller** : se déplacer
- **Venir** : arriver
- **Partir** : quitter un endroit
- **Arriver** : atteindre un endroit
- **Prendre** : utiliser un transport
- "Je prends le bus." (I take the bus)

**Exemples :**
- "Je vais à Paris en train." (I go to Paris by train)
- "Je prends ma voiture pour aller au travail." (I take my car to go to work)
- "Je marche jusqu'à l'école." (I walk to school)

**Questions :**
- "Comment allez-vous à Paris ?" (How do you go to Paris?)
- "Je vais en voiture." (I go by car)

En résumé : le transport, ce sont les moyens de se déplacer (voiture, bus, train, etc.).

Continue comme ça ! 💪"""
    
    # VOCABULAIRE - MÉTIERS
    elif any(mot in message_lower for mot in ['métier', 'métiers', 'travail', 'profession', 'médecin', 'professeur', 'ingénieur', 'cuisinier']):
        return """Excellente question ! ✨

Un métier, c'est le travail qu'on fait pour gagner de l'argent.

**Les métiers :**
- **Professeur / Professeure** : enseigne aux élèves
- **Médecin** : soigne les malades
- **Infirmier / Infirmière** : aide le médecin
- **Ingénieur** : travaille avec la technique
- **Cuisinier / Cuisinière** : prépare la nourriture
- **Serveur / Serveuse** : sert dans un restaurant
- **Vendeur / Vendeuse** : vend dans un magasin
- **Policier / Policière** : protège les gens
- **Pompier** : éteint les incendies
- **Avocat / Avocate** : défend les gens en justice
- **Journaliste** : écrit dans les journaux
- **Artiste** : crée des œuvres d'art
- **Étudiant / Étudiante** : apprend à l'école

**Questions :**
- "Quel est votre métier ?" (What is your job?)
- "Que faites-vous dans la vie ?" (What do you do for a living?)
- "Je suis professeur." (I am a teacher)

**Exemples :**
- "Mon père est médecin." (My father is a doctor)
- "Je veux devenir ingénieur." (I want to become an engineer)
- "Elle travaille comme cuisinière." (She works as a cook)

En résumé : un métier, c'est le travail qu'on fait (professeur, médecin, cuisinier, etc.).

Continue comme ça ! 💪"""
    
    # VOCABULAIRE - ÉCOLE
    elif any(mot in message_lower for mot in ['école', 'classe', 'élève', 'professeur', 'cours', 'devoir', 'examen', 'apprendre']):
        return """Excellente question ! ✨

L'école, c'est l'endroit où on apprend.

**Vocabulaire de l'école :**
- **École** : lieu où on apprend
- **Classe** : groupe d'élèves
- **Élève** : personne qui apprend
- **Professeur / Professeure** : personne qui enseigne
- **Cours** : leçon
- **Devoir** : travail à faire à la maison
- **Examen** : test pour vérifier ce qu'on sait
- **Cahier** : livre pour écrire
- **Stylo** : pour écrire
- **Crayon** : pour écrire (avec mine)
- **Gomme** : pour effacer
- **Règle** : pour tracer des lignes
- **Cartable** : sac pour porter les affaires

**Les matières :**
- **Français** : langue française
- **Mathématiques** : calculs, nombres
- **Histoire** : le passé
- **Géographie** : les pays, les villes
- **Sciences** : expériences
- **Anglais** : langue anglaise

**Phrases utiles :**
- "Je vais à l'école." (I go to school)
- "J'ai cours de français." (I have French class)
- "Je fais mes devoirs." (I do my homework)
- "J'ai un examen demain." (I have an exam tomorrow)

**Exemples :**
- "Mon professeur de français est très gentil." (My French teacher is very nice)
- "J'aime les mathématiques." (I like mathematics)
- "Je dois faire mes devoirs." (I must do my homework)

En résumé : l'école, c'est où on apprend avec un professeur, des cours et des devoirs.

Continue comme ça ! 💪"""
    
    # GRAMMAIRE - NÉGATION
    elif any(mot in message_lower for mot in ['négation', 'ne pas', 'ne...pas', 'pas de', 'jamais', 'rien', 'personne']):
        return """Excellente question ! ✨

La négation, c'est dire "non" ou "pas".

**La négation avec "ne...pas" :**
- "Je ne mange pas." (I don't eat)
- "Tu ne parles pas." (You don't speak)
- "Il ne vient pas." (He doesn't come)

**Règle :**
On met "ne" avant le verbe et "pas" après le verbe.

**Avec "être" et "avoir" :**
- "Je ne suis pas fatigué." (I'm not tired)
- "Je n'ai pas de livre." (I don't have a book)

**Attention :**
- "Ne" devient "n'" devant une voyelle :
  - "Je n'aime pas" (pas "je ne aime pas")
  - "Il n'est pas" (pas "il ne est pas")

**Autres négations :**
- **Ne...jamais** : jamais
  - "Je ne vais jamais au cinéma." (I never go to the cinema)
- **Ne...rien** : rien
  - "Je ne comprends rien." (I understand nothing)
- **Ne...personne** : personne
  - "Je ne vois personne." (I see nobody)
- **Ne...plus** : plus
  - "Je ne mange plus." (I don't eat anymore)

**Exemples :**
- "Je ne veux pas de café." (I don't want coffee)
- "Il n'a jamais vu Paris." (He has never seen Paris)
- "Nous ne faisons rien." (We do nothing)

En résumé : la négation, c'est dire "non" avec "ne...pas" ou d'autres mots (jamais, rien, personne).

Continue comme ça ! 💪"""
    
    # GRAMMAIRE - QUESTIONS
    elif any(mot in message_lower for mot in ['question', 'questions', 'comment poser', 'interrogatif', 'qui', 'quoi', 'où', 'quand', 'pourquoi', 'comment']):
        return """Excellente question ! ✨

Les questions, c'est demander quelque chose.

**Les mots interrogatifs :**
- **Qui ?** : qui (personne)
  - "Qui est-ce ?" (Who is it?)
- **Quoi ? / Qu'est-ce que ?** : quoi (chose)
  - "Qu'est-ce que c'est ?" (What is it?)
- **Où ?** : où (lieu)
  - "Où vas-tu ?" (Where are you going?)
- **Quand ?** : quand (temps)
  - "Quand arrives-tu ?" (When do you arrive?)
- **Pourquoi ?** : pourquoi (raison)
  - "Pourquoi es-tu triste ?" (Why are you sad?)
- **Comment ?** : comment (manière)
  - "Comment vas-tu ?" (How are you?)
- **Combien ?** : combien (quantité)
  - "Combien ça coûte ?" (How much does it cost?)

**Former une question :**

1. **Avec "est-ce que" :**
   - "Est-ce que tu viens ?" (Are you coming?)
   - "Est-ce qu'il mange ?" (Is he eating?)

2. **Inversion :**
   - "Viens-tu ?" (Are you coming?)
   - "Mange-t-il ?" (Is he eating?)

3. **Avec intonation :**
   - "Tu viens ?" (You're coming?) - on monte la voix à la fin

**Exemples :**
- "Où habites-tu ?" (Where do you live?)
- "Quand pars-tu ?" (When are you leaving?)
- "Comment t'appelles-tu ?" (What's your name?)
- "Pourquoi pleures-tu ?" (Why are you crying?)

En résumé : les questions, c'est demander avec des mots interrogatifs (qui, quoi, où, quand, pourquoi, comment).

Continue comme ça ! 💪"""
    
    # GRAMMAIRE - COMPLÉMENTS D'OBJET
    elif any(mot in message_lower for mot in ['complément', 'compléments', 'objet direct', 'objet indirect', 'cod', 'coi']):
        return """Excellente question ! ✨

Un complément, c'est un mot qui complète le verbe.

**Complément d'objet direct (COD) :**
C'est ce sur quoi porte directement l'action.

**Exemples :**
- "Je mange **une pomme**." (une pomme = COD)
- "Tu lis **un livre**." (un livre = COD)
- "Il voit **le chat**." (le chat = COD)

**Comment trouver le COD ?**
On pose la question "Quoi ?" ou "Qui ?" après le verbe :
- "Je mange **quoi ?**" → "Une pomme" (COD)
- "Tu vois **qui ?**" → "Le chat" (COD)

**Complément d'objet indirect (COI) :**
C'est ce sur quoi porte indirectement l'action, avec une préposition (à, de).

**Exemples :**
- "Je parle **à mon ami**." (à mon ami = COI)
- "Tu penses **à tes parents**." (à tes parents = COI)
- "Il téléphone **à sa mère**." (à sa mère = COI)

**Comment trouver le COI ?**
On pose la question "À qui ?" ou "À quoi ?" après le verbe :
- "Je parle **à qui ?**" → "À mon ami" (COI)

**Différence :**
- COD : directement, sans préposition
  - "Je mange une pomme." (pas de préposition)
- COI : indirectement, avec préposition (à, de)
  - "Je parle à mon ami." (avec "à")

**Exemples :**
- "Je donne un livre **à Marie**." (un livre = COD, à Marie = COI)
- "Tu écris une lettre **à ton ami**." (une lettre = COD, à ton ami = COI)

En résumé : le complément complète le verbe (COD directement, COI avec préposition).

Continue comme ça ! 💪"""
    
    # GRAMMAIRE - ADVERBES
    elif any(mot in message_lower for mot in ['adverbe', 'adverbes', 'bien', 'mal', 'vite', 'lentement', 'beaucoup', 'peu']):
        return """Excellente question ! ✨

Un adverbe, c'est un mot qui modifie un verbe, un adjectif ou un autre adverbe.

**Les adverbes de manière (comment) :**
- **Bien** : bien
  - "Je parle bien français." (I speak French well)
- **Mal** : mal
  - "Il chante mal." (He sings badly)
- **Vite** : rapidement
  - "Elle court vite." (She runs fast)
- **Lentement** : doucement
  - "Il marche lentement." (He walks slowly)
- **Facilement** : sans difficulté
  - "J'apprends facilement." (I learn easily)

**Les adverbes de quantité :**
- **Beaucoup** : beaucoup
  - "J'aime beaucoup le français." (I like French a lot)
- **Peu** : peu
  - "Je comprends peu." (I understand little)
- **Assez** : suffisamment
  - "J'ai assez mangé." (I've eaten enough)
- **Trop** : trop
  - "C'est trop cher." (It's too expensive)

**Les adverbes de temps :**
- **Aujourd'hui** : aujourd'hui
  - "Je vais à Paris aujourd'hui." (I'm going to Paris today)
- **Demain** : demain
  - "Je viens demain." (I'm coming tomorrow)
- **Hier** : hier
  - "J'étais là hier." (I was there yesterday)
- **Maintenant** : maintenant
  - "Je mange maintenant." (I'm eating now)
- **Souvent** : souvent
  - "Je vais souvent au cinéma." (I often go to the cinema)
- **Toujours** : toujours
  - "Je suis toujours content." (I'm always happy)
- **Jamais** : jamais
  - "Je ne vais jamais là-bas." (I never go there)

**Les adverbes de lieu :**
- **Ici** : ici
  - "Je suis ici." (I'm here)
- **Là** : là
  - "Je vais là." (I'm going there)
- **Partout** : partout
  - "Je cherche partout." (I'm looking everywhere)

**Place de l'adverbe :**
- Après le verbe : "Je parle bien."
- Avant l'adjectif : "C'est très beau."
- Après le COD : "Je mange beaucoup de pain."

En résumé : un adverbe modifie un verbe, un adjectif ou un autre adverbe (bien, mal, vite, beaucoup, etc.).

Continue comme ça ! 💪"""
    
    # GRAMMAIRE - CONJONCTIONS
    elif any(mot in message_lower for mot in ['conjonction', 'conjonctions', 'et', 'ou', 'mais', 'donc', 'car', 'parce que']):
        return """Excellente question ! ✨

Une conjonction, c'est un mot qui relie deux phrases ou deux mots.

**Les conjonctions principales :**
- **Et** : et (addition)
  - "Je mange et je bois." (I eat and I drink)
- **Ou** : ou (choix)
  - "Tu veux du café ou du thé ?" (Do you want coffee or tea?)
- **Mais** : mais (opposition)
  - "Je suis fatigué mais je continue." (I'm tired but I continue)
- **Donc** : donc (conséquence)
  - "Il pleut, donc je reste à la maison." (It's raining, so I stay home)
- **Car / Parce que** : car / parce que (cause)
  - "Je reste car il pleut." (I stay because it's raining)
  - "Je reste parce qu'il pleut." (I stay because it's raining)

**Autres conjonctions :**
- **Quand** : quand (temps)
  - "Je viens quand tu veux." (I come when you want)
- **Si** : si (condition)
  - "Si tu viens, je serai content." (If you come, I'll be happy)
- **Comme** : comme (comparaison)
  - "Il est grand comme son père." (He is tall like his father)
- **Puisque** : puisque (cause)
  - "Puisque tu es là, restons." (Since you're here, let's stay)

**Exemples :**
- "Je mange **et** je bois." (et = addition)
- "Tu veux du café **ou** du thé ?" (ou = choix)
- "Je suis fatigué **mais** je continue." (mais = opposition)
- "Il pleut, **donc** je reste." (donc = conséquence)
- "Je reste **parce qu'**il pleut." (parce que = cause)

**Attention :**
- "Parce que" devient "parce qu'" devant une voyelle :
  - "Parce qu'il pleut" (pas "parce que il pleut")

En résumé : une conjonction relie des mots ou des phrases (et, ou, mais, donc, parce que).

Continue comme ça ! 💪"""
    
    # Détection de questions générales "c'est quoi", "qu'est-ce que"
    elif any(mot in message_lower for mot in ['c\'est quoi', 'qu\'est-ce que', 'qu\'est ce que', 'explique', 'définition']):
        # Extrait le sujet de la question
        sujet = message
        for mot in ['c\'est quoi', 'qu\'est-ce que', 'qu\'est ce que', 'explique', 'définition', 'définis', 'définir']:
            sujet = sujet.replace(mot, '').strip()
        sujet = sujet.replace('?', '').strip()
        sujet_lower = sujet.lower().strip()
        
        # LISTE TRÈS COMPLÈTE pour détecter les questions sur le français
        mots_francais_complets = [
            'français', 'francais', 'france', 'langue', 'française', 'francaise',
            'verbe', 'verbes', 'conjugaison', 'conjuguer', 'conjugue', 'conjugué', 'conjuguée',
            'grammaire', 'orthographe', 'vocabulaire', 'syntaxe', 'prononciation', 'phonétique',
            'accent', 'accents', 'é', 'è', 'ê', 'à', 'ù', 'ç', 'cédille',
            'pluriel', 'pluriels', 'singulier', 'genres', 'genre', 'masculin', 'féminin',
            'article', 'articles', 'le', 'la', 'les', 'un', 'une', 'des',
            'pronom', 'pronoms', 'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles',
            'adjectif', 'adjectifs', 'grand', 'petit', 'beau', 'joli',
            'synonyme', 'synonymes', 'antonyme', 'antonymes', 'contraire', 'opposé',
            'phrase', 'phrases', 'syntaxe', 'structure',
            'temps', 'présent', 'passé', 'futur', 'imparfait', 'conditionnel', 'subjonctif',
            'passé composé', 'plus-que-parfait', 'futur antérieur',
            'être', 'avoir', 'faire', 'aller', 'venir', 'pouvoir', 'vouloir', 'savoir',
            'irrégulier', 'irréguliers', 'régulier', 'réguliers',
            'préposition', 'prépositions', 'à', 'de', 'dans', 'sur', 'sous', 'avec', 'sans', 'pour', 'par',
            'nombre', 'nombres', 'chiffre', 'chiffres', 'compter', 'un', 'deux', 'trois',
            'écrire', 'lire', 'parler', 'écouter', 'comprendre', 'apprendre',
            'mot', 'mots', 'lettre', 'lettres', 'alphabet', 'abc',
            'règle', 'règles', 'exception', 'exceptions',
            'accord', 'accords', 'accorder', 's\'accorder',
            'complément', 'compléments', 'sujet', 'sujets',
            'déclaration', 'interrogation', 'exclamation', 'impératif',
            'voyelle', 'voyelles', 'consonne', 'consonnes',
            'son', 'sons', 'prononcer', 'dire', 'parler',
            # Nouveaux ajouts
            'expression', 'expressions', 'phrase utile', 'phrases utiles',
            'famille', 'mère', 'père', 'frère', 'sœur', 'parents', 'grand-parents',
            'corps', 'tête', 'main', 'pied', 'bras', 'jambe', 'yeux', 'nez', 'bouche',
            'nourriture', 'manger', 'aliment', 'aliments', 'repas', 'pain', 'eau', 'viande', 'légume', 'fruit',
            'restaurant', 'commander', 'menu', 'addition', 'serveur',
            'magasin', 'acheter', 'vendre', 'prix', 'coûter', 'payer',
            'couleur', 'couleurs', 'rouge', 'bleu', 'vert', 'jaune', 'noir', 'blanc',
            'jour', 'jours', 'semaine', 'mois', 'lundi', 'mardi', 'janvier', 'février', 'date',
            'vêtement', 'vêtements', 'habits', 'chemise', 'pantalon', 'robe', 'chaussures',
            'maison', 'appartement', 'chambre', 'cuisine', 'salle de bain', 'salon',
            'transport', 'voiture', 'bus', 'train', 'avion', 'vélo',
            'métier', 'métiers', 'travail', 'profession', 'médecin', 'ingénieur', 'cuisinier',
            'école', 'classe', 'élève', 'cours', 'devoir', 'examen',
            'négation', 'ne pas', 'ne...pas', 'jamais', 'rien', 'personne',
            'question', 'questions', 'interrogatif', 'qui', 'quoi', 'où', 'quand', 'pourquoi', 'comment',
            'objet direct', 'objet indirect', 'cod', 'coi',
            'adverbe', 'adverbes', 'bien', 'mal', 'vite', 'lentement', 'beaucoup', 'peu',
            'conjonction', 'conjonctions', 'et', 'ou', 'mais', 'donc', 'car', 'parce que'
        ]
        
        # Si c'est une question sur le français, répondre directement avec une réponse complète
        if any(mot_fr in sujet_lower for mot_fr in mots_francais_complets):
            # Essayer de donner une réponse spécifique selon le sujet
            if any(m in sujet_lower for m in ['verbe', 'conjugaison', 'conjuguer']):
                return """Excellente question ! ✨

Un verbe, c'est un mot qui exprime une action ou un état.

**Exemples de verbes :**
- Manger (action)
- Dormir (action)
- Être (état)
- Avoir (état)

**La conjugaison, c'est changer le verbe selon :**
- Qui fait l'action (je, tu, il, elle, nous, vous, ils, elles)
- Quand ça se passe (présent, passé, futur)

**Exemple avec "manger" au présent :**
- Je mange
- Tu manges
- Il/Elle mange
- Nous mangeons
- Vous mangez
- Ils/Elles mangent

**Les groupes de verbes :**
- 1er groupe : verbes en -er (manger, parler, aimer)
- 2e groupe : verbes en -ir (finir, choisir)
- 3e groupe : verbes irréguliers (être, avoir, faire)

En résumé : un verbe exprime une action ou un état, et on le conjugue selon qui fait l'action et quand.

Continue comme ça ! 💪"""
            elif any(m in sujet_lower for m in ['pluriel', 'pluriels']):
                return """Excellente question ! ✨

Le pluriel, c'est quand il y a plusieurs choses (plus d'une).

**Règle générale :** On ajoute un "s" à la fin
- Un chat → Des chats
- Une table → Des tables
- Un livre → Des livres

**Exceptions importantes :**
1. **Mots en -s, -x, -z** : ne changent pas
   - Un bras → Des bras
   - Un prix → Des prix
   - Un nez → Des nez

2. **Mots en -eau, -eu** : ajoutent "x"
   - Un gâteau → Des gâteaux
   - Un feu → Des feux

3. **Mots en -al** : deviennent "-aux"
   - Un cheval → Des chevaux
   - Un journal → Des journaux

4. **Mots en -ou** : ajoutent "s" (sauf bijou, caillou, chou, genou, hibou, joujou, pou)
   - Un trou → Des trous
   - Un bijou → Des bijoux (exception)

**Les articles changent aussi :**
- Le chat → Les chats
- La table → Les tables
- Un chat → Des chats

En résumé : pour faire le pluriel, on ajoute généralement un "s", mais il y a des exceptions.

Continue comme ça ! 💪"""
            else:
                # Réponse générale mais complète pour le français
                return f"""Excellente question ! ✨

Tu me demandes : "{message}"

Je comprends que tu veux apprendre sur "{sujet}". C'est une question sur le français, et je peux t'aider directement !

**Je suis un professeur de français EXCELLENT et je peux t'expliquer :**

✅ **Grammaire française :**
- Verbes et conjugaison (tous les temps : présent, passé composé, imparfait, futur, conditionnel)
- Genres (masculin/féminin)
- Pluriels et accords
- Articles (le, la, les, un, une, des)
- Pronoms (je, tu, il, elle, nous, vous, ils, elles)
- Adjectifs et leur accord
- Verbes irréguliers (être, avoir, faire, aller, venir, pouvoir, vouloir, savoir)
- Prépositions (à, de, dans, sur, sous, avec, sans, pour, par)

✅ **Orthographe :**
- Accents (é, è, ê, à, ù, ç)
- Règles d'orthographe
- Pluriels et exceptions

✅ **Vocabulaire :**
- Synonymes et antonymes
- Familles de mots
- Expressions courantes

✅ **Syntaxe :**
- Structure des phrases
- Types de phrases (déclarative, interrogative, exclamative, impérative)
- Ordre des mots

✅ **Prononciation :**
- Sons et phonétique
- Règles de prononciation
- Lettres muettes

✅ **Nombres :**
- De 0 à 100 et plus
- Règles spécifiques (70, 80, 90)

**Pose-moi ta question de manière plus précise, par exemple :**
- "C'est quoi un verbe ?"
- "Qu'est-ce que la conjugaison ?"
- "Explique-moi le pluriel"
- "C'est quoi un synonyme ?"
- "Qu'est-ce que le passé composé ?"
- "Comment utiliser les prépositions ?"
- "Comment compter en français ?"

Je suis là pour t'aider à apprendre le français ! Pose-moi ta question maintenant et je te répondrai directement ! 📚✨"""
        
        # Pour les autres sujets, donner une réponse plus utile
        return f"""Excellente question ! ✨

Tu me demandes : "{message}"

Je comprends que tu veux apprendre sur "{sujet}". 

**Je peux t'aider !**

Pour te donner une explication complète et détaillée, j'aurais besoin d'une clé API OpenAI configurée. Mais je peux quand même répondre à beaucoup de questions !

**Pose-moi ta question de manière plus précise, par exemple :**
- "C'est quoi..." (suivi du sujet)
- "Explique-moi..." (suivi du sujet)
- "Comment faire..." (suivi de l'action)

**Si c'est une question sur le français, je peux répondre directement !**
- Grammaire, conjugaison, orthographe, vocabulaire, syntaxe, prononciation
- Tous les temps verbaux, les genres, les pluriels, les accords
- Les accents, les articles, les pronoms, les adjectifs
- Et bien plus encore !

**Pour d'autres sujets :**
Configure une clé API OpenAI dans le fichier .env pour avoir des explications encore plus détaillées.

Mais pour le français, je peux répondre directement ! Pose-moi ta question maintenant ! 📚✨"""
    
    # Réponse par défaut - RÉPONSE PÉDAGOGIQUE MÊME SANS API
    else:
        # Essayer de comprendre et répondre quand même
        message_clean = message.lower().strip()
        
        # Détecter si c'est une question sur le français - LISTE TRÈS COMPLÈTE
        mots_francais = [
            'français', 'francais', 'france', 'langue', 'française', 'francaise',
            'verbe', 'verbes', 'conjugaison', 'conjuguer', 'conjugue', 'conjugué', 'conjuguée',
            'grammaire', 'orthographe', 'vocabulaire', 'syntaxe', 'prononciation', 'phonétique',
            'accent', 'accents', 'é', 'è', 'ê', 'à', 'ù', 'ç', 'cédille',
            'pluriel', 'pluriels', 'singulier', 'genres', 'genre', 'masculin', 'féminin',
            'article', 'articles', 'le', 'la', 'les', 'un', 'une', 'des',
            'pronom', 'pronoms', 'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles',
            'adjectif', 'adjectifs', 'grand', 'petit', 'beau', 'joli',
            'synonyme', 'synonymes', 'antonyme', 'antonymes', 'contraire', 'opposé',
            'phrase', 'phrases', 'syntaxe', 'structure',
            'temps', 'présent', 'passé', 'futur', 'imparfait', 'conditionnel', 'subjonctif',
            'passé composé', 'plus-que-parfait', 'futur antérieur',
            'être', 'avoir', 'faire', 'aller', 'venir', 'pouvoir', 'vouloir', 'savoir',
            'irrégulier', 'irréguliers', 'régulier', 'réguliers',
            'préposition', 'prépositions', 'à', 'de', 'dans', 'sur', 'sous', 'avec', 'sans', 'pour', 'par',
            'nombre', 'nombres', 'chiffre', 'chiffres', 'compter', 'un', 'deux', 'trois',
            'écrire', 'lire', 'parler', 'écouter', 'comprendre', 'apprendre',
            'mot', 'mots', 'lettre', 'lettres', 'alphabet', 'abc',
            'règle', 'règles', 'exception', 'exceptions',
            'accord', 'accords', 'accorder', 's\'accorder',
            'complément', 'compléments', 'sujet', 'sujets',
            'déclaration', 'interrogation', 'exclamation', 'impératif',
            'voyelle', 'voyelles', 'consonne', 'consonnes',
            'son', 'sons', 'prononcer', 'dire', 'parler'
        ]
        
        # Vérifier si c'est une question sur le français
        est_question_francais = any(mot_fr in message_clean for mot_fr in mots_francais)
        
        # Si c'est une question sur le français, répondre directement
        if est_question_francais:
            return f"""Excellente question ! ✨

Tu me demandes : "{message}"

Je comprends ta question ! C'est une question sur le français, et je peux t'aider directement !

**Je suis un professeur de français COMPÉTENT et je peux t'expliquer :**

✅ **Grammaire française :**
- Verbes et conjugaison (tous les temps : présent, passé composé, imparfait, futur, conditionnel)
- Genres (masculin/féminin)
- Pluriels et accords
- Articles (le, la, les, un, une, des)
- Pronoms (je, tu, il, elle, nous, vous, ils, elles)
- Adjectifs et leur accord
- Verbes irréguliers (être, avoir, faire, aller, venir, pouvoir, vouloir, savoir)
- Prépositions (à, de, dans, sur, sous, avec, sans, pour, par)

✅ **Orthographe :**
- Accents (é, è, ê, à, ù, ç)
- Règles d'orthographe
- Pluriels et exceptions

✅ **Vocabulaire :**
- Synonymes et antonymes
- Familles de mots
- Expressions courantes

✅ **Syntaxe :**
- Structure des phrases
- Types de phrases (déclarative, interrogative, exclamative, impérative)
- Ordre des mots

✅ **Prononciation :**
- Sons et phonétique
- Règles de prononciation
- Lettres muettes

✅ **Nombres :**
- De 0 à 100 et plus
- Règles spécifiques (70, 80, 90)

**Pose-moi ta question de manière plus précise, par exemple :**
- "C'est quoi un verbe ?"
- "Comment conjuguer au présent ?"
- "Qu'est-ce que le pluriel ?"
- "Comment utiliser les accents ?"
- "C'est quoi un synonyme ?"
- "Qu'est-ce que le passé composé ?"
- "Comment utiliser les prépositions ?"
- "Comment compter en français ?"

Je suis là pour t'aider à apprendre le français ! Pose-moi ta question maintenant et je te répondrai directement ! 📚✨"""
        
        # Si la question contient des mots-clés simples, donner une réponse de base
        elif any(mot in message_clean for mot in ['quoi', 'qu\'est', 'c\'est', 'explique', 'définis', 'comment', 'pourquoi']):
            return f"""Excellente question ! ✨

Tu me demandes : "{message}"

Je comprends ta question ! 

**Je peux t'aider !**

Pose-moi ta question de manière plus précise, par exemple :
- "C'est quoi le français ?"
- "Explique-moi comment saluer les gens"
- "Comment faire..."
- "Qu'est-ce que..."

**Si c'est une question sur le français, je peux répondre directement !**
- Grammaire, conjugaison, orthographe, vocabulaire, syntaxe, prononciation
- Tous les temps verbaux, les genres, les pluriels, les accords
- Les accents, les articles, les pronoms, les adjectifs
- Et bien plus encore !

**Pour d'autres sujets :**
Configure une clé API OpenAI dans le fichier .env pour avoir des explications encore plus détaillées.

Mais pour le français, je peux répondre directement ! Pose-moi ta question maintenant ! 📚✨"""
        else:
            return "Je suis désolé, je ne peux pas répondre à cette question pour le moment."
    
def get_response_huggingface(message):
    """Utilise Hugging Face pour générer une réponse (alternative gratuite)"""
    try:
        API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium"
        headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
        
        # Pour Hugging Face, on utilise un modèle de dialogue
        payload = {
            "inputs": {
                "past_user_inputs": [],
                "generated_responses": [],
                "text": f"{PROFESSEUR_PROMPT}\n\nQuestion de l'élève: {message}\nRéponse du professeur:"
            }
        }
        
        response = requests.post(API_URL, headers=headers, json=payload)
        result = response.json()
        
        if 'generated_text' in result:
            return result['generated_text'].split("Réponse du professeur:")[-1].strip()
        else:
            return "Cher(e) élève, laisse-moi réfléchir un instant... Pour une meilleure expérience, configure une clé API OpenAI."
    except Exception as e:
        return f"Cher(e) élève, il y a eu un petit souci technique : {str(e)}. Peux-tu réessayer ?"

@app.route('/')
def index():
    """Page principale"""
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    """Endpoint pour recevoir les messages et retourner les réponses"""
    try:
        data = request.json
        message = data.get('message', '')
        conversation_history = data.get('history', [])
        session_id = data.get('session_id', str(uuid.uuid4()))
        
        if not message:
            return jsonify({'error': 'Message vide'}), 400
        
        # Répondre aux calculs mathématiques en priorité (sans appeler l'API)
        response = reponse_calcul_if_any(message)
        if response is None:
            # Choisir quelle API utiliser
            if OPENAI_API_KEY and OPENAI_API_KEY != "sk-votre_cle_ici":
                response = get_response_openai(message, conversation_history)
            elif HUGGINGFACE_API_KEY:
                response = get_response_huggingface(message)
            else:
                # Mode démonstration avec réponses basiques mais pédagogiques
                response = get_response_demo(message)
        
        # Sauvegarder dans la base de données propre à l'IA (PostgreSQL IAscience)
        conn = get_db_connection()
        if conn:
            try:
                cur = conn.cursor()
                
                # Créer ou mettre à jour la session
                cur.execute("""
                    INSERT INTO sessions (session_id, last_activity)
                    VALUES (%s, CURRENT_TIMESTAMP)
                    ON CONFLICT (session_id) 
                    DO UPDATE SET last_activity = CURRENT_TIMESTAMP
                """, (session_id,))
                
                # Sauvegarder le message et la réponse
                cur.execute("""
                    INSERT INTO messages (session_id, user_message, bot_response)
                    VALUES (%s, %s, %s)
                """, (session_id, message, response))
                
                # Sauvegarder aussi dans la table conversations (pour historique simple)
                cur.execute("""
                    INSERT INTO conversations (user_message, bot_response)
                    VALUES (%s, %s)
                """, (message, response))
                
                conn.commit()
                cur.close()
                conn.close()
            except Exception as db_error:
                print(f"Erreur lors de la sauvegarde en base: {db_error}")
                # On continue même si la sauvegarde échoue

        # Sauvegarder également la conversation dans la base Diangou (backend Node)
        try:
            log_conversation_to_diangou(session_id, message, response)
        except Exception as log_error:
            # Par sécurité, on ne bloque jamais la réponse pour un problème de log
            print(f"Erreur lors du log dans Diangou: {log_error}")
        
        return jsonify({
            'response': response,
            'success': True,
            'session_id': session_id
        })
    
    except Exception as e:
        return jsonify({
            'error': f'Erreur : {str(e)}',
            'success': False
        }), 500

@app.route('/history/<session_id>', methods=['GET'])
def get_history(session_id):
    """Récupère l'historique d'une session"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Erreur de connexion à la base de données'}), 500
        
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT user_message, bot_response, created_at
            FROM messages
            WHERE session_id = %s
            ORDER BY created_at ASC
        """, (session_id,))
        
        messages = cur.fetchall()
        cur.close()
        conn.close()
        
        return jsonify({
            'messages': [dict(msg) for msg in messages],
            'success': True
        })
    
    except Exception as e:
        return jsonify({
            'error': f'Erreur : {str(e)}',
            'success': False
        }), 500

if __name__ == '__main__':
    # Afficher le mode utilisé au démarrage
    if OPENAI_API_KEY and OPENAI_API_KEY != "sk-votre_cle_ici":
        print("✅ Mode OpenAI activé - Réponses intelligentes complètes")
    elif HUGGINGFACE_API_KEY:
        print("✅ Mode HuggingFace activé")
    else:
        print("📚 Mode démonstration - Réponses pédagogiques intégrées (sans API)")
        print("   Pour des réponses à toute question : ajoutez OPENAI_API_KEY dans .env")
    
    conn = get_db_connection()
    if conn:
        print("✅ Base de données connectée - Historique sauvegardé")
        conn.close()
    else:
        print("ℹ️  Base de données non connectée - L'IA fonctionne sans historique")
        print("   Créez la base IAscience avec database.sql pour sauvegarder les conversations")
    
    print("\n🚀 Serveur IA sur http://127.0.0.1:5000 - Prêt à recevoir des questions !\n")
    app.run(debug=True, host='127.0.0.1', port=5000, threaded=True)

