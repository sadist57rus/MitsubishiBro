import type { ReactNode } from 'react';
type Props={label:string;value:ReactNode;detail?:ReactNode;icon?:ReactNode};
export default function StatTile({label,value,detail,icon}:Props){return <div className="ui-stat-tile"><div className="ui-stat-label">{icon}{label}</div><div className="ui-stat-value">{value}</div>{detail&&<div className="ui-stat-detail">{detail}</div>}</div>;}
