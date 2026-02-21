import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { config } from '../config/api';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ProfesseurIA() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Bonjour ! Je peux vous assister en Français et en Mathématiques. Posez-moi une question.",
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
      // Construire l'historique : paires (question utilisateur, réponse bot) pour le contexte
      const historyPairs: { question: string; reponse: string }[] = [];
      for (let i = 1; i < messages.length - 1; i += 2) {
        if (messages[i]?.isUser && !messages[i + 1]?.isUser) {
          historyPairs.push({
            question: messages[i].text,
            reponse: messages[i + 1].text
          });
        }
      }

      // Backend gère l'IA - URL directe pour éviter les erreurs de proxy
      const iaApiBase = import.meta.env.VITE_IA_API_URL || `${config.API_BASE_URL}/ia`;
      const response = await fetch(`${iaApiBase}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: inputValue.trim(),
          history: historyPairs
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const botMessage: Message = {
            text: data.response,
            isUser: false,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botMessage]);
        } else {
          console.error('[ProfesseurIA] Réponse success=false:', data);
          const errorMessage: Message = {
            text: "Cher(e) élève, il y a eu une erreur. Vérifiez que le backend est démarré (port 5002).",
            isUser: false,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMessage]);
        }
      } else {
        const errText = await response.text();
        console.error('[ProfesseurIA] Erreur HTTP', response.status, errText);
        const errorMessage: Message = {
          text: "Cher(e) élève, le serveur ne répond pas. Vérifiez que le backend (port 5002) est démarré.",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      const errorMessage: Message = {
        text: "Cher(e) élève, impossible de joindre le serveur. Démarrez le backend (npm start dans le dossier backend) puis rafraîchissez la page.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
                <h1 className="text-3xl font-bold text-gray-900">Assistant IA</h1>
                <p className="text-gray-600">Assistance en Français et en Mathématiques</p>
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
                        <span className="font-semibold">Assistant IA</span>
                      </div>
                    )}
                    {message.isUser ? (
                      <div className="whitespace-pre-wrap">{message.text}</div>
                    ) : (
                      <div className="markdown-body prose prose-sm max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ children }) => <h1 className="text-xl font-bold mt-3 mb-1 text-gray-900">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-lg font-bold mt-3 mb-1 text-gray-900">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-base font-bold mt-2 mb-1 text-gray-800">{children}</h3>,
                            strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                            em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
                            p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="text-gray-800">{children}</li>,
                            code: ({ children, className }) => {
                              const isBlock = className?.includes('language-');
                              return isBlock
                                ? <code className="block bg-gray-100 rounded p-2 text-sm font-mono my-2 overflow-x-auto">{children}</code>
                                : <code className="bg-gray-100 rounded px-1 text-sm font-mono text-cyan-700">{children}</code>;
                            },
                            pre: ({ children }) => <pre className="bg-gray-100 rounded p-3 my-2 overflow-x-auto text-sm">{children}</pre>,
                            table: ({ children }) => (
                              <div className="overflow-x-auto my-3">
                                <table className="min-w-full border-collapse border border-gray-300 text-sm">{children}</table>
                              </div>
                            ),
                            thead: ({ children }) => <thead className="bg-cyan-50">{children}</thead>,
                            th: ({ children }) => <th className="border border-gray-300 px-3 py-1 font-semibold text-left text-cyan-800">{children}</th>,
                            td: ({ children }) => <td className="border border-gray-300 px-3 py-1">{children}</td>,
                            tr: ({ children }) => <tr className="even:bg-gray-50">{children}</tr>,
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-4 border-cyan-400 pl-3 my-2 italic text-gray-700 bg-cyan-50 py-1">{children}</blockquote>
                            ),
                            hr: () => <hr className="my-3 border-gray-300" />,
                          }}
                        >
                          {message.text}
                        </ReactMarkdown>
                      </div>
                    )}
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
                      <span className="font-semibold">Assistant IA</span>
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
                  onKeyDown={handleKeyDown}
                  placeholder="Posez votre question (français ou mathématiques)"
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
                Français et Mathématiques.
              </p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4 border-l-4 border-yellow-500">
          <p className="text-gray-800 font-medium">
            <strong>ℹ️</strong> Assistance en Français et en Mathématiques.
          </p>
        </div>
      </div>
    </div>
  );
}

