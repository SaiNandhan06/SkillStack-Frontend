import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Zap, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "0",
    period: "/mo",
    description:
      "For individuals looking to track their skills and share a public portfolio.",
    features: [
      "Up to 5 active certifications",
      "Public profile link",
      "Basic goal tracking",
      "Basic AI insights",
      "Email support",
    ],
    cta: "Start Free Trial",
    accent: "#00D9FF",
    highlighted: false,
    tag: null,
  },
  {
    name: "Pro",
    price: "999",
    period: "/mo",
    description:
      "For ambitious career climbers who need advanced certificate oversight.",
    features: [
      "Unlimited certifications",
      "AI skill gap analysis",
      "Advanced goal tracking",
      "Custom expiration alerts",
      "Priority 24/7 support",
      "Premium public profile",
    ],
    cta: "Start Free Trial",
    accent: "#A855F7",
    highlighted: true,
    tag: "MOST POPULAR",
  },
  {
    name: "Team",
    price: "2499",
    period: "/mo",
    description:
      "For managers to track team upskilling and compliance requirements.",
    features: [
      "Up to 10 team members",
      "Team upskilling dashboard",
      "Compliance reporting",
      "Custom skill mapping",
      "Role-based access",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    accent: "#00D9FF",
    highlighted: false,
    tag: null,
  },
];

export default function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="pricing"
      className="relative py-32 bg-[#0A0A0F] overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D9FF]/20 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#A855F7]/5 blur-[120px] pointer-events-none" />

      <div ref={ref} className="relative z-10 max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#A855F7]/30 bg-[#A855F7]/5 mb-6">
            <span className="font-mono-accent text-xs text-[#A855F7] uppercase tracking-widest">
              Pricing
            </span>
          </div>
          <h2
            className="font-display font-extrabold text-white leading-tight mb-4"
            style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
          >
            Transparent,{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00D9FF, #A855F7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              scalable pricing
            </span>
          </h2>
          <p className="font-body text-lg text-white/50 max-w-md mx-auto">
            No hidden fees. No lock-in. Cancel anytime.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              className={`relative rounded-2xl border p-8 flex flex-col transition-all duration-300 ${plan.highlighted
                ? "border-[#A855F7]/40 bg-[#12121A]"
                : "border-white/8 bg-[#12121A] hover:border-white/20"
                }`}
              style={
                plan.highlighted
                  ? {
                    boxShadow: `0 0 40px rgba(168, 85, 247, 0.15), 0 0 80px rgba(168, 85, 247, 0.05)`,
                  }
                  : {}
              }
            >
              {/* Highlighted glow border */}
              {plan.highlighted && (
                <div
                  className="absolute -inset-px rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(#12121A, #12121A) padding-box, linear-gradient(135deg, rgba(168, 85, 247, 0.6), rgba(0, 217, 255, 0.4)) border-box",
                    border: "1px solid transparent",
                  }}
                />
              )}

              {/* Tag */}
              {plan.tag && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A855F7] text-black">
                    <Zap className="w-3 h-3" />
                    <span className="font-mono-accent text-xs font-bold uppercase tracking-widest">
                      {plan.tag}
                    </span>
                  </div>
                </div>
              )}

              {/* Plan header */}
              <div className="relative mb-6">
                <div
                  className="font-mono-accent text-xs uppercase tracking-widest mb-3"
                  style={{ color: plan.accent }}
                >
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1 mb-3">
                  {plan.price === "Custom" ? (
                    <span className="font-display font-extrabold text-white text-4xl">
                      Custom
                    </span>
                  ) : (
                    <>
                      <span className="font-mono-accent text-white/50 text-xl">
                        ₹
                      </span>
                      <span className="font-display font-extrabold text-white text-5xl">
                        {plan.price}
                      </span>
                      <span className="font-body text-white/40 text-sm">
                        {plan.period}
                      </span>
                    </>
                  )}
                </div>
                <p className="font-body text-sm text-white/50 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              {/* Divider */}
              <div
                className="w-full h-px mb-6"
                style={{
                  background: `linear-gradient(90deg, transparent, ${plan.accent}40, transparent)`,
                }}
              />

              {/* Features */}
              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${plan.accent}20` }}
                    >
                      <Check
                        className="w-2.5 h-2.5"
                        style={{ color: plan.accent }}
                        strokeWidth={3}
                      />
                    </div>
                    <span className="font-body text-sm text-white/60">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                className="group relative w-full py-3.5 rounded-xl font-mono-accent text-sm uppercase tracking-widest font-medium transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                style={
                  plan.highlighted
                    ? {
                      background: "linear-gradient(135deg, #A855F7, #00D9FF)",
                      color: "black",
                      boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)",
                    }
                    : {
                      background: `${plan.accent}15`,
                      color: plan.accent,
                      border: `1px solid ${plan.accent}30`,
                    }
                }
              >
                {plan.cta}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center font-body text-sm text-white/30 mt-10"
        >
          All plans include a 14-day free trial. No credit card required.
        </motion.p>
      </div>
    </section>
  );
}
