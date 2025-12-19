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

  // Connexion utilisateur
  async login(numeroH: string, password: string) {
    try {
      // Normaliser le NumeroH avant l'envoi (supprimer les espaces multiples)
      const normalizedNumeroH = numeroH.trim().replace(/\s+/g, ' ')
      console.log('🔍 Tentative de connexion avec NumeroH:', normalizedNumeroH)
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ numeroH: normalizedNumeroH, password })
      })
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        // Sauvegarder la session avec le NumeroH normalisé
        localStorage.setItem('session_user', JSON.stringify({
          numeroH: normalizedNumeroH,
          userData: result.user,
          token: result.token
        }))
        console.log('✅ Session sauvegardée avec NumeroH:', normalizedNumeroH)
      }
      
      return result
    } catch (error) {
      console.error('Erreur connexion backend:', error)
      
      // Fallback vers localStorage avec le NumeroH normalisé
      return this.loginFromLocalStorage(normalizedNumeroH, password)
    }
  },

  // Connexion depuis localStorage (fallback)
  loginFromLocalStorage(numeroH: string, password: string) {
    const searchKeys = [
      'dernier_vivant',
      'dernier_defunt',
      'vivant_video',
      'defunt_video',
      'defunt_written',
      'vivant_written',
      // Ajouter les clés de comptes de test
      `compte_test_${numeroH.replace(/\s/g, '_')}`
    ]
    
    console.log('🔍 Recherche dans localStorage avec numeroH:', numeroH)
    
    // Chercher d'abord dans les clés standard
    for (const key of searchKeys) {
      const raw = localStorage.getItem(key)
      if (raw) {
        try {
          const data = JSON.parse(raw)
          const userNumeroH = data.numeroH || data.numeroHD
          const normalizedUserNumeroH = userNumeroH?.replace(/\s+/g, ' ').trim()
          const normalizedNumeroH = numeroH.replace(/\s+/g, ' ').trim()
          
          console.log(`📋 Vérification ${key}: ${normalizedUserNumeroH} === ${normalizedNumeroH}`)
          
          if (normalizedUserNumeroH === normalizedNumeroH) {
            // Vérifier le mot de passe
            const storedPassword = data.password || data.confirmPassword
            console.log(`🔐 Mot de passe trouvé dans ${key}:`, !!storedPassword)
            
            if (storedPassword && storedPassword === password) {
              console.log(`✅ Mot de passe correct pour ${key}`)
              localStorage.setItem('session_user', JSON.stringify({
                numeroH: normalizedUserNumeroH,
                userData: data,
                type: data.type || 'vivant',
                source: key
              }))
              return {
                success: true,
                user: data,
                message: 'Connexion réussie (données locales)'
              }
            } else {
              console.log(`❌ Mot de passe incorrect pour ${key}`)
              // NumeroH trouvé mais mauvais mot de passe
              return {
                success: false,
                message: 'Mot de passe incorrect',
                numeroHExists: true
              }
            }
          }
        } catch (e) {
          console.error(`Erreur parsing ${key}:`, e)
        }
      }
    }
    
    // Chercher aussi dans TOUTES les clés localStorage qui pourraient contenir un compte
    console.log('🔍 Recherche étendue dans toutes les clés localStorage...')
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.startsWith('compte_test_') || key.includes('vivant') || key.includes('defunt'))) {
        const raw = localStorage.getItem(key)
        if (raw) {
          try {
            const data = JSON.parse(raw)
            const userNumeroH = data.numeroH || data.numeroHD
            const normalizedUserNumeroH = userNumeroH?.replace(/\s+/g, ' ').trim()
            const normalizedNumeroH = numeroH.replace(/\s+/g, ' ').trim()
            
            if (normalizedUserNumeroH === normalizedNumeroH) {
              const storedPassword = data.password || data.confirmPassword
              console.log(`📋 Compte trouvé dans ${key}`)
              
              if (storedPassword && storedPassword === password) {
                localStorage.setItem('session_user', JSON.stringify({
                  numeroH: normalizedUserNumeroH,
                  userData: data,
                  type: data.type || 'vivant',
                  source: key
                }))
                console.log(`✅ Connexion réussie depuis ${key}`)
                return {
                  success: true,
                  user: data,
                  message: 'Connexion réussie (compte trouvé)'
                }
              } else {
                console.log(`❌ Mot de passe incorrect pour ${key}`)
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
      }
    }
    
    console.log('❌ NumeroH non trouvé dans localStorage')
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
