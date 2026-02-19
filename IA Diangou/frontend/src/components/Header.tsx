import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface HeaderProps {
  userData: any;
  onLogout?: () => void;
}

export function Header({ userData, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('session_user');
    localStorage.removeItem('token');
    toast.success('Déconnecté avec succès');
    navigate('/login');
    if (onLogout) onLogout();
  };

  // Récupérer la photo de profil depuis userData
  const photoUrl = userData?.metadata?.photoUrl || userData?.photoUrl || null;
  
  // Si pas de photo, utiliser la première lettre du prénom
  const initials = userData?.prenom?.charAt(0)?.toUpperCase() || 'U';
  const fullName = `${userData?.prenom || ''} ${userData?.nomFamille || ''}`.trim();

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="text-3xl">🎓</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">IA Diangou</h1>
              <p className="text-xs text-gray-500">Plateforme Éducative</p>
            </div>
          </div>

          {/* Profile Section - RIGHT SIDE */}
          <div className="flex items-center space-x-4">
            {/* Welcome message */}
            {userData && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">Salut {userData?.prenom}</p>
                  <p className="text-xs text-gray-500">{new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>

                {/* Avatar Circle - Enhanced */}
                <div className="relative group">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="h-16 w-16 rounded-full flex items-center justify-center overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-teal-500"
                    style={{
                      background: photoUrl ? 'transparent' : 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                    }}
                  >
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={fullName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Si l'image ne charge pas, afficher les initiales
                          e.currentTarget.style.display = 'none';
                          const sibling = e.currentTarget.nextElementSibling;
                          if (sibling) {
                            (sibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    {!photoUrl && (
                      <span
                        className="text-2xl font-bold text-white flex items-center justify-center w-full h-full"
                        style={{
                          background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                        }}
                      >
                        {initials}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">{fullName}</p>
                        <p className="text-xs text-gray-500">{userData?.email}</p>
                        <p className="text-xs text-gray-400 mt-1">Rôle: {userData?.role}</p>
                      </div>

                      <button
                        onClick={() => navigate('/education')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        📚 Éducation
                      </button>

                      <button
                        onClick={() => navigate('/moi')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        ⚙️ Mon Profil
                      </button>

                      <div className="border-t border-gray-200 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                        >
                          🚪 Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
