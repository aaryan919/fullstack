import { Smartphone, CreditCard, HardDrive, CheckCircle2 } from "lucide-react";
import { plans } from "../data/mock";

const accountUser = {
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  planId: "grove",
  joined: "January 2025",
  activeDevices: 4,
  dataUsedGB: 68.5,
};

export default function AccountPage() {
  const activePlan = plans.find((p) => p.id === accountUser.planId);

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
        <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
          {accountUser.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold">{accountUser.name}</h2>
          <p className="text-sm text-muted-foreground">{accountUser.email}</p>
          <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
            {activePlan?.name} Plan
          </span>
        </div>
      </div>

      {/* Subscription & Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Plan Details */}
        <div className="p-6 rounded-xl border bg-card space-y-4">
          <div className="flex items-center gap-2 text-lg font-bold">
            <CreditCard className="h-5 w-5 text-primary" /> Active Plan
          </div>
          {activePlan && (
            <>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-semibold">{activePlan.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-semibold">₹{activePlan.price}/{activePlan.cycle === "yearly" ? "yr" : "mo"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Devices</span>
                  <span className="font-semibold">{activePlan.devices}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Data</span>
                  <span className="font-semibold">{activePlan.data === 0 ? "Unlimited" : `${activePlan.data} GB/mo`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="font-semibold">{accountUser.joined}</span>
                </div>
              </div>
              <ul className="space-y-1 pt-2 border-t">
                {activePlan.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <button className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
            Upgrade Plan
          </button>
        </div>

        {/* Devices */}
        <div className="p-6 rounded-xl border bg-card space-y-4">
          <div className="flex items-center gap-2 text-lg font-bold">
            <Smartphone className="h-5 w-5 text-primary" /> Connected Devices
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-emerald-500" />
                <span className="font-medium">Windows Workstation</span>
              </div>
              <span className="text-xs text-emerald-500 font-semibold">Active</span>
            </div>
            <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-emerald-500" />
                <span className="font-medium">Android Phone</span>
              </div>
              <span className="text-xs text-emerald-500 font-semibold">Active</span>
            </div>
            <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-muted/50 opacity-60">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">iPad</span>
              </div>
              <span className="text-xs text-muted-foreground font-semibold">Inactive</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            {accountUser.activeDevices} of {activePlan?.devices} devices connected
          </div>
          <button className="w-full py-2 rounded-lg border font-semibold text-sm hover:bg-muted transition-colors">
            Manage All Devices
          </button>
        </div>
      </div>
    </div>
  );
}
