import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Menu, X } from 'lucide-react';

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-cream/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold text-forest">
          <Leaf className="h-5 w-5" strokeWidth={1.75} />
          Verdant
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-forest">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/dashboard" className="text-sm font-medium text-forest hover:underline">Sign in</Link>
          <a href="#pricing" className="rounded-md bg-forest px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5">
            Get started
          </a>
        </div>
        <button className="md:hidden text-forest" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border/60 px-5 py-4 md:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-2 text-muted-foreground">
              {l.label}
            </a>
          ))}
          <Link to="/dashboard" className="mt-2 block rounded-md bg-forest px-4 py-2 text-center text-sm font-medium text-primary-foreground">
            Open dashboard
          </Link>
        </div>
      )}
    </header>
  );
}
