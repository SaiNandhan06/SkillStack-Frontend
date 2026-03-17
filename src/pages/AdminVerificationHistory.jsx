import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Award,
    CheckCircle2,
    Clock,
    XCircle,
    Search,
    Filter,
    ArrowRight,
    AlertTriangle,
    Mail,
    X,
    History
} from 'lucide-react';

export default function AdminVerificationHistory() {
    const [certifications, setCertifications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all_history'); // all_history, verified, rejected
    const [selectedCert, setSelectedCert] = useState(null); // to handle edit modal

    useEffect(() => {
        // Collect all certifications from all existing users in localStorage
        const users = JSON.parse(localStorage.getItem('skillstack_users') || '[]');
        let allCerts = [];

        users.forEach(user => {
            const userCerts = JSON.parse(localStorage.getItem(`skillstack_certifications_${user.id}`)) || [];
            const formattedLocalCerts = userCerts.map((c) => {
                const today = new Date();
                const expDate = c.expiryDate ? new Date(c.expiryDate) : null;
                const status = expDate && expDate < today ? 'expired' : 'active';
                
                return {
                    ...c,
                    userId: user.id, // Ensure we store tracking ID for updating
                    userName: user.name,
                    status: status,
                    verifyStatus: c.verifyStatus || 'pending'
                };
            });
            // ONLY keep verified or rejected
            const historyCerts = formattedLocalCerts.filter(c => c.verifyStatus === 'verified' || c.verifyStatus === 'rejected');
            allCerts = [...allCerts, ...historyCerts];
        });

        setCertifications(allCerts);
    }, []);

    const updateCertStatus = (id, newStatus) => {
        // Find the cert to know which user it belongs to
        const certToUpdate = certifications.find(c => c.id === id);
        if (!certToUpdate) return;

        setCertifications(certifications.map(cert => 
            cert.id === id ? { ...cert, verifyStatus: newStatus } : cert
        ));

        // Update local storage so user sees the change
        const storageKey = `skillstack_certifications_${certToUpdate.userId}`;
        const localCerts = JSON.parse(localStorage.getItem(storageKey)) || [];
        const certIndex = localCerts.findIndex(c => String(c.id) === String(id));
        if (certIndex !== -1) {
            localCerts[certIndex].verifyStatus = newStatus;
            localStorage.setItem(storageKey, JSON.stringify(localCerts));
        }
    };

    const handleVerify = (id) => updateCertStatus(id, 'verified');
    const handleReject = (id) => updateCertStatus(id, 'rejected');

    const filteredCerts = certifications.filter(cert => {
        // filter out pending just in case they marked it pending again
        if (cert.verifyStatus === 'pending') return false;

        const matchesSearch = cert.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              cert.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              cert.issuer.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filterStatus === 'all_history' 
            ? true 
            : cert.verifyStatus === filterStatus;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <header className="mb-12">
                <h1 className="font-display font-bold text-white text-3xl mb-4 sm:text-4xl uppercase tracking-wider relative inline-block">
                    Verification History
                    <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-red-500 to-transparent" />
                </h1>
                <p className="font-body text-white/60 text-lg max-w-2xl">
                    Full audit log of accepted and rejected certifications. Fix accidental verifications dynamically.
                </p>
            </header>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search past verifications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all font-body"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-white/40" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-[#1A1A24] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500/50 appearance-none min-w-[150px]"
                    >
                        <option value="all_history">All History</option>
                        <option value="verified">Verified Only</option>
                        <option value="rejected">Rejected Only</option>
                    </select>
                </div>
            </div>

            {/* Certification List */}
            <div className="bg-[#0F0F17] border border-white/5 rounded-2xl overflow-hidden shadow-2xl mt-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="p-4 font-mono-accent text-xs text-white/40 uppercase tracking-widest">User</th>
                                <th className="p-4 font-mono-accent text-xs text-white/40 uppercase tracking-widest">Certification Details</th>
                                <th className="p-4 font-mono-accent text-xs text-white/40 uppercase tracking-widest">Decision</th>
                                <th className="p-4 font-mono-accent text-xs text-white/40 uppercase tracking-widest text-right">Edit Decision</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredCerts.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-white/40 font-body">
                                            No verification history found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCerts.map((cert) => (
                                        <motion.tr
                                            key={cert.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                                        >
                                            <td className="p-4 align-top">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border border-white/10 flex items-center justify-center text-xs font-bold text-white uppercase">
                                                        {cert.userName ? cert.userName.split(' ').map(n => n[0]).join('').slice(0, 2) : 'US'}
                                                    </div>
                                                    <div>
                                                        <p className="font-display font-medium text-white text-sm">{cert.userName}</p>
                                                        <p className="font-mono-accent text-[10px] text-white/40 uppercase tracking-wider">{cert.userId}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 align-top">
                                                <div>
                                                    <p className="font-display font-medium text-white">{cert.name}</p>
                                                    <p className="font-body text-xs text-white/60">{cert.issuer}</p>
                                                </div>
                                            </td>
                                            <td className="p-4 align-top">
                                                <div className="flex flex-col gap-2">
                                                    {cert.verifyStatus === 'verified' && (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-medium w-fit">
                                                            <CheckCircle2 className="w-3 h-3" /> Verified
                                                        </span>
                                                    )}
                                                    {cert.verifyStatus === 'rejected' && (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium w-fit">
                                                            <XCircle className="w-3 h-3" /> Rejected
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 align-top text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => setSelectedCert(cert)} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-xs font-mono-accent uppercase tracking-widest font-medium flex items-center gap-1.5" title="Modify Decision">
                                                        <History className="w-3 h-3" /> Fix Mistake
                                                    </button>
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

            {/* Edit Verification Modal */}
            <AnimatePresence>
                {selectedCert && (
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
                                    Edit Verification History
                                </h2>
                                <button onClick={() => setSelectedCert(null)} className="text-white/40 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <p className="font-mono-accent text-xs text-white/40 uppercase tracking-widest mb-1">Certification Details</p>
                                    <p className="font-display font-medium text-white text-lg">{selectedCert.name}</p>
                                    <p className="font-body text-sm text-white/60">Issued by: {selectedCert.issuer}</p>
                                    <p className="font-body text-sm text-white/60 mt-1">User: {selectedCert.userName}</p>
                                </div>
                                
                                <div>
                                    <p className="font-mono-accent text-xs text-white/40 uppercase tracking-widest mb-2">Did you make a mistake?</p>
                                    <div className="flex flex-col gap-2">
                                        <button 
                                            onClick={() => { handleVerify(selectedCert.id); setSelectedCert(null); }}
                                            className={`w-full py-3 rounded-xl border font-mono-accent text-xs uppercase tracking-widest font-medium transition-colors ${selectedCert.verifyStatus === 'verified' ? 'bg-green-500/20 text-green-500 border-green-500/50' : 'bg-white/5 text-white/60 border-white/10 hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/30'}`}
                                        >
                                            Force Mark as Verified
                                        </button>
                                        <button 
                                            onClick={() => { handleReject(selectedCert.id); setSelectedCert(null); }}
                                            className={`w-full py-3 rounded-xl border font-mono-accent text-xs uppercase tracking-widest font-medium transition-colors ${selectedCert.verifyStatus === 'rejected' ? 'bg-red-500/20 text-red-500 border-red-500/50' : 'bg-white/5 text-white/60 border-white/10 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30'}`}
                                        >
                                            Force Mark as Rejected
                                        </button>
                                        <button 
                                            onClick={() => { updateCertStatus(selectedCert.id, 'pending'); setSelectedCert(null); }}
                                            className={`w-full py-3 rounded-xl border font-mono-accent text-xs uppercase tracking-widest font-medium transition-colors ${selectedCert.verifyStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' : 'bg-white/5 text-white/60 border-white/10 hover:bg-yellow-500/10 hover:text-yellow-500 hover:border-yellow-500/30'}`}
                                        >
                                            Reset to Pending
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
