

import { Link } from 'react-router-dom';

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
            <Link to="/" className="flex items-center -space-x-6 mb-4 hover:opacity-80 transition-opacity">
              <img src="/SkillStack_logo.png" alt="SkillStack Logo" className="w-32 h-32 object-contain" />
              <span className="font-display font-bold text-xl text-white">
                SkillStack
              </span>
            </Link>
            <p className="font-body text-sm text-white/40 leading-relaxed max-w-[180px]">
              The command center for ambitious professionals.
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
          <p className="font-mono-accent text-xs text-white/30 uppercase tracking-widest text-center md:text-left">
            © 2026 SkillStack, Inc. All rights reserved. <br className="md:hidden" />
            Developed by <a href="https://www.linkedin.com/in/sainandhan" target="_blank" rel="noopener noreferrer" className="text-[#00D9FF] hover:underline">M. SaiNandhan</a>
          </p>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
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
