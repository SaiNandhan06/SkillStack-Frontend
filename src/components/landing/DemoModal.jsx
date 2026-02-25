import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, CheckCircle } from "lucide-react";

export default function DemoModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    aum: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setSubmitted(false), 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
          style={{
            backdropFilter: "blur(20px)",
            background: "rgba(10, 10, 15, 0.8)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md rounded-2xl overflow-hidden"
          >
            {/* Glow border */}
            <div
              className="absolute -inset-px rounded-2xl"
              style={{
                background:
                  "linear-gradient(#12121A, #12121A) padding-box, linear-gradient(135deg, rgba(0, 217, 255, 0.4), rgba(168, 85, 247, 0.4)) border-box",
                border: "1px solid transparent",
              }}
            />

            <div
              className="absolute -inset-2 rounded-2xl opacity-40 blur-xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0, 217, 255, 0.15), rgba(168, 85, 247, 0.15))",
              }}
            />

            {/* Content */}
            <div className="relative bg-[#0F0F17] p-8">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Header */}
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00D9FF]/30 bg-[#00D9FF]/5 mb-4">
                        <span className="font-mono-accent text-xs text-[#00D9FF] uppercase tracking-widest">
                          Free Trial
                        </span>
                      </div>
                      <h2 className="font-display font-bold text-white text-2xl leading-tight mb-2">
                        Start your 14-day trial
                      </h2>
                      <p className="font-body text-sm text-white/50">
                        No credit card required. Full access to all Professional
                        features.
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {[
                        {
                          key: "name",
                          label: "Full Name",
                          placeholder: "Alexandra Kim",
                          type: "text",
                        },
                        {
                          key: "email",
                          label: "Work Email",
                          placeholder: "alex@fund.com",
                          type: "email",
                        },
                        {
                          key: "company",
                          label: "Company",
                          placeholder: "Apex Capital Partners",
                          type: "text",
                        },
                        {
                          key: "aum",
                          label: "AUM (Optional)",
                          placeholder: "$500M+",
                          type: "text",
                        },
                      ].map((field) => (
                        <div key={field.key}>
                          <label className="block font-mono-accent text-xs text-white/40 uppercase tracking-widest mb-1.5">
                            {field.label}
                          </label>
                          <input
                            type={field.type}
                            placeholder={field.placeholder}
                            value={form[field.key]}
                            onChange={(e) =>
                              setForm({ ...form, [field.key]: e.target.value })
                            }
                            required={field.key !== "aum"}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-body text-sm placeholder-white/20 focus:outline-none focus:border-[#00D9FF]/40 focus:bg-[#00D9FF]/5 transition-all duration-200"
                          />
                        </div>
                      ))}

                      <button
                        type="submit"
                        className="group w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-mono-accent text-sm uppercase tracking-widest font-medium text-black transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mt-2"
                        style={{
                          background:
                            "linear-gradient(135deg, #00D9FF, #A855F7)",
                          boxShadow: "0 0 20px rgba(0, 217, 255, 0.3)",
                        }}
                      >
                        Start Free Trial
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                      </button>

                      <p className="text-center font-body text-xs text-white/30">
                        By signing up you agree to our{" "}
                        <a
                          href="#"
                          className="text-[#00D9FF]/70 hover:text-[#00D9FF]"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="text-[#00D9FF]/70 hover:text-[#00D9FF]"
                        >
                          Privacy Policy
                        </a>
                      </p>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-8 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/30 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-[#00D9FF]" />
                    </div>
                    <h3 className="font-display font-bold text-white text-2xl mb-3">
                      You're on the list!
                    </h3>
                    <p className="font-body text-sm text-white/50 max-w-xs mx-auto mb-8">
                      Check your inbox for your access link. Onboarding usually
                      completes within 24 hours.
                    </p>
                    <button
                      onClick={handleClose}
                      className="font-mono-accent text-xs text-white/40 hover:text-white uppercase tracking-widest transition-colors"
                    >
                      Close
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
