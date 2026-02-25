import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  BarChart2,
  Shield,
  Zap,
  Brain,
  Globe,
  Lock,
  TrendingUp,
  Bell,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    label: "AI Engine",
    title: "Predictive Intelligence at Scale",
    description:
      "Our proprietary ML models analyze 10,000+ data signals in real time to surface actionable insights before the market moves. Stay perpetually ahead.",
    accent: "#00D9FF",
    gradient: "from-[#00D9FF]/10 to-transparent",
    tag: "CORE ENGINE",
  },
  {
    icon: BarChart2,
    label: "Analytics",
    title: "Real-Time Portfolio Analytics",
    description:
      "Live dashboards with sub-100ms latency. Drill into positions, attribution, and risk exposure across all asset classes with surgical precision.",
    accent: "#A855F7",
    gradient: "from-[#A855F7]/10 to-transparent",
    tag: "ANALYTICS",
  },
  {
    icon: Shield,
    label: "Risk",
    title: "Institutional Risk Management",
    description:
      "Multi-factor risk modeling with stress testing, VaR calculation, and automated circuit breakers. Sleep soundly knowing every downside is quantified.",
    accent: "#00D9FF",
    gradient: "from-[#00D9FF]/10 to-transparent",
    tag: "RISK",
  },
  {
    icon: Globe,
    label: "Coverage",
    title: "Global Market Coverage",
    description:
      "Access 150+ exchanges, crypto markets, and alternative data sources — unified under one normalized API. No more data silos.",
    accent: "#A855F7",
    gradient: "from-[#A855F7]/10 to-transparent",
    tag: "COVERAGE",
  },
  {
    icon: Zap,
    label: "Speed",
    title: "Ultra-Low Latency Execution",
    description:
      "Co-located servers in 12 data centers globally. Order routing optimized by AI to minimize slippage and maximize fill rates.",
    accent: "#00D9FF",
    gradient: "from-[#00D9FF]/10 to-transparent",
    tag: "EXECUTION",
  },
  {
    icon: Lock,
    label: "Security",
    title: "Bank-Grade Security Architecture",
    description:
      "SOC 2 Type II certified, AES-256 encryption, and zero-trust network architecture. Your data is protected at every layer.",
    accent: "#A855F7",
    gradient: "from-[#A855F7]/10 to-transparent",
    tag: "SECURITY",
  },
  {
    icon: TrendingUp,
    label: "Backtesting",
    title: "Strategy Backtesting & Simulation",
    description:
      "20+ years of tick-level historical data. Run strategies through any market regime and validate performance before deploying capital.",
    accent: "#00D9FF",
    gradient: "from-[#00D9FF]/10 to-transparent",
    tag: "RESEARCH",
  },
  {
    icon: Bell,
    label: "Alerts",
    title: "Intelligent Alert System",
    description:
      "AI-prioritized notifications that learn from your behavior. Get the signals that matter, not the noise — delivered via any channel.",
    accent: "#A855F7",
    gradient: "from-[#A855F7]/10 to-transparent",
    tag: "ALERTS",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

interface FeatureCardProps {
  feature: (typeof features)[0];
}

function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
      className="group relative rounded-2xl border border-white/8 bg-[#12121A] p-6 cursor-default transition-all duration-300 hover:border-opacity-0 gradient-border-hover"
      style={{
        background: "rgba(18, 18, 26, 0.8)",
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: `0 0 30px ${feature.accent}20, inset 0 0 30px ${feature.accent}05`,
        }}
      />

      {/* Tag */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="font-mono-accent text-xs uppercase tracking-widest px-2.5 py-1 rounded-md"
          style={{
            color: feature.accent,
            background: `${feature.accent}15`,
          }}
        >
          {feature.tag}
        </span>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
          style={{ background: `${feature.accent}15` }}
        >
          <feature.icon className="w-5 h-5" style={{ color: feature.accent }} />
        </div>
      </div>

      {/* Content */}
      <h3 className="font-display font-bold text-white text-lg leading-snug mb-3">
        {feature.title}
      </h3>
      <p className="font-body text-sm text-white/50 leading-relaxed">
        {feature.description}
      </p>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${feature.accent}, transparent)`,
        }}
      />
    </motion.div>
  );
}

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="relative py-32 bg-[#0A0A0F] overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D9FF]/20 to-transparent" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#A855F7]/30 bg-[#A855F7]/5 mb-6">
            <span className="font-mono-accent text-xs text-[#A855F7] uppercase tracking-widest">
              Capabilities
            </span>
          </div>
          <h2
            className="font-display font-extrabold text-white leading-tight mb-6"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          >
            Built for the{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00D9FF, #A855F7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              elite
            </span>
          </h2>
          <p className="font-body text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
            Every feature engineered for professional-grade performance. No compromises.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map((feature) => (
            <FeatureCard key={feature.label} feature={feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
