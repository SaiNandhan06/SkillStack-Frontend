import { Zap } from "lucide-react";

export default function Footer() {
  const links = {
    Product: ["Features", "Pricing", "Changelog", "Roadmap"],
    Company: ["About", "Blog", "Careers", "Press"],
    Resources: ["Documentation", "API Reference", "Security", "Status"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"],
  };

  return (
    <footer className="relative bg-[#0A0A0F] border-t border-white/5 py-16">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D9FF] to-[#A855F7] flex items-center justify-center">
                <Zap className="w-4 h-4 text-black" />
              </div>
              <span className="font-display font-bold text-xl text-white">NexaFlow</span>
            </div>
            <p className="font-body text-sm text-white/40 leading-relaxed max-w-[180px]">
              The command center for sophisticated finance teams.
            </p>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-mono-accent text-xs text-white/30 uppercase tracking-widest mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="font-body text-sm text-white/50 hover:text-white transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono-accent text-xs text-white/30 uppercase tracking-widest">
            © 2025 NexaFlow, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse" />
            <span className="font-mono-accent text-xs text-white/30 uppercase tracking-widest">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
