import React, { useState } from "react";

interface GuineaCoatOfArmsIconProps {
  className?: string;
  size?: number;
}

export function GuineaCoatOfArmsIcon({ className = "", size = 64 }: GuineaCoatOfArmsIconProps) {
  const [imageError, setImageError] = useState(false);

  // Si l'image ne charge pas, afficher un emoji de secours
  if (imageError) {
    return (
      <span className={`text-4xl ${className}`} style={{ width: size, height: size * 1.3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        🇬🇳
      </span>
    );
  }

  // Utiliser l'image exacte fournie par l'utilisateur
  // Placez votre image PNG dans frontend/public/armoiries-guinee.png
  return (
    <img
      src="/armoiries-guinee.png"
      alt="Armoiries de la Guinée"
      width={size}
      height={size * 1.3}
      className={className}
      style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }}
      onError={() => {
        console.error('Image armoiries-guinee.png non trouvée. Placez votre image dans frontend/public/armoiries-guinee.png');
        setImageError(true);
      }}
    />
  );
}
