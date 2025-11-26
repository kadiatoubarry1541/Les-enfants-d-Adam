interface PaiementMarchandProps {
  numero?: string;
  title?: string;
}

export function PaiementMarchand({ numero = '65432', title = 'Paiement Marchand' }: PaiementMarchandProps) {
  return (
    <div className="my-6 flex justify-center">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg border-2 border-green-300 max-w-lg w-full p-6">
        <h4 className="text-xl font-bold text-green-800 mb-3 text-center">💳 {title}</h4>
        <div className="text-center mb-4">
          <p className="text-sm text-gray-700 mb-2">Utilisez ce numéro pour payer vos achats de produits</p>
          <p className="text-lg font-bold text-green-700">
            Numéro Marchand : <span className="text-2xl font-mono">{numero}</span>
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Orange Money • MTN Money • M-Pesa
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm(`Appeler le numéro marchand : ${numero}?`)) {
              window.location.href = `tel:${numero}`;
            }
          }}
          className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 text-lg"
        >
          💳 Payer avec {numero}
        </button>
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-600">
            💡 Le paiement sera traité automatiquement lors de votre achat
          </p>
        </div>
      </div>
    </div>
  );
}

