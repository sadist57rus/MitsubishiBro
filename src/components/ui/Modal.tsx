import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

type Props = { open: boolean; title: string; children: ReactNode; onClose: () => void; bottomSheet?: boolean };

export default function Modal({ open, title, children, onClose, bottomSheet = false }: Props) {
  const dialogRef = useRef<HTMLElement>(null);
  const titleId = useId();
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = () => Array.from(dialog?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
    ) || []).filter(element => element.getAttribute('aria-hidden') !== 'true' && element.getClientRects().length > 0);
    (focusable()[0] || dialog)?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (!items.length) { event.preventDefault(); dialog?.focus(); return; }
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialog?.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !dialog?.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open, onClose]);
  if (!open) return null;
  return <div className={'ui-modal-backdrop ' + (bottomSheet ? 'ui-bottom-sheet-backdrop' : '')} onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className={'ui-modal ' + (bottomSheet ? 'ui-bottom-sheet' : '')}>
      <header className="ui-modal-header">
        <h2 id={titleId}>{title}</h2>
        <button type="button" className="ui-button ui-button-secondary ui-button-large" aria-label={'Закрыть: ' + title} onClick={onClose}><X aria-hidden="true" /></button>
      </header>
      <div className="ui-modal-body">{children}</div>
    </section>
  </div>;
}
