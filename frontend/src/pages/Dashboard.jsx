import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Target, Zap, Clock, Activity } from 'lucide-react';
import { useSkills, useCertifications, useGoals } from '../hooks/useApiData';
import { useAnalytics } from '../hooks/useAnalytics';
import GrowthGraph from '../components/dashboard/GrowthGraph';

export default function Dashboard() {
    const [skills, , loadingSkills] = useSkills();
    const [certs, , loadingCerts] = useCertifications();
    const [goals, , loadingGoals] = useGoals();
    const { chartData } = useAnalytics();

    if (loadingSkills || loadingCerts || loadingGoals) {
        return (
            <div className="flex items-center justify-center h-full min-h-[50vh]">
                <div className="w-8 h-8 rounded-full border-4 border-[#00D9FF]/30 border-t-[#00D9FF] animate-spin" />
            </div>
        );
    }

    const totalSkills = skills.length;
    const activeCerts = certs.filter(c => c.status === 'good' || c.status === 'warning').length;
    const upcomingExpirations = certs.filter(c => c.status === 'warning').length;
    const completedGoals = goals.filter(g => g.status === 'Completed').length;
    const goalProgress = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

    // Build action items
    const actionItems = [];
    certs.filter(c => c.status === 'warning').forEach(c => {
        actionItems.push({
            title: c.name,
            desc: `Expires on ${c.expiryDate}`,
            urgent: true
        });
    });
    certs.filter(c => c.status === 'expired').forEach(c => {
        actionItems.push({
            title: c.name,
            desc: `Expired on ${c.expiryDate}`,
            urgent: true
        });
    });
    // Add goals near deadline
    goals.filter(g => g.status !== 'Completed').forEach(g => {
        const target = new Date(g.targetDate);
        const diff = (target - new Date()) / (1000 * 60 * 60 * 24);
        if (diff >= 0 && diff <= 14) {
            actionItems.push({
                title: g.title,
                desc: `Deadline approaching (${Math.ceil(diff)} days)`,
                urgent: diff <= 7
            });
        }
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display font-bold text-white text-3xl mb-1">Career Dashboard</h1>
                    <p className="font-mono-accent text-xs text-white/40 uppercase tracking-widest">Your Professional Growth Overview</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00D9FF]/10 border border-[#00D9FF]/20">
                    <Activity className="w-3.5 h-3.5 text-[#00D9FF]" />
                    <span className="font-mono-accent text-xs text-[#00D9FF]">LIVE</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Skills", value: totalSkills, icon: Award, color: "#00D9FF", trend: "Active tracking" },
                    { label: "Active Certs", value: activeCerts, icon: Zap, color: "#A855F7", trend: "Valid credentials" },
                    { label: "Expiring Soon", value: upcomingExpirations, icon: Clock, color: "#FF5F57", trend: upcomingExpirations > 0 ? "Needs attention" : "All good" },
                    { label: "Goal Progress", value: `${goalProgress}%`, icon: Target, color: "#28C840", trend: `${completedGoals} completed` },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-xl border border-white/5 bg-[#12121A] p-5 shadow-lg relative overflow-hidden group hover:border-white/10 transition-colors"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500" />
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <span className="font-mono-accent text-xs text-white/50 uppercase tracking-widest">{stat.label}</span>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}15`, color: stat.color }}>
                                <stat.icon className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="font-display font-bold text-white text-3xl mb-1 relative z-10">{stat.value}</div>
                        <div className="font-body text-xs text-white/40 relative z-10">{stat.trend}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                {/* Chart Area */}
                <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-[#12121A] p-6 h-[400px]">
                    <GrowthGraph data={chartData} />
                </div>

                {/* Action Panel */}
                <div className="rounded-2xl border border-white/5 bg-[#12121A] p-6 flex flex-col">
                    <h2 className="font-display font-semibold text-white text-lg mb-6 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full animate-pulse ${actionItems.length > 0 ? 'bg-[#FF5F57]' : 'bg-[#28C840]'}`} />
                        Action Required
                    </h2>
                    <div className="flex-1 overflow-y-auto space-y-4">
                        {actionItems.length > 0 ? actionItems.map((item, i) => (
                            <div key={i} className={`p-4 rounded-xl border ${item.urgent ? 'border-[#FF5F57]/30 bg-[#FF5F57]/5' : 'border-white/5 bg-white/5'} transition-all hover:bg-white/10`}>
                                <div className="font-display font-medium text-white text-sm mb-1">{item.title}</div>
                                <div className={`font-mono-accent text-xs ${item.urgent ? 'text-[#FF5F57]' : 'text-white/40'}`}>{item.desc}</div>
                            </div>
                        )) : (
                            <div className="p-4 text-center text-white/40 font-mono-accent text-xs uppercase">
                                No urgent actions required.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
