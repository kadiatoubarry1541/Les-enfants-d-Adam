import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  numeroH: string;
  prenom: string;
  nomFamille: string;
  [key: string]: any;
}

interface SacredBook {
  id: string;
  title: string;
  description: string;
  author?: string;
  language: string;
  category: string;
  coverUrl?: string;
  pages: number;
  publicationDate: string;
  publisher?: string;
  content: BookChapter[];
  downloadUrl?: string;
  createdAt: string;
}

interface BookChapter {
  id: string;
  title: string;
  verse?: string;
  content: string;
  pageNumber: number;
}

export default function LivresDeDieu() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [books, setBooks] = useState<SacredBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<SacredBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<BookChapter | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Tous');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      
      setUserData(user);
      loadBooks();
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const loadBooks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/foi/livres', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBooks(data.books || []);
      } else {
        setBooks(getDefaultBooks());
      }
    } catch (error) {
      console.error('Erreur:', error);
      setBooks(getDefaultBooks());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultBooks = (): SacredBook[] => [
    {
      id: '1',
      title: 'Le Saint Coran',
      description: 'Le livre saint de l\'islam',
      language: 'Arabe',
      category: 'Islam',
      pages: 600,
      publicationDate: '7ème siècle',
      publisher: 'Paroles révélées',
      content: [],
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '2',
      title: 'La Bible',
      description: 'Ancien et Nouveau Testament',
      language: 'Français',
      category: 'Christianisme',
      pages: 1200,
      publicationDate: 'Collection de textes anciens',
      publisher: 'Écritures saintes',
      content: [],
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '3',
      title: 'La Torah',
      description: 'Cinq livres de Moïse',
      language: 'Hébreu',
      category: 'Judaïsme',
      pages: 300,
      publicationDate: 'Textes anciens',
      publisher: 'Écritures sacrées',
      content: [],
      createdAt: '2024-01-01T10:00:00Z'
    }
  ];

  const categories = ['Tous', ...Array.from(new Set(books.map(b => b.category)))];

  const filteredBooks = activeCategory === 'Tous' 
    ? books 
    : books.filter(b => b.category === activeCategory);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Chargement des livres...</div>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/dokal')}
        className="mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
      >
        ← Retour à Foi
      </button>

      <div className="bg-white rounded-xl shadow-sm border-l-4 border-l-yellow-500 border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="text-4xl">📿</div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Les Livres de Dieu Unique</h1>
            <p className="text-gray-600">Livres sacrés des différentes religions</p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">{books.length}</div>
            <div className="text-sm text-yellow-800">Livres disponibles</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{categories.length - 1}</div>
            <div className="text-sm text-blue-800">Catégories</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {books.reduce((total, book) => total + book.pages, 0)}
            </div>
            <div className="text-sm text-green-800">Pages totales</div>
          </div>
        </div>

        {/* Filtres par catégorie */}
        <div className="mb-6">
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  activeCategory === category
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Liste des livres */}
        {!selectedBook ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div key={book.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 border border-gray-200">
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt={book.title} className="w-full h-64 object-cover rounded-lg mb-4" />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-6xl">📿</span>
                  </div>
                )}
                <div className="mb-2">
                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    {book.category}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{book.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{book.description}</p>
                <div className="text-sm text-gray-500 mb-4 space-y-1">
                  <p>📄 {book.pages} pages</p>
                  <p>🌍 {book.language}</p>
                  {book.author && <p>✍️ Par {book.author}</p>}
                </div>
                <button
                  onClick={() => setSelectedBook(book)}
                  className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200"
                >
                  📖 Lire le livre
                </button>
              </div>
            ))}
            {filteredBooks.length === 0 && (
              <div className="text-center text-gray-500 py-12 col-span-full">
                <div className="text-6xl mb-4">📿</div>
                <p>Aucun livre disponible pour cette catégorie.</p>
              </div>
            )}
          </div>
        ) : (
          /* Interface de lecture */
          <div className="space-y-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <button
                  onClick={() => {
                    setSelectedBook(null);
                    setSelectedChapter(null);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 mb-2"
                >
                  ← Retour
                </button>
                <h2 className="text-2xl font-bold text-gray-900">{selectedBook.title}</h2>
                <p className="text-gray-600 mt-1">{selectedBook.description}</p>
              </div>
              {selectedBook.downloadUrl && (
                <button
                  onClick={() => window.open(selectedBook.downloadUrl, '_blank')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  📥 Télécharger
                </button>
              )}
            </div>

            {/* Informations du livre */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">ℹ️ Informations</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <strong className="text-gray-700">Catégorie:</strong>
                  <p className="text-gray-600">{selectedBook.category}</p>
                </div>
                <div>
                  <strong className="text-gray-700">Langue:</strong>
                  <p className="text-gray-600">{selectedBook.language}</p>
                </div>
                <div>
                  <strong className="text-gray-700">Pages:</strong>
                  <p className="text-gray-600">{selectedBook.pages}</p>
                </div>
                <div>
                  <strong className="text-gray-700">Publication:</strong>
                  <p className="text-gray-600">{selectedBook.publicationDate}</p>
                </div>
              </div>
            </div>

            {/* Chapitres */}
            {selectedBook.content.length > 0 ? (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">📑 Chapitres</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedBook.content.map((chapter) => (
                    <button
                      key={chapter.id}
                      onClick={() => setSelectedChapter(chapter)}
                      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 border border-gray-200 text-left"
                    >
                      <h4 className="font-semibold text-gray-900 mb-2">{chapter.title}</h4>
                      {chapter.verse && (
                        <p className="text-sm text-gray-600 mb-2">Verset {chapter.verse}</p>
                      )}
                      <p className="text-xs text-gray-500">Page {chapter.pageNumber}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <p className="text-blue-800">Contenu complet disponible bientôt</p>
                <p className="text-sm text-blue-600 mt-2">Le livre est en cours de numérisation</p>
              </div>
            )}

            {/* Lecture du chapitre */}
            {selectedChapter && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{selectedChapter.title}</h3>
                  <button
                    onClick={() => setSelectedChapter(null)}
                    className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
                  >
                    ✕
                  </button>
                </div>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{selectedChapter.content}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

