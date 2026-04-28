import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ArrowRight, Loader2, Eye, EyeOff, AlertCircle, X, ShieldCheck, LogIn, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Login() {
    const { loginWithData } = useAuth();
    const navigate = useNavigate();

    const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
    const [showPassword, setShowPassword] = useState(false);

    // Captcha state
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const canvasRef = useRef(null);

    const generateCaptcha = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        let text = '';
        for (let i = 0; i < 6; i++) {
            text += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaText(text);
        setCaptchaInput('');
        drawCaptcha(text);
    };

    const drawCaptcha = (text) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background
        ctx.fillStyle = '#1A1A24';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add some noise (lines)
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
            ctx.lineWidth = Math.random() * 2;
            ctx.stroke();
        }

        // Draw text with random rotation
        ctx.font = 'bold 26px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        for (let i = 0; i < text.length; i++) {
            ctx.save();
            const x = 25 + (i * 20) + (Math.random() * 4 - 2);
            const y = canvas.height / 2 + (Math.random() * 8 - 4);
            ctx.translate(x, y);
            
            const angle = (Math.random() - 0.5) * 0.5;
            ctx.rotate(angle);
            
            // Color - single light classic color
            ctx.fillStyle = '#E2E8F0';
            
            ctx.fillText(text[i], 0, 0);
            ctx.restore();
        }

        // Add some noise (dots)
        for (let i = 0; i < 30; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
            ctx.fill();
        }
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    // ── Toast auto-dismiss ────────────────────────────────────────────────────────
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    const showToast = (message, type = 'error') =>
        setToast({ show: true, message, type });

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email').required('Required'),
            password: Yup.string().required('Required'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            if (captchaInput.toLowerCase() !== captchaText.toLowerCase()) {
                showToast('Incorrect verification code. Please try again.');
                generateCaptcha();
                setSubmitting(false);
                return;
            }

            try {
                setToast({ show: false, message: '', type: 'error' });
                // Direct login call, no OTP
                const { data } = await api.post('/auth/login', {
                    email: values.email,
                    password: values.password,
                });
                
                loginWithData(data);
                navigate('/dashboard');
            } catch (err) {
                let msg = 'Invalid login credentials';
                if (err.response) {
                    // Use the exact error message provided by the backend
                    msg = err.response.data?.error || err.response.data?.message || msg;
                }
                showToast(msg);
                generateCaptcha();
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="min-h-screen bg-[#0A0A0F] font-body flex items-center justify-center p-4">
            {/* Toast */}
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-4 px-4 py-3 rounded-lg shadow-xl border backdrop-blur-md min-w-[300px] ${
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

                        <div>
                            <label className="block font-mono-accent text-xs text-white/40 uppercase tracking-widest mb-1.5">Security Check</label>
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-4 items-center">
                                    <div className="flex-1 bg-[#1A1A24] border border-white/10 rounded-xl overflow-hidden flex items-center justify-center p-2 shadow-inner">
                                        <canvas 
                                            ref={canvasRef} 
                                            width="150" 
                                            height="40" 
                                            className="w-full h-10 object-contain"
                                        />
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={generateCaptcha}
                                        className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                                        title="Reload Captcha"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={captchaInput}
                                    onChange={e => setCaptchaInput(e.target.value.trim())}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#00D9FF]/40 text-center tracking-widest font-mono"
                                    placeholder="Enter verification code"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={formik.isSubmitting || !captchaInput}
                            id="login-btn"
                            className="group w-full flex items-center justify-center gap-2 py-3.5 mt-6 rounded-xl font-mono-accent text-sm uppercase tracking-widest font-medium text-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                            style={{ background: "linear-gradient(135deg, #00D9FF, #A855F7)" }}
                        >
                            {formik.isSubmitting
                                ? <Loader2 className="w-5 h-5 animate-spin" />
                                : <><LogIn className="w-4 h-4" /> Log In</>
                            }
                            {!formik.isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
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
