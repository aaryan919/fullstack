// src/pages/SignupPage.jsx
import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

const REQUIREMENTS = [
  { test: (p) => p.length >= 8,        label: 'At least 8 characters' },
  { test: (p) => /[A-Z]/.test(p),      label: 'One uppercase letter' },
  { test: (p) => /[0-9]/.test(p),      label: 'One number' },
];

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate   = useNavigate();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!REQUIREMENTS.every((r) => r.test(password))) {
      setError('Password does not meet all requirements.');
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row-reverse">
      {/* Right Side: Graphic / Branding */}
      <div className="hidden md:flex flex-1 flex-col justify-between bg-foreground text-background p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/10 grid-background pointer-events-none" />
        <div className="absolute -top-[20%] -right-[10%] w-[120%] h-[50%] bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex justify-end">
          <Link to="/" className="inline-flex items-center hover:opacity-90 transition-opacity">
            <Logo dark={true} /> 
          </Link>
        </div>
        
        <div className="relative z-10 max-w-md ml-auto text-right">
          <h2 className="text-4xl font-bold mb-4">Start your journey.</h2>
          <p className="text-gray-400 text-lg">
            Create an account to deploy unrestricted, high-speed VLESS configurations globally.
          </p>
        </div>
      </div>

      {/* Left Side: Form */}
      <div className="flex-1 flex flex-col justify-center p-8 md:p-12 lg:px-24">
        <div className="w-full max-w-sm mx-auto space-y-8">
          
          <div className="md:hidden text-center space-y-4">
            <Link to="/" className="inline-flex items-center hover:opacity-90 transition-opacity">
              <Logo className="scale-125 origin-center" />
            </Link>
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground mt-2">Sign up to purchase plans and connect instantly.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="signup-name" className="text-sm font-medium">Full name</label>
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full px-3 py-2.5 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="signup-email" className="text-sm font-medium">Email</label>
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="signup-password" className="text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 pr-10 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password requirements */}
              {password.length > 0 && (
                <ul className="space-y-1 pt-1">
                  {REQUIREMENTS.map((r) => (
                    <li key={r.label} className={`flex items-center gap-1.5 text-xs ${r.test(password) ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                      <CheckCircle2 className="h-3 w-3 shrink-0" />
                      {r.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-foreground text-background font-semibold text-sm
                         hover:bg-foreground/90 active:scale-[0.98] transition-all disabled:opacity-60 mt-4"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-foreground font-semibold hover:underline">
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-muted-foreground pt-8">
            <Link to="/" className="hover:underline">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
