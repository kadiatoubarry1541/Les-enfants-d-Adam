// Types pour les invitations
export interface Invitation {
  id: string
  fromNumeroH: string
  fromName: string
  toNumeroH: string
  toName: string
  relation: string
  status: 'pending' | 'accepted' | 'declined'
  dateSent: string
  dateResponded?: string
  message?: string
}

export interface InvitationNotification {
  id: string
  invitationId: string
  type: 'invitation_received' | 'invitation_accepted' | 'invitation_declined'
  fromNumeroH: string
  fromName: string
  message: string
  date: string
  read: boolean
}








