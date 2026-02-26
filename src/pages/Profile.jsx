import { motion } from 'framer-motion';
import { Download, Share2, MapPin, Briefcase, Award, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSkills, useCertifications, useUserSettings } from '../hooks/useLocalStorageData';

export default function Profile() {
    const { user } = useAuth();
    const [settings] = useUserSettings();
    const [skills] = useSkills();
    const [certs] = useCertifications();

    const handlePrint = () => {
        window.print();
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Profile link copied to clipboard!');
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-display font-bold text-white text-3xl mb-1">Public Profile</h1>
                    <p className="font-mono-accent text-xs text-white/40 uppercase tracking-widest">Share your validated career portfolio</p>
                </div>
                <div className="flex items-center gap-3 print:hidden">
                    <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono-accent text-xs uppercase tracking-widest hover:bg-white/10 transition-colors">
                        <Share2 className="w-4 h-4" /> Share Link
                    </button>
                    <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#A855F7] text-black font-mono-accent text-xs uppercase tracking-widest font-semibold hover:scale-[1.02] transition-transform">
                        <Download className="w-4 h-4 border-black" /> Export PDF
                    </button>
                </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#12121A] overflow-hidden shadow-2xl relative print:border-none print:shadow-none print:bg-transparent">
                <div className="h-32 bg-gradient-to-r from-[#00D9FF]/20 to-[#A855F7]/20 border-b border-white/10 print:hidden" />

                <div className="px-8 pb-8 relative">
                    <div className="flex flex-col sm:flex-row gap-6 relative -mt-12 print:mt-0">
                        <div className="w-24 h-24 rounded-2xl border-4 border-[#12121A] bg-gradient-to-br from-[#00D9FF] to-[#A855F7] flex items-center justify-center shadow-lg print:border-none">
                            <span className="font-display font-bold text-4xl text-black">
                                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
                            </span>
                        </div>

                        <div className="pt-14 sm:pt-16 flex-1 print:pt-4">
                            <h2 className="font-display font-bold text-white text-2xl mb-1">{user?.name || 'Demo User'}</h2>
                            <p className="font-body text-white/60 text-lg mb-4 flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> {settings?.role || 'Professional'}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 mt-4">
                                {settings?.location && (
                                    <span className="flex items-center gap-2 font-mono-accent text-xs text-white/40 uppercase tracking-widest">
                                        <MapPin className="w-4 h-4 text-[#00D9FF]" /> {settings.location}
                                    </span>
                                )}
                                <span className="flex items-center gap-2 font-mono-accent text-xs text-white/40 uppercase tracking-widest">
                                    <Mail className="w-4 h-4 text-[#A855F7]" /> {user?.email}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-white/10 w-full my-8 print:bg-black/10" />

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-display font-semibold text-white/80 text-lg mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-[#00D9FF]" /> Top Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {skills.map(skill => (
                                    <span key={skill.id} className="px-3 py-1.5 rounded-lg border border-[#00D9FF]/30 bg-[#00D9FF]/10 text-[#00D9FF] font-mono-accent text-xs uppercase tracking-widest">
                                        {skill.name}
                                    </span>
                                ))}
                                {skills.length === 0 && <span className="text-white/40 font-mono-accent text-[10px] uppercase">No skills added yet.</span>}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-display font-semibold text-white/80 text-lg mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-[#A855F7]" /> Active Certifications</h3>
                            <div className="space-y-3">
                                {certs.filter(c => c.status !== 'expired').map(cert => (
                                    <div key={cert.id} className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
                                        <span className="font-body text-sm text-white/80">{cert.name}</span>
                                        <span className="font-mono-accent text-[10px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded uppercase tracking-widest border border-green-400/20">Verified</span>
                                    </div>
                                ))}
                                {certs.filter(c => c.status !== 'expired').length === 0 && <span className="text-white/40 font-mono-accent text-[10px] uppercase">No active certifications.</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
