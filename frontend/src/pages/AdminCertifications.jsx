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
    X
} from 'lucide-react';
import api from '../api';

export default function AdminCertifications() {
    const [certifications, setCertifications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('pending'); // default to pending instead of all
    const [selectedCert, setSelectedCert] = useState(null); // to handle edit modal
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCertifications = async () => {
            try {
                setLoading(true);
                const response = await api.get('/admin/certifications');
                setCertifications(response.data || []);
            } catch (error) {
                console.error('Failed to load certifications', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCertifications();
    }, []);

    const updateCertStatus = async (id, newStatus) => {
        try {
            const response = await api.put(`/admin/certifications/${id}/verify`, { status: newStatus });
            const updated = response.data;
            setCertifications(prev => prev.map(cert => cert.id === id ? updated : cert));
        } catch (error) {
            console.error('Failed to update certification status', error);
        }
    };

    const handleVerify = (id) => updateCertStatus(id, 'verified');
    const handleReject = (id) => updateCertStatus(id, 'rejected');

    const handleSendRenewal = async (id) => {
        try {
            await api.post(`/admin/certifications/${id}/remind`);
            const cert = certifications.find(c => String(c.id) === String(id));
            if (cert) {
                alert(`Renewal reminder successfully sent to ${cert.userName}.`);
            }
        } catch (error) {
            console.error('Failed to send renewal reminder', error);
        }
    };

    const filteredCerts = certifications.filter(cert => {
        const matchesSearch = cert.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              cert.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              cert.issuer.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filterStatus === 'all' 
            ? true 
            : filterStatus === 'pending' 
                ? cert.verifyStatus === 'pending' 
                : cert.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const pendingCount = certifications.filter(c => c.verifyStatus === 'pending').length;
    const expiredCount = certifications.filter(c => c.status === 'expired').length;
    const activeCount = certifications.filter(c => c.status === 'active' && c.verifyStatus === 'verified').length;

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <header className="mb-12">
                <h1 className="font-display font-bold text-white text-3xl mb-4 sm:text-4xl uppercase tracking-wider relative inline-block">
                    Certification Admin
                    <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-red-500 to-transparent" />
                </h1>
                <p className="font-body text-white/60 text-lg max-w-2xl">
                    Manage certification verification, track organizational expirations, and facilitate renewals.
                </p>
            </header>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-[#0F0F17] rounded-2xl p-6 border border-white/5 overflow-hidden group"
                >
                    <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="font-mono-accent text-xs text-white/50 uppercase tracking-widest mb-2">Pending Verification</p>
                            <p className="font-display font-bold text-white text-4xl">{pendingCount}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative bg-[#0F0F17] rounded-2xl p-6 border border-white/5 overflow-hidden group"
                >
                    <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="font-mono-accent text-xs text-white/50 uppercase tracking-widest mb-2">Expired / Renewals</p>
                            <p className="font-display font-bold text-white text-4xl">{expiredCount}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative bg-[#0F0F17] rounded-2xl p-6 border border-white/5 overflow-hidden group"
                >
                    <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="font-mono-accent text-xs text-white/50 uppercase tracking-widest mb-2">Active & Verified</p>
                            <p className="font-display font-bold text-white text-4xl">{activeCount}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search certifications or users..."
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
                        <option value="all">All Records</option>
                        <option value="pending">Pending Verification</option>
                        <option value="expired">Expired (Needs Renewal)</option>
                        <option value="active">Active</option>
                    </select>
                </div>
            </div>

            {/* Certification List */}
            <div className="bg-[#0F0F17] border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="p-4 font-mono-accent text-xs text-white/40 uppercase tracking-widest">User</th>
                                <th className="p-4 font-mono-accent text-xs text-white/40 uppercase tracking-widest">Certification Details</th>
                                <th className="p-4 font-mono-accent text-xs text-white/40 uppercase tracking-widest">Status</th>
                                <th className="p-4 font-mono-accent text-xs text-white/40 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-white/40 font-body">
                                            Loading certifications...
                                        </td>
                                    </tr>
                                ) : filteredCerts.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-white/40 font-body">
                                            No certifications found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCerts.map((cert) => (
                                        <motion.tr
                                            key={cert.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="p-4 align-top">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border border-white/10 flex items-center justify-center text-xs font-bold text-white uppercase">
                                                        {cert.userName.split(' ').map(n => n[0]).join('')}
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
                                                    <div className="flex gap-4 mt-2">
                                                        <span className="font-mono-accent text-[10px] text-white/40 uppercase">Issued: {cert.issueDate || 'N/A'}</span>
                                                        <span className="font-mono-accent text-[10px] text-white/40 uppercase">Exp: {cert.expiryDate || 'N/A'}</span>
                                                    </div>
                                                    {cert.fileUrl && (
                                                        <div className="mt-2">
                                                            <a 
                                                                href={`http://localhost:8080${cert.fileUrl}`} 
                                                                target="_blank" 
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#00D9FF]/10 text-[#00D9FF] rounded-lg hover:bg-[#00D9FF]/20 transition-colors text-xs font-medium"
                                                            >
                                                                View Document ({cert.fileName || 'File'})
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 align-top">
                                                <div className="flex flex-col gap-2">
                                                    {cert.verifyStatus === 'pending' && (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-medium w-fit">
                                                            <Clock className="w-3 h-3" /> Pending Verify
                                                        </span>
                                                    )}
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

                                                    {cert.status === 'expired' && (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium w-fit mt-1">
                                                            <AlertTriangle className="w-3 h-3" /> Expired
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 align-top">
                                                <div className="flex flex-wrap gap-2">
                                                    {cert.verifyStatus === 'pending' && (
                                                        <>
                                                            <button 
                                                                onClick={() => handleVerify(cert.id)}
                                                                className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20 transition-colors text-xs font-medium"
                                                            >
                                                                Verify
                                                            </button>
                                                            <button 
                                                                onClick={() => handleReject(cert.id)}
                                                                className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors text-xs font-medium"
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    {cert.status === 'expired' && (
                                                        <button 
                                                            onClick={() => handleSendRenewal(cert.id)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-colors text-xs font-medium"
                                                        >
                                                            <Mail className="w-3 h-3" /> Raminder
                                                        </button>
                                                    )}
                                                    <button onClick={() => setSelectedCert(cert)} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors" title="Edit Verification">
                                                        <ArrowRight className="w-4 h-4" />
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
                                    Edit Verification Status
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
                                    <p className="font-mono-accent text-xs text-white/40 uppercase tracking-widest mb-2">Update Status</p>
                                    <div className="flex flex-col gap-2">
                                        <button 
                                            onClick={() => { handleVerify(selectedCert.id); setSelectedCert(null); }}
                                            className={`w-full py-3 rounded-xl border font-mono-accent text-xs uppercase tracking-widest font-medium transition-colors ${selectedCert.verifyStatus === 'verified' ? 'bg-green-500/20 text-green-500 border-green-500/50' : 'bg-white/5 text-white/60 border-white/10 hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/30'}`}
                                        >
                                            Mark as Verified
                                        </button>
                                        <button 
                                            onClick={() => { handleReject(selectedCert.id); setSelectedCert(null); }}
                                            className={`w-full py-3 rounded-xl border font-mono-accent text-xs uppercase tracking-widest font-medium transition-colors ${selectedCert.verifyStatus === 'rejected' ? 'bg-red-500/20 text-red-500 border-red-500/50' : 'bg-white/5 text-white/60 border-white/10 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30'}`}
                                        >
                                            Mark as Rejected
                                        </button>
                                        <button 
                                            onClick={() => { updateCertStatus(selectedCert.id, 'pending'); setSelectedCert(null); }}
                                            className={`w-full py-3 rounded-xl border font-mono-accent text-xs uppercase tracking-widest font-medium transition-colors ${selectedCert.verifyStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' : 'bg-white/5 text-white/60 border-white/10 hover:bg-yellow-500/10 hover:text-yellow-500 hover:border-yellow-500/30'}`}
                                        >
                                            Mark as Pending
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
