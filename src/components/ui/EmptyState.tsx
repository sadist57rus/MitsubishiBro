import type { ReactNode } from 'react';
type Props={title:string;description?:string;icon?:ReactNode;action?:ReactNode};
export default function EmptyState({title,description,icon,action}:Props){return <div className="ui-empty-state">{icon&&<div className="ui-empty-icon">{icon}</div>}<h3>{title}</h3>{description&&<p>{description}</p>}{action&&<div>{action}</div>}</div>;}
