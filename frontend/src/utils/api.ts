// API pour communiquer avec le backend
const API_BASE_URL = (import.meta as any)?.env?.VITE_API_URL ?? 'http://localhost:5002/api'

export interface User {
  numeroH: string
  prenom: string
  nomFamille: string
  password: string
  email?: string
  genre?: string
  dateNaissance?: string
  generation?: string
  type?: 'vivant' | 'defunt'
  
  // Activités professionnelles
  activite1?: string
  activite2?: string
  activite3?: string
  
  // Nouveaux champs de lieu de résidence
  lieuResidence1?: string
  lieuResidence2?: string
  lieuResidence3?: string
  
  [key: string]: any
}

export const api = {
  // Enregistrer un utilisateur vivant
  async registerLiving(userData: User) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          type: 'vivant'
        })
      })
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }
      
      const result = await response.json()
      
      // ⚠️ IMPORTANT : Le backend retourne l'utilisateur SANS le mot de passe (sécurité)
      // On doit fusionner avec les données originales pour garder le mot de passe
      // pour l'authentification locale (fallback)
      const userDataWithPassword = {
        ...result.user,
        password: userData.password // Garder le mot de passe original pour le fallback localStorage
      }
      
      // Sauvegarder en localStorage comme backup avec le mot de passe
      localStorage.setItem('dernier_vivant', JSON.stringify(userDataWithPassword))
      
      // Sauvegarder le token JWT si disponible
      if (result.token) {
        localStorage.setItem('token', result.token)
      }
      
      return { ...result, user: userDataWithPassword }
    } catch (error) {
      console.error('Erreur enregistrement vivant:', error)
      // Fallback vers localStorage si le backend est indisponible
      localStorage.setItem('dernier_vivant', JSON.stringify(userData))
      return { success: true, user: userData, message: 'Sauvegardé localement (backend indisponible)' }
    }
  },

  // Enregistrer un utilisateur défunt
  async registerDeceased(userData: User) {
    try {
      // Pour les défunts, utiliser un mot de passe par défaut
      const defuntPassword = 'defunt123'
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          type: 'defunt',
          isDeceased: true,
          // Adapter les champs pour la compatibilité backend
          numeroH: userData.numeroHD || userData.numeroH,
          prenom: userData.prenom || 'Défunt',
          nomFamille: userData.nom || userData.nomFamille || 'Inconnu',
          email: userData.email || `${userData.numeroHD || userData.numeroH}@defunt.genealogie`,
          password: defuntPassword
        })
      })
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }
      
      const result = await response.json()
      
      // ⚠️ IMPORTANT : Le backend retourne l'utilisateur SANS le mot de passe
      // On garde le mot de passe pour l'authentification locale
      const userDataWithPassword = {
        ...result.user,
        password: defuntPassword // Garder le mot de passe pour le fallback
      }
      
      // Sauvegarder en localStorage comme backup avec le mot de passe
      localStorage.setItem('dernier_defunt', JSON.stringify(userDataWithPassword))
      
      return { ...result, user: userDataWithPassword }
    } catch (error) {
      console.error('Erreur enregistrement défunt:', error)
      // Fallback vers localStorage si le backend est indisponible
      localStorage.setItem('dernier_defunt', JSON.stringify(userData))
      return { success: true, user: userData, message: 'Sauvegardé localement (backend indisponible)' }
    }
  },

  // Connexion utilisateur - Version optimisée et rapide
  async login(numeroH: string, password: string) {
    const normalizedNumeroH = numeroH.trim().replace(/\s+/g, ' ')
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ numeroH: normalizedNumeroH, password })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Erreur de connexion')
      }
      
      const result = await response.json()
      
      if (result.success) {
        // Sauvegarder la session immédiatement
        localStorage.setItem('session_user', JSON.stringify({
          numeroH: normalizedNumeroH,
          userData: result.user,
          token: result.token
        }))
        return result
      } else {
        // Fallback localStorage si backend retourne success: false
        return this.loginFromLocalStorage(normalizedNumeroH, password)
      }
    } catch (error) {
      // Fallback vers localStorage en cas d'erreur réseau
      return this.loginFromLocalStorage(normalizedNumeroH, password)
    }
  },

  // Connexion depuis localStorage (fallback) - Version optimisée
  loginFromLocalStorage(numeroH: string, password: string) {
    const searchKeys = [
      'dernier_vivant',
      'dernier_defunt',
      'vivant_video',
      'defunt_video',
      'defunt_written',
      'vivant_written',
      `compte_test_${numeroH.replace(/\s/g, '_')}`
    ]
    
    const normalizedNumeroH = numeroH.replace(/\s+/g, ' ').trim()
    
    // Recherche rapide dans les clés principales
    for (const key of searchKeys) {
      const raw = localStorage.getItem(key)
      if (!raw) continue
      
      try {
        const data = JSON.parse(raw)
        const userNumeroH = data.numeroH || data.numeroHD
        const normalizedUserNumeroH = userNumeroH?.replace(/\s+/g, ' ').trim()
        
        if (normalizedUserNumeroH === normalizedNumeroH) {
          const storedPassword = data.password || data.confirmPassword
          
          if (storedPassword && storedPassword === password) {
            localStorage.setItem('session_user', JSON.stringify({
              numeroH: normalizedUserNumeroH,
              userData: data,
              type: data.type || 'vivant',
              source: key
            }))
            return {
              success: true,
              user: data,
              message: 'Connexion réussie'
            }
          } else {
            return {
              success: false,
              message: 'Mot de passe incorrect',
              numeroHExists: true
            }
          }
        }
      } catch (e) {
        // Ignore les erreurs de parsing
      }
    }
    
    return {
      success: false,
      message: 'NumeroH ou mot de passe incorrect'
    }
  },

  // Vérifier si le backend est disponible
  async checkBackendHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`)
      return response.ok
    } catch (error) {
      return false
    }
  }
}
