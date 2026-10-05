import React from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate, useLocation, Outlet } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import SiteNav from './components/SiteNav';
import SiteFooter from './components/SiteFooter';
import DashLayout from './components/DashLayout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ServersPage from './pages/ServersPage';
import AccountPage from './pages/AccountPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import PricingPage from './pages/PricingPage';
import FaqPage from './pages/FaqPage';
import { AuthProvider, useAuth } from './context/AuthContext';

function MarketingLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}

// Redirects to /login if not authenticated, preserving the intended destination.
function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Redirects already-logged-in users away from login/signup pages.
function PublicOnlyRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return null;
  if (isLoggedIn) return <Navigate to="/dashboard" replace />;
  return children;
}

// Redirects non-admins to dashboard
function AdminProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user?.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* Marketing / Landing */}
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/servers" element={<ServersPage />} />
          </Route>

          {/* Auth pages (redirect to dashboard if already logged in) */}
          <Route
            path="/login"
            element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>}
          />
          <Route
            path="/signup"
            element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>}
          />

          {/* Dashboard app — protected, single shared DashLayout */}
          <Route
            element={
              <ProtectedRoute>
                <DashLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard"         element={<DashboardPage />} />
            <Route path="/dashboard/billing" element={<PricingPage />} />
            <Route path="/dashboard/servers" element={<ServersPage />} />
            <Route path="/account"           element={<AccountPage />} />
            <Route 
              path="/admin"     
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              } 
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
