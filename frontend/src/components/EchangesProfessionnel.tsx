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
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-medium">Secondaire</span>
        </button>
      </div>
    </div>
  );
}
