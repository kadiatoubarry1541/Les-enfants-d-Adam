import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header>
      <h1>📚 IA Professeur</h1>
      <p className="subtitle">
        Votre professeur virtuel : clair, patient et attentionné. 
        Posez vos questions, j'enseigne avec excellence.
      </p>
    </header>
  );
};

export default Header;

