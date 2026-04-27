import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, AlertCircle, CheckCircle, Clock, Trash2, Edit2, X, RefreshCw, FileText, ExternalLink } from 'lucide-react';
import { useCertifications } from '../hooks/useApiData';
import api from '../api';

const calculateStatus = (expiryDateStr) => {
    const today = new Date();
    const expiryDate = new Date(expiryDateStr);
    const timeDiff = expiryDate - today;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    let status = 'good';
    if (daysLeft < 0) status = 'expired';
    else if (daysLeft <= 30) status = 'warning';

    return { status, daysLeft };
};

export default function Certifications() {
    const [savedCerts, setCerts, loading] = useCertifications();
    const [certs, setLocalCerts] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCert, setEditingCert] = useState(null);
    const [formData, setFormData] = useState({ name: '', issuer: '', issueDate: '', expiryDate: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Ensure status is recalculated on load
    useEffect(() => {
        if (!loading) {
            const updatedCerts = savedCerts.map(c => {
                const { status, daysLeft } = calculateStatus(c.expiryDate);
                return { ...c, status, daysLeft };
            });
            setLocalCerts(updatedCerts);
        }
    }, [savedCerts, loading]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'warning': return <span className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded-sm text-[10px] uppercase font-mono-accent"><Clock className="w-3 h-3" /> Expiring Soon</span>;
            case 'good': return <span className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2.5 py-1 rounded-sm text-[10px] uppercase font-mono-accent"><CheckCircle className="w-3 h-3" /> Valid</span>;
            case 'expired': return <span className="flex items-center gap-1 text-red-500 bg-red-500/10 px-2.5 py-1 rounded-sm text-[10px] uppercase font-mono-accent"><AlertCircle className="w-3 h-3" /> Expired</span>;
            default: return null;
        }
    };

    const openModal = (cert = null) => {
        if (cert) {
            setEditingCert(cert.id);
            setFormData({ name: cert.name, issuer: cert.issuer, issueDate: cert.issueDate, expiryDate: cert.expiryDate });
        } else {
            setEditingCert(null);
            setFormData({ name: '', issuer: '', issueDate: '', expiryDate: '' });
        }
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const { status } = calculateStatus(formData.expiryDate);

        try {
            let savedCertId;
            if (editingCert) {
                const res = await api.put(`/certifications/${editingCert}`, formData);
                setCerts(prev => prev.map(c => c.id === editingCert ? { ...c, ...res.data, status } : c));
                savedCertId = editingCert;
            } else {
                const res = await api.post('/certifications', formData);
                setCerts(prev => [...prev, { ...res.data, status, verifyStatus: 'pending' }]);
                savedCertId = res.data.id;
            }

            // Upload file if one was selected
            if (selectedFile && savedCertId) {
                setUploading(true);
                try {
                    const fd = new FormData();
                    fd.append('file', selectedFile);
                    const uploadRes = await api.post(`/certifications/${savedCertId}/upload`, fd, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    setCerts(prev => prev.map(c =>
                        c.id === savedCertId ? { ...c, ...uploadRes.data } : c
                    ));
                } catch (uploadErr) {
                    console.error('File upload failed', uploadErr);
                    alert('Certification saved but file upload failed. Try uploading again via Edit.');
                } finally {
                    setUploading(false);
                }
            }

            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save certification", error);
            alert("Failed to save certification. Please check console.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this certification?")) {
            try {
                await api.delete(`/certifications/${id}`);
                setCerts(prev => prev.filter(c => c.id !== id));
            } catch (error) {
                console.error("Failed to delete certification", error);
            }
        }
    };

    const handleReverify = async (id) => {
        if (window.confirm("Do you want to submit this certification for re-verification?")) {
            try {
                // To reverify, we likely just "update" it so backend resets its status
                const cert = certs.find(c => c.id === id);
                if (cert) {
                    const res = await api.put(`/certifications/${id}`, { 
                        name: cert.name, issuer: cert.issuer, issueDate: cert.issueDate, expiryDate: cert.expiryDate 
                    });
                    setCerts(prev => prev.map(c => c.id === id ? { ...c, ...res.data, verifyStatus: 'pending' } : c));
                }
            } catch (error) {
                console.error("Failed to resubmit certification", error);
            }
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-display font-bold text-white text-3xl mb-1">Certifications</h1>
                    <p className="font-mono-accent text-xs text-white/40 uppercase tracking-widest">Manage your professional credentials</p>
                </div>
                <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono-accent text-xs uppercase tracking-widest hover:bg-white/10 transition-colors">
                    <Upload className="w-4 h-4" /> Add Certificate
                </button>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#12121A] overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-body text-sm text-white/60">
                        <thead className="bg-white/5 font-mono-accent text-[10px] uppercase tracking-widest border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 text-white/40">Certificate Name</th>
                                <th className="px-6 py-4 text-white/40">Issuer</th>
                                <th className="px-6 py-4 text-white/40">Issue Date</th>
                                <th className="px-6 py-4 text-white/40">Expiry Date</th>
                                <th className="px-6 py-4 text-white/40">Status</th>
                                <th className="px-6 py-4 text-white/40">Verification</th>
                                <th className="px-6 py-4 text-white/40">Document</th>
                                <th className="px-6 py-4 text-white/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                <td colSpan="8" className="px-6 py-10 text-center text-[#00D9FF] animate-pulse">Loading certifications...</td>
                                </tr>
                            ) : certs.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-10 text-center text-white/40 font-mono-accent text-xs uppercase tracking-widest">No certifications found.</td>
                                </tr>
                            ) : (
                                certs.map((cert, index) => (
                                    <motion.tr
                                        key={cert.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <td className="px-6 py-4 font-display font-medium text-white">{cert.name}</td>
                                        <td className="px-6 py-4">{cert.issuer}</td>
                                        <td className="px-6 py-4">{cert.issueDate}</td>
                                        <td className="px-6 py-4">
                                            <span className={cert.daysLeft < 30 && cert.daysLeft >= 0 ? "text-yellow-400 font-bold" : cert.daysLeft < 0 ? "text-red-400 font-bold" : "text-white/60"}>
                                                {cert.expiryDate}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{getStatusBadge(cert.status)}</td>
                                        <td className="px-6 py-4">
                                            {cert.verifyStatus === 'verified' && <span className="text-green-500 text-xs font-mono-accent uppercase tracking-wider flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verified</span>}
                                            {cert.verifyStatus === 'rejected' && <span className="text-red-500 text-xs font-mono-accent uppercase tracking-wider flex items-center gap-1"><X className="w-3 h-3" /> Rejected</span>}
                                            {(!cert.verifyStatus || cert.verifyStatus === 'pending') && <span className="text-yellow-500 text-xs font-mono-accent uppercase tracking-wider flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>}
                                        </td>
                                        {/* Document column */}
                                        <td className="px-6 py-4">
                                            {cert.fileUrl ? (
                                                <a
                                                    href={`${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1','') || 'http://localhost:8080'}${cert.fileUrl}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-[#00D9FF] text-xs font-mono-accent hover:underline"
                                                    title={cert.fileName}
                                                >
                                                    <FileText className="w-3.5 h-3.5" />
                                                    <span className="max-w-[80px] truncate">{cert.fileName || 'View'}</span>
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            ) : (
                                                <span className="text-white/20 text-xs font-mono-accent">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {(cert.verifyStatus === 'rejected' || cert.verifyStatus === 'verified') && (
                                                    <button onClick={() => handleReverify(cert.id)} className="p-2 inline-flex items-center justify-center rounded-lg hover:bg-yellow-500/10 text-white/40 hover:text-yellow-400 transition-colors" title="Request Re-verification">
                                                        <RefreshCw className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button onClick={() => openModal(cert)} className="p-2 inline-flex items-center justify-center rounded-lg hover:bg-white/10 text-white/40 hover:text-[#00D9FF] transition-colors" title="Edit Certificate">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(cert.id)} className="p-2 inline-flex items-center justify-center rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400 transition-colors" title="Delete Certificate">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

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
                                    {editingCert ? 'Edit Certification' : 'Add Certification'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSave} className="p-6 space-y-4">
                                <div>
                                    <label className="block font-mono-accent text-xs text-white/40 uppercase tracking-widest mb-1.5">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#00D9FF]/40"
                                        placeholder="e.g. AWS Solutions Architect"
                                    />
                                </div>
                                <div>
                                    <label className="block font-mono-accent text-xs text-white/40 uppercase tracking-widest mb-1.5">Issuer</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.issuer}
                                        onChange={e => setFormData({ ...formData, issuer: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#00D9FF]/40"
                                        placeholder="e.g. Amazon"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-mono-accent text-xs text-white/40 uppercase tracking-widest mb-1.5">Issue Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.issueDate}
                                            onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#00D9FF]/40"
                                            style={{ colorScheme: 'dark' }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-mono-accent text-xs text-white/40 uppercase tracking-widest mb-1.5">Expiry Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.expiryDate}
                                            onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#00D9FF]/40"
                                            style={{ colorScheme: 'dark' }}
                                        />
                                    </div>
                                </div>

                                {/* File Upload — real input */}
                                <div>
                                    <label className="block font-mono-accent text-xs text-white/40 uppercase tracking-widest mb-1.5">Upload Document (PDF / Image)</label>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,.png,.jpg,.jpeg,.gif,.webp"
                                        className="hidden"
                                        onChange={e => setSelectedFile(e.target.files[0] || null)}
                                    />
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 border-dashed text-sm flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors gap-2"
                                    >
                                        <Upload className="w-4 h-4 text-white" />
                                        {selectedFile
                                            ? <span className="text-[#00D9FF] truncate max-w-[200px]">{selectedFile.name}</span>
                                            : <span className="text-white font-medium">Click to select file</span>
                                        }
                                    </div>
                                    {selectedFile && (
                                        <button type="button" onClick={() => setSelectedFile(null)} className="mt-1 text-xs text-white/30 hover:text-red-400 transition-colors">
                                            Remove file
                                        </button>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="w-full py-3 mt-4 rounded-xl font-mono-accent text-xs uppercase tracking-widest font-semibold text-white bg-white/10 border border-white/20 transition-all hover:bg-white/20 disabled:opacity-50"
                                >
                                    {uploading
                                        ? 'Uploading file…'
                                        : editingCert ? 'Save Changes' : 'Upload Certification'
                                    }
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
