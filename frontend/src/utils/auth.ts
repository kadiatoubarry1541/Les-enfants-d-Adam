export interface UserData {
  numeroH: string;
  prenom: string;
  nomFamille: string;
  role?: string;
  isAdmin?: boolean;
  [key: string]: any;
}

/**
 * Vérifie si l'utilisateur est connecté et retourne ses données
 * @returns UserData si connecté, null sinon
 */
export function getSessionUser(): UserData | null {
  try {
    const session = localStorage.getItem("session_user");
    if (!session) {
      // Si pas de session, vérifier si un token existe (utilisateur peut être connecté)
      const token = localStorage.getItem("token");
      if (token) {
        console.warn("Token trouvé mais session manquante - l'utilisateur peut être connecté");
        // Ne pas retourner null immédiatement, essayer de récupérer les données
      }
      return null;
    }

    // Essayer de parser la session
    let parsed;
    try {
      parsed = JSON.parse(session);
    } catch (parseError) {
      console.error('Erreur lors du parsing de la session:', parseError);
      // Si le parsing échoue, vérifier si un token existe
      const token = localStorage.getItem("token");
      if (token) {
        console.warn("Session invalide mais token trouvé - l'utilisateur peut être connecté");
      }
      return null;
    }

    const user = parsed.userData || parsed;
    
    if (!user || !user.numeroH) {
      // Si pas de données utilisateur valides, vérifier si un token existe
      const token = localStorage.getItem("token");
      if (token) {
        console.warn("Session incomplète mais token trouvé - l'utilisateur peut être connecté");
      }
      return null;
    }
    
    return user as UserData;
  } catch (error) {
    console.error('Erreur lors de la lecture de la session:', error);
    // En cas d'erreur, vérifier si un token existe
    const token = localStorage.getItem("token");
    if (token) {
      console.warn("Erreur de session mais token trouvé - l'utilisateur peut être connecté");
    }
    return null;
  }
}

/**
 * Vérifie si l'utilisateur est un administrateur
 * @param user - Les données de l'utilisateur
 * @returns true si admin, false sinon
 */
export function isAdmin(user: UserData | null): boolean {
  if (!user) return false;
  
  const role = user.role?.toLowerCase() || '';
  return (
    role === 'admin' ||
    role === 'super-admin' ||
    role === 'administrator' ||
    user.isAdmin === true ||
    user.numeroH === 'G0C0P0R0E0F0 0' // Admin par défaut
  );
}

/**
 * Vérifie si l'utilisateur est l'administrateur principal (seul à voir le badge couronne / droits roi)
 * @param user - Les données de l'utilisateur
 * @returns true si admin principal, false sinon
 */
export function isMasterAdmin(user: UserData | null): boolean {
  if (!user) return false;
  const role = user.role?.toLowerCase() || '';
  return (
    user.numeroH === 'G0C0P0R0E0F0 0' ||
    role === 'super-admin'
  );
}

/**
 * Vérifie si l'utilisateur est connecté
 * @returns true si connecté, false sinon
 */
export function isAuthenticated(): boolean {
  return getSessionUser() !== null;
}

/**
 * Vérifie si l'utilisateur est connecté et est admin
 * @returns true si connecté et admin, false sinon
 */
export function isAdminAuthenticated(): boolean {
  const user = getSessionUser();
  return user !== null && isAdmin(user);
}

/**
 * Construit l'URL complète de la photo de profil utilisateur.
 * Gère les cas : data URI, URL absolue HTTP, chemin relatif serveur, et absence de photo.
 * @param photo - Le champ photo de l'utilisateur (peut être undefined/null)
 * @returns L'URL complète ou null si pas de photo
 */
export function getPhotoUrl(photo?: string | null): string | null {
  if (!photo) return null;
  // Data URI (photo capturée localement)
  if (photo.startsWith("data:")) return photo;
  // Blob URL (preview locale)
  if (photo.startsWith("blob:")) return photo;
  // URL absolue (déjà complète)
  if (photo.startsWith("http://") || photo.startsWith("https://")) return photo;
  // Chemin relatif du serveur (ex: /uploads/photo-123.jpg)
  // En dev, le proxy Vite redirige /uploads vers le backend
  // En prod, le chemin relatif fonctionne directement
  if (photo.startsWith("/uploads/")) return photo;
  if (photo.startsWith("uploads/")) return "/" + photo;
  // Autre chemin relatif - construire l'URL complète
  const baseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5002/api").replace("/api", "");
  return `${baseUrl}${photo.startsWith("/") ? photo : "/" + photo}`;
}

