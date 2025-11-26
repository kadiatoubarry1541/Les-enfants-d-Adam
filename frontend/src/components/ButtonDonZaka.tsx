interface ButtonDonZakaProps {
  type?: 'zaka' | 'familial';
}

export function ButtonDonZaka({ type = 'zaka' }: ButtonDonZakaProps) {
  const isFamilial = type === 'familial';
  
  const title = isFamilial ? '👨‍👩‍👧‍👦 Don Familial' : '🤲 Don pour Zaka';
  const description = isFamilial 
    ? 'Faites un don pour aider votre famille dans le besoin' 
    : 'Faites un don pour aider les personnes dans le besoin';
  const buttonText = isFamilial ? '👨‍👩‍👧‍👦 Faire un Don Familial' : '🤲 Faire un Don Zaka';
  const numero = isFamilial ? '624000' : '624000'; // Vous pouvez changer le numéro si nécessaire
  const numeroLabel = isFamilial ? 'Orange Money Familial' : 'Orange Money';
  
  return (
    <div className="my-6 flex justify-center">
      <div className={`bg-gradient-to-br ${isFamilial ? 'from-blue-50 to-indigo-50 border-blue-300' : 'from-amber-50 to-orange-50 border-amber-300'} rounded-xl shadow-lg border-2 max-w-lg w-full p-6`}>
        <h4 className={`text-xl font-bold ${isFamilial ? 'text-blue-800' : 'text-amber-800'} mb-3 text-center`}>{title}</h4>
        <div className="text-center mb-4">
          <p className="text-sm text-gray-700 mb-2">{description}</p>
          <p className={`text-lg font-bold ${isFamilial ? 'text-blue-700' : 'text-amber-700'}`}>
            {numeroLabel} : <span className="text-2xl">{numero}</span>
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm(`Appeler le numéro ${numeroLabel} : ${numero}?`)) {
              window.location.href = `tel:${numero}`;
            }
          }}
          className={`w-full px-6 py-4 bg-gradient-to-r ${isFamilial ? 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' : 'from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'} text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 text-lg`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
