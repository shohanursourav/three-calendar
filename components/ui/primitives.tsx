'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Icon button                                                               */
/* -------------------------------------------------------------------------- */
interface IconButtonProps extends React.ComponentProps<'button'> {
  label: string;
  variant?: 'ghost' | 'outline' | 'solid';
  size?: 'sm' | 'md';
}

export function IconButton({
  label,
  variant = 'ghost',
  size = 'md',
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40',
        size === 'sm' ? 'h-8 w-8' : 'h-10 w-10',
        variant === 'ghost' && 'text-muted hover:bg-surface-3 hover:text-ink',
        variant === 'outline' && 'border border-line bg-surface-2 text-ink hover:border-line-strong hover:bg-surface-3',
        variant === 'solid' && 'bg-brand text-white shadow-sm hover:bg-brand-strong',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tooltip bubble (CSS driven: shows on hover *and* keyboard focus)           */
/* -------------------------------------------------------------------------- */
export function TooltipBubble({
  content,
  side = 'top',
  align = 'center',
}: {
  content: ReactNode;
  side?: 'top' | 'bottom';
  align?: 'center' | 'start' | 'end';
}) {
  return (
    <span
      role="tooltip"
      className={cn(
        'pointer-events-none absolute z-40 w-max max-w-[15rem] scale-95 rounded-xl border border-line bg-surface-2 px-3 py-2 text-left text-xs leading-relaxed text-ink opacity-0 shadow-pop transition-all duration-200',
        align === 'center' && 'left-1/2 -translate-x-1/2',
        align === 'start' && 'left-0',
        align === 'end' && 'right-0',
        'group-hover/cell:scale-100 group-hover/cell:opacity-100 group-focus-within/cell:scale-100 group-focus-within/cell:opacity-100',
        side === 'top' ? 'bottom-[calc(100%+8px)]' : 'top-[calc(100%+8px)]',
      )}
    >
      {content}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Switch                                                                    */
/* -------------------------------------------------------------------------- */
export function Switch({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group flex w-full items-start justify-between gap-4 rounded-2xl px-2 py-2 text-left transition-colors hover:bg-surface-3/60"
    >
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        {description ? <span className="mt-0.5 block text-xs text-muted">{description}</span> : null}
      </span>
      <span
        className={cn(
          'relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-300',
          checked ? 'border-transparent bg-brand' : 'border-line bg-surface-3',
        )}
      >
        <span
          className={cn(
            'absolute h-[1.125rem] w-[1.125rem] rounded-full bg-white shadow transition-transform duration-300',
            checked ? 'translate-x-[1.4rem]' : 'translate-x-[0.2rem]',
          )}
        />
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Popover / menu                                                            */
/* -------------------------------------------------------------------------- */
export function Popover({
  trigger,
  children,
  align = 'end',
  panelClassName,
}: {
  trigger: (props: { open: boolean; toggle: () => void }) => ReactNode;
  children: (props: { close: () => void }) => ReactNode;
  align?: 'start' | 'end';
  panelClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      {trigger({ open, toggle: () => setOpen((value) => !value) })}
      {open ? (
        <div
          className={cn(
            'absolute top-[calc(100%+0.6rem)] z-50 w-72 origin-top animate-pop rounded-3xl border border-line bg-surface-2 p-3 shadow-pop',
            align === 'end' ? 'right-0' : 'left-0',
            panelClassName,
          )}
        >
          {children({ close: () => setOpen(false) })}
        </div>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Modal                                                                     */
/* -------------------------------------------------------------------------- */
export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: string;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6" role="presentation">
      <div
        className="absolute inset-0 animate-fade-in bg-black/45 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'relative z-10 max-h-[92vh] w-full animate-rise overflow-y-auto rounded-t-3xl border border-line bg-surface-2 p-5 shadow-pop sm:rounded-3xl sm:p-6',
          maxWidth,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-lg font-semibold text-ink">
              {title}
            </h2>
            {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
          </div>
          <IconButton ref={closeRef} label="close" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </IconButton>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section shell                                                             */
/* -------------------------------------------------------------------------- */
export function Panel({
  children,
  className,
  as: Tag = 'section',
}: {
  children: ReactNode;
  className?: string;
  as?: 'section' | 'div' | 'aside';
}) {
  return <Tag className={cn('glass-card rounded-card', className)}>{children}</Tag>;
}
