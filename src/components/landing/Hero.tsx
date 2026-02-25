import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Zap, BarChart2, Activity, DollarSign } from "lucide-react";

interface HeroProps {
  onCTAClick: () => void;
}

export default function Hero({ onCTAClick }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0F]">
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-60" />
      {/* Gradient blobs */}
      <div className="absolute inset-0 gradient-mesh" />
      {/* Noise texture */}
      <div className="absolute inset-0 noise-bg" />

      {/* Radial glow center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#00D9FF]/5 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-[#A855F7]/8 blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 py-32 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00D9FF]/30 bg-[#00D9FF]/5 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-pulse" />
          <span className="font-mono-accent text-xs text-[#00D9FF] uppercase tracking-widest">
            Now in Public Beta — Limited Access
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-display font-extrabold text-white leading-[1.05] tracking-tight mb-6"
          style={{ fontSize: "clamp(56px, 8vw, 110px)" }}
        >
          Financial{" "}
          <span
            className="relative inline-block"
            style={{
              background: "linear-gradient(135deg, #00D9FF 0%, #A855F7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Intelligence
          </span>
          <br />
          Redefined.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="font-body text-lg md:text-xl text-white/55 max-w-2xl leading-relaxed mb-10"
        >
          The command center for sophisticated finance teams. Real-time analytics,
          AI-driven insights, and enterprise-grade security — unified in one
          luminous platform.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-20"
        >
          <button
            onClick={onCTAClick}
            className="group flex items-center gap-2 font-mono-accent text-sm uppercase tracking-widest px-8 py-4 rounded-xl bg-[#00D9FF] text-black font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] animate-glow-pulse"
          >
            Start Free Trial
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
          <button
            className="flex items-center gap-2 font-body text-sm text-white/60 hover:text-white transition-colors duration-200"
            onClick={onCTAClick}
          >
            <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
              <svg className="w-3 h-3 ml-0.5" fill="white" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            Watch Demo
          </button>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl"
        >
          {/* Glow frame */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#00D9FF]/30 via-[#A855F7]/30 to-[#00D9FF]/30 blur-xl opacity-60 animate-pulse-slow" />
          <div className="relative rounded-2xl border border-[#00D9FF]/20 overflow-hidden glass">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              <div className="flex-1 mx-4 h-5 rounded bg-white/5 flex items-center justify-center">
                <span className="font-mono-accent text-xs text-white/20">app.nexaflow.io/dashboard</span>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="p-6 bg-[#0D0D16]">
              {/* Header row */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="font-display font-bold text-white text-lg mb-1">Portfolio Overview</div>
                  <div className="font-mono-accent text-xs text-white/40 uppercase tracking-widest">Updated 2s ago</div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00D9FF]/10 border border-[#00D9FF]/20">
                  <Activity className="w-3.5 h-3.5 text-[#00D9FF]" />
                  <span className="font-mono-accent text-xs text-[#00D9FF]">LIVE</span>
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Total AUM", value: "$2.84B", change: "+12.4%", icon: DollarSign, positive: true },
                  { label: "Daily P&L", value: "+$18.2M", change: "+2.1%", icon: TrendingUp, positive: true },
                  { label: "Risk Score", value: "0.34", change: "-0.02", icon: Shield, positive: true },
                  { label: "Velocity", value: "94.2ms", change: "-8ms", icon: Zap, positive: true },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-white/5 bg-white/3 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono-accent text-xs text-white/40 uppercase tracking-widest">{stat.label}</span>
                      <stat.icon className="w-3.5 h-3.5 text-white/20" />
                    </div>
                    <div className="font-display font-bold text-white text-lg">{stat.value}</div>
                    <div className={`font-mono-accent text-xs ${stat.positive ? "text-[#00D9FF]" : "text-red-400"}`}>{stat.change}</div>
                  </div>
                ))}
              </div>

              {/* Chart area */}
              <div className="rounded-xl border border-white/5 bg-white/2 p-4 h-36 flex items-end gap-1">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88, 65, 92, 78, 96, 82, 88, 72, 94].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm transition-all duration-300"
                    style={{
                      height: `${h}%`,
                      background: i > 14
                        ? "linear-gradient(to top, #00D9FF, #00D9FF60)"
                        : "rgba(255,255,255,0.08)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Floating metric cards */}
          <div className="absolute -left-8 top-1/3 hidden lg:block">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="glass border border-[#00D9FF]/20 rounded-xl p-3 w-36"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse" />
                <span className="font-mono-accent text-xs text-white/50 uppercase">Returns</span>
              </div>
              <div className="font-display font-bold text-[#00D9FF] text-xl">+34.7%</div>
              <div className="font-mono-accent text-xs text-white/30">YTD Performance</div>
            </motion.div>
          </div>

          <div className="absolute -right-8 top-1/4 hidden lg:block">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="glass border border-[#A855F7]/20 rounded-xl p-3 w-40"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-[#A855F7] animate-pulse" />
                <span className="font-mono-accent text-xs text-white/50 uppercase">AI Signal</span>
              </div>
              <div className="font-display font-bold text-[#A855F7] text-lg">BUY ALERT</div>
              <div className="font-mono-accent text-xs text-white/30">Confidence: 94.2%</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-16 flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {["BG", "AK", "SM", "JL", "RP"].map((initials, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#0A0A0F] flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${i % 2 === 0 ? "#00D9FF" : "#A855F7"}, ${i % 2 === 0 ? "#A855F7" : "#00D9FF"})`,
                  }}
                >
                  {initials}
                </div>
              ))}
            </div>
            <span className="font-body text-sm text-white/50">
              <span className="text-white font-medium">2,400+</span> finance teams trust NexaFlow
            </span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg key={i} className="w-4 h-4 text-[#00D9FF]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="font-mono-accent text-xs text-white/40 ml-1">4.9/5 on G2</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
