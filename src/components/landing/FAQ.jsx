import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How does SkillStack's AI signal engine work?",
    answer:
      "Our AI engine continuously ingests over 10,000 data signals including market microstructure, sentiment from financial filings, alternative data sources, and cross-asset correlations. Machine learning models trained on 20+ years of market data identify patterns and generate probability-weighted signals in under 100ms. Each signal includes a confidence score, historical win rate, and risk-adjusted expected value.",
  },
  {
    question: "What level of data latency can I expect?",
    answer:
      "Professional and Enterprise plans offer sub-100ms real-time data feeds through our co-located infrastructure in 12 global data centers. Analyst plans receive 1-minute delayed data. For HFT requirements, our Enterprise co-location option delivers sub-millisecond latency with direct market feed access.",
  },
  {
    question: "How is my data secured and kept private?",
    answer:
      "SkillStack is SOC 2 Type II certified and uses AES-256 encryption at rest and TLS 1.3 in transit. We employ a zero-trust architecture with mandatory MFA and role-based access controls. Your portfolio data is never shared with other clients or used to train models without explicit consent. Enterprise clients can opt for complete data isolation.",
  },
  {
    question: "Can I integrate SkillStack with my existing systems?",
    answer:
      "Yes. We offer a RESTful API, WebSocket feeds, and FIX protocol support for order management systems. Pre-built integrations exist for Bloomberg Terminal, FactSet, Refinitiv Eikon, and 50+ prime brokers. Our SDK supports Python, JavaScript, and Java with comprehensive documentation.",
  },
  {
    question: "What's the onboarding process for Enterprise clients?",
    answer:
      "Enterprise onboarding includes a dedicated solutions architect, customized data integration setup, staff training sessions, and a parallel-run period to validate signal quality against your existing systems. Typical onboarding completes within 2-4 weeks. You'll have a named account manager and 24/7 direct support throughout.",
  },
  {
    question: "Does SkillStack support crypto and alternative assets?",
    answer:
      "Absolutely. We cover 150+ traditional exchanges plus all major crypto exchanges with unified normalization. Alternative assets including private credit, commodities, and real estate indices are supported through our data partnerships. Custom asset class integrations are available on Enterprise plans.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "All plans include a 14-day full-feature free trial with no credit card required. You'll get access to live data, AI signals, and the complete analytics suite. Our team will personally onboard you and ensure you experience the platform's full value within the trial period.",
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
