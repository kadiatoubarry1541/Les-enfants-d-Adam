import { useEffect, useState } from 'react'
import { ArbreGenealogique } from '../../components/ArbreGenealogique'
import { ButtonDonZaka } from '../../components/ButtonDonZaka'

interface UserData {
  numeroH: string
  prenom: string
  nomFamille: string
  genre: 'HOMME' | 'FEMME' | 'AUTRE'
  [key: string]: any
}

export default function Arbre() {
  const [user, setUser] = useState<UserData | null>(null)
  const [activeTab, setActiveTab] = useState<'arbre' | 'echanges'>('arbre')

  useEffect(() => {
    const sessionData = JSON.parse(localStorage.getItem('session_user') || '{}')
    const u = sessionData.userData || sessionData
    if (u?.numeroH) setUser(u)
  }, [])

  const effectiveUser: UserData = user || {
    numeroH: '',
    prenom: 'Invité',
    nomFamille: '',
    genre: 'HOMME'
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Bouton Don Familial - TRÈS VISIBLE EN HAUT */}
      <ButtonDonZaka type="familial" />
      
      <div className="card">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('arbre')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              activeTab === 'arbre'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🌳 Mon arbre
          </button>
          <button
            onClick={() => setActiveTab('echanges')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              activeTab === 'echanges'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            💬 Échanges familiaux
          </button>
        </div>

        {activeTab === 'arbre' && (
          <>
            <h2 className="text-2xl font-bold mb-4">🌳 Mon arbre généalogique</h2>
            <ArbreGenealogique userData={effectiveUser} />
          </>
        )}

        {activeTab === 'echanges' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">💬 Échanges familiaux</h2>
            <p className="text-gray-600 mb-6">
              Communiquez avec les membres de votre arbre généalogique par écrit, audio et vidéo.
            </p>
            
            {/* Compte Orange Money */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🍊</div>
                <div>
                  <h3 className="font-semibold text-orange-800">Orange Money</h3>
                  <p className="text-sm text-orange-600">Compte familial pour les transactions</p>
                  <p className="text-lg font-bold text-orange-800">+224 123 456 789</p>
                </div>
              </div>
            </div>

            {/* Interface d'échanges */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Nouveau message</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Destinataire</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="">Sélectionner un membre de la famille</option>
                      <option value="pere">Père</option>
                      <option value="mere">Mère</option>
                      <option value="frere">Frère</option>
                      <option value="soeur">Sœur</option>
                      <option value="enfant">Enfant</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type de message</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="text">📝 Texte</option>
                      <option value="audio">🎵 Audio</option>
                      <option value="video">🎥 Vidéo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={4}
                      placeholder="Écrivez votre message familial..."
                    />
                  </div>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                    📤 Envoyer
                  </button>
                </div>
              </div>

              {/* Messages récents */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Messages récents</h4>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-medium text-gray-900">Père</h5>
                        <p className="text-sm text-gray-600">📝 Message texte</p>
                      </div>
                      <span className="text-xs text-gray-500">Il y a 2h</span>
                    </div>
                    <p className="text-gray-700 text-sm">Comment vas-tu mon enfant ? J'espère que tout va bien...</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-medium text-gray-900">Mère</h5>
                        <p className="text-sm text-gray-600">🎵 Message audio</p>
                      </div>
                      <span className="text-xs text-gray-500">Il y a 5h</span>
                    </div>
                    <p className="text-gray-700 text-sm">Message vocal de 2 minutes</p>
                    <button className="mt-2 px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                      ▶️ Écouter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
