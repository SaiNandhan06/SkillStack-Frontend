import { useState } from 'react';
import { NavLink, Outlet, Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Award,
    Settings,
    LogOut,
    Menu,
    History
} from 'lucide-react';

const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
    { icon: Award, label: 'Pending Verifications', path: '/admin/certifications' },
    { icon: History, label: 'History & Edits', path: '/admin/history' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Settings, label: 'System Settings', path: '/admin/settings' },
];

export default function AdminDashboardLayout() {
    const { user, loading, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigate = useNavigate();

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F] text-red-500">Loading...</div>;
    // Check if user is logged in AND is an admin
    if (!user) return <Navigate to="/admin-login" replace />;
    if (!user.isAdmin) return <Navigate to="/dashboard" replace />;

    const handleLogout = () => {
        logout();
        navigate('/admin-login');
    };

    const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    return (
        <div className="min-h-screen bg-[#0A0A0F] font-body flex">
            {/* Mobile nav overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleMenu} />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F0F17] border-r border-red-500/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-4 border-b border-white/5 flex flex-col justify-center items-center">
                        <Link to="/" className="flex items-center justify-center hover:opacity-80 transition-opacity w-full">
                            <span className="font-display font-bold text-xl text-white tracking-widest uppercase flex items-center gap-2">
                                <span className="text-red-500">Admin</span>Panel
                            </span>
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
                                    ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                    : 'text-white/40 hover:bg-white/5 hover:text-red-400'
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
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-900 border border-white/10 flex items-center justify-center text-xs font-bold text-white uppercase">
                                AD
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-display font-semibold text-white text-sm truncate">{user.name}</p>
                                <p className="font-body text-xs text-white/40 truncate text-red-400/80">Administrator</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-xl font-mono-accent text-xs uppercase tracking-widest text-white/50 hover:bg-white/5 hover:text-white transition-colors"
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
                    <span className="font-display font-bold text-lg text-white tracking-widest uppercase flex items-center gap-2">
                        <span className="text-red-500">Admin</span>
                    </span>
                    <div className="flex items-center gap-4">
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
