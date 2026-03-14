/** Boutons "Publier une annonce" : style unifié pour toutes les pages Échange */
type PublishMode = 'ecrit' | 'photo_audio' | 'video';

interface PublierAnnonceButtonsProps {
  onSelect: (mode: PublishMode) => void;
  /** Titre au-dessus des boutons (optionnel) */
  title?: string;
  /** Classes additionnelles pour le conteneur */
  className?: string;
}

const BTN_CLASS = 'px-4 py-4 rounded-xl border-2 font-semibold transition-colors flex flex-col items-center gap-1';

export function PublierAnnonceButtons({ onSelect, title = 'Publier une annonce', className = '' }: PublierAnnonceButtonsProps) {
  return (
    <div className={className}>
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={() => onSelect('ecrit')}
          className={`${BTN_CLASS} border-green-500 text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20`}
        >
          <span className="text-2xl">💬</span>
          <span>1. Par écrit</span>
          <span className="text-xs font-normal text-gray-600 dark:text-gray-400">Champs + photo</span>
        </button>
        <button
          onClick={() => onSelect('photo_audio')}
          className={`${BTN_CLASS} border-amber-500 text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20`}
        >
          <span className="text-2xl">📷🎙️</span>
          <span>2. Photo + Audio</span>
          <span className="text-xs font-normal text-gray-600 dark:text-gray-400">Photo + message vocal (max 1 min)</span>
        </button>
        <button
          onClick={() => onSelect('video')}
          className={`${BTN_CLASS} border-blue-500 text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20`}
        >
          <span className="text-2xl">🎥</span>
          <span>3. Par vidéo</span>
          <span className="text-xs font-normal text-gray-600 dark:text-gray-400">Vidéo (max 1 min)</span>
        </button>
      </div>
    </div>
  );
}
