import { calculerAge } from '../utils/calculs'

export interface GroupAccessRule {
  groupId: string
  groupName: string
  icon: string
  color: string
  description: string
  accessCondition: (userData: any) => boolean
}

export const SOCIAL_GROUP_RULES: GroupAccessRule[] = [
  {
    groupId: 'femme',
    groupName: 'Groupe des Femmes',
    icon: '👩',
    color: '#E91E63',
    description: 'Espace dédié aux femmes de la communauté. Partagez vos expériences, défis et réussites.',
    accessCondition: (userData) => userData.genre === 'FEMME'
  },
  {
    groupId: 'homme',
    groupName: 'Groupe des Hommes',
    icon: '👨',
    color: '#2196F3',
    description: 'Communauté des hommes. Discussions, conseils et partage d\'expériences masculines.',
    accessCondition: (userData) => userData.genre === 'HOMME'
  },
  {
    groupId: 'jeunes',
    groupName: 'Groupe des Jeunes',
    icon: '👦👧',
    color: '#4CAF50',
    description: 'Espace pour les jeunes de moins de 18 ans. Apprentissage, amitié et développement.',
    accessCondition: (userData) => {
      const age = userData.dateNaissance ? calculerAge(userData.dateNaissance) : 0
      return age !== null && age < 18
    }
  }
]

export function getUserAccessibleGroups(userData: any): GroupAccessRule[] {
  return SOCIAL_GROUP_RULES.filter(rule => rule.accessCondition(userData))
}

export function getUserGroupAccess(userData: any) {
  const age = userData.dateNaissance ? calculerAge(userData.dateNaissance) : 0
  
  return {
    canAccessFemme: userData.genre === 'FEMME',
    canAccessHomme: userData.genre === 'HOMME',
    canAccessJeunes: age !== null && age < 18,
    userAge: age,
    userGenre: userData.genre
  }
}

export function getGroupMembersByRule(groupId: string, allMembers: any[]): any[] {
  switch (groupId) {
    case 'femme':
      return allMembers.filter(member => member.genre === 'FEMME')
    case 'homme':
      return allMembers.filter(member => member.genre === 'HOMME')
    case 'jeunes':
      return allMembers.filter(member => {
        const age = member.dateNaissance ? calculerAge(member.dateNaissance) : 0
        return age !== null && age < 18
      })
    default:
      return []
  }
}

export function getGroupPostsByRule(groupId: string, allPosts: any[], allMembers: any[]): any[] {
  const groupMembers = getGroupMembersByRule(groupId, allMembers)
  const memberIds = groupMembers.map(member => member.id)
  return allPosts.filter(post => memberIds.includes(post.authorId))
}















