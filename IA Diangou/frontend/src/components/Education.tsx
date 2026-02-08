import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Education.css'

interface Course {
  id: string
  title: string
  description: string
  category: 'langue' | 'culture' | 'histoire' | 'religion' | 'science' | 'art'
  level: 'debutant' | 'intermediaire' | 'avance'
  duration: number // en minutes
  instructor: string
  rating: number
  studentsCount: number
  isCompleted: boolean
  progress: number // pourcentage
}

interface Lesson {
  id: string
  courseId: string
  title: string
  content: string
  type: 'video' | 'text' | 'quiz' | 'exercise'
  duration: number
  isCompleted: boolean
}

interface EducationProps {
  userData: any
}

export function Education({ userData }: EducationProps) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('courses')
  const [courses, setCourses] = useState<Course[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [showCourseModal, setShowCourseModal] = useState(false)

  useEffect(() => {
    // Simuler des cours pour la démo
    const mockCourses: Course[] = [
      {
        id: '1',
        title: 'Histoire des Peulhs',
        description: 'Découvrez l\'histoire fascinante du peuple peulh depuis ses origines',
        category: 'histoire',
        level: 'intermediaire',
        duration: 120,
        instructor: 'Dr. Diallo',
        rating: 4.8,
        studentsCount: 245,
        isCompleted: false,
        progress: 65
      },
      {
        id: '2',
        title: 'Langue Pular',
        description: 'Apprenez les bases de la langue pular avec des exercices pratiques',
        category: 'langue',
        level: 'debutant',
        duration: 90,
        instructor: 'Mme. Barry',
        rating: 4.6,
        studentsCount: 189,
        isCompleted: false,
        progress: 30
      },
      {
        id: '3',
        title: 'Culture Malinké',
        description: 'Exploration de la riche culture malinké et ses traditions',
        category: 'culture',
        level: 'debutant',
        duration: 75,
        instructor: 'Prof. Camara',
        rating: 4.7,
        studentsCount: 156,
        isCompleted: true,
        progress: 100
      },
      {
        id: '4',
        title: 'Islam et Traditions',
        description: 'Comprendre l\'Islam dans le contexte des traditions africaines',
        category: 'religion',
        level: 'intermediaire',
        duration: 150,
        instructor: 'Imam Traoré',
        rating: 4.9,
        studentsCount: 312,
        isCompleted: false,
        progress: 45
      },
      {
        id: '5',
        title: 'Artisanat Traditionnel',
        description: 'Techniques d\'artisanat et création d\'objets traditionnels',
        category: 'art',
        level: 'debutant',
        duration: 60,
        instructor: 'Maître Keita',
        rating: 4.5,
        studentsCount: 98,
        isCompleted: false,
        progress: 20
      },
      {
        id: '6',
        title: 'Sciences Naturelles',
        description: 'Botanique et médecine traditionnelle africaine',
        category: 'science',
        level: 'avance',
        duration: 180,
        instructor: 'Dr. Sow',
        rating: 4.8,
        studentsCount: 67,
        isCompleted: false,
        progress: 10
      }
    ]

    const mockLessons: Lesson[] = [
      {
        id: '1',
        courseId: '1',
        title: 'Introduction à l\'histoire des Peulhs',
        content: 'Origines et migrations du peuple peulh',
        type: 'video',
        duration: 15,
        isCompleted: true
      },
      {
        id: '2',
        courseId: '1',
        title: 'Les grands empires peulhs',
        content: 'Macina, Sokoto et autres empires',
        type: 'text',
        duration: 20,
        isCompleted: true
      },
      {
        id: '3',
        courseId: '1',
        title: 'Quiz sur l\'histoire peulh',
        content: 'Testez vos connaissances',
        type: 'quiz',
        duration: 10,
        isCompleted: false
      }
    ]

    setCourses(mockCourses)
    setLessons(mockLessons)
  }, [])

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      langue: '🗣️',
      culture: '🎭',
      histoire: '📚',
      religion: '🕌',
      science: '🔬',
      art: '🎨'
    }
    return icons[category] || '📖'
  }

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      langue: 'Langue',
      culture: 'Culture',
      histoire: 'Histoire',
      religion: 'Religion',
      science: 'Science',
      art: 'Art'
    }
    return labels[category] || category
  }

  const getLevelLabel = (level: string) => {
    const labels: { [key: string]: string } = {
      debutant: 'Débutant',
      intermediaire: 'Intermédiaire',
      avance: 'Avancé'
    }
    return labels[level] || level
  }

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      debutant: '#4CAF50',
      intermediaire: '#FF9800',
      avance: '#F44336'
    }
    return colors[level] || '#9E9E9E'
  }

  const getRatingStars = (rating: number) => {
    return '⭐'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating))
  }

  const getCourseLessons = (courseId: string) => {
    return lessons.filter(lesson => lesson.courseId === courseId)
  }

  const tabs = [
    { id: 'courses', label: 'Mes Cours', icon: '📚' },
    { id: 'progress', label: 'Progrès', icon: '📊' },
    { id: 'certificates', label: 'Certificats', icon: '🏆' },
    { id: 'library', label: 'Bibliothèque', icon: '📖' }
  ]

  return (
    <div className="education-page">
      <div className="education-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h3>🎓 Éducation de {userData.prenom} {userData.nomFamille}</h3>
            <p className="numero-h">NumeroH: {userData.numeroH}</p>
          </div>
        </div>
      </div>

      {/* Statistiques d'éducation */}
      <div className="education-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <h4>{courses.length}</h4>
              <p>Cours disponibles</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h4>{courses.filter(c => c.isCompleted).length}</h4>
              <p>Cours terminés</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h4>{Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)}%</h4>
              <p>Progrès moyen</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <h4>{Math.round(courses.reduce((acc, c) => acc + c.duration, 0) / 60)}h</h4>
              <p>Temps d'étude</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="education-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenu des onglets */}
      <div className="education-content">
        {activeTab === 'courses' && (
          <div className="courses-tab">
            <div className="tab-header">
              <h4>📚 Mes Cours</h4>
              <button className="btn-primary">
                + Nouveau cours
              </button>
            </div>

            <div className="courses-grid">
              {courses.map(course => (
                <div key={course.id} className="course-card">
                  <div className="course-header">
                    <div className="course-category">
                      <span className="category-icon">{getCategoryIcon(course.category)}</span>
                      <span className="category-label">{getCategoryLabel(course.category)}</span>
                    </div>
                    <div 
                      className="course-level"
                      style={{ backgroundColor: getLevelColor(course.level) }}
                    >
                      {getLevelLabel(course.level)}
                    </div>
                  </div>

                  <div className="course-content">
                    <h5>{course.title}</h5>
                    <p className="course-description">{course.description}</p>
                    
                    <div className="course-meta">
                      <div className="instructor">
                        <span className="meta-icon">👨‍🏫</span>
                        <span>{course.instructor}</span>
                      </div>
                      <div className="duration">
                        <span className="meta-icon">⏱️</span>
                        <span>{course.duration} min</span>
                      </div>
                      <div className="students">
                        <span className="meta-icon">👥</span>
                        <span>{course.studentsCount}</span>
                      </div>
                    </div>

                    <div className="course-rating">
                      <span className="rating-stars">{getRatingStars(course.rating)}</span>
                      <span className="rating-number">({course.rating})</span>
                    </div>

                    <div className="course-progress">
                      <div className="progress-header">
                        <span>Progrès</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="course-actions">
                    <button 
                      className="btn-primary"
                      onClick={() => {
                        setSelectedCourse(course)
                        setShowCourseModal(true)
                      }}
                    >
                      {course.isCompleted ? 'Revoir' : 'Continuer'}
                    </button>
                    <button className="btn-secondary">
                      📖 Détails
                    </button>
                  </div>

                  {course.isCompleted && (
                    <div className="completion-badge">
                      ✅ Terminé
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="progress-tab">
            <h4>📊 Mes Progrès</h4>
            
            <div className="progress-overview">
              <div className="overview-card">
                <h5>Progrès Général</h5>
                <div className="overall-progress">
                  <div className="progress-circle">
                    <div className="circle-fill">
                      {Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="category-progress">
                <h5>Progrès par Catégorie</h5>
                <div className="category-bars">
                  {['histoire', 'langue', 'culture', 'religion', 'art', 'science'].map(category => {
                    const categoryCourses = courses.filter(c => c.category === category)
                    const avgProgress = categoryCourses.length > 0 
                      ? Math.round(categoryCourses.reduce((acc, c) => acc + c.progress, 0) / categoryCourses.length)
                      : 0
                    
                    return (
                      <div key={category} className="category-bar">
                        <div className="bar-label">
                          <span className="category-icon">{getCategoryIcon(category)}</span>
                          <span>{getCategoryLabel(category)}</span>
                        </div>
                        <div className="bar-progress">
                          <div 
                            className="bar-fill"
                            style={{ width: `${avgProgress}%` }}
                          ></div>
                          <span className="bar-percentage">{avgProgress}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h5>Activité Récente</h5>
              <div className="activity-timeline">
                <div className="timeline-item">
                  <div className="timeline-icon">📚</div>
                  <div className="timeline-content">
                    <h6>Histoire des Peulhs - Leçon 2 terminée</h6>
                    <p>Il y a 2 heures</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-icon">✅</div>
                  <div className="timeline-content">
                    <h6>Quiz Culture Malinké réussi</h6>
                    <p>Il y a 1 jour</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-icon">🎓</div>
                  <div className="timeline-content">
                    <h6>Certificat Langue Pular obtenu</h6>
                    <p>Il y a 3 jours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="certificates-tab">
            <h4>🏆 Mes Certificats</h4>
            
            <div className="certificates-grid">
              <div className="certificate-card">
                <div className="certificate-header">
                  <div className="certificate-icon">🏆</div>
                  <div className="certificate-info">
                    <h5>Culture Malinké</h5>
                    <p>Certificat de Completion</p>
                  </div>
                </div>
                <div className="certificate-details">
                  <p><strong>Date d'obtention:</strong> 15 Janvier 2024</p>
                  <p><strong>Score:</strong> 95%</p>
                  <p><strong>Instructeur:</strong> Prof. Camara</p>
                </div>
                <div className="certificate-actions">
                  <button className="btn-primary">📄 Voir le certificat</button>
                  <button className="btn-secondary">📤 Partager</button>
                </div>
              </div>

              <div className="certificate-card">
                <div className="certificate-header">
                  <div className="certificate-icon">🎓</div>
                  <div className="certificate-info">
                    <h5>Langue Pular</h5>
                    <p>Certificat de Completion</p>
                  </div>
                </div>
                <div className="certificate-details">
                  <p><strong>Date d'obtention:</strong> 10 Janvier 2024</p>
                  <p><strong>Score:</strong> 88%</p>
                  <p><strong>Instructeur:</strong> Mme. Barry</p>
                </div>
                <div className="certificate-actions">
                  <button className="btn-primary">📄 Voir le certificat</button>
                  <button className="btn-secondary">📤 Partager</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'library' && (
          <div className="library-tab">
            <h4>📖 Bibliothèque</h4>
            
            <div className="library-sections">
              <div className="library-section">
                <h5>📚 Livres Recommandés</h5>
                <div className="books-grid">
                  <div className="book-card">
                    <div className="book-icon">📖</div>
                    <h6>Histoire des Peulhs</h6>
                    <p>Dr. Diallo</p>
                    <button className="btn-primary">Lire</button>
                  </div>
                  <div className="book-card">
                    <div className="book-icon">📖</div>
                    <h6>Culture Malinké</h6>
                    <p>Prof. Camara</p>
                    <button className="btn-primary">Lire</button>
                  </div>
                </div>
              </div>

              <div className="library-section">
                <h5>🎥 Vidéos Éducatives</h5>
                <div className="videos-grid">
                  <div className="video-card">
                    <div className="video-icon">🎥</div>
                    <h6>Documentaire sur les Traditions</h6>
                    <p>45 min</p>
                    <button className="btn-primary">Regarder</button>
                  </div>
                  <div className="video-card">
                    <div className="video-icon">🎥</div>
                    <h6>Leçons de Langue Pular</h6>
                    <p>30 min</p>
                    <button className="btn-primary">Regarder</button>
                  </div>
                </div>
              </div>

              <div className="library-section">
                <h5>🎧 Podcasts</h5>
                <div className="podcasts-grid">
                  <div className="podcast-card">
                    <div className="podcast-icon">🎧</div>
                    <h6>Histoire Orale Africaine</h6>
                    <p>25 min</p>
                    <button className="btn-primary">Écouter</button>
                  </div>
                  <div className="podcast-card">
                    <div className="podcast-icon">🎧</div>
                    <h6>Culture et Traditions</h6>
                    <p>35 min</p>
                    <button className="btn-primary">Écouter</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal du cours */}
      {showCourseModal && selectedCourse && (
        <div className="modal-overlay" onClick={() => setShowCourseModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedCourse.title}</h3>
              <button onClick={() => setShowCourseModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p><strong>Description:</strong> {selectedCourse.description}</p>
              <p><strong>Instructeur:</strong> {selectedCourse.instructor}</p>
              <p><strong>Durée:</strong> {selectedCourse.duration} minutes</p>
              <p><strong>Niveau:</strong> {getLevelLabel(selectedCourse.level)}</p>
              <p><strong>Progrès:</strong> {selectedCourse.progress}%</p>
              
              <div className="course-lessons">
                <h5>Leçons du cours:</h5>
                {getCourseLessons(selectedCourse.id).map(lesson => (
                  <div key={lesson.id} className="lesson-item">
                    <span className="lesson-icon">
                      {lesson.type === 'video' ? '🎥' : 
                       lesson.type === 'text' ? '📄' : 
                       lesson.type === 'quiz' ? '❓' : '✏️'}
                    </span>
                    <span className="lesson-title">{lesson.title}</span>
                    <span className="lesson-duration">{lesson.duration} min</span>
                    {lesson.isCompleted && <span className="lesson-completed">✅</span>}
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-primary">Continuer le cours</button>
              <button className="btn-secondary" onClick={() => setShowCourseModal(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

