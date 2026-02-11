import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Shield, LogOut } from 'lucide-react';
import { ANIMATIONS } from '../DesignTokens';

const Profile = () => {
    const { user, logout } = useContext(AuthContext);

    if (!user) return null;

    return (
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                {...ANIMATIONS.fadeUp}
                className="glass p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/10 premium-gradient relative z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-accent/20 p-6 rounded-full mb-6 ring-4 ring-accent/10">
                        <User className="h-12 w-12 text-accent" />
                    </div>
                    <h2 className="text-3xl font-black text-center tracking-tight text-white mb-1">
                        {user.username}
                    </h2>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                        Standard Member
                    </p>
                </div>

                <div className="space-y-4 mb-10">
                    <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-4 border border-white/5">
                        <div className="bg-slate-800/50 p-2 rounded-xl">
                            <Mail size={18} className="text-slate-400" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Email Address</p>
                            <p className="text-white font-medium text-sm">{user.email || 'Not verified'}</p>
                        </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-4 border border-white/5">
                        <div className="bg-slate-800/50 p-2 rounded-xl">
                            <Shield size={18} className="text-slate-400" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Account Status</p>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                <p className="text-white font-medium text-sm">Active</p>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="w-full bg-red-500/10 text-red-400 font-black py-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                    <LogOut size={16} />
                    Sign Out
                </button>
            </motion.div>
        </div>
    );
};

export default Profile;
