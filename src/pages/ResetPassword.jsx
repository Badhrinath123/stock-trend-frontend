import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Send, Key, CheckCircle2, ArrowLeft, Loader2, User, Lock, ShieldCheck } from 'lucide-react';
import { ANIMATIONS } from '../DesignTokens';

const ResetPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: Password
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/forgot-password', { email });
            setMessage(res.data.message);
            setError('');
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to send code');
            setMessage('');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/verify-code', { identifier: email, code });
            setMessage('Identity verified. Set your new security credential.');
            setError('');
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid or expired code');
            setMessage('');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (newPassword.length < 6) {
            setError('Security requirement: Password must be 6+ characters');
            setLoading(false);
            return;
        }

        try {
            const res = await api.post('/auth/reset-password', { identifier: email, code, new_password: newPassword });
            setMessage(res.data.message);
            setError('');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.detail || 'System error: Failed to update credentials');
            setMessage('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                {...ANIMATIONS.fadeUp}
                className="glass p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/10 premium-gradient relative z-10"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="flex justify-between w-full items-center mb-8">
                        <Link to="/login" className="p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="flex gap-1.5">
                            {[1, 2, 3].map(s => (
                                <div key={s} className={`h-1.5 w-6 rounded-full transition-all duration-500 ${step >= s ? 'bg-accent' : 'bg-white/10'}`} />
                            ))}
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-center tracking-tight text-white mb-2">Reset <span className="text-accent">Access</span></h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Security Protocol Step {step}</p>
                </div>

                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-danger/10 text-danger border border-danger/20 p-4 rounded-2xl mb-8 text-[10px] font-black uppercase tracking-wider flex items-center gap-3"
                        >
                            <ShieldAlert size={18} className="shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    {message && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-green-500/10 text-green-400 border border-green-500/20 p-4 rounded-2xl mb-8 text-[10px] font-black uppercase tracking-wider flex items-center gap-3"
                        >
                            <CheckCircle2 size={18} className="shrink-0" />
                            {message}
                        </motion.div>
                    )}
                </AnimatePresence>

                {step === 1 && (
                    <motion.form key="step1" {...ANIMATIONS.fadeUp} onSubmit={handleSendCode} className="space-y-6">
                        <p className="text-slate-400 text-sm leading-relaxed text-center px-4">Identify your account using your username or registered email address.</p>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identifier</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-white focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all text-sm"
                                    placeholder="Username or Email"
                                    required
                                />
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-primary font-black py-4 rounded-2xl hover:bg-accent hover:text-white transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-2 uppercase tracking-widest text-xs disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                            {loading ? 'Transmitting...' : 'Send Recovery Code'}
                        </button>
                    </motion.form>
                )}

                {step === 2 && (
                    <motion.form key="step2" {...ANIMATIONS.fadeUp} onSubmit={handleVerifyCode} className="space-y-8">
                        <p className="text-slate-400 text-sm leading-relaxed text-center px-4">
                            Verification code dispatched to the email associated with <b className="text-white">{email}</b>.
                        </p>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center block w-full">6-Digit Security PIN</label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-6 text-white text-center text-4xl font-black font-mono tracking-[0.5em] focus:outline-none focus:border-accent/50 transition-all placeholder:text-slate-800"
                                placeholder="000000"
                                maxLength={6}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-primary font-black py-4 rounded-2xl hover:bg-accent hover:text-white transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-2 uppercase tracking-widest text-xs disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                            {loading ? 'Authenticating...' : 'Validate Access'}
                        </button>
                    </motion.form>
                )}

                {step === 3 && (
                    <motion.form key="step3" {...ANIMATIONS.fadeUp} onSubmit={handleResetPassword} className="space-y-6">
                        <p className="text-slate-400 text-sm leading-relaxed text-center px-4">Identity confirmed. Please establish your new secure password.</p>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">New Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-white focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent text-white font-black py-4 rounded-2xl hover:shadow-lg hover:shadow-accent/30 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <Key size={18} />}
                            {loading ? 'Updating Vault...' : 'Seal New Password'}
                        </button>
                    </motion.form>
                )}

                <div className="mt-10 text-center">
                    <Link to="/login" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                        Return to Authentication
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
