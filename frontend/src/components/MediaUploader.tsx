import { useState, useRef } from 'react'

interface MediaUploaderProps {
  onClose: () => void
  onUpload: (mediaData: { type: 'photo' | 'video' | 'audio', url: string, caption?: string }) => void
}

export function MediaUploader({ onClose, onUpload }: MediaUploaderProps) {
  const [mediaType, setMediaType] = useState<'photo' | 'video' | 'audio'>('photo')
  const [caption, setCaption] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [mediaUrl, setMediaUrl] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  // const audioRef = useRef<HTMLAudioElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setMediaUrl(url)
    }
  }

  const startCameraCapture = async () => {
    try {
      setIsCapturing(true)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: mediaType !== 'audio', 
        audio: true 
      })
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Erreur accès caméra/micro:', error)
      alert('Impossible d\'accéder à la caméra ou au microphone')
      setIsCapturing(false)
    }
  }

  const stopCameraCapture = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsCapturing(false)
  }

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        const dataUrl = canvas.toDataURL('image/jpeg')
        setMediaUrl(dataUrl)
        stopCameraCapture()
      }
    }
  }

  const startVideoRecording = () => {
    if (streamRef.current) {
      const mediaRecorder = new MediaRecorder(streamRef.current)
      mediaRecorderRef.current = mediaRecorder
      
      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        setMediaUrl(url)
      }
      
      mediaRecorder.start()
      setIsRecording(true)
    }
  }

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      stopCameraCapture()
    }
  }

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setMediaUrl(url)
      }
      
      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Erreur enregistrement audio:', error)
      alert('Impossible d\'accéder au microphone')
    }
  }

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }

  const handleUpload = () => {
    if (mediaUrl) {
      onUpload({
        type: mediaType,
        url: mediaUrl,
        caption: caption.trim() || undefined
      })
    }
  }

  const handleCancel = () => {
    stopCameraCapture()
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop()
      }
      setIsRecording(false)
    }
    onClose()
  }

  return (
    <div>
      <div className="space-y-6">
        {/* Sélection du type de média */}
        <div>
          <h4 className="text-lg font-semibold text-slate-700 mb-3">Type de média</h4>
          <div className="flex gap-3">
            <button
              className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                mediaType === 'photo' 
                  ? 'border-blue-600 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setMediaType('photo')}
            >
              📷 Photo
            </button>
            <button
              className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                mediaType === 'video' 
                  ? 'border-blue-600 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setMediaType('video')}
            >
              🎥 Vidéo
            </button>
            <button
              className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                mediaType === 'audio' 
                  ? 'border-blue-600 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setMediaType('audio')}
            >
              🎤 Audio
            </button>
          </div>
        </div>

        {/* Zone de capture/prévisualisation */}
        <div className="bg-slate-50 rounded-lg p-6 border-2 border-dashed border-slate-300">
          {mediaType === 'photo' && (
            <div>
              {!isCapturing ? (
                <div className="flex gap-3 justify-center">
                  <button 
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📁 Choisir une photo
                  </button>
                  <button 
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
                    onClick={startCameraCapture}
                  >
                    📷 Prendre une photo
                  </button>
                </div>
              ) : (
                <div>
                  <video ref={videoRef} autoPlay muted className="w-full h-64 bg-black rounded-lg mb-4" />
                  <div className="flex gap-3 justify-center">
                    <button 
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
                      onClick={capturePhoto}
                    >
                      📸 Capturer
                    </button>
                    <button 
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                      onClick={stopCameraCapture}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {mediaType === 'video' && (
            <div>
              {!isCapturing ? (
                <div className="flex gap-3 justify-center">
                  <button 
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📁 Choisir une vidéo
                  </button>
                  <button 
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
                    onClick={startCameraCapture}
                  >
                    🎥 Filmer
                  </button>
                </div>
              ) : (
                <div>
                  <video ref={videoRef} autoPlay muted className="w-full h-64 bg-black rounded-lg mb-4" />
                  <div className="flex gap-3 justify-center">
                    {!isRecording ? (
                      <button 
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
                        onClick={startVideoRecording}
                      >
                        🔴 Commencer l'enregistrement
                      </button>
                    ) : (
                      <button 
                        className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200 animate-pulse"
                        onClick={stopVideoRecording}
                      >
                        ⏹️ Arrêter l'enregistrement
                      </button>
                    )}
                    <button 
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                      onClick={stopCameraCapture}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {mediaType === 'audio' && (
            <div>
              {!isRecording ? (
                <div className="flex gap-3 justify-center">
                  <button 
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📁 Choisir un fichier audio
                  </button>
                  <button 
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
                    onClick={startAudioRecording}
                  >
                    🎤 Enregistrer un audio
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="inline-flex items-center gap-3 bg-red-50 border-2 border-red-200 rounded-lg px-6 py-4 mb-4">
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                    <span className="text-red-700 font-semibold">Enregistrement en cours...</span>
                  </div>
                  <div>
                    <button 
                      className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200"
                      onClick={stopAudioRecording}
                    >
                      ⏹️ Arrêter l'enregistrement
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Prévisualisation du média */}
          {mediaUrl && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-slate-700 mb-3">Aperçu</h4>
              {mediaType === 'photo' && (
                <img src={mediaUrl} alt="Aperçu" className="w-full max-h-64 object-contain rounded-lg" />
              )}
              {mediaType === 'video' && (
                <video src={mediaUrl} controls className="w-full max-h-64 rounded-lg" />
              )}
              {mediaType === 'audio' && (
                <audio src={mediaUrl} controls className="w-full" />
              )}
            </div>
          )}
        </div>

        {/* Champ de description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Description (optionnelle):</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Ajoutez une description..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        {/* Input file caché */}
        <input
          ref={fileInputRef}
          type="file"
          accept={mediaType === 'photo' ? 'image/*' : mediaType === 'video' ? 'video/*' : 'audio/*'}
          capture={mediaType === 'photo' ? 'environment' : mediaType === 'video' ? 'environment' : undefined}
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />

        {/* Actions */}
        <div className="flex gap-3">
          <button 
            className={`flex-1 px-6 py-3 font-medium rounded-lg transition-colors duration-200 ${
              mediaUrl 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleUpload}
            disabled={!mediaUrl}
          >
            📤 Publier
          </button>
          <button 
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
            onClick={handleCancel}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  )
}

