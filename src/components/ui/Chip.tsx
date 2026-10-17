import type { HTMLAttributes } from 'react';
type Props=HTMLAttributes<HTMLSpanElement>&{tone?:'neutral'|'accent'|'success'|'warning'|'danger'};
export default function Chip({tone='neutral',className='',...props}:Props){return <span {...props} className={`ui-chip ui-chip-${tone} ${className}`.trim()} />;}
