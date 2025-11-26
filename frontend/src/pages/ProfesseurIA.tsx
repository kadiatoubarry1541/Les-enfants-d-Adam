import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ProfesseurIA() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Bonjour cher(e) élève ! Je suis ravi(e) de te rencontrer. Je suis ici pour t'aider à apprendre et à comprendre. N'hésite pas à me poser toutes tes questions, même celles qui te semblent simples. Il n'y a pas de question bête, seulement des questions qui n'ont pas encore été posées. Que souhaiterais-tu apprendre aujourd'hui ? 📖",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Essayer de se connecter au backend IA SC (port 5000 par défaut)
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue.trim(),
          history: messages.filter(m => !m.isUser).map((m, i) => ({
            question: messages[i * 2]?.text || '',
            reponse: m.text
          }))
        })
      });

      const data = await response.json();

      if (data.success) {
        const botMessage: Message = {
          text: data.response,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const errorMessage: Message = {
          text: "Cher(e) élève, il y a eu une erreur. Peux-tu réessayer ?",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Erreur:', error);
      const errorMessage: Message = {
        text: "Cher(e) élève, il y a un problème de connexion avec le serveur IA. Assurez-vous que le serveur IA SC est démarré (port 5000). En attendant, je peux toujours vous aider avec des réponses basiques !",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-4xl shadow-lg">
                🤖
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Professeur IA</h1>
                <p className="text-gray-600">Votre assistant d'apprentissage intelligent</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/education')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                ← Retour à Éducation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden" style={{ height: 'calc(100vh - 250px)', minHeight: '600px' }}>
          {/* Messages Area */}
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.isUser
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                        : 'bg-white text-gray-900 border-2 border-cyan-200'
                    }`}
                  >
                    {!message.isUser && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🎓</span>
                        <span className="font-semibold">Professeur IA</span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{message.text}</div>
                    <div className={`text-xs mt-2 ${message.isUser ? 'text-cyan-100' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border-2 border-cyan-200 rounded-lg p-4 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🎓</span>
                      <span className="font-semibold">Professeur IA</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-gray-600">Je réfléchis à ta question...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t bg-white p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Posez votre question ici..."
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Envoyer
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                💡 Astuce : Posez vos questions sur n'importe quel sujet - Français, Mathématiques, Sciences, etc.
              </p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4 border-l-4 border-yellow-500">
          <p className="text-gray-800 font-medium">
            <strong>ℹ️ Note :</strong> Pour utiliser le Professeur IA, assurez-vous que le serveur IA SC est démarré. 
            Si le serveur n'est pas disponible, certaines fonctionnalités peuvent être limitées.
          </p>
        </div>
      </div>
    </div>
  );
}

