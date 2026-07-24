import { useState } from "react";
import { ShieldCheck, ShieldAlert, Activity, ArrowUpRight, ArrowDownRight, Wifi } from "lucide-react";
import { servers, usageDaily } from "../data/mock";

const FLAG_EMOJI = { IN: "🇮🇳", SG: "🇸🇬", GB: "🇬🇧", US: "🇺🇸", DE: "🇩🇪", JP: "🇯🇵", NL: "🇳🇱", AU: "🇦🇺" };

export default function DashboardPage() {
  const [connected, setConnected] = useState(false);
  const [selectedServer, setSelectedServer] = useState(servers[0]);

  const totalData = usageDaily.reduce((sum, d) => sum + d.gb, 0).toFixed(1);

  return (
    <div className="space-y-8 py-4">
      {/* Connection Status Banner */}
      <div className="p-6 rounded-2xl border bg-card shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div
            className={`p-4 rounded-2xl transition-colors ${
              connected ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
            }`}
          >
            {connected ? <ShieldCheck className="h-10 w-10" /> : <ShieldAlert className="h-10 w-10" />}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">VPN Status</span>
              <span className={`inline-block w-2 h-2 rounded-full ${connected ? "bg-emerald-500 animate-pulse" : "bg-destructive"}`} />
            </div>
            <h2 className="text-2xl font-bold">
              {connected ? `${selectedServer.city}, ${selectedServer.country}` : "Disconnected"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {connected ? `Protected · Ping ${selectedServer.ping}ms` : "Your real IP is exposed"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setConnected(!connected)}
          className={`px-8 py-4 rounded-xl font-bold text-lg shadow-md transition-all ${
            connected
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          }`}
        >
          {connected ? "Disconnect" : "Quick Connect"}
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border bg-card space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase">Download</span>
            <ArrowDownRight className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold">{connected ? "124.8 Mbps" : "—"}</p>
        </div>
        <div className="p-4 rounded-xl border bg-card space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase">Upload</span>
            <ArrowUpRight className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">{connected ? "45.2 Mbps" : "—"}</p>
        </div>
        <div className="p-4 rounded-xl border bg-card space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase">Ping</span>
            <Activity className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold">{selectedServer.ping}ms</p>
        </div>
        <div className="p-4 rounded-xl border bg-card space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase">This Week</span>
            <Wifi className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-bold">{totalData} GB</p>
        </div>
      </div>

      {/* Server Selector */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Select Location</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {servers.slice(0, 6).map((srv) => (
            <div
              key={srv.id}
              onClick={() => setSelectedServer(srv)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedServer.id === srv.id
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
    </div>
  );
}
