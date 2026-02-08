import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config/api';

const API_ORIGIN = (config.API_BASE_URL || '').replace(/\/api\/?$/, '') || '';

interface PreviewProduct {
  id: string;
  title: string;
  price: number;
  currency: string;
  imageUrl?: string;
}

interface EchangesProfessionnelProps {
  userData: any;
}

const APERÇU_PRIMAIRE: PreviewProduct[] = [
  { id: '1', title: 'Riz Local Premium', price: 15000, currency: 'FG' },
  { id: '2', title: 'Huile de Palme Artisanale', price: 8000, currency: 'FG' },
];

const APERÇU_SECONDAIRE: PreviewProduct[] = [
  { id: '1', title: 'Téléphone Portable Samsung', price: 450000, currency: 'FG' },
  { id: '2', title: 'Machine à Coudre Industrielle', price: 1200000, currency: 'FG' },
];

function buildImageUrl(path: string | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  return `${API_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
}

function ApercuImage({ src, alt, placeholder }: { src?: string; alt: string; placeholder: string }) {
  const [failed, setFailed] = useState(false);
  const showImg = src && !failed;
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden bg-inherit">
      {showImg ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <span className="text-2xl" aria-hidden>{placeholder}</span>
      )}
    </div>
  );
}

export function EchangesProfessionnel({ userData }: EchangesProfessionnelProps) {
  const navigate = useNavigate();
  const [previewPrimaire, setPreviewPrimaire] = useState<PreviewProduct[]>(APERÇU_PRIMAIRE);
  const [previewSecondaire, setPreviewSecondaire] = useState<PreviewProduct[]>(APERÇU_SECONDAIRE);
  const [loadingPreview, setLoadingPreview] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const loadPreviews = async () => {
      try {
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const [resP, resS] = await Promise.all([
          fetch(`${config.API_BASE_URL}/exchange/primaire/products`, { headers }),
          fetch(`${config.API_BASE_URL}/exchange/secondaire/products`, { headers }),
        ]);

        if (resP.ok) {
          const data = await resP.json();
          const list = (data.products || []).slice(0, 2).map((p: any) => ({
            id: p.id,
            title: p.title,
            price: Number(p.price),
            currency: p.currency || 'FG',
            imageUrl: buildImageUrl(p.images?.[0]),
          }));
          if (list.length) setPreviewPrimaire(list);
        }
        if (resS.ok) {
          const data = await resS.json();
          const list = (data.products || []).slice(0, 2).map((p: any) => ({
            id: p.id,
            title: p.title,
            price: Number(p.price),
            currency: p.currency || 'FG',
            imageUrl: buildImageUrl(p.images?.[0]),
          }));
          if (list.length) setPreviewSecondaire(list);
        }
      } catch {
        // Garder les aperçus par défaut
      } finally {
        setLoadingPreview(false);
      }
    };
    loadPreviews();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <button
        onClick={() => navigate('/activite')}
        className="mb-4 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm"
      >
        ← Retour
      </button>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Échanges</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Choisissez une catégorie et voyez un aperçu des produits avant d’entrer
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Carte Primaire avec aperçu */}
        <div className="rounded-xl border-2 border-green-200 bg-gradient-to-b from-green-50 to-white dark:from-green-900/20 dark:to-gray-900 overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          <button
            onClick={() => navigate('/echange/primaire')}
            className="w-full bg-green-600 hover:bg-green-700 rounded-t-lg shadow-sm p-4 transition-all cursor-pointer text-white flex flex-col items-center justify-center gap-2"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 01.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            <span className="font-semibold">Primaire</span>
            <span className="text-xs opacity-90">Aliments, matières premières, textile</span>
          </button>
          <div className="p-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Aperçu des produits</p>
            {loadingPreview ? (
              <p className="text-sm text-gray-400">Chargement…</p>
            ) : (
              <div className="space-y-3">
                {previewPrimaire.map((p) => (
                  <div key={p.id} className="flex gap-3 rounded-lg overflow-hidden bg-white dark:bg-gray-800/50 border border-green-100 dark:border-green-800/50">
                    <div className="w-24 h-24 flex-shrink-0 bg-green-100 dark:bg-green-900/30 rounded-l-lg overflow-hidden">
                      <ApercuImage src={p.imageUrl} alt={p.title} placeholder="🛒" />
                    </div>
                    <div className="flex-1 min-w-0 py-2 pr-2 flex flex-col justify-center">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{p.title}</p>
                      <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {p.price.toLocaleString()} {p.currency}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => navigate('/echange/primaire')}
              className="mt-3 w-full py-2 text-sm font-medium text-green-600 hover:text-green-700 border border-green-300 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
            >
              Voir tout →
            </button>
          </div>
        </div>

        {/* Carte Secondaire avec aperçu */}
        <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          <button
            onClick={() => navigate('/echange/secondaire')}
            className="w-full bg-blue-600 hover:bg-blue-700 rounded-t-lg shadow-sm p-4 transition-all cursor-pointer text-white flex flex-col items-center justify-center gap-2"
          >
            <span className="text-3xl">🛍️</span>
            <span className="font-semibold">Secondaire</span>
            <span className="text-xs opacity-90">Électronique, machinerie, équipements</span>
          </button>
          <div className="p-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Aperçu des produits</p>
            {loadingPreview ? (
              <p className="text-sm text-gray-400">Chargement…</p>
            ) : (
              <div className="space-y-3">
                {previewSecondaire.map((p) => (
                  <div key={p.id} className="flex gap-3 rounded-lg overflow-hidden bg-white dark:bg-gray-800/50 border border-blue-100 dark:border-blue-800/50">
                    <div className="w-24 h-24 flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-l-lg overflow-hidden">
                      <ApercuImage src={p.imageUrl} alt={p.title} placeholder="🛍️" />
                    </div>
                    <div className="flex-1 min-w-0 py-2 pr-2 flex flex-col justify-center">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{p.title}</p>
                      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {p.price.toLocaleString()} {p.currency}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => navigate('/echange/secondaire')}
              className="mt-3 w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              Voir tout →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
