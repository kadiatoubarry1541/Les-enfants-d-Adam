import type { ReactNode } from 'react'

export function Field({ label, help, error, children }: { label: string, help?: string, error?: string, children: ReactNode }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
      {help && <small>{help}</small>}
      {error && <span className="error">{error}</span>}
    </div>
  )
}

export function Select({ value, onChange, options, placeholder }: { value?: string, onChange: (v: string)=>void, options: string[], placeholder?: string }) {
  return (
    <select value={value || ''} onChange={(e)=>onChange(e.target.value)}>
      <option value="">{placeholder || 'Sélectionner'}</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  )
}

export function SelectCode({ value, onChange, options, placeholder }: { value?: string, onChange: (v: string)=>void, options: {label:string,code:string}[], placeholder?: string }) {
  return (
    <select value={value || ''} onChange={(e)=>onChange(e.target.value)}>
      <option value="">{placeholder || 'Sélectionner'}</option>
      {options.map(opt => <option key={opt.code} value={opt.code}>{opt.label}</option>)}
    </select>
  )
}

export function CheckboxGroup({ options, values, onChange }: { options: string[], values: string[], onChange: (next: string[])=>void }) {
  const toggle = (opt: string) => {
    const exists = values.includes(opt)
    const next = exists ? values.filter(v=>v!==opt) : [...values, opt]
    onChange(next)
  }
  return (
    <div className="stack">
      {options.map(opt => (
        <label key={opt} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="checkbox" checked={values.includes(opt)} onChange={()=>toggle(opt)} />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  )
}

export function FilePicker({ accept, onFile }: { accept?: string, onFile: (file: File)=>void }) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFile(file);
      
      // Créer un aperçu
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreview(url);
      } else {
        setPreview(null);
      }
    }
  };

  const handleCaptureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFile(file);
      
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreview(url);
      } else {
        setPreview(null);
      }
    }
  };

  const removePhoto = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setSelectedFile(null);
    setPreview(null);
    onFile(null as any); // Notifier qu'aucun fichier n'est sélectionné
  };

  return (
    <div className="photo-upload-container" style={{ width: '100%' }}>
      {/* Inputs cachés */}
      <input
        type="file"
        id="file-picker-gallery"
        accept={accept || "image/*,video/*,audio/*"}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <input
        type="file"
        id="file-picker-capture"
        capture="environment"
        accept={accept || "image/*,video/*,audio/*"}
        onChange={handleCaptureChange}
        style={{ display: 'none' }}
      />

      {preview && selectedFile ? (
        <div className="photo-preview" style={{ 
          position: 'relative', 
          width: '100%', 
          marginBottom: '1rem',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <img 
            src={preview} 
            alt="Aperçu" 
            style={{ 
              width: '100%', 
              height: '200px', 
              objectFit: 'cover',
              borderRadius: '8px',
              border: '2px solid #3b82f6'
            }} 
          />
          <button
            type="button"
            onClick={removePhoto}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
            title="Supprimer la photo"
          >
            ×
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          flexDirection: 'column',
          width: '100%'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
            <label
              htmlFor="file-picker-capture"
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'center',
                fontWeight: '500',
                fontSize: '0.875rem',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
              }}
            >
              📷 Prendre une photo
            </label>
            <label
              htmlFor="file-picker-gallery"
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'center',
                fontWeight: '500',
                fontSize: '0.875rem',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#059669';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#10b981';
              }}
            >
              🖼️ Choisir depuis galerie
            </label>
          </div>
          <small style={{ color: '#6b7280', fontSize: '0.75rem', textAlign: 'center' }}>
            Formats acceptés: JPG, PNG, GIF (max 5MB)
          </small>
        </div>
      )}
    </div>
  );
}


