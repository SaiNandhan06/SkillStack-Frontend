import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FinalCTA({ onCTAClick }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-32 overflow-hidden bg-[#0A0A0F]">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#00D9FF]/8 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] rounded-full bg-[#A855F7]/10 blur-[80px]" />
      </div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D9FF]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#A855F7]/20 to-transparent" />

      <div ref={ref} className="relative z-10 max-w-[1280px] mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00D9FF]/30 bg-[#00D9FF]/5 mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span className="font-mono-accent text-xs text-[#00D9FF] uppercase tracking-widest">
              Get Started Today
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-extrabold text-white leading-tight mb-6"
            style={{ fontSize: "clamp(40px, 6vw, 88px)" }}
          >
            The edge you{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00D9FF 0%, #A855F7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              deserve
            </span>
            <br />
            starts here.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="font-body text-xl text-white/50 mb-12 max-w-xl mx-auto leading-relaxed"
          >
            Join 2,400+ finance teams already using SkillStack to generate
            superior risk-adjusted returns. 14-day free trial, no credit card
            required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={onCTAClick}
              className="group flex items-center gap-2 font-mono-accent text-sm uppercase tracking-widest px-10 py-4 rounded-xl font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #00D9FF, #A855F7)",
                color: "black",
                boxShadow:
                  "0 0 30px rgba(0, 217, 255, 0.3), 0 0 60px rgba(168, 85, 247, 0.15)",
              }}
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <a
              href="#pricing"
              className="font-body text-sm text-white/50 hover:text-white transition-colors duration-200 underline underline-offset-4"
            >
              View Pricing
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-12"
          >
            {[
              "SOC 2 Type II",
              "99.99% Uptime SLA",
              "AES-256 Encrypted",
              "GDPR Compliant",
            ].map((badge) => (
              <div key={badge} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]" />
                <span className="font-mono-accent text-xs text-white/40 uppercase tracking-widest">
                  {badge}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
