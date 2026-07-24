import { Link } from "react-router-dom";
import { Shield, Zap, Lock, Globe, CheckCircle2, ArrowRight } from "lucide-react";
import { plans } from "../data/mock";

export default function HomePage() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
          <Shield className="h-3.5 w-3.5" /> Next-Gen VPN Security
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
          Fast, Private &amp; <span className="text-primary">Unrestricted</span> Internet
        </h1>
        <p className="text-lg text-muted-foreground">
          Protect your online privacy with high-speed encrypted connections across 90+ global server locations.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-primary/90 transition-all"
          >
            Open Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/servers"
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-semibold border border-border hover:bg-secondary/80 transition-all"
          >
            Explore Servers
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Lock, title: "AES-256 Encryption", desc: "Bank-grade encryption keeps your data invisible to snoopers on any network." },
          { icon: Zap, title: "WireGuard Protocol", desc: "Ultra-fast tunneling with low latency — perfect for streaming, gaming, and calls." },
          { icon: Globe, title: "90+ Locations", desc: "Bypass geo-restrictions with optimised nodes spread across the globe." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="p-6 rounded-xl border bg-card shadow-sm space-y-3">
            <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </section>

      {/* Pricing */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Choose Your Plan</h2>
          <p className="text-muted-foreground">Transparent pricing. No hidden fees. Cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-6 rounded-2xl border bg-card shadow-sm flex flex-col justify-between ${
                plan.popular ? "border-primary ring-2 ring-primary/20" : ""
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
              )}
              <div className="space-y-4">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold">₹{plan.price}</span>
                  <span className="text-muted-foreground text-sm">/{plan.cycle === "yearly" ? "year" : "month"}</span>
                </div>
                <ul className="space-y-2 pt-2">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className={`w-full mt-6 py-2.5 rounded-lg font-semibold transition-all ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
        <Link to="/account" className="block text-sm text-center text-primary hover:underline">
          View account &amp; billing details →
        </Link>
      </section>
    </div>
  );
}
