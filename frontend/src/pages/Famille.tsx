import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  numeroH: string;
  prenom: string;
  nomFamille: string;
  [key: string]: any;
}

interface FamilyMember {
  id: string;
  numeroH: string;
  prenom: string;
  nomFamille: string;
  relation: string;
  phone?: string;
  email?: string;
  address?: string;
  birthDate?: string;
  isActive: boolean;
  createdAt: string;
  profilePicture?: string;
  occupation?: string;
  maritalStatus?: string;
  children?: number;
}

interface FamilyTree {
  id: string;
  rootMember: string;
  members: FamilyMember[];
  isActive: boolean;
  createdAt: string;
}

interface FamilyMessage {
  id: string;
  author: string;
  authorName: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio';
  mediaUrl?: string;
  createdAt: string;
}

interface OrangeMoneyAccount {
  id: string;
  numeroH: string;
  phoneNumber: string;
  balance: number;
  currency: string;
  isActive: boolean;
  lastTransaction?: string;
}

interface FamilyTreeConfirmation {
  id: string;
  childNumeroH: string;
  parentNumeroH: string;
  parentType: 'pere' | 'mere';
  status: 'pending' | 'confirmed' | 'rejected';
  confirmedAt?: string;
  rejectedAt?: string;
  notes?: string;
  child?: {
    numeroH: string;
    prenom: string;
    nomFamille: string;
    dateNaissance?: string;
    photo?: string;
  };
}

interface FamilyTreeData {
  id: string;
  rootMember: string;
  chefFamille1?: string;
  chefFamille2?: string;
  members: any[];
  deceasedMembers: any[];
}

export default function Famille() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<'parents' | 'enfants' | 'epoux' | 'freres' | 'soeurs' | 'oncles' | 'tantes' | 'cousins' | 'cousines' | 'neveux' | 'nieces' | 'grandparents' | 'arbre' | 'gestion'>('parents');
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [familyTree, setFamilyTree] = useState<FamilyTree | null>(null);
  const [familyTreeData, setFamilyTreeData] = useState<FamilyTreeData | null>(null);
  const [pendingConfirmations, setPendingConfirmations] = useState<FamilyTreeConfirmation[]>([]);
  const [showSetHeadsForm, setShowSetHeadsForm] = useState(false);
  const [familyHeads, setFamilyHeads] = useState({
    chefFamille1: '',
    chefFamille2: ''
  });
  const [familyMessages, setFamilyMessages] = useState<FamilyMessage[]>([]);
  const [orangeMoneyAccount, setOrangeMoneyAccount] = useState<OrangeMoneyAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showTreeChat, setShowTreeChat] = useState(false);
  const [showOrangeMoney, setShowOrangeMoney] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const navigate = useNavigate();

  // État pour les photos de famille
  const [familyPhotos, setFamilyPhotos] = useState({
    familyPhoto: null as string | null,
    manPhoto: null as string | null,
    wifePhoto: null as string | null,
    childrenPhotos: [] as Array<{ name: string; photoUrl: string; uploadedAt: string }>
  });
  const [uploading, setUploading] = useState<string | null>(null);

  const [newMember, setNewMember] = useState({
    numeroH: '',
    prenom: '',
    nomFamille: '',
    relation: '',
    phone: '',
    email: '',
    address: '',
    birthDate: '',
    occupation: '',
    maritalStatus: '',
    children: ''
  });

  const [newMessage, setNewMessage] = useState({
    content: '',
    type: 'text' as 'text' | 'image' | 'video' | 'audio'
  });

  const [orangeMoneyForm, setOrangeMoneyForm] = useState({
    phoneNumber: '',
    amount: '',
    recipient: '',
    message: ''
  });

  useEffect(() => {
    const session = localStorage.getItem("session_user");
    if (!session) {
      navigate("/login");
      return;
    }

    try {
      const parsed = JSON.parse(session);
      const user = parsed.userData || parsed;
      if (!user || !user.numeroH) {
        navigate("/login");
        return;
      }
      
      setUserData(user);
      loadData();
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadFamilyMembers(),
        loadFamilyTree(),
        loadFamilyMessages(),
        loadOrangeMoneyAccount(),
        loadFamilyPhotos(),
        loadFamilyTreeData(),
        loadPendingConfirmations()
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFamilyPhotos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/family/photos', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFamilyPhotos(data.photos || {
          familyPhoto: null,
          manPhoto: null,
          wifePhoto: null,
          childrenPhotos: []
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des photos:', error);
    }
  };

  const uploadPhoto = async (type: 'family' | 'man' | 'wife' | 'children', file: File, childName?: string) => {
    try {
      setUploading(type);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append('photo', file);
      if (childName) {
        formData.append('childName', childName);
      }

      const endpoint = type === 'children' ? '/api/family/photos/children' : `/api/family/photos/${type}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        if (type === 'children') {
          setFamilyPhotos(prev => ({
            ...prev,
            childrenPhotos: data.childrenPhotos || prev.childrenPhotos
          }));
        } else {
          const photoKey = type === 'family' ? 'familyPhoto' : type === 'man' ? 'manPhoto' : 'wifePhoto';
          setFamilyPhotos(prev => ({
            ...prev,
            [photoKey]: data.photoUrl
          }));
        }
        alert('Photo uploadée avec succès !');
      } else {
        alert('Erreur lors de l\'upload de la photo');
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      alert('Erreur lors de l\'upload de la photo');
    } finally {
      setUploading(null);
    }
  };

  const deleteChildPhoto = async (index: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/family/photos/children/${index}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFamilyPhotos(prev => ({
          ...prev,
          childrenPhotos: data.childrenPhotos || prev.childrenPhotos
        }));
        alert('Photo supprimée avec succès !');
      } else {
        alert('Erreur lors de la suppression de la photo');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de la photo');
    }
  };

  const loadFamilyMembers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/family/members', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFamilyMembers(data.members || []);
      } else {
        setFamilyMembers(getDefaultFamilyMembers());
      }
    } catch (error) {
      console.error('Erreur lors du chargement des membres:', error);
      setFamilyMembers(getDefaultFamilyMembers());
    }
  };

  const loadFamilyTreeData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/family-tree/tree', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFamilyTreeData(data.tree);
        if (data.tree) {
          setFamilyHeads({
            chefFamille1: data.tree.chefFamille1 || '',
            chefFamille2: data.tree.chefFamille2 || ''
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'arbre:', error);
    }
  };

  const loadPendingConfirmations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/family-tree/pending-confirmations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPendingConfirmations(data.confirmations || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des confirmations:', error);
    }
  };

  const confirmAccess = async (confirmationId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/family-tree/confirm-access/${confirmationId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        alert('Accès confirmé avec succès !');
        loadPendingConfirmations();
        loadFamilyTreeData();
      } else {
        const data = await response.json();
        alert(data.message || 'Erreur lors de la confirmation');
      }
    } catch (error) {
      console.error('Erreur lors de la confirmation:', error);
      alert('Erreur lors de la confirmation');
    }
  };

  const rejectAccess = async (confirmationId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/family-tree/reject-access/${confirmationId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        alert('Accès rejeté');
        loadPendingConfirmations();
      } else {
        const data = await response.json();
        alert(data.message || 'Erreur lors du rejet');
      }
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      alert('Erreur lors du rejet');
    }
  };

  const saveFamilyHeads = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/family-tree/set-family-heads', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(familyHeads)
      });
      
      if (response.ok) {
        alert('Chefs de famille mis à jour avec succès !');
        setShowSetHeadsForm(false);
        loadFamilyTreeData();
      } else {
        const data = await response.json();
        alert(data.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const loadFamilyTree = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/family/tree', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFamilyTree(data.tree || getDefaultFamilyTree());
      } else {
        setFamilyTree(getDefaultFamilyTree());
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'arbre:', error);
      setFamilyTree(getDefaultFamilyTree());
    }
  };

  const loadFamilyMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/family/messages', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFamilyMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    }
  };

  const loadOrangeMoneyAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/family/orange-money', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrangeMoneyAccount(data.account || getDefaultOrangeMoneyAccount());
      } else {
        setOrangeMoneyAccount(getDefaultOrangeMoneyAccount());
      }
    } catch (error) {
      console.error('Erreur lors du chargement du compte Orange Money:', error);
      setOrangeMoneyAccount(getDefaultOrangeMoneyAccount());
    }
  };

  const getDefaultFamilyMembers = (): FamilyMember[] => [
    {
      id: '1',
      numeroH: 'PARENT001',
      prenom: 'Mamadou',
      nomFamille: 'Diallo',
      relation: 'Père',
      phone: '+224 123 456 789',
      email: 'mamadou.diallo@email.com',
      address: 'Conakry, Guinée',
      birthDate: '1960-05-15',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      occupation: 'Fonctionnaire',
      maritalStatus: 'Marié',
      children: 3
    },
    {
      id: '2',
      numeroH: 'PARENT002',
      prenom: 'Fatou',
      nomFamille: 'Camara',
      relation: 'Mère',
      phone: '+224 987 654 321',
      email: 'fatou.camara@email.com',
      address: 'Conakry, Guinée',
      birthDate: '1965-08-20',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      occupation: 'Enseignante',
      maritalStatus: 'Mariée',
      children: 3
    },
    {
      id: '3',
      numeroH: 'EPOUX001',
      prenom: 'Mariama',
      nomFamille: 'Bah',
      relation: 'Épouse',
      phone: '+224 555 123 456',
      email: 'mariama.bah@email.com',
      address: 'Conakry, Guinée',
      birthDate: '1990-12-10',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      occupation: 'Infirmière',
      maritalStatus: 'Mariée',
      children: 2
    }
  ];

  const getDefaultFamilyTree = (): FamilyTree => ({
    id: '1',
    rootMember: userData?.numeroH || '',
    members: getDefaultFamilyMembers(),
        isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  });

  const getDefaultOrangeMoneyAccount = (): OrangeMoneyAccount => ({
    id: '1',
    numeroH: userData?.numeroH || '',
    phoneNumber: '+224 123 456 789',
    balance: 150000,
    currency: 'FG',
    isActive: true,
    lastTransaction: '2024-01-20T10:30:00Z'
  });

  const handleAddMember = () => {
        setNewMember({
          numeroH: '',
          prenom: '',
          nomFamille: '',
          relation: '',
          phone: '',
          email: '',
          address: '',
      birthDate: '',
      occupation: '',
      maritalStatus: '',
      children: ''
    });
    setShowAddMember(true);
  };

  const submitAddMember = async () => {
    if (!newMember.numeroH || !newMember.prenom || !newMember.nomFamille || !newMember.relation) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/family/add-member', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMember)
      });

      if (response.ok) {
        alert('Membre de famille ajouté avec succès !');
        setShowAddMember(false);
        loadFamilyMembers();
      } else {
        alert('Erreur lors de l\'ajout du membre');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      alert('Erreur lors de l\'ajout du membre');
    }
  };

  const submitFamilyMessage = async () => {
    if (!newMessage.content) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/family/send-message', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: newMessage.content,
          type: newMessage.type,
          author: userData?.numeroH,
          authorName: `${userData?.prenom} ${userData?.nomFamille}`
        })
      });
      
      if (response.ok) {
        setNewMessage({ content: '', type: 'text' });
        loadFamilyMessages();
      } else {
        alert('Erreur lors de l\'envoi du message');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      alert('Erreur lors de l\'envoi du message');
    }
  };

  const submitOrangeMoneyTransfer = async () => {
    if (!orangeMoneyForm.phoneNumber || !orangeMoneyForm.amount) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/family/orange-money-transfer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientPhone: orangeMoneyForm.phoneNumber,
          amount: parseFloat(orangeMoneyForm.amount),
          message: orangeMoneyForm.message
        })
      });

      if (response.ok) {
        alert('Transfert Orange Money effectué avec succès !');
        setShowOrangeMoney(false);
        loadOrangeMoneyAccount();
      } else {
        alert('Erreur lors du transfert');
      }
    } catch (error) {
      console.error('Erreur lors du transfert:', error);
      alert('Erreur lors du transfert');
    }
  };

  const getMembersByRelation = (relation: string) => {
    return familyMembers.filter(member => member.relation === relation);
  };

  const getTabLabel = (tab: string) => {
    const labels: { [key: string]: string } = {
      'parents': 'Mes Parents',
      'enfants': 'Mes Enfants',
      'epoux': 'Ma Femme', // Changé de "Mes Femmes" à "Ma Femme"
      'freres': 'Mes Frères',
      'soeurs': 'Mes Sœurs',
      'oncles': 'Mes Oncles',
      'tantes': 'Mes Tantes',
      'cousins': 'Mes Cousins',
      'cousines': 'Mes Cousines',
      'neveux': 'Mes Neveux',
      'nieces': 'Mes Nièces',
      'grandparents': 'Mes Grands-Parents',
      'arbre': 'Mon Arbre',
      'gestion': 'Gestion'
    };
    return labels[tab] || tab;
  };

  const getTabIcon = (tab: string) => {
    const icons: { [key: string]: string } = {
      'parents': '👨‍👩‍👧‍👦',
      'enfants': '👶',
      'epoux': '👩‍❤️‍👨',
      'freres': '👨‍👦',
      'soeurs': '👩‍👧',
      'oncles': '👨‍💼',
      'tantes': '👩‍💼',
      'cousins': '👨‍🎓',
      'cousines': '👩‍🎓',
      'neveux': '👦',
      'nieces': '👧',
      'grandparents': '👴‍👵',
      'arbre': '🌳',
      'gestion': '⚙️'
    };
    return icons[tab] || '👤';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la famille...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-lg p-2 border border-gray-200 overflow-hidden">
                {familyPhotos.familyPhoto ? (
                  <img 
                    src={familyPhotos.familyPhoto} 
                    alt="Photo de famille" 
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      // Si l'image ne charge pas, afficher l'emoji
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent && !parent.querySelector('.fallback-emoji')) {
                        const emoji = document.createElement('span');
                        emoji.className = 'fallback-emoji text-4xl';
                        emoji.textContent = '👨‍👩‍👧‍👦';
                        parent.appendChild(emoji);
                      }
                    }}
                  />
                ) : (
                  <span className="text-4xl">👨‍👩‍👧‍👦</span>
                )}
              </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">👨‍👩‍👧‍👦 Famille</h1>
              <p className="mt-2 text-gray-600">Gérez votre famille et votre arbre généalogique</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleAddMember}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ➕ Ajouter un membre
              </button>
      <button
                onClick={() => navigate('/moi')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
      >
        ← Retour
      </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section Photos de Famille */}
      <div className="bg-white border-b py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📸 Photos de Famille</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Photo de famille */}
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">Photo de Famille</h3>
              <div className="relative w-full h-48 bg-white rounded-lg overflow-hidden mb-3 border border-gray-200">
                {familyPhotos.familyPhoto ? (
                  <img 
                    src={familyPhotos.familyPhoto} 
                    alt="Photo de famille" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-4xl">👨‍👩‍👧‍👦</span>
                  </div>
                )}
              </div>
              <label className="block w-full">
                <input
                  type="file"
                  accept="image/*,video/*,audio/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadPhoto('family', file);
                  }}
                  disabled={uploading === 'family'}
                />
                <span className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition-colors cursor-pointer text-sm">
                  {uploading === 'family' ? '⏳ Upload...' : '📷 Ajouter'}
                </span>
              </label>
            </div>

            {/* Photo de l'homme */}
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">Mon Homme</h3>
              <div className="relative w-full h-48 bg-white rounded-lg overflow-hidden mb-3 border border-gray-200">
                {familyPhotos.manPhoto ? (
                  <img 
                    src={familyPhotos.manPhoto} 
                    alt="Photo de l'homme" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-4xl">👨</span>
                  </div>
                )}
              </div>
              <label className="block w-full">
                <input
                  type="file"
                  accept="image/*,video/*,audio/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadPhoto('man', file);
                  }}
                  disabled={uploading === 'man'}
                />
                <span className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition-colors cursor-pointer text-sm">
                  {uploading === 'man' ? '⏳ Upload...' : '📷 Ajouter'}
                </span>
              </label>
            </div>

            {/* Photo de la femme */}
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">Ma Femme</h3>
              <div className="relative w-full h-48 bg-white rounded-lg overflow-hidden mb-3 border border-gray-200">
                {familyPhotos.wifePhoto ? (
                  <img 
                    src={familyPhotos.wifePhoto} 
                    alt="Photo de la femme" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-4xl">👩</span>
                  </div>
                )}
              </div>
              <label className="block w-full">
                <input
                  type="file"
                  accept="image/*,video/*,audio/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadPhoto('wife', file);
                  }}
                  disabled={uploading === 'wife'}
                />
                <span className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition-colors cursor-pointer text-sm">
                  {uploading === 'wife' ? '⏳ Upload...' : '📷 Ajouter'}
                </span>
              </label>
            </div>

            {/* Section Enfants */}
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">Mes Enfants</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
                {familyPhotos.childrenPhotos.length > 0 ? (
                  familyPhotos.childrenPhotos.map((child, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white p-2 rounded border border-gray-200">
                      <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={child.photoUrl} 
                          alt={child.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700 truncate">{child.name}</p>
                      </div>
                      <button
                        onClick={() => deleteChildPhoto(index)}
                        className="text-red-600 hover:text-red-700 text-xs"
                        title="Supprimer"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="w-full h-12 flex items-center justify-center text-gray-400 text-xs">
                    Aucun enfant
                  </div>
                )}
              </div>
              <label className="block w-full">
                <input
                  type="file"
                  accept="image/*,video/*,audio/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const childName = prompt('Nom de l\'enfant (optionnel):') || 'Enfant';
                      uploadPhoto('children', file, childName);
                    }
                  }}
                  disabled={uploading === 'children'}
                />
                <span className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition-colors cursor-pointer text-sm">
                  {uploading === 'children' ? '⏳ Upload...' : '📷 Ajouter'}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {['parents', 'enfants', 'epoux', 'freres', 'soeurs', 'oncles', 'tantes', 'cousins', 'cousines', 'neveux', 'nieces', 'grandparents', 'arbre', 'gestion'].map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{getTabIcon(tab)}</span>
                {getTabLabel(tab)}
            </button>
          ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'arbre' ? (
          <div className="space-y-6">
            {/* Arbre généalogique - NE PAS MODIFIER */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🌳 Mon Arbre Généalogique</h2>
              <p className="text-gray-600 mb-6">
                Voici votre arbre généalogique. Cette section reste inchangée comme demandé.
              </p>
              
              {/* Arbre visuel simplifié */}
              <div className="flex justify-center items-center space-x-8 py-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl mb-2">
                    👴
                  </div>
                  <p className="text-sm font-medium">Grand-Père</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center text-2xl mb-2">
                    👵
                  </div>
                  <p className="text-sm font-medium">Grand-Mère</p>
                </div>
              </div>
              
              <div className="flex justify-center items-center space-x-4 py-4">
                <div className="w-1 h-8 bg-gray-300"></div>
                <div className="w-1 h-8 bg-gray-300"></div>
              </div>
              
              <div className="flex justify-center items-center space-x-8 py-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl mb-2">
                    👨
                  </div>
                  <p className="text-sm font-medium">Père</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center text-2xl mb-2">
                    👩
                  </div>
                  <p className="text-sm font-medium">Mère</p>
                </div>
              </div>
              
              <div className="flex justify-center items-center space-x-4 py-4">
                <div className="w-1 h-8 bg-gray-300"></div>
                <div className="w-1 h-8 bg-gray-300"></div>
              </div>
              
              <div className="flex justify-center items-center space-x-8 py-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl mb-2">
                    👤
                  </div>
                  <p className="text-sm font-medium">Vous</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-2xl mb-2">
                    👩‍❤️‍👨
                  </div>
                  <p className="text-sm font-medium">Épouse</p>
                </div>
        </div>

              {/* Boutons pour l'arbre */}
              <div className="flex justify-center space-x-4 mt-8">
                <button
                  onClick={() => setShowTreeChat(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  💬 Chat Familial
                </button>
                <button
                  onClick={() => setShowOrangeMoney(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  🍊 Orange Money
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === 'gestion' ? (
          <div className="space-y-6">
            {/* Section Confirmations en attente */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🔐 Confirmations en attente</h2>
              <p className="text-gray-600 mb-6">
                Des enfants ont demandé l'accès à l'arbre familial. Veuillez confirmer ou rejeter leurs demandes.
              </p>
              
              {pendingConfirmations.length > 0 ? (
                <div className="space-y-4">
                  {pendingConfirmations.map((confirmation) => (
                    <div key={confirmation.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                              {confirmation.parentType === 'pere' ? '👨' : '👩'}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {confirmation.child?.prenom} {confirmation.child?.nomFamille}
                              </h3>
                              <p className="text-sm text-gray-600">
                                NumeroH: {confirmation.childNumeroH}
                              </p>
                              <p className="text-sm text-gray-500">
                                Demande d'accès en tant que {confirmation.parentType === 'pere' ? 'fils/fille du père' : 'fils/fille de la mère'}
                              </p>
                            </div>
                          </div>
                          {confirmation.child?.dateNaissance && (
                            <p className="text-sm text-gray-500 ml-15">
                              Date de naissance: {new Date(confirmation.child.dateNaissance).toLocaleDateString('fr-FR')}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => confirmAccess(confirmation.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            ✅ Confirmer
                          </button>
                          <button
                            onClick={() => rejectAccess(confirmation.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            ❌ Rejeter
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="text-6xl mb-4">✅</div>
                  <p className="text-lg font-medium text-gray-900 mb-2">Aucune confirmation en attente</p>
                  <p className="text-gray-600">Toutes les demandes d'accès ont été traitées.</p>
                </div>
              )}
            </div>

            {/* Section Chefs de famille */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">👑 Chefs de famille</h2>
                  <p className="text-gray-600 mt-2">
                    Nommez deux chefs de famille pour maintenir l'arbre généalogique. Seuls les chefs actuels ou les administrateurs peuvent modifier cette liste.
                  </p>
                </div>
                <button
                  onClick={() => setShowSetHeadsForm(true)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  ✏️ Modifier
                </button>
              </div>

              {familyTreeData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-purple-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center text-2xl">
                        👑
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Chef de famille 1</h3>
                        <p className="text-sm text-gray-600">
                          {familyTreeData.chefFamille1 ? (
                            <span className="font-mono">{familyTreeData.chefFamille1}</span>
                          ) : (
                            <span className="text-gray-400">Non défini</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-purple-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center text-2xl">
                        👑
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Chef de famille 2</h3>
                        <p className="text-sm text-gray-600">
                          {familyTreeData.chefFamille2 ? (
                            <span className="font-mono">{familyTreeData.chefFamille2}</span>
                          ) : (
                            <span className="text-gray-400">Non défini</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Formulaire pour nommer les chefs de famille */}
              {showSetHeadsForm && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Nommer les chefs de famille</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chef de famille 1 (NumeroH) *
                      </label>
                      <input
                        type="text"
                        value={familyHeads.chefFamille1}
                        onChange={(e) => setFamilyHeads({...familyHeads, chefFamille1: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Ex: G1C1P1R1E1F1 1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chef de famille 2 (NumeroH) (optionnel)
                      </label>
                      <input
                        type="text"
                        value={familyHeads.chefFamille2}
                        onChange={(e) => setFamilyHeads({...familyHeads, chefFamille2: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Ex: G1C1P1R1E1F1 2"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={saveFamilyHeads}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        ✅ Enregistrer
                      </button>
                      <button
                        onClick={() => setShowSetHeadsForm(false)}
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        ❌ Annuler
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Informations sur l'arbre */}
            {familyTreeData && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Informations sur l'arbre</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {familyTreeData.members?.length || 0}
                    </div>
                    <div className="text-sm text-blue-800">Membres vivants</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-gray-600 mb-2">
                      {familyTreeData.deceasedMembers?.length || 0}
                    </div>
                    <div className="text-sm text-gray-800">Membres décédés</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {(familyTreeData.members?.length || 0) + (familyTreeData.deceasedMembers?.length || 0)}
                    </div>
                    <div className="text-sm text-purple-800">Total membres</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {getTabIcon(activeTab)} {getTabLabel(activeTab)}
              </h2>
              
              {getMembersByRelation(activeTab).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getMembersByRelation(activeTab).map((member) => (
                    <div key={member.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl mr-3">
                          {getTabIcon(activeTab)}
                        </div>
            <div>
                          <h3 className="font-semibold text-gray-900">
                            {member.prenom} {member.nomFamille}
                          </h3>
                          <p className="text-sm text-gray-600">{member.numeroH}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {member.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-2">📞</span>
                            <span>{member.phone}</span>
                          </div>
                        )}
                        {member.email && (
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-2">📧</span>
                            <span>{member.email}</span>
                          </div>
                        )}
                        {member.address && (
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-2">📍</span>
                            <span>{member.address}</span>
                          </div>
                        )}
                        {member.occupation && (
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-2">💼</span>
                            <span>{member.occupation}</span>
                          </div>
                        )}
                        {member.birthDate && (
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-2">🎂</span>
                            <span>{new Date(member.birthDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                          Contacter
                        </button>
                        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                          Modifier
                        </button>
                      </div>
                    </div>
                  ))}
            </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">{getTabIcon(activeTab)}</div>
                  <p className="text-gray-500 mb-4">Aucun membre dans cette catégorie</p>
              <button
                    onClick={handleAddMember}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                    Ajouter un membre
              </button>
                </div>
            )}
          </div>
          </div>
        )}
        </div>

      {/* Modal d'ajout de membre */}
        {showAddMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">➕ Ajouter un Membre de Famille</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NumeroH</label>
                <input
                  type="text"
                  value={newMember.numeroH}
                  onChange={(e) => setNewMember({...newMember, numeroH: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="NumeroH du membre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Relation</label>
                <select
                  value={newMember.relation}
                  onChange={(e) => setNewMember({...newMember, relation: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner une relation</option>
                  <option value="Père">Père</option>
                  <option value="Mère">Mère</option>
                  <option value="Épouse">Épouse</option>
                  <option value="Fils">Fils</option>
                  <option value="Fille">Fille</option>
                  <option value="Frère">Frère</option>
                  <option value="Sœur">Sœur</option>
                  <option value="Oncle">Oncle</option>
                  <option value="Tante">Tante</option>
                  <option value="Cousin">Cousin</option>
                  <option value="Cousine">Cousine</option>
                  <option value="Neveu">Neveu</option>
                  <option value="Nièce">Nièce</option>
                  <option value="Grand-Père">Grand-Père</option>
                  <option value="Grand-Mère">Grand-Mère</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input
                  type="text"
                  value={newMember.prenom}
                  onChange={(e) => setNewMember({...newMember, prenom: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Prénom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de famille</label>
                <input
                  type="text"
                  value={newMember.nomFamille}
                  onChange={(e) => setNewMember({...newMember, nomFamille: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom de famille"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+224 XXX XXX XXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <input
                  type="text"
                  value={newMember.address}
                  onChange={(e) => setNewMember({...newMember, address: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Adresse complète"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                <input
                  type="date"
                  value={newMember.birthDate}
                  onChange={(e) => setNewMember({...newMember, birthDate: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                <input
                  type="text"
                  value={newMember.occupation}
                  onChange={(e) => setNewMember({...newMember, occupation: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Profession"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut marital</label>
                <select
                  value={newMember.maritalStatus}
                  onChange={(e) => setNewMember({...newMember, maritalStatus: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner</option>
                  <option value="Célibataire">Célibataire</option>
                  <option value="Marié(e)">Marié(e)</option>
                  <option value="Divorcé(e)">Divorcé(e)</option>
                  <option value="Veuf/Veuve">Veuf/Veuve</option>
                </select>
          </div>
                    <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d'enfants</label>
                <input
                  type="number"
                  value={newMember.children}
                  onChange={(e) => setNewMember({...newMember, children: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
                    </div>
                  </div>
            <div className="flex space-x-3 mt-6">
                    <button
                onClick={() => setShowAddMember(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
              >
                Annuler
                  </button>
                  <button
                onClick={submitAddMember}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                Ajouter
                  </button>
                </div>
              </div>
            </div>
      )}

      {/* Modal de chat familial */}
      {showTreeChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl h-[600px] flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 mb-4">💬 Chat Familial</h3>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {familyMessages.map((message) => (
                <div key={message.id} className={`flex ${message.author === userData?.numeroH ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.author === userData?.numeroH 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-900'
                  }`}>
                    <p className="text-sm font-medium">{message.authorName}</p>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage.content}
                onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tapez votre message..."
                onKeyPress={(e) => e.key === 'Enter' && submitFamilyMessage()}
              />
                  <button
                onClick={submitFamilyMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                Envoyer
                  </button>
              </div>
              
            <div className="flex space-x-3 mt-4">
                      <button
                        onClick={() => setShowTreeChat(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                      >
                Fermer
                      </button>
              </div>
            </div>
          </div>
        )}

      {/* Modal Orange Money */}
      {showOrangeMoney && orangeMoneyAccount && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🍊 Orange Money</h3>
            
            {/* Solde */}
            <div className="bg-orange-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Solde disponible</h4>
              <p className="text-2xl font-bold text-orange-600">
                {orangeMoneyAccount.balance.toLocaleString()} {orangeMoneyAccount.currency}
              </p>
              <p className="text-sm text-gray-600">
                Numéro: {orangeMoneyAccount.phoneNumber}
              </p>
            </div>

            {/* Formulaire de transfert */}
              <div className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro du destinataire
                </label>
                <input
                  type="tel"
                  value={orangeMoneyForm.phoneNumber}
                  onChange={(e) => setOrangeMoneyForm({...orangeMoneyForm, phoneNumber: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="+224 XXX XXX XXX"
                />
                </div>
                  <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant
                </label>
                <input
                  type="number"
                  value={orangeMoneyForm.amount}
                  onChange={(e) => setOrangeMoneyForm({...orangeMoneyForm, amount: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Montant en FG"
                />
                  </div>
                  <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (optionnel)
                </label>
                <textarea
                  value={orangeMoneyForm.message}
                  onChange={(e) => setOrangeMoneyForm({...orangeMoneyForm, message: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={2}
                  placeholder="Message pour le destinataire..."
                />
                  </div>
              </div>

            <div className="flex space-x-3 mt-6">
                <button
                onClick={() => setShowOrangeMoney(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                >
                Annuler
                </button>
                <button
                onClick={submitOrangeMoneyTransfer}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                Transférer
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}