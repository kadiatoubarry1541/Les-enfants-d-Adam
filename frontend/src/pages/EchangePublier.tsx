import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { config } from '../config/api';
import { VideoRecorder } from '../components/VideoRecorder';
import { AudioRecorder } from '../components/AudioRecorder';
import { PublierAnnonceButtons } from '../components/PublierAnnonceButtons';

type PublishMode = 'ecrit' | 'photo_audio' | 'video';
type Level = 'primaire' | 'secondaire' | 'tertiaire';

interface UserData {
  numeroH: string;
  prenom: string;
  nomFamille: string;
  [key: string]: any;
}

const CATEGORIES_PRIMAIRE = ['Alimentation', 'Aliments', 'Textile', 'Agriculture', 'Artisanat', 'Matières Premières', 'Autre'];
const CATEGORIES_SECONDAIRE = ['Électronique', 'Machinerie', 'Équipements', 'Véhicules', 'Autre'];
const CATEGORIES_TERTIAIRE = ['Maison à louer', 'Matériaux de construction', 'Services', 'Autre'];

const VALID_MODES: PublishMode[] = ['ecrit', 'photo_audio', 'video'];

function getMediaDuration(file: File, type: 'audio' | 'video'): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const el = document.createElement(type);
    el.onloadedmetadata = () => {
      const dur = el.duration;
      URL.revokeObjectURL(url);
      resolve(dur);
    };
    el.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Impossible de lire le fichier'));
    };
    el.src = url;
  });
}

export default function EchangePublier() {
  const [searchParams] = useSearchParams();
  const modeFromUrl = searchParams.get('mode') as PublishMode | null;
  const [userData, setUserData] = useState<UserData | null>(null);
  const [publishMode, setPublishMode] = useState<PublishMode | null>(
    modeFromUrl && VALID_MODES.includes(modeFromUrl) ? modeFromUrl : null
  );
  const [level, setLevel] = useState<Level>('primaire');
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    category: '',
    price: 0,
    currency: 'FG' as string,
    condition: 'bon' as string,
    location: '',
    images: [] as File[],
    videos: [] as File[],
    photoForAudio: null as File | null,
    audio30s: null as File | null
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const categories = level === 'primaire' ? CATEGORIES_PRIMAIRE : level === 'secondaire' ? CATEGORIES_SECONDAIRE : CATEGORIES_TERTIAIRE;

  useEffect(() => {
    if (modeFromUrl && VALID_MODES.includes(modeFromUrl)) {
      setPublishMode(modeFromUrl);
    }
  }, [modeFromUrl]);

  useEffect(() => {
    const session = localStorage.getItem('session_user');
    if (!session) {
      navigate('/login');
      return;
    }
    try {
      const parsed = JSON.parse(session);
      const user = parsed.userData || parsed;
      if (!user?.numeroH) {
        navigate('/login');
        return;
      }
      setUserData(user);
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  const createProduct = async () => {
    const hasVideo = newProduct.videos.length > 0;
    const hasPhoto = newProduct.images.length > 0 || !!newProduct.photoForAudio;
    const hasAudio = !!newProduct.audio30s;
    const hasText = !!newProduct.title.trim();

    if (publishMode === 'ecrit') {
      if (!newProduct.title.trim() || !newProduct.category || !newProduct.price || !newProduct.location.trim()) {
        alert('Remplissez le titre, la catégorie, le prix et la localisation.');
        return;
      }
      if (!hasPhoto) {
        alert('Ajoutez au moins une photo.');
        return;
      }
    } else if (publishMode === 'photo_audio') {
      if (!newProduct.photoForAudio || !newProduct.audio30s) {
        alert('Ajoutez une photo et enregistrez un message vocal (max 1 min).');
        return;
      }
    } else if (publishMode === 'video') {
      if (!hasVideo) {
        alert('Enregistrez une vidéo de présentation (max 1 min).');
        return;
      }
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      const title = publishMode === 'ecrit' ? newProduct.title : (publishMode === 'photo_audio' ? 'Annonce photo + audio' : 'Annonce vidéo');
      const category = publishMode === 'ecrit' ? newProduct.category : 'Autre';
      const price = publishMode === 'ecrit' ? newProduct.price : 0;
      const location = publishMode === 'ecrit' ? newProduct.location : 'Non spécifié';
      formData.append('title', title);
      formData.append('description', newProduct.description.trim() || 'Produit présenté');
      formData.append('category', category);
      formData.append('price', price.toString());
      formData.append('currency', newProduct.currency);
      formData.append('condition', newProduct.condition);
      formData.append('location', location);

      newProduct.images.forEach((img, i) => formData.append(`image_${i}`, img));
      if (newProduct.photoForAudio) formData.append(`image_${newProduct.images.length}`, newProduct.photoForAudio);
      newProduct.videos.forEach((vid, i) => formData.append(`video_${i}`, vid));
      if (newProduct.audio30s) formData.append('audio_0', newProduct.audio30s);

      const token = localStorage.getItem('token');
      const endpoint = `${config.API_BASE_URL}/exchange/${level}/products`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        alert('Produit publié avec succès !');
        navigate('/echange');
      } else {
        alert('Erreur lors de la publication.');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la publication.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setPublishMode(null);
    setNewProduct({
      title: '',
      description: '',
      category: '',
      price: 0,
      currency: 'FG',
      condition: 'bon',
      location: '',
      images: [],
      videos: [],
      photoForAudio: null,
      audio30s: null
    });
  };

  if (!userData) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <button
        onClick={() => { resetForm(); navigate('/echange'); }}
        className="mb-4 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm"
      >
        ← Retour aux Échanges
      </button>

      {/* Choix du mode de publication */}
      {!publishMode && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Publier un produit</h2>
          <p className="text-sm text-gray-500 mb-6">Choisissez la façon de publier votre produit</p>
          <PublierAnnonceButtons onSelect={(mode) => setPublishMode(mode)} title="Publier une annonce" />
        </div>
      )}

      {/* Formulaire selon le mode */}
      {publishMode && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">←</button>
              <h2 className="text-xl font-bold text-gray-900">
                {publishMode === 'ecrit' && 'Publier par écrit (champs + photo)'}
                {publishMode === 'photo_audio' && 'Publier par photo + audio'}
                {publishMode === 'video' && 'Publier par vidéo'}
              </h2>
            </div>
          </div>

          <div className="space-y-6">
            {/* Champs à remplir uniquement pour le mode écrit */}
            {publishMode === 'ecrit' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Niveau</label>
                  <select
                    value={level}
                    onChange={(e) => { setLevel(e.target.value as Level); setNewProduct(p => ({ ...p, category: '' })); }}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                  >
                    <option value="primaire">Primaire</option>
                    <option value="secondaire">Secondaire</option>
                    <option value="tertiaire">Tertiaire</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Titre</label>
                  <input
                    type="text"
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                    placeholder="Ex: Riz Local Premium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Catégorie</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Prix</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newProduct.price || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl"
                      placeholder="15000"
                    />
                    <select
                      value={newProduct.currency}
                      onChange={(e) => setNewProduct({ ...newProduct, currency: e.target.value })}
                      className="px-4 py-3 border-2 border-gray-300 rounded-xl"
                    >
                      <option value="FG">FG</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Localisation</label>
                  <input
                    type="text"
                    value={newProduct.location}
                    onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                    placeholder="Ex: Ville Principale"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">État</label>
                  <select
                    value={newProduct.condition}
                    onChange={(e) => setNewProduct({ ...newProduct, condition: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                  >
                    <option value="neuf">Neuf</option>
                    <option value="bon">Bon état</option>
                    <option value="moyen">État moyen</option>
                    <option value="usé">Usé</option>
                  </select>
                </div>
              </>
            )}

            {/* Mode 1: Écrit + photo */}
            {publishMode === 'ecrit' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">📷 Photos</label>
                  <input type="file" id="img-capture" accept="image/*" capture="environment" multiple className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
                      setNewProduct(p => ({ ...p, images: [...p.images, ...files] }));
                    }}
                  />
                  <input type="file" id="img-gallery" accept="image/*" multiple className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
                      setNewProduct(p => ({ ...p, images: [...p.images, ...files] }));
                    }}
                  />
                  <div className="flex gap-3">
                    <label htmlFor="img-capture" className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 cursor-pointer text-center font-medium">
                      📷 Prendre une photo
                    </label>
                    <label htmlFor="img-gallery" className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer text-center font-medium">
                      🖼️ Choisir depuis galerie
                    </label>
                  </div>
                  {newProduct.images.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {newProduct.images.map((img, i) => (
                        <div key={i} className="relative">
                          <img src={URL.createObjectURL(img)} alt="" className="w-20 h-20 object-cover rounded-lg" />
                          <button onClick={() => setNewProduct(p => ({ ...p, images: p.images.filter((_, j) => j !== i) }))}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl" rows={4} placeholder="Décrivez votre produit..." />
                </div>
              </>
            )}

            {/* Mode 2: Photo + message vocal (max 1 min) — même contenu que le bouton */}
            {publishMode === 'photo_audio' && (
              <div className="rounded-xl border-2 border-amber-200 bg-amber-50/50 p-4 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">📷 Photo</label>
                  <input type="file" id="photo-audio-capture" accept="image/*" capture="environment" className="hidden"
                    onChange={(e) => setNewProduct(p => ({ ...p, photoForAudio: e.target.files?.[0] || null }))}
                  />
                  <input type="file" id="photo-audio-gallery" accept="image/*" className="hidden"
                    onChange={(e) => setNewProduct(p => ({ ...p, photoForAudio: e.target.files?.[0] || null }))}
                  />
                  <div className="flex gap-3">
                    <label htmlFor="photo-audio-capture" className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 cursor-pointer text-center font-medium">
                      📷 Prendre une photo
                    </label>
                    <label htmlFor="photo-audio-gallery" className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer text-center font-medium">
                      🖼️ Choisir depuis galerie
                    </label>
                  </div>
                  {newProduct.photoForAudio && <p className="mt-2 text-sm text-green-600 font-medium">✓ Photo sélectionnée</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message vocal (max 1 min)</label>
                  <input type="file" id="audio-choose" accept="audio/*" className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const dur = await getMediaDuration(file, 'audio');
                        if (dur > 60) { alert('L\'audio ne doit pas dépasser 1 minute.'); return; }
                        setNewProduct(p => ({ ...p, audio30s: file }));
                      } catch { alert('Impossible de lire le fichier audio.'); }
                      e.target.value = '';
                    }}
                  />
                  <div className="flex gap-3 mb-3">
                    <label htmlFor="audio-choose" className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer text-center font-medium">
                      🎵 Choisir depuis l'appareil
                    </label>
                  </div>
                  <AudioRecorder maxDuration={60} onAudioRecorded={(blob) => {
                    const file = new File([blob], `audio-${Date.now()}.webm`, { type: blob.type || 'audio/webm' });
                    setNewProduct(p => ({ ...p, audio30s: file }));
                  }} />
                  {newProduct.audio30s && <p className="mt-2 text-sm text-green-600 font-medium">✓ Audio prêt</p>}
                </div>
              </div>
            )}

            {/* Mode 3: Vidéo — Enregistrer ou Choisir, max 1 min */}
            {publishMode === 'video' && (
              <div className="rounded-xl border-2 border-blue-200 bg-blue-50/50 p-4 space-y-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">🎥 Vidéo (max 1 min)</label>
                <input type="file" id="video-choose" accept="video/*" className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const dur = await getMediaDuration(file, 'video');
                      if (dur > 60) { alert('La vidéo ne doit pas dépasser 1 minute.'); return; }
                      setNewProduct(p => ({ ...p, videos: [file, ...p.videos] }));
                    } catch { alert('Impossible de lire le fichier vidéo.'); }
                    e.target.value = '';
                  }}
                />
                <div className="flex gap-3">
                  <label htmlFor="video-choose" className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer text-center font-medium">
                    🖼️ Choisir depuis l'appareil
                  </label>
                </div>
                <VideoRecorder maxDuration={60} onVideoRecorded={(blob) => {
                  const file = new File([blob], `video-${Date.now()}.webm`, { type: blob.type || 'video/webm' });
                  setNewProduct(p => ({ ...p, videos: [file, ...p.videos] }));
                }} />
                {newProduct.videos.length > 0 && <p className="mt-2 text-sm text-green-600 font-medium">✓ Vidéo prête</p>}
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-8">
            <button onClick={createProduct} disabled={submitting}
              className="px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold disabled:opacity-50">
              {submitting ? 'Publication...' : '✅ Publier le produit'}
            </button>
            <button onClick={resetForm} className="px-8 py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 font-semibold">
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
