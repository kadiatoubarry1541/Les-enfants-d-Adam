import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GuideEntrepreneur() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'priorites' | 'organisations' | 'etapes' | 'ressources' | 'partenaires'>('priorites');

  const priorites = [
    {
      id: 1,
      title: '1️⃣ ANSUTEN (Agence Nationale du Service Universel des Télécommunications et du Numérique)',
      description: 'L\'organisation PARFAITE pour votre projet numérique ! Spécialisée dans le numérique et l\'innovation technologique',
      contact: 'ANSUTEN - Immeuble ARPT, 7ème étage, Ratoma, Conakry | Tél: (+224) 611-89-22-22 | Email: contact@ansuten.gov.gn',
      action: 'Aller directement ou appeler pour présenter votre projet numérique. Participer au Grand Prix ANSUTEN de la Technologie et de l\'Innovation',
      why: 'Ils sont SPÉCIALISÉS dans les projets numériques comme le vôtre ! Ils organisent des concours pour jeunes innovateurs, offrent des formations, et peuvent vous mettre en contact avec des partenaires techniques. C\'est EXACTEMENT ce dont vous avez besoin !',
      icon: '💻',
      reassurance: '✅ SPÉCIALISÉ dans le numérique ! ✅ Concours pour jeunes innovateurs ! ✅ Programmes de formation ! ✅ Partenaires techniques !'
    },
    {
      id: 2,
      title: '2️⃣ Ministère de l\'Économie et des Finances',
      description: 'Point de départ officiel pour les projets entrepreneuriaux - Ils VOUS acceptent !',
      contact: 'Ministère de l\'Économie et des Finances, Conakry',
      action: 'Aller directement ou appeler pour présenter votre projet (même avec une idée large)',
      why: 'Ils acceptent les jeunes avec des idées larges et sans argent. C\'est leur mission de vous aider ! Ils vous orienteront vers les programmes d\'aide aux jeunes entrepreneurs et les financements disponibles',
      icon: '🏛️',
      reassurance: '✅ OUI, ils acceptent les idées larges ! ✅ OUI, ils aident les jeunes ! ✅ OUI, ils aident ceux qui n\'ont pas d\'argent !'
    },
    {
      id: 3,
      title: '3️⃣ Agence de Promotion des Investissements Privés (APIP)',
      description: 'Organisation dédiée à l\'accompagnement des investisseurs et entrepreneurs',
      contact: 'APIP Guinée, Conakry',
      action: 'Inscrire votre projet et demander un accompagnement',
      why: 'Ils aident les jeunes entrepreneurs à structurer leur projet et à trouver des partenaires',
      icon: '💼'
    },
    {
      id: 4,
      title: '4️⃣ Chambre de Commerce, d\'Industrie et d\'Artisanat de Guinée (CCIAG)',
      description: 'Organisation qui regroupe les entrepreneurs et peut vous mettre en réseau',
      contact: 'CCIAG, Conakry',
      action: 'Devenir membre et participer aux événements de networking',
      why: 'Rencontrer d\'autres entrepreneurs, trouver des mentors et des opportunités',
      icon: '🤝'
    },
    {
      id: 5,
      title: '5️⃣ Programme National de Développement de l\'Entrepreneuriat (PNDE)',
      description: 'Programme gouvernemental pour soutenir les jeunes entrepreneurs',
      contact: 'PNDE, Ministère de l\'Économie',
      action: 'Postuler pour bénéficier de formations et de financements',
      why: 'Formations gratuites, accompagnement et possibilité de financement',
      icon: '📚'
    },
    {
      id: 5,
      title: '5️⃣ Organisations Internationales (PNUD, Banque Mondiale)',
      description: 'Programmes d\'aide au développement pour les jeunes',
      contact: 'Bureaux PNUD et Banque Mondiale à Conakry',
      action: 'Consulter leurs programmes de soutien aux jeunes entrepreneurs',
      why: 'Financements, formations et accompagnement technique disponibles',
      icon: '🌍'
    }
  ];

  const organisations = [
    {
      category: 'Gouvernement',
      items: [
        { name: 'Ministère de l\'Économie et des Finances', role: 'Orientation et financements publics' },
        { name: 'Ministère de la Jeunesse et de l\'Emploi', role: 'Programmes pour les jeunes entrepreneurs' },
        { name: 'APIP (Agence de Promotion des Investissements Privés)', role: 'Accompagnement des investisseurs' },
        { name: 'PNDE (Programme National de Développement de l\'Entrepreneuriat)', role: 'Formations et financements' }
      ]
    },
    {
      category: 'Organisations Internationales',
      items: [
        { name: 'PNUD (Programme des Nations Unies pour le Développement)', role: 'Programmes de développement' },
        { name: 'Banque Mondiale', role: 'Financements et projets de développement' },
        { name: 'AFD (Agence Française de Développement)', role: 'Soutien aux projets en Afrique' },
        { name: 'USAID', role: 'Programmes d\'entrepreneuriat pour les jeunes' }
      ]
    },
    {
      category: 'Organisations Locales',
      items: [
        { name: 'CCIAG (Chambre de Commerce)', role: 'Réseau d\'entrepreneurs et mentorat' },
        { name: 'ONG locales d\'entrepreneuriat', role: 'Formations et accompagnement' },
        { name: 'Incubateurs et accélérateurs', role: 'Accompagnement technique et financier' },
        { name: 'Associations de jeunes entrepreneurs', role: 'Réseau et partage d\'expériences' }
      ]
    },
    {
      category: 'Investisseurs Privés',
      items: [
        { name: 'Business Angels locaux', role: 'Investissement dans les startups' },
        { name: 'Fonds d\'investissement', role: 'Financement de projets prometteurs' },
        { name: 'Entrepreneurs expérimentés', role: 'Mentorat et investissement' }
      ]
    }
  ];

  const etapes = [
    {
      step: 1,
      title: 'Préparer votre présentation (Même avec une idée large)',
      description: 'Comment structurer votre idée large pour qu\'elle soit acceptée',
      actions: [
        'Décrire votre vision générale (même si c\'est large, c\'est bien !)',
        'Expliquer les domaines que votre projet couvre (Famille, Échange, État, etc.)',
        'Montrer l\'impact positif sur la communauté guinéenne',
        'Dire clairement : "Je suis jeune, je n\'ai pas d\'argent, mais j\'ai une grande vision"',
        'Préparer un pitch simple de 2-3 minutes expliquant votre passion',
        'Mentionner que vous cherchez de l\'aide pour structurer et financer votre projet'
      ]
    },
    {
      step: 2,
      title: 'Commencer par le Ministère de l\'Économie (Ils VOUS acceptent !)',
      description: 'Comment être accepté même avec une idée large, sans argent et en étant jeune',
      actions: [
        'Appeler ou vous rendre au Ministère de l\'Économie à Conakry',
        'Dire : "Je suis un jeune entrepreneur avec une idée de projet, je cherche de l\'aide"',
        'Expliquer votre idée (même si elle est large, c\'est accepté !)',
        'Être honnête : "Je n\'ai pas d\'argent mais j\'ai une vision"',
        'Demander : "Quels programmes existent pour les jeunes entrepreneurs comme moi ?"',
        'Demander : "Pouvez-vous m\'aider à structurer mon projet ?"',
        'Ne pas avoir peur - ils sont là pour vous aider, pas pour vous rejeter !'
      ]
    },
    {
      step: 3,
      title: 'Contacter l\'APIP',
      description: 'Ils peuvent vous aider à structurer votre projet',
      actions: [
        'S\'inscrire sur leur plateforme',
        'Demander un accompagnement',
        'Participer à leurs formations',
        'Bénéficier de leur réseau'
      ]
    },
    {
      step: 4,
      title: 'Rejoindre la CCIAG',
      description: 'Construire votre réseau professionnel',
      actions: [
        'Devenir membre (frais réduits pour les jeunes)',
        'Assister aux événements de networking',
        'Rencontrer des mentors',
        'Trouver des partenaires potentiels'
      ]
    },
    {
      step: 5,
      title: 'Postuler aux programmes internationaux',
      description: 'Chercher des financements et formations',
      actions: [
        'Consulter les sites web du PNUD et Banque Mondiale',
        'Postuler aux programmes pour jeunes entrepreneurs',
        'Participer aux concours et compétitions',
        'Bénéficier de formations gratuites'
      ]
    },
    {
      step: 6,
      title: 'Construire votre réseau',
      description: 'Rencontrer d\'autres entrepreneurs et mentors',
      actions: [
        'Rejoindre des groupes d\'entrepreneurs sur les réseaux sociaux',
        'Assister à des événements de startup',
        'Trouver un mentor expérimenté',
        'Participer à des programmes d\'incubation'
      ]
    }
  ];

  const ressources = [
    {
      type: 'Formations',
      items: [
        'Formations gratuites du PNDE',
        'Cours en ligne sur l\'entrepreneuriat',
        'Ateliers de la CCIAG',
        'Programmes de mentorat'
      ]
    },
    {
      type: 'Financements',
      items: [
        'Subventions gouvernementales pour jeunes',
        'Prêts à taux préférentiels',
        'Programmes de microfinance',
        'Concours et compétitions avec prix'
      ]
    },
    {
      type: 'Ressources en ligne',
      items: [
        'Sites web des organisations mentionnées',
        'Groupes Facebook d\'entrepreneurs guinéens',
        'Plateformes de financement participatif',
        'Ressources éducatives gratuites'
      ]
    },
    {
      type: 'Conseils pratiques',
      items: [
        'Préparez toujours un pitch court et clair',
        'Soyez persistant et ne vous découragez pas',
        'Construisez votre réseau progressivement',
        'Apprenez de chaque rencontre et expérience'
      ]
    }
  ];

  const partenaires = [
    {
      id: 1,
      title: '1️⃣ Ministère de l\'Économie - Premier Contact',
      description: 'Ils peuvent vous mettre en contact avec des partenaires techniques et des mentors',
      pourquoi: 'Le Ministère connaît tous les développeurs, entrepreneurs expérimentés et mentors qui peuvent vous aider. C\'est votre première source de contacts fiables.',
      action: 'Demander : "Pouvez-vous me mettre en contact avec un développeur ou un mentor qui peut m\'aider ?"',
      icon: '🏛️',
      priorite: 'HAUTE'
    },
    {
      id: 2,
      title: '2️⃣ CCIAG (Chambre de Commerce)',
      description: 'Réseau d\'entrepreneurs expérimentés qui peuvent devenir vos partenaires',
      pourquoi: 'Les membres de la CCIAG sont des entrepreneurs établis qui cherchent souvent à aider les jeunes. Vous pouvez y trouver un mentor ou un partenaire technique.',
      action: 'Participer aux événements de networking et présenter votre projet. Demander : "Je cherche un partenaire technique, pouvez-vous m\'aider ?"',
      icon: '🤝',
      priorite: 'HAUTE'
    },
    {
      id: 3,
      title: '3️⃣ Incubateurs et Accélérateurs',
      description: 'Organisations spécialisées dans l\'accompagnement de startups',
      pourquoi: 'Les incubateurs ont des réseaux de développeurs, mentors et partenaires. Ils peuvent vous jumeler avec quelqu\'un qui complète vos compétences.',
      action: 'Contacter les incubateurs à Conakry et demander un programme d\'accompagnement avec mentorat',
      icon: '🚀',
      priorite: 'MOYENNE'
    },
    {
      id: 4,
      title: '4️⃣ Universités et Écoles Techniques',
      description: 'Étudiants en informatique et jeunes diplômés qui cherchent des projets',
      pourquoi: 'Les étudiants en dernière année ou jeunes diplômés cherchent souvent des projets réels pour pratiquer. Vous pouvez former une équipe avec eux.',
      action: 'Contacter les départements d\'informatique des universités de Conakry. Proposer : "J\'ai un projet, cherchez-vous un projet pour pratiquer ?"',
      icon: '🎓',
      priorite: 'MOYENNE'
    },
    {
      id: 5,
      title: '5️⃣ Groupes Facebook et Réseaux Sociaux',
      description: 'Communautés d\'entrepreneurs et développeurs guinéens en ligne',
      pourquoi: 'Les groupes d\'entrepreneurs guinéens sur Facebook sont très actifs. Vous pouvez y publier : "Je cherche un partenaire technique pour mon projet"',
      action: 'Rejoindre les groupes "Entrepreneurs Guinée", "Startups Conakry", "Développeurs Guinée" et publier votre demande',
      icon: '💻',
      priorite: 'MOYENNE'
    },
    {
      id: 6,
      title: '6️⃣ Entrepreneurs Expérimentés',
      description: 'Personnes qui ont déjà réussi et qui cherchent à aider',
      pourquoi: 'Beaucoup d\'entrepreneurs expérimentés veulent donner en retour. Ils peuvent devenir vos mentors ou partenaires.',
      action: 'Les rencontrer via la CCIAG ou le Ministère. Leur dire : "J\'admire votre parcours, pouvez-vous me guider ?"',
      icon: '👔',
      priorite: 'MOYENNE'
    }
  ];

  const qualitesPartenaire = [
    {
      qualite: 'Compétences techniques',
      description: 'Quelqu\'un qui sait développer (programmation, design, etc.)',
      importance: 'ESSENTIEL'
    },
    {
      qualite: 'Passion et engagement',
      description: 'Quelqu\'un qui croit en votre projet et veut vraiment vous aider',
      importance: 'ESSENTIEL'
    },
    {
      qualite: 'Fiabilité',
      description: 'Quelqu\'un sur qui vous pouvez compter, qui respecte ses engagements',
      importance: 'ESSENTIEL'
    },
    {
      qualite: 'Expérience',
      description: 'Quelqu\'un qui a déjà travaillé sur des projets similaires',
      importance: 'IMPORTANT'
    },
    {
      qualite: 'Réseau',
      description: 'Quelqu\'un qui connaît d\'autres personnes qui peuvent aider',
      importance: 'IMPORTANT'
    },
    {
      qualite: 'Patience',
      description: 'Quelqu\'un qui comprend que vous êtes jeune et qui vous apprend',
      importance: 'IMPORTANT'
    }
  ];

  const commentApprocher = [
    {
      etape: 1,
      titre: 'Préparez votre présentation',
      details: [
        'Expliquez clairement votre projet (même si c\'est large)',
        'Montrez ce que vous avez déjà fait',
        'Dites ce que vous cherchez : "Je cherche un partenaire technique qui peut m\'aider à développer mon projet"',
        'Soyez honnête : "Je suis jeune, je n\'ai pas toutes les compétences, mais j\'ai une vision"'
      ]
    },
    {
      etape: 2,
      titre: 'Approchez-vous avec respect',
      details: [
        'Soyez poli et professionnel',
        'Montrez que vous respectez leur temps',
        'Préparez vos questions à l\'avance',
        'Remerciez-les pour leur attention'
      ]
    },
    {
      etape: 3,
      titre: 'Proposez une collaboration équitable',
      details: [
        'Expliquez ce que vous apportez (vision, idée, travail déjà fait)',
        'Expliquez ce que vous cherchez (compétences techniques, mentorat)',
        'Proposez un partenariat gagnant-gagnant',
        'Soyez ouvert à leurs suggestions'
      ]
    },
    {
      etape: 4,
      titre: 'Restez en contact',
      details: [
        'Envoyez un message de remerciement après la rencontre',
        'Restez en contact régulièrement',
        'Montrez vos progrès',
        'Demandez des conseils quand vous en avez besoin'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎯 Guide de l'Entrepreneur en Guinée
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Votre chemin vers le succès - Conakry, Guinée
          </p>
          <p className="text-lg text-gray-500">
            Guide complet pour jeunes entrepreneurs sans ressources
          </p>
        </div>

        {/* Message d'encouragement */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-3">💪 Vous n'êtes pas seul !</h2>
          <p className="text-lg mb-2">
            Même sans argent ni compétences techniques, vous pouvez réussir. Ce guide vous montre exactement où aller et quoi faire.
          </p>
          <p className="text-base opacity-90">
            Commencez par le <strong>Ministère de l'Économie</strong> - c'est votre premier pas vers le succès !
          </p>
        </div>

        {/* Message spécial : Comment présenter une idée large */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl shadow-lg p-6 mb-8 text-white border-4 border-yellow-300">
          <h2 className="text-3xl font-bold mb-4 text-center">⚠️ VOTRE INQUIÉTUDE EST NORMALE ⚠️</h2>
          <div className="bg-white/20 rounded-lg p-5 space-y-4">
            <div className="bg-yellow-400 text-gray-900 rounded-lg p-4">
              <p className="font-bold text-lg mb-2">💡 LA VÉRITÉ :</p>
              <p className="text-base mb-3">
                Oui, une idée large peut être difficile à comprendre. <strong>MAIS</strong> vous avez déjà fait beaucoup de travail ! 
                Votre projet existe déjà - vous avez développé plusieurs fonctionnalités. C'est votre force !
              </p>
              <p className="text-base font-semibold">
                Le Ministère comprendra si vous structurez votre présentation. Voici comment faire :
              </p>
            </div>
            
            <div className="bg-white/30 rounded-lg p-4">
              <p className="font-bold text-lg mb-3">✅ COMMENT STRUCTURER VOTRE IDÉE LARGE :</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-400 font-bold">1.</span>
                  <div>
                    <p className="font-semibold mb-1">Ne dites PAS "J'ai une idée large"</p>
                    <p className="opacity-90">Dites plutôt : "J'ai créé une plateforme avec plusieurs modules qui répondent aux besoins de la communauté"</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-400 font-bold">2.</span>
                  <div>
                    <p className="font-semibold mb-1">Montrez ce que vous avez DÉJÀ fait</p>
                    <p className="opacity-90">"J'ai déjà développé : gestion familiale, échanges de produits, services de l'État, etc."</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-400 font-bold">3.</span>
                  <div>
                    <p className="font-semibold mb-1">Expliquez par PHASES</p>
                    <p className="opacity-90">"Phase 1 : Famille et Échanges (déjà fait), Phase 2 : Services État, Phase 3 : Santé et Éducation"</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-400 font-bold">4.</span>
                  <div>
                    <p className="font-semibold mb-1">Soyez honnête sur vos besoins</p>
                    <p className="opacity-90">"J'ai besoin d'aide pour structurer le projet professionnellement et trouver un partenaire technique"</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/30 rounded-lg p-4">
              <p className="font-bold text-lg mb-3">🎯 CE QUE VOUS DEVEZ DIRE AU MINISTÈRE :</p>
              <div className="bg-gray-900 rounded-lg p-4 text-white text-sm space-y-2 italic">
                <p>"Bonjour, je m'appelle [Votre nom]. J'ai développé une plateforme numérique pour la communauté guinéenne."</p>
                <p>"J'ai déjà créé plusieurs fonctionnalités : gestion familiale, échanges de produits, services de l'État."</p>
                <p>"Mon projet est ambitieux car il couvre plusieurs domaines, mais j'ai commencé par les plus importants."</p>
                <p>"Je suis jeune, je n'ai pas toutes les compétences techniques, mais j'ai une vision claire et j'ai déjà fait beaucoup de travail."</p>
                <p>"Je cherche de l'aide pour : structurer le projet professionnellement, trouver un partenaire technique, et obtenir des financements."</p>
                <p>"Pouvez-vous m'aider ou me mettre en contact avec quelqu'un qui peut m'aider ?"</p>
              </div>
            </div>

            <div className="bg-green-500 text-white rounded-lg p-4">
              <p className="font-bold text-lg mb-2">✅ POURQUOI ÇA VA MARCHER :</p>
              <ul className="space-y-1 text-sm">
                <li>✓ Vous montrez que vous avez DÉJÀ travaillé (pas juste une idée)</li>
                <li>✓ Vous êtes honnête sur vos besoins (pas de mensonge)</li>
                <li>✓ Vous avez une vision claire (même si large)</li>
                <li>✓ Vous demandez de l'aide (pas de l'argent directement)</li>
                <li>✓ Vous êtes jeune et motivé (c'est un atout !)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Message important : Chemin le plus court */}
        <div className="bg-gradient-to-r from-red-500 to-orange-600 rounded-xl shadow-lg p-6 mb-8 text-white border-4 border-yellow-300">
          <h2 className="text-3xl font-bold mb-4 text-center">⚡ CHEMIN LE PLUS COURT ⚡</h2>
          <div className="bg-white/20 rounded-lg p-5 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-3xl">🎯</span>
              <div>
                <p className="text-xl font-bold mb-2">Le Ministère = Votre Premier Pas</p>
                <p className="text-base opacity-95">
                  En allant directement au <strong>Ministère de l'Économie en premier</strong>, vous évitez de perdre du temps 
                  et de vous fatiguer inutilement. C'est le chemin le plus court et le plus efficace !
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 mt-4">
              <span className="text-3xl">✅</span>
              <div>
                <p className="text-lg font-bold mb-2">Pourquoi c'est le meilleur choix :</p>
                <ul className="space-y-2 text-base opacity-95">
                  <li>✓ Ils vous orienteront vers TOUS les autres programmes</li>
                  <li>✓ Vous éviterez de courir partout sans savoir où aller</li>
                  <li>✓ Vous gagnerez du temps et de l'énergie</li>
                  <li>✓ Ils connaissent tous les financements disponibles</li>
                  <li>✓ C'est le point central pour tous les jeunes entrepreneurs</li>
                </ul>
              </div>
            </div>
            <div className="bg-yellow-400 text-gray-900 rounded-lg p-4 mt-4">
              <p className="font-bold text-lg text-center">
                🚀 ALLEZ-Y DIRECTEMENT - C'EST VOTRE PREMIER PAS, VOTRE SEUL PAS NÉCESSAIRE POUR COMMENCER !
              </p>
            </div>
          </div>
        </div>

        {/* Script de 5 minutes */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 mb-8 text-white border-4 border-yellow-300">
          <h2 className="text-3xl font-bold mb-4 text-center">⏱️ VOTRE SCRIPT DE 5 MINUTES ⏱️</h2>
          <p className="text-center text-lg mb-6 opacity-90">
            Mémorisez ce script et utilisez-le lors de votre rencontre au Ministère
          </p>
          
          <div className="bg-white/10 rounded-lg p-6 space-y-6">
            {/* Minute 1 */}
            <div className="bg-white/20 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-yellow-400 text-gray-900 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">1</span>
                <h3 className="text-xl font-bold">MINUTE 1 : Présentation (30 secondes)</h3>
              </div>
              <div className="bg-white/30 rounded-lg p-4">
                <p className="text-lg font-semibold mb-2">💬 Dites exactement :</p>
                <p className="text-base leading-relaxed italic">
                  "Bonjour, je m'appelle [Votre nom]. Je suis un jeune entrepreneur guinéen de Conakry. 
                  J'ai développé un projet qui peut aider ma communauté, et je cherche de l'aide pour le structurer et le financer."
                </p>
              </div>
            </div>

            {/* Minute 2-3 */}
            <div className="bg-white/20 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-yellow-400 text-gray-900 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">2-3</span>
                <h3 className="text-xl font-bold">MINUTES 2-3 : Votre projet (2 minutes)</h3>
              </div>
              <div className="bg-white/30 rounded-lg p-4">
                <p className="text-lg font-semibold mb-2">💬 Dites exactement :</p>
                <p className="text-base leading-relaxed italic mb-3">
                  "J'ai créé une plateforme numérique qui aide les Guinéens dans plusieurs domaines importants :
                </p>
                <ul className="list-disc list-inside space-y-2 text-base leading-relaxed italic ml-4">
                  <li><strong>La Famille</strong> : pour gérer les arbres généalogiques et les relations familiales</li>
                  <li><strong>Les Échanges</strong> : pour que les gens puissent vendre et acheter des produits (nourriture, médicaments, etc.)</li>
                  <li><strong>L'État</strong> : pour que les citoyens puissent faire des demandes de papiers et prendre rendez-vous</li>
                  <li><strong>La Santé, l'Éducation, la Foi</strong> : et d'autres services importants pour la communauté</li>
                </ul>
                <p className="text-base leading-relaxed italic mt-3">
                  C'est un projet large parce que je veux créer un système complet qui répond à tous les besoins de la communauté guinéenne. 
                  Le projet existe déjà en partie - j'ai déjà développé plusieurs fonctionnalités."
                </p>
              </div>
            </div>

            {/* Minute 4 */}
            <div className="bg-white/20 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-yellow-400 text-gray-900 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">4</span>
                <h3 className="text-xl font-bold">MINUTE 4 : Votre situation (1 minute)</h3>
              </div>
              <div className="bg-white/30 rounded-lg p-4">
                <p className="text-lg font-semibold mb-2">💬 Dites exactement :</p>
                <p className="text-base leading-relaxed italic">
                  "Je suis jeune, je n'ai pas d'argent pour développer ce projet complètement, mais j'ai une grande vision et beaucoup de passion. 
                  J'ai déjà fait beaucoup de travail seul, mais j'ai besoin d'aide pour structurer le projet professionnellement et trouver des financements. 
                  C'est pour ça que je suis venu vous voir - pour que vous m'aidiez à réussir."
                </p>
              </div>
            </div>

            {/* Minute 5 */}
            <div className="bg-white/20 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-yellow-400 text-gray-900 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">5</span>
                <h3 className="text-xl font-bold">MINUTE 5 : Votre demande (1 minute)</h3>
              </div>
              <div className="bg-white/30 rounded-lg p-4">
                <p className="text-lg font-semibold mb-2">💬 Dites exactement :</p>
                <p className="text-base leading-relaxed italic mb-3">
                  "Je voudrais savoir :
                </p>
                <ul className="list-disc list-inside space-y-2 text-base leading-relaxed italic ml-4">
                  <li>Quels programmes existent pour les jeunes entrepreneurs comme moi ?</li>
                  <li>Pouvez-vous m'aider à structurer mon projet professionnellement ?</li>
                  <li>Y a-t-il des financements disponibles pour ce type de projet ?</li>
                  <li>Vers quelles organisations devrais-je me tourner ensuite ?</li>
                </ul>
                <p className="text-base leading-relaxed italic mt-3">
                  Je suis prêt à travailler dur et à apprendre. J'ai juste besoin d'un peu d'aide pour démarrer."
                </p>
              </div>
            </div>

            {/* Conseils supplémentaires */}
            <div className="bg-yellow-400 text-gray-900 rounded-lg p-5 mt-6">
              <h3 className="text-xl font-bold mb-3">💡 Conseils pour réussir votre présentation :</h3>
              <ul className="space-y-2 text-base">
                <li>✓ <strong>Parlez avec passion</strong> - montrez que vous croyez en votre projet</li>
                <li>✓ <strong>Soyez honnête</strong> - dites clairement votre situation (jeune, pas d'argent)</li>
                <li>✓ <strong>Restez calme</strong> - respirez profondément avant de commencer</li>
                <li>✓ <strong>Regardez-les dans les yeux</strong> - montrez votre confiance</li>
                <li>✓ <strong>Écoutez leurs questions</strong> - répondez simplement et honnêtement</li>
                <li>✓ <strong>Remerciez-les</strong> à la fin, même s'ils ne peuvent pas vous aider immédiatement</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Message de rassurance important */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-4">✅ OUI, ils vont vous accepter !</h2>
          <div className="space-y-3 text-lg">
            <div className="bg-white/20 rounded-lg p-4">
              <p className="font-semibold mb-2">💡 Une idée large est ACCEPTABLE :</p>
              <p className="text-base opacity-95">
                Le Ministère de l'Économie <strong>encourage</strong> les jeunes avec des idées ambitieuses. 
                Une idée large montre que vous pensez grand, et c'est une qualité !
              </p>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <p className="font-semibold mb-2">👶 Être jeune est un AVANTAGE :</p>
              <p className="text-base opacity-95">
                Les programmes gouvernementaux sont <strong>spécialement conçus</strong> pour les jeunes entrepreneurs. 
                Votre âge est un atout, pas un obstacle !
              </p>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <p className="font-semibold mb-2">💰 Pas d'argent ? C'est normal !</p>
              <p className="text-base opacity-95">
                Le Ministère existe <strong>précisément</strong> pour aider ceux qui n'ont pas d'argent. 
                C'est leur rôle de vous aider à trouver des financements !
              </p>
            </div>
          </div>
        </div>

        {/* Navigation par sections */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveSection('priorites')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeSection === 'priorites'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🎯 Priorités
            </button>
            <button
              onClick={() => setActiveSection('organisations')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeSection === 'organisations'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🏢 Organisations
            </button>
            <button
              onClick={() => setActiveSection('etapes')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeSection === 'etapes'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📋 Étapes
            </button>
            <button
              onClick={() => setActiveSection('ressources')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeSection === 'ressources'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📚 Ressources
            </button>
            <button
              onClick={() => setActiveSection('partenaires')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeSection === 'partenaires'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🤝 Trouver un Partenaire
            </button>
          </div>
        </div>

        {/* Section Priorités */}
        {activeSection === 'priorites' && (
          <div className="space-y-6">
            <div className="bg-yellow-50 border-4 border-yellow-400 rounded-xl p-6 mb-6">
              <h3 className="text-3xl font-bold text-yellow-900 mb-4 text-center">
                ⚡ OÙ ALLER EN PREMIER ? ⚡
              </h3>
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-5 border-2 border-yellow-400">
                <p className="text-2xl text-yellow-900 font-bold mb-3 text-center">
                  🎯 MINISTÈRE DE L'ÉCONOMIE = VOTRE PREMIER ET SEUL PAS NÉCESSAIRE
                </p>
                <p className="text-lg text-yellow-900 font-semibold mb-3">
                  En allant directement au <strong>Ministère de l'Économie et des Finances</strong>, vous prenez le chemin le plus court.
                </p>
                <div className="bg-white rounded-lg p-4 mt-4">
                  <p className="text-base text-gray-800 font-semibold mb-2">✅ Pourquoi c'est le meilleur choix :</p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Ils vous orienteront vers TOUS les autres programmes (APIP, CCIAG, PNDE, etc.)</li>
                    <li>• Vous éviterez de courir partout sans savoir où aller</li>
                    <li>• Vous gagnerez du temps et de l'énergie</li>
                    <li>• Ils connaissent tous les financements disponibles pour les jeunes</li>
                    <li>• C'est le point central - un seul endroit pour tout savoir</li>
                  </ul>
                </div>
                <p className="text-center mt-4 text-xl font-bold text-red-600">
                  ⚠️ NE VOUS FATIGUEZ PAS INUTILEMENT - ALLEZ DIRECTEMENT AU MINISTÈRE !
                </p>
              </div>
            </div>

            {/* Message spécial pour rassurer */}
            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl shadow-lg p-6 mb-6 text-white">
              <h3 className="text-xl font-bold mb-3">💬 Ce que vous devez dire au Ministère :</h3>
              <div className="bg-white/20 rounded-lg p-4 space-y-2">
                <p className="font-semibold">"Bonjour, je suis un jeune entrepreneur guinéen."</p>
                <p className="font-semibold">"J'ai une idée de projet qui couvre plusieurs domaines (Famille, Échange, État, etc.)."</p>
                <p className="font-semibold">"Je n'ai pas d'argent mais j'ai une grande vision pour aider ma communauté."</p>
                <p className="font-semibold">"Pouvez-vous m'aider à structurer mon projet et trouver des financements ?"</p>
              </div>
              <p className="mt-4 text-sm opacity-90">
                ✅ Ils vont vous écouter ! ✅ Ils vont vous aider ! ✅ C'est leur travail !
              </p>
            </div>

            {priorites.map((priorite) => (
              <div key={priorite.id} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{priorite.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{priorite.title}</h3>
                    <p className="text-gray-700 mb-3">{priorite.description}</p>
                    {(priorite as any).reassurance && (
                      <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-3">
                        <p className="text-sm font-bold text-green-800">{(priorite as any).reassurance}</p>
                      </div>
                    )}
                    <div className="bg-blue-50 rounded-lg p-4 mb-3">
                      <p className="text-sm font-semibold text-blue-800 mb-1">📍 Contact :</p>
                      <p className="text-blue-900">{priorite.contact}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 mb-3">
                      <p className="text-sm font-semibold text-green-800 mb-1">✅ Action à faire :</p>
                      <p className="text-green-900">{priorite.action}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm font-semibold text-purple-800 mb-1">💡 Pourquoi :</p>
                      <p className="text-purple-900">{priorite.why}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section Organisations */}
        {activeSection === 'organisations' && (
          <div className="space-y-6">
            {organisations.map((org, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                  {org.category}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {org.items.map((item, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-2">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section Étapes */}
        {activeSection === 'etapes' && (
          <div className="space-y-6">
            {etapes.map((etape) => (
              <div key={etape.step} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-start gap-4">
                  <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
                    {etape.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{etape.title}</h3>
                    <p className="text-gray-700 mb-4">{etape.description}</p>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="font-semibold text-blue-800 mb-2">Actions concrètes :</p>
                      <ul className="space-y-2">
                        {etape.actions.map((action, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-blue-900">
                            <span className="text-blue-600 mt-1">✓</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section Ressources */}
        {activeSection === 'ressources' && (
          <div className="grid md:grid-cols-2 gap-6">
            {ressources.map((ressource, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                  {ressource.type}
                </h3>
                <ul className="space-y-3">
                  {ressource.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <span className="text-green-600 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Section Partenaires */}
        {activeSection === 'partenaires' && (
          <div className="space-y-6">
            {/* Message d'introduction */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 mb-8 text-white border-4 border-yellow-300">
              <h2 className="text-3xl font-bold mb-4 text-center">
                🤝 TROUVER UN COMPAGNON SOLIDE
              </h2>
              <p className="text-lg text-center mb-4 opacity-95">
                Vous n'êtes pas seul ! Voici comment trouver quelqu'un qui vous aidera à réaliser votre projet.
              </p>
              <div className="bg-white/20 rounded-lg p-5">
                <p className="text-xl font-bold mb-3 text-center">🎯 OÙ ALLER EN PREMIER ?</p>
                <p className="text-base opacity-95 text-center mb-4">
                  <strong>Le Ministère de l'Économie</strong> est votre meilleur point de départ. 
                  Ils connaissent tous les développeurs, mentors et partenaires qui peuvent vous aider.
                </p>
                <div className="bg-yellow-400 text-gray-900 rounded-lg p-4">
                  <p className="font-bold text-lg text-center">
                    ⚡ COMMENCEZ PAR LE MINISTÈRE - ILS VOUS METTRONT EN CONTACT AVEC LES BONNES PERSONNES !
                  </p>
                </div>
              </div>
            </div>

            {/* Où trouver un partenaire */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-gray-200 pb-3">
                📍 Où trouver un partenaire technique
              </h3>
              <div className="space-y-4">
                {partenaires.map((partenaire) => (
                  <div key={partenaire.id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-5 border-l-4 border-blue-500">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{partenaire.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-bold text-gray-900">{partenaire.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            partenaire.priorite === 'HAUTE' 
                              ? 'bg-red-500 text-white' 
                              : 'bg-yellow-500 text-gray-900'
                          }`}>
                            {partenaire.priorite}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{partenaire.description}</p>
                        <div className="bg-white rounded-lg p-4 mb-3">
                          <p className="text-sm font-semibold text-purple-800 mb-1">💡 Pourquoi :</p>
                          <p className="text-purple-900 text-sm">{partenaire.pourquoi}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <p className="text-sm font-semibold text-green-800 mb-1">✅ Action à faire :</p>
                          <p className="text-green-900 text-sm">{partenaire.action}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Qualités d'un bon partenaire */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-gray-200 pb-3">
                ⭐ Qualités d'un bon partenaire
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {qualitesPartenaire.map((qualite, index) => (
                  <div key={index} className={`rounded-lg p-4 border-2 ${
                    qualite.importance === 'ESSENTIEL' 
                      ? 'bg-red-50 border-red-300' 
                      : 'bg-yellow-50 border-yellow-300'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-gray-900">{qualite.qualite}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        qualite.importance === 'ESSENTIEL' 
                          ? 'bg-red-500 text-white' 
                          : 'bg-yellow-500 text-gray-900'
                      }`}>
                        {qualite.importance}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{qualite.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Comment approcher un partenaire */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-gray-200 pb-3">
                💬 Comment approcher un partenaire
              </h3>
              <div className="space-y-4">
                {commentApprocher.map((item) => (
                  <div key={item.etape} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-5 border-l-4 border-green-500">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {item.etape}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-3">{item.titre}</h4>
                        <ul className="space-y-2">
                          {item.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-700">
                              <span className="text-green-600 mt-1">✓</span>
                              <span className="text-sm">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Script pour demander un partenaire */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-2xl font-bold mb-4 text-center">
                📝 Script pour demander un partenaire
              </h3>
              <div className="bg-white/20 rounded-lg p-5 space-y-4">
                <div className="bg-white/30 rounded-lg p-4">
                  <p className="font-semibold mb-2">💬 Ce que vous devez dire :</p>
                  <p className="text-sm italic leading-relaxed mb-3">
                    "Bonjour, je m'appelle [Votre nom]. J'ai développé un projet qui peut aider la communauté guinéenne. 
                    J'ai déjà fait beaucoup de travail, mais j'ai besoin d'un partenaire technique qui peut m'aider à le développer complètement."
                  </p>
                </div>
                <div className="bg-white/30 rounded-lg p-4">
                  <p className="font-semibold mb-2">💬 Continuez :</p>
                  <p className="text-sm italic leading-relaxed mb-3">
                    "Je suis jeune et je n'ai pas toutes les compétences techniques, mais j'ai une grande vision et beaucoup de passion. 
                    Je cherche quelqu'un de fiable qui croit en mon projet et qui veut m'aider à le réaliser."
                  </p>
                </div>
                <div className="bg-white/30 rounded-lg p-4">
                  <p className="font-semibold mb-2">💬 Demandez :</p>
                  <p className="text-sm italic leading-relaxed">
                    "Pouvez-vous me mettre en contact avec quelqu'un qui pourrait être intéressé ? 
                    Ou connaissez-vous un développeur, un mentor ou un entrepreneur expérimenté qui pourrait m'aider ?"
                  </p>
                </div>
              </div>
            </div>

            {/* Conseils finaux */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">💎 Conseils pour trouver le bon partenaire</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="font-semibold mb-2">✓ Soyez patient</p>
                  <p className="text-sm opacity-90">Trouver le bon partenaire prend du temps. Ne vous précipitez pas.</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="font-semibold mb-2">✓ Faites confiance à votre instinct</p>
                  <p className="text-sm opacity-90">Si quelque chose ne va pas, écoutez votre intuition.</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="font-semibold mb-2">✓ Commencez par le Ministère</p>
                  <p className="text-sm opacity-90">Ils vous mettront en contact avec des personnes fiables et vérifiées.</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="font-semibold mb-2">✓ Soyez clair sur vos attentes</p>
                  <p className="text-sm opacity-90">Expliquez exactement ce que vous cherchez et ce que vous offrez.</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="font-semibold mb-2">✓ Ne vous découragez pas</p>
                  <p className="text-sm opacity-90">Si quelqu'un refuse, continuez à chercher. Le bon partenaire existe !</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="font-semibold mb-2">✓ Montrez votre projet</p>
                  <p className="text-sm opacity-90">Montrez ce que vous avez déjà fait. C'est votre meilleur argument.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section spéciale : Comment présenter votre idée large */}
        <div className="mt-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white mb-6">
          <h3 className="text-2xl font-bold mb-4">📝 Comment présenter votre idée large au Ministère</h3>
          <div className="space-y-4">
            <div className="bg-white/20 rounded-lg p-4">
              <p className="font-semibold mb-2">1. Commencez par votre vision :</p>
              <p className="text-sm opacity-95">
                "J'ai créé une plateforme qui aide les Guinéens dans plusieurs domaines : la famille, les échanges commerciaux, 
                les services de l'État, la santé, l'éducation, etc."
              </p>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <p className="font-semibold mb-2">2. Expliquez pourquoi c'est large :</p>
              <p className="text-sm opacity-95">
                "Je veux créer un système complet qui répond à tous les besoins de la communauté guinéenne. 
                C'est ambitieux, mais c'est ma vision."
              </p>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <p className="font-semibold mb-2">3. Montrez ce que vous avez déjà :</p>
              <p className="text-sm opacity-95">
                "J'ai déjà développé plusieurs fonctionnalités : gestion familiale, échanges de produits, 
                services de l'État, etc. Le projet existe déjà en partie."
              </p>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <p className="font-semibold mb-2">4. Demandez de l'aide :</p>
              <p className="text-sm opacity-95">
                "Je suis jeune, je n'ai pas d'argent, mais j'ai une grande vision. 
                Pouvez-vous m'aider à structurer ce projet et trouver des financements ?"
              </p>
            </div>
          </div>
        </div>

        {/* Conseils finaux */}
        <div className="mt-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-2xl font-bold mb-4">💎 Conseils d'Or</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold mb-2">✓ Soyez persistant</p>
              <p className="text-sm opacity-90">Ne vous découragez pas si on vous dit "non". Continuez à essayer.</p>
            </div>
            <div>
              <p className="font-semibold mb-2">✓ Soyez honnête</p>
              <p className="text-sm opacity-90">Dites clairement que vous êtes jeune, sans argent, mais avec une vision. C'est une force !</p>
            </div>
            <div>
              <p className="font-semibold mb-2">✓ Montrez votre passion</p>
              <p className="text-sm opacity-90">Parlez avec enthousiasme de votre projet. La passion est contagieuse !</p>
            </div>
            <div>
              <p className="font-semibold mb-2">✓ N'ayez pas peur</p>
              <p className="text-sm opacity-90">Le Ministère est là pour vous aider, pas pour vous rejeter. Allez-y avec confiance !</p>
            </div>
            <div>
              <p className="font-semibold mb-2">✓ Construisez votre réseau</p>
              <p className="text-sm opacity-90">Chaque personne que vous rencontrez peut vous aider.</p>
            </div>
            <div>
              <p className="font-semibold mb-2">✓ Apprenez continuellement</p>
              <p className="text-sm opacity-90">Les compétences s'acquièrent avec le temps et la pratique.</p>
            </div>
          </div>
        </div>

        {/* Bouton retour */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/moi')}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Retour
          </button>
        </div>
      </div>
    </div>
  );
}

