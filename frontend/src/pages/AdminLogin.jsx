import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().required('Required'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                setError('');
                const user = await login(values.email, values.password);
                if (user.isAdmin) {
                    navigate('/admin/dashboard');
                } else {
                    setError('Unauthorized access. Admin credentials required.');
                }
            } catch (err) {
                setError(err.message || 'Invalid admin credentials');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="min-h-screen bg-[#0A0A0F] font-body flex items-center justify-center p-4 overflow-hidden relative">
            {/* Soft Ambient Glows (Lowered intensity for better contrast) */}
            <div className="absolute inset-0 grid-bg opacity-10" />
            <div className="absolute top-[0%] left-[0%] w-[400px] h-[400px] rounded-full bg-[#00D9FF]/5 blur-[100px] animate-pulse-slow pointer-events-none" />
            <div className="absolute bottom-[0%] right-[0%] w-[400px] h-[400px] rounded-full bg-[#A855F7]/5 blur-[100px] animate-pulse-slow pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative w-full max-w-md z-10"
            >
                <div className="relative bg-[#0F0F17]/95 backdrop-blur-2xl rounded-[32px] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] gradient-border overflow-hidden">
                    {/* Interior Decorative Mesh */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#A855F7]/10 to-transparent rounded-full -translate-y-16 translate-x-16 pointer-events-none" />
                    
                    {/* Logo Section */}
                    <div className="flex flex-col items-center mb-10">
                        <Link to="/" className="mb-6 hover:opacity-90 transition-all transform hover:scale-105">
                            <img src="/SkillStack_logo.png" alt="SkillStack Logo" className="w-52 h-24 object-contain" />
                        </Link>
                        
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/20 mb-4">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#00D9FF]" />
                            <span className="font-mono-accent text-[10px] uppercase tracking-[0.2em] text-[#00D9FF] font-semibold">Admin Gateway</span>
                        </div>
                        
                        <h2 className="font-display font-bold text-white text-3xl tracking-tight mb-2">Secure Portal</h2>
                        <p className="font-body text-sm text-white/40 text-center">Identity verification for administrative access and platform governance.</p>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center font-medium"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={formik.handleSubmit} className="space-y-5">
                        <div className="group">
                            <label className="block font-mono-accent text-[10px] text-white/30 uppercase tracking-[0.2em] mb-2 px-1">Control Email</label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    {...formik.getFieldProps('email')}
                                    className={`w-full px-5 py-4 rounded-2xl bg-white/[0.03] border ${formik.touched.email && formik.errors.email ? 'border-red-500/50' : 'border-white/10'} text-white text-sm focus:outline-none focus:border-[#00D9FF]/50 transition-all group-hover:bg-white/[0.05]`}
                                    placeholder="admin@skillstack.priv"
                                />
                            </div>
                            {formik.touched.email && formik.errors.email ? (
                                <div className="text-red-500 text-[10px] mt-2 font-mono-accent px-1 uppercase tracking-wider">{formik.errors.email}</div>
                            ) : null}
                        </div>

                        <div className="group">
                            <label className="block font-mono-accent text-[10px] text-white/30 uppercase tracking-[0.2em] mb-2 px-1">Access Key</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    {...formik.getFieldProps('password')}
                                    className={`w-full px-5 py-4 rounded-2xl bg-white/[0.03] border ${formik.touched.password && formik.errors.password ? 'border-red-500/50' : 'border-white/10'} text-white text-sm focus:outline-none focus:border-[#00D9FF]/50 transition-all group-hover:bg-white/[0.05]`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {formik.touched.password && formik.errors.password ? (
                                <div className="text-red-500 text-[10px] mt-2 font-mono-accent px-1 uppercase tracking-wider">{formik.errors.password}</div>
                            ) : null}
                        </div>

                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="relative group w-full py-4 mt-6 rounded-2xl overflow-hidden active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#00D9FF] to-[#A855F7] group-hover:scale-110 transition-transform duration-500" />
                            <div className="relative flex items-center justify-center gap-2 font-mono-accent text-xs uppercase tracking-[0.2em] font-bold text-black">
                                {formik.isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authorize Session'}
                                {!formik.isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </div>
                        </button>
                    </form>

                    <div className="mt-8 flex flex-col items-center gap-4">
                        <Link 
                            to="/login" 
                            className="text-white/30 hover:text-white text-xs font-mono-accent uppercase tracking-widest transition-colors flex items-center gap-2"
                        >
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            Switch to Personal Dashboard
                        </Link>
                    </div>
                </div>

                {/* Footer Decal */}
                <p className="mt-8 text-center text-white/10 text-[10px] font-mono-accent uppercase tracking-[0.3em] font-medium">
                    SkillStack Infrastructure © 2026 • Encrypted v.4.0
                </p>
            </motion.div>
        </div>
    );
}
