import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ArrowRight, Loader2, Eye, EyeOff, AlertCircle, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast(prev => ({ ...prev, show: false }));
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: Yup.object({
            email: Yup.string().required('Required'),
            password: Yup.string().required('Required'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(values.email)) {
                setToast({ show: true, message: "Please enter a valid email address.", type: 'error' });
                setSubmitting(false);
                return;
            }

            try {
                setToast({ show: false, message: '', type: 'error' });
                await login(values.email, values.password);
                navigate('/dashboard');
            } catch (err) {
                let errorMsg = 'Invalid login credentials';
                if (err.response) {
                    const status = err.response.status;
                    if (status === 401) {
                        errorMsg = "Incorrect password. Please try again.";
                    } else if (status === 404) {
                        errorMsg = "Email not registered. Please sign up first.";
                    } else if (status === 400) {
                        errorMsg = "Invalid input.";
                    } else {
                        errorMsg = err.response.data?.message || err.response.data?.error || errorMsg;
                    }
                }
                setToast({ show: true, message: errorMsg, type: 'error' });
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="min-h-screen bg-[#0A0A0F] font-body flex items-center justify-center p-4">
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-4 px-4 py-3 rounded-lg shadow-xl border bg-red-500/10 border-red-500/20 text-red-500 backdrop-blur-md min-w-[300px]"
                    >
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="font-body text-sm font-medium">{toast.message}</span>
                        </div>
                        <button type="button" onClick={() => setToast(prev => ({ ...prev, show: false }))} className="hover:opacity-70 transition-opacity">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background elements */}
            <div className="absolute inset-0 grid-bg opacity-30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#00D9FF]/5 blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md"
            >
                <div className="absolute -inset-px rounded-2xl" style={{
                    background: "linear-gradient(#12121A, #12121A) padding-box, linear-gradient(135deg, rgba(0, 217, 255, 0.4), rgba(168, 85, 247, 0.4)) border-box",
                    border: "1px solid transparent",
                }} />

                <div className="relative bg-[#0F0F17] rounded-2xl p-8 shadow-2xl">
                    <div className="flex justify-center mb-8">
                        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
                            <img src="/SkillStack_logo.png" alt="SkillStack Logo" className="w-56 h-28 object-contain" />
                        </Link>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="font-display font-bold text-white text-2xl mb-2">Welcome back</h2>
                        <p className="font-body text-sm text-white/50">Log in to track your career progress</p>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-mono-accent text-xs text-white/40 uppercase tracking-widest mb-1.5">Email</label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="off"
                                {...formik.getFieldProps('email')}
                                className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${formik.touched.email && formik.errors.email ? 'border-red-500/50' : 'border-white/10'} text-white text-sm focus:outline-none focus:border-[#00D9FF]/40`}
                                placeholder="Enter your email"
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                            ) : null}
                        </div>

                        <div>
                            <label className="block font-mono-accent text-xs text-white/40 uppercase tracking-widest mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    {...formik.getFieldProps('password')}
                                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${formik.touched.password && formik.errors.password ? 'border-red-500/50' : 'border-white/10'} text-white text-sm focus:outline-none focus:border-[#00D9FF]/40 pr-12`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:opacity-80 transition-opacity"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {formik.touched.password && formik.errors.password ? (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
                            ) : null}
                        </div>

                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="group w-full flex items-center justify-center gap-2 py-3.5 mt-6 rounded-xl font-mono-accent text-sm uppercase tracking-widest font-medium text-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                            style={{ background: "linear-gradient(135deg, #00D9FF, #A855F7)" }}
                        >
                            {formik.isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <p className="mt-6 text-center text-white/40 text-sm">
                        Don't have an account? <Link to="/register" className="text-[#00D9FF] hover:underline">Sign up</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
