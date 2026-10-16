import React from 'react';

interface LogoProps {
  className?: string;
  useBrandColor?: boolean;
}

// 1. MITSUBISHI - Iconic Three Red Diamonds
export function MitsubishiLogo({ className = 'w-6 h-6', useBrandColor = true }: LogoProps) {
  const color = useBrandColor ? '#dc2626' : 'currentColor';
  return (
    <svg viewBox="0 0 100 100" className={className} fill={color} aria-label="Mitsubishi Motors">
      {/* Top Diamond */}
      <polygon points="50,10 64,34.25 50,58.5 36,34.25" />
      {/* Bottom Right Diamond */}
      <polygon points="50,58.5 78,58.5 92,82.75 64,82.75" />
      {/* Bottom Left Diamond */}
      <polygon points="50,58.5 22,58.5 8,82.75 36,82.75" />
    </svg>
  );
}

// 2. TOYOTA - Three Overlapping Ovals
export function ToyotaLogo({ className = 'w-6 h-6', useBrandColor = true }: LogoProps) {
  const strokeColor = useBrandColor ? '#eb0a1e' : 'currentColor';
  return (
    <svg viewBox="0 0 100 70" className={className} fill="none" stroke={strokeColor} aria-label="Toyota">
      {/* Outer horizontal ellipse */}
      <ellipse cx="50" cy="35" rx="46" ry="31" strokeWidth="6" />
      {/* Vertical inner ellipse */}
      <ellipse cx="50" cy="35" rx="16" ry="25" strokeWidth="5.5" />
      {/* Upper horizontal inner ellipse */}
      <ellipse cx="50" cy="24" rx="29" ry="12" strokeWidth="5.5" />
    </svg>
  );
}

// 3. NISSAN - Circular emblem with bold horizontal bar and NISSAN wordmark
export function NissanLogo({ className = 'w-6 h-6', useBrandColor = true }: LogoProps) {
  const barColor = useBrandColor ? '#c1121f' : 'currentColor';
  return (
    <svg viewBox="0 0 100 100" className={className} aria-label="Nissan">
      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6.5" />
      <rect x="6" y="37" width="88" height="26" rx="4" fill={barColor} />
      <text
        x="50"
        y="55"
        fill="#ffffff"
        fontSize="13"
        fontWeight="900"
        letterSpacing="2.5"
        textAnchor="middle"
        fontFamily="system-ui, sans-serif"
      >
        NISSAN
      </text>
    </svg>
  );
}

// 4. SUZUKI - Stylized Sharp Red 'S'
export function SuzukiLogo({ className = 'w-6 h-6', useBrandColor = true }: LogoProps) {
  const color = useBrandColor ? '#e30613' : 'currentColor';
  return (
    <svg viewBox="0 0 100 100" className={className} fill={color} aria-label="Suzuki">
      {/* Suzuki sharp S upper half */}
      <path d="M 76 16 L 34 16 L 16 42 L 52 42 L 70 26 L 76 26 Z" />
      <polygon points="76,16 52,42 74,42 94,22" />
      {/* Suzuki sharp S lower half */}
      <path d="M 24 84 L 66 84 L 84 58 L 48 58 L 30 74 L 24 74 Z" />
      <polygon points="24,84 48,58 26,58 6,78" />
    </svg>
  );
}

// 5. SUBARU - Deep Blue Oval with Pleiades Constellation (6 Stars)
export function SubaruLogo({ className = 'w-6 h-6', useBrandColor = true }: LogoProps) {
  return (
    <svg viewBox="0 0 100 70" className={className} aria-label="Subaru">
      {/* Royal blue oval */}
      <ellipse
        cx="50"
        cy="35"
        rx="46"
        ry="30"
        fill={useBrandColor ? '#002c6c' : 'none'}
        stroke={useBrandColor ? '#0284c7' : 'currentColor'}
        strokeWidth="4"
      />
      {/* Main big star */}
      <polygon
        points="34,22 36,31 45,31 38,36 41,45 34,40 27,45 30,36 23,31 32,31"
        fill="#ffffff"
      />
      {/* Clustered 5 smaller stars */}
      <polygon points="56,22 57,26 61,26 58,29 59,33 56,30 53,33 54,29 51,26 55,26" fill="#ffffff" />
      <polygon points="68,27 69,31 73,31 70,34 71,38 68,35 65,38 66,34 63,31 67,31" fill="#ffffff" />
      <polygon points="61,38 62,42 66,42 63,45 64,49 61,46 58,49 59,45 56,42 60,42" fill="#ffffff" />
      <polygon points="50,44 51,48 55,48 52,51 53,55 50,52 47,55 48,51 45,48 49,48" fill="#ffffff" />
      <polygon points="67,48 68,51 71,51 69,53 70,56 67,54 64,56 65,53 63,51 66,51" fill="#ffffff" />
    </svg>
  );
}

// 6. HONDA - Rounded Trapezoid with Outward-Flared 'H'
export function HondaLogo({ className = 'w-6 h-6', useBrandColor = true }: LogoProps) {
  const color = useBrandColor ? '#dc2626' : 'currentColor';
  return (
    <svg viewBox="0 0 100 85" className={className} aria-label="Honda">
      {/* Outer rounded trapeze */}
      <path
        d="M 12 10 C 12 10 50 6 88 10 C 93 10 95 16 93 36 C 90 62 84 78 50 80 C 16 78 10 62 7 36 C 5 16 7 10 12 10 Z"
        fill="none"
        stroke={color}
        strokeWidth="5.5"
      />
      {/* Iconic flared H */}
      <path
        d="M 25 20 L 33 70 L 41 70 L 41 46 L 59 46 L 59 70 L 67 70 L 75 20 L 65 20 L 61 40 L 39 40 L 35 20 Z"
        fill={color}
      />
    </svg>
  );
}

// 7. MAZDA - Soaring Wings 'M' in Oval
export function MazdaLogo({ className = 'w-6 h-6', useBrandColor = true }: LogoProps) {
  const color = useBrandColor ? '#2563eb' : 'currentColor';
  return (
    <svg viewBox="0 0 100 70" className={className} aria-label="Mazda">
      <ellipse cx="50" cy="35" rx="46" ry="31" fill="none" stroke={color} strokeWidth="5.5" />
      {/* Flying dynamic wings */}
      <path
        d="M 18 28 C 30 40 42 50 50 36 C 58 50 70 40 82 28 C 74 48 62 58 50 45 C 38 58 26 48 18 28 Z"
        fill={color}
      />
    </svg>
  );
}

// 8. LEXUS - Elegant Calligraphic 'L' in Ellipse
export function LexusLogo({ className = 'w-6 h-6', useBrandColor = true }: LogoProps) {
  const color = useBrandColor ? '#1e293b' : 'currentColor';
  return (
    <svg viewBox="0 0 100 70" className={className} aria-label="Lexus">
      <ellipse cx="50" cy="35" rx="46" ry="31" fill="none" stroke="currentColor" strokeWidth="5.5" />
      {/* Distinctive italic Lexus L */}
      <path
        d="M 72 23 C 58 23 40 23 33 24 C 27 25 24 30 24 38 L 24 54 C 24 60 28 63 34 63 L 74 63"
        fill="none"
        stroke={color === 'currentColor' ? 'currentColor' : '#475569'}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 34 46 L 72 26"
        fill="none"
        stroke={color === 'currentColor' ? 'currentColor' : '#475569'}
        strokeWidth="5.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 9. INFINITI - Oval with Converging Horizon Road to Mt. Fuji
export function InfinitiLogo({ className = 'w-6 h-6', useBrandColor = true }: LogoProps) {
  const color = useBrandColor ? '#475569' : 'currentColor';
  return (
    <svg viewBox="0 0 100 70" className={className} aria-label="Infiniti">
      <ellipse cx="50" cy="35" rx="46" ry="31" fill="none" stroke={color} strokeWidth="5.5" />
      {/* Central converging perspective road */}
      <polygon points="50,16 63,56 50,44 37,56" fill={color} />
    </svg>
  );
}

// 10. DAIHATSU - Dynamic Sculpted 'D' in Oval
export function DaihatsuLogo({ className = 'w-6 h-6', useBrandColor = true }: LogoProps) {
  const color = useBrandColor ? '#dc2626' : 'currentColor';
  return (
    <svg viewBox="0 0 100 70" className={className} aria-label="Daihatsu">
      <ellipse cx="50" cy="35" rx="45" ry="30" fill="none" stroke={color} strokeWidth="5" />
      {/* Bold D emblem */}
      <path
        d="M 28 20 L 54 20 C 68 20 74 26 74 35 C 74 44 68 50 54 50 L 28 50 Z M 38 27 L 38 43 L 52 43 C 60 43 63 40 63 35 C 63 30 60 27 52 27 Z"
        fill={color}
      />
    </svg>
  );
}

// 11. ISUZU - Iconic Red Twin Pillars
export function IsuzuLogo({ className = 'w-6 h-6', useBrandColor = true }: LogoProps) {
  const color = useBrandColor ? '#ee1c25' : 'currentColor';
  return (
    <svg viewBox="0 0 100 60" className={className} fill={color} aria-label="Isuzu">
      {/* Twin angled pillars of Isuzu */}
      <polygon points="22,10 40,10 34,50 16,50" />
      <polygon points="58,10 76,10 70,50 52,50" />
      <text
        x="50"
        y="58"
        fill={color}
        fontSize="8"
        fontWeight="900"
        letterSpacing="3"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        ISUZU
      </text>
    </svg>
  );
}

// Universal Brand Logo Selector Component
export function BrandLogo({
  brandId,
  className = 'w-6 h-6',
  useBrandColor = false
}: {
  brandId: string;
  className?: string;
  useBrandColor?: boolean;
}) {
  switch (brandId.toLowerCase()) {
    case 'mitsubishi':
      return <MitsubishiLogo className={className} useBrandColor={useBrandColor} />;
    case 'toyota':
      return <ToyotaLogo className={className} useBrandColor={useBrandColor} />;
    case 'nissan':
      return <NissanLogo className={className} useBrandColor={useBrandColor} />;
    case 'suzuki':
      return <SuzukiLogo className={className} useBrandColor={useBrandColor} />;
    case 'subaru':
      return <SubaruLogo className={className} useBrandColor={useBrandColor} />;
    case 'honda':
      return <HondaLogo className={className} useBrandColor={useBrandColor} />;
    case 'mazda':
      return <MazdaLogo className={className} useBrandColor={useBrandColor} />;
    case 'lexus':
      return <LexusLogo className={className} useBrandColor={useBrandColor} />;
    case 'infiniti':
      return <InfinitiLogo className={className} useBrandColor={useBrandColor} />;
    case 'daihatsu':
      return <DaihatsuLogo className={className} useBrandColor={useBrandColor} />;
    case 'isuzu':
      return <IsuzuLogo className={className} useBrandColor={useBrandColor} />;
    default:
      return <MitsubishiLogo className={className} useBrandColor={useBrandColor} />;
  }
}
