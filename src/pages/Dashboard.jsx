import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, TrendingDown, Trash2, Globe, AlertCircle, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [watchlist, setWatchlist] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [predictions, setPredictions] = useState({});
    const [newStockSymbol, setNewStockSymbol] = useState('');
    const [popularStocksData, setPopularStocksData] = useState({});
    const [selectedCategory, setSelectedCategory] = useState("Banking & Finance");
    const [marketHistory, setMarketHistory] = useState([]);

    // Mock fetching watchlist and stocks
    useEffect(() => {
        fetchWatchlist();
        fetchPopularStocks();
        fetchMarketHistory();
    }, []);

    const fetchMarketHistory = async () => {
        try {
            // Fetch NIFTY 50 history
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
            if (keys.length > 0) setSelectedCategory(keys[0]);
        } catch (err) {
            console.error("Failed to fetch popular stocks", err);
        }
    };

    const handleAddStock = async (e) => {
        e.preventDefault();
        try {
            // 1. Create/Get Stock
            const stockRes = await api.post('/stocks', { symbol: newStockSymbol.toUpperCase(), company_name: newStockSymbol.toUpperCase() });
            const stockId = stockRes.data.id;

            // 2. Add to Watchlist
            await api.post('/watchlist', { stock_id: stockId });

            setNewStockSymbol('');
            fetchWatchlist();
        } catch (err) {
            console.error("Failed to add stock", err);

            if (err.response) {
                alert(err.response.data.detail || "Failed to add stock. Please check the symbol.");
            } else {
                alert("Network error. Please try again.");
            }
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

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12">
            <div>
                <header className="mb-10">
                    <h1 className="text-4xl font-bold mb-2">My Watchlist</h1>
                    <p className="text-slate-400">Track market trends and AI predictions for your favorite stocks.</p>
                </header>

                <div className="flex gap-4 mb-12">
                    <form onSubmit={handleAddStock} className="flex gap-4 w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Enter Stock Symbol (e.g. RELIANCE)"
                            value={newStockSymbol}
                            onChange={(e) => setNewStockSymbol(e.target.value)}
                            className="flex-1 bg-secondary border border-slate-700 rounded-lg px-4 py-3 placeholder-slate-500 focus:outline-none focus:border-accent transition-colors text-white"
                        />
                        <button
                            type="submit"
                            className="bg-accent hover:bg-sky-500 text-slate-900 font-bold px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Add
                        </button>
                    </form>
                </div>

                {watchlist.length === 0 ? (
                    <div className="text-center py-20 bg-secondary/50 rounded-2xl border border-dashed border-slate-700">
                        <p className="text-slate-500 text-lg">Your watchlist is empty. Add a stock to get started!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {watchlist.map((stock) => (
                            <StockCard key={stock.id} stock={stock} onDelete={() => handleDeleteStock(stock.symbol)} />
                        ))}
                    </div>
                )}
            </div>

            <div className="border-t border-slate-800 pt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Market Chart */}
                    <div className="lg:col-span-2 bg-secondary/50 p-6 rounded-2xl border border-slate-800">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <BarChart3 className="text-accent" />
                            NIFTY 50 Index <span className="text-sm font-normal text-slate-500 ml-2">(Last 30 Days)</span>
                        </h2>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={marketHistory}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#94a3b8"
                                        style={{ fontSize: '12px' }}
                                        tickFormatter={(str) => {
                                            const d = new Date(str);
                                            return `${d.getDate()}/${d.getMonth() + 1}`;
                                        }}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        style={{ fontSize: '12px' }}
                                        domain={['auto', 'auto']}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                        itemStyle={{ color: '#38bdf8' }}
                                    />
                                    <Area type="monotone" dataKey="price" stroke="#38bdf8" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Market Catalog */}
                    <div className="lg:col-span-1">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Globe className="text-accent" />
                            Catalog
                        </h2>
                        {/* Sector Tabs */}
                        <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
                            {Object.keys(popularStocksData).map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedCategory === category
                                            ? 'bg-accent text-slate-900'
                                            : 'bg-secondary text-slate-400 hover:text-white hover:bg-slate-700'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                            {(popularStocksData[selectedCategory] || []).map((stock) => (
                                <div key={stock.symbol} className="bg-secondary p-3 rounded-xl border border-slate-800 hover:border-slate-600 transition-all flex justify-between items-center group">
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{stock.symbol}</h4>
                                        <p className="text-[10px] text-slate-400 truncate w-24">{stock.company_name}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={stock.change.startsWith('+') ? 'text-green-400 text-xs' : 'text-red-400 text-xs'}>
                                            {stock.change}
                                        </span>
                                        <button
                                            onClick={() => { setNewStockSymbol(stock.symbol); }}
                                            className="text-accent text-[10px] hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            + Add
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-secondary rounded-xl p-6 border border-slate-700 hover:border-accent/50 transition-all shadow-lg group relative overflow-hidden"
        >
            <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="absolute top-4 right-4 z-20 text-slate-600 hover:text-danger p-1 rounded-full hover:bg-slate-800/50 transition-colors"
                title="Remove from watchlist"
            >
                <Trash2 size={18} />
            </button>

            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                {isUp ? <TrendingUp size={100} /> : <TrendingDown size={100} />}
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-white">{stock.symbol}</h3>
                        <p className="text-slate-400 text-sm">{stock.company_name}</p>
                    </div>
                    {/* Badge */}
                    {!loading ? (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${isUp ? 'bg-green-500/20 text-green-400' : (predictionData?.prediction === 'DOWN' ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-300')}`}>
                            {predictionData?.prediction || 'N/A'} {confidence > 0 ? `${confidence}%` : ''}
                        </span>
                    ) : (
                        <div className="h-6 w-16 bg-slate-700/50 rounded-full animate-pulse"></div>
                    )}
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <div className="text-slate-300 text-sm">
                        Prediction for Tomorrow
                    </div>
                </div>

                <div className={`mt-2 text-xl font-bold flex items-center gap-2 ${loading ? 'text-slate-500' : (isUp ? 'text-green-400' : (predictionData?.prediction === 'DOWN' ? 'text-red-400' : 'text-slate-400'))}`}>
                    {loading ? (
                        <span className="flex items-center gap-2 italic text-sm">
                            <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                            Analyzing...
                        </span>
                    ) : (
                        <>
                            {isUp ? <TrendingUp className="h-6 w-6" /> : (predictionData?.prediction === 'DOWN' ? <TrendingDown className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />)}
                            {predictionData?.prediction || 'Unavailable'}
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default Dashboard;
