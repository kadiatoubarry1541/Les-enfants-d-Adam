import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import Education from './pages/Education';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/education" element={<Education />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}

// Page de connexion
function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      console.log('🔄 Tentative de connexion avec:', email);
      
      const response = await fetch('/api/education/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 Réponse du serveur - Status:', response.status);
      
      const data = await response.json();
      console.log('📦 Données reçues:', { success: data.success, hasToken: !!data.token, hasUser: !!data.user });

      if (response.ok && data.success) {
        // Vérifier que le token est présent
        if (!data.token) {
          toast.error('Erreur: Token manquant dans la réponse');
          console.error('Réponse du serveur:', data);
          return;
        }

        // Sauvegarder les données de session
        localStorage.setItem('session_user', JSON.stringify({ userData: data.user }));
        localStorage.setItem('token', data.token);
        
        // Vérifier que le token est bien sauvegardé
        const savedToken = localStorage.getItem('token');
        if (!savedToken) {
          toast.error('Erreur: Impossible de sauvegarder le token');
          return;
        }
        
        console.log('✅ Token sauvegardé avec succès');
        toast.success('Connexion réussie !');
        navigate('/education');
      } else {
        const errorMessage = data.message || 'Erreur de connexion';
        toast.error(errorMessage);
        console.error('❌ Erreur de connexion:', {
          status: response.status,
          data: data,
          error: data.error || data.details
        });
        
        // Si c'est une erreur de base de données, afficher un message plus clair
        if (response.status === 503 || data.message?.includes('base de données')) {
          toast.error('La base de données n\'est pas connectée. Contactez l\'administrateur.');
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors de la connexion:', error);
      toast.error('Erreur de connexion au serveur. Vérifiez que le serveur backend est démarré.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #8b5cf6 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '1.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '2.5rem',
        maxWidth: '28rem',
        width: '100%',
        border: '1px solid rgba(148, 163, 184, 0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '4rem',
            height: '4rem',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            borderRadius: '0.75rem',
            marginBottom: '1rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}>
            <span style={{ fontSize: '2rem' }}>🎓</span>
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '0.5rem',
            letterSpacing: '-0.025em'
          }}>
            IA Diangou
          </h1>
          <p style={{
            color: '#475569',
            fontWeight: '500'
          }}>
            Plateforme Éducative
          </p>
        </div>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label htmlFor="email" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#334155',
              marginBottom: '0.5rem'
            }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #cbd5e1',
                borderRadius: '0.75rem',
                backgroundColor: '#f8fafc',
                fontSize: '1rem',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#4f46e5';
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.boxShadow = 'none';
              }}
              placeholder="votre@email.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#334155',
              marginBottom: '0.5rem'
            }}>
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #cbd5e1',
                borderRadius: '0.75rem',
                backgroundColor: '#f8fafc',
                fontSize: '1rem',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#4f46e5';
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.boxShadow = 'none';
              }}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)' : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: 'white',
              fontWeight: '600',
              padding: '0.875rem 1rem',
              borderRadius: '0.75rem',
              border: 'none',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(79, 70, 229, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(79, 70, 229, 0.3)';
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                fontSize: '0.875rem',
                color: '#475569',
                fontWeight: '500',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#0f172a'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#475569'}
            >
              ← Retour à l'accueil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;

