import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  {
    value: "150k+",
    label: "Active Certifications",
    sublabel: "Managed on platform",
  },
  { value: "85%", label: "Task Completion", sublabel: "Average completion rate" },
  {
    value: "34.7%",
    label: "Career Progression",
    sublabel: "Reported average increase",
  },
  { value: "99.99%", label: "Goal Commitment", sublabel: "Platform consistency" },
];

export default function StatsBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative bg-[#0D0D16] border-y border-white/5 py-16 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D9FF]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#A855F7]/20 to-transparent" />
      </div>

      <div ref={ref} className="relative z-10 max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div
                className="font-display font-extrabold text-4xl md:text-5xl mb-2"
                style={{
                  background:
                    i % 2 === 0
                      ? "linear-gradient(135deg, #00D9FF, #A855F7)"
                      : "linear-gradient(135deg, #A855F7, #00D9FF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {stat.value}
              </div>
              <div className="font-body font-medium text-white/70 text-sm mb-1">
                {stat.label}
              </div>
              <div className="font-mono-accent text-xs text-white/30 uppercase tracking-widest">
                {stat.sublabel}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
