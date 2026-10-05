import React, { useState, useEffect } from 'react';
import { Users, Activity, CreditCard, Shield, AlertCircle, X } from 'lucide-react';
import { adminApi } from '../lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'payments'
  const [userSearch, setUserSearch] = useState('');

  // Per-user activity drill-down
  const [selectedUser, setSelectedUser] = useState(null); // { id, name, email }
  const [activityRows, setActivityRows] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);

  function openActivity(user) {
    setSelectedUser(user);
    setActivityLoading(true);
    const until = new Date().toISOString();
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(); // last 30 days
    adminApi.getActivity({ since, until, user_id: user.id })
      .then(setActivityRows)
      .catch(() => setActivityRows([]))
      .finally(() => setActivityLoading(false));
  }

  function closeActivity() {
    setSelectedUser(null);
    setActivityRows([]);
  }

  const filteredUsers = users.filter((u) => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return true;
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  useEffect(() => {
    Promise.all([
      adminApi.getStats(),
      adminApi.getUsers(),
      adminApi.getPayments(),
    ])
      .then(([statsData, usersData, paymentsData]) => {
        setStats(statsData);
        setUsers(usersData);
        setPayments(paymentsData);
      })
      .catch((err) => setError(err.message || 'Failed to load admin data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-destructive">
        <AlertCircle className="h-8 w-8" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" /> Admin Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">Platform overview and user management.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border bg-card shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Users className="h-4 w-4" /> <span className="text-xs font-semibold uppercase">Total Users</span>
          </div>
          <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
        </div>
        <div className="p-5 rounded-xl border bg-card shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Activity className="h-4 w-4" /> <span className="text-xs font-semibold uppercase">Active Subs</span>
          </div>
          <p className="text-3xl font-bold text-emerald-600">{stats?.activeSubscriptions || 0}</p>
        </div>
        <div className="p-5 rounded-xl border bg-card shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <CreditCard className="h-4 w-4" /> <span className="text-xs font-semibold uppercase">Total Revenue</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">₹{stats?.totalRevenue || 0}</p>
        </div>
        <div className="p-5 rounded-xl border bg-card shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Shield className="h-4 w-4" /> <span className="text-xs font-semibold uppercase">Total Data Used</span>
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {stats?.totalDataBytes ? (stats.totalDataBytes / (1024 ** 3)).toFixed(2) : 0} GB
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-border">
        <button
          onClick={() => setActiveTab('users')}
          className={`py-2 px-1 font-medium text-sm border-b-2 transition-colors ${activeTab === 'users' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`py-2 px-1 font-medium text-sm border-b-2 transition-colors ${activeTab === 'payments' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Payments
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        {activeTab === 'users' && (
          <>
            <div className="p-4 border-b">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full max-w-sm px-3 py-2 text-sm rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-medium">User</th>
                    <th className="px-6 py-4 font-medium">Joined</th>
                    <th className="px-6 py-4 font-medium">Plan</th>
                    <th className="px-6 py-4 font-medium">VPN Status</th>
                    <th className="px-6 py-4 font-medium">Data Used</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.length === 0 ? (
                    <tr><td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">No users found.</td></tr>
                  ) : (
                    filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-muted/30 cursor-pointer" onClick={() => openActivity(u)}>
                        <td className="px-6 py-4">
                          <p className="font-semibold">{u.name} {u.is_admin && <span className="ml-2 text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">ADMIN</span>}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          {u.plan_name ? <span className="font-medium">{u.plan_name}</span> : <span className="text-muted-foreground">—</span>}
                        </td>
                        <td className="px-6 py-4">
                          {u.vpn_status ? (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${u.vpn_status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                              {u.vpn_status}
                            </span>
                          ) : <span className="text-muted-foreground">—</span>}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {u.data_used_bytes != null ? `${(u.data_used_bytes / (1024 ** 3)).toFixed(2)} GB` : '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'payments' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">No payments found.</td></tr>
                ) : (
                  payments.map(p => (
                    <tr key={p.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{p.razorpay_order_id}</td>
                      <td className="px-6 py-4 text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{p.email}</td>
                      <td className="px-6 py-4 font-medium">₹{p.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${p.status === 'captured' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Per-user activity drill-down */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={closeActivity}>
          <div className="bg-card border rounded-xl shadow-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="font-semibold">{selectedUser.name}'s activity</h2>
                <p className="text-xs text-muted-foreground">{selectedUser.email} — last 30 days</p>
              </div>
              <button onClick={closeActivity} className="p-1 rounded-md hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              {activityLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : activityRows.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-16">No recorded activity in this window.</p>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50 text-muted-foreground sticky top-0">
                    <tr>
                      <th className="px-6 py-3 font-medium">Recorded at</th>
                      <th className="px-6 py-3 font-medium">Last online</th>
                      <th className="px-6 py-3 font-medium">Data moved</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {activityRows.map((row, i) => (
                      <tr key={i}>
                        <td className="px-6 py-3">{new Date(row.recorded_at).toLocaleString()}</td>
                        <td className="px-6 py-3 text-muted-foreground">
                          {row.last_online ? new Date(row.last_online).toLocaleString() : '—'}
                        </td>
                        <td className="px-6 py-3">
                          {row.bytes_moved != null ? `${(row.bytes_moved / (1024 ** 2)).toFixed(1)} MB` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
