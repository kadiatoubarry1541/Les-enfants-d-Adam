import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'

export function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'verify' | 'reset'>('verify')
  const [numeroH, setNumeroH] = useState('')
  const [parentNumeroH, setParentNumeroH] = useState('')
  const [dateNaissance, setDateNaissance] = useState('')
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onVerify = async () => {
    setError('')
    if (!numeroH.trim() || !parentNumeroH.trim() || !dateNaissance.trim()) {
      setError('Veuillez remplir tous les champs.')
      return
    }
    setLoading(true)
    try {
      const result = await api.forgotPasswordVerify(
        api.normalizeNumeroH(numeroH),
        api.normalizeNumeroH(parentNumeroH),
        dateNaissance.trim()
      )
      if (result.success && result.token) {
        setToken(result.token)
        setStep('reset')
      } else {
        setError(result.message || 'Vérification échouée.')
      }
    } catch (e: any) {
      setError(e?.message || 'Erreur de connexion.')
    } finally {
      setLoading(false)
    }
  }

  const onReset = async () => {
    setError('')
    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Les deux mots de passe ne correspondent pas.')
      return
    }
    setLoading(true)
    try {
      const result = await api.forgotPasswordReset(token, newPassword)
      if (result.success) {
        navigate('/login', { state: { message: result.message } })
      } else {
        setError(result.message || 'Réinitialisation échouée.')
      }
    } catch (e: any) {
      setError(e?.message || 'Erreur de connexion.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="stack max-w-lg mx-auto w-full px-4 xs:px-2 py-8 sm:py-12">
      <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
        Mot de passe oublié
      </h1>
      <div className="card stack">
        {step === 'verify' ? (
          <>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Saisissez votre NumeroH, le NumeroH d’un de vos parents (père ou mère) et votre date de naissance pour vérifier votre identité.
            </p>
            <div className="field">
              <label>Votre NumeroH</label>
              <input
                value={numeroH}
                onChange={(e) => setNumeroH(e.target.value)}
                placeholder="Ex: G1C1P2R1E1F1 1"
              />
            </div>
            <div className="field">
              <label>NumeroH d’un parent (père ou mère)</label>
              <input
                value={parentNumeroH}
                onChange={(e) => setParentNumeroH(e.target.value)}
                placeholder="Ex: G1C1P2R1E1F1 0"
              />
            </div>
            <div className="field">
              <label>Votre date de naissance</label>
              <input
                type="date"
                value={dateNaissance}
                onChange={(e) => setDateNaissance(e.target.value)}
              />
            </div>
            {error && <div className="error">{error}</div>}
            <div className="actions">
              <button
                type="button"
                className="btn min-h-[44px]"
                onClick={onVerify}
                disabled={loading}
              >
                {loading ? 'Vérification…' : 'Vérifier mon identité'}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Choisissez un nouveau mot de passe (au moins 6 caractères).
            </p>
            <div className="field">
              <label>Nouveau mot de passe</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="field">
              <label>Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {error && <div className="error">{error}</div>}
            <div className="actions">
              <button
                type="button"
                className="btn min-h-[44px]"
                onClick={onReset}
                disabled={loading}
              >
                {loading ? 'Enregistrement…' : 'Enregistrer le nouveau mot de passe'}
              </button>
            </div>
            <button
              type="button"
              className="link text-sm text-gray-500 dark:text-gray-400"
              onClick={() => { setStep('verify'); setError(''); }}
            >
              ← Modifier les informations de vérification
            </button>
          </>
        )}
        <div className="text-center mt-4 text-gray-600 dark:text-gray-400 text-sm">
          <Link to="/login" className="text-indigo-500 dark:text-indigo-400 underline hover:no-underline">
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  )
}
