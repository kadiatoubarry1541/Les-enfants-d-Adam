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
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000) // max ~8s pour éviter de bloquer l'UI

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          type: 'vivant'
        }),
        signal: controller.signal
      })
      
      if (!response.ok) {
        // Essayer de lire le message d'erreur renvoyé par le backend
        let errorMessage = `Erreur HTTP: ${response.status}`
        try {
          const errorData = await response.json()
          if (errorData?.message) {
            errorMessage = errorData.message
          }
        } catch {
          // ignore parse error, garder le message par défaut
        }
        return { success: false, user: null, message: errorMessage }
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
      // Ne plus faire semblant que l'inscription a réussi :
      // informer clairement l'utilisateur que le serveur est indisponible
      return {
        success: false,
        user: null,
        message:
          "Le serveur est indisponible ou trop lent. Votre inscription n'a pas été enregistrée. Veuillez réessayer dans quelques minutes."
      }
    } finally {
      clearTimeout(timeoutId)
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
        password: defuntPassword // Garder le mot de passe si besoin côté client
      }
      
      return { ...result, user: userDataWithPassword }
    } catch (error) {
      console.error('Erreur enregistrement défunt:', error)
      return {
        success: false,
        user: null,
        message:
          "Le serveur est indisponible ou trop lent. L'enregistrement du défunt n'a pas été effectué. Veuillez réessayer plus tard."
      }
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
        const message = errorData.message || 'Erreur de connexion'
        return { success: false, message }
      }
      
      const result = await response.json()
      
      if (result.success) {
        // Sauvegarder la session immédiatement
        localStorage.setItem('session_user', JSON.stringify({
          numeroH: normalizedNumeroH,
          userData: result.user,
          token: result.token
        }))
        // Stocker le token séparément pour les appels API (EditProfileModal, etc.)
        if (result.token) {
          localStorage.setItem('token', result.token)
        }
        return result
      } else {
        return {
          success: false,
          message: result.message || 'NumeroH ou mot de passe incorrect',
          numeroHExists: result.numeroHExists
        }
      }
    } catch (error) {
      console.error('Erreur connexion:', error)
      return {
        success: false,
        message:
          "Le serveur est indisponible ou trop lent. La connexion n'a pas pu être effectuée. Veuillez réessayer."
      }
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
