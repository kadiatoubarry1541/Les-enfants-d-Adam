import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  findLocationByCode,
  type GeographicLocation
} from '../utils/worldGeography';
import { getCountryFlag, getContinentIcon, getRegionIcon } from '../utils/countryFlags';

interface UserData {
  numeroH: string;
  prenom: string;
  nomFamille: string;
  [key: string]: any;
}

export default function TerreAdam() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<'lieux' | 'region' | 'pays' | 'continent' | 'mondial'>('lieux');
  const [activeLieuTab, setActiveLieuTab] = useState<'quartier' | 'sous-prefecture' | 'prefecture'>('quartier');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Récupérer les informations géographiques de l'utilisateur depuis la session
  const userContinent = userData?.continentCode ? findLocationByCode(userData.continentCode) : null;
  const userCountry = userData?.paysCode ? findLocationByCode(userData.paysCode) : null;
  const userRegion = userData?.regionCode ? findLocationByCode(userData.regionCode) : null;
  const userPrefecture = userData?.prefectureCode ? findLocationByCode(userData.prefectureCode) : null;
  const userSousPrefecture = userData?.sousPrefectureCode ? findLocationByCode(userData.sousPrefectureCode) : null;
  const userQuartier = userData?.quartierCode ? findLocationByCode(userData.quartierCode) : null;

  useEffect(() => {
    const session = localStorage.getItem("session_user");
    if (!session) {
      navigate("/login");
      return;
    }

    try {
      const parsed = JSON.parse(session);
      const user = parsed.userData || parsed;
      if (!user || !user.numeroH) {
        navigate("/login");
        return;
      }
      
      // ❌ Les défunts n'ont pas de compte et ne peuvent pas accéder à cette page
      if (user.type === 'defunt' || user.isDeceased || user.numeroHD) {
        alert("⚠️ Les défunts n'ont pas de compte. Leurs informations sont dans l'arbre généalogique.");
        navigate("/");
        return;
      }
      
      setUserData(user);
      setLoading(false);
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b overflow-hidden">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4 md:py-6 overflow-hidden">
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 overflow-hidden flex-1 min-w-0">
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl flex-shrink-0">
                {userData?.continentCode ? getContinentIcon(userData.continentCode, userContinent?.name) : '🌍'}
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 break-words">
                  Terre ADAM {userContinent?.name ? `- ${userContinent.name}` : ''}
                </h1>
                <p className="mt-0.5 sm:mt-1 md:mt-2 text-[10px] sm:text-xs md:text-sm text-gray-600 break-words">Organisation géographique mondiale - Votre localisation</p>
              </div>
            </div>
            <div className="flex space-x-2 sm:space-x-3 md:space-x-4 flex-shrink-0">
              <button
                onClick={() => navigate('/moi')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-1.5 sm:px-2 md:px-3 lg:px-4 py-1 sm:py-1.5 md:py-2 text-[10px] sm:text-xs md:text-sm rounded-lg transition-colors whitespace-nowrap"
              >
                ← Retour
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b overflow-hidden">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-8 overflow-x-auto">
            {[
              { 
                id: 'lieux', 
                label: 'Résidence', 
                icon: '🏠',
                customLabel: userQuartier ? `Mon Quartier` : 'Résidence'
              },
              { 
                id: 'region', 
                label: 'Région', 
                icon: getRegionIcon(userData?.regionCode, userRegion?.name || userData?.region || userData?.regionOrigine),
                customLabel: userRegion ? `Ma Région` : 'Région'
              },
              { 
                id: 'pays', 
                label: 'Pays', 
                icon: userData?.paysCode ? getCountryFlag(userData.paysCode, userCountry?.name) : '🏳️',
                customLabel: userCountry ? `Mon Pays` : 'Pays'
              },
              { 
                id: 'continent', 
                label: 'Continent', 
                icon: userData?.continentCode ? getContinentIcon(userData.continentCode, userContinent?.name) : '🌐',
                customLabel: userContinent ? `Mon Continent` : 'Continent'
              },
              { id: 'mondial', label: 'Mondial', icon: '🌎' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-1.5 sm:py-2 md:py-3 px-0.5 sm:px-1 md:px-2 border-b-2 font-medium text-[10px] sm:text-xs md:text-sm flex items-center gap-0.5 sm:gap-1 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-xs sm:text-sm md:text-base">{tab.icon}</span>
                <span className="text-[10px] sm:text-xs md:text-sm leading-tight">{tab.customLabel || tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 overflow-hidden">
        {/* 1. Résidence */}
        {activeTab === 'lieux' && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6 overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 overflow-hidden">
              <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-1.5 sm:gap-2 md:gap-3">
                <span className="text-base sm:text-lg md:text-xl lg:text-2xl">🏠</span>
                <span className="text-[11px] sm:text-xs md:text-sm lg:text-base">Résidence</span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 sm:mb-6">
                Votre localisation précise enregistrée lors de l'inscription
              </p>

              {/* Sous-onglets pour Résidence */}
              <div className="border-b border-gray-200 mb-3 sm:mb-4 md:mb-6 overflow-hidden">
                <nav className="flex space-x-1 sm:space-x-2 md:space-x-4 overflow-x-auto">
                  {[
                    { id: 'quartier', label: 'Quartier', icon: '🏘️' },
                    { id: 'sous-prefecture', label: 'Sous-préfecture', icon: '🏛️' },
                    { id: 'prefecture', label: 'Préfecture', icon: '🏢' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveLieuTab(tab.id as any)}
                      className={`py-1.5 sm:py-2 px-0.5 sm:px-1 md:px-2 border-b-2 font-medium text-[10px] sm:text-xs flex items-center gap-0.5 sm:gap-1 ${
                        activeLieuTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-xs sm:text-sm md:text-base">{tab.icon}</span>
                      <span className="text-[10px] sm:text-xs leading-tight break-words">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {userData?.continentCode && userData?.paysCode && userData?.regionCode && userData?.prefectureCode && userData?.sousPrefectureCode && userData?.quartierCode ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-sm text-blue-800 mb-4">
                      <strong>ℹ️ Information :</strong> Ces informations ont été enregistrées lors de votre inscription et ne peuvent pas être modifiées ici.
                    </p>
                  </div>

                  {/* Page Quartier */}
                  {activeLieuTab === 'quartier' && (
                    <div className="space-y-3 sm:space-y-4">
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-3 sm:p-4 md:p-6 overflow-hidden">
                        <div className="text-center overflow-hidden">
                          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3">🏘️</div>
                          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 break-words">
                            Mon Quartier : {userQuartier?.name || userData.quartier || userData.lieu1 || 'Non défini'}
                          </h3>
                          {userData.quartierCode && (
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-2 sm:mb-3">
                              Code : <span className="font-mono font-semibold">{userData.quartierCode}</span>
                            </p>
                          )}
                          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-blue-300 space-y-1 sm:space-y-1.5">
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 font-medium break-words">
                              <strong>Sous-préfecture :</strong> {userSousPrefecture?.name || userData.sousPrefecture || 'Non défini'}
                            </p>
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 font-medium break-words">
                              <strong>Préfecture :</strong> {userPrefecture?.name || userData.prefecture || 'Non défini'}
                            </p>
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 font-medium break-words">
                              <strong>Région :</strong> {userRegion?.name || userData.region || userData.regionOrigine || 'Non défini'}
                            </p>
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 font-medium break-words">
                              <strong>Pays :</strong> {userCountry?.name || userData.pays || 'Non défini'} {getCountryFlag(userData.paysCode, userCountry?.name)}
                            </p>
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 font-medium break-words">
                              <strong>Continent :</strong> {userContinent?.name || userData.continent || 'Non défini'} {getContinentIcon(userData.continentCode, userContinent?.name)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-4 md:mt-6">
                        <button
                          onClick={() => {
                            alert('Accès à l\'espace communautaire de votre quartier');
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 rounded-lg transition-colors text-[10px] sm:text-xs md:text-sm font-medium"
                        >
                          ✅ Accéder à l'espace Quartier
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Page Sous-préfecture */}
                  {activeLieuTab === 'sous-prefecture' && (
                    <div className="space-y-3 sm:space-y-4">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-3 sm:p-4 md:p-6 overflow-hidden">
                        <div className="text-center overflow-hidden">
                          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3">🏛️</div>
                          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 break-words">
                            Ma Sous-préfecture : {userSousPrefecture?.name || userData.sousPrefecture || 'Non défini'}
                          </h3>
                          {userData.sousPrefectureCode && (
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-2 sm:mb-3">
                              Code : <span className="font-mono font-semibold">{userData.sousPrefectureCode}</span>
                            </p>
                          )}
                          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-green-300 space-y-1 sm:space-y-1.5">
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 font-medium break-words">
                              <strong>Préfecture :</strong> {userPrefecture?.name || userData.prefecture || 'Non défini'}
                            </p>
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 font-medium break-words">
                              <strong>Région :</strong> {userRegion?.name || userData.region || userData.regionOrigine || 'Non défini'}
                            </p>
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 font-medium break-words">
                              <strong>Pays :</strong> {userCountry?.name || userData.pays || 'Non défini'} {getCountryFlag(userData.paysCode, userCountry?.name)}
                            </p>
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 font-medium break-words">
                              <strong>Continent :</strong> {userContinent?.name || userData.continent || 'Non défini'} {getContinentIcon(userData.continentCode, userContinent?.name)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-4 md:mt-6">
                        <button
                          onClick={() => {
                            alert('Accès à l\'espace communautaire de votre sous-préfecture');
                          }}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 rounded-lg transition-colors text-[10px] sm:text-xs md:text-sm font-medium"
                        >
                          ✅ Accéder à l'espace Sous-préfecture
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Page Préfecture */}
                  {activeLieuTab === 'prefecture' && (
                    <div className="space-y-3 sm:space-y-4">
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-3 sm:p-4 md:p-6 overflow-hidden">
                        <div className="text-center overflow-hidden">
                          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3">🏢</div>
                          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 break-words">
                            Ma Préfecture : {userPrefecture?.name || userData.prefecture || 'Non défini'}
                          </h3>
                          {userData.prefectureCode && (
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-2 sm:mb-3">
                              Code : <span className="font-mono font-semibold">{userData.prefectureCode}</span>
                            </p>
                          )}
                          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-purple-300 space-y-1 sm:space-y-1.5">
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 font-medium break-words">
                              <strong>Région :</strong> {userRegion?.name || userData.region || userData.regionOrigine || 'Non défini'}
                            </p>
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 font-medium break-words">
                              <strong>Pays :</strong> {userCountry?.name || userData.pays || 'Non défini'} {getCountryFlag(userData.paysCode, userCountry?.name)}
                            </p>
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 font-medium break-words">
                              <strong>Continent :</strong> {userContinent?.name || userData.continent || 'Non défini'} {getContinentIcon(userData.continentCode, userContinent?.name)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-4 md:mt-6">
                        <button
                          onClick={() => {
                            alert('Accès à l\'espace communautaire de votre préfecture');
                          }}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 rounded-lg transition-colors text-[10px] sm:text-xs md:text-sm font-medium"
                        >
                          ✅ Accéder à l'espace Préfecture
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Code complet - affiché sur toutes les sous-pages */}
                  <div className="mt-3 sm:mt-4 md:mt-6 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg p-3 sm:p-4 md:p-6 overflow-hidden">
                    <label className="block text-[10px] sm:text-xs md:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      📍 Code géographique complet
                    </label>
                    <div className="text-xs sm:text-sm md:text-base lg:text-lg font-mono font-bold text-blue-600 break-all overflow-wrap-anywhere">
                      {userData.continentCode || ''}{userData.paysCode || ''}{userData.regionCode || ''}{userData.prefectureCode || ''}{userData.sousPrefectureCode || ''}{userData.quartierCode || ''}
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-600 mt-1.5 sm:mt-2 break-words">
                      Ce code fait partie de votre NumeroH : <strong className="break-all">{userData.numeroH}</strong>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="text-yellow-800">
                    <strong>⚠️ Aucune localisation enregistrée</strong>
                    <br />
                    Vous n'avez pas encore enregistré vos informations géographiques lors de l'inscription.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. Région */}
        {activeTab === 'region' && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6 overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 overflow-hidden">
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-wrap">
                <span className="text-base sm:text-lg md:text-xl">{getRegionIcon(userData?.regionCode, userRegion?.name || userData?.region || userData?.regionOrigine)}</span>
                <span className="text-[11px] sm:text-xs md:text-sm break-words">Ma Région : {userRegion?.name || userData?.region || userData?.regionOrigine || 'Région'}</span>
              </h2>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-3 sm:mb-4 md:mb-6">
                Votre région enregistrée lors de l'inscription
              </p>
              
              {userData?.regionCode ? (
                <div className="space-y-2 sm:space-y-3 md:space-y-4 overflow-hidden">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-2 sm:p-3 md:p-4 rounded overflow-hidden">
                    <p className="text-[10px] sm:text-xs md:text-sm text-blue-800 mb-1.5 sm:mb-2 md:mb-4 break-words">
                      <strong>ℹ️ Information :</strong> Ces informations ont été enregistrées lors de votre inscription.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-3 sm:p-4 md:p-6 overflow-hidden">
                    <div className="text-center overflow-hidden">
                      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3">{getRegionIcon(userData.regionCode, userRegion?.name || userData.region || userData.regionOrigine)}</div>
                      <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 break-words">
                        {userRegion?.name || userData.region || userData.regionOrigine || 'Non défini'}
                      </h3>
                      {userData.regionCode && (
                        <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-2 sm:mb-3">
                          Code : <span className="font-mono font-semibold">{userData.regionCode}</span>
                        </p>
                      )}
                      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-green-300">
                        <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 font-medium break-words">
                          <strong>Pays :</strong> {userCountry?.name || userData.pays || 'Non défini'} {getCountryFlag(userData.paysCode, userCountry?.name)}
                        </p>
                        <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 font-medium break-words">
                          <strong>Continent :</strong> {userContinent?.name || userData.continent || 'Non défini'} {getContinentIcon(userData.continentCode, userContinent?.name)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 md:mt-6">
                    <button
                      onClick={() => {
                        alert('Accès à l\'espace communautaire de votre région');
                        // Ici, vous pouvez naviguer vers l'espace de la région
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 rounded-lg transition-colors text-[10px] sm:text-xs md:text-sm font-medium"
                    >
                      ✅ Accéder à l'espace Région
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 sm:p-3 md:p-4 rounded overflow-hidden">
                  <p className="text-[10px] sm:text-xs md:text-sm text-yellow-800 break-words">
                    <strong>⚠️ Aucune région enregistrée</strong>
                    <br />
                    Vous n'avez pas encore enregistré votre région lors de l'inscription.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Pays */}
        {activeTab === 'pays' && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6 overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 overflow-hidden">
              {/* Afficher le titre avec le drapeau et le nom SEULEMENT si un pays est enregistré */}
              {userData?.paysCode && userCountry ? (
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-wrap">
                  <span className="text-base sm:text-lg md:text-xl lg:text-2xl">{getCountryFlag(userData.paysCode, userCountry.name)}</span>
                  <span className="text-[11px] sm:text-xs md:text-sm break-words">Mon Pays : {userCountry.name}</span>
                </h2>
              ) : (
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-wrap">
                  <span className="text-base sm:text-lg md:text-xl lg:text-2xl">🏳️</span>
                  <span className="text-[11px] sm:text-xs md:text-sm break-words">Mon Pays</span>
                </h2>
              )}
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-3 sm:mb-4 md:mb-6">
                Votre pays enregistré lors de l'inscription
              </p>
              
              {userData?.paysCode && userCountry ? (
                <div className="space-y-2 sm:space-y-3 md:space-y-4 overflow-hidden">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-2 sm:p-3 md:p-4 rounded overflow-hidden">
                    <p className="text-[10px] sm:text-xs md:text-sm text-blue-800 mb-1.5 sm:mb-2 md:mb-4 break-words">
                      <strong>ℹ️ Information :</strong> Ces informations ont été enregistrées lors de votre inscription.
                    </p>
                  </div>

                  {/* Carte principale avec drapeau et nom du pays */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-3 sm:p-4 md:p-6 overflow-hidden">
                    <div className="text-center overflow-hidden">
                      {/* Utiliser le paysCode pour obtenir le drapeau correct */}
                      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3">
                        {getCountryFlag(userData.paysCode, userCountry.name)}
                      </div>
                      <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">Mon Pays</h3>
                      {/* Afficher SEULEMENT le nom du pays trouvé par findLocationByCode */}
                      <p className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-purple-600 mb-2 sm:mb-3 break-words">
                        {userCountry.name}
                      </p>
                      {userData.paysCode && (
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
                          Code : <span className="font-mono font-semibold">{userData.paysCode}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 md:mt-6">
                    <button
                      onClick={() => {
                        alert('Accès à l\'espace communautaire de votre pays');
                        // Ici, vous pouvez naviguer vers l'espace du pays
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 rounded-lg transition-colors text-[10px] sm:text-xs md:text-sm font-medium"
                    >
                      ✅ Accéder à l'espace Pays
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 sm:p-3 md:p-4 rounded overflow-hidden">
                  <p className="text-[10px] sm:text-xs md:text-sm text-yellow-800 break-words">
                    <strong>⚠️ Aucun pays enregistré</strong>
                    <br />
                    Vous n'avez pas encore enregistré votre pays lors de l'inscription.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. Continent */}
        {activeTab === 'continent' && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6 overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 overflow-hidden">
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-wrap">
                <span className="text-base sm:text-lg md:text-xl">{getContinentIcon(userData?.continentCode, userContinent?.name)}</span>
                <span className="text-[11px] sm:text-xs md:text-sm break-words">Mon Continent : {userContinent?.name || userData?.continent || 'Continent'}</span>
              </h2>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-3 sm:mb-4 md:mb-6">
                Votre continent enregistré lors de l'inscription
              </p>
              
              {userData?.continentCode ? (
                <div className="space-y-2 sm:space-y-3 md:space-y-4 overflow-hidden">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-2 sm:p-3 md:p-4 rounded overflow-hidden">
                    <p className="text-[10px] sm:text-xs md:text-sm text-blue-800 mb-1.5 sm:mb-2 md:mb-4 break-words">
                      <strong>ℹ️ Information :</strong> Ces informations ont été enregistrées lors de votre inscription.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-lg p-3 sm:p-4 md:p-6 overflow-hidden">
                    <div className="text-center overflow-hidden">
                      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3">{getContinentIcon(userData.continentCode, userContinent?.name)}</div>
                      <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 break-words">
                        {userContinent?.name || userData.continent || 'Non défini'}
                      </h3>
                      {userData.continentCode && (
                        <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-2 sm:mb-3">
                          Code : <span className="font-mono font-semibold">{userData.continentCode}</span>
                        </p>
                      )}
                      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-orange-300">
                        <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 break-words">
                          <strong>Pays :</strong> {userCountry?.name || userData.pays || 'Non défini'} {getCountryFlag(userData.paysCode, userCountry?.name)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 md:mt-6">
                    <button
                      onClick={() => {
                        alert('Accès à l\'espace communautaire de votre continent');
                        // Ici, vous pouvez naviguer vers l'espace du continent
                      }}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 rounded-lg transition-colors text-[10px] sm:text-xs md:text-sm font-medium"
                    >
                      ✅ Accéder à l'espace Continent
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 sm:p-3 md:p-4 rounded overflow-hidden">
                  <p className="text-[10px] sm:text-xs md:text-sm text-yellow-800 break-words">
                    <strong>⚠️ Aucun continent enregistré</strong>
                    <br />
                    Vous n'avez pas encore enregistré votre continent lors de l'inscription.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. Mondial */}
        {activeTab === 'mondial' && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6 overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 overflow-hidden">
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-1.5 sm:gap-2 md:gap-3">
                <span className="text-base sm:text-lg md:text-xl">🌎</span>
                <span className="text-[11px] sm:text-xs md:text-sm">Mondial</span>
              </h2>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-3 sm:mb-4 md:mb-6 break-words">
                Accédez à l'espace communautaire mondial - Tous les membres de la Terre ADAM
              </p>
              
              <div className="text-center py-3 sm:py-4 md:py-6 lg:py-8 overflow-hidden">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3">🌎</div>
                <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-700 mb-3 sm:mb-4 md:mb-6 break-words">
                  Bienvenue dans l'espace mondial de la Terre ADAM
                </p>
                <button
                  onClick={() => {
                    alert('Accès à l\'espace mondial');
                    // Ici, vous pouvez naviguer vers l'espace mondial
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 lg:px-8 rounded-lg transition-colors text-[10px] sm:text-xs md:text-sm lg:text-base font-medium"
                >
                  ✅ Accéder à l'espace Mondial
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

