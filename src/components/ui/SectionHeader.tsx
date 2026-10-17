import type { ReactNode } from 'react';
type Props={title:string;description?:string;icon?:ReactNode;action?:ReactNode;className?:string};
export default function SectionHeader({title,description,icon,action,className=''}:Props){return <div className={`ui-section-header ${className}`.trim()}><div className="ui-section-heading">{icon&&<span className="ui-section-icon">{icon}</span>}<div><h2>{title}</h2>{description&&<p>{description}</p>}</div></div>{action&&<div className="ui-section-action">{action}</div>}</div>;}
