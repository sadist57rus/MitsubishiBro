import type { ReactNode } from 'react';import Modal from './Modal';
type Props={open:boolean;title:string;children:ReactNode;onClose:()=>void};
export default function BottomSheet(props:Props){return <Modal {...props} bottomSheet/>;}
