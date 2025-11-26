import { useState, useEffect } from 'react'
import './EncoreMange.css'

interface Meal {
  id: string
  date: string
  mealType: 'petit_dejeuner' | 'dejeuner' | 'diner' | 'collation'
  name: string
  description: string
  calories: number
  ingredients: string[]
  photo?: string
  rating: number
  location: string
  cost?: number
}

interface NutritionGoal {
  id: string
  name: string
  target: number
  current: number
  unit: string
  category: 'calories' | 'proteins' | 'carbs' | 'fats' | 'fiber' | 'water'
}

interface FavoriteRestaurant {
  id: string
  name: string
  location: string
  cuisine: string
  rating: number
  lastVisit: string
  photo?: string
}

interface EncoreMangeProps {
  userData: any
}

export function EncoreMange({ userData }: EncoreMangeProps) {
  const [activeTab, setActiveTab] = useState('today')
  const [meals, setMeals] = useState<Meal[]>([])
  const [nutritionGoals, setNutritionGoals] = useState<NutritionGoal[]>([])
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<FavoriteRestaurant[]>([])
  const [showAddMeal, setShowAddMeal] = useState(false)
  const [showAddRestaurant, setShowAddRestaurant] = useState(false)

  useEffect(() => {
    // Simuler des données alimentaires pour la démo
    const mockMeals: Meal[] = [
      {
        id: '1',
        date: '2024-01-20',
        mealType: 'petit_dejeuner',
        name: 'Pain et café',
        description: 'Pain grillé avec beurre et café noir',
        calories: 250,
        ingredients: ['Pain', 'Beurre', 'Café'],
        rating: 4,
        location: 'Chez moi',
        cost: 500
      },
      {
        id: '2',
        date: '2024-01-20',
        mealType: 'dejeuner',
        name: 'Riz au poisson',
        description: 'Riz blanc avec poisson grillé et légumes',
        calories: 450,
        ingredients: ['Riz', 'Poisson', 'Tomates', 'Oignons'],
        rating: 5,
        location: 'Restaurant Le Bon Goût',
        cost: 15000
      },
      {
        id: '3',
        date: '2024-01-20',
        mealType: 'diner',
        name: 'Soupe de légumes',
        description: 'Soupe maison avec carottes, pommes de terre et épinards',
        calories: 200,
        ingredients: ['Carottes', 'Pommes de terre', 'Épinards', 'Bouillon'],
        rating: 4,
        location: 'Chez moi',
        cost: 2000
      },
      {
        id: '4',
        date: '2024-01-19',
        mealType: 'dejeuner',
        name: 'Poulet Yassa',
        description: 'Poulet mariné avec oignons et citron',
        calories: 380,
        ingredients: ['Poulet', 'Oignons', 'Citron', 'Riz'],
        rating: 5,
        location: 'Chez Fatou',
        cost: 12000
      }
    ]

    const mockNutritionGoals: NutritionGoal[] = [
      {
        id: '1',
        name: 'Calories',
        target: 2000,
        current: 900,
        unit: 'kcal',
        category: 'calories'
      },
      {
        id: '2',
        name: 'Protéines',
        target: 150,
        current: 65,
        unit: 'g',
        category: 'proteins'
      },
      {
        id: '3',
        name: 'Glucides',
        target: 250,
        current: 120,
        unit: 'g',
        category: 'carbs'
      },
      {
        id: '4',
        name: 'Lipides',
        target: 65,
        current: 30,
        unit: 'g',
        category: 'fats'
      },
      {
        id: '5',
        name: 'Fibres',
        target: 25,
        current: 12,
        unit: 'g',
        category: 'fiber'
      },
      {
        id: '6',
        name: 'Eau',
        target: 2.5,
        current: 1.2,
        unit: 'L',
        category: 'water'
      }
    ]

    const mockRestaurants: FavoriteRestaurant[] = [
      {
        id: '1',
        name: 'Le Bon Goût',
        location: 'Conakry, Kaloum',
        cuisine: 'Cuisine guinéenne',
        rating: 4.5,
        lastVisit: '2024-01-20',
        photo: undefined
      },
      {
        id: '2',
        name: 'Chez Fatou',
        location: 'Conakry, Matam',
        cuisine: 'Cuisine sénégalaise',
        rating: 4.8,
        lastVisit: '2024-01-19',
        photo: undefined
      },
      {
        id: '3',
        name: 'Restaurant du Port',
        location: 'Conakry, Port',
        cuisine: 'Fruits de mer',
        rating: 4.2,
        lastVisit: '2024-01-15',
        photo: undefined
      }
    ]

    setMeals(mockMeals)
    setNutritionGoals(mockNutritionGoals)
    setFavoriteRestaurants(mockRestaurants)
  }, [])

  const getMealTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      petit_dejeuner: '🌅',
      dejeuner: '☀️',
      diner: '🌙',
      collation: '🍎'
    }
    return icons[type] || '🍽️'
  }

  const getMealTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      petit_dejeuner: 'Petit-déjeuner',
      dejeuner: 'Déjeuner',
      diner: 'Dîner',
      collation: 'Collation'
    }
    return labels[type] || type
  }

  const getRatingStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  const getNutritionColor = (category: string) => {
    const colors: { [key: string]: string } = {
      calories: '#FF5722',
      proteins: '#4CAF50',
      carbs: '#FF9800',
      fats: '#9C27B0',
      fiber: '#795548',
      water: '#2196F3'
    }
    return colors[category] || '#9E9E9E'
  }

  const getTodayMeals = () => {
    const today = new Date().toISOString().split('T')[0]
    return meals.filter(meal => meal.date === today)
  }

  const getTotalCaloriesToday = () => {
    return getTodayMeals().reduce((total, meal) => total + meal.calories, 0)
  }

  const tabs = [
    { id: 'today', label: "Aujourd'hui", icon: '📅' },
    { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
    { id: 'restaurants', label: 'Restaurants', icon: '🍽️' },
    { id: 'history', label: 'Historique', icon: '📊' },
    { id: 'recipes', label: 'Recettes', icon: '👨‍🍳' }
  ]

  return (
    <div className="encore-mange-page">
      <div className="encore-mange-header">
        <h3>🍽️ Encore mangé - {userData.prenom} {userData.nomFamille}</h3>
        <p className="numero-h">NumeroH: {userData.numeroH}</p>
      </div>

      {/* Navigation par onglets */}
      <div className="encore-mange-tabs">
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
      <div className="encore-mange-content">
        {activeTab === 'today' && (
          <div className="today-tab">
            <div className="today-summary">
              <div className="summary-card">
                <h4>📊 Résumé d'aujourd'hui</h4>
                <div className="summary-stats">
                  <div className="stat-item">
                    <span className="stat-number">{getTodayMeals().length}</span>
                    <span className="stat-label">Repas</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{getTotalCaloriesToday()}</span>
                    <span className="stat-label">Calories</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">
                      {getTodayMeals().reduce((total, meal) => total + (meal.cost || 0), 0).toLocaleString()}
                    </span>
                    <span className="stat-label">FG dépensés</span>
                  </div>
                </div>
              </div>

              <div className="quick-actions">
                <button 
                  className="btn-primary"
                  onClick={() => setShowAddMeal(true)}
                >
                  + Ajouter un repas
                </button>
                <button className="btn-secondary">
                  📍 Trouver un restaurant
                </button>
              </div>
            </div>

            <div className="today-meals">
              <h4>🍽️ Repas d'aujourd'hui</h4>
              {getTodayMeals().length > 0 ? (
                <div className="meals-list">
                  {getTodayMeals().map(meal => (
                    <div key={meal.id} className="meal-card">
                      <div className="meal-header">
                        <div className="meal-type">
                          <span className="type-icon">{getMealTypeIcon(meal.mealType)}</span>
                          <span className="type-label">{getMealTypeLabel(meal.mealType)}</span>
                        </div>
                        <div className="meal-rating">
                          {getRatingStars(meal.rating)}
                        </div>
                      </div>
                      
                      <div className="meal-content">
                        <h5>{meal.name}</h5>
                        <p className="meal-description">{meal.description}</p>
                        <div className="meal-details">
                          <span className="calories">{meal.calories} kcal</span>
                          <span className="location">📍 {meal.location}</span>
                          {meal.cost && <span className="cost">{meal.cost.toLocaleString()} FG</span>}
                        </div>
                        <div className="ingredients">
                          <strong>Ingrédients:</strong> {meal.ingredients.join(', ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-meals">
                  <p>🍽️ Aucun repas enregistré aujourd'hui</p>
                  <button 
                    className="btn-primary"
                    onClick={() => setShowAddMeal(true)}
                  >
                    Ajouter votre premier repas
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="nutrition-tab">
            <h4>🥗 Objectifs nutritionnels</h4>
            
            <div className="nutrition-goals">
              {nutritionGoals.map(goal => {
                const percentage = Math.min((goal.current / goal.target) * 100, 100)
                return (
                  <div key={goal.id} className="goal-card">
                    <div className="goal-header">
                      <h5>{goal.name}</h5>
                      <span className="goal-values">
                        {goal.current}/{goal.target} {goal.unit}
                      </span>
                    </div>
                    
                    <div className="goal-progress">
                      <div 
                        className="progress-bar"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: getNutritionColor(goal.category)
                        }}
                      ></div>
                    </div>
                    
                    <div className="goal-percentage">
                      {Math.round(percentage)}% de l'objectif
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="nutrition-tips">
              <h5>💡 Conseils nutritionnels</h5>
              <div className="tips-grid">
                <div className="tip-card">
                  <h6>🥗 Fruits et légumes</h6>
                  <p>Consommez au moins 5 portions par jour</p>
                </div>
                <div className="tip-card">
                  <h6>💧 Hydratation</h6>
                  <p>Buvez 1.5 à 2L d'eau par jour</p>
                </div>
                <div className="tip-card">
                  <h6>🐟 Protéines</h6>
                  <p>Variez les sources: poisson, viande, légumineuses</p>
                </div>
                <div className="tip-card">
                  <h6>🌾 Fibres</h6>
                  <p>Privilégiez les céréales complètes</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'restaurants' && (
          <div className="restaurants-tab">
            <div className="tab-header">
              <h4>🍽️ Restaurants favoris</h4>
              <button 
                className="btn-primary"
                onClick={() => setShowAddRestaurant(true)}
              >
                + Ajouter un restaurant
              </button>
            </div>

            <div className="restaurants-grid">
              {favoriteRestaurants.map(restaurant => (
                <div key={restaurant.id} className="restaurant-card">
                  <div className="restaurant-header">
                    <h5>{restaurant.name}</h5>
                    <div className="restaurant-rating">
                      {getRatingStars(Math.round(restaurant.rating))}
                      <span className="rating-number">({restaurant.rating})</span>
                    </div>
                  </div>
                  
                  <div className="restaurant-content">
                    <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
                    <p><strong>📍 Localisation:</strong> {restaurant.location}</p>
                    <p><strong>Dernière visite:</strong> {new Date(restaurant.lastVisit).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="restaurant-actions">
                    <button className="btn-primary">📞 Appeler</button>
                    <button className="btn-secondary">🗺️ Itinéraire</button>
                    <button className="btn-tertiary">⭐ Noter</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="restaurant-search">
              <h5>🔍 Trouver un restaurant</h5>
              <div className="search-filters">
                <select className="filter-select">
                  <option value="">Tous les types</option>
                  <option value="guineenne">Cuisine guinéenne</option>
                  <option value="senegalaise">Cuisine sénégalaise</option>
                  <option value="francaise">Cuisine française</option>
                  <option value="asiatique">Cuisine asiatique</option>
                </select>
                <select className="filter-select">
                  <option value="">Toutes les zones</option>
                  <option value="kaloum">Kaloum</option>
                  <option value="matam">Matam</option>
                  <option value="port">Port</option>
                  <option value="ratoma">Ratoma</option>
                </select>
                <button className="btn-primary">🔍 Rechercher</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-tab">
            <h4>📊 Historique des repas</h4>
            
            <div className="history-filters">
              <select className="filter-select">
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="year">Cette année</option>
                <option value="all">Tout l'historique</option>
              </select>
            </div>

            <div className="history-stats">
              <div className="stat-card">
                <h5>📈 Statistiques</h5>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-number">{meals.length}</span>
                    <span className="stat-label">Repas total</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">
                      {Math.round(meals.reduce((total, meal) => total + meal.calories, 0) / meals.length)}
                    </span>
                    <span className="stat-label">Calories moy.</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">
                      {Math.round(meals.reduce((total, meal) => total + meal.rating, 0) / meals.length * 10) / 10}
                    </span>
                    <span className="stat-label">Note moy.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="history-list">
              {meals.map(meal => (
                <div key={meal.id} className="history-item">
                  <div className="history-date">
                    {new Date(meal.date).toLocaleDateString()}
                  </div>
                  <div className="history-content">
                    <h6>{meal.name}</h6>
                    <p>{meal.description}</p>
                    <div className="history-details">
                      <span className="meal-type">{getMealTypeIcon(meal.mealType)} {getMealTypeLabel(meal.mealType)}</span>
                      <span className="calories">{meal.calories} kcal</span>
                      <span className="rating">{getRatingStars(meal.rating)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'recipes' && (
          <div className="recipes-tab">
            <h4>👨‍🍳 Recettes favorites</h4>
            
            <div className="recipes-grid">
              <div className="recipe-card">
                <h5>🍛 Riz au poisson</h5>
                <div className="recipe-info">
                  <p><strong>Temps:</strong> 45 min</p>
                  <p><strong>Difficulté:</strong> Facile</p>
                  <p><strong>Portions:</strong> 4</p>
                </div>
                <div className="recipe-ingredients">
                  <strong>Ingrédients:</strong>
                  <ul>
                    <li>500g de riz</li>
                    <li>1 poisson</li>
                    <li>2 tomates</li>
                    <li>1 oignon</li>
                    <li>Épices</li>
                  </ul>
                </div>
                <button className="btn-primary">📖 Voir la recette</button>
              </div>

              <div className="recipe-card">
                <h5>🍗 Poulet Yassa</h5>
                <div className="recipe-info">
                  <p><strong>Temps:</strong> 60 min</p>
                  <p><strong>Difficulté:</strong> Moyen</p>
                  <p><strong>Portions:</strong> 6</p>
                </div>
                <div className="recipe-ingredients">
                  <strong>Ingrédients:</strong>
                  <ul>
                    <li>1 poulet</li>
                    <li>3 oignons</li>
                    <li>2 citrons</li>
                    <li>Moutarde</li>
                    <li>Épices</li>
                  </ul>
                </div>
                <button className="btn-primary">📖 Voir la recette</button>
              </div>

              <div className="recipe-card">
                <h5>🥗 Salade de légumes</h5>
                <div className="recipe-info">
                  <p><strong>Temps:</strong> 15 min</p>
                  <p><strong>Difficulté:</strong> Facile</p>
                  <p><strong>Portions:</strong> 2</p>
                </div>
                <div className="recipe-ingredients">
                  <strong>Ingrédients:</strong>
                  <ul>
                    <li>Tomates</li>
                    <li>Concombres</li>
                    <li>Carottes</li>
                    <li>Vinaigrette</li>
                  </ul>
                </div>
                <button className="btn-primary">📖 Voir la recette</button>
              </div>
            </div>

            <div className="add-recipe">
              <button className="btn-secondary">
                + Ajouter une recette
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddMeal && (
        <div className="modal-overlay" onClick={() => setShowAddMeal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🍽️ Ajouter un repas</h3>
              <button onClick={() => setShowAddMeal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Fonctionnalité en développement...</p>
            </div>
          </div>
        </div>
      )}

      {showAddRestaurant && (
        <div className="modal-overlay" onClick={() => setShowAddRestaurant(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🍽️ Ajouter un restaurant</h3>
              <button onClick={() => setShowAddRestaurant(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Fonctionnalité en développement...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
















