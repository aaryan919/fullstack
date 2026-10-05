import { useState, useEffect } from "react";
import { Smartphone, CreditCard, HardDrive, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { accountApi } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function AccountPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [account,  setAccount]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  // Edit name state
  const [editName,    setEditName]    = useState(false);
  const [nameValue,   setNameValue]   = useState("");
  const [nameLoading, setNameLoading] = useState(false);
  const [nameError,   setNameError]   = useState("");

  useEffect(() => {
    accountApi.get()
      .then((data) => {
        setAccount(data);
        setNameValue(data.name || "");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSaveName(e) {
    e.preventDefault();
    setNameError("");
    setNameLoading(true);
    try {
      const { user: updated } = await accountApi.update({ name: nameValue });
      setAccount((prev) => ({ ...prev, name: updated.name }));
      updateUser({ name: updated.name });
      setEditName(false);
    } catch (err) {
      setNameError(err.message);
    } finally {
      setNameLoading(false);
    }
  }

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

  const plan       = account?.active_plan;
  const vpn        = account?.vpn;
  const initials   = account?.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "?";

  return (
    <div className="space-y-8 py-4 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Account &amp; Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your subscription, security options, and connected devices.
        </p>
      </div>

      {/* User Info Card */}
      <div className="p-6 rounded-2xl border bg-card shadow-sm flex items-center gap-6">
        <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold shrink-0">
          {initials}
        </div>
        <div className="space-y-1 flex-1 min-w-0">
          {editName ? (
            <form onSubmit={handleSaveName} className="flex items-center gap-2">
              <input
                id="edit-name-input"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                className="flex-1 text-xl font-bold bg-background border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <button type="submit" disabled={nameLoading} className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-60">
                {nameLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Save"}
              </button>
              <button type="button" onClick={() => { setEditName(false); setNameError(""); }} className="px-3 py-1 border rounded-lg text-sm">
                Cancel
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{account?.name}</h2>
              <button onClick={() => { setEditName(true); setNameError(""); }} className="text-xs text-muted-foreground hover:text-forest underline">
                Edit
              </button>
            </div>
          )}
          {nameError && <p className="text-xs text-destructive">{nameError}</p>}
          <p className="text-sm text-muted-foreground">{account?.email}</p>
          <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
            {plan ? `${plan.name} Plan` : "No active plan"}
          </span>
        </div>
      </div>

      {/* Subscription & Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Plan Details */}
        <div className="p-6 rounded-xl border bg-card space-y-4">
          <div className="flex items-center gap-2 text-lg font-bold">
            <CreditCard className="h-5 w-5 text-primary" /> Active Plan
          </div>
          {plan ? (
            <>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-semibold">{plan.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-semibold">₹{plan.price}/{plan.cycle === "yearly" ? "yr" : "mo"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Devices</span>
                  <span className="font-semibold">{plan.devices}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Data</span>
                  <span className="font-semibold">{plan.data_cap_gb ? `${plan.data_cap_gb} GB/mo` : "Unlimited"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Data used</span>
                  <span className="font-semibold">{vpn?.data_used_gb ?? 0} GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expires</span>
                  <span className="font-semibold">
                    {vpn?.expires_at
                      ? new Date(vpn.expires_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                      : account?.joined}
                  </span>
                </div>
              </div>
              <ul className="space-y-1 pt-2 border-t">
                {(Array.isArray(plan.features) ? plan.features : []).map((feat, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No active subscription. Purchase a plan to get started.</p>
          )}
          <button
            id="upgrade-plan-btn"
            onClick={() => navigate("/dashboard/billing")}
            className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            {plan ? "Upgrade Plan" : "Get a Plan"}
          </button>
        </div>

        {/* Account Info */}
        <div className="p-6 rounded-xl border bg-card space-y-4">
          <div className="flex items-center gap-2 text-lg font-bold">
            <Smartphone className="h-5 w-5 text-primary" /> Account Info
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-primary" />
                <span className="font-medium">Member since</span>
              </div>
              <span className="text-muted-foreground">{account?.joined || "—"}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-primary" />
                <span className="font-medium">Max devices</span>
              </div>
              <span className="text-muted-foreground">{plan?.devices ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="font-medium">VPN status</span>
              </div>
              <span className={`text-xs font-semibold capitalize ${vpn?.status === "active" ? "text-emerald-500" : "text-muted-foreground"}`}>
                {vpn?.status ?? "inactive"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
