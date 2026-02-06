import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';

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
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to send code');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/verify-code', { email, code });
            setMessage('Code verified! Please set your new password.');
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid or expired code');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/reset-password', { email, code, new_password: newPassword });
            setMessage(res.data.message);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-secondary p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-700"
            >
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">Reset Access</h2>
                    <span className="text-xs text-slate-500 font-mono">Step {step}/3</span>
                </div>

                {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-4 text-sm text-center border border-red-500/20">{error}</div>}
                {message && <div className="bg-green-500/10 text-green-500 p-3 rounded-lg mb-4 text-sm text-center border border-green-500/20">{message}</div>}

                {step === 1 && (
                    <form onSubmit={handleSendCode} className="space-y-6">
                        <p className="text-slate-400 text-sm">Enter your username or email address to receive a security code.</p>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Username or Email</label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-primary border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                placeholder="Enter your username or email"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent text-primary font-bold py-3 rounded-lg hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send Security Code'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyCode} className="space-y-6">
                        <p className="text-slate-400 text-sm">We've sent a code to <b>{email}</b>. Enter it below to proceed.</p>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">6-Digit Code</label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full bg-primary border border-slate-700 rounded-lg px-4 py-3 text-white text-center text-2xl tracking-[1em] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                placeholder="000000"
                                maxLength={6}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent text-primary font-bold py-3 rounded-lg hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Verify Code'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full text-slate-500 text-sm hover:text-slate-300 transition-colors"
                        >
                            Change Email
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <p className="text-slate-400 text-sm">Almost there! Create a new strong password for your account.</p>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-primary border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent text-primary font-bold py-3 rounded-lg hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Set New Password'}
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center text-slate-400 text-sm">
                    Back to <Link to="/login" className="text-accent hover:underline">Log in</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
