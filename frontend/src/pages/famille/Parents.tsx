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
  id: string
  annee: number
  note: number // 0-5 étoiles
}

export default function Parents() {
  const [user, setUser] = useState<UserData | null>(null)
  const [souvenirs, setSouvenirs] = useState<{ [key: string]: Souvenir[] }>({})
  const [notes, setNotes] = useState<{ [key: string]: Note[] }>({})
  const [newNotes, setNewNotes] = useState<{ [key: string]: { annee: number; note: number } }>({
    papa: { annee: new Date().getFullYear(), note: 0 },
    maman: { annee: new Date().getFullYear(), note: 0 }
  })

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

  const handleNoteChange = (personne: string, noteValue: number) => {
    setNewNotes(prev => ({
      ...prev,
      [personne]: { ...prev[personne], note: noteValue }
    }))
  }

  const handleYearChange = (personne: string, annee: number) => {
    setNewNotes(prev => ({
      ...prev,
      [personne]: { ...prev[personne], annee }
    }))
  }

  const handleAddNote = (personne: string) => {
    const nouvelleNote: Note = {
      id: Date.now().toString(),
      annee: newNotes[personne].annee,
      note: newNotes[personne].note
    }
    ajouterNote(personne, nouvelleNote)
    // Réinitialiser pour cette personne
    setNewNotes(prev => ({
      ...prev,
      [personne]: { annee: new Date().getFullYear(), note: 0 }
    }))
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
            newNotes={newNotes}
            onNoteChange={handleNoteChange}
            onYearChange={handleYearChange}
            onAddNoteClick={handleAddNote}
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

// Tableau de notes avec étoiles
function TableauNotes({
  personnes,
  notes,
  onAddNote,
  newNotes,
  onNoteChange,
  onYearChange,
  onAddNoteClick,
}: {
  personnes: string[];
  notes: { [key: string]: Note[] };
  onAddNote: (personne: string, note: Note) => void;
  newNotes: { [key: string]: { annee: number; note: number } };
  onNoteChange: (personne: string, note: number) => void;
  onYearChange: (personne: string, annee: number) => void;
  onAddNoteClick: (personne: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Section pour ajouter une nouvelle note */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-200">
        <h4 className="text-lg font-semibold text-purple-800 mb-4">⭐ Ajouter une note</h4>
        <div className="space-y-4">
          {personnes.map((personne) => (
            <div key={personne} className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{personne === 'papa' ? '👨' : '👩'}</span>
                <span className="font-semibold text-slate-800">{getPersonneLabel(personne)}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Année</label>
                  <input
                    type="number"
                    value={newNotes[personne]?.annee || new Date().getFullYear()}
                    onChange={(e) => onYearChange(personne, parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="2020"
                    max="2030"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Note (cliquez sur les étoiles)</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        className={`text-3xl transition-transform duration-150 hover:scale-125 ${
                          (newNotes[personne]?.note || 0) >= star ? 'opacity-100' : 'opacity-30'
                        }`}
                        onClick={() => onNoteChange(personne, star)}
                        title={`${star} étoile${star > 1 ? 's' : ''}`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {newNotes[personne]?.note || 0} / 5 étoiles
                  </p>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => onAddNoteClick(personne)}
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                  >
                    ➕ Ajouter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section pour afficher les notes existantes */}
      <div>
        <h4 className="text-lg font-semibold text-slate-800 mb-4">📋 Notes précédentes</h4>
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
              {personnes.map((personne) => {
                const personneNotes = notes[personne] || []
                if (personneNotes.length === 0) {
                  return (
                    <tr key={personne}>
                      <td className="p-3 border border-gray-300 font-bold">
                        <span className="flex items-center gap-2">
                          <span className="text-xl">{personne === 'papa' ? '👨' : '👩'}</span>
                          {getPersonneLabel(personne)}
                        </span>
                      </td>
                      <td className="p-3 border border-gray-300 text-slate-400" colSpan={2}>
                        Aucune note enregistrée
                      </td>
                    </tr>
                  )
                }
                return personneNotes.map((note, index) => (
                  <tr key={`${personne}-${note.id || index}`} className="border-b border-gray-200 hover:bg-slate-50 transition-colors">
                    <td className="p-3 border border-gray-300">
                      <span className="flex items-center gap-2 font-bold">
                        <span className="text-xl">{personne === 'papa' ? '👨' : '👩'}</span>
                        {getPersonneLabel(personne)}
                      </span>
                    </td>
                    <td className="p-3 border border-gray-300">
                      {note.annee}
                    </td>
                    <td className="p-3 border border-gray-300">
                      <div className="flex gap-1 items-center">
                        {[1, 2, 3, 4, 5].map(star => (
                          <span
                            key={star}
                            className={`text-2xl ${
                              note.note >= star ? 'opacity-100' : 'opacity-30'
                            }`}
                          >
                            ⭐
                          </span>
                        ))}
                        <span className="ml-2 text-slate-600 font-medium">
                          ({note.note}/5)
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function getPersonneLabel(personne: string) {
  if (personne === "papa") return "Papa";
  if (personne === "maman") return "Maman";
  return personne;
}
