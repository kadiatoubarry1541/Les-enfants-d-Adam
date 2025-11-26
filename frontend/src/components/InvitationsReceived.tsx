import { useState, useEffect } from 'react'
import './InvitationsReceived.css'
import { InvitationManager } from '../utils/invitationManager'
import type { Invitation, InvitationNotification } from '../types/invitation.ts'

interface InvitationsReceivedProps {
  userData: {
    numeroH: string
    prenom: string
    nomFamille: string
  }
}

export function InvitationsReceived({ userData }: InvitationsReceivedProps) {
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [notifications, setNotifications] = useState<InvitationNotification[]>([])
  const [activeTab, setActiveTab] = useState('pending')

  useEffect(() => {
    loadInvitations()
    loadNotifications()
  }, [])

  const loadInvitations = () => {
    const receivedInvitations = InvitationManager.getReceivedInvitations(userData.numeroH)
    setInvitations(receivedInvitations)
  }

  const loadNotifications = () => {
    const userNotifications = InvitationManager.getNotifications(userData.numeroH)
    setNotifications(userNotifications)
  }

  const handleAcceptInvitation = (invitationId: string) => {
    const invitation = InvitationManager.acceptInvitation(invitationId, userData.numeroH)
    if (invitation) {
      loadInvitations()
      loadNotifications()
      alert(`Vous avez accepté l'invitation de ${invitation.fromName}`)
    }
  }

  const handleDeclineInvitation = (invitationId: string) => {
    const invitation = InvitationManager.declineInvitation(invitationId, userData.numeroH)
    if (invitation) {
      loadInvitations()
      loadNotifications()
      alert(`Vous avez refusé l'invitation de ${invitation.fromName}`)
    }
  }

  const markNotificationAsRead = (notificationId: string) => {
    InvitationManager.markNotificationAsRead(notificationId, userData.numeroH)
    loadNotifications()
  }

  const pendingInvitations = invitations.filter(inv => inv.status === 'pending')
  const acceptedInvitations = invitations.filter(inv => inv.status === 'accepted')
  const declinedInvitations = invitations.filter(inv => inv.status === 'declined')
  const unreadNotifications = notifications.filter(notif => !notif.read)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRelationIcon = (relation: string) => {
    switch (relation) {
      case 'parent': return '👨‍👩‍👧‍👦'
      case 'femme': return '👩'
      case 'mari': return '👨'
      case 'fiance': return '💍'
      case 'enfant': return '👶'
      case 'invite': return '👥'
      default: return '👤'
    }
  }

  return (
    <div className="invitations-received">
      <div className="invitations-header">
        <h3>Mes Invitations</h3>
        {unreadNotifications.length > 0 && (
          <div className="notification-badge">
            {unreadNotifications.length} nouvelle{unreadNotifications.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="notifications-section">
          <h4>Notifications récentes</h4>
          <div className="notifications-list">
            {notifications.slice(0, 5).map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => markNotificationAsRead(notification.id)}
              >
                <div className="notification-content">
                  <div className="notification-message">{notification.message}</div>
                  <div className="notification-date">{formatDate(notification.date)}</div>
                </div>
                {!notification.read && <div className="unread-indicator"></div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Onglets */}
      <div className="invitations-tabs">
        <button
          className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          <span className="tab-icon">⏳</span>
          <span className="tab-label">En attente ({pendingInvitations.length})</span>
        </button>
        <button
          className={`tab ${activeTab === 'accepted' ? 'active' : ''}`}
          onClick={() => setActiveTab('accepted')}
        >
          <span className="tab-icon">✅</span>
          <span className="tab-label">Acceptées ({acceptedInvitations.length})</span>
        </button>
        <button
          className={`tab ${activeTab === 'declined' ? 'active' : ''}`}
          onClick={() => setActiveTab('declined')}
        >
          <span className="tab-icon">❌</span>
          <span className="tab-label">Refusées ({declinedInvitations.length})</span>
        </button>
      </div>

      {/* Contenu des onglets */}
      <div className="invitations-content">
        {activeTab === 'pending' && (
          <div className="pending-invitations">
            {pendingInvitations.length === 0 ? (
              <div className="empty-state">
                <p>Aucune invitation en attente</p>
              </div>
            ) : (
              <div className="invitations-list">
                {pendingInvitations.map(invitation => (
                  <div key={invitation.id} className="invitation-card pending">
                    <div className="invitation-header">
                      <div className="invitation-icon">
                        {getRelationIcon(invitation.relation)}
                      </div>
                      <div className="invitation-info">
                        <h4>{invitation.fromName}</h4>
                        <p className="invitation-relation">
                          Vous invite en tant que {invitation.relation}
                        </p>
                        <p className="invitation-date">
                          Reçue le {formatDate(invitation.dateSent)}
                        </p>
                      </div>
                    </div>
                    
                    {invitation.message && (
                      <div className="invitation-message">
                        <strong>Message :</strong> {invitation.message}
                      </div>
                    )}
                    
                    <div className="invitation-actions">
                      <button 
                        className="btn accept-btn"
                        onClick={() => handleAcceptInvitation(invitation.id)}
                      >
                        ✅ Accepter
                      </button>
                      <button 
                        className="btn decline-btn"
                        onClick={() => handleDeclineInvitation(invitation.id)}
                      >
                        ❌ Refuser
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'accepted' && (
          <div className="accepted-invitations">
            {acceptedInvitations.length === 0 ? (
              <div className="empty-state">
                <p>Aucune invitation acceptée</p>
              </div>
            ) : (
              <div className="invitations-list">
                {acceptedInvitations.map(invitation => (
                  <div key={invitation.id} className="invitation-card accepted">
                    <div className="invitation-header">
                      <div className="invitation-icon">
                        {getRelationIcon(invitation.relation)}
                      </div>
                      <div className="invitation-info">
                        <h4>{invitation.fromName}</h4>
                        <p className="invitation-relation">
                          Vous avez accepté l'invitation en tant que {invitation.relation}
                        </p>
                        <p className="invitation-date">
                          Acceptée le {formatDate(invitation.dateResponded || '')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="invitation-status">
                      <span className="status-badge accepted">
                        ✅ Acceptée
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'declined' && (
          <div className="declined-invitations">
            {declinedInvitations.length === 0 ? (
              <div className="empty-state">
                <p>Aucune invitation refusée</p>
              </div>
            ) : (
              <div className="invitations-list">
                {declinedInvitations.map(invitation => (
                  <div key={invitation.id} className="invitation-card declined">
                    <div className="invitation-header">
                      <div className="invitation-icon">
                        {getRelationIcon(invitation.relation)}
                      </div>
                      <div className="invitation-info">
                        <h4>{invitation.fromName}</h4>
                        <p className="invitation-relation">
                          Vous avez refusé l'invitation en tant que {invitation.relation}
                        </p>
                        <p className="invitation-date">
                          Refusée le {formatDate(invitation.dateResponded || '')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="invitation-status">
                      <span className="status-badge declined">
                        ❌ Refusée
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
