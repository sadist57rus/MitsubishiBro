import type { CSSProperties } from 'react';

export const VEHICLE_COLORS = [
  { id: 'black', label: 'Чёрный', hex: '#202124' },
  { id: 'white', label: 'Белый', hex: '#f5f5f2' },
  { id: 'silver', label: 'Серебристый', hex: '#aeb6bf' },
  { id: 'gray', label: 'Серый', hex: '#68717c' },
  { id: 'red', label: 'Красный', hex: '#c62828' },
  { id: 'blue', label: 'Синий', hex: '#1769aa' },
  { id: 'navy', label: 'Тёмно-синий', hex: '#172c54' },
  { id: 'green', label: 'Зелёный', hex: '#2e6b45' },
  { id: 'brown', label: 'Коричневый', hex: '#76513b' },
  { id: 'beige', label: 'Бежевый', hex: '#c9b99a' },
  { id: 'gold', label: 'Золотистый', hex: '#b99a45' },
  { id: 'yellow', label: 'Жёлтый', hex: '#f2c230' },
  { id: 'orange', label: 'Оранжевый', hex: '#e87524' },
  { id: 'purple', label: 'Фиолетовый', hex: '#7042a0' },
  { id: 'burgundy', label: 'Бордовый', hex: '#722f3e' },
] as const;

export type VehicleColorId = typeof VEHICLE_COLORS[number]['id'];
export const DEFAULT_VEHICLE_COLOR: VehicleColorId = 'silver';

interface Props {
  color?: string;
  bodyType?: string;
  modelName?: string;
  className?: string;
}

export default function VehicleIllustration({ color = DEFAULT_VEHICLE_COLOR, bodyType = '', modelName = '', className = '' }: Props) {
  const selected = VEHICLE_COLORS.find(item => item.id === color) || VEHICLE_COLORS.find(item => item.id === DEFAULT_VEHICLE_COLOR)!;
  const suv = /suv|кроссовер|внедорожник|land cruiser|prado|outlander/i.test(`${bodyType} ${modelName}`);
  const sedan = /sedan|седан|lancer/i.test(`${bodyType} ${modelName}`);
  const wagon = /wagon|универсал/i.test(bodyType);
  const roof = suv
    ? 'M92 91 L112 55 Q117 47 130 47 L207 47 Q220 48 230 61 L252 91 Z'
    : sedan
      ? 'M93 91 L121 61 Q128 54 142 54 L197 54 Q211 55 225 69 L246 91 Z'
      : wagon
        ? 'M88 91 L111 55 Q117 48 131 48 L218 48 L245 66 L258 91 Z'
        : 'M92 91 L118 60 Q126 53 140 53 L201 53 Q215 54 230 70 L249 91 Z';
  const body = suv
    ? 'M57 91 L81 87 L103 58 Q109 42 128 42 L210 42 Q228 43 239 62 L266 84 L282 91 L282 112 L55 112 Z'
    : 'M55 94 L80 88 L105 65 Q116 49 137 49 L202 49 Q220 51 236 72 L263 87 L280 94 L280 111 L55 111 Z';
  const paintStyle: CSSProperties = { fill: selected.hex };
  return (
    <svg viewBox="0 0 340 150" role="img" aria-label={`Силуэт автомобиля, цвет: ${selected.label}`} className={`w-full ${className}`}>
      <defs><linearGradient id="vehicle-gloss" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffffff" stopOpacity=".36"/><stop offset="48%" stopColor="#ffffff" stopOpacity=".02"/><stop offset="100%" stopColor="#000000" stopOpacity=".2"/></linearGradient></defs>
      <ellipse cx="168" cy="117" rx="120" ry="9" fill="#64748b" opacity=".2"/>
      <path d={body} style={paintStyle} stroke="#303741" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d={roof} fill="#243342" stroke="#303741" strokeWidth="2" strokeLinejoin="round"/>
      <path d={roof} fill="url(#vehicle-gloss)"/>
      <path d={suv ? 'M124 54 L111 84 L151 84 L151 54 Z M161 54 L161 84 L205 84 L205 54 Z' : 'M127 60 L111 85 L153 85 L153 60 Z M162 60 L162 85 L202 85 L202 60 Z'} fill="#a9c6d8" stroke="#34495e" strokeWidth="1.5"/>
      <path d="M158 53 L158 88 M211 63 L232 86" stroke="#303741" strokeWidth="2" fill="none"/>
      <path d="M62 96 L92 91 L260 91 L276 97 L276 107 L62 107 Z" fill="url(#vehicle-gloss)"/>
      <path d="M67 94 L85 91 L81 100 L63 102 Z" fill="#fff3c4" stroke="#4b5563" strokeWidth="1"/>
      <path d="M260 92 L276 98 L276 103 L263 101 Z" fill="#dc2626" stroke="#4b5563" strokeWidth="1"/>
      <path d="M96 91 L95 108 M245 91 L247 108" stroke="#303741" strokeWidth="1.5"/>
      <circle cx="105" cy="110" r="19" fill="#20242b" stroke="#101318" strokeWidth="2"/>
      <circle cx="105" cy="110" r="10" fill="#aeb6bf" stroke="#4b5563" strokeWidth="2"/>
      <circle cx="105" cy="110" r="3" fill="#4b5563"/>
      <circle cx="237" cy="110" r="19" fill="#20242b" stroke="#101318" strokeWidth="2"/>
      <circle cx="237" cy="110" r="10" fill="#aeb6bf" stroke="#4b5563" strokeWidth="2"/>
      <circle cx="237" cy="110" r="3" fill="#4b5563"/>
      <path d="M80 90 L92 89 M253 90 L266 94" stroke="#f8fafc" strokeWidth="2" opacity=".7"/>
    </svg>
  );
}
