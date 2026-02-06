import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { TrendingUp, Mail, Lock, User, Sparkles, ShieldCheck } from 'lucide-react';
import { ANIMATIONS } from '../DesignTokens';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register, loginWithGoogle } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, password, email);
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Username or email might be taken.');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await loginWithGoogle(credentialResponse.credential);
            navigate('/');
        } catch (err) {
            setError('Google sign up failed');
        }
    };

    return (
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />

            <motion.div
                {...ANIMATIONS.fadeUp}
                className="glass p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/10 premium-gradient relative z-10"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="bg-accent/20 p-4 rounded-2xl mb-6">
                        <Sparkles className="h-8 w-8 text-accent" />
                    </div>
                    <h2 className="text-3xl font-black text-center tracking-tight text-white">Create <span className="text-accent">Account</span></h2>
                    <p className="text-slate-500 text-sm mt-3 font-medium text-center">Join the elite circle of data-driven investors</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-danger/10 text-danger border border-danger/20 p-4 rounded-2xl mb-8 text-xs font-bold flex items-center gap-3"
                    >
                        <ShieldCheck size={18} className="shrink-0" />
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-white focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all placeholder:text-slate-600 text-sm"
                                placeholder="Choose username"
                                required
                            />
                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-white focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all placeholder:text-slate-600 text-sm"
                                placeholder="name@domain.com"
                                required
                            />
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Security</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-white focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all placeholder:text-slate-600 text-sm"
                                placeholder="Set strong password"
                                required
                            />
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white text-primary font-black py-4 rounded-2xl hover:bg-accent hover:text-white transition-all shadow-xl shadow-black/20 uppercase tracking-widest text-xs"
                    >
                        Create Portfolio
                    </button>
                </form>

                <div className="my-10 flex items-center gap-4">
                    <div className="h-px bg-white/5 flex-1"></div>
                    <span className="text-[10px] uppercase font-black text-slate-600 tracking-widest">Social Registration</span>
                    <div className="h-px bg-white/5 flex-1"></div>
                </div>

                <div className="flex justify-center overflow-hidden rounded-2xl">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google Sign Up Failed')}
                        theme="filled_black"
                        shape="rectangular"
                        size="large"
                        width="100%"
                        text="signup_with"
                    />
                </div>

                <div className="mt-10 text-center">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                        Resident Member? <Link to="/login" className="text-accent hover:text-white transition-colors">Sign In</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
