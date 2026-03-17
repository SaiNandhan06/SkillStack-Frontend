import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserX, Shield, ShieldAlert, Trash2, Search } from 'lucide-react';

export default function AdminUsers() {
    const [users, setUsers] = useState(() => {
        return JSON.parse(localStorage.getItem('skillstack_users') || '[]');
    });
    const [searchTerm, setSearchTerm] = useState('');

    const toggleAdmin = (userId) => {
        const updatedUsers = users.map(user => 
            user.id === userId ? { ...user, isAdmin: !user.isAdmin } : user
        );
        setUsers(updatedUsers);
        localStorage.setItem('skillstack_users', JSON.stringify(updatedUsers));
    };

    const deleteUser = (userId) => {
        if (window.confirm("Are you sure you want to permanently delete this user?")) {
            const updatedUsers = users.filter(user => user.id !== userId);
            setUsers(updatedUsers);
            localStorage.setItem('skillstack_users', JSON.stringify(updatedUsers));
        }
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <header className="mb-12">
                <h1 className="font-display font-bold text-white text-3xl mb-4 sm:text-4xl uppercase tracking-wider relative inline-block">
                    User Management
                    <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-red-500 to-transparent" />
                </h1>
                <p className="font-body text-white/60 text-lg max-w-2xl">
                    Manage system access, roles, and platform users.
                </p>
            </header>

            <div className="flex items-center gap-4 mt-8">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all font-body"
                    />
                </div>
                <div className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 flex items-center gap-2">
                    <Users className="w-5 h-5 text-white/40" />
                    <span className="font-display font-medium text-white">{filteredUsers.length} Users</span>
                </div>
            </div>

            <div className="bg-[#0F0F17] border border-white/5 rounded-2xl overflow-hidden shadow-2xl mt-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="p-4 font-mono-accent text-xs text-white/40 uppercase tracking-widest">User Details</th>
                                <th className="p-4 font-mono-accent text-xs text-white/40 uppercase tracking-widest">Role</th>
                                <th className="p-4 font-mono-accent text-xs text-white/40 uppercase tracking-widest">User ID</th>
                                <th className="p-4 font-mono-accent text-xs text-white/40 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-white/40 font-body">
                                            No users found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((u) => (
                                        <motion.tr
                                            key={u.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white uppercase border ${u.isAdmin ? 'bg-gradient-to-br from-red-600 to-red-900 border-red-500/50' : 'bg-gradient-to-br from-gray-700 to-gray-800 border-white/10'}`}>
                                                        {u.name ? u.name.split(' ').map(n=>n[0]).join('').slice(0, 2) : 'US'}
                                                    </div>
                                                    <div>
                                                        <p className="font-display font-medium text-white text-sm">{u.name}</p>
                                                        <p className="font-body text-xs text-white/50">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {u.isAdmin ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono-accent uppercase tracking-widest font-medium w-fit">
                                                        <ShieldAlert className="w-3 h-3" /> Admin
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-mono-accent uppercase tracking-widest font-medium w-fit">
                                                        <Users className="w-3 h-3" /> User
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 font-mono-accent text-[10px] text-white/30 uppercase tracking-wider">
                                                {u.id}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {u.email !== 'admin@skillstack.com' && (
                                                        <>
                                                            <button 
                                                                onClick={() => toggleAdmin(u.id)}
                                                                className={`px-3 py-1.5 rounded-lg border transition-colors text-xs font-medium flex items-center gap-1.5 ${u.isAdmin ? 'bg-white/5 hover:bg-white/10 text-white/60 border-white/10' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20'}`}
                                                            >
                                                                <Shield className="w-3 h-3" /> {u.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                                                            </button>
                                                            <button 
                                                                onClick={() => deleteUser(u.id)}
                                                                className="px-3 py-1.5 rounded-lg bg-red-900/10 text-red-500 hover:bg-red-900/30 border border-red-900/20 transition-colors text-xs font-medium flex items-center gap-1.5"
                                                            >
                                                                <Trash2 className="w-3 h-3" /> Delete
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
