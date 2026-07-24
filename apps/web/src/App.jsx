import React from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import SiteNav from './components/SiteNav';
import DashLayout from './components/DashLayout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ServersPage from './pages/ServersPage';
import AccountPage from './pages/AccountPage';

function MarketingLayout() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main>
        <HomePage />
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Marketing / Landing */}
        <Route path="/" element={<MarketingLayout />} />

        {/* Dashboard app — single shared DashLayout persists across all sub-routes */}
        <Route element={<DashLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/servers" element={<ServersPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
