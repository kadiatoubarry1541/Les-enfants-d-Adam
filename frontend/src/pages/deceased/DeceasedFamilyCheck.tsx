import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const RELATIONS = [
  { value: 'pere', label: 'Père' },
  { value: 'mere', label: 'Mère' },
  { value: 'fils', label: 'Fils' },
  { value: 'fille', label: 'Fille' },
  { value: 'grand-pere', label: 'Grand-père' },
  { value: 'grand-mere', label: 'Grand-mère' },
  { value: 'arriere-grand-pere', label: 'Arrière grand-père' },
  { value: 'arriere-grand-mere', label: 'Arrière grand-mère' },
  { value: 'autre', label: 'Autre membre de la famille' }
] as const

export function DeceasedFamilyCheck() {
  const [isFamilyMember, setIsFamilyMember] = useState<boolean | null>(null)
  const [relation, setRelation] = useState<string>('')
  const navigate = useNavigate()

  const handleYes = () => {
    setIsFamilyMember(true)
    if (!relation) {
      alert('Merci de choisir votre lien de parenté avec ce défunt (mère, père, fils, fille, etc.).')
      return
    }
    // Sauvegarder le lien de parenté pour l’étape suivante
    localStorage.setItem('defunt_relation', relation)
    // Rediriger vers le choix de méthode d'enregistrement
    navigate('/defunt/choix')
  }

  const handleNo = () => {
    setIsFamilyMember(false)
    alert('Pour enregistrer un défunt qui n\'est pas de votre famille, veuillez contacter l\'administration.')
    navigate('/')
  }

  return (
    <div className="stack">
      <h2>Enregistrement d'un défunt</h2>
      <div className="card">
        <div className="family-check">
          <h3>Êtes-vous de la même famille ?</h3>
          <p>Cette question est importante pour vérifier votre autorisation à enregistrer ce défunt.</p>
          
          <div className="family-options">
            <button 
              className="btn"
              onClick={handleYes}
            >
              Oui, je suis de la même famille
            </button>
            
            <button 
              className="btn secondary"
              onClick={handleNo}
            >
              Non, je ne suis pas de la même famille
            </button>
          </div>

          {isFamilyMember !== false && (
            <div className="mt-6">
              <h4>Quel est votre lien avec ce défunt ?</h4>
              <p className="text-sm text-gray-600 mb-2">
                Ce lien permet de savoir où placer ce défunt dans l&apos;arbre (mère, père, fils, fille, grands-parents...).
              </p>
              <select
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Choisir un lien de parenté</option>
                {RELATIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
