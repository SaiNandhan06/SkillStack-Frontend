import { useState } from 'react';
import { Save, Server, Bell } from 'lucide-react';

export default function AdminSettings() {
    const [settings, setSettings] = useState(() => {
        return JSON.parse(localStorage.getItem('skillstack_settings') || '{"maintenanceMode": false, "allowRegistrations": true, "emailNotifications": true}');
    });
    const [saved, setSaved] = useState(false);

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
        setSaved(false);
    };

    const handleSave = () => {
        localStorage.setItem('skillstack_settings', JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header className="mb-12">
                <h1 className="font-display font-bold text-white text-3xl mb-4 sm:text-4xl uppercase tracking-wider relative inline-block">
                    System Settings
                    <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-red-500 to-transparent" />
                </h1>
                <p className="font-body text-white/60 text-lg max-w-2xl">
                    Configure global platform variables and functional toggles.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0F0F17] rounded-2xl p-6 border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
                            <Server className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-display font-bold text-white text-xl">Platform Status</h3>
                            <p className="font-mono-accent text-xs text-white/40 uppercase tracking-widest mt-1">Core connectivity controls</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-display font-medium text-white text-sm">Maintenance Mode</p>
                                <p className="font-body text-xs text-white/50 max-w-[200px]">Disables site access for non-admins to allow system upgrades.</p>
                            </div>
                            <button 
                                onClick={() => handleToggle('maintenanceMode')}
                                className={`w-12 h-6 rounded-full transition-colors relative ${settings.maintenanceMode ? 'bg-red-500' : 'bg-white/10'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${settings.maintenanceMode ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-display font-medium text-white text-sm">Allow Registrations</p>
                                <p className="font-body text-xs text-white/50 max-w-[200px]">If disabled, new users cannot create accounts.</p>
                            </div>
                            <button 
                                onClick={() => handleToggle('allowRegistrations')}
                                className={`w-12 h-6 rounded-full transition-colors relative ${settings.allowRegistrations ? 'bg-green-500' : 'bg-white/10'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${settings.allowRegistrations ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0F0F17] rounded-2xl p-6 border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <Bell className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-display font-bold text-white text-xl">Global Communications</h3>
                            <p className="font-mono-accent text-xs text-white/40 uppercase tracking-widest mt-1">Mailing configurations</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-display font-medium text-white text-sm">System Emails</p>
                                <p className="font-body text-xs text-white/50 max-w-[200px]">Enable automated renewal reminders and welcome emails.</p>
                            </div>
                            <button 
                                onClick={() => handleToggle('emailNotifications')}
                                className={`w-12 h-6 rounded-full transition-colors relative ${settings.emailNotifications ? 'bg-blue-500' : 'bg-white/10'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${settings.emailNotifications ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-white/5">
                <div className="flex items-center gap-4">
                    {saved && (
                        <span className="font-mono-accent text-xs text-green-500 uppercase tracking-widest">
                            Settings Saved Successfully
                        </span>
                    )}
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 text-red-500 font-mono-accent text-sm uppercase tracking-widest font-medium transition-colors"
                    >
                        <Save className="w-4 h-4" /> Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
}
