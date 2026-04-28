import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ArrowRight, Loader2, ShieldCheck, AlertCircle, X, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

/**
 * Registration flow:
 *   Step 1 — User fills name / email / password → backend checks email availability
 *             and sends a 6-digit OTP to the email.
 *   Step 2 — User enters OTP → backend verifies and creates the account → JWT issued.
 */
export default function Register() {
    const { loginWithData } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [registrationData, setRegistrationData] = useState({ name: '', email: '', password: '' });
    const [otp, setOtp] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);
    const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

    // ── Toast auto-dismiss ────────────────────────────────────────────────────────
    useEffect(() => {
        if (toast.show) {
            const t = setTimeout(() => setToast(p => ({ ...p, show: false })), 5000);
            return () => clearTimeout(t);
        }
    }, [toast.show]);

    // ── Resend countdown ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (resendCountdown <= 0) return;
        const t = setTimeout(() => setResendCountdown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [resendCountdown]);

    const showToast = (message, type = 'error') =>
        setToast({ show: true, message, type });

    // ── Step 1 form ──────────────────────────────────────────────────────────────
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
                const { data } = await api.post('/auth/send-register-otp', { email: values.email });
                setRegistrationData({ name: values.name, email: values.email, password: values.password });
                setStep(2);
                setResendCountdown(60);
                if (data.smtpConfigured === false) {
                    showToast('⚠ SMTP not configured — check backend console for OTP', 'warning');
                } else {
                    showToast(`Verification code sent to ${values.email}`, 'success');
                }
            } catch (err) {
                let msg = 'Failed to send verification email.';
                if (err.response) {
                    const s = err.response.status;
                    if (s === 409) msg = 'Email already registered. Please log in instead.';
                    else msg = err.response.data?.error || err.response.data?.message || msg;
                }
                showToast(msg);
            } finally {
                setSubmitting(false);
            }
        },
    });

    // ── Step 2 — OTP verification ────────────────────────────────────────────────
    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        if (!otp || otp.trim().length !== 6) {
            showToast('Please enter the 6-digit verification code.');
            return;
        }
        setOtpLoading(true);
        try {
            const res = await api.post('/auth/verify-register', {
                name: registrationData.name,
                email: registrationData.email,
                password: registrationData.password,
                otp: otp.trim(),
            });
            loginWithData(res.data);
            navigate('/dashboard');
        } catch (err) {
            let msg = 'Invalid or expired verification code.';
            if (err.response?.status === 409) msg = 'Email already registered. Please log in.';
            if (err.response?.status === 400) msg = 'Please enter a valid 6-digit code.';
            showToast(msg);
        } finally {
            setOtpLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendCountdown > 0) return;
        try {
            const { data } = await api.post('/auth/send-register-otp', { email: registrationData.email });
            setResendCountdown(60);
            if (data.smtpConfigured === false) {
                showToast('⚠ New OTP printed to backend console', 'warning');
            } else {
                showToast(`New code sent to ${registrationData.email}`, 'success');
            }
        } catch {
            showToast('Failed to resend code. Please try again.');
        }
    };

    // ── Shared toast ─────────────────────────────────────────────────────────────
    const ToastBanner = () => (
        <AnimatePresence>
            {toast.show && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-4 px-4 py-3 rounded-lg shadow-xl border backdrop-blur-md min-w-[300px] max-w-sm ${
                        toast.type === 'success'
                            ? 'bg-green-500/10 border-green-500/20 text-green-400'
                            : toast.type === 'warning'
                            ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/10 border-red-500/20 text-red-500'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        {toast.type === 'success'
                            ? <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                            : <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        }
                        <span className="font-body text-sm font-medium">{toast.message}</span>
                    </div>
                    <button type="button" onClick={() => setToast(p => ({ ...p, show: false }))} className="hover:opacity-70 transition-opacity">
                        <X className="w-4 h-4" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // ── Render ───────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#0A0A0F] font-body flex items-center justify-center p-4">
            <ToastBanner />

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
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
                            <img src="/SkillStack_logo.png" alt="SkillStack Logo" className="w-56 h-28 object-contain" />
                        </Link>
                    </div>

                    <AnimatePresence mode="wait">
                        {/* ── Step 1: Registration details ── */}
                        {step === 1 && (
                            <motion.div
                                key="register-form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.25 }}
                            >
                                <div className="text-center mb-8">
                                    <h2 className="font-display font-bold text-white text-2xl mb-2">Create an account</h2>
                                    <p className="font-body text-sm text-white/50">Start mapping your career trajectory</p>
                                </div>

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
                                        id="register-send-otp-btn"
                                        className="group w-full flex items-center justify-center gap-2 py-3.5 mt-6 rounded-xl font-mono-accent text-sm uppercase tracking-widest font-medium text-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                                        style={{ background: "linear-gradient(135deg, #A855F7, #00D9FF)" }}
                                    >
                                        {formik.isSubmitting
                                            ? <Loader2 className="w-5 h-5 animate-spin" />
                                            : <><Mail className="w-4 h-4" /> Send Verification Code</>
                                        }
                                        {!formik.isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                    </button>
                                </form>

                                <p className="mt-6 text-center text-white/40 text-sm">
                                    Already have an account? <Link to="/login" className="text-[#A855F7] hover:underline">Log in</Link>
                                </p>
                            </motion.div>
                        )}

                        {/* ── Step 2: OTP Verification ── */}
                        {step === 2 && (
                            <motion.div
                                key="otp-verify"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.25 }}
                            >
                                <div className="text-center mb-8">
                                    <div className="w-14 h-14 rounded-2xl bg-[#A855F7]/10 border border-[#A855F7]/20 flex items-center justify-center mx-auto mb-4">
                                        <ShieldCheck className="w-7 h-7 text-[#A855F7]" />
                                    </div>
                                    <h2 className="font-display font-bold text-white text-2xl mb-2">Verify Your Email</h2>
                                    <p className="font-body text-sm text-white/50">
                                        We sent a 6-digit code to<br />
                                        <span className="text-[#A855F7]">{registrationData.email}</span>
                                    </p>
                                </div>

                                <form onSubmit={handleOtpSubmit} className="space-y-4">
                                    <div>
                                        <label className="block font-mono-accent text-xs text-white/40 uppercase tracking-widest mb-1.5">
                                            Verification Code
                                        </label>
                                        <input
                                            id="register-otp-input"
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            value={otp}
                                            onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-2xl tracking-[0.5em] font-mono text-center focus:outline-none focus:border-[#A855F7]/40"
                                            placeholder="000000"
                                            autoFocus
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={otpLoading || otp.length !== 6}
                                        id="verify-register-otp-btn"
                                        className="group w-full flex items-center justify-center gap-2 py-3.5 mt-2 rounded-xl font-mono-accent text-sm uppercase tracking-widest font-medium text-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                                        style={{ background: "linear-gradient(135deg, #A855F7, #00D9FF)" }}
                                    >
                                        {otpLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Create Account'}
                                        {!otpLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                    </button>
                                </form>

                                <div className="mt-6 flex flex-col items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={resendCountdown > 0}
                                        className="text-sm text-white/40 hover:text-[#A855F7] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {resendCountdown > 0
                                            ? `Resend code in ${resendCountdown}s`
                                            : 'Resend verification code'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setStep(1); setOtp(''); }}
                                        className="text-sm text-white/30 hover:text-white/60 transition-colors"
                                    >
                                        ← Edit details
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
