import React from "react";

interface SecurityIconProps {
  className?: string;
  size?: number;
}

export function SecurityIcon({ className = "", size = 24 }: SecurityIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Bouclier avec bordure noire épaisse, moitié gauche rouge, moitié droite blanche, bordure dentelée */}
      
      {/* Bordure extérieure noire épaisse */}
      <path
        d="M4 5L12 2L20 5V19C20 21 18 22 12 22C6 22 4 21 4 19V5Z"
        fill="none"
        stroke="#000000"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Section gauche ROUGE avec bordure dentelée (saw-tooth) pointant vers la droite */}
      <path
        d="M5 6L5 18C5 19 6 19.5 12 20L12 19L13 18.5L12 18L13 17.5L12 17L13 16.5L12 16L13 15.5L12 15L13 14.5L12 14L13 13.5L12 13L13 12.5L12 12L13 11.5L12 11L13 10.5L12 10L13 9.5L12 9L13 8.5L12 8L13 7.5L12 7L13 6.5L12 4L5 6Z"
        fill="#ef4444"
      />
      
      {/* Section droite BLANCHE */}
      <path
        d="M12 6.5L13 7L12 7.5L13 8L12 8.5L13 9L12 9.5L13 10L12 10.5L13 11L12 11.5L13 12L12 12.5L13 13L12 13.5L13 14L12 14.5L13 15L12 15.5L13 16L12 16.5L13 17L12 17.5L13 18L12 18.5L13 19L12 20C18 19.5 19 19 19 18V6L12 4L12 6.5Z"
        fill="#ffffff"
      />
      
      {/* Bordure dentelée noire (saw-tooth pattern) - pointant vers la droite */}
      <path
        d="M12 6.5L13 7L12 7.5L13 8L12 8.5L13 9L12 9.5L13 10L12 10.5L13 11L12 11.5L13 12L12 12.5L13 13L12 13.5L13 14L12 14.5L13 15L12 15.5L13 16L12 16.5L13 17L12 17.5L13 18L12 18.5L13 19L12 20"
        fill="none"
        stroke="#000000"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
