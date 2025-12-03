import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  findLocationByCode,
  type GeographicLocation
} from '../utils/worldGeography';
import { getCountryFlag, getContinentIcon } from '../utils/countryFlags';

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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Terre ADAM</h1>
                <p className="mt-2 text-gray-600">Organisation géographique mondiale - Votre localisation</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/moi')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                ← Retour
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { 
                id: 'lieux', 
                label: 'Lieux de résidence', 
                icon: '🏠',
                customLabel: userQuartier ? `Mon Quartier` : 'Lieux de résidence'
              },
              { 
                id: 'region', 
                label: 'Région', 
                icon: '🗺️',
                customLabel: userRegion ? `Ma Région` : 'Région'
              },
              { 
                id: 'pays', 
                label: 'Pays', 
                icon: getCountryFlag(userData?.paysCode, userCountry?.name),
                customLabel: userCountry ? `Mon Pays` : 'Pays'
              },
              { 
                id: 'continent', 
                label: 'Continent', 
                icon: getContinentIcon(userData?.continentCode, userContinent?.name),
                customLabel: userContinent ? `Mon Continent` : 'Continent'
              },
              { id: 'mondial', label: 'Mondial', icon: '🌎' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2 text-lg">{tab.icon}</span>
                {tab.customLabel || tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 1. Lieux de résidence */}
        {activeTab === 'lieux' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-3xl">🏠</span>
                <span>Mes Lieux de résidence</span>
              </h2>
              <p className="text-gray-600 mb-6">
                Votre localisation précise enregistrée lors de l'inscription
              </p>

              {/* Sous-onglets pour Lieux de résidence */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  {[
                    { id: 'quartier', label: 'Quartier', icon: '🏘️' },
                    { id: 'sous-prefecture', label: 'Sous-préfecture', icon: '🏛️' },
                    { id: 'prefecture', label: 'Préfecture', icon: '🏢' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveLieuTab(tab.id as any)}
                      className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                        activeLieuTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
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
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-6">
                        <div className="text-center">
                          <div className="text-6xl mb-4">🏘️</div>
                          <h3 className="text-3xl font-bold text-gray-900 mb-2">
                            Mon Quartier : {userQuartier?.name || userData.quartier || userData.lieu1 || 'Non défini'}
                          </h3>
                          {userData.quartierCode && (
                            <p className="text-lg text-gray-600 mb-4">
                              Code : <span className="font-mono font-semibold">{userData.quartierCode}</span>
                            </p>
                          )}
                          <div className="mt-4 pt-4 border-t border-blue-300 space-y-2">
                            <p className="text-base text-gray-700 font-medium">
                              <strong>Sous-préfecture :</strong> {userSousPrefecture?.name || userData.sousPrefecture || 'Non défini'}
                            </p>
                            <p className="text-base text-gray-700 font-medium">
                              <strong>Préfecture :</strong> {userPrefecture?.name || userData.prefecture || 'Non défini'}
                            </p>
                            <p className="text-base text-gray-700 font-medium">
                              <strong>Région :</strong> {userRegion?.name || userData.region || userData.regionOrigine || 'Non défini'}
                            </p>
                            <p className="text-base text-gray-700 font-medium">
                              <strong>Pays :</strong> {userCountry?.name || userData.pays || 'Non défini'} {getCountryFlag(userData.paysCode, userCountry?.name)}
                            </p>
                            <p className="text-base text-gray-700 font-medium">
                              <strong>Continent :</strong> {userContinent?.name || userData.continent || 'Non défini'} {getContinentIcon(userData.continentCode, userContinent?.name)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6">
                        <button
                          onClick={() => {
                            alert('Accès à l\'espace communautaire de votre quartier');
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors font-medium"
                        >
                          ✅ Accéder à l'espace Quartier
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Page Sous-préfecture */}
                  {activeLieuTab === 'sous-prefecture' && (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
                        <div className="text-center">
                          <div className="text-6xl mb-4">🏛️</div>
                          <h3 className="text-3xl font-bold text-gray-900 mb-2">
                            Ma Sous-préfecture : {userSousPrefecture?.name || userData.sousPrefecture || 'Non défini'}
                          </h3>
                          {userData.sousPrefectureCode && (
                            <p className="text-lg text-gray-600 mb-4">
                              Code : <span className="font-mono font-semibold">{userData.sousPrefectureCode}</span>
                            </p>
                          )}
                          <div className="mt-4 pt-4 border-t border-green-300 space-y-2">
                            <p className="text-base text-gray-700 font-medium">
                              <strong>Préfecture :</strong> {userPrefecture?.name || userData.prefecture || 'Non défini'}
                            </p>
                            <p className="text-base text-gray-700 font-medium">
                              <strong>Région :</strong> {userRegion?.name || userData.region || userData.regionOrigine || 'Non défini'}
                            </p>
                            <p className="text-base text-gray-700 font-medium">
                              <strong>Pays :</strong> {userCountry?.name || userData.pays || 'Non défini'} {getCountryFlag(userData.paysCode, userCountry?.name)}
                            </p>
                            <p className="text-base text-gray-700 font-medium">
                              <strong>Continent :</strong> {userContinent?.name || userData.continent || 'Non défini'} {getContinentIcon(userData.continentCode, userContinent?.name)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6">
                        <button
                          onClick={() => {
                            alert('Accès à l\'espace communautaire de votre sous-préfecture');
                          }}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors font-medium"
                        >
                          ✅ Accéder à l'espace Sous-préfecture
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Page Préfecture */}
                  {activeLieuTab === 'prefecture' && (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-6">
                        <div className="text-center">
                          <div className="text-6xl mb-4">🏢</div>
                          <h3 className="text-3xl font-bold text-gray-900 mb-2">
                            Ma Préfecture : {userPrefecture?.name || userData.prefecture || 'Non défini'}
                          </h3>
                          {userData.prefectureCode && (
                            <p className="text-lg text-gray-600 mb-4">
                              Code : <span className="font-mono font-semibold">{userData.prefectureCode}</span>
                            </p>
                          )}
                          <div className="mt-4 pt-4 border-t border-purple-300 space-y-2">
                            <p className="text-base text-gray-700 font-medium">
                              <strong>Région :</strong> {userRegion?.name || userData.region || userData.regionOrigine || 'Non défini'}
                            </p>
                            <p className="text-base text-gray-700 font-medium">
                              <strong>Pays :</strong> {userCountry?.name || userData.pays || 'Non défini'} {getCountryFlag(userData.paysCode, userCountry?.name)}
                            </p>
                            <p className="text-base text-gray-700 font-medium">
                              <strong>Continent :</strong> {userContinent?.name || userData.continent || 'Non défini'} {getContinentIcon(userData.continentCode, userContinent?.name)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6">
                        <button
                          onClick={() => {
                            alert('Accès à l\'espace communautaire de votre préfecture');
                          }}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition-colors font-medium"
                        >
                          ✅ Accéder à l'espace Préfecture
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Code complet - affiché sur toutes les sous-pages */}
                  <div className="mt-6 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📍 Code géographique complet
                    </label>
                    <div className="text-2xl font-mono font-bold text-blue-600">
                      {userData.continentCode || ''}{userData.paysCode || ''}{userData.regionCode || ''}{userData.prefectureCode || ''}{userData.sousPrefectureCode || ''}{userData.quartierCode || ''}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Ce code fait partie de votre NumeroH : <strong>{userData.numeroH}</strong>
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
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-3xl">🗺️</span>
                <span>Ma Région : {userRegion?.name || userData?.region || userData?.regionOrigine || 'Région'}</span>
              </h2>
              <p className="text-gray-600 mb-6">
                Votre région enregistrée lors de l'inscription
              </p>
              
              {userData?.regionCode ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-sm text-blue-800 mb-4">
                      <strong>ℹ️ Information :</strong> Ces informations ont été enregistrées lors de votre inscription.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🗺️</div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">
                        {userRegion?.name || userData.region || userData.regionOrigine || 'Non défini'}
                      </h3>
                      {userData.regionCode && (
                        <p className="text-lg text-gray-600 mb-4">
                          Code : <span className="font-mono font-semibold">{userData.regionCode}</span>
                        </p>
                      )}
                      <div className="mt-4 pt-4 border-t border-green-300">
                        <p className="text-base text-gray-700 font-medium">
                          <strong>Pays :</strong> {userCountry?.name || userData.pays || 'Non défini'} {getCountryFlag(userData.paysCode, userCountry?.name)}
                        </p>
                        <p className="text-base text-gray-700 font-medium">
                          <strong>Continent :</strong> {userContinent?.name || userData.continent || 'Non défini'} {getContinentIcon(userData.continentCode, userContinent?.name)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => {
                        alert('Accès à l\'espace communautaire de votre région');
                        // Ici, vous pouvez naviguer vers l'espace de la région
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors font-medium"
                    >
                      ✅ Accéder à l'espace Région
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="text-yellow-800">
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
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-4xl">{getCountryFlag(userData?.paysCode, userCountry?.name)}</span>
                <span>Mon Pays : {userCountry?.name || userData?.pays || 'Pays'}</span>
              </h2>
              <p className="text-gray-600 mb-6">
                Votre pays enregistré lors de l'inscription
              </p>
              
              {userData?.paysCode ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-sm text-blue-800 mb-4">
                      <strong>ℹ️ Information :</strong> Ces informations ont été enregistrées lors de votre inscription.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6">
                    <div className="text-center">
                      <div className="text-6xl mb-4">{getCountryFlag(userData.paysCode, userCountry?.name)}</div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">
                        {userCountry?.name || userData.pays || 'Non défini'}
                      </h3>
                      {userData.paysCode && (
                        <p className="text-lg text-gray-600 mb-4">
                          Code : <span className="font-mono font-semibold">{userData.paysCode}</span>
                        </p>
                      )}
                      <div className="mt-4 pt-4 border-t border-purple-300">
                        <p className="text-sm text-gray-600">
                          <strong>Continent :</strong> {userContinent?.name || userData.continent || 'Non défini'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => {
                        alert('Accès à l\'espace communautaire de votre pays');
                        // Ici, vous pouvez naviguer vers l'espace du pays
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition-colors font-medium"
                    >
                      ✅ Accéder à l'espace Pays
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="text-yellow-800">
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
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-3xl">{getContinentIcon(userData?.continentCode, userContinent?.name)}</span>
                <span>Mon Continent : {userContinent?.name || userData?.continent || 'Continent'}</span>
              </h2>
              <p className="text-gray-600 mb-6">
                Votre continent enregistré lors de l'inscription
              </p>
              
              {userData?.continentCode ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-sm text-blue-800 mb-4">
                      <strong>ℹ️ Information :</strong> Ces informations ont été enregistrées lors de votre inscription.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-lg p-6">
                    <div className="text-center">
                      <div className="text-6xl mb-4">{getContinentIcon(userData.continentCode, userContinent?.name)}</div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">
                        {userContinent?.name || userData.continent || 'Non défini'}
                      </h3>
                      {userData.continentCode && (
                        <p className="text-lg text-gray-600 mb-4">
                          Code : <span className="font-mono font-semibold">{userData.continentCode}</span>
                        </p>
                      )}
                      <div className="mt-4 pt-4 border-t border-orange-300">
                        <p className="text-sm text-gray-600">
                          <strong>Pays :</strong> {userCountry?.name || userData.pays || 'Non défini'} {getCountryFlag(userData.paysCode, userCountry?.name)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => {
                        alert('Accès à l\'espace communautaire de votre continent');
                        // Ici, vous pouvez naviguer vers l'espace du continent
                      }}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg transition-colors font-medium"
                    >
                      ✅ Accéder à l'espace Continent
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="text-yellow-800">
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
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">🌎 Mondial</h2>
              <p className="text-gray-600 mb-6">
                Accédez à l'espace communautaire mondial - Tous les membres de la Terre ADAM
              </p>
              
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🌎</div>
                <p className="text-lg text-gray-700 mb-6">
                  Bienvenue dans l'espace mondial de la Terre ADAM
                </p>
                <button
                  onClick={() => {
                    alert('Accès à l\'espace mondial');
                    // Ici, vous pouvez naviguer vers l'espace mondial
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-8 rounded-lg transition-colors font-medium text-lg"
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

