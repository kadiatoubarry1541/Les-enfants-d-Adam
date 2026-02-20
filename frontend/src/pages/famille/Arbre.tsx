import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArbreGenealogique } from '../../components/ArbreGenealogique'
import { buildFamilyTree, getCercleDesRacinesCounts } from '../../services/FamilyTreeBuilder'
import { useI18n } from '../../i18n/useI18n'

interface UserData {
  numeroH: string
  prenom: string
  nomFamille: string
  genre: 'HOMME' | 'FEMME' | 'AUTRE'
  [key: string]: any
}

interface FamilyMessage {
  id: string
  numeroH: string
  authorName?: string
  content: string
  messageType?: 'text' | 'image' | 'video' | 'audio'
  mediaUrl?: string | null
  created_at?: string
  createdAt?: string
  familyName?: string
}

export default function Arbre() {
  const [user, setUser] = useState<UserData | null>(null)
  const [activeTab, setActiveTab] = useState<'arbre' | 'echanges'>('arbre')
  const { t } = useI18n()

  // Messagerie familiale (style WhatsApp)
  const [familyMessages, setFamilyMessages] = useState<FamilyMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const sessionData = JSON.parse(localStorage.getItem('session_user') || '{}')
    const u = sessionData.userData || sessionData
    if (u?.numeroH) setUser(u)
  }, [])

  useEffect(() => {
    if (activeTab === 'echanges') {
      loadFamilyMessages()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const effectiveUser: UserData = user || {
    numeroH: '',
    prenom: 'Invité',
    nomFamille: '',
    genre: 'HOMME'
  }

  const familyMembers = useMemo(() => buildFamilyTree(effectiveUser), [effectiveUser])
  const cercleCounts = useMemo(
    () => getCercleDesRacinesCounts(effectiveUser, familyMembers),
    [effectiveUser, familyMembers]
  )

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const loadFamilyMessages = async () => {
    try {
      setLoadingMessages(true)
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5002/api/family-tree/messages', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // On affiche du plus ancien au plus récent
        const messages: FamilyMessage[] = (data.messages || []).slice().reverse()
        setFamilyMessages(messages)
        setTimeout(scrollToBottom, 150)
      } else {
        console.error('Erreur chargement messages familiaux:', data.message || data.error)
      }
    } catch (error) {
      console.error('Erreur chargement messages familiaux:', error)
    } finally {
      setLoadingMessages(false)
    }
  }

  const sendFamilyMessage = async () => {
    if (!newMessage.trim() || isSending) return

    try {
      setIsSending(true)
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5002/api/family-tree/messages', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: newMessage.trim(),
          messageType: 'text'
        })
      })

      const data = await response.json()

      if (response.ok && data.success && data.message) {
        setFamilyMessages((prev) => [...prev, data.message])
        setNewMessage('')
        setTimeout(scrollToBottom, 100)
      } else {
        alert(data.message || 'Erreur lors de l\'envoi du message')
      }
    } catch (error: any) {
      console.error('Erreur envoi message familial:', error)
      alert(error?.message || 'Erreur lors de l\'envoi du message')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/famille/moi"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors shadow-sm border border-gray-200 dark:border-gray-600"
        >
          <span aria-hidden>←</span>
          Retour à Moi
        </Link>
      </div>
      <div className="card">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('arbre')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              activeTab === 'arbre'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🌳 Mon arbre
          </button>
          <button
            onClick={() => setActiveTab('echanges')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              activeTab === 'echanges'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            💬 Échanges familiaux
          </button>
        </div>

        {activeTab === 'arbre' && (
          <>
            <h2 className="text-2xl font-bold mb-4">🌳 Mon arbre généalogique</h2>
            <ArbreGenealogique userData={effectiveUser} />

            <section className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
              <h3 className="text-xl font-bold mb-4">{t('wiz.live.title4')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Effectifs calculés automatiquement à partir de votre arbre familial.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('label.brothers_mother')}
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-center font-medium">
                    {cercleCounts.nbFreresMere}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('label.sisters_mother')}
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-center font-medium">
                    {cercleCounts.nbSoeursMere}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('label.brothers_father')}
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-center font-medium">
                    {cercleCounts.nbFreresPere}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('label.sisters_father')}
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-center font-medium">
                    {cercleCounts.nbSoeursPere}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('label.aunts_maternal')}
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-center font-medium">
                    {cercleCounts.nbTantesMaternelles}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('label.aunts_paternal')}
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-center font-medium">
                    {cercleCounts.nbTantesPaternelles}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('label.uncles_maternal')}
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-center font-medium">
                    {cercleCounts.nbOnclesMaternels}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('label.uncles_paternal')}
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-center font-medium">
                    {cercleCounts.nbOnclesPaternels}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('label.cousins_male')}
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-center font-medium">
                    {cercleCounts.nbCousins}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('label.cousins_female')}
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-center font-medium">
                    {cercleCounts.nbCousines}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('label.daughters')}
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-center font-medium">
                    {cercleCounts.nbFilles}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('label.sons')}
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-center font-medium">
                    {cercleCounts.nbGarcons}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'echanges' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-2xl font-bold">💬 Échanges familiaux</h2>
              <p className="text-gray-600">
                Communiquez avec tous les membres de la famille{' '}
                <span className="font-semibold">
                  {effectiveUser.nomFamille ? `« ${effectiveUser.nomFamille} »` : ''}
                </span>{' '}
                comme dans une discussion WhatsApp de groupe.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-900 space-y-2">
                <p className="font-semibold">Conseils d&apos;utilisation</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Les messages sont visibles par tous les membres de la même famille.</li>
                  <li>Utilisez ce canal pour les annonces importantes, les nouvelles et les prières.</li>
                  <li>Restez respectueux et bienveillant dans vos échanges.</li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-[480px] bg-white">
                {/* Header style WhatsApp */}
                <div className="bg-green-600 text-white px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-xl">
                      👨‍👩‍👧‍👦
                    </div>
                    <div>
                      <p className="font-semibold">
                        Famille {effectiveUser.nomFamille || 'ADAM'}
                      </p>
                      <p className="text-xs text-green-100">Espace privé entre membres de la famille</p>
                    </div>
                  </div>
                </div>

                {/* Zone de messages */}
                <div className="flex-1 bg-gray-100 px-3 py-3 overflow-y-auto">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <div className="h-8 w-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm">Chargement des messages...</span>
                      </div>
                    </div>
                  ) : familyMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-gray-500 text-sm space-y-2">
                        <p>Aucun message pour le moment.</p>
                        <p>Soyez le premier à écrire à votre famille.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {familyMessages.map((msg) => {
                        const isMe = msg.numeroH === effectiveUser.numeroH
                        const createdAt =
                          msg.createdAt || msg.created_at || new Date().toISOString()

                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs sm:max-w-md px-3 py-2 rounded-2xl shadow-sm ${
                                isMe
                                  ? 'bg-green-500 text-white rounded-br-sm'
                                  : 'bg-white text-gray-900 rounded-bl-sm'
                              }`}
                            >
                              {!isMe && (
                                <p className="text-xs font-semibold mb-0.5 opacity-80">
                                  {msg.authorName || 'Membre de la famille'}
                                </p>
                              )}
                              {(msg.messageType === 'text' || !msg.messageType) && (
                                <p className="text-sm whitespace-pre-line">{msg.content}</p>
                              )}
                              {msg.mediaUrl && msg.messageType === 'image' && (
                                <img
                                  src={msg.mediaUrl}
                                  alt="Pièce jointe"
                                  className="mt-1 rounded-lg max-h-60 object-cover"
                                />
                              )}
                              {msg.mediaUrl && msg.messageType === 'video' && (
                                <video
                                  src={msg.mediaUrl}
                                  controls
                                  className="mt-1 rounded-lg max-h-60 w-full"
                                />
                              )}
                              {msg.mediaUrl && msg.messageType === 'audio' && (
                                <audio
                                  src={msg.mediaUrl}
                                  controls
                                  className="mt-1 w-full"
                                />
                              )}
                              <p
                                className={`text-[10px] mt-1 ${
                                  isMe ? 'text-green-100' : 'text-gray-500'
                                }`}
                              >
                                {new Date(createdAt).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Zone de saisie */}
                <div className="border-t border-gray-200 bg-gray-50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xl text-gray-500 hover:bg-gray-100"
                      title="Pièce jointe (bientôt disponible)"
                    >
                      📎
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          sendFamilyMessage()
                        }
                      }}
                      placeholder="Écrivez un message familial..."
                      className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm"
                    />
                    <button
                      type="button"
                      onClick={sendFamilyMessage}
                      disabled={!newMessage.trim() || isSending}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg transition-colors ${
                        !newMessage.trim() || isSending
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      ➤
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
