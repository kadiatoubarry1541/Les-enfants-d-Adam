import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function DeceasedFamilyCheck() {
  const [, setIsFamilyMember] = useState<boolean | null>(null)
  const navigate = useNavigate()

  const handleFamilyChoice = (isFamily: boolean) => {
    setIsFamilyMember(isFamily)
    if (isFamily) {
      // Rediriger vers le choix de méthode d'enregistrement
      navigate('/defunt/choix')
    } else {
      // Rediriger vers une page d'information ou de contact
      alert('Pour enregistrer un défunt qui n\'est pas de votre famille, veuillez contacter l\'administration.')
      navigate('/')
    }
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
              onClick={() => handleFamilyChoice(true)}
            >
              Oui, je suis de la même famille
            </button>
            
            <button 
              className="btn secondary"
              onClick={() => handleFamilyChoice(false)}
            >
              Non, je ne suis pas de la même famille
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
