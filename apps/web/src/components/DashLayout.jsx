import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Leaf, LayoutDashboard, Globe2, Settings, LogOut } from 'lucide-react';

const nav = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/servers', label: 'Servers', icon: Globe2 },
  { to: '/account', label: 'Account', icon: Settings },
];

export default function DashLayout({ children, title }) {
  return (
    <div className="min-h-[100dvh] bg-background md:flex">
      <aside className="flex shrink-0 flex-col border-b border-border bg-cream md:w-60 md:border-b-0 md:border-r">
        <Link to="/" className="flex items-center gap-2 px-6 py-5 font-display text-xl font-semibold text-forest">
          <Leaf className="h-5 w-5" strokeWidth={1.75} /> Verdant
        </Link>
        <nav className="flex gap-1 px-3 md:flex-col md:gap-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${isActive ? 'bg-forest text-primary-foreground' : 'text-muted-foreground hover:bg-secondary/60'
                }`
              }
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} /> {label}
            </NavLink>
          ))}
        </nav>
        <Link to="/" className="mt-auto hidden items-center gap-3 px-6 py-5 text-sm text-muted-foreground hover:text-forest md:flex">
          <LogOut className="h-4 w-4" strokeWidth={1.75} /> Log out
        </Link>
      </aside>
      <main className="flex-1 px-5 py-8 md:px-10">
        <div className="mx-auto max-w-4xl">
          {title && <h1 className="mb-8 font-display text-3xl font-semibold text-forest">{title}</h1>}
          {children ?? <Outlet />}
        </div>
      </main>
    </div>
  );
}

