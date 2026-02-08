import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  numeroH: string;
  prenom: string;
  nomFamille: string;
  email: string;
  role: string;
  metadata?: {
    photoUrl?: string;
    diplomeUrl?: string;
    niveau?: string;
    telephone?: string;
  };
}

export default function DashboardProfesseur() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem("session_user");
    const token = localStorage.getItem("token");
    
    if (!session || !token) {
      navigate("/login");
      return;
    }

    try {
      const parsed = JSON.parse(session);
      const user = parsed.userData || parsed;
      if (!user || !user.numeroH || user.role !== 'professeur') {
        navigate("/login");
        return;
      }
      setUserData(user);
    } catch (error) {
      console.error('Erreur:', error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('session_user');
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '1.5rem' }}>Chargement...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '1.5rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: '#0f172a',
              marginBottom: '0.5rem'
            }}>
              👨‍🏫 Tableau de bord Professeur
            </h1>
            <p style={{ color: '#475569', fontSize: '1rem' }}>
              Bienvenue, {userData?.prenom} {userData?.nomFamille}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
          >
            Déconnexion
          </button>
        </div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Mes cours */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '1.5rem',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '1rem'
            }}>
              📚 Mes cours
            </h2>
            <p style={{ color: '#475569' }}>
              Gérez vos cours, leçons et exercices
            </p>
            <button
              onClick={() => navigate('/education')}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Voir mes cours
            </button>
          </div>

          {/* Mes apprenants */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '1.5rem',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '1rem'
            }}>
              👥 Mes apprenants
            </h2>
            <p style={{ color: '#475569' }}>
              Suivez la progression de vos élèves
            </p>
          </div>

          {/* Mon profil */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '1.5rem',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '1rem'
            }}>
              ⚙️ Mon profil
            </h2>
            <div style={{ color: '#475569', marginBottom: '0.5rem' }}>
              <strong>Email:</strong> {userData?.email}
            </div>
            {userData?.metadata?.niveau && (
              <div style={{ color: '#475569', marginBottom: '0.5rem' }}>
                <strong>Niveau:</strong> {userData.metadata.niveau}
              </div>
            )}
            {userData?.metadata?.telephone && (
              <div style={{ color: '#475569' }}>
                <strong>Téléphone:</strong> {userData.metadata.telephone}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

