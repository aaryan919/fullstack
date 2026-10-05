import { useState, useEffect } from "react";
import { ShieldCheck, ShieldAlert, Activity, ArrowUpRight, ArrowDownRight, Wifi, QrCode, X, Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { getServers, vpnApi } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const FLAG_EMOJI = { IN: "🇮🇳", SG: "🇸🇬", GB: "🇬🇧", US: "🇺🇸", DE: "🇩🇪", JP: "🇯🇵", NL: "🇳🇱", AU: "🇦🇺" };

export default function DashboardPage() {
  const { user } = useAuth();

  const [servers, setServers] = useState([]);
  const [vpnStatus, setVpnStatus] = useState(null);
  const [selectedServer, setSelectedServer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [reconnectMsg, setReconnectMsg] = useState("");

  useEffect(() => {
    Promise.all([getServers(), vpnApi.status()])
      .then(([srvs, vpn]) => {
        setServers(srvs);
        setSelectedServer(srvs[0] || null);
        setVpnStatus(vpn);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function handleReconnect() {
    setReconnecting(true);
    setReconnectMsg("");
    vpnApi.reconnect()
      .then((res) => {
        setReconnectMsg(res.message || "Reconnected.");
        return vpnApi.status();
      })
      .then(setVpnStatus)
      .catch((err) => setReconnectMsg(err.message || "Failed to reconnect. Please contact support."))
      .finally(() => setReconnecting(false));
  }

  function copySubUrl() {
    if (!vpnStatus?.subscription_url) return;
    navigator.clipboard.writeText(vpnStatus.subscription_url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const hasSubscriptionRecord = !!vpnStatus?.has_subscription;
  const subActive = vpnStatus?.sub_status === "active" && new Date(vpnStatus?.expires_at) > new Date();
  const clientHealthy = vpnStatus?.client_status === "active";
  const needsReconnect = hasSubscriptionRecord && subActive && !clientHealthy;
  const hasActiveSub = hasSubscriptionRecord && subActive && clientHealthy;
  const dataUsed = vpnStatus?.data_used_gb ?? 0;
  const dataCap = vpnStatus?.data_cap_gb ?? null;
  const dataCapLabel = dataCap ? `${dataCap} GB` : "Unlimited";
  const dataUsePct = dataCap ? Math.min(100, (dataUsed / dataCap) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">

      {/* Connection Status Banner */}
      <div className="p-6 rounded-2xl border bg-card shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl transition-colors ${hasActiveSub ? "bg-emerald-500/10 text-emerald-500" : needsReconnect ? "bg-amber-500/10 text-amber-500" : "bg-destructive/10 text-destructive"}`}>
            {hasActiveSub ? <ShieldCheck className="h-10 w-10" /> : <ShieldAlert className="h-10 w-10" />}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">VPN Status</span>
              <span className={`inline-block w-2 h-2 rounded-full ${hasActiveSub ? "bg-emerald-500 animate-pulse" : needsReconnect ? "bg-amber-500 animate-pulse" : "bg-destructive"}`} />
            </div>
            <h2 className="text-2xl font-bold">
              {hasActiveSub
                ? `${vpnStatus.plan_name} Plan — Active`
                : needsReconnect
                  ? `${vpnStatus.plan_name} Plan — Needs Reconnecting`
                  : "No Active Subscription"}
            </h2>
            <div className="mt-3">
              {hasActiveSub ? (
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  Expires {new Date(vpnStatus.expires_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              ) : needsReconnect ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Your plan is active until {new Date(vpnStatus.expires_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}, but your VPN connection needs to be re-established.
                  </p>
                  <button
                    onClick={handleReconnect}
                    disabled={reconnecting}
                    className="inline-block px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    {reconnecting ? "Reconnecting…" : "Reconnect VPN"}
                  </button>
                  {reconnectMsg && <p className="text-xs text-muted-foreground">{reconnectMsg}</p>}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Purchase a plan to get your VPN config</p>
                  <Link
                    to="/dashboard/billing"
                    className="inline-block px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    View Plans
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {hasActiveSub && (
          <button
            id="show-qr-btn"
            onClick={() => setShowQr(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-md bg-forest text-primary-foreground hover:bg-forest/90 transition-all"
          >
            <QrCode className="h-4 w-4" /> Show Config
          </button>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border bg-card space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase">Data Used</span>
            <ArrowDownRight className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold">{dataUsed} GB</p>
          <p className="text-xs text-muted-foreground">of {dataCapLabel}</p>
        </div>

        {dataCap && (
          <div className="p-4 rounded-xl border bg-card space-y-2 col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase">Data Cap</span>
              <ArrowUpRight className="h-4 w-4 text-blue-500" />
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${dataUsePct > 80 ? "bg-red-500" : "bg-primary"}`}
                style={{ width: `${dataUsePct}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{dataUsePct.toFixed(1)}% used</p>
          </div>
        )}

        <div className="p-4 rounded-xl border bg-card space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase">Ping</span>
            <Activity className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold">{selectedServer?.ping ?? "—"}ms</p>
        </div>

        <div className="p-4 rounded-xl border bg-card space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase">Plan</span>
            <Wifi className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-bold">{vpnStatus?.plan_name ?? "—"}</p>
        </div>
      </div>

      {/* Server Selector */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Server Locations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {servers.slice(0, 6).map((srv) => (
            <div
              key={srv.id}
              onClick={() => setSelectedServer(srv)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${selectedServer?.id === srv.id
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "bg-card hover:border-muted-foreground/40"
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{FLAG_EMOJI[srv.flag] || "🌐"}</span>
                <div>
                  <div className="font-semibold text-sm">{srv.city}</div>
                  <div className="text-xs text-muted-foreground">{srv.ping}ms</div>
                </div>
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded bg-muted">{srv.load}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* QR Code Modal */}
      {showQr && vpnStatus?.qr_code_base64 && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowQr(false)}
        >
          <div
            className="bg-card rounded-2xl border shadow-xl p-8 max-w-sm w-full space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Your VPN Config</h3>
              <button onClick={() => setShowQr(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex justify-center">
              <img
                src={vpnStatus.qr_code_base64}
                alt="VPN config QR code"
                className="w-64 h-64 rounded-lg border"
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground text-center">
                Scan with v2rayNG (Android), v2rayN (Windows), or Shadowrocket (iOS)
              </p>
              <button
                id="copy-suburl-btn"
                onClick={copySubUrl}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium hover:bg-muted transition-colors"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy subscription URL"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
