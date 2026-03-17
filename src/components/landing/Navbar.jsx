import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, LayoutDashboard, Sun, Moon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar({ onCTAClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass border-b border-white/5 py-3" : "bg-transparent py-5"
        }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img src="/SkillStack_logo.png" alt="SkillStack Logo" className="w-48 h-20 object-contain" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-body text-sm text-white/60 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-3 mr-4 border-r border-white/10 pr-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D9FF] to-[#A855F7] flex items-center justify-center text-xs font-bold text-black uppercase">
                  {user.name ? user.name.slice(0, 2) : 'US'}
                </div>
                <span className="font-display font-medium text-white text-sm">{user.name}</span>
              </div>
              <Link
                to="/dashboard"
                className="font-mono-accent text-xs uppercase tracking-widest px-4 py-2.5 rounded-lg bg-white/5 text-white font-medium hover:bg-white/10 transition-all duration-200"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="font-mono-accent text-xs uppercase tracking-widest px-4 py-2.5 rounded-lg border border-white/10 text-red-400 font-medium hover:bg-red-400/10 transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={toggleTheme}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:bg-white/5 hover:text-white transition-colors mr-2"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Link
                to="/admin-login"
                className="font-mono-accent text-sm text-red-500/70 hover:text-red-500 transition-colors duration-200 uppercase tracking-wider mr-2"
              >
                Admin
              </Link>
              <Link
                to="/login"
                className="font-mono-accent text-sm text-white/70 hover:text-white transition-colors duration-200 uppercase tracking-wider"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="font-mono-accent text-xs uppercase tracking-widest px-5 py-2.5 rounded-lg bg-[#00D9FF] text-black font-medium hover:bg-[#00D9FF]/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleTheme} className="text-white/50 hover:text-white transition-colors">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            className="text-white/70 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/5 px-6 py-4"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-body text-sm text-white/60 hover:text-white transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="font-mono-accent text-xs uppercase tracking-widest px-5 py-2.5 rounded-lg bg-white/10 text-white font-medium mt-2 text-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="font-mono-accent text-xs uppercase tracking-widest px-5 py-2.5 rounded-lg border border-white/10 text-red-400 font-medium mt-2 text-center"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/admin-login"
                    className="font-mono-accent text-xs uppercase tracking-widest px-5 py-2.5 rounded-lg border border-red-500/20 text-red-500 font-medium mt-2 text-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    Admin Login
                  </Link>
                  <Link
                    to="/login"
                    className="font-mono-accent text-xs uppercase tracking-widest px-5 py-2.5 rounded-lg border border-white/10 text-white font-medium mt-2 text-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="font-mono-accent text-xs uppercase tracking-widest px-5 py-2.5 rounded-lg bg-[#00D9FF] text-black font-medium mt-2 text-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
