import React from 'react';

interface UserData {
  numeroH: string;
  prenom: string;
  nomFamille: string;
  [key: string]: any;
}

interface DefiEducatifContentProps {
  userData: UserData | null;
}

export default function DefiEducatifContent({ userData }: DefiEducatifContentProps) {
  const [challenges, setChallenges] = React.useState([
    {
      id: '1',
      title: 'Défi Mathématiques',
      description: 'Résolvez 10 problèmes de mathématiques de niveau intermédiaire',
      category: 'Mathématiques',
      difficulty: 'Moyen',
      points: 100,
      completed: false,
      progress: 0
    },
    {
      id: '2',
      title: 'Défi Français',
      description: 'Complétez 5 exercices de grammaire française',
      category: 'Langue',
      difficulty: 'Facile',
      points: 50,
      completed: false,
      progress: 0
    },
    {
      id: '3',
      title: 'Défi Sciences',
      description: 'Répondez à un quiz sur les sciences naturelles',
      category: 'Sciences',
      difficulty: 'Difficile',
      points: 150,
      completed: false,
      progress: 0
    }
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          🎯 Défis Éducatifs
        </h2>
        
        {userData && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-700">
              Bienvenue <span className="font-semibold">{userData.prenom} {userData.nomFamille}</span> !
            </p>
            <p className="text-sm text-gray-600 mt-1">
              NumeroH: {userData.numeroH}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {challenge.title}
                </h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  challenge.difficulty === 'Facile' ? 'bg-green-100 text-green-800' :
                  challenge.difficulty === 'Moyen' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {challenge.difficulty}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">
                {challenge.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">
                  Catégorie: {challenge.category}
                </span>
                <span className="text-sm font-semibold text-blue-600">
                  {challenge.points} points
                </span>
              </div>

              {challenge.progress > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progrès</span>
                    <span>{challenge.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${challenge.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  challenge.completed
                    ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                disabled={challenge.completed}
              >
                {challenge.completed ? '✓ Terminé' : 'Commencer le défi'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            💡 Comment ça fonctionne ?
          </h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Choisissez un défi qui vous intéresse</li>
            <li>Complétez les exercices pour gagner des points</li>
            <li>Suivez votre progression et améliorez vos compétences</li>
            <li>Débloquez de nouveaux défis en progressant</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

