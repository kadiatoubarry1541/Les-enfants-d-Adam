import { useState, useRef, useEffect } from 'react';

interface QuickMediaCaptureProps {
  onCapture: (file: File, type: 'photo' | 'video' | 'audio') => void;
  onClose?: () => void;
  allowedTypes?: ('photo' | 'video' | 'audio')[];
  autoPublish?: boolean;
}

export function QuickMediaCapture({ 
  onCapture, 
  onClose,
  allowedTypes = ['photo', 'video', 'audio'],
  autoPublish = true
}: QuickMediaCaptureProps) {
  const [mediaType, setMediaType] = useState<'photo' | 'video' | 'audio'>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Nettoyer les ressources
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Démarrer la caméra/microphone
  const startCapture = async () => {
    try {
      setIsCapturing(true);
      const constraints = mediaType === 'audio' 
        ? { audio: true } 
        : { audio: true, video: true };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (mediaType === 'photo' || mediaType === 'video') {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }
    } catch (error) {
      console.error('Erreur accès média:', error);
      alert('Impossible d\'accéder à la caméra/microphone');
      setIsCapturing(false);
    }
  };

  // Capturer une photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setCapturedMedia(file);
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
            stopCapture();
            
            if (autoPublish) {
              onCapture(file, 'photo');
            }
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  // Démarrer l'enregistrement vidéo/audio
  const startRecording = () => {
    if (!streamRef.current) return;
    
    const mimeType = mediaType === 'audio' 
      ? 'audio/webm' 
      : 'video/webm';
    
    const recorder = new MediaRecorder(streamRef.current, { mimeType });
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];
    
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };
    
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const extension = mediaType === 'audio' ? 'webm' : 'webm';
      const file = new File([blob], `${mediaType}-${Date.now()}.${extension}`, { type: mimeType });
      
      setCapturedMedia(file);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      stopCapture();
      
      if (autoPublish) {
        onCapture(file, mediaType);
      }
    };
    
    recorder.start();
    setIsRecording(true);
  };

  // Arrêter l'enregistrement
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Arrêter la capture
  const stopCapture = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Choisir depuis la galerie
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const type = file.type.startsWith('image/') ? 'photo' :
                   file.type.startsWith('video/') ? 'video' : 'audio';
      
      if (allowedTypes.includes(type)) {
        setCapturedMedia(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        
        if (autoPublish) {
          onCapture(file, type);
        }
      }
    }
  };

  // Publier manuellement
  const handlePublish = () => {
    if (capturedMedia) {
      const type = capturedMedia.type.startsWith('image/') ? 'photo' :
                   capturedMedia.type.startsWith('video/') ? 'video' : 'audio';
      onCapture(capturedMedia, type);
    }
  };

  // Réinitialiser
  const handleReset = () => {
    setCapturedMedia(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    stopCapture();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black bg-opacity-50">
        <button
          onClick={onClose || handleReset}
          className="text-white text-xl font-bold"
        >
          ✕
        </button>
        <div className="flex gap-2">
          {allowedTypes.includes('photo') && (
            <button
              onClick={() => {
                handleReset();
                setMediaType('photo');
              }}
              className={`px-4 py-2 rounded-lg ${
                mediaType === 'photo' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              📷 Photo
            </button>
          )}
          {allowedTypes.includes('video') && (
            <button
              onClick={() => {
                handleReset();
                setMediaType('video');
              }}
              className={`px-4 py-2 rounded-lg ${
                mediaType === 'video' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              🎥 Vidéo
            </button>
          )}
          {allowedTypes.includes('audio') && (
            <button
              onClick={() => {
                handleReset();
                setMediaType('audio');
              }}
              className={`px-4 py-2 rounded-lg ${
                mediaType === 'audio' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              🎤 Audio
            </button>
          )}
        </div>
        <div className="w-10"></div>
      </div>

      {/* Zone de capture */}
      <div className="flex-1 flex items-center justify-center relative">
        {!isCapturing && !previewUrl && (
          <div className="text-center text-white">
            <p className="text-xl mb-4">Appuyez pour capturer</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={startCapture}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                📷 {mediaType === 'photo' ? 'Prendre une photo' : mediaType === 'video' ? 'Filmer' : 'Enregistrer audio'}
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                🖼️ Galerie
              </button>
            </div>
          </div>
        )}

        {isCapturing && !isRecording && (
          <div className="relative w-full h-full">
            {mediaType !== 'audio' && (
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-full object-contain"
              />
            )}
            {mediaType === 'audio' && (
              <div className="text-center text-white">
                <div className="text-6xl mb-4">🎤</div>
                <p className="text-xl">Enregistrement audio</p>
              </div>
            )}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
              {mediaType === 'photo' && (
                <button
                  onClick={capturePhoto}
                  className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center text-2xl hover:scale-110 transition-transform"
                >
                  📷
                </button>
              )}
              {(mediaType === 'video' || mediaType === 'audio') && (
                <>
                  <button
                    onClick={startRecording}
                    className="w-16 h-16 bg-red-600 rounded-full border-4 border-white flex items-center justify-center text-white hover:scale-110 transition-transform"
                  >
                    🔴
                  </button>
                  <button
                    onClick={stopCapture}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg"
                  >
                    Annuler
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {isRecording && (
          <div className="text-center text-white">
            <div className="text-6xl mb-4 animate-pulse">🔴</div>
            <p className="text-xl mb-4">Enregistrement en cours...</p>
            <button
              onClick={stopRecording}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              ⏹️ Arrêter
            </button>
          </div>
        )}

        {previewUrl && !autoPublish && (
          <div className="text-center text-white">
            {mediaType === 'photo' && (
              <img src={previewUrl} alt="Preview" className="max-w-full max-h-96 mx-auto rounded-lg" />
            )}
            {mediaType === 'video' && (
              <video src={previewUrl} controls className="max-w-full max-h-96 mx-auto rounded-lg" />
            )}
            {mediaType === 'audio' && (
              <div>
                <div className="text-6xl mb-4">🎵</div>
                <audio src={previewUrl} controls className="w-full max-w-md mx-auto" />
              </div>
            )}
            <div className="flex gap-4 justify-center mt-4">
              <button
                onClick={handlePublish}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                ✅ Publier
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                🔄 Recommencer
              </button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,audio/*"
        capture="environment"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </div>
  );
}

