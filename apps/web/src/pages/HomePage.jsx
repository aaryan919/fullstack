import { Link } from "react-router-dom";
import { Shield, Zap, Lock, Globe, ArrowRight, Server, Activity, CheckCircle2, Star } from "lucide-react";
import GradientBlinds from "@/components/ui/GradientBlinds";

export default function HomePage() {
  return (
    <div className="relative min-h-[100dvh]">
      {/* Abstract Background */}
      <div className="absolute inset-0 grid-background pointer-events-none -z-10" />

      <div className="space-y-24 py-16 max-w-6xl mx-auto px-5">

        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl text-center space-y-8 max-w-4xl mx-auto pt-10">
          <div className="absolute inset-0 -z-10" style={{ background: 'magenta', opacity: 1 }}>
            {/* <GradientBlinds
              gradientColors={["#10b981", "#0d9488"]}
              angle={15}
              noise={0.15}
              blindCount={14}
              blindMinWidth={50}
              spotlightRadius={0.3}
              spotlightSoftness={2}
              spotlightOpacity={0.15}
              mouseDampening={0.15}
              distortAmount={0}
              shineDirection="left"
              mixBlendMode="normal"
            /> */}
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground text-balance">
            Fast, Private & <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Unrestricted</span> Internet
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Protect your online privacy with high-speed encrypted connections. Built for gaming — stable, low-latency, undetectable.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 rounded-xl font-semibold shadow-xl shadow-black/10 hover:scale-105 transition-all"
            >
              See Plans <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/servers"
              className="inline-flex items-center gap-2 bg-white text-foreground px-8 py-4 rounded-xl font-semibold border border-border shadow-sm hover:bg-gray-50 transition-all"
            >
              Explore Servers
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="space-y-12 pt-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Why ProjectVPN?</h2>
            <p className="text-muted-foreground">Engineered for seamless connectivity and absolute privacy.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Lock, title: "VLESS + REALITY", desc: "Traffic on port 443 is indistinguishable from normal HTTPS — invisible to strict DPI firewalls." },
              { icon: Zap, title: "Gaming-grade ping", desc: "Optimised Bangalore server. ≤30ms for Valorant and other competitive titles on any network." },
              { icon: Globe, title: "Self-serve setup", desc: "Buy a plan, scan the QR code, and you're live in under 60 seconds. No manual config steps." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-8 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow space-y-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 w-fit">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-12 border-y border-border/50">
          <div className="text-center space-y-12">
            <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-border -z-10" />
              {[
                { step: "1", title: "Choose a Plan", desc: "Select a data plan that fits your needs." },
                { step: "2", title: "Get Config", desc: "Instantly receive your VLESS configuration." },
                { step: "3", title: "Connect", desc: "Import to your client and browse freely." },
              ].map((item) => (
                <div key={item.step} className="space-y-4 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-background border-2 border-emerald-500 flex items-center justify-center text-xl font-black text-emerald-600 shadow-lg shadow-emerald-500/20">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Performance Metrics Section */}
        <section className="bg-foreground text-background rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Uncompromising Performance</h2>
              <p className="text-gray-400 text-lg">We don't throttle speeds. Experience the internet as it was meant to be—fast, reliable, and entirely yours.</p>
              <ul className="space-y-4">
                {[
                  "10Gbps Server Uplinks",
                  "AES-256-GCM Encryption",
                  "99.99% Guaranteed Uptime"
                ].map(feature => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-sm space-y-2">
                <Shield className="h-8 w-8 text-emerald-400" />
                <p className="text-4xl font-black">Zero</p>
                <p className="text-sm text-gray-400">Traffic Logs Kept</p>
              </div>
              <div className="bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-sm space-y-2">
                <Activity className="h-8 w-8 text-emerald-400" />
                <p className="text-4xl font-black">{'<30ms'}</p>
                <p className="text-sm text-gray-400">Avg. Latency</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="pb-16 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Loved by users</h2>
            <p className="text-muted-foreground">Don't just take our word for it.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Alex M.", role: "Gamer", text: "Finally a VPN that bypasses strict network firewalls without lagging my Valorant games." },
              { name: "Sarah K.", role: "Freelancer", text: "The self-serve setup was incredibly smooth. I was connected within a minute." },
              { name: "Rahul D.", role: "Developer", text: "Stable, fast, and completely invisible. VLESS with REALITY is a game changer." }
            ].map((t, i) => (
              <div key={i} className="p-8 rounded-2xl border bg-card space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-foreground font-medium">"{t.text}"</p>
                <div>
                  <p className="font-bold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
