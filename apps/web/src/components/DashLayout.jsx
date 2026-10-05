import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Globe2, Settings, LogOut, CreditCard } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

const nav = [
  { to: '/dashboard',         label: 'Overview', icon: LayoutDashboard },
  { to: '/dashboard/billing', label: 'Billing',  icon: CreditCard },
  { to: '/dashboard/servers', label: 'Servers',  icon: Globe2 },
  { to: '/account',           label: 'Account',  icon: Settings },
];

const adminNav = [
  { to: '/admin', label: 'Admin Panel', icon: Settings }, // Using Settings icon for simplicity or import a different one
];

export default function DashLayout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  // Display user initials in the sidebar
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="min-h-[100dvh] bg-background md:flex">
      <aside className="flex shrink-0 flex-col border-b border-border bg-white md:w-60 md:border-b-0 md:border-r">
        <Link to="/" className="flex items-center px-6 py-5 hover:opacity-90 transition-opacity">
          <Logo />
        </Link>

        <nav className="flex gap-1 px-3 md:flex-col md:gap-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                  isActive ? 'bg-forest text-primary-foreground' : 'text-muted-foreground hover:bg-secondary/60'
                }`
              }
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} /> {label}
            </NavLink>
          ))}
          {user?.is_admin && (
            <div className="mt-4 pt-4 border-t border-border">
              <span className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Admin</span>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `mt-1 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                    isActive ? 'bg-forest text-primary-foreground' : 'text-muted-foreground hover:bg-secondary/60'
                  }`
                }
              >
                <Settings className="h-4 w-4" strokeWidth={1.75} /> Admin Dashboard
              </NavLink>
            </div>
          )}
        </nav>

        {/* User info + logout */}
        <div className="mt-auto hidden md:block px-4 py-5 border-t border-border">
          {user && (
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          )}
          <button
            id="sidebar-logout-btn"
            onClick={handleLogout}
            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-forest w-full transition-colors"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} /> Log out
          </button>
        </div>
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
