import { useNavigate } from 'react-router-dom';

interface EchangesProfessionnelProps {
  userData: any;
}

export function EchangesProfessionnel({ userData }: EchangesProfessionnelProps) {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <button
        onClick={() => navigate('/activite')}
        className="mb-4 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm"
      >
        ← Retour
      </button>

      {/* Titre simplifié */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Échanges</h1>
      </div>

      {/* Boutons réduits et simplifiés */}
      <div className="grid grid-cols-2 gap-2">
        {/* Page Primaire */}
        <button 
          onClick={() => navigate('/echange/primaire')}
          className="bg-green-600 hover:bg-green-700 rounded-lg shadow-sm p-2 transition-all cursor-pointer text-white flex flex-col items-center justify-center gap-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 01.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
          <span className="text-xs font-medium">Primaire</span>
        </button>

        {/* Page Secondaire */}
        <button 
          onClick={() => navigate('/echange/secondaire')}
          className="bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm p-2 transition-all cursor-pointer text-white flex flex-col items-center justify-center gap-1"
        >
          <span className="text-2xl">🛍️</span>
          <span className="text-xs font-medium">Secondaire</span>
        </button>
      </div>
    </div>
  );
}
