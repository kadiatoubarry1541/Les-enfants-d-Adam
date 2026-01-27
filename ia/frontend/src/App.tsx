import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import Header from './components/Header';
import Footer from './components/Footer';

export interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ConversationHistory {
  question: string;
  reponse: string;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Bonjour cher(e) élève ! Je suis ravi(e) de te rencontrer. Je suis ici pour t'aider à apprendre et à comprendre. N'hésite pas à me poser toutes tes questions, même celles qui te semblent simples. Il n'y a pas de question bête, seulement des questions qui n'ont pas encore été posées. Que souhaiterais-tu apprendre aujourd'hui ? 📖",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text.trim(),
          history: conversationHistory
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
        setConversationHistory(prev => [
          ...prev,
          {
            question: text.trim(),
            reponse: data.response
          }
        ]);
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
        text: "Cher(e) élève, il y a un problème de connexion. Vérifie que le serveur fonctionne !",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <Header />
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {isLoading && (
              <div className="message bot-message">
                <div className="message-content">
                  <strong>Professeur :</strong>
                  <p>💭 Je réfléchis à ta question, cher(e) élève...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default App;

