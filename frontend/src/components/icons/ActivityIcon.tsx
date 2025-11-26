import React from "react";

interface ActivityIconProps {
  className?: string;
  size?: number;
}

export function ActivityIcon({ className = "", size = 24 }: ActivityIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Graphique avec barres croissantes - symbole universellement reconnu pour les activités */}
      {/* Ligne de base */}
      <path
        d="M3 20H21"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Barres de croissance */}
      <rect
        x="5"
        y="15"
        width="3"
        height="5"
        fill="currentColor"
        rx="0.5"
      />
      <rect
        x="9"
        y="10"
        width="3"
        height="10"
        fill="currentColor"
        rx="0.5"
      />
      <rect
        x="13"
        y="6"
        width="3"
        height="14"
        fill="currentColor"
        rx="0.5"
      />
      <rect
        x="17"
        y="3"
        width="3"
        height="17"
        fill="currentColor"
        rx="0.5"
      />
      {/* Flèche vers le haut pour montrer la croissance */}
      <path
        d="M20 2L21.5 3.5L20 5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
