// Types communs entre frontend et backend
export interface User {
  id?: number
  numeroH: string
  prenom: string
  nomFamille: string
  email?: string
  password?: string
  genre?: 'HOMME' | 'FEMME' | 'AUTRE'
  dateNaissance?: string
  generation?: string
  type?: 'vivant' | 'defunt'
  
  // Informations géographiques
  regionOrigine?: string
  prefecture?: string
  sousPrefecture?: string
  lieu1?: string
  lieu2?: string
  lieu3?: string
  lieuResidence1?: string
  lieuResidence2?: string
  lieuResidence3?: string
  pays?: string
  nationalite?: string
  
  // Informations familiales
  famillePere?: string
  prenomPere?: string
  pereStatut?: 'Vivant' | 'Mort'
  numeroHPere?: string
  familleMere?: string
  prenomMere?: string
  mereStatut?: 'Vivant' | 'Mort'
  numeroHMere?: string
  
  // Informations professionnelles
  activite1?: string
  activite2?: string
  activite3?: string
  situationEco?: 'Droit au ZAKA' | 'Moyen' | 'Pauvre' | 'Riche'
  
  // Informations de contact
  tel1?: string
  tel2?: string
  
  // Informations système
  isActive?: boolean
  isVerified?: boolean
  role?: 'user' | 'admin' | 'super-admin'
  createdAt?: string
  updatedAt?: string
  
  // Champs supplémentaires
  [key: string]: any
}

export interface Badge {
  id: number
  name: string
  description: string
  icon: string
  color: string
  category: 'achievement' | 'education' | 'faith' | 'family' | 'health' | 'social' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  requirements?: any
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface UserBadge {
  id: number
  userId: number
  badgeId: number
  awardedAt: string
  awardedBy?: number
  isActive: boolean
  Badge?: Badge
}

export interface ActivityGroup {
  id: number
  name: string
  description: string
  category: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ResidenceGroup {
  id: number
  name: string
  description: string
  type: 'district' | 'quartier' | 'village'
  location: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface EducationFormation {
  id: number
  title: string
  description: string
  duration: number
  level: 'debutant' | 'intermediaire' | 'avance'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface RegionGroup {
  id: number
  name: string
  description: string
  region: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface OrganizationGroup {
  id: number
  name: string
  description: string
  organization: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface FaithCommunity {
  id: number
  name: string
  description: string
  religion: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface FaithPost {
  id: number
  content: string
  type: 'message' | 'video' | 'audio'
  authorId: number
  communityId?: number
  createdAt: string
  updatedAt: string
}

export interface HolyBook {
  id: number
  title: string
  author: string
  description: string
  content: string
  language: string
  category: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface FriendRequest {
  id: number
  senderId: number
  receiverId: number
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  errors?: any[]
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
