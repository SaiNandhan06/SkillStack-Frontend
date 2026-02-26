import { useState } from 'react';
import { NavLink, Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import {
    Moon,
    Sun,

    LayoutDashboard,
    Award,
    Target,
    Bell,
    User,
    Settings,
    LogOut,
    Menu,
    X,
    BookOpen
} from 'lucide-react';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: BookOpen, label: 'Skills', path: '/skills' },
    { icon: Award, label: 'Certifications', path: '/certifications' },
    { icon: Target, label: 'Goals', path: '/goals' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: User, label: 'Public Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function DashboardLayout() {
    const { user, loading, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F] text-[#00D9FF]">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;

    const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    return (
        <div className="min-h-screen bg-[#0A0A0F] font-body flex">
            {/* Mobile nav overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleMenu} />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F0F17] border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-white/5">
                        <Link to="/" className="flex items-center -space-x-6 hover:opacity-80 transition-opacity">
                            <img src="/SkillStack_logo.png" alt="SkillStack Logo" className="w-32 h-32 object-contain" />
                            <span className="font-display font-bold text-xl text-white tracking-tight">SkillStack</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-mono-accent text-xs uppercase tracking-widest transition-all duration-200 ${isActive
                                    ? 'bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20'
                                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* User profile & Logout */}
                    <div className="p-4 border-t border-white/5">
                        <div className="flex items-center gap-3 px-4 py-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-xs font-bold text-white uppercase">
                                {user.name ? user.name.slice(0, 2) : 'US'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-display font-semibold text-white text-sm truncate">{user.name}</p>
                                <p className="font-body text-xs text-white/40 truncate">{user.email}</p>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:bg-white/5 hover:text-white transition-colors"
                            >
                                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </button>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-xl font-mono-accent text-xs uppercase tracking-widest text-red-400 hover:bg-red-400/10 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Log Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

                {/* Mobile header */}
                <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#0F0F17]">
                    <Link to="/" className="flex items-center -space-x-4 hover:opacity-80 transition-opacity">
                        <img src="/SkillStack_logo.png" alt="SkillStack Logo" className="w-16 h-16 object-contain" />
                        <span className="font-display font-bold text-lg text-white">SkillStack</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <button onClick={toggleTheme} className="text-white/50 hover:text-white">
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button onClick={toggleMenu} className="text-white/50 hover:text-white">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
