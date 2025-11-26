export function ButtonDonSante() {
  return (
    <div className="my-6 flex justify-center">
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl shadow-lg border-2 border-emerald-300 max-w-lg w-full p-6">
        <h4 className="text-xl font-bold text-emerald-800 mb-3 text-center">🏥 Don pour la Santé</h4>
        <div className="text-center mb-4">
          <p className="text-sm text-gray-700 mb-2">Faites un don pour soutenir la santé des enfants d'Adam et Eve</p>
          <p className="text-lg font-bold text-emerald-700">Orange Money : <span className="text-2xl">653621</span></p>
        </div>
        <button
          onClick={() => {
            const numero = '653621';
            if (confirm(`Appeler le numéro Orange Money : ${numero}?`)) {
              window.location.href = `tel:${numero}`;
            }
          }}
          className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 text-lg"
        >
          💚 Faire un Don Santé
        </button>
      </div>
    </div>
  );
}
