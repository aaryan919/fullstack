import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { getPlans, paymentsApi } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import GradientBlinds from "@/components/ui/GradientBlinds";
// ── Razorpay Checkout helper ───────────────────────────────────────────────

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

async function openRazorpayCheckout({ order, user, onSuccess, onFailure, onDismiss }) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    onFailure("Failed to load payment widget. Please try again.");
    return;
  }

  const options = {
    key: order.key_id,
    amount: order.amount,
    currency: order.currency || "INR",
    name: "ProjectVPN",
    description: `${order.plan_name} Plan`,
    order_id: order.razorpay_order_id,
    prefill: {
      name: user?.name || "",
      email: user?.email || "",
    },
    theme: { color: "#2d5a27" },
    handler: async (response) => {
      try {
        await paymentsApi.verify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          subscription_id: order.subscription_id,
        });
        onSuccess();
      } catch (err) {
        onFailure(err.message || "Payment verification failed.");
      }
    },
    modal: {
      ondismiss: () => {
        onDismiss();
      },
    },
  };

  const rp = new window.Razorpay(options);
  rp.on("payment.failed", (resp) => {
    onFailure(resp?.error?.description || "Payment failed. Please try again.");
  });
  rp.open();
}

export default function PricingPage() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [payError, setPayError] = useState("");
  const [payLoading, setPayLoading] = useState(null);

  useEffect(() => {
    getPlans()
      .then(setPlans)
      .catch(() => setPlans([]))
      .finally(() => setPlansLoading(false));
  }, []);

  const handleGetStarted = useCallback(async (planId) => {
    if (!isLoggedIn) {
      navigate("/signup");
      return;
    }

    setPayError("");
    setPayLoading(planId);

    try {
      const order = await paymentsApi.createOrder(planId);
      await openRazorpayCheckout({
        order,
        user,
        onSuccess: () => {
          setPayLoading(null);
          navigate("/dashboard");
        },
        onFailure: (msg) => {
          setPayLoading(null);
          setPayError(msg);
        },
        onDismiss: () => {
          setPayLoading(null);
        },
      });
    } catch (err) {
      setPayError(err.message || "Failed to start checkout.");
      setPayLoading(null);
    }
  }, [isLoggedIn, user, navigate]);

  return (
    <div className="py-12 max-w-6xl mx-auto px-5 space-y-8">
      <div className="relative text-center space-y-2 overflow-hidden rounded-3xl py-10">
        <div className="absolute inset-0 -z-10 opacity-60">
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
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Choose Your Plan</h1>
        <p className="text-lg text-muted-foreground">Transparent pricing. No hidden fees. Cancel anytime.</p>
      </div>

      {payError && (
        <div className="max-w-md mx-auto p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
          {payError}
        </div>
      )}

      {plansLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-6 rounded-2xl border bg-card shadow-sm flex flex-col justify-between ${plan.popular ? "border-primary ring-2 ring-primary/20" : ""
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
                  <span className="text-4xl font-extrabold">₹{plan.price}</span>
                  <span className="text-muted-foreground text-sm">/{plan.cycle === "yearly" ? "year" : "month"}</span>
                </div>
                <ul className="space-y-3 pt-4">
                  {(Array.isArray(plan.features) ? plan.features : []).map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="leading-tight">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                id={`plan-${plan.id}-cta`}
                onClick={() => handleGetStarted(plan.id)}
                disabled={payLoading === plan.id}
                className={`w-full mt-8 py-3 rounded-xl font-semibold transition-all disabled:opacity-60 ${plan.popular
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border"
                  }`}
              >
                {payLoading === plan.id ? "Opening checkout…" : "Get Started"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
