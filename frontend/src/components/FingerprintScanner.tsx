import { useState, useRef, useEffect } from 'react'

interface FingerprintScannerProps {
  onFingerprintCaptured: (fingerprintData: string) => void
  onComplete: () => void
}

export function FingerprintScanner({ onFingerprintCaptured, onComplete }: FingerprintScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isCaptured, setIsCaptured] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const countdownRef = useRef<NodeJS.Timeout | null>(null)
  const captureRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearTimeout(countdownRef.current)
      if (captureRef.current) clearTimeout(captureRef.current)
    }
  }, [])

  const generateFingerprintPattern = (): string => {
    // Simulation d'un pattern d'empreinte digitale unique
    const pattern = Array.from({ length: 64 }, () => 
      Math.random().toString(36).substring(2, 15)
    ).join('')
    return btoa(pattern) // Encoder en base64 pour simuler des données binaires
  }

  const drawFingerprintCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, isCaptured: boolean) => {
    // Cercle principal
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fillStyle = isCaptured ? '#ffffff' : '#000000'
    ctx.fill()
    ctx.strokeStyle = isCaptured ? '#000000' : '#333333'
    ctx.lineWidth = 2
    ctx.stroke()

    if (isCaptured) {
      // Dessiner des lignes d'empreinte
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 1
      
      for (let i = 0; i < 20; i++) {
        const angle = (i * Math.PI * 2) / 20
        const startRadius = radius * 0.3
        const endRadius = radius * 0.9
        
        const startX = x + Math.cos(angle) * startRadius
        const startY = y + Math.sin(angle) * startRadius
        const endX = x + Math.cos(angle) * endRadius
        const endY = y + Math.sin(angle) * endRadius
        
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
      }

      // Dessiner des cercles concentriques
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath()
        ctx.arc(x, y, radius * (0.2 + i * 0.2), 0, 2 * Math.PI)
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }
  }

  const startScanning = () => {
    setError(null)
    setIsScanning(true)
    setIsCaptured(false)
    setCountdown(20) // 20 secondes

    // Démarrer le countdown
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Temps écoulé, capturer automatiquement
          captureFingerprint()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Simuler la capture après 3-5 secondes
    const randomDelay = Math.random() * 2000 + 3000 // Entre 3 et 5 secondes
    captureRef.current = setTimeout(() => {
      if (isScanning && !isCaptured) {
        captureFingerprint()
      }
    }, randomDelay)
  }

  const captureFingerprint = () => {
    if (isCaptured) return

    setIsCaptured(true)
    setIsScanning(false)
    
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
    }
    if (captureRef.current) {
      clearTimeout(captureRef.current)
    }

    // Générer les données d'empreinte
    const fingerprintData = generateFingerprintPattern()
    onFingerprintCaptured(fingerprintData)

    // Dessiner l'empreinte sur le canvas
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const radius = Math.min(canvas.width, canvas.height) / 2 - 10
        
        drawFingerprintCircle(ctx, centerX, centerY, radius, true)
      }
    }

    // Attendre 2 secondes avant de permettre la validation
    setTimeout(() => {
      onComplete()
    }, 2000)
  }

  const resetScanner = () => {
    setIsScanning(false)
    setIsCaptured(false)
    setCountdown(0)
    setError(null)
    
    if (countdownRef.current) clearInterval(countdownRef.current)
    if (captureRef.current) clearTimeout(captureRef.current)

    // Effacer le canvas
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const radius = Math.min(canvas.width, canvas.height) / 2 - 10
        
        drawFingerprintCircle(ctx, centerX, centerY, radius, false)
      }
    }
  }

  return (
    <div className="fingerprint-scanner">
      <div className="scanner-header">
        <h3>Enregistrement de l'empreinte digitale</h3>
        <p>Posez votre doigt sur le cercle ci-dessous pour enregistrer votre empreinte</p>
      </div>

      <div className="scanner-container">
        <canvas
          ref={canvasRef}
          width={200}
          height={200}
          className="fingerprint-canvas"
        />
        
        {isScanning && (
          <div className="scanning-overlay">
            <div className="scanning-indicator">
              <div className="scanning-dot"></div>
              <span>SCANNING...</span>
            </div>
            <div className="countdown">
              {countdown} secondes restantes
            </div>
          </div>
        )}

        {isCaptured && (
          <div className="captured-overlay">
            <div className="success-indicator">
              <div className="checkmark">✓</div>
              <span>EMPREINTE CAPTURÉE</span>
            </div>
          </div>
        )}
      </div>

      <div className="scanner-controls">
        {!isScanning && !isCaptured && (
          <button className="btn" onClick={startScanning}>
            Commencer l'enregistrement
          </button>
        )}
        
        {isCaptured && (
          <button className="btn secondary" onClick={resetScanner}>
            Recommencer
          </button>
        )}
      </div>

      {isScanning && (
        <div className="scanner-instructions">
          <h4>Instructions :</h4>
          <ul>
            <li>Posez votre doigt au centre du cercle noir</li>
            <li>Maintenez une pression légère et constante</li>
            <li>Ne bougez pas pendant la capture</li>
            <li>L'empreinte sera capturée automatiquement</li>
          </ul>
        </div>
      )}

      {error && (
        <div className="error">
          {error}
        </div>
      )}
    </div>
  )
}
