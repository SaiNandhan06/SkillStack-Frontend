import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, User, MapPin, Briefcase, Loader2, Shield, Bell, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUserSettings } from '../hooks/useApiData';
import api from '../api';

export default function Settings() {
    const { user, updateUser } = useAuth();
    const [settings, updateSettings, loadingSettings] = useUserSettings();

    const [activeTab, setActiveTab] = useState('Profile & Details');

    // Profile Settings State
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        role: '',
        location: '',
        publicProfile: true
    });
    
    // Password Settings State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

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

    const handleSaveProfile = async () => {
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

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("New passwords don't match");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            setPasswordError("New password must be at least 6 characters");
            return;
        }
        
        setSaving(true);
        try {
            await api.put('/users/me/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setPasswordSuccess("Password successfully updated!");
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setPasswordError(err.response?.data?.error || "Failed to update password");
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
                
                {/* Only show top-right save buttons for tabs that support generic 'edit' mode */}
                {(activeTab === 'Profile & Details' || activeTab === 'Privacy' || activeTab === 'Notifications') && (
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
                        <button
                            type="button"
                            onClick={handleSaveProfile}
                            disabled={saving || !isEditing}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#A855F7] text-black font-mono-accent text-xs uppercase tracking-widest font-semibold hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {saving ? <Loader2 className="w-4 h-4 text-black animate-spin" /> : <Save className="w-4 h-4 text-black" />}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-1 space-y-4 font-mono-accent text-xs uppercase tracking-widest">
                    {['Profile & Details', 'Security & Password', 'Notifications', 'Privacy'].map((tab) => (
                        <button 
                            type="button" 
                            key={tab} 
                            onClick={() => {
                                setActiveTab(tab);
                                setPasswordError('');
                                setPasswordSuccess('');
                            }}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeTab === tab ? 'bg-white/10 text-white border border-white/10 shadow-lg' : 'text-white/40 hover:text-white/80 border border-transparent'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    <AnimatePresence mode="wait">
                        
                        {/* ── PROFILE TAB ── */}
                        {activeTab === 'Profile & Details' && (
                            <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-6 rounded-2xl border border-white/10 bg-[#12121A]">
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
                                                placeholder="Bangalore, India"
                                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-body text-sm focus:outline-none focus:border-[#00D9FF]/40"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ── SECURITY TAB ── */}
                        {activeTab === 'Security & Password' && (
                            <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-6 rounded-2xl border border-white/10 bg-[#12121A]">
                                <h2 className="font-display font-semibold text-white text-xl mb-6 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-[#00D9FF]" /> Change Password
                                </h2>
                                
                                {passwordError && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">{passwordError}</div>}
                                {passwordSuccess && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl text-sm">{passwordSuccess}</div>}
                                
                                <form onSubmit={handlePasswordChange} className="space-y-4">
                                    <div>
                                        <label className="block font-mono-accent text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Current Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-body text-sm focus:outline-none focus:border-[#00D9FF]/40"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-mono-accent text-[10px] text-white/40 uppercase tracking-widest mb-1.5">New Password</label>
                                            <input
                                                type="password"
                                                required
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-body text-sm focus:outline-none focus:border-[#00D9FF]/40"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-mono-accent text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Confirm New Password</label>
                                            <input
                                                type="password"
                                                required
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-body text-sm focus:outline-none focus:border-[#00D9FF]/40"
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={saving || !passwordData.currentPassword || !passwordData.newPassword}
                                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono-accent text-xs uppercase tracking-widest hover:bg-white/10 transition-colors disabled:opacity-50"
                                        >
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                                            {saving ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* ── NOTIFICATIONS TAB ── */}
                        {activeTab === 'Notifications' && (
                            <motion.div key="notifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-6 rounded-2xl border border-white/10 bg-[#12121A]">
                                <h2 className="font-display font-semibold text-white text-xl mb-6 flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-yellow-500" /> Notification Preferences
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
                                        <div>
                                            <p className="font-display font-medium text-white mb-1">Email Notifications</p>
                                            <p className="font-body text-xs text-white/40">Receive critical updates via email</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked disabled={!isEditing} />
                                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D9FF]" />
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
                                        <div>
                                            <p className="font-display font-medium text-white mb-1">In-App Alerts</p>
                                            <p className="font-body text-xs text-white/40">Show dashboard popups for new events</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked disabled={!isEditing} />
                                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A855F7]" />
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
                                        <div>
                                            <p className="font-display font-medium text-white mb-1">Certification Updates</p>
                                            <p className="font-body text-xs text-white/40">Notify when certifications are verified or rejected</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked disabled={!isEditing} />
                                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500" />
                                        </label>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ── PRIVACY TAB ── */}
                        {activeTab === 'Privacy' && (
                            <motion.div key="privacy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-6 rounded-2xl border border-white/10 bg-[#12121A]">
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
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
