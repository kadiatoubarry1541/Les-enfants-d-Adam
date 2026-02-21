# Cahier des charges – Plateforme « Les Enfants d’Adam » / Terre ADAM

**Version :** 1.0  
**Projet :** Plateforme communautaire guinéenne – « 1 »  
**Document :** Spécifications fonctionnelles et techniques consolidées

---

## Sommaire

1. [Contexte et objectifs](#1-contexte-et-objectifs)
2. [Rôles et types d’utilisateurs](#2-rôles-et-types-dutilisateurs)
3. [Architecture fonctionnelle et modules](#3-architecture-fonctionnelle-et-modules)
4. [Portail général, authentification et profil](#4-portail-général-authentification-et-profil)
5. [Module Famille et liens de sang](#5-module-famille-et-liens-de-sang)
6. [Module Amis et communauté](#6-module-amis-et-communauté)
7. [Pages thématiques (Santé, Éducation, Science, Sécurité, Activités)](#7-pages-thématiques)
8. [Module Solidarité (Dons, Zaka, Livres de Dieu, Réalité, ONG)](#8-module-solidarité)
9. [Terre ADAM, lieux de résidence et quartiers](#9-terre-adam-lieux-de-résidence-et-quartiers)
10. [Espace professionnel, rendez-vous et notifications](#10-espace-professionnel-rendez-vous-et-notifications)
11. [Régions, pays, gouvernements et organisations](#11-régions-pays-gouvernements-et-organisations)
12. [Échanges (marchés, produits, fournisseurs)](#12-échanges)
13. [IA (Professeur IA, connaissances, conversations)](#13-ia)
14. [Histoire, éducation avancée, badges et gamification](#14-histoire-éducation-badges-et-gamification)
15. [Administration globale](#15-administration-globale)
16. [Exigences techniques (stack, API, sécurité)](#16-exigences-techniques)
17. [Règles transverses (formulaires, UX, accessibilité)](#17-règles-transverses)

---

## 1. Contexte et objectifs

### 1.1 Objectif général

Créer une **plateforme web centralisée** pour :

- **Informer, éduquer et accompagner** les habitants (toutes religions confondues).
- **Mettre en relation** le public avec des professionnels (santé, éducation, science, sécurité, fournisseurs, ONG).
- **Organiser la solidarité** : aide aux pauvres, dons, zakat, rendez-vous, messages.
- **Préserver les liens familiaux** : arbre généalogique, membres vivants et défunts, hommages.
- **Centraliser les services** : échanges commerciaux, santé, éducation, foi, activités sociales, workflow État–citoyen.

### 1.2 Public cible

| Public | Description |
|--------|-------------|
| **Grand public** | Utilisateurs simples (famille, solidarité, contenus, rendez-vous). |
| **Professionnels** | Cliniques, écoles, scientifiques, fournisseurs, journalistes, ONG (après validation admin). |
| **Administrateurs** | Gestion des contenus, validations, gouvernements, badges, modération. |

### 1.3 Contexte géographique et culturel

- Focus **Guinée** (Basse Guinée, Fouta Djallon, Haute Guinée, Guinée forestière) et **diaspora**.
- **Multilingue** : français, anglais, arabe, maninka, pular.
- **NumeroH** : identifiant unique par membre pour traçabilité et lien familial.

---

## 2. Rôles et types d’utilisateurs

### 2.1 Visiteur non connecté

- Consulter la **page d’accueil** (présentation, actualités).
- Accès limité aux contenus publics.
- **Redirection** vers connexion/inscription pour les fonctionnalités complètes.

### 2.2 Utilisateur connecté (compte standard)

- **Profil** : modifier identité, photo, lieux de résidence (1 à 3 quartiers), contacts.
- **Navigation** : Santé, Éducation, Science, Sécurité, Activités, Terre ADAM, Solidarité, Famille, Échanges.
- **Professionnels/ONG** : consulter les listes approuvées, prendre rendez-vous, envoyer des messages (selon flux prévus).
- **Solidarité** : voir la liste des personnes à aider, faire un don, consulter « Mes dons ».
- **Famille** : gérer sa famille, arbre généalogique (section Moi → Mon arbre), fiches vivants/défunts.
- **Contenus** : livres saints, Réalité (vidéos, photos, messages), histoire de l’humanité, à retenir.
- **Notifications** : cloche globale (NotificationBell), rendez-vous, messages.

### 2.3 Professionnel (après validation admin)

- **Types** : clinic, school, scientist, supplier, journalist, ngo, etc.
- **Inscription** : via boutons « S’inscrire » dans chaque page thématique (Santé, Éducation, Science, Échanges, Solidarité/ONG).
- **Après validation** :
  - Visibilité dans les listes publiques correspondantes.
  - Réception des rendez-vous et messages via la plateforme.
- **Pages dédiées** : InscriptionPro, MesComptesPro, EspacePro, PrendreRendezVous (côté utilisateur).

### 2.4 Administrateur

- **Validations** : inscriptions professionnelles (`/api/professionals`).
- **Contenus** : publications Réalité, contenus de foi, livres saints, pauvres, dons.
- **Supervision** : utilisateurs, notifications, rendez-vous, gouvernements, badges, logos.
- **Pages** : AdminDashboard, AdminBadges, AdminGovernments, FamilleAdmin.

---

## 3. Architecture fonctionnelle et modules

Vue d’ensemble des blocs métier et des pages associées.

| Module | Pages principales (frontend) | Routes API principales (backend) |
|--------|-----------------------------|----------------------------------|
| Portail / Compte | Home, Account, UserDashboard, Moi, MonProfil, Communaute | auth |
| Authentification | Login, LoginMembre, Inscription, RegistrationChoice, Identite | auth |
| Famille | Famille, Parents, Enfants, Partenaire, MesAmours, Moi/Arbre, Membres, FamilleAdmin, Inspir | familyTree, parentChild, couple, family |
| Vivants / Défunts | LivingWizard, VideoRegistration, DeceasedWizard, DeceasedWrittenForm, DeceasedVideoRegistration, DeceasedChoice, DeceasedFamilyCheck | userStories, residences |
| Thématiques | Sante, Education, Science, Securite, Activite, Activite1/2/3 | education, science, activities, health |
| Solidarité | Solidarite, Dons, Zaka, ZakaEtDons, LivresDeDieu | faith, reality, additional (PoorPerson, HolyBook, etc.) |
| Terre ADAM | TerreAdam, LieuResidence1/2/3 | residences |
| Pro & Rendez-vous | ListeProfessionnels, EspacePro, MesComptesPro, InscriptionPro, PrendreRendezVous | professionals, appointments, notifications |
| Échanges | EchangesProfessionnel, EchangePrimaire, EchangeNourriture, EchangeMedicament, EchangeSecondaire | exchange |
| Régions / États | Guinee, BasseGuinee, FoutaDjallon, HauteGuinee, GuineeForestiere, Pays, AdminGovernments | regions, governments, stateMessages, stateProducts, organizations, pageAdmins |
| IA | ProfesseurIA, GuideEntrepreneur | ia |
| Histoire / Pédago | Histoire, HistoireHumanite, ARetenir, Reflechissons, Prehistoire, Antiquite | - |
| Badges / Jeux | AdminBadges, intégration UserDashboard / profil | badges, defiEducatif |
| Admin | AdminDashboard, AdminBadges, AdminGovernments | admin, logos |

---

## 4. Portail général, authentification et profil

### 4.1 Objectifs

- Point d’entrée clair (Home).
- Tableau de bord personnel (UserDashboard) avec accès à toutes les sections.
- Connexion et inscription sécurisées, gestion de session (JWT).
- Profil utilisateur complet (identité, avatar, lieux, contacts).

### 4.2 Écrans et routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Accueil, présentation, accès aux rubriques. |
| `/compte` | Account → UserDashboard | Tableau de bord : profil compact (nom, badge, NuméroH, boutons Mon profil / Admin), onglets Terre ADAM, Activité, Échanges, Temps, Science, Éducation ; liens Famille, Santé, Sécurité, Solidarité. |
| `/moi` | Redirection → /compte | - |
| `/moi/profil` | MonProfil | Édition complète du profil (identité, photo, lieux, contacts). |
| `/login` | Login | Connexion (email / mot de passe). |
| `/login-membre` | LoginMembre | Connexion membre famille / communauté. |
| `/inscription` | Inscription | Formulaire d’inscription (prénom, nom, email, mot de passe, etc.). |
| `/choix` | RegistrationChoice | Choix du type d’inscription (simple, famille, accès futur espace pro). |
| `/identite` | Identite | Complétion ou mise à jour de l’identité (date de naissance, sexe, pays, ville, photo). |
| `/communaute` | Communaute | Vue communauté, listes, suggestions d’amis. |

### 4.3 Exigences

- **Sécurité** : mots de passe hashés, token JWT pour routes protégées, redirection vers login si non connecté.
- **UX** : bouton Retour visible, affichage du nom et de la photo de l’utilisateur, accès aux notifications (NotificationBell).
- **Profil** : carte profil compacte (largeur adaptée au contenu), boutons Mon profil et Admin sous le NuméroH.

---

## 5. Module Famille et liens de sang

### 5.1 Objectifs

- Déclarer et visualiser sa **famille** (parents, enfants, partenaire, amours, membres).
- Construire un **arbre généalogique** (vivants et décédés).
- Gérer des **parcours vivants** (texte, vidéo) et **défunts** (hommages, validation par un membre).

### 5.2 Rôles

- **Utilisateur** : gérer sa famille, demander/valider/refuser des liens, créer des fiches vivants/défunts.
- **Admin famille** : gérer les cas complexes, conflits, corrections/fusion d’arbres.

### 5.3 Pages et routes

| Route | Page | Description |
|-------|------|-------------|
| `/famille` | Famille | Hub : cartes Mes Parents, Mon Homme, Ma Femme, Mes Enfants, **Moi** (→ Mon arbre), Mes Amours ; lien Vue Admin si admin. |
| `/famille/moi` | Moi (layout) | Section « Moi » dans Famille, contenu : **Mon arbre**. |
| `/famille/moi/arbre` | Arbre | Arbre généalogique (ArbreGenealogique), onglet Échanges familiaux, Cercle des Racines. |
| `/famille/moi/arbre/membres` | Membres | Liste des membres de l’arbre. |
| `/famille/parents` | Parents | Fiches parents, ajout/édition, demandes de lien. |
| `/famille/enfants` | Enfants | Fiches enfants. |
| `/famille/femmes`, `/famille/mari` | Partenaire | Fiche partenaire. |
| `/famille/mes-amours` | MesAmours | Gestion des amours. |
| `/famille/admin` | FamilleAdmin | Outils admin famille. |
| `/famille/inspir` | Inspir | Inspirations, exemples. |
| `/vivant/*` | LivingWizard | Assistant pas à pas : enregistrement d’un proche vivant (texte, vidéo). |
| `/defunt/*` | DeceasedWizard | Assistant défunt : choix écrit/vidéo, DeceasedWrittenForm, DeceasedVideoRegistration, DeceasedFamilyCheck. |

### 5.4 Backend – modèles et routes

- **Modèles** : User, ParentChildLink, CoupleLink, ParentChildActivity, CoupleActivity, FamilyTreeMessage, PublishedStory, DeceasedMember.
- **Routes** : familyTree.js (arbre, liens), parentChild.js, couple.js, family.js, userStories.js.

### 5.5 Règles métier

- Lien parent–enfant : validation par au moins un des deux comptes ; pas de cycles (enfant = parent de son parent).
- Couple : statuts (en couple, marié, séparé, veuf, etc.).
- Défunt : au moins un membre de la famille doit valider la fiche hommage.

---

## 6. Module Amis et communauté

### 6.1 Objectifs

- Réseau social : demandes d’amitié, accepter/refuser/bloquer.
- Communiquer au-delà de la famille.

### 6.2 Backend

- **Modèles** : Friend, FriendRequest, Friendship.
- **Routes** : friends.js (demande, accepter, refuser, annuler, lister amis, suggestions, blocages).

### 6.3 Frontend

- Intégration dans UserDashboard, Moi, MonProfil, Communaute.
- Affichage : liste d’amis, demandes en attente, actions (profil, message).

---

## 7. Pages thématiques (Santé, Éducation, Science, Sécurité, Activités)

### 7.1 Fonctions communes

- En-tête avec **Retour** et **S’inscrire** (pro) selon la page.
- Contenu spécifique au thème (textes, cartes, listes).
- Lien vers rendez-vous / messages avec les professionnels.

### 7.2 Gestion des professionnels (ProSection)

- **Composant** : ProSection (titre, icône, description, formulaire d’inscription, liste des pros approuvés).
- **API** : `/api/professionals/approved?type=...` (clinique, école, scientifique, fournisseur, journaliste, ONG, etc.).
- Filtrage par nom / ville.
- Bouton **Prendre rendez-vous** → flux PrendreRendezVous.
- Bouton **+ S’inscrire** : ouvre le formulaire et scroll jusqu’à la section.

### 7.3 Pages concernées

- **Sante** : santé communautaire, professionnels santé, hôpitaux, produits santé (health.js, Hospital, HealthProduct).
- **Education** : formations, défis éducatifs, cours, professeurs (education.js, Course, Professor, School, ProfessorRequest, FormationRegistration).
- **Science** : contenus scientifiques validés (science.js, SciencePost, SciencePermission).
- **Securite** : agents de sécurité, messages (SecurityAgent).
- **Activite** : activités sociales, groupes (activities.js, ActivityMessage, ActivityGroup).

### 7.4 Pages complémentaires

- MesCours, TrouverProfesseur, InscriptionFormation (éducation avancée).
- Activite1, Activite2, Activite3, Hommes, Femmes (segmentation par thème/genre).

---

## 8. Module Solidarité (Dons, Zaka, Livres de Dieu, Réalité, ONG)

### 8.1 Objectifs

- **Dons** : liste des pauvres, détail (situation, besoins, urgence), formulaire de don, historique « Mes dons ».
- **Zaka** : règles spécifiques musulmans (Zaka.tsx, ZakaEtDons.tsx).
- **Livres de Dieu** : liste des livres saints (titre, auteur, extraits, réflexions).
- **Réalité** : publications admin (vidéos, photos, messages) ; utilisateurs en lecture seule.
- **ONG** : onglet dans Solidarité, liste des ONG (ProSection type ngo), inscription ONG, prise de rendez-vous / messages.

### 8.2 Sous-onglets Solidarité

- Dons, Zaka, Les Livres de Dieu Unique, Réalité, ONG.
- Bouton « S’inscrire (ONG) » dans l’en-tête : scroll vers onglet ONG + formulaire d’inscription.

### 8.3 Backend

- **Routes** : faith.js, reality.js, additional.js (pauvres, dons, livres saints).
- **Modèles** : PoorPerson, HolyBook, FaithContent, RealityPost, etc.

### 8.4 Pages

- Solidarite (hub à onglets), Dons, Donations, Zaka, ZakaEtDons, LivresDeDieu.

---

## 9. Terre ADAM, lieux de résidence et quartiers

### 9.1 Objectifs

- Représenter les **lieux de résidence** : quartier, sous-préfecture, préfecture.
- Chaque utilisateur peut avoir **1 à 3 quartiers** (résidence 1, 2, 3).
- Messagerie par groupe (quartier, sous-préfecture, préfecture), besoins du quartier (décès, mariage, baptême, etc.).

### 9.2 Page Terre Adam

- **Onglets** : Lieux (sous-onglets Quartier, Sous-préfecture, Préfecture), Région, Pays, Continent, Mondial.
- **Section Quartier** :
  - **3 emplacements** fixes : Résidence 1, 2, 3.
  - Si quartier renseigné : carte avec nom et code.
  - Si vide : bouton « Résidence X – Ajouter un quartier » → redirection vers Mon profil.
  - Affichage dès que l’utilisateur a au moins continent/pays/région/préfecture/sous-préfecture.
- **Messagerie** : groupes par quartier(s), filtres (mes quartiers / tous), catégories besoins.
- **Composants** : CommunicationHub, publications, filtres.

### 9.3 Backend

- **Routes** : residences.js.
- **Modèles** : ResidenceGroup, ResidenceMessage, etc.
- Données géographiques : worldGeography (continent → pays → région → préfecture → sous-préfecture → quartier).

### 9.4 Pages lieux

- LieuResidence1, LieuResidence2, LieuResidence3 (détail par résidence).
- Redirections : /lieux-residence, /pays → /terre-adam.

---

## 10. Espace professionnel, rendez-vous et notifications

### 10.1 Objectifs

- Lister les professionnels par type, afficher une fiche détaillée.
- **Prise de rendez-vous** : professionnel, date/heure, type (présentiel, téléphone, en ligne), motif, détails.
- **Cycle de vie** : pending → accepted / refused / rescheduled ; notifications à chaque changement.
- **Notifications** : cloche globale (NotificationBell), liste et marquage lu.

### 10.2 Pages et routes

| Route | Page |
|-------|------|
| `/inscription-pro` | InscriptionPro |
| `/professionnels` | ListeProfessionnels |
| `/mes-comptes-pro` | MesComptesPro |
| `/espace-pro/:id` | EspacePro |
| `/rendez-vous/:id` | PrendreRendezVous |

### 10.3 Backend

- **Routes** : professionals.js, appointments.js, notifications.js.
- **Modèles** : ProfessionalAccount, Appointment, Notification.

---

## 11. Régions, pays, gouvernements et organisations

### 11.1 Objectifs

- Représenter la **Guinée** (4 régions naturelles) et les **pays**.
- **Gouvernements** : gestion des régions, dirigeants, messages d’État, produits d’État.
- **Organisations** : groupes, ONG, structures ; admins de page.

### 11.2 Pages

- Guinee, BasseGuinee, FoutaDjallon, HauteGuinee, GuineeForestiere, Pays.
- AdminGovernments (gestion gouvernements/régions).

### 11.3 Backend

- **Routes** : regions.js, governments.js, stateMessages.js, stateProducts.js, organizations.js, pageAdmins.js.
- **Modèles** : RegionGroup, RegionMessage, RegionMessagePermission, Government, GovernmentMember, OrganizationGroup, OrganizationPost, PageAdmin.

---

## 12. Échanges (marchés, produits, fournisseurs)

### 12.1 Objectifs

- Marchés en ligne : produits **primaires, secondaires, tertiaires** ; nourriture, médicaments.
- Gestion des **fournisseurs** (ProfessionalAccount type supplier), comparaison de prix, paiement mobile (évoqué).

### 12.2 Pages

- EchangesProfessionnel (composant utilisé en page), EchangePrimaire, EchangeNourriture, EchangeMedicament, EchangeSecondaire.

### 12.3 Backend

- **Routes** : exchange.js.
- **Modèles** : ExchangeProduct, Supplier, Order, PlatformCommission.

---

## 13. IA (Professeur IA, connaissances, conversations)

### 13.1 Objectifs

- **Professeur IA** : aide à l’éducation, réponses personnalisées (culture, histoire, foi).
- **Bases de connaissances** : thèmes, questions/réponses, sources (IaKnowledge).
- **Historique** des conversations (IaConversation) pour continuité et personnalisation.

### 13.2 Backend

- **Routes** : ia.js.
- **Modèles** : IaKnowledge, IaConversation.
- **Script** : seedIaKnowledge.js pour peupler la base.
- **Service externe** : IA SC (Python/Flask), démarrage optionnel depuis le backend (port 5000).

### 13.3 Frontend

- **Pages** : ProfesseurIA (chat), GuideEntrepreneur (guide + IA).
- **Routes** : /ia-sc, /professeur-ia → ProfesseurIA.

---

## 14. Histoire, éducation avancée, badges et gamification

### 14.1 Histoire de l’humanité

- **Pages** : Histoire, HistoireHumanite, Prehistoire, Antiquite, ARetenir, Reflechissons.
- Contenus pédagogiques (préhistoire, antiquité, timeline), sections « À retenir », « Réfléchissons » (quiz, questions ouvertes).

### 14.2 Badges et jeux

- **Objectifs** : motiver par badges et défis (quiz, jeux), récompenser participation et apprentissage.
- **Backend** : badges.js, defiEducatif.js ; Badge, UserBadge ; initGameModels, verifyGameModels, Game, GamePlayer, GameQuestion, GameAnswer, GameDeposit, GameTransaction.
- **Frontend** : AdminBadges (gestion des badges/logos), affichage des badges sur le profil et dans le dashboard.

---

## 15. Administration globale

### 15.1 Objectifs

- Vue centrale : statistiques (utilisateurs, professionnels, ONG, pauvres), alertes (contenus à valider, abus).
- Gestion : gouvernements, logos, badges, contenus, validations pro, modération.

### 15.2 Pages

- AdminDashboard, AdminBadges (et onglet logos), AdminGovernments.
- FamilleAdmin, Inspir (famille).

### 15.3 Backend

- **Routes** : admin.js, logos.js, pageAdmins.js.
- **Modèles** : Logo, UserLogo, PageAdmin, etc.

### 15.4 Exigences

- Accès réservé aux admins (contrôle rôle/Token).
- Traces d’audit souhaitables pour actions sensibles.

---

## 16. Exigences techniques (stack, API, sécurité)

### 16.1 Frontend

| Élément | Choix |
|---------|--------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Routing | react-router-dom |
| Style | TailwindCSS (classes utilitaires) |
| i18n | Fichiers de traduction (fr, en, ar, man, pul) |
| Organisation | pages/*, components/*, utils/*, i18n/*, services/* |

**Composants clés** : Banner, ThemeToggle, FloatingMessenger, ProSection, NotificationBell, ArbreGenealogique, EditProfileModal, IdentiteModal, LieuxResidence, CommunicationHub, etc.

### 16.2 Backend

| Élément | Choix |
|---------|--------|
| Runtime | Node.js |
| Framework | Express |
| Base de données | **PostgreSQL** (Sequelize, dialect postgres) |
| Auth | JWT (token), mots de passe hashés |
| Fichiers | Multer (upload), tailles/types limités |

**Routes principales** : auth, admin, badges, logos, pageAdmins, governments, activities, residences, education, regions, organizations, faith, friends, additional, exchange, documents, defiEducatif, family, familyTree, parentChild, couple, science, reality, stateMessages, stateProducts, userStories, professionals, appointments, notifications, ia.

### 16.3 Scripts et IA

- **Scripts .bat** : démarrage backend, frontend, IA (Professeur IA, IA Diangou selon config).
- **Dossiers IA** : `IA SC/` (app.py), `ia/`, `IA Diangou/` selon besoins.

### 16.4 Sécurité

- Routes protégées : vérification JWT.
- Données sensibles (ex. contacts) visibles uniquement pour utilisateurs connectés ou autorisés.
- Validation côté serveur des entrées, pas d’exposition de secrets (config.env, .env en .gitignore).

---

## 17. Règles transverses (formulaires, UX, accessibilité)

### 17.1 Formulaires

- **Validation** : champs obligatoires marqués, messages d’erreur lisibles (sous le champ ou en haut).
- **Bouton de soumission** : désactivé tant que des champs obligatoires sont invalides.
- **Types** : texte court/long, numérique, contact (email, téléphone), sélection (type, urgence, pays, genre), fichiers (image, vidéo, PDF).
- **Contraintes** : longueurs max (nom ~80–100, textes longs ~1000–2000), tailles max fichiers (images ~10–20 Mo, vidéos ~200–500 Mo, PDF ~50 Mo), barre de progression et messages en cas d’échec d’upload.

### 17.2 Utilisateur – inscription et profil

- **Inscription** : prénom, nom, email (unique), mot de passe, confirmation, éventuellement numéro H ; option type (simple, famille).
- **Profil** : identité (date de naissance, sexe, pays, ville, langues), contact (téléphone, adresse non publique), photo, préférences (notifications).

### 17.3 Professionnels et ONG (ProSection)

- Types : clinique, école, scientifique, fournisseur, journaliste, ONG, etc.
- Champs communs : nom (obligatoire), description, adresse, ville, pays, téléphone, email, services (liste), spécialités (liste).
- Statut : pending → validation admin → approved ; affichage public uniquement si approved.

### 17.4 Famille – fiches vivants / décédés

- **Vivant** : lien (parent, enfant, partenaire, etc.), identité, statut vivant, lien confirmé ; enregistrement écrit et/ou vidéo.
- **Défunt** : identité, type d’hommage (écrit/vidéo), validateur famille (compte membre), fiche écrite/vidéo ; au moins un membre valide.

### 17.5 Pauvres, dons, Zaka

- **Fiche pauvre** : identité, localisation, situation, besoins, taille de famille, urgence (low/medium/high/critical), contact restreint.
- **Don** : type (argent, nourriture, vêtements, médicaments, autre), montant+devise, bénéficiaire, description, statut (pending/completed/cancelled), historisation.

### 17.6 Contenus « Réalité »

- Admin : titre, contenu texte, catégorie (vidéo, photo, message), type (texte seul ou + média), média, auteur, date.
- Utilisateurs : filtre par catégorie, détail (texte + média), message si aucun contenu.

### 17.7 Accessibilité et UX

- Police lisible, contrastes suffisants, boutons accessibles (taille minimale, zones cliquables) sur mobile.
- Boutons Retour et « S’inscrire » cohérents selon les pages.
- Thème clair/sombre (ThemeToggle).
- Textes isolés pour i18n (fichiers de traduction).

### 17.8 Journalisation

- Log des erreurs backend.
- Traces pour actions sensibles (admin, validation liens familiaux, dons, rendez-vous).

---

## Annexe A – Liste des routes frontend (référence)

```
/  /inscription  /choix  /vivant/*  /defunt/*  /login  /login-membre
/compte  /moi  /moi/profil  /sante  /securite  /identite  /activite  /education
/solidarite  /admin  /admin/badges  /admin/governments
/famille  /famille/parents  /famille/femmes  /famille/mari  /famille/enfants
/famille/moi  /famille/moi/arbre  /famille/moi/arbre/membres
/famille/mes-amours  /famille/admin  /famille/inspir
/terre-adam  /histoire  /a-retenir  /histoire-humanite  /science
/echange  /echange/primaire  /echange/nourriture  /echange/medicament  /echange/secondaire
/ia-sc  /professeur-ia  /inscription-pro  /professionnels  /mes-comptes-pro
/espace-pro/:id  /rendez-vous/:id
+ redirections (dokal, foi, dons, donations, zaka, zaka-et-dons, lieux-residence, pays, organisation, mes-amours)
```

## Annexe B – Modèles backend principaux (référence)

```
User, ProfessionalAccount, Appointment, Notification
ParentChildLink, CoupleLink, ParentChildActivity, CoupleActivity
FamilyTreeMessage, PublishedStory, DeceasedMember
Friend, FriendRequest, Friendship
Badge, UserBadge, Logo, UserLogo
Course, Professor, School, ProfessorRequest, FormationRegistration
SciencePost, SciencePermission
IaKnowledge, IaConversation
Hospital, HealthProduct, SecurityAgent, ExchangeProduct, Supplier, Order
PoorPerson, FaithContent, HolyBook, RealityPost
RegionGroup, RegionMessage, ResidenceGroup, ResidenceMessage
OrganizationGroup, OrganizationPost, Government, GovernmentMember, PageAdmin
Document, ActivityMessage, ActivityGroup, StateMessage
Game, GamePlayer, GameQuestion, GameAnswer, GameDeposit, GameTransaction
+ modèles additionnels (additional.js, etc.)
```

---

*Document généré à partir de l’analyse du projet « Les Enfants d’Adam » / Terre ADAM. À faire évoluer avec le produit.*
