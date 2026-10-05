import React from "react";
import { HelpCircle } from "lucide-react";
import GradientBlinds from "@/components/ui/GradientBlinds";

const faqs = [
  { q: "Do you keep any logs?", a: "No. ProjectVPN runs a strict no-logs policy. We never record your browsing history, traffic destination, or connection timestamps." },
  { q: "Which payment methods are supported?", a: "We process payments securely through Razorpay in INR, supporting UPI, cards, netbanking and wallets." },
  { q: "Can I use one account on multiple devices?", a: "Yes. Each plan includes a device limit — from 2 on Leaf up to 10 on Canopy. Manage active devices from your account settings." },
  { q: "Is there a free trial?", a: "New accounts get a 7-day trial on the Grove plan. No charge until the trial ends, cancel anytime." },
  { q: "How do I cancel?", a: "Cancel any time from your dashboard. Your plan stays active until the end of the current billing cycle." },
];

export default function FaqPage() {
  return (
    <div className="py-12 max-w-3xl mx-auto px-5 space-y-8">
      <div className="relative text-center space-y-4 overflow-hidden rounded-3xl py-10">
        <div className="absolute inset-0 -z-10 opacity-60">
          <GradientBlinds
            gradientColors={["#10b981", "#0d9488"]}
            angle={15}
            noise={0.3}
            blindCount={14}
            blindMinWidth={50}
            spotlightRadius={0.6}
            spotlightSoftness={1}
            spotlightOpacity={1}
            mouseDampening={0.15}
            distortAmount={0}
            shineDirection="left"
            mixBlendMode="normal"
          />
        </div>
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
          <HelpCircle className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-foreground">Everything you need to know about ProjectVPN.</p>
      </div>

      <div className="space-y-4 pt-4">
        {faqs.map((item) => (
          <details key={item.q} className="p-5 rounded-2xl border bg-card shadow-sm group">
            <summary className="font-semibold text-lg cursor-pointer list-none flex items-center justify-between">
              {item.q}
              <span className="text-muted-foreground group-open:rotate-180 transition-transform text-2xl leading-none">‹</span>
            </summary>
            <p className="mt-4 text-muted-foreground leading-relaxed pl-1 pr-8">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}