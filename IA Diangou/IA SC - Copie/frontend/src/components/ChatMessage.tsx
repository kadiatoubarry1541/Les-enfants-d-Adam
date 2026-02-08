import React from 'react';
import { Message } from '../App';
import './ChatMessage.css';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}>
      <div className="message-content">
        <strong>{message.isUser ? 'Vous' : 'Professeur'} :</strong>
        <p>{message.text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;

