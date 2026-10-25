import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Bilingual, Lang } from '../types';

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50';
const variants = {
  primary: 'bg-vermilion text-white hover:bg-red-700',
  secondary: 'border border-navy/20 bg-white text-navy hover:bg-navy/5 dark:bg-transparent dark:text-paper dark:border-paper/30 dark:hover:bg-paper/10',
  danger: 'bg-red-700 text-white hover:bg-red-800',
};

export function Button({
  variant = 'secondary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }) {
  return <button type="button" className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function Card({ title, children, className = '' }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-navy/10 bg-white p-5 shadow-sm dark:bg-navy-soft dark:border-paper/10 ${className}`}>
      {title && <h2 className="mb-3 text-lg font-semibold">{title}</h2>}
      {children}
    </section>
  );
}

export function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.min(value, max)}
      className="h-3 w-full overflow-hidden rounded-full bg-navy/10 dark:bg-paper/20"
    >
      <div className="h-full bg-vermilion" style={{ width: `${pct}%` }} />
    </div>
  );
}

/** Shows a bilingual text block: the interface language first, the other language beneath. */
export function Bi({ text, primary }: { text: Bilingual; primary: Lang }) {
  const other: Lang = primary === 'en' ? 'ur' : 'en';
  return (
    <div>
      <p lang={primary} dir={primary === 'ur' ? 'rtl' : 'ltr'}>{text[primary]}</p>
      <p lang={other} dir={other === 'ur' ? 'rtl' : 'ltr'} className="mt-1 text-sm opacity-75">{text[other]}</p>
    </div>
  );
}

export function Breadcrumbs({ label, items }: { label: string; items: { text: string; to?: string }[] }) {
  return (
    <nav aria-label={label} className="mb-4 text-sm">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true" className="opacity-50">/</span>}
            {it.to ? <Link to={it.to} className="underline-offset-2 hover:underline">{it.text}</Link> : <span aria-current="page" className="font-medium">{it.text}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
