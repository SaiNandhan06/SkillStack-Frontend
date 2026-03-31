import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Clock, AlertTriangle } from 'lucide-react';
import { useNotifications } from '../hooks/useApiData';
import api from '../api';

export default function Notifications() {
    const [notifications, setNotifications] = useNotifications();

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error('Failed to mark notification as read', error);
        }
    };

    const markAllRead = async () => {
        const unread = notifications.filter(n => !n.read);
        if (unread.length === 0) return;

        try {
            await Promise.all(unread.map(n => api.put(`/notifications/${n.id}/read`)));
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Failed to mark all notifications as read', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'expiry': return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'goal': return <AlertTriangle className="w-5 h-5 text-[#00D9FF]" />;
            default: return <Bell className="w-5 h-5 text-[#A855F7]" />;
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-display font-bold text-white text-3xl mb-1">Notifications</h1>
                    <p className="font-mono-accent text-xs text-white/40 uppercase tracking-widest">Stay updated on your career track</p>
                </div>
                <button
                    onClick={markAllRead}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono-accent text-xs uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                    <Check className="w-4 h-4" /> Mark All Read
                </button>
            </div>

            <div className="space-y-4">
                <AnimatePresence>
                    {notifications.map(notif => (
                        <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${notif.read ? 'bg-[#12121A] border-white/5' : 'bg-[#1a1a24] border-[#A855F7]/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]'}`}
                        >
                            <div className={`p-3 rounded-xl ${notif.read ? 'bg-white/5' : 'bg-white/10'}`}>
                                {getIcon(notif.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                    <h3 className={`font-display font-semibold text-lg truncate ${notif.read ? 'text-white/60' : 'text-white'}`}>{notif.title}</h3>
                                    <span className="font-mono-accent text-[10px] text-white/30 uppercase tracking-widest whitespace-nowrap">
                                        {new Date(notif.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className={`font-body text-sm leading-relaxed ${notif.read ? 'text-white/40' : 'text-white/70'}`}>{notif.message}</p>
                            </div>
                            {!notif.read && (
                                <button
                                    onClick={() => markAsRead(notif.id)}
                                    className="flex-shrink-0 w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-[#A855F7] hover:border-[#A855F7] transition-all duration-200"
                                >
                                    <Check className="w-4 h-4" />
                                </button>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
                {notifications.length === 0 && (
                    <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                        <Bell className="w-10 h-10 text-white/20 mx-auto mb-4" />
                        <p className="font-mono-accent text-sm text-white/40 uppercase tracking-widest">You're all caught up</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
