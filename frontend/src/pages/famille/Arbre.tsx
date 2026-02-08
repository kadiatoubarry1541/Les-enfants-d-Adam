import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArbreGenealogique } from '../../components/ArbreGenealogique'
import { buildFamilyTree, getCercleDesRacinesCounts } from '../../services/FamilyTreeBuilder'
import { useI18n } from '../../i18n/useI18n'

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
  const { t } = useI18n()

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

  const familyMembers = useMemo(() => buildFamilyTree(effectiveUser), [effectiveUser])
  const cercleCounts = useMemo(
    () => getCercleDesRacinesCounts(effectiveUser, familyMembers),
    [effectiveUser, familyMembers]
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/famille"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors shadow-sm border border-gray-200 dark:border-gray-600"
        >
          <span aria-hidden>←</span>
          Retour à Famille
        </Link>
      </div>
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

            <section className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
              <h3 className="text-xl font-bold mb-4">{t('wiz.live.title4')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Effectifs calculés automatiquement à partir de votre arbre familial.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('label.brothers_mother')}
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-center font-medium">
                    {cercleCounts.nbFreresMere}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('label.sisters_mother')}
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-center font-medium">
                    {cercleCounts.nbSoeursMere}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('label.brothers_father')}
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-center font-medium">
                    {cercleCounts.nbFreresPere}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('label.sisters_father')}
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-center font-medium">
                    {cercleCounts.nbSoeursPere}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('label.aunts_maternal')}
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-center font-medium">
                    {cercleCounts.nbTantesMaternelles}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('label.aunts_paternal')}
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-center font-medium">
                    {cercleCounts.nbTantesPaternelles}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('label.uncles_maternal')}
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-center font-medium">
                    {cercleCounts.nbOnclesMaternels}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('label.uncles_paternal')}
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-center font-medium">
                    {cercleCounts.nbOnclesPaternels}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('label.cousins_male')}
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-center font-medium">
                    {cercleCounts.nbCousins}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('label.cousins_female')}
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-center font-medium">
                    {cercleCounts.nbCousines}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('label.daughters')}
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-center font-medium">
                    {cercleCounts.nbFilles}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('label.sons')}
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-center font-medium">
                    {cercleCounts.nbGarcons}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'echanges' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">💬 Échanges familiaux</h2>
            <p className="text-gray-600 mb-6">
              Communiquez avec les membres de votre arbre généalogique par écrit, audio et vidéo.
            </p>
            
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
