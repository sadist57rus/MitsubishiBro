import type { HTMLAttributes } from 'react';
export type CardProps = HTMLAttributes<HTMLDivElement> & { interactive?: boolean };
export default function Card({interactive=false,className='',...props}:CardProps){return <div {...props} className={`ui-card ${interactive?'ui-card-interactive':''} ${className}`.trim()} />;}
