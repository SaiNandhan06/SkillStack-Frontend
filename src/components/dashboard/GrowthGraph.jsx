import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, LineChart as LineIcon, Activity } from 'lucide-react';

const chartTypes = [
    { id: 'area', icon: Activity, label: 'Trend' },
    { id: 'bar', icon: BarChart2, label: 'Monthly Details' },
    { id: 'line', icon: LineIcon, label: 'Growth Progress' }
];

export default function GrowthGraph({ data }) {
    const [chartType, setChartType] = useState('area');

    // Custom Tooltip component
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#12121A] border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md">
                    <p className="font-display font-semibold text-white text-sm mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="font-mono-accent text-xs text-white/60 capitalize">
                                {entry.name}:
                            </span>
                            <span className="font-body font-bold text-white text-sm ml-auto">
                                {entry.value}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    const renderChart = () => {
        switch (chartType) {
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorSkillsBar" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#00D9FF" stopOpacity={0.2} />
                                </linearGradient>
                                <linearGradient id="colorCertsBar" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0.2} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#ffffff30" tick={{ fill: '#ffffff60', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                            <YAxis stroke="#ffffff30" tick={{ fill: '#ffffff60', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                            <Bar dataKey="skillsAdded" name="Skills" fill="url(#colorSkillsBar)" radius={[4, 4, 0, 0]} barSize={20} />
                            <Bar dataKey="certsEarned" name="Certifications" fill="url(#colorCertsBar)" radius={[4, 4, 0, 0]} barSize={20} />
                            <Bar dataKey="goalsCompleted" name="Goals Completed" fill="#28C840" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'line':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <XAxis dataKey="name" stroke="#ffffff30" tick={{ fill: '#ffffff60', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                            <YAxis stroke="#ffffff30" tick={{ fill: '#ffffff60', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 1, strokeDasharray: '4 4' }} />
                            <Line type="monotone" dataKey="totalProgress" name="Total Progress" stroke="#00D9FF" strokeWidth={3} dot={{ r: 4, fill: '#0F0F17', stroke: '#00D9FF', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#00D9FF' }} />
                        </LineChart>
                    </ResponsiveContainer>
                );
            case 'area':
            default:
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorTotalArea" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#ffffff30" tick={{ fill: '#ffffff60', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                            <YAxis stroke="#ffffff30" tick={{ fill: '#ffffff60', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 1, strokeDasharray: '4 4' }} />
                            <Area type="monotone" dataKey="totalProgress" name="Overall Growth" stroke="#A855F7" strokeWidth={3} fillOpacity={1} fill="url(#colorTotalArea)" />
                        </AreaChart>
                    </ResponsiveContainer>
                );
        }
    };

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <h2 className="font-display font-semibold text-white text-lg">Growth Analytics</h2>

                {/* Chart Toggle Control */}
                <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
                    {chartTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setChartType(type.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono-accent text-[10px] uppercase tracking-widest transition-all duration-300 ${chartType === type.id
                                    ? 'bg-gradient-to-r from-[#00D9FF] to-[#A855F7] text-black font-bold shadow-[0_0_15px_rgba(0,217,255,0.3)]'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <type.icon className="w-3 h-3" />
                            <span className="hidden sm:inline">{type.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Recharts Container wrapped in AnimatePresence for smooth transitions */}
            <div className="flex-1 w-full relative min-h-[250px] pb-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={chartType}
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.02, y: -10 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0"
                    >
                        {renderChart()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
