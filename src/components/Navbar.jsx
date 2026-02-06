import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LogOut, TrendingUp, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Dashboard', path: '/', protected: true },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 glass border-b border-white/10 premium-gradient">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="bg-accent/20 p-2 rounded-xl group-hover:bg-accent/30 transition-colors">
                            <TrendingUp className="h-6 w-6 text-accent" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white group-hover:text-accent transition-colors">StockTrend</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {user && navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm font-medium transition-all hover:text-accent ${isActive(link.path) ? 'text-accent' : 'text-slate-400'}`}
                            >
                                {link.name}
                                {isActive(link.path) && <motion.div layoutId="activeNav" className="h-0.5 bg-accent rounded-full mt-1" />}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                    <User size={14} className="text-slate-400" />
                                    <span className="text-slate-300 text-xs font-medium">{user.username}</span>
                                </div>
                                <button
                                    onClick={logout}
                                    className="p-2.5 rounded-xl text-slate-400 hover:text-danger hover:bg-danger/10 transition-all"
                                    title="Logout"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2">Login</Link>
                                <Link to="/register" className="bg-accent text-primary px-5 py-2.5 rounded-xl font-bold text-sm hover:translate-y-[-2px] hover:shadow-lg hover:shadow-accent/20 transition-all">Register</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass border-t border-white/10 overflow-hidden"
                    >
                        <div className="p-4 space-y-4">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-4">
                                        <div className="bg-accent/20 p-2 rounded-lg text-accent">
                                            <User size={20} />
                                        </div>
                                        <span className="font-medium text-white">{user.username}</span>
                                    </div>
                                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="block p-3 rounded-xl hover:bg-white/5 text-slate-300">Dashboard</Link>
                                    <button
                                        onClick={() => { logout(); setIsMenuOpen(false); }}
                                        className="w-full text-left p-3 rounded-xl text-red-400 hover:bg-red-400/10 flex items-center gap-2"
                                    >
                                        <LogOut size={18} /> Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="p-3 text-center rounded-xl bg-white/5 text-slate-300 font-medium">Login</Link>
                                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="p-3 text-center rounded-xl bg-accent text-primary font-bold">Register</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
