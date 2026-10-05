import { useState, useEffect } from "react";
import { Search, Check } from "lucide-react";
import { getServers } from "../lib/api";

const FLAG_EMOJI = { IN: "🇮🇳", SG: "🇸🇬", GB: "🇬🇧", US: "🇺🇸", DE: "🇩🇪", JP: "🇯🇵", NL: "🇳🇱", AU: "🇦🇺" };

export default function ServersPage() {
  const [servers,         setServers]         = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [search,          setSearch]          = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");

  useEffect(() => {
    getServers()
      .then(setServers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const allCountries = [...new Set(servers.map((s) => s.country))];

  const filtered = servers.filter((s) => {
    const matchSearch =
      s.city.toLowerCase().includes(search.toLowerCase()) ||
      s.country.toLowerCase().includes(search.toLowerCase());
    const matchCountry = selectedCountry === "All" || s.country === selectedCountry;
    return matchSearch && matchCountry;
  });

  return (
    <div className="space-y-6 py-8 md:py-12 max-w-6xl mx-auto px-5 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Global VPN Servers</h1>
          <p className="text-sm text-muted-foreground">
            {servers.length} high-speed node{servers.length !== 1 ? "s" : ""} across {allCountries.length} countr{allCountries.length !== 1 ? "ies" : "y"}.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            id="server-search"
            type="text"
            placeholder="Search city or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Country Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {["All", ...allCountries].map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCountry(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              selectedCountry === c
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Servers Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((srv) => (
            <div key={srv.id} className="p-5 rounded-xl border bg-card shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{FLAG_EMOJI[srv.flag] || "🌐"}</span>
                  <div>
                    <h3 className="font-bold text-base">{srv.city}</h3>
                    <span className="text-xs text-muted-foreground">{srv.country}</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                  <Check className="h-3 w-3" /> Online
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-center text-xs border-t">
                <div>
                  <span className="text-muted-foreground block">Ping</span>
                  <span className="font-semibold">{srv.ping}ms</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Load</span>
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${srv.load > 70 ? "bg-red-500" : srv.load > 45 ? "bg-amber-500" : "bg-emerald-500"}`}
                        style={{ width: `${srv.load}%` }}
                      />
                    </div>
                    <span className="font-semibold">{srv.load}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && !loading && (
            <p className="col-span-full text-center text-muted-foreground py-12">
              No servers match your search.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
