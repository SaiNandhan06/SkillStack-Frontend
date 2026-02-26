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
    label: "AI Guidance",
    title: "Predictive Career Insights",
    description:
      "Our ML models analyze industry trends to surface high-value skills and certifications before they become mainstream. Stay perpetually ahead.",
    accent: "#00D9FF",
    gradient: "from-[#00D9FF]/10 to-transparent",
    tag: "AI PATHWAYS",
  },
  {
    icon: BarChart2,
    label: "Analytics",
    title: "Real-Time Skill Analytics",
    description:
      "Live dashboards to track your learning hours, skill proficiency, and certification statuses with surgical precision.",
    accent: "#A855F7",
    gradient: "from-[#A855F7]/10 to-transparent",
    tag: "TRACKING",
  },
  {
    icon: Shield,
    label: "Goal tracking",
    title: "Robust Goal Management",
    description:
      "Kanban-style boards and structured milestone tracking ensure you actually hit your career transition targets.",
    accent: "#00D9FF",
    gradient: "from-[#00D9FF]/10 to-transparent",
    tag: "TARGETS",
  },
  {
    icon: Globe,
    label: "Portfolio",
    title: "Public Skill Portfolio",
    description:
      "Showcase your validated skills and active certifications to recruiters with a beautifully designed, shareable public profile link.",
    accent: "#A855F7",
    gradient: "from-[#A855F7]/10 to-transparent",
    tag: "PROFILE",
  },
  {
    icon: Zap,
    label: "Expiry",
    title: "Automated Renewals",
    description:
      "Never let a certification lapse again. Intelligent color-coded tracking systems monitor your credentials and alert you when renewals are due.",
    accent: "#00D9FF",
    gradient: "from-[#00D9FF]/10 to-transparent",
    tag: "COMPLIANCE",
  },
  {
    icon: Lock,
    label: "Security",
    title: "Enterprise-Grade Privacy",
    description:
      "SOC 2 Type II certified. Your career data, certificates, and personal goals are protected with robust privacy toggles and encryption.",
    accent: "#A855F7",
    gradient: "from-[#A855F7]/10 to-transparent",
    tag: "SECURITY",
  },
  {
    icon: TrendingUp,
    label: "Growth",
    title: "Skill Gap Analysis",
    description:
      "Map your current proficiencies against target roles. Automatically identify missing credentials required for your next promotion.",
    accent: "#00D9FF",
    gradient: "from-[#00D9FF]/10 to-transparent",
    tag: "PLANNING",
  },
  {
    icon: Bell,
    label: "Alerts",
    title: "Intelligent Notifications",
    description:
      "Get the nudges that matter—from upcoming certification expiries to goal deadlines—delivered straight to your dashboard.",
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

function FeatureCard({ feature }) {
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
    <section
      id="features"
      className="relative py-32 bg-[#0A0A0F] overflow-hidden"
    >
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
            Built for{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00D9FF, #A855F7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              professionals
            </span>
          </h2>
          <p className="font-body text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
            Every feature engineered to accelerate your career trajectory. No
            compromises.
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
