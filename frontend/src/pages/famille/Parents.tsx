import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface UserData {
  numeroH: string
  prenom: string
  nomFamille: string
  genre: 'HOMME' | 'FEMME' | 'AUTRE'
  prenomPere?: string
  numeroHPere?: string
  prenomMere?: string
  numeroHMere?: string
}

interface Souvenir {
  id: string
  type: "photo" | "video" | "audio"
  url: string
  date: string
  description?: string
}

interface Note {
  annee: number
  note: string
}

export default function Parents() {
  const [user, setUser] = useState<UserData | null>(null)
  const [souvenirs, setSouvenirs] = useState<{ [key: string]: Souvenir[] }>({})
  const [notes, setNotes] = useState<{ [key: string]: Note[] }>({})

  useEffect(() => {
    const sessionData = JSON.parse(localStorage.getItem('session_user') || '{}')
    const u = sessionData.userData || sessionData
    if (u?.numeroH) setUser(u)
    
    // Charger souvenirs et notes depuis localStorage
    const storedSouvenirs = localStorage.getItem(`souvenirs_parents_${u?.numeroH}`)
    const storedNotes = localStorage.getItem(`notes_parents_${u?.numeroH}`)
    
    if (storedSouvenirs) {
      try {
        setSouvenirs(JSON.parse(storedSouvenirs))
      } catch (e) {
        console.error('Erreur chargement souvenirs:', e)
      }
    }
    
    if (storedNotes) {
      try {
        setNotes(JSON.parse(storedNotes))
      } catch (e) {
        console.error('Erreur chargement notes:', e)
      }
    }
  }, [])

  const effectiveUser: UserData = user || {
    numeroH: '',
    prenom: 'Invité',
    nomFamille: '',
    genre: 'HOMME'
  }

  const ajouterSouvenir = (session: string, souvenir: Souvenir) => {
    const nouveauxSouvenirs = {
      ...souvenirs,
      [session]: [...(souvenirs[session] || []), souvenir],
    }
    setSouvenirs(nouveauxSouvenirs)
    localStorage.setItem(`souvenirs_parents_${effectiveUser.numeroH}`, JSON.stringify(nouveauxSouvenirs))
  }

  const ajouterNote = (personne: string, note: Note) => {
    const nouvellesNotes = {
      ...notes,
      [personne]: [...(notes[personne] || []), note],
    }
    setNotes(nouvellesNotes)
    localStorage.setItem(`notes_parents_${effectiveUser.numeroH}`, JSON.stringify(nouvellesNotes))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Bouton retour */}
      <Link
        to="/famille"
        className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
      >
        ← Retour à Famille
      </Link>

      {/* En-tête */}
      <div className="bg-white rounded-xl shadow-sm border-l-4 border-l-emerald-500 border border-slate-200 p-6 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">👨‍👩‍👦 Mes Parents</h2>
        <p className="text-slate-600">Informations sur vos parents</p>
      </div>

      {/* Informations des parents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Carte Papa */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl">
              👨
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800">Papa</h3>
              <p className="text-slate-500">Père</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-slate-700">
              <span className="font-medium">Prénom:</span>{' '}
              {effectiveUser.prenomPere || 'Non renseigné'}
            </p>
            <p className="text-slate-700">
              <span className="font-medium">NuméroH:</span>{' '}
              <span className="text-blue-600">{effectiveUser.numeroHPere || 'Non renseigné'}</span>
            </p>
          </div>
        </div>

        {/* Carte Maman */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-3xl">
              👩
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800">Maman</h3>
              <p className="text-slate-500">Mère</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-slate-700">
              <span className="font-medium">Prénom:</span>{' '}
              {effectiveUser.prenomMere || 'Non renseigné'}
            </p>
            <p className="text-slate-700">
              <span className="font-medium">NuméroH:</span>{' '}
              <span className="text-pink-600">{effectiveUser.numeroHMere || 'Non renseigné'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* LES 3 SECTIONS ORIGINALES */}
      <div className="space-y-6">
        {/* Titre principal */}
        <h2 className="text-3xl font-bold text-slate-800">📸 Nos souvenirs ensemble</h2>

        {/* Session 1 : Mon enfance dans vos mains */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-sm border-2 border-yellow-200 p-6">
          <h3 className="text-2xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
            👶 Mon enfance dans vos mains
          </h3>
          <SessionSouvenirs
            session="enfance"
            souvenirs={souvenirs.enfance || []}
            onAdd={(souvenir) => ajouterSouvenir("enfance", souvenir)}
          />
        </div>

        {/* Session 2 : Mon avenir dans vos mains */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl shadow-sm border-2 border-blue-200 p-6">
          <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
            🌟 Mon avenir dans vos mains
          </h3>
          <SessionSouvenirs
            session="avenir"
            souvenirs={souvenirs.avenir || []}
            onAdd={(souvenir) => ajouterSouvenir("avenir", souvenir)}
          />
        </div>

        {/* Session 3 : Mon paradis dans vos mains */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-sm border-2 border-purple-200 p-6">
          <h3 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
            🏝️ Mon paradis dans vos mains
          </h3>
          <SessionSouvenirs
            session="paradis"
            souvenirs={souvenirs.paradis || []}
            onAdd={(souvenir) => ajouterSouvenir("paradis", souvenir)}
          />
        </div>

        {/* Tableau de notes */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">📝 Notes de mes parents</h3>
          <p className="text-gray-600 mb-6">Notes que mes parents me donnent chaque année</p>
          <TableauNotes
            personnes={["papa", "maman"]}
            notes={notes}
            onAddNote={ajouterNote}
          />
        </div>
      </div>
    </div>
  )
}

// Composant Session Souvenirs
function SessionSouvenirs({
  session,
  souvenirs,
  onAdd,
}: {
  session: string;
  souvenirs: Souvenir[];
  onAdd: (souvenir: Souvenir) => void;
}) {
  return (
    <div>
      <div className="flex gap-3 mb-4 flex-wrap">
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
          📷 Photo
        </button>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
          🎥 Vidéo
        </button>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
          🎤 Audio
        </button>
      </div>

      {souvenirs.length === 0 ? (
        <div className="text-center text-gray-500 py-6">
          Aucun souvenir pour le moment
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {souvenirs.map((souvenir, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center text-3xl mb-2">
                {souvenir.type === "photo" && "📷"}
                {souvenir.type === "video" && "🎥"}
                {souvenir.type === "audio" && "🎤"}
              </div>
              <p className="text-sm text-gray-600">
                {new Date(souvenir.date).toLocaleDateString()}
              </p>
              {souvenir.description && (
                <p className="text-xs text-gray-500 mt-1">{souvenir.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Tableau de notes
function TableauNotes({
  personnes,
  notes,
  onAddNote,
}: {
  personnes: string[];
  notes: { [key: string]: Note[] };
  onAddNote: (personne: string, note: Note) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border border-gray-300 text-left">Personne</th>
            <th className="p-3 border border-gray-300 text-left">Année</th>
            <th className="p-3 border border-gray-300 text-left">Note</th>
          </tr>
        </thead>
        <tbody>
          {personnes.map((personne) => (
            <tr key={personne}>
              <td className="p-3 border border-gray-300 font-bold">
                {getPersonneLabel(personne)}
              </td>
              <td className="p-3 border border-gray-300">
                {notes[personne]?.[0]?.annee || "-"}
              </td>
              <td className="p-3 border border-gray-300">
                {notes[personne]?.[0]?.note || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getPersonneLabel(personne: string) {
  if (personne === "papa") return "Papa";
  if (personne === "maman") return "Maman";
  return personne;
}
