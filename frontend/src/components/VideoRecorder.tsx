import { useState, useRef, useEffect } from 'react'

interface VideoRecorderProps {
  onVideoRecorded: (videoBlob: Blob) => void
  maxDuration?: number // en minutes
}

export function VideoRecorder({ onVideoRecorded, maxDuration = 3 }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [hasPermission, setHasPermission] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cameraReady, setCameraReady] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const maxDurationMs = maxDuration * 60 * 1000 // Convertir en millisecondes

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      setError(null)
      console.log('🎥 Demande d\'accès à la caméra...')
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
      
      console.log('✅ Stream caméra obtenu:', stream)
      streamRef.current = stream
      
      if (videoRef.current) {
        console.log('📹 Configuration de l\'élément vidéo...')
        videoRef.current.srcObject = stream
        
        // Forcer l'affichage immédiat
        videoRef.current.style.display = 'block'
        videoRef.current.style.visibility = 'visible'
        videoRef.current.style.opacity = '1'
        
        // Événements pour s'assurer que la vidéo s'affiche
        videoRef.current.onloadstart = () => {
          console.log('📹 Début du chargement vidéo')
        }
        
        videoRef.current.onloadedmetadata = () => {
          console.log('📹 Métadonnées vidéo chargées')
          videoRef.current?.play().then(() => {
            console.log('✅ Vidéo en cours de lecture')
          }).catch(err => {
            console.error('❌ Erreur lecture vidéo:', err)
          })
        }
        
        videoRef.current.oncanplay = () => {
          console.log('📹 Vidéo peut être lue')
          videoRef.current?.play().then(() => {
            console.log('✅ Vidéo démarrée avec succès')
          }).catch(err => {
            console.error('❌ Erreur lecture vidéo:', err)
          })
        }
        
        videoRef.current.onplay = () => {
          console.log('🎬 Vidéo en cours de lecture - Tu devrais te voir maintenant!')
          setCameraReady(true)
        }
        
        // Forcer la lecture immédiate
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.play().then(() => {
              console.log('✅ Lecture forcée réussie')
              setCameraReady(true)
            }).catch(err => {
              console.error('❌ Erreur lecture forcée:', err)
              setError('Erreur lors du démarrage de la vidéo. Vérifiez que votre caméra n\'est pas utilisée par une autre application.')
            })
          }
        }, 100)
        
        // Vérification supplémentaire après 2 secondes
        setTimeout(() => {
          if (videoRef.current && videoRef.current.readyState >= 2) {
            console.log('✅ Vidéo prête après vérification')
            setCameraReady(true)
          } else {
            console.warn('⚠️ Vidéo pas encore prête après 2 secondes')
          }
        }, 2000)
      }
      
      setHasPermission(true)
      console.log('✅ Caméra démarrée avec succès')
    } catch (err) {
      setError('Impossible d\'accéder à la caméra. Vérifiez vos permissions.')
      console.error('Erreur caméra:', err)
    }
  }

  const startRecording = () => {
    if (!streamRef.current) return

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm;codecs=vp9,opus'
      })
      
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' })
        onVideoRecorded(videoBlob)
        setIsRecording(false)
        setIsPaused(false)
        setDuration(0)
      }

      mediaRecorder.start(1000) // Collecter les données chaque seconde
      setIsRecording(true)
      
      // Timer pour la durée
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1000
          if (newDuration >= maxDurationMs) {
            stopRecording()
            return maxDurationMs
          }
          return newDuration
        })
      }, 1000)

    } catch (err) {
      setError('Erreur lors du démarrage de l\'enregistrement')
      console.error('Erreur enregistrement:', err)
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        setIsPaused(false)
      } else {
        mediaRecorderRef.current.pause()
        setIsPaused(true)
      }
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progress = (duration / maxDurationMs) * 100

  if (!hasPermission) {
    return (
      <div className="video-recorder">
        <div className="camera-setup">
          <h3>Configuration de la caméra</h3>
          <p>Pour enregistrer votre vidéo, nous avons besoin d'accéder à votre caméra et microphone.</p>
          <button className="btn" onClick={startCamera}>
            Autoriser l'accès à la caméra
          </button>
          {error && <div className="error">{error}</div>}
        </div>
      </div>
    )
  }

  return (
    <div className="video-recorder">
      <div className="video-container">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="camera-preview"
          style={{
            width: '100%',
            height: '400px',
            objectFit: 'cover',
            backgroundColor: '#000',
            transform: 'scaleX(-1)', // Miroir pour se voir comme dans un miroir
            visibility: 'visible',
            opacity: 1,
            display: 'block',
            position: 'relative',
            zIndex: 1
          }}
        />
        
        {!isRecording && hasPermission && !cameraReady && (
          <div className="camera-preview-overlay">
            <div className="preview-text">
              <h4>📹 Chargement de la caméra...</h4>
              <p>Veuillez patienter pendant que nous initialisons votre caméra.</p>
              <div className="loading-spinner">⏳</div>
            </div>
          </div>
        )}
        
        {!isRecording && hasPermission && cameraReady && (
          <div className="camera-preview-overlay">
            <div className="preview-text">
              <h4>📹 Caméra prête !</h4>
              <p>Vous devriez vous voir maintenant. Si l'écran est toujours noir, vérifiez que votre caméra n'est pas utilisée par une autre application.</p>
            </div>
          </div>
        )}
        
        {isRecording && (
          <div className="recording-overlay">
            <div className="recording-indicator">
              <div className="recording-dot"></div>
              <span>ENREGISTREMENT</span>
            </div>
            <div className="recording-timer">
              {formatTime(duration)} / {maxDuration}min
            </div>
          </div>
        )}
      </div>

      <div className="recording-controls">
        {!isRecording ? (
          <div className="recording-buttons">
            <button className="btn" onClick={startRecording}>
              Commencer l'enregistrement
            </button>
            {!cameraReady && (
              <button className="btn secondary" onClick={startCamera}>
                🔄 Redémarrer la caméra
              </button>
            )}
          </div>
        ) : (
          <div className="recording-buttons">
            <button 
              className={`btn ${isPaused ? 'secondary' : ''}`}
              onClick={pauseRecording}
            >
              {isPaused ? 'Reprendre' : 'Pause'}
            </button>
            <button className="btn" onClick={stopRecording}>
              Arrêter
            </button>
          </div>
        )}
      </div>

      {isRecording && (
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="progress-text">
            {formatTime(duration)} / {maxDuration}min
          </div>
        </div>
      )}

      <div className="video-instructions">
        <h4>Instructions d'enregistrement :</h4>
        <ul>
          <li>Parlez clairement et regardez la caméra</li>
          <li>Assurez-vous d'être dans un endroit calme</li>
          <li>L'enregistrement s'arrêtera automatiquement après {maxDuration} minutes</li>
          <li>Vous pouvez mettre en pause et reprendre si nécessaire</li>
        </ul>
        
        <div className="debug-info">
          <h5>🔧 Debug Info :</h5>
          <p><strong>Caméra autorisée :</strong> {hasPermission ? '✅ Oui' : '❌ Non'}</p>
          <p><strong>Caméra prête :</strong> {cameraReady ? '✅ Oui' : '❌ Non'}</p>
          <p><strong>En cours d'enregistrement :</strong> {isRecording ? '✅ Oui' : '❌ Non'}</p>
          <p><strong>Stream actif :</strong> {streamRef.current ? '✅ Oui' : '❌ Non'}</p>
          <p><strong>Élément vidéo :</strong> {videoRef.current ? '✅ Oui' : '❌ Non'}</p>
          <p><strong>Durée :</strong> {formatTime(duration)}</p>
          {error && <p><strong>Erreur :</strong> <span className="error">{error}</span></p>}
        </div>
      </div>
    </div>
  )
}
