import React from "react";

interface ActivityPageIconProps {
  className?: string;
  size?: number;
}

/** Logo page Activité : cible / objectif + feuille de travail (activité professionnelle) */
export function ActivityPageIcon({ className = "", size = 24 }: ActivityPageIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Cible / objectif */}
      <circle
        cx="12"
        cy="10"
        r="6"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="12"
        cy="10"
        r="3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="10" r="1" fill="currentColor" />
      {/* Feuille / document en bas - activité */}
      <path
        d="M6 18h12v2H6v-2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 14h8M8 16h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
