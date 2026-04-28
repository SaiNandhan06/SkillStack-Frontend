import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Award, ShieldAlert, Activity, ArrowRight, UserCheck, SearchCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        pendingVerifications: 0,
        totalCertifications: 0,
        activeAdmins: 0
    });
    const [activities, setActivities] = useState([]);

    // Helper to format time ago
    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersRes, certsRes] = await Promise.all([
                    api.get('/admin/users'),
                    api.get('/admin/certifications')
                ]);

                const users = usersRes.data || [];
                const certs = certsRes.data || [];

                setStats({
                    totalUsers: users.length,
                    activeAdmins: users.filter(u => u.role === 'ADMIN' || u.isAdmin).length,
                    totalCertifications: certs.length,
                    pendingVerifications: certs.filter(c => c.verifyStatus === 'pending').length
                });

                const recentActivities = [
                    ...users.filter(u => u.createdAt).map(u => ({
                        id: `user-${u.id}`,
                        type: 'user_registration',
                        message: <>New user registration: <strong>{u.email}</strong></>,
                        createdAt: new Date(u.createdAt),
                        color: 'bg-green-500'
                    })),
                    ...certs.filter(c => c.createdAt).map(c => ({
                        id: `cert-${c.id}`,
                        type: 'cert_upload',
                        message: <>Certification <strong>{c.name}</strong> uploaded by <strong>{c.userName}</strong></>,
                        createdAt: new Date(c.createdAt),
                        color: 'bg-yellow-500'
                    }))
                ].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

                setActivities(recentActivities);
            } catch (error) {
                console.error('Failed to load admin stats', error);
            }
        };

        fetchStats();
    }, []);

    const cards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
            link: '/admin/users'
        },
        {
            title: 'Pending Verifications',
            value: stats.pendingVerifications,
            icon: ShieldAlert,
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/20',
            link: '/admin/certifications'
        },
        {
            title: 'Tracked Certifications',
            value: stats.totalCertifications,
            icon: Award,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20',
            link: '/admin/certifications'
        },
        {
            title: 'Active Admins',
            value: stats.activeAdmins,
            icon: UserCheck,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            border: 'border-green-500/20',
            link: '/admin/users'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <header className="mb-12">
                <h1 className="font-display font-bold text-white text-3xl mb-4 sm:text-4xl uppercase tracking-wider relative inline-block">
                    System Overview
                    <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-red-500 to-transparent" />
                </h1>
                <p className="font-body text-white/60 text-lg max-w-2xl">
                    High-level metrics and system performance at a glance.
                </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link to={card.link} className="block w-full h-full relative bg-[#0F0F17] rounded-2xl p-6 border border-white/5 overflow-hidden group hover:bg-[#1A1A24] transition-colors">
                            <div className={`absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-${card.color.split('-')[1]}-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                            
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${card.bg} ${card.border} border`}>
                                    <card.icon className={`w-6 h-6 ${card.color}`} />
                                </div>
                                <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                            </div>
                            
                            <div>
                                <p className="font-display font-bold text-white text-4xl mb-2">{card.value}</p>
                                <p className="font-mono-accent text-xs text-white/50 uppercase tracking-widest">{card.title}</p>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions / Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
                <div className="lg:col-span-2 bg-[#0F0F17] rounded-2xl p-6 border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-display font-bold text-white text-xl">Recent System Activity</h3>
                            <p className="font-mono-accent text-xs text-white/40 uppercase tracking-widest mt-1">Real-time log stream</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {activities.length > 0 ? activities.map(act => (
                            <div key={act.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <div className={`w-2 h-2 rounded-full ${act.color} shrink-0 shadow-[0_0_8px_currentColor]`} />
                                <div className="flex-1">
                                    <p className="font-display text-white text-sm">{act.message}</p>
                                    <p className="font-mono-accent text-[10px] text-white/40 uppercase mt-1">{timeAgo(act.createdAt)}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="flex items-center justify-center p-8 rounded-xl bg-white/5 border border-white/10">
                                <p className="font-body text-white/40 text-sm">No recent activity found.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-[#0F0F17] rounded-2xl p-6 border border-white/5 shadow-2xl relative overflow-hidden group flex flex-col">
                    <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                            <SearchCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-display font-bold text-white text-xl">Quick Actions</h3>
                            <p className="font-mono-accent text-xs text-white/40 uppercase tracking-widest mt-1">Frequently used tasks</p>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-3">
                        <Link to="/admin/certifications" className="w-full text-left px-5 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors font-mono-accent text-xs uppercase tracking-widest text-white/70 hover:text-white flex items-center justify-between">
                            Verify Certifications
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link to="/admin/users" className="w-full text-left px-5 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors font-mono-accent text-xs uppercase tracking-widest text-white/70 hover:text-white flex items-center justify-between">
                            Manage Admin Roles
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link to="/admin/settings" className="w-full text-left px-5 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors font-mono-accent text-xs uppercase tracking-widest text-white/70 hover:text-white flex items-center justify-between">
                            Toggle Maintenance
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
