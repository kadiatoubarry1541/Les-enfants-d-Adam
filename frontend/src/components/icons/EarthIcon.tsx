import React from "react";

interface EarthIconProps {
  className?: string;
  size?: number;
}

export function EarthIcon({ className = "", size = 24 }: EarthIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Globe terrestre avec continents */}
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="url(#earthGradient)"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Continents stylisés */}
      <path
        d="M8 9C8 9 9 8 10 8C11 8 12 9 12 10C12 11 11 12 10 12C9 12 8 11 8 10C8 9.5 8 9 8 9Z"
        fill="url(#continentGradient)"
        opacity="0.8"
      />
      <path
        d="M14 11C14 11 15 10 16 10C17 10 18 11 18 12C18 13 17 14 16 14C15 14 14 13 14 12C14 11.5 14 11 14 11Z"
        fill="url(#continentGradient)"
        opacity="0.8"
      />
      <path
        d="M6 14C6 14 7 13 8 13C9 13 10 14 10 15C10 16 9 17 8 17C7 17 6 16 6 15C6 14.5 6 14 6 14Z"
        fill="url(#continentGradient)"
        opacity="0.8"
      />
      <path
        d="M16 15C16 15 17 14 18 14C19 14 20 15 20 16C20 17 19 18 18 18C17 18 16 17 16 16C16 15.5 16 15 16 15Z"
        fill="url(#continentGradient)"
        opacity="0.8"
      />
      {/* Lignes de latitude/longitude */}
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.3"
      />
      <line
        x1="2"
        y1="12"
        x2="22"
        y2="12"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.3"
      />
      <line
        x1="12"
        y1="2"
        x2="12"
        y2="22"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.3"
      />
      {/* Définitions des gradients */}
      <defs>
        <linearGradient id="earthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A90E2" />
          <stop offset="50%" stopColor="#5BA3F5" />
          <stop offset="100%" stopColor="#6BB6FF" />
        </linearGradient>
        <linearGradient id="continentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2D5016" />
          <stop offset="100%" stopColor="#4A7C2A" />
        </linearGradient>
      </defs>
    </svg>
  );
}

