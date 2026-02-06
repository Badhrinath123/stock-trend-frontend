import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LogOut, TrendingUp } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="bg-secondary border-b border-slate-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <TrendingUp className="h-8 w-8 text-accent" />
                            <span className="text-xl font-bold tracking-tight text-white">StockTrend</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="text-slate-400 text-sm">Welcome, {user.username}</span>
                                <button
                                    onClick={logout}
                                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </>
                        ) : (
                            <div className="flex gap-4">
                                <Link to="/login" className="text-slate-300 hover:text-white transition-colors">Login</Link>
                                <Link to="/register" className="bg-accent text-primary px-4 py-2 rounded-lg font-medium hover:bg-sky-500 transition-colors">Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
