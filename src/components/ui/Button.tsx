import type { ButtonHTMLAttributes } from 'react';
type Props=ButtonHTMLAttributes<HTMLButtonElement>&{variant?:'primary'|'secondary'|'danger';size?:'normal'|'large'};
export default function Button({variant='secondary',size='normal',className='',type='button',...props}:Props){return <button type={type} {...props} className={`ui-button ui-button-${variant} ui-button-${size} ${className}`.trim()} />;}
