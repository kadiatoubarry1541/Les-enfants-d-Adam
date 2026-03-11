interface ScienceIconProps {
  className?: string;
  size?: number;
}

export function ScienceIcon({ className = "", size = 24 }: ScienceIconProps) {
  const s = size;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={s}
      height={s}
      className={className}
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 3h6" />
        <path d="M10 3v5.5L6.5 15a4 4 0 0 0 3.5 6h4a4 4 0 0 0 3.5-6L14 8.5V3" />
        <path d="M8 15h8" />
        <path d="M7 19h10" />
        <circle cx="9" cy="11.5" r="0.8" />
        <circle cx="15" cy="11.5" r="0.8" />
      </g>
    </svg>
  );
}

