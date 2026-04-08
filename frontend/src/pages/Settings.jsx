import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Save, User, MapPin, Briefcase, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUserSettings } from '../hooks/useApiData';

export default function Settings() {
    const { user, updateUser } = useAuth();
    const [settings, updateSettings, loadingSettings] = useUserSettings();

    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        role: '',
        location: '',
        publicProfile: true
    });
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const resetForm = useCallback(() => {
        setFormData({
            name: user?.name || '',
            bio: settings.bio || '',
            role: settings.role || '',
            location: settings.location || '',
            publicProfile: settings.publicProfile !== false
        });
    }, [user?.name, settings.bio, settings.role, settings.location, settings.publicProfile]);

    useEffect(() => {
        if (user && !loadingSettings && !isEditing) {
            resetForm();
        }
    }, [user, settings, loadingSettings, isEditing, resetForm]);

    const handleSave = async () => {
        if (!isEditing) return;
        setSaving(true);
        try {
            if (formData.name !== user.name) {
                await updateUser({ name: formData.name });
            }

            await updateSettings({
                bio: formData.bio,
                role: formData.role,
                location: formData.location,
                publicProfile: formData.publicProfile
            });
            setIsEditing(false);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        resetForm();
        setIsEditing(false);
    };

    if (loadingSettings) {
        return <div className="py-20 text-center text-[#A855F7] animate-pulse">Loading settings...</div>;
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-display font-bold text-white text-3xl mb-1">Account Settings</h1>
                    <p className="font-mono-accent text-xs text-white/40 uppercase tracking-widest">Manage your profile and preferences</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleEdit}
                        disabled={isEditing}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/70 font-mono-accent text-xs uppercase tracking-widest hover:bg-white/10 transition-colors disabled:opacity-50 disabled:hover:bg-white/5"
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={!isEditing || saving}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/50 font-mono-accent text-xs uppercase tracking-widest hover:bg-white/10 transition-colors disabled:opacity-50 disabled:hover:bg-white/5"
                    >
                        Cancel
                    </button>
                </div>
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving || !isEditing}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#A855F7] text-black font-mono-accent text-xs uppercase tracking-widest font-semibold hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
                >
                    {saving ? <Loader2 className="w-4 h-4 text-black animate-spin" /> : <Save className="w-4 h-4 text-black" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4 font-mono-accent text-xs uppercase tracking-widest">
                    {['Profile & Details', 'Security & Password', 'Notifications', 'Privacy'].map((tab, i) => (
                        <button type="button" key={tab} className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${i === 0 ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="p-6 rounded-2xl border border-white/10 bg-[#12121A]">
                        <h2 className="font-display font-semibold text-white text-xl mb-6 flex items-center gap-2"><User className="w-5 h-5 text-[#A855F7]" /> Basic Information</h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-mono-accent text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-body text-sm focus:outline-none focus:border-[#00D9FF]/40"
                                    />
                                </div>
                                <div>
                                    <label className="block font-mono-accent text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Email Address</label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 font-body text-sm cursor-not-allowed"
                                        disabled
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-mono-accent text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Bio</label>
                                <textarea
                                    rows={4}
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        disabled={!isEditing}
                                    placeholder="I am a software engineer passionate about scalable systems..."
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-body text-sm focus:outline-none focus:border-[#A855F7]/40 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-mono-accent text-[10px] text-white/40 uppercase tracking-widest mb-1.5"><Briefcase className="w-3 h-3 inline mb-0.5" /> Current Role</label>
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="Senior Developer"
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-body text-sm focus:outline-none focus:border-[#00D9FF]/40"
                                    />
                                </div>
                                <div>
                                    <label className="block font-mono-accent text-[10px] text-white/40 uppercase tracking-widest mb-1.5"><MapPin className="w-3 h-3 inline mb-0.5" /> Location</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="San Francisco, CA"
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-body text-sm focus:outline-none focus:border-[#00D9FF]/40"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-white/10 bg-[#12121A]">
                        <h2 className="font-display font-semibold text-white text-xl mb-6">Visibility</h2>
                        <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
                            <div>
                                <p className="font-display font-medium text-white mb-1">Public Profile</p>
                                <p className="font-body text-xs text-white/40">Allow recruiters to view your verified skills</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={formData.publicProfile}
                                    disabled={!isEditing}
                                    onChange={(e) => setFormData({ ...formData, publicProfile: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A855F7]" />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
