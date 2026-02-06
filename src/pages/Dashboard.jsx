import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, TrendingUp, TrendingDown, Trash2, Globe, AlertCircle, BarChart3, Info, Zap, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ANIMATIONS } from '../DesignTokens';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [watchlist, setWatchlist] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [predictions, setPredictions] = useState({});
    const [newStockSymbol, setNewStockSymbol] = useState('');
    const [popularStocksData, setPopularStocksData] = useState({});
    const [selectedCategory, setSelectedCategory] = useState("Banking & Finance");
    const [marketHistory, setMarketHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Polling for real-time updates
    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            await Promise.all([fetchWatchlist(), fetchPopularStocks(), fetchMarketHistory()]);
            setLoading(false);
        };

        loadInitialData();

        const interval = setInterval(() => {
            fetchPopularStocks();
            fetchMarketHistory();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, []);

    const fetchMarketHistory = async () => {
        try {
            const res = await api.get('/market/history/^NSEI');
            setMarketHistory(res.data);
        } catch (err) {
            console.error("Failed to fetch market history", err);
        }
    };

    const fetchWatchlist = async () => {
        try {
            const res = await api.get('/watchlist');
            const stocks = res.data.map(item => item.stock);
            setWatchlist(stocks);
        } catch (err) {
            console.error("Failed to fetch watchlist", err);
        }
    };

    const fetchPopularStocks = async () => {
        try {
            const res = await api.get('/market/popular');
            setPopularStocksData(res.data);
            const keys = Object.keys(res.data);
            if (keys.length > 0 && !selectedCategory) setSelectedCategory(keys[0]);
        } catch (err) {
            console.error("Failed to fetch popular stocks", err);
        }
    };

    const handleAddStock = async (e) => {
        e.preventDefault();
        try {
            const stockRes = await api.post('/stocks', { symbol: newStockSymbol.toUpperCase(), company_name: newStockSymbol.toUpperCase() });
            const stockId = stockRes.data.id;
            await api.post('/watchlist', { stock_id: stockId });
            setNewStockSymbol('');
            fetchWatchlist();
        } catch (err) {
            console.error("Failed to add stock", err);
            const msg = err.response?.data?.detail || "Failed to add stock. Please check the symbol.";
            alert(msg);
        }
    };

    const handleDeleteStock = async (symbol) => {
        try {
            await api.delete(`/watchlist/${symbol}`);
            fetchWatchlist();
        } catch (err) {
            console.error("Failed to delete stock", err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-medium animate-pulse">Synchronizing Market Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="safe-p max-w-7xl mx-auto space-y-8 md:space-y-12">
            {/* Header Section */}
            <motion.header
                {...ANIMATIONS.fadeUp}
                className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
            >
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Zap size={20} className="text-accent" />
                        <span className="text-accent text-xs font-bold uppercase tracking-[0.2em]">Market Intelligence</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
                        Financial <span className="text-accent">Overview</span>
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base max-w-md">
                        Real-time AI-powered trend analysis for your selected assets and global indices.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-secondary/30 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/5 shadow-inner">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-black text-green-400 uppercase tracking-widest">Live Engine</span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <span className="text-[10px] font-mono text-slate-500">{new Date().toLocaleTimeString()}</span>
                </div>
            </motion.header>

            {/* Quick Actions & Market History Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Main Market Insight */}
                <motion.div
                    {...ANIMATIONS.fadeUp}
                    className="lg:col-span-2 glass rounded-3xl overflow-hidden premium-gradient"
                >
                    <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <BarChart3 className="text-accent" size={20} />
                                Benchmark Analytics
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">NIFTY 50 Index performance overview</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-[10px] font-bold uppercase tracking-wider border border-accent/20">30D History</span>
                        </div>
                    </div>

                    <div className="p-4 md:p-8 h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={marketHistory}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#475569"
                                    style={{ fontSize: '10px', fontWeight: 'bold' }}
                                    tickFormatter={(str) => {
                                        const d = new Date(str);
                                        return `${d.getDate()}/${d.getMonth() + 1}`;
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    stroke="#475569"
                                    style={{ fontSize: '10px', fontWeight: 'bold' }}
                                    domain={['auto', 'auto']}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(val) => `₹${(val / 1000).toFixed(1)}k`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(222.2 84% 4.9%)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                    itemStyle={{ color: 'hsl(199 89% 48%)' }}
                                />
                                <Area type="monotone" dataKey="price" stroke="hsl(199 89% 48%)" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* AI Insights Panel */}
                <motion.div
                    {...ANIMATIONS.fadeUp}
                    className="glass rounded-3xl p-6 md:p-8 flex flex-col premium-gradient"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-purple-500/20 p-2.5 rounded-2xl">
                            <Zap className="text-purple-400" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg tracking-tight">AI Market Insight</h3>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Neural Predictions</p>
                        </div>
                    </div>

                    <div className="space-y-6 flex-1">
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-slate-400">Market Sentiment</span>
                                <span className="text-xs font-bold text-green-400">Moderately Bullish</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '65%' }}
                                    className="h-full bg-green-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <span className="text-[10px] text-slate-500 block mb-1">Volatilty Index</span>
                                <span className="text-lg font-black font-mono">14.2</span>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <span className="text-[10px] text-slate-500 block mb-1">AI Confidence</span>
                                <span className="text-lg font-black font-mono">82%</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20 flex gap-3 items-start">
                            <Info className="text-accent shrink-0" size={16} />
                            <p className="text-[10px] leading-relaxed text-accent font-medium">
                                AI engine predicts a continued upward momentum for Indian Top-50 in the next session based on volume accumulation.
                            </p>
                        </div>
                    </div>

                    <button className="mt-8 w-full py-4 bg-white text-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent hover:text-white transition-all">
                        Upgrade Intelligence
                    </button>
                </motion.div>
            </div>

            {/* Watchlist Section */}
            <div className="space-y-6 md:space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight">My Assets</h2>
                        <p className="text-slate-500 text-xs">Manage your focus list and toggle AI tracking.</p>
                    </div>

                    <form onSubmit={handleAddStock} className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <input
                                type="text"
                                placeholder="Symbol..."
                                value={newStockSymbol}
                                onChange={(e) => setNewStockSymbol(e.target.value)}
                                className="w-full bg-secondary/50 border border-white/10 rounded-2xl px-5 py-3.5 pl-12 text-sm focus:outline-none focus:border-accent/50 transition-all placeholder:text-slate-600"
                            />
                            <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        </div>
                        <button
                            type="submit"
                            className="bg-accent text-primary px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-accent/20 transition-all active:scale-95"
                        >
                            Track
                        </button>
                    </form>
                </div>

                {watchlist.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-center py-24 glass rounded-[40px] border-dashed border-white/10"
                    >
                        <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Plus className="text-slate-500" size={32} />
                        </div>
                        <p className="text-slate-400 font-bold">Watchlist Empty</p>
                        <p className="text-slate-600 text-xs mt-2">Add a ticker above to begin AI monitoring.</p>
                    </motion.div>
                ) : (
                    <div className="responsive-grid">
                        <AnimatePresence mode="popLayout">
                            {watchlist.map((stock) => (
                                <StockCard key={stock.id} stock={stock} onDelete={() => handleDeleteStock(stock.symbol)} />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Catalog Section */}
            <motion.div {...ANIMATIONS.fadeUp} className="pt-12 border-t border-white/5 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight mb-2">Market Discovery</h2>
                        <p className="text-slate-500 text-xs">Explore curated sectors and trending Indian equities.</p>
                    </div>

                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-4 md:pb-0 scroll-smooth no-scrollbar">
                        {Object.keys(popularStocksData).map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-5 py-2.5 rounded-2xl text-[10px] uppercase font-black tracking-widest whitespace-nowrap transition-all ${selectedCategory === category
                                    ? 'bg-accent text-primary shadow-lg shadow-accent/20 translate-y-[-2px]'
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="responsive-grid">
                    {(popularStocksData[selectedCategory] || []).map((stock) => (
                        <motion.div
                            layout
                            key={stock.symbol}
                            className="glass p-5 rounded-[2rem] border-white/5 hover:border-accent/40 transition-all flex justify-between items-center group cursor-pointer"
                            onClick={() => { setNewStockSymbol(stock.symbol); }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-white/5 p-3 rounded-2xl group-hover:bg-accent/10 transition-colors">
                                    <Globe className="text-slate-400 group-hover:text-accent" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-black text-white text-sm tracking-tight">{stock.symbol}</h4>
                                    <p className="text-[10px] text-slate-500 truncate w-32 font-medium">{stock.company_name}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className={`text-xs font-black font-mono ${stock.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                    {stock.change}
                                </span>
                                <span className="text-[10px] text-slate-500 font-bold group-hover:text-accent transition-colors">₹{stock.price}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}

const StockCard = ({ stock, onDelete }) => {
    const [predictionData, setPredictionData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrediction = async () => {
            try {
                const res = await api.get(`/predict/${stock.symbol}`);
                setPredictionData(res.data);
            } catch (err) {
                console.error("Failed to fetch prediction", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPrediction();
    }, [stock.symbol]);

    const isUp = predictionData?.prediction === 'UP';
    const confidence = Math.round((predictionData?.confidence || 0) * 100);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="glass rounded-[2.5rem] p-8 border-white/5 hover:border-accent/30 transition-all group relative overflow-hidden h-[240px] flex flex-col justify-between"
        >
            <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="absolute top-6 right-6 z-20 text-slate-700 hover:text-danger p-2 rounded-2xl hover:bg-danger/10 transition-all opacity-0 group-hover:opacity-100"
            >
                <Trash2 size={20} />
            </button>

            {/* Visual Decoration */}
            <div className={`absolute top-[-10%] right-[-10%] p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 pointer-events-none ${isUp ? 'text-green-500 rotate-[-15deg]' : 'text-red-500 rotate-[15deg]'}`}>
                {isUp ? <TrendingUp size={200} /> : <TrendingDown size={200} />}
            </div>

            <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-black text-white tracking-tighter">{stock.symbol}</h3>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stock.company_name}</p>
                    </div>
                </div>

                {!loading ? (
                    <div className="flex items-center gap-3">
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${isUp ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            (predictionData?.prediction === 'DOWN' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-slate-700/50 text-slate-400 border-white/5')
                            }`}>
                            {predictionData?.prediction || 'N/A'} {confidence > 0 ? `${confidence}%` : ''}
                        </div>
                        {confidence > 70 && (
                            <div className="text-accent flex items-center gap-1" title="High Confidence Prediction">
                                <ShieldCheck size={16} />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-6 w-24 bg-white/5 rounded-full animate-pulse"></div>
                )}
            </div>

            <div className="relative z-10 pt-4 mt-auto border-t border-white/5">
                <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-[10px] font-black uppercase tracking-wider">Neural Forecast</span>

                    <div className={`text-sm font-black flex items-center gap-2 ${loading ? 'text-slate-500' : (isUp ? 'text-green-400' : (predictionData?.prediction === 'DOWN' ? 'text-red-400' : 'text-slate-400'))}`}>
                        {loading ? (
                            <span className="flex items-center gap-1.5 animate-pulse">
                                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"></div>
                                <span className="text-[10px] italic">Processing</span>
                            </span>
                        ) : (
                            <>
                                {isUp ? <TrendingUp size={16} /> : (predictionData?.prediction === 'DOWN' ? <TrendingDown size={16} /> : <AlertCircle size={16} />)}
                                <span className="tracking-tight">{predictionData?.prediction === 'UP' ? 'Accumulate' : (predictionData?.prediction === 'DOWN' ? 'Distribution' : 'Neutral')}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default Dashboard;
