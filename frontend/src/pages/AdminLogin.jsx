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
        <div className="min-h-screen bg-[#0A0A0F] font-body flex items-center justify-center p-4">
            {/* Background elements */}
            <div className="absolute inset-0 grid-bg opacity-30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-500/5 blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md"
            >
                <div className="absolute -inset-px rounded-2xl" style={{
                    background: "linear-gradient(#12121A, #12121A) padding-box, linear-gradient(135deg, rgba(239, 68, 68, 0.4), rgba(220, 38, 38, 0.4)) border-box",
                    border: "1px solid transparent",
                }} />

                <div className="relative bg-[#0F0F17] rounded-2xl p-8 shadow-2xl">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center border border-red-500/20">
                            <ShieldCheck className="w-8 h-8 text-red-500" />
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="font-display font-bold text-white text-2xl mb-2">Admin Portal</h2>
                        <p className="font-body text-sm text-white/50">Log in to manage certifications and users</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-mono-accent text-xs text-white/40 uppercase tracking-widest mb-1.5">Admin Email</label>
                            <input
                                id="email"
                                type="email"
                                {...formik.getFieldProps('email')}
                                className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${formik.touched.email && formik.errors.email ? 'border-red-500/50' : 'border-white/10'} text-white text-sm focus:outline-none focus:border-red-500/40`}
                                placeholder="admin@skillstack.com"
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                            ) : null}
                        </div>

                        <div>
                            <label className="block font-mono-accent text-xs text-white/40 uppercase tracking-widest mb-1.5">Password</label>
                            <input
                                id="password"
                                type="password"
                                {...formik.getFieldProps('password')}
                                className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${formik.touched.password && formik.errors.password ? 'border-red-500/50' : 'border-white/10'} text-white text-sm focus:outline-none focus:border-red-500/40`}
                                placeholder="••••••••"
                            />
                            {formik.touched.password && formik.errors.password ? (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
                            ) : null}
                        </div>

                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="group w-full flex items-center justify-center gap-2 py-3.5 mt-6 rounded-xl font-mono-accent text-sm uppercase tracking-widest font-medium text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                            style={{ background: "linear-gradient(135deg, #EF4444, #991B1B)" }}
                        >
                            {formik.isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In As Admin'}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <p className="mt-6 text-center text-white/40 text-sm">
                        Not an admin? <Link to="/login" className="text-red-400 hover:underline">User Login</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
