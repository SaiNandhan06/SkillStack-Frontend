import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Play, X, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Alexandra Kim",
    role: "Senior Software Engineer, TechCorp",
    avatar: "AK",
    content:
      "SkillStack transformed how I manage my career progression. The certification expiration alerts have saved me twice, and the public profile helped me land my current role.",
    gradient: "from-[#00D9FF] to-[#A855F7]",
  },
  {
    name: "Marcus Chen",
    role: "Engineering Manager, Global Systems",
    avatar: "MC",
    content:
      "We evaluated a dozen tools before choosing SkillStack for our team. The skill gap analysis feature alone saved us months of manual tracking. The team dashboard is intuitive and powerful.",
    gradient: "from-[#A855F7] to-[#00D9FF]",
  },
  {
    name: "Sarah Okonkwo",
    role: "Cloud Architect, InnovateHQ",
    avatar: "SO",
    content:
      "The integrated goal tracking system keeps me focused on what certifications matter most. It's the only platform I need to prove my continuous learning journey to employers.",
    gradient: "from-[#00D9FF] to-[#A855F7]",
  },
];

const logos = [
  "AWS",
  "Google Cloud",
  "CompTIA",
  "Microsoft",
  "Cisco",
  "Oracle",
  "Red Hat",
  "Coursera",
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="testimonials"
      className="relative py-32 bg-[#0A0A0F] overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 gradient-mesh opacity-60" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#A855F7]/20 to-transparent" />
      </div>

      <div ref={ref} className="relative z-10 max-w-[1280px] mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00D9FF]/30 bg-[#00D9FF]/5 mb-6">
            <span className="font-mono-accent text-xs text-[#00D9FF] uppercase tracking-widest">
              Social Proof
            </span>
          </div>
          <h2
            className="font-display font-extrabold text-white leading-tight mb-4"
            style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
          >
            Trusted by the{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00D9FF, #A855F7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              world's best
            </span>
          </h2>
          <p className="font-body text-lg text-white/50 max-w-md mx-auto">
            The firms that define markets use SkillStack to stay ahead.
          </p>
        </motion.div>

        {/* Video + Testimonials layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Video Preview */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative rounded-2xl cursor-pointer group h-fit flex flex-col"
            onClick={() => setVideoOpen(true)}
          >
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#00D9FF]/30 to-[#A855F7]/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative border border-white/10 rounded-2xl overflow-hidden bg-[#0A0A0F] flex-1 flex flex-col">
              <img
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80"
                alt="Platform demo video"
                className="block w-full h-72 object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/40 to-transparent" />
              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 rounded-full glass border border-[#00D9FF]/40 flex items-center justify-center animate-glow-pulse"
                >
                  <Play className="w-6 h-6 text-[#00D9FF] ml-1" />
                </motion.div>
              </div>
              {/* Caption */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="font-display font-bold text-white text-lg mb-1">
                  View Career Management Demo
                </div>
                <div className="font-mono-accent text-xs text-white/50 uppercase tracking-widest">
                  2:15 — Skill Tracking & Portfolio
                </div>
              </div>
            </div>
          </motion.div>

          {/* Testimonial cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col gap-4"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                onClick={() => setActiveIndex(i)}
                className={`relative rounded-xl border p-4 cursor-pointer transition-all duration-300 ${activeIndex === i
                  ? "border-[#00D9FF]/30 bg-[#00D9FF]/5"
                  : "border-white/8 bg-[#12121A] hover:border-white/15"
                  }`}
              >
                {activeIndex === i && (
                  <div className="absolute inset-0 rounded-xl border-glow-cyan opacity-30" />
                )}
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center flex-shrink-0 text-xs font-bold text-black`}
                  >
                    {t.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-semibold text-white text-sm mb-0.5">
                      {t.name}
                    </div>
                    <div className="font-mono-accent text-xs text-white/40 mb-2">
                      {t.role}
                    </div>
                    <p className="font-body text-sm text-white/60 leading-relaxed line-clamp-2">
                      {t.content}
                    </p>
                  </div>
                  <Quote className="w-4 h-4 text-[#00D9FF]/30 flex-shrink-0 mt-1" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Logo strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="border-t border-white/5 pt-12"
        >
          <p className="font-mono-accent text-xs text-white/30 uppercase tracking-widest text-center mb-8">
            Trusted by professionals certified with
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {logos.map((logo) => (
              <span
                key={logo}
                className="font-display font-bold text-white/20 text-lg hover:text-white/40 transition-colors duration-200 cursor-default"
              >
                {logo}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Video Lightbox */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{
              backdropFilter: "blur(20px)",
              background: "rgba(10, 10, 15, 0.85)",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setVideoOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl rounded-2xl overflow-hidden border border-[#00D9FF]/20"
            >
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#00D9FF]/20 to-[#A855F7]/20 blur-xl" />
              <div className="relative bg-[#0D0D16] aspect-video flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80"
                  alt="Demo video"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full glass border border-[#00D9FF]/40 flex items-center justify-center mx-auto mb-4">
                      <Play className="w-8 h-8 text-[#00D9FF] ml-1.5" />
                    </div>
                    <p className="font-mono-accent text-sm text-white/50 uppercase tracking-widest">
                      Platform Walkthrough Video
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setVideoOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
