import { useState } from 'react'

interface Reaction {
  id: string
  type: 'like' | 'cry' | 'comment'
  memberName: string
  memberNumeroH: string
  content?: string
  date: string
}

interface MediaReactionsProps {
  mediaId: string
  reactions: Reaction[]
  onAddReaction: (type: 'like' | 'cry' | 'comment', content?: string) => void
}

export function MediaReactions({ reactions, onAddReaction }: MediaReactionsProps) {
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [memberSession] = useState(() => {
    const session = localStorage.getItem('member_session')
    return session ? JSON.parse(session) : null
  })

  const likeCount = reactions.filter(r => r.type === 'like').length
  const cryCount = reactions.filter(r => r.type === 'cry').length
  const comments = reactions.filter(r => r.type === 'comment')

  const handleLike = () => {
    if (memberSession) {
      onAddReaction('like')
    }
  }

  const handleCry = () => {
    if (memberSession) {
      onAddReaction('cry')
    }
  }

  const handleComment = () => {
    if (commentText.trim() && memberSession) {
      onAddReaction('comment', commentText.trim())
      setCommentText('')
      setShowCommentForm(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="mt-5 p-5 bg-gray-50 rounded-xl">
      {/* Boutons de réaction */}
      <div className="flex gap-4 mb-5 flex-wrap">
        <button 
          className={`flex items-center gap-2 px-4 py-3 border-2 rounded-full cursor-pointer transition-all duration-300 text-sm font-medium ${
            likeCount > 0 
              ? 'border-red-500 bg-red-500 text-white shadow-lg transform -translate-y-1' 
              : 'border-gray-200 bg-white hover:border-red-300 hover:shadow-md'
          } ${!memberSession ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleLike}
          disabled={!memberSession}
        >
          <span className="text-lg">❤️</span>
          <span className="font-bold">{likeCount}</span>
        </button>
        
        <button 
          className={`flex items-center gap-2 px-4 py-3 border-2 rounded-full cursor-pointer transition-all duration-300 text-sm font-medium ${
            cryCount > 0 
              ? 'border-blue-500 bg-blue-500 text-white shadow-lg transform -translate-y-1' 
              : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
          } ${!memberSession ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleCry}
          disabled={!memberSession}
        >
          <span className="text-lg">😢</span>
          <span className="font-bold">{cryCount}</span>
        </button>
        
        <button 
          className={`flex items-center gap-2 px-4 py-3 border-2 rounded-full cursor-pointer transition-all duration-300 text-sm font-medium border-gray-200 bg-white hover:border-orange-300 hover:shadow-md ${
            !memberSession ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={() => setShowCommentForm(!showCommentForm)}
          disabled={!memberSession}
        >
          <span className="text-lg">💬</span>
          <span className="font-bold">{comments.length}</span>
        </button>
      </div>

      {/* Formulaire de commentaire */}
      {showCommentForm && memberSession && (
        <div className="bg-white p-5 rounded-xl mb-5 border border-gray-200">
          <div className="grid gap-4">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Laissez un commentaire..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-base resize-y min-h-20 font-inherit transition-colors duration-300 focus:outline-none focus:border-indigo-500"
              rows={3}
            />
            <div className="flex gap-3 justify-end">
              <button 
                className="bg-indigo-500 text-white border-none px-5 py-3 rounded-full cursor-pointer font-medium transition-all duration-300 hover:bg-indigo-600 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleComment}
                disabled={!commentText.trim()}
              >
                Publier
              </button>
              <button 
                className="bg-sky-600 text-white border-none px-5 py-3 rounded-full cursor-pointer font-medium transition-all duration-300 hover:bg-sky-700 hover:-translate-y-0.5"
                onClick={() => {
                  setShowCommentForm(false)
                  setCommentText('')
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des commentaires */}
      {comments.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h4 className="m-0 mb-5 text-gray-800 text-lg border-b-2 border-gray-200 pb-3">
            Commentaires ({comments.length})
          </h4>
          {comments.map(comment => (
            <div key={comment.id} className="py-4 border-b border-gray-100 last:border-b-0">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800 text-sm">{comment.memberName}</span>
                  <span className="text-indigo-500 font-mono text-xs">({comment.memberNumeroH})</span>
                </div>
                <span className="text-gray-500 text-xs">{formatDate(comment.date)}</span>
              </div>
              <div className="text-gray-600 leading-relaxed text-sm">
                {comment.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message pour les non-membres */}
      {!memberSession && (
        <div className="text-center p-8 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <p className="m-0 mb-5 text-gray-600 text-base">
            Connectez-vous en tant que membre pour réagir et commenter
          </p>
          <a 
            href="/login-membre" 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white no-underline px-6 py-3 rounded-full font-medium transition-all duration-300 inline-block hover:-translate-y-0.5 hover:shadow-lg"
          >
            Se connecter
          </a>
        </div>
      )}
    </div>
  )
}
