import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const formik = useFormik({
        initialValues: { name: '', email: '', password: '', confirmPassword: '' },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .required('Required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Required'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                setError('');
                await register(values.name, values.email, values.password);
                navigate('/dashboard');
            } catch (err) {
                setError(err.message || 'Failed to register account');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="min-h-screen bg-[#0A0A0F] font-body flex items-center justify-center p-4">
            <div className="absolute inset-0 grid-bg opacity-30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#A855F7]/5 blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md my-8"
            >
                <div className="absolute -inset-px rounded-2xl" style={{
                    background: "linear-gradient(#12121A, #12121A) padding-box, linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(0, 217, 255, 0.4)) border-box",
                    border: "1px solid transparent",
                }} />

                <div className="relative bg-[#0F0F17] rounded-2xl p-8 shadow-2xl">
                    <div className="flex justify-center mb-8">
                        <Link to="/" className="flex items-center -space-x-6">
                            <img src="/SkillStack_logo.png" alt="SkillStack Logo" className="w-32 h-32 object-contain" />
                            <span className="font-display font-bold text-xl text-white tracking-tight">SkillStack</span>
                        </Link>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="font-display font-bold text-white text-2xl mb-2">Create an account</h2>
                        <p className="font-body text-sm text-white/50">Start mapping your career trajectory</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-mono-accent text-xs text-white/40 uppercase tracking-widest mb-1.5">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                {...formik.getFieldProps('name')}
                                className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${formik.touched.name && formik.errors.name ? 'border-red-500/50' : 'border-white/10'} text-white text-sm focus:outline-none focus:border-[#A855F7]/40`}
                                placeholder="Jane Doe"
                            />
                            {formik.touched.name && formik.errors.name && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
                            )}
                        </div>

                        <div>
                            <label className="block font-mono-accent text-xs text-white/40 uppercase tracking-widest mb-1.5">Email</label>
                            <input
                                id="email"
                                type="email"
                                {...formik.getFieldProps('email')}
                                className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${formik.touched.email && formik.errors.email ? 'border-red-500/50' : 'border-white/10'} text-white text-sm focus:outline-none focus:border-[#A855F7]/40`}
                                placeholder="you@company.com"
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                            )}
                        </div>

                        <div>
                            <label className="block font-mono-accent text-xs text-white/40 uppercase tracking-widest mb-1.5">Password</label>
                            <input
                                id="password"
                                type="password"
                                {...formik.getFieldProps('password')}
                                className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${formik.touched.password && formik.errors.password ? 'border-red-500/50' : 'border-white/10'} text-white text-sm focus:outline-none focus:border-[#A855F7]/40`}
                                placeholder="••••••••"
                            />
                            {formik.touched.password && formik.errors.password && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
                            )}
                        </div>

                        <div>
                            <label className="block font-mono-accent text-xs text-white/40 uppercase tracking-widest mb-1.5">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                {...formik.getFieldProps('confirmPassword')}
                                className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'} text-white text-sm focus:outline-none focus:border-[#A855F7]/40`}
                                placeholder="••••••••"
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="group w-full flex items-center justify-center gap-2 py-3.5 mt-6 rounded-xl font-mono-accent text-sm uppercase tracking-widest font-medium text-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                            style={{ background: "linear-gradient(135deg, #A855F7, #00D9FF)" }}
                        >
                            {formik.isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register'}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <p className="mt-6 text-center text-white/40 text-sm">
                        Already have an account? <Link to="/login" className="text-[#A855F7] hover:underline">Log in</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
