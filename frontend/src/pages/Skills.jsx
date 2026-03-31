import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Award, X } from 'lucide-react';
import { useSkills } from '../hooks/useApiData';
import api from '../api';

const proficiencyColors = {
    Beginner: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    Intermediate: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    Advanced: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    Expert: 'text-green-400 bg-green-400/10 border-green-400/20',
};

const proficiencies = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function Skills() {
    const [skills, setSkills, loading] = useSkills();
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);
    const [formData, setFormData] = useState({ name: '', category: '', proficiency: 'Beginner' });

    const filtered = skills.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()));

    const openModal = (skill = null) => {
        if (skill) {
            setEditingSkill(skill.id);
            setFormData({ name: skill.name, category: skill.category, proficiency: skill.proficiency });
        } else {
            setEditingSkill(null);
            setFormData({ name: '', category: '', proficiency: 'Beginner' });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingSkill) {
                const res = await api.put(`/skills/${editingSkill}`, formData);
                const updated = { ...res.data, lastUsed: res.data.lastUsed || (res.data.createdAt ? new Date(res.data.createdAt).toLocaleDateString() : 'N/A') };
                setSkills(prev => prev.map(s => s.id === editingSkill ? { ...s, ...updated } : s));
            } else {
                const res = await api.post('/skills', formData);
                const created = { ...res.data, lastUsed: res.data.lastUsed || (res.data.createdAt ? new Date(res.data.createdAt).toLocaleDateString() : 'N/A') };
                setSkills(prev => [...prev, created]);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save skill", error);
            alert("Failed to save skill. Check console for details.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this skill?")) {
            try {
                await api.delete(`/skills/${id}`);
                setSkills(prev => prev.filter(s => s.id !== id));
            } catch (error) {
                console.error("Failed to delete skill", error);
                alert("Failed to delete skill. Check console for details.");
            }
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-display font-bold text-white text-3xl mb-1">Skills Management</h1>
                    <p className="font-mono-accent text-xs text-white/40 uppercase tracking-widest">Track & validate your proficiencies</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#A855F7] text-black font-mono-accent text-xs uppercase tracking-widest font-semibold hover:scale-[1.02] transition-transform"
                >
                    <Plus className="w-4 h-4" /> Add Skill
                </button>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-[#12121A] w-full max-w-md">
                <Search className="w-4 h-4 text-white/40" />
                <input
                    type="text"
                    placeholder="Search skills..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="bg-transparent border-none text-white text-sm focus:outline-none w-full placeholder-white/30 font-body"
                />
            </div>

            {loading ? (
                <div className="py-20 text-center text-[#00D9FF] animate-pulse">Loading skills...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {filtered.map(skill => (
                        <motion.div key={skill.id} whileHover={{ y: -4 }} className="p-5 rounded-2xl border border-white/10 bg-[#12121A] hover:border-[#00D9FF]/30 transition-colors group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50">
                                        <Award className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-display font-semibold text-white text-lg leading-none mb-1">{skill.name}</h3>
                                        <span className="font-mono-accent text-[10px] text-white/30 uppercase tracking-widest">{skill.category}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openModal(skill)} className="text-white/40 hover:text-[#00D9FF] transition-colors"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(skill.id)} className="text-white/40 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-widest font-mono-accent border ${proficiencyColors[skill.proficiency] || proficiencyColors.Beginner}`}>
                                    {skill.proficiency}
                                </span>
                                <span className="font-body text-xs text-white/50">Last Used: {skill.lastUsed}</span>
                            </div>
                        </motion.div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="col-span-full py-10 text-center text-white/40 font-mono-accent text-xs uppercase tracking-widest">
                            No skills found. Add a new skill to get started.
                        </div>
                    )}
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
                                    {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSave} className="p-6 space-y-4">
                                <div>
                                    <label className="block font-mono-accent text-xs text-white/40 uppercase tracking-widest mb-1.5">Skill Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#00D9FF]/40"
                                        placeholder="e.g. React"
                                    />
                                </div>
                                <div>
                                    <label className="block font-mono-accent text-xs text-white/40 uppercase tracking-widest mb-1.5">Category</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#00D9FF]/40"
                                        placeholder="e.g. Frontend"
                                    />
                                </div>
                                <div>
                                    <label className="block font-mono-accent text-xs text-white/40 uppercase tracking-widest mb-1.5">Proficiency</label>
                                    <select
                                        value={formData.proficiency}
                                        onChange={e => setFormData({ ...formData, proficiency: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#00D9FF]/40 outline-none appearance-none"
                                    >
                                        {proficiencies.map(p => (
                                            <option key={p} value={p} className="bg-[#0F0F17] text-white">{p}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 mt-4 rounded-xl font-mono-accent text-xs uppercase tracking-widest font-semibold text-black transition-transform hover:scale-[1.02]"
                                    style={{ background: "linear-gradient(135deg, #00D9FF, #A855F7)" }}
                                >
                                    {editingSkill ? 'Save Changes' : 'Add Skill'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
