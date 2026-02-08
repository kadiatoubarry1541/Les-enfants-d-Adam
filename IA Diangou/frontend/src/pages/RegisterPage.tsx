import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  inputStyle,
  inputFocusStyle,
  inputBlurStyle,
  labelStyle,
  buttonStyle,
  getButtonHoverStyle,
  getButtonLeaveStyle
} from '../utils/formStyles';

type UserType = 'professeur' | 'parent' | 'apprenant' | null;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>(null);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #8b5cf6 100%)',
      padding: '3rem 1rem'
    }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '1.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: '500',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'}
          >
            <span>←</span> Retour à l'accueil
          </button>
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
            fontSize: '3rem',
            fontWeight: '800',
            color: 'white',
            marginBottom: '0.75rem',
            letterSpacing: '-0.025em'
          }}>
            Créer un compte
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '1.125rem',
            fontWeight: '500'
          }}>
            Choisissez votre profil pour commencer
          </p>
        </div>

        {!userType ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem'
          }}>
            <button
              onClick={() => setUserType('professeur')}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '0.9rem',
                boxShadow: '0 16px 22px -10px rgba(0, 0, 0, 0.12)',
                padding: '1.4rem',
                border: '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                e.currentTarget.style.borderColor = '#4f46e5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '3.3rem',
                height: '3.3rem',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                borderRadius: '0.75rem',
                marginBottom: '0.85rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}>
                <span style={{ fontSize: '1.8rem' }}>👨‍🏫</span>
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#0f172a',
                marginBottom: '0.75rem'
              }}>
                Je suis Professeur
              </h3>
              <p style={{
                color: '#475569',
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
                Donnez des cours, gérez les apprenants, publiez des leçons
              </p>
            </button>

            <button
              onClick={() => setUserType('parent')}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '0.9rem',
                boxShadow: '0 16px 22px -10px rgba(0, 0, 0, 0.12)',
                padding: '1.4rem',
                border: '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                e.currentTarget.style.borderColor = '#10b981';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '3.3rem',
                height: '3.3rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '0.75rem',
                marginBottom: '0.85rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}>
                <span style={{ fontSize: '1.8rem' }}>👨‍👩‍👧</span>
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#0f172a',
                marginBottom: '0.75rem'
              }}>
                Je suis Parent
              </h3>
              <p style={{
                color: '#475569',
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
                Suivez la progression de votre enfant, communiquez avec les professeurs
              </p>
            </button>

            <button
              onClick={() => setUserType('apprenant')}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '0.9rem',
                boxShadow: '0 16px 22px -10px rgba(0, 0, 0, 0.12)',
                padding: '1.4rem',
                border: '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                e.currentTarget.style.borderColor = '#a855f7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '3.3rem',
                height: '3.3rem',
                background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                borderRadius: '0.75rem',
                marginBottom: '0.85rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}>
                <span style={{ fontSize: '1.8rem' }}>🎓</span>
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#0f172a',
                marginBottom: '0.75rem'
              }}>
                Je suis Apprenant
              </h3>
              <p style={{
                color: '#475569',
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
                Apprenez, suivez les cours et faites des exercices
              </p>
            </button>
          </div>
        ) : (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '1.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            padding: '2.5rem',
            maxWidth: '42rem',
            margin: '0 auto',
            border: '1px solid rgba(148, 163, 184, 0.3)'
          }}>
            <button
              onClick={() => setUserType(null)}
              style={{
                color: '#475569',
                marginBottom: '1.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '600',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#0f172a'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#475569'}
            >
              <span>←</span> Retour au choix
            </button>

            {userType === 'professeur' && <ProfesseurForm />}
            {userType === 'parent' && <ParentForm />}
            {userType === 'apprenant' && <ApprenantForm />}
          </div>
        )}
      </div>
    </div>
  );
}

// Formulaire Professeur
function ProfesseurForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nomComplet: '',
    email: '',
    password: '',
    matiere: '',
    niveau: '',
    telephone: '',
    diplome: null as File | null,
    photo: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nomComplet || !formData.email || !formData.password || !formData.matiere || !formData.niveau) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!formData.diplome) {
      toast.error('Le diplôme est obligatoire pour les professeurs');
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nomComplet', formData.nomComplet);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('matiere', formData.matiere);
      formDataToSend.append('niveau', formData.niveau);
      if (formData.telephone) {
        formDataToSend.append('telephone', formData.telephone);
      }
      if (formData.diplome) {
        formDataToSend.append('diplome', formData.diplome);
      }
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      const response = await fetch('/api/education/register/professeur', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('session_user', JSON.stringify({ userData: data.user }));
        localStorage.setItem('token', data.token);
        toast.success('Inscription réussie !');
        navigate('/education');
      } else {
        toast.error(data.message || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '3rem',
          height: '3rem',
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <span style={{ fontSize: '1.5rem' }}>👨‍🏫</span>
        </div>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '800',
          color: '#0f172a'
        }}>Inscription Professeur</h2>
      </div>
      
      <div>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: '600',
          color: '#334155',
          marginBottom: '0.5rem'
        }}>
          Nom complet *
        </label>
        <input
          type="text"
          value={formData.nomComplet}
          onChange={(e) => setFormData({ ...formData, nomComplet: e.target.value })}
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
          required
        />
      </div>

      <div>
        <label style={labelStyle}>
          Email *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputBlurStyle)}
          required
        />
      </div>

      <div>
        <label style={labelStyle}>
          Mot de passe *
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputBlurStyle)}
          required
        />
      </div>

      <div>
        <label style={labelStyle}>
          Matière enseignée *
        </label>
        <input
          type="text"
          value={formData.matiere}
          onChange={(e) => setFormData({ ...formData, matiere: e.target.value })}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputBlurStyle)}
          placeholder="Ex: Mathématiques, Français, Sciences..."
          required
        />
      </div>

      <div>
        <label style={labelStyle}>
          Niveau *
        </label>
        <select
          value={formData.niveau}
          onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputBlurStyle)}
          required
        >
          <option value="">Sélectionnez un niveau</option>
          <option value="primaire">Primaire</option>
          <option value="college">Collège</option>
          <option value="lycee">Lycée</option>
          <option value="superieur">Supérieur</option>
        </select>
      </div>

      <div>
        <label style={labelStyle}>
          Numéro de téléphone (optionnel)
        </label>
        <input
          type="tel"
          value={formData.telephone}
          onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputBlurStyle)}
        />
      </div>

      <div>
        <label style={labelStyle}>
          Diplôme (PDF ou image) *
        </label>
        <input
          type="file"
          accept=".pdf,image/*"
          onChange={(e) => setFormData({ ...formData, diplome: e.target.files?.[0] || null })}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputBlurStyle)}
          required
        />
      </div>

      <div>
        <label style={labelStyle}>
          Photo de profil (optionnel)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFormData({ ...formData, photo: e.target.files?.[0] || null })}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputBlurStyle)}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={buttonStyle('linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', loading)}
        onMouseEnter={(e) => !loading && Object.assign(e.currentTarget.style, getButtonHoverStyle('#4f46e5'))}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, getButtonLeaveStyle())}
      >
        {loading ? 'Inscription...' : 'S\'inscrire'}
      </button>
    </form>
  );
}

// Formulaire Parent
function ParentForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nomComplet: '',
    email: '',
    password: '',
    nomEnfant: '',
    ageEnfant: '',
    telephone: '',
    photo: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nomComplet || !formData.email || !formData.password || !formData.nomEnfant || !formData.ageEnfant || !formData.telephone) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nomComplet', formData.nomComplet);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('nomEnfant', formData.nomEnfant);
      formDataToSend.append('ageEnfant', formData.ageEnfant);
      formDataToSend.append('telephone', formData.telephone);
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      const response = await fetch('/api/education/register/parent', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('session_user', JSON.stringify({ userData: data.user }));
        localStorage.setItem('token', data.token);
        toast.success('Inscription réussie !');
        navigate('/education');
      } else {
        toast.error(data.message || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '3rem',
          height: '3rem',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <span style={{ fontSize: '1.5rem' }}>👨‍👩‍👧</span>
        </div>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '800',
          color: '#0f172a'
        }}>Inscription Parent</h2>
      </div>
      
      <div>
        <label style={labelStyle}>
          Nom complet *
        </label>
        <input
          type="text"
          value={formData.nomComplet}
          onChange={(e) => setFormData({ ...formData, nomComplet: e.target.value })}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputBlurStyle)}
          required
        />
      </div>

      <div>
        <label style={labelStyle}>
          Email *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputBlurStyle)}
          required
        />
      </div>

      <div>
        <label style={labelStyle}>
          Mot de passe *
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputBlurStyle)}
          required
        />
      </div>

      <div>
        <label style={labelStyle}>
          Nom de l'enfant *
        </label>
        <input
          type="text"
          value={formData.nomEnfant}
          onChange={(e) => setFormData({ ...formData, nomEnfant: e.target.value })}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputBlurStyle)}
          required
        />
      </div>

      <div>
        <label style={labelStyle}>
          Âge de l'enfant *
        </label>
        <input
          type="number"
          min="1"
          max="18"
          value={formData.ageEnfant}
          onChange={(e) => setFormData({ ...formData, ageEnfant: e.target.value })}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputBlurStyle)}
          required
        />
      </div>

      <div>
        <label style={labelStyle}>
          Numéro de téléphone *
        </label>
        <input
          type="tel"
          value={formData.telephone}
          onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputBlurStyle)}
          required
        />
      </div>

      <div>
        <label style={labelStyle}>
          Photo de profil (optionnel)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFormData({ ...formData, photo: e.target.files?.[0] || null })}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputBlurStyle)}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={buttonStyle('linear-gradient(135deg, #10b981 0%, #059669 100%)', loading)}
        onMouseEnter={(e) => !loading && Object.assign(e.currentTarget.style, getButtonHoverStyle('#059669'))}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, getButtonLeaveStyle())}
      >
        {loading ? 'Inscription...' : 'S\'inscrire'}
      </button>
    </form>
  );
}

// Formulaire Apprenant
function ApprenantForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nomComplet: '',
    email: '',
    password: '',
    age: '',
    niveauScolaire: '',
    matierePreferee: '',
    nomParent: '',
    telephone: '',
    photo: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nomComplet || !formData.email || !formData.password || !formData.age || !formData.niveauScolaire || !formData.nomParent || !formData.telephone) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nomComplet', formData.nomComplet);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('age', formData.age);
      formDataToSend.append('niveauScolaire', formData.niveauScolaire);
      if (formData.matierePreferee) {
        formDataToSend.append('matierePreferee', formData.matierePreferee);
      }
      formDataToSend.append('nomParent', formData.nomParent);
      formDataToSend.append('telephone', formData.telephone);
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      const response = await fetch('/api/education/register/apprenant', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('session_user', JSON.stringify({ userData: data.user }));
        localStorage.setItem('token', data.token);
        toast.success('Inscription réussie !');
        navigate('/education');
      } else {
        toast.error(data.message || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '3rem',
          height: '3rem',
          background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <span style={{ fontSize: '1.5rem' }}>🎓</span>
        </div>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '800',
          color: '#0f172a'
        }}>Inscription Apprenant</h2>
      </div>
      
      <div>
        <label style={labelStyle}>
          Nom complet *
        </label>
        <input
          type="text"
          value={formData.nomComplet}
          onChange={(e) => setFormData({ ...formData, nomComplet: e.target.value })}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputBlurStyle)}
          required
        />
      </div>

      <div>
        <label style={labelStyle}>
          Email *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputBlurStyle)}
          required
        />
      </div>

      <div>
        <label style={labelStyle}>
          Mot de passe *
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputBlurStyle)}
          required
        />
      </div>

      <div>
        <label style={labelStyle}>
          Âge *
        </label>
        <input
          type="number"
          min="5"
          max="25"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputBlurStyle)}
          required
        />
      </div>

      <div>
        <label style={labelStyle}>
          Niveau scolaire *
        </label>
        <select
          value={formData.niveauScolaire}
          onChange={(e) => setFormData({ ...formData, niveauScolaire: e.target.value })}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputBlurStyle)}
          required
        >
          <option value="">Sélectionnez un niveau</option>
          <option value="primaire">Primaire</option>
          <option value="college">Collège</option>
          <option value="lycee">Lycée</option>
          <option value="superieur">Supérieur</option>
        </select>
      </div>

      <div>
        <label style={labelStyle}>
          Matière préférée (optionnel)
        </label>
        <input
          type="text"
          value={formData.matierePreferee}
          onChange={(e) => setFormData({ ...formData, matierePreferee: e.target.value })}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputBlurStyle)}
          placeholder="Ex: Mathématiques, Français..."
        />
      </div>

      <div>
        <label style={labelStyle}>
          Nom du parent *
        </label>
        <input
          type="text"
          value={formData.nomParent}
          onChange={(e) => setFormData({ ...formData, nomParent: e.target.value })}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputBlurStyle)}
          required
        />
      </div>

      <div>
        <label style={labelStyle}>
          Numéro de téléphone *
        </label>
        <input
          type="tel"
          value={formData.telephone}
          onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputBlurStyle)}
          required
        />
      </div>

      <div>
        <label style={labelStyle}>
          Photo de profil (optionnel)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFormData({ ...formData, photo: e.target.files?.[0] || null })}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.currentTarget.style, inputBlurStyle)}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={buttonStyle('linear-gradient(135deg, #a855f7 0%, #9333ea 100%)', loading)}
        onMouseEnter={(e) => !loading && Object.assign(e.currentTarget.style, getButtonHoverStyle('#9333ea'))}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, getButtonLeaveStyle())}
      >
        {loading ? 'Inscription...' : 'S\'inscrire'}
      </button>
    </form>
  );
}

