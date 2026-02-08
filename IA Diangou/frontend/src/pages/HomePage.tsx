import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #8b5cf6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '1.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '3rem',
        maxWidth: '32rem',
        width: '100%',
        border: '1px solid rgba(148, 163, 184, 0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '5rem',
            height: '5rem',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            borderRadius: '1rem',
            marginBottom: '1.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}>
            <span style={{ fontSize: '2.5rem' }}>🎓</span>
          </div>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '0.75rem',
            letterSpacing: '-0.025em'
          }}>
            IA Diangou
          </h1>
          <p style={{
            fontSize: '1.5rem',
            color: '#475569',
            fontWeight: '500',
            marginBottom: '0.5rem'
          }}>
            Plateforme Éducative pour Tous
          </p>
          <p style={{
            fontSize: '1rem',
            color: '#64748b'
          }}>
            Apprenez, Enseignez, Grandissez
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => navigate('/register')}
            style={{
              width: '100%',
              backgroundColor: '#1e293b',
              color: 'white',
              fontWeight: '600',
              padding: '1rem 1.5rem',
              borderRadius: '0.75rem',
              border: '1px solid #334155',
              fontSize: '1.125rem',
              cursor: 'pointer',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0f172a';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1e293b';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.3)';
            }}
          >
            S'inscrire
          </button>

          <button
            onClick={() => navigate('/login')}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: 'white',
              fontWeight: '600',
              padding: '1rem 1.5rem',
              borderRadius: '0.75rem',
              border: 'none',
              fontSize: '1.125rem',
              cursor: 'pointer',
              boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(79, 70, 229, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(79, 70, 229, 0.3)';
            }}
          >
            Se connecter
          </button>
        </div>

        <div style={{
          paddingTop: '1.5rem',
          borderTop: '1px solid #e2e8f0'
        }}>
          <p style={{
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#64748b',
            fontWeight: '500'
          }}>
            Rejoignez notre communauté éducative
          </p>
        </div>
      </div>
    </div>
  );
}

