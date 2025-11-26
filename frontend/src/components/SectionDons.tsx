import { useNavigate } from 'react-router-dom';

interface SectionDonsProps {
  numeroH?: string;
}

export function SectionDons({ numeroH }: SectionDonsProps) {
  const navigate = useNavigate();

  const statistiques = {
    cartesRemises: 60,
    personnesDansLeBesoin: 845
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl shadow-lg border-2 border-emerald-200 p-6 my-8">
      {/* Message principal */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-emerald-800 mb-4 text-center">
          🌍 Les enfants d'ADAM et EVE Guinée
        </h3>
        <div className="bg-white rounded-lg p-6 shadow-md border border-emerald-100">
          <p className="text-gray-800 leading-relaxed mb-4 text-center italic">
            "Nous vous invitons chaque dimanche à venir rendre visite et saluer les personnes malades de notre hôpital."
          </p>
          <p className="text-gray-800 leading-relaxed mb-4 text-center">
            Nous sommes tous nés d'une même mère et d'un même père : la santé de chacun est la responsabilité de tous.
          </p>
          <p className="text-gray-800 leading-relaxed text-center font-semibold text-emerald-700">
            Ô DIEU, bénis ceux qui donnent et ceux qui reçoivent, et accorde-nous le Paradis pour notre sincérité.
          </p>
        </div>
      </div>

      {/* Tableau des statistiques */}
      <div className="bg-white rounded-lg p-6 shadow-md mb-6">
        <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">📊 Statistiques</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
            <div className="text-3xl font-bold text-emerald-700 text-center mb-2">
              {statistiques.cartesRemises.toLocaleString()}
            </div>
            <div className="text-sm text-gray-700 text-center font-medium">
              Nombre de cartes remises
            </div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-200">
            <div className="text-3xl font-bold text-amber-700 text-center mb-2">
              {statistiques.personnesDansLeBesoin.toLocaleString()}
            </div>
            <div className="text-sm text-gray-700 text-center font-medium">
              Personnes ayant besoin de cette carte
            </div>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="space-y-4">
        {/* Don pour la Santé */}
        <div className="bg-white rounded-lg p-6 shadow-md border-2 border-emerald-200">
          <h4 className="text-lg font-bold text-gray-900 mb-3 text-center">🏥 Don pour la Santé</h4>
          <button
            onClick={() => navigate('/solidarite?type=sante')}
            className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
          >
            💚 Faire un Don Santé
          </button>
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-600">Orange Money Santé : <span className="font-bold text-emerald-700">653621</span></p>
          </div>
        </div>

        {/* Don pour l'Éducation */}
        <div className="bg-white rounded-lg p-6 shadow-md border-2 border-blue-200">
          <h4 className="text-lg font-bold text-gray-900 mb-3 text-center">🎓 Don pour l'Éducation</h4>
          <button
            onClick={() => navigate('/solidarite?type=education')}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
          >
            🎓 Faire un Don Éducation
          </button>
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-600">Orange Money Éducation : <span className="font-bold text-blue-700">625500</span></p>
          </div>
        </div>

        {/* Solidarité - Dons pour tous */}
        <div className="bg-white rounded-lg p-6 shadow-md border-2 border-pink-200">
          <h4 className="text-lg font-bold text-gray-900 mb-3 text-center">🤝 Solidarité (Tous)</h4>
          <p className="text-xs text-gray-600 mb-3 text-center">Dons généraux pour tous, toutes religions confondues</p>
          <button
            onClick={() => navigate('/solidarite')}
            className="w-full px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
          >
            🤝 Faire un Don Solidarité
          </button>
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-600">Orange Money Solidarité : <span className="font-bold text-pink-700">624000</span></p>
          </div>
        </div>

        {/* Don pour Zaka - Musulmans uniquement */}
        <div className="bg-white rounded-lg p-6 shadow-md border-2 border-amber-200">
          <h4 className="text-lg font-bold text-gray-900 mb-3 text-center">🤲 Zaka (Musulmans)</h4>
          <p className="text-xs text-gray-600 mb-3 text-center">Aumône obligatoire pour les musulmans uniquement</p>
          <button
            onClick={() => navigate('/zaka')}
            className="w-full px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
          >
            🤲 Faire un Don Zaka
          </button>
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-600">Orange Money Zaka : <span className="font-bold text-amber-700">624000</span></p>
          </div>
        </div>
      </div>

      {/* Bouton page Santé */}
      <button
        onClick={() => navigate('/sante')}
        className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
      >
        🏥 Aller à la page Santé
      </button>
    </div>
  );
}

