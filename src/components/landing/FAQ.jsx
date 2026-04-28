import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How does SkillStack's AI engine work?",
    answer:
      "Our AI engine analyzes millions of data points from job boards, industry reports, and active professionals to recommend the most valuable skills and certifications for your specific career path.",
  },
  {
    question: "How do I track my active certificates?",
    answer:
      "You easily upload your certificates and set their expiration dates. Our intelligent dashboard tracks these dates and sends color-coded alerts (green, yellow, red) as the expiration approaches.",
  },
  {
    question: "How is my data secured and kept private?",
    answer:
      "SkillStack is SOC 2 Type II certified and uses AES-256 encryption. Your career data and personal goals are protected with robust privacy toggles, allowing you to choose what is public and private.",
  },
  {
    question: "Can I integrate SkillStack with my LinkedIn profile?",
    answer:
      "Yes. You can generate a beautifully designed, shareable public profile link to showcase your validated skills and active certifications directly on LinkedIn or your resume.",
  },
  {
    question: "How does the goal tracking feature work?",
    answer:
      "SkillStack includes a Kanban-style board where you can set learning milestones, track your progress from 'Not Started' to 'Completed', and set target dates to ensure you hit your career targets.",
  },
  {
    question: "Does SkillStack support custom skills and certificates?",
    answer:
      "Absolutely. While we provide a comprehensive database of industry-standard credentials, you can easily add custom skills, internal company courses, or niche certifications to your portfolio.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "All plans include a 14-day full-feature free trial with no credit card required. You'll get access to the complete career tracking dashboard and AI insights.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="faq" className="relative py-32 bg-[#0A0A0F] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#A855F7]/20 to-transparent" />

      <div ref={ref} className="relative z-10 max-w-[1280px] mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00D9FF]/30 bg-[#00D9FF]/5 mb-6">
              <span className="font-mono-accent text-xs text-[#00D9FF] uppercase tracking-widest">
                FAQ
              </span>
            </div>
            <h2
              className="font-display font-extrabold text-white leading-tight mb-4"
              style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
            >
              Everything you need{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #00D9FF, #A855F7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                to know
              </span>
            </h2>
            <p className="font-body text-lg text-white/50">
              Still have questions?{" "}
              <a
                href="#"
                className="text-[#00D9FF] hover:text-[#00D9FF]/80 transition-colors underline underline-offset-4"
              >
                Talk to our team.
              </a>
            </p>
          </motion.div>

          {/* Accordion */}
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className={`rounded-xl border transition-all duration-300 overflow-hidden ${openIndex === i
                  ? "border-[#00D9FF]/30 bg-[#00D9FF]/5"
                  : "border-white/8 bg-[#12121A] hover:border-white/15"
                  }`}
                style={
                  openIndex === i
                    ? { boxShadow: "0 0 20px rgba(0, 217, 255, 0.08)" }
                    : {}
                }
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span
                    className={`font-display font-semibold text-base leading-snug transition-colors duration-200 ${openIndex === i ? "text-white" : "text-white/80"
                      }`}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ml-4 transition-all duration-300 ${openIndex === i
                      ? "bg-[#00D9FF]/15 text-[#00D9FF]"
                      : "bg-white/5 text-white/40"
                      }`}
                  >
                    {openIndex === i ? (
                      <Minus className="w-3.5 h-3.5" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-5 pb-5">
                        <div className="w-full h-px bg-gradient-to-r from-[#00D9FF]/20 to-transparent mb-4" />
                        <p className="font-body text-sm text-white/60 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
