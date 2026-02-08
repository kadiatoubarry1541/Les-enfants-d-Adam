import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  numeroH: string;
  prenom: string;
  nomFamille: string;
  [key: string]: any;
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: 'audio' | 'video' | 'ecrit' | 'livre';
  content: CourseContent[];
  progress: number;
  completed: boolean;
  createdAt: string;
}

interface CourseContent {
  id: string;
  title: string;
  type: 'audio' | 'video' | 'text' | 'pdf';
  url: string;
  duration?: string;
  description: string;
  completed: boolean;
}

interface Certificate {
  id: string;
  title: string;
  description: string;
  receivedDate: string;
  badgeId: string;
  issuedBy: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl?: string;
  category: string;
  isbn?: string;
  pages: number;
  createdAt: string;
}

interface CoursePermission {
  id: string;
  numeroH: string;
  courseType: string;
  isActive: boolean;
  expiresAt?: string;
}

export default function MesCours() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<'cours' | 'audio' | 'video' | 'ecrit' | 'bibliotheque' | 'publier' | 'progres' | 'certificats'>('cours');
  const [courses, setCourses] = useState<Course[]>([]);
  const [audioCourses, setAudioCourses] = useState<Course[]>([]);
  const [videoCourses, setVideoCourses] = useState<Course[]>([]);
  const [ecritCourses, setEcritCourses] = useState<Course[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [coursePermissions, setCoursePermissions] = useState<CoursePermission[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPermissionForm, setShowPermissionForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    type: 'audio' as 'audio' | 'video' | 'written' | 'library' | 'exercise',
    duration: '',
    level: 'débutant',
    category: '',
    mediaFile: null as File | null
  });
  const [newPermission, setNewPermission] = useState({
    numeroH: '',
    courseType: 'audio' as 'audio' | 'video' | 'written' | 'library' | 'exercise',
    expiresAt: '',
    notes: ''
  });
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
      checkAdminStatus(user);
      loadData();
      loadPermissions();
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const checkAdminStatus = (user: UserData) => {
    const isAdminUser = user.role === 'admin' || user.role === 'super-admin' || user.numeroH === 'G0C0P0R0E0F0 0';
    setIsAdmin(isAdminUser);
  };

  const loadPermissions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/education/my-course-permissions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCoursePermissions(data.permissions || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des permissions:', error);
    }
  };

  const canCreateCourse = (courseType: string): boolean => {
    if (isAdmin) return true;
    return coursePermissions.some(p => p.courseType === courseType && p.isActive);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadCourses(),
        loadAudioCourses(),
        loadVideoCourses(),
        loadEcritCourses(),
        loadBooks(),
        loadCertificates()
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/education/my-courses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      } else {
        setCourses(getDefaultCourses());
      }
    } catch (error) {
      console.error('Erreur:', error);
      setCourses(getDefaultCourses());
    }
  };

  const loadAudioCourses = async () => {
    setAudioCourses(courses.filter(c => c.category === 'audio'));
  };

  const loadVideoCourses = async () => {
    setVideoCourses(courses.filter(c => c.category === 'video'));
  };

  const loadEcritCourses = async () => {
    setEcritCourses(courses.filter(c => c.category === 'ecrit'));
  };

  const loadBooks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/education/library', {
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
    }
  };

  const loadCertificates = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/badges/user/${userData?.numeroH}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCertificates(data.certificates || []);
      } else {
        setCertificates([]);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setCertificates([]);
    }
  };

  const getDefaultCourses = (): Course[] => [
    {
      id: '1',
      title: 'Introduction à la programmation',
      description: 'Cours complet pour débuter en programmation',
      category: 'video',
      content: [],
      progress: 45,
      completed: false,
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Grammaire française',
      description: 'Améliorer votre grammaire française',
      category: 'audio',
      content: [],
      progress: 60,
      completed: false,
      createdAt: '2024-01-10T10:00:00Z'
    },
    {
      id: '3',
      title: 'Histoire de la Guinée',
      description: 'Découvrez l\'histoire de votre pays',
      category: 'ecrit',
      content: [],
      progress: 30,
      completed: false,
      createdAt: '2024-01-20T10:00:00Z'
    }
  ];

  const getDefaultBooks = (): Book[] => [
    {
      id: '1',
      title: 'Les fondateurs de la Guinée',
      author: 'Alpha Diallo',
      description: 'Biographie des grands hommes de la Guinée',
      category: 'Histoire',
      pages: 250,
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Cuisine guinéenne traditionnelle',
      author: 'Mariama Camara',
      description: 'Recettes et traditions culinaires',
      category: 'Cuisine',
      pages: 180,
      createdAt: '2024-01-10T10:00:00Z'
    }
  ];

  const updateProgress = (courseId: string, contentId: string) => {
    // Mettre à jour le progrès du cours
    const updatedCourses = courses.map(course => {
      if (course.id === courseId) {
        const updatedContent = course.content.map(content => {
          if (content.id === contentId) {
            return { ...content, completed: true };
          }
          return content;
        });
        const completedCount = updatedContent.filter(c => c.completed).length;
        const newProgress = (completedCount / updatedContent.length) * 100;
        return {
          ...course,
          content: updatedContent,
          progress: newProgress,
          completed: newProgress === 100
        };
      }
      return course;
    });
    setCourses(updatedCourses);
    loadAudioCourses();
    loadVideoCourses();
    loadEcritCourses();
  };

  const createCourse = async () => {
    try {
      const formData = new FormData();
      formData.append('title', newCourse.title);
      formData.append('description', newCourse.description);
      formData.append('type', newCourse.type);
      formData.append('duration', newCourse.duration);
      formData.append('level', newCourse.level);
      formData.append('category', newCourse.category);
      
      if (newCourse.mediaFile) {
        formData.append('media', newCourse.mediaFile);
      }
      
      const token = localStorage.getItem("token");
      const response = await fetch('/api/education/courses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (response.ok) {
        alert('Cours créé avec succès !');
        setShowCreateForm(false);
        setNewCourse({
          title: '',
          description: '',
          type: 'audio',
          duration: '',
          level: 'débutant',
          category: '',
          mediaFile: null
        });
        loadData();
      } else {
        const data = await response.json();
        alert(data.message || 'Erreur lors de la création du cours');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création du cours');
    }
  };

  /** Publication de contenu par tout utilisateur connecté (onglet Publier) */
  const publishContent = async () => {
    if (!newCourse.title?.trim()) {
      alert('Veuillez saisir un titre.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', newCourse.title.trim());
      formData.append('description', newCourse.description || '');
      formData.append('type', newCourse.type === 'exercise' ? 'test' : newCourse.type);
      formData.append('duration', newCourse.duration || '');
      formData.append('level', newCourse.level || 'débutant');
      formData.append('category', newCourse.category || '');
      if (newCourse.mediaFile) {
        formData.append('media', newCourse.mediaFile);
      }
      const token = localStorage.getItem("token");
      const response = await fetch('/api/education/courses/publish', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (response.ok) {
        alert('Contenu publié avec succès !');
        setNewCourse({
          title: '',
          description: '',
          type: 'audio',
          duration: '',
          level: 'débutant',
          category: '',
          mediaFile: null
        });
        loadData();
      } else {
        const data = await response.json();
        alert(data.message || 'Erreur lors de la publication');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la publication du contenu');
    }
  };

  const grantPermission = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/education/course-permissions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          numeroH: newPermission.numeroH,
          courseType: newPermission.courseType,
          expiresAt: newPermission.expiresAt || null,
          notes: newPermission.notes
        })
      });
      
      if (response.ok) {
        alert('Permission accordée avec succès !');
        setShowPermissionForm(false);
        setNewPermission({
          numeroH: '',
          courseType: 'audio',
          expiresAt: '',
          notes: ''
        });
      } else {
        const data = await response.json();
        alert(data.message || 'Erreur lors de l\'octroi de permission');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'octroi de permission');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Chargement de vos cours...</div>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/education')}
        className="mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
      >
        ← Retour à Éducation
      </button>

      <div className="bg-white rounded-xl shadow-sm border-l-4 border-l-blue-500 border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="text-4xl">📚</div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes Cours</h1>
            <p className="text-gray-600">Continuez votre apprentissage</p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{courses.length}</div>
            <div className="text-sm text-blue-800">Cours disponibles</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {courses.filter(c => c.completed).length}
            </div>
            <div className="text-sm text-green-800">Cours complétés</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">{books.length}</div>
            <div className="text-sm text-purple-800">Livres en bibliothèque</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">{certificates.length}</div>
            <div className="text-sm text-orange-800">Certificats obtenus</div>
          </div>
        </div>

        {/* Actions pour admin et professeurs autorisés */}
        {(isAdmin || coursePermissions.length > 0) && (
          <div className="mb-6 flex gap-4 flex-wrap">
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
            >
              ➕ Créer un cours
            </button>
            {isAdmin && (
              <button
                onClick={() => setShowPermissionForm(true)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
              >
                🔐 Accorder une permission
              </button>
            )}
          </div>
        )}

        {/* Navigation par onglets */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: 'cours', label: '📚 Tous mes cours', emoji: '📚' },
              { id: 'audio', label: '🎧 Audio', emoji: '🎧' },
              { id: 'video', label: '🎥 Vidéo', emoji: '🎥' },
              { id: 'ecrit', label: '📝 Écrit', emoji: '📝' },
              { id: 'bibliotheque', label: '📖 Bibliothèque', emoji: '📖' },
              ...(isAdmin || coursePermissions.length > 0 ? [{ id: 'publier', label: '➕ Publier', emoji: '➕' }] : []),
              { id: 'progres', label: '📊 Progrès', emoji: '📊' },
              { id: 'certificats', label: '🏅 Certificats', emoji: '🏅' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === 'audio') loadAudioCourses();
                  if (tab.id === 'video') loadVideoCourses();
                  if (tab.id === 'ecrit') loadEcritCourses();
                  if (tab.id === 'bibliotheque') loadBooks();
                  if (tab.id === 'certificats') loadCertificates();
                  if (tab.id === 'publier') setShowCreateForm(false);
                }}
                className={`px-4 py-2 rounded-t-lg font-medium transition-colors duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu selon l'onglet */}
        {activeTab === 'cours' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">
                    {course.category === 'audio' ? '🎧' : course.category === 'video' ? '🎥' : '📝'}
                  </span>
                  <h3 className="font-semibold text-gray-900">{course.title}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progression</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCourse(course)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  {course.completed ? '✅ Voir le cours' : '▶️ Continuer'}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audioCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 border border-gray-200">
                <div className="text-3xl mb-3">🎧</div>
                <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                </div>
                <button
                  onClick={() => setSelectedCourse(course)}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  ▶️ Écouter
                </button>
              </div>
            ))}
            {audioCourses.length === 0 && (
              <div className="text-center text-gray-500 py-12">
                <p>Aucun cours audio disponible.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'video' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 border border-gray-200">
                <div className="text-3xl mb-3">🎥</div>
                <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                </div>
                <button
                  onClick={() => setSelectedCourse(course)}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  ▶️ Regarder
                </button>
              </div>
            ))}
            {videoCourses.length === 0 && (
              <div className="text-center text-gray-500 py-12">
                <p>Aucun cours vidéo disponible.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'ecrit' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ecritCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 border border-gray-200">
                <div className="text-3xl mb-3">📝</div>
                <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                </div>
                <button
                  onClick={() => setSelectedCourse(course)}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  📖 Lire
                </button>
              </div>
            ))}
            {ecritCourses.length === 0 && (
              <div className="text-center text-gray-500 py-12">
                <p>Aucun cours écrit disponible.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bibliotheque' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <div key={book.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 border border-gray-200">
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt={book.title} className="w-full h-48 object-cover rounded-lg mb-3" />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-6xl">📚</span>
                  </div>
                )}
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{book.title}</h3>
                <p className="text-gray-600 text-xs mb-2">Par {book.author}</p>
                <p className="text-gray-500 text-xs">{book.pages} pages • {book.category}</p>
                <button
                  onClick={() => window.open('/api/education/books/' + book.id + '/read', '_blank')}
                  className="w-full mt-3 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                >
                  📖 Lire
                </button>
              </div>
            ))}
            {books.length === 0 && (
              <div className="text-center text-gray-500 py-12 col-span-full">
                <p>Aucun livre disponible dans la bibliothèque.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'publier' && (
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            {!(isAdmin || coursePermissions.length > 0) ? (
              <div className="text-center py-8 text-gray-600">
                <p className="text-lg font-medium mb-2">🔒 Accès réservé</p>
                <p>Seuls les professeurs et les administrateurs peuvent publier du contenu ici.</p>
              </div>
            ) : (
              <>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">➕ Publier un cours, une vidéo, un audio ou un exercice</h3>
            <p className="text-gray-600 mb-6">Remplissez le formulaire ci-dessous pour publier du contenu pédagogique (cours, vidéo, audio, écrit ou exercice).</p>
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Introduction à la programmation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Description du contenu..."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de contenu *</label>
                  <select
                    value={newCourse.type}
                    onChange={(e) => setNewCourse({...newCourse, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="audio">🎧 Audio</option>
                    <option value="video">🎥 Vidéo</option>
                    <option value="written">📝 Écrit</option>
                    <option value="library">📖 Bibliothèque</option>
                    <option value="exercise">✏️ Exercice</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Niveau</label>
                  <select
                    value={newCourse.level}
                    onChange={(e) => setNewCourse({...newCourse, level: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="débutant">Débutant</option>
                    <option value="intermédiaire">Intermédiaire</option>
                    <option value="avancé">Avancé</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Durée (minutes)</label>
                  <input
                    type="number"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                  <input
                    type="text"
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Mathématiques"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fichier média (optionnel)</label>
                <input
                  type="file"
                  accept={newCourse.type === 'audio' ? 'audio/*' : newCourse.type === 'video' ? 'video/*' : newCourse.type === 'written' ? '.pdf,.doc,.docx' : 'image/*'}
                  onChange={(e) => setNewCourse({...newCourse, mediaFile: e.target.files?.[0] || null})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={publishContent}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  📤 Publier le contenu
                </button>
                <button
                  type="button"
                  onClick={() => setNewCourse({
                    title: '',
                    description: '',
                    type: 'audio',
                    duration: '',
                    level: 'débutant',
                    category: '',
                    mediaFile: null
                  })}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Effacer
                </button>
              </div>
            </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'progres' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">📊 Votre Progression</h2>
              <p className="opacity-90">Continuez vos efforts !</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{course.title}</h3>
                    <span className="text-sm font-bold text-blue-600">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div className="bg-blue-600 h-3 rounded-full transition-all duration-300" style={{ width: `${course.progress}%` }}></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Leçon {Math.floor(course.progress / 10)} / 10</span>
                    <span>{course.completed ? '✅ Complété' : 'En cours'}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Suggestions de nouveaux cours */}
            {courses.filter(c => c.completed).length > 0 && (
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h3 className="text-xl font-semibold text-green-900 mb-4">🎯 Cours suggérés pour vous</h3>
                <p className="text-green-800 mb-4">Vous progressez bien ! Voici d'autres cours qui pourraient vous intéresser :</p>
                <div className="flex gap-4">
                  <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                    📚 Explorer les cours
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'certificats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div key={cert.id} className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg shadow-md p-6 border-2 border-yellow-400">
                <div className="text-6xl mb-4 text-center">🏅</div>
                <h3 className="font-semibold text-gray-900 mb-2 text-center">{cert.title}</h3>
                <p className="text-gray-700 text-sm mb-4 text-center">{cert.description}</p>
                <div className="text-center text-sm text-gray-600">
                  <p>Obtenu le {new Date(cert.receivedDate).toLocaleDateString('fr-FR')}</p>
                  <p className="mt-2">Par {cert.issuedBy}</p>
                </div>
                <button
                  onClick={() => window.open('/api/badges/certificate/' + cert.id + '/download', '_blank')}
                  className="w-full mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200"
                >
                  📥 Télécharger
                </button>
              </div>
            ))}
            {certificates.length === 0 && (
              <div className="text-center text-gray-500 py-12 col-span-full">
                <div className="text-6xl mb-4">🎓</div>
                <p className="text-lg font-medium mb-2">Aucun certificat pour le moment</p>
                <p>Continuez vos cours pour obtenir des certificats de la part de l'administrateur !</p>
              </div>
            )}
          </div>
        )}

        {/* Modal de détails du cours */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.title}</h2>
                <button onClick={() => setSelectedCourse(null)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>
              <p className="text-gray-600 mb-6">{selectedCourse.description}</p>
              
              <h3 className="font-semibold text-gray-900 mb-4">Contenu du cours</h3>
              <div className="space-y-3">
                {selectedCourse.content.map((content) => (
                  <div key={content.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {content.type === 'audio' ? '🎧' : content.type === 'video' ? '🎥' : '📄'}
                      </span>
                      <div>
                        <h4 className="font-medium text-gray-900">{content.title}</h4>
                        <p className="text-sm text-gray-600">{content.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {content.completed && <span className="text-green-600">✅</span>}
                      <button
                        onClick={() => updateProgress(selectedCourse.id, content.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        {content.type === 'video' ? '▶️' : content.type === 'audio' ? '🎧' : '📖'} Ouvrir
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire de création de cours */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Créer un nouveau cours</h3>
                <button onClick={() => setShowCreateForm(false)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre du cours *</label>
                  <input
                    type="text"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: Introduction à la programmation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="Description du cours..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type de cours *</label>
                    <select
                      value={newCourse.type}
                      onChange={(e) => setNewCourse({...newCourse, type: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="audio">🎧 Audio</option>
                      <option value="video">🎥 Vidéo</option>
                      <option value="written">📝 Écrit</option>
                      <option value="library">📖 Bibliothèque</option>
                      <option value="exercise">✏️ Exercice</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Niveau</label>
                    <select
                      value={newCourse.level}
                      onChange={(e) => setNewCourse({...newCourse, level: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="débutant">Débutant</option>
                      <option value="intermédiaire">Intermédiaire</option>
                      <option value="avancé">Avancé</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Durée (minutes)</label>
                    <input
                      type="number"
                      value={newCourse.duration}
                      onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ex: 60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                    <input
                      type="text"
                      value={newCourse.category}
                      onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ex: Programmation"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fichier média (optionnel)</label>
                  <input
                    type="file"
                    accept={newCourse.type === 'audio' ? 'audio/*' : newCourse.type === 'video' ? 'video/*' : newCourse.type === 'written' ? '.pdf,.doc,.docx' : 'image/*'}
                    onChange={(e) => setNewCourse({...newCourse, mediaFile: e.target.files?.[0] || null})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={createCourse}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    ✅ Créer le cours
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                  >
                    ❌ Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire d'octroi de permission (Admin uniquement) */}
        {showPermissionForm && isAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Accorder une permission</h3>
                <button onClick={() => setShowPermissionForm(false)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Numéro H du professeur *</label>
                  <input
                    type="text"
                    value={newPermission.numeroH}
                    onChange={(e) => setNewPermission({...newPermission, numeroH: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ex: G1C1P1R1E1F1 1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de cours *</label>
                  <select
                    value={newPermission.courseType}
                    onChange={(e) => setNewPermission({...newPermission, courseType: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="audio">🎧 Audio</option>
                    <option value="video">🎥 Vidéo</option>
                    <option value="written">📝 Écrit</option>
                    <option value="library">📖 Bibliothèque</option>
                    <option value="exercise">✏️ Exercice</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date d'expiration (optionnel)</label>
                  <input
                    type="date"
                    value={newPermission.expiresAt}
                    onChange={(e) => setNewPermission({...newPermission, expiresAt: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optionnel)</label>
                  <textarea
                    value={newPermission.notes}
                    onChange={(e) => setNewPermission({...newPermission, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    placeholder="Notes sur la permission..."
                  />
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={grantPermission}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    ✅ Accorder la permission
                  </button>
                  <button
                    onClick={() => setShowPermissionForm(false)}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                  >
                    ❌ Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

