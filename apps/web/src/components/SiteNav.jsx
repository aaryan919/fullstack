import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import GooeyNav from './ui/GooeyNav';
import { useLocation } from 'react-router-dom';

export default function SiteNav() {
  const [open] = useState(false);
  const { isLoggedIn, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'FAQ', href: '/faq' },
  ];

  const activeNavIndex = links.findIndex((l) => l.href === location.pathname);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-forest/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
          <Logo dark />
        </Link>

        <div className="hidden md:flex overflow-hidden rounded-full">
          <GooeyNav
            items={links.map((l) => ({ label: l.label, href: l.href }))}
            particleCount={15}
            particleDistances={[90, 10]}
            particleR={100}
            initialActiveIndex={activeNavIndex}
            animationTime={600}
            timeVariance={300}
            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
          />
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <>
              <span className="text-sm text-muted-foreground">
                Hey, {user?.name?.split(' ')[0]}
              </span>
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 rounded-md bg-forest px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-white/80 hover:text-emerald-400">Sign in</Link>
              <Link
                to="/pricing"
                className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-[#022c22] transition-transform hover:-translate-y-0.5"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 px-5 py-4 md:hidden">
          {links.map((l) => (
            <Link key={l.href} to={l.href} onClick={() => setMenuOpen(false)} className="block py-2 text-muted-foreground">
              {l.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="mt-2 block rounded-md bg-forest px-4 py-2 text-center text-sm font-medium text-primary-foreground"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="mt-2 block py-2 text-sm text-forest font-medium"
              >
                Sign in
              </Link>
              <Link
                to="/pricing"
                onClick={() => setMenuOpen(false)}
                className="mt-1 block rounded-md bg-forest px-4 py-2 text-center text-sm font-medium text-primary-foreground"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}