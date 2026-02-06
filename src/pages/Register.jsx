import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';

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
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-secondary p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-700"
            >
                <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">Create Account</h2>
                {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-primary border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                            placeholder="Choose a username"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-primary border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                            placeholder="your@email.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-primary border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-accent text-primary font-bold py-3 rounded-lg hover:bg-sky-500 transition-colors shadow-lg shadow-sky-500/20"
                    >
                        Sign Up
                    </button>
                </form>

                <div className="my-6 flex items-center gap-4 text-slate-500">
                    <div className="h-px bg-slate-700 flex-1"></div>
                    <span className="text-xs uppercase font-medium">or</span>
                    <div className="h-px bg-slate-700 flex-1"></div>
                </div>

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google Sign Up Failed')}
                        theme="filled_blue"
                        shape="pill"
                        size="large"
                        width="100%"
                        text="signup_with"
                    />
                </div>

                <div className="mt-6 text-center text-slate-400 text-sm">
                    Already have an account? <Link to="/login" className="text-accent hover:underline">Log in</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
