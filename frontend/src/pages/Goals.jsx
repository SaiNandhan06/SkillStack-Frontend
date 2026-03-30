import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, GripVertical, CheckCircle2, Circle, Plus, X, Trash2 } from 'lucide-react';
import { useGoals } from '../hooks/useApiData';

const statuses = ['Not Started', 'In Progress', 'Completed'];

export default function Goals() {
    const [goals, setGoals, loading] = useGoals();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', status: 'Not Started', targetDate: '' });
    const [draggingId, setDraggingId] = useState(null);

    const openModal = () => {
        setFormData({ title: '', status: 'Not Started', targetDate: '' });
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        setGoals(prev => [...prev, { id: Date.now().toString(), ...formData }]);
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this goal?')) {
            setGoals(prev => prev.filter(g => g.id !== id));
        }
    }

    const onDragStart = (e, id) => {
        setDraggingId(id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const onDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const onDrop = (e, newStatus) => {
        e.preventDefault();
        if (draggingId) {
            setGoals(prev => prev.map(g => g.id === draggingId ? { ...g, status: newStatus } : g));
            setDraggingId(null);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-display font-bold text-white text-3xl mb-1">Career Goals</h1>
                    <p className="font-mono-accent text-xs text-white/40 uppercase tracking-widest">Plan and execute your next milestones</p>
                </div>
                <button
                    onClick={openModal}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#A855F7] text-black font-mono-accent text-xs uppercase tracking-widest font-semibold hover:scale-[1.02] transition-transform"
                >
                    <Plus className="w-4 h-4" /> New Goal
                </button>
            </div>

            {loading ? (
                <div className="py-20 text-center text-[#00D9FF] animate-pulse">Loading goals...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {statuses.map(status => (
                        <div
                            key={status}
                            className="bg-[#12121A] rounded-2xl border border-white/10 p-5 min-h-[500px] flex flex-col"
                            onDragOver={onDragOver}
                            onDrop={(e) => onDrop(e, status)}
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <Target className="w-4 h-4 text-white/40" />
                                <h3 className="font-display font-semibold text-white/80">{status}</h3>
                                <span className="ml-auto bg-white/5 px-2 py-0.5 rounded-full text-[10px] font-mono-accent text-white/40">
                                    {goals.filter(g => g.status === status).length}
                                </span>
                            </div>

                            <div className="space-y-3 flex-1">
                                {goals.filter(g => g.status === status).map(goal => (
                                    <motion.div
                                        key={goal.id}
                                        draggable
                                        onDragStart={(e) => onDragStart(e, goal.id)}
                                        whileHover={{ scale: 1.02 }}
                                        className="p-4 rounded-xl border border-white/5 bg-white/5 hover:border-[#00D9FF]/30 cursor-grab group transition-colors relative"
                                    >
                                        <div className="flex gap-3">
                                            <div className="pt-0.5 text-white/20 group-hover:text-white/50 cursor-grab">
                                                <GripVertical className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 pr-6">
                                                <p className={`font-display font-medium mb-2 ${status === 'Completed' ? 'text-white/40 line-through' : 'text-white'}`}>
                                                    {goal.title}
                                                </p>
                                                <div className="flex items-center justify-between text-[10px] font-mono-accent uppercase tracking-widest">
                                                    <span className={status === 'Completed' ? 'text-white/20' : 'text-[#00D9FF]'}>Target: {goal.targetDate}</span>
                                                    {status === 'Completed' ? (
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                    ) : (
                                                        <Circle className="w-3.5 h-3.5 text-white/20" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(goal.id)}
                                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ))}

                                {goals.filter(g => g.status === status).length === 0 && (
                                    <div className="p-8 text-center text-white/20 text-xs font-mono-accent uppercase tracking-widest border border-dashed border-white/10 rounded-xl h-full flex items-center justify-center">
                                        Drop here
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="w-full max-w-md bg-[#0F0F17] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-white/5">
                                <h2 className="font-display font-bold text-white text-xl">
                                    New Goal
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSave} className="p-6 space-y-4">
                                <div>
                                    <label className="block font-mono-accent text-xs text-white/40 uppercase tracking-widest mb-1.5">Goal Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#00D9FF]/40"
                                        placeholder="e.g. Build React Clone app"
                                    />
                                </div>
                                <div>
                                    <label className="block font-mono-accent text-xs text-white/40 uppercase tracking-widest mb-1.5">Target Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.targetDate}
                                        onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#00D9FF]/40"
                                        style={{ colorScheme: 'dark' }}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 mt-4 rounded-xl font-mono-accent text-xs uppercase tracking-widest font-semibold text-black transition-transform hover:scale-[1.02]"
                                    style={{ background: "linear-gradient(135deg, #00D9FF, #A855F7)" }}
                                >
                                    Create Goal
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
