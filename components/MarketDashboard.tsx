
import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Activity, 
  Bookmark, 
  BookmarkCheck, 
  Search, 
  ChevronRight, 
  Sparkles, 
  Globe, 
  Loader2, 
  AlertCircle,
  PlusCircle
} from 'lucide-react';
import { CURRENCIES } from '../constants';
import { Stock, User, CurrencyCode } from '../types';
import { fetchStockIntelligence } from '../services/geminiService';

interface MarketDashboardProps {
  stocks: Stock[];
  user: User | null;
  onToggleWatchlist: (symbol: string) => void;
  onDiscoverStock: (newStock: Partial<Stock>) => void;
  onSelectStock: (stock: Stock) => void;
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
}

const MarketDashboard: React.FC<MarketDashboardProps> = ({ stocks, user, onToggleWatchlist, onDiscoverStock, onSelectStock, currency, setCurrency }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSector, setActiveSector] = useState('All');
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveryError, setDiscoveryError] = useState<string | null>(null);

  const sectors = useMemo(() => ['All', ...new Set(stocks.map(s => s.sector))], [stocks]);
  const cur = CURRENCIES[currency];

  const formatVal = (val: number) => {
    const converted = val * cur.rate;
    return `${cur.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleGlobalLookup = async () => {
    if (!searchQuery.trim()) return;
    setIsDiscovering(true);
    setDiscoveryError(null);
    try {
      const result = await fetchStockIntelligence(searchQuery);
      if (result && result.symbol) {
        onDiscoverStock(result);
        setSearchQuery('');
      } else {
        setDiscoveryError("Could not verify this asset on global exchanges.");
      }
    } catch (e) {
      setDiscoveryError("Neural lookup failed. Check connectivity.");
    } finally {
      setIsDiscovering(false);
    }
  };

  const activeList = user?.watchlists.find(l => l.id === user.activeWatchlistId);
  const savedStocks = useMemo(() => stocks.filter(s => activeList?.symbols.includes(s.symbol)), [stocks, activeList]);

  const filteredStocks = useMemo(() => {
    return stocks.filter(s => {
      const matchesSearch = s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = activeSector === 'All' || s.sector === activeSector;
      return matchesSearch && matchesSector;
    });
  }, [stocks, searchQuery, activeSector]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Quick Watchlist Bar */}
      {user && savedStocks.length > 0 && (
        <div className="bg-blue-600/5 border border-blue-500/10 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/30 shrink-0">
              <BookmarkCheck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Watchlist</h4>
              <p className="text-xs text-gray-500">Live 15s updates for your {savedStocks.length} tracked nodes.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar max-w-full">
            {savedStocks.slice(0, 4).map(s => (
              <div 
                key={s.symbol} 
                onClick={() => onSelectStock(s)}
                className="bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 flex items-center gap-3 shrink-0 animate-in slide-in-from-right-2 cursor-pointer hover:border-blue-500/50 transition-all"
              >
                <span className="text-xs font-bold text-white">{s.symbol}</span>
                <span className={`text-[10px] font-bold ${s.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {s.changePercent > 0 ? '+' : ''}{s.changePercent}%
                </span>
              </div>
            ))}
            {savedStocks.length > 4 && (
              <div className="text-[10px] font-bold text-gray-600 px-2 shrink-0">+{savedStocks.length - 4} more</div>
            )}
          </div>
        </div>
      )}

      {/* World Market Explorer Header */}
      <section className="bg-gradient-to-br from-blue-900/20 to-black border border-gray-800 rounded-[2.5rem] p-10 backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-105 transition-transform duration-1000">
           <Globe size={300} className="text-blue-500" />
        </div>
        
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-600/10 border border-blue-500/20 rounded-xl text-blue-500">
              <Globe size={24} />
            </div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Global Terminal Explorer</span>
          </div>
          
          <h2 className="text-4xl font-serif font-bold text-white mb-4">World Market Hub</h2>
          <p className="text-lg text-gray-400 mb-10 leading-relaxed">
            Access real-time price telemetry for any publicly listed equity globally. Type a ticker or company name to initialize a neural data lookup.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch">
            <div className="relative flex-1 group/search">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="text-gray-500 group-focus-within/search:text-blue-500 transition-colors" size={20} />
              </div>
              <input 
                type="text"
                placeholder="Lookup: e.g. ASML, TSMC, LVMH..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGlobalLookup()}
                className="w-full bg-black/40 border border-gray-800 rounded-2xl py-5 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-lg"
              />
              {isDiscovering && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Loader2 className="animate-spin text-blue-500" size={20} />
                  <span className="text-[10px] font-bold text-blue-400 uppercase">Polling Nodes...</span>
                </div>
              )}
            </div>
            
            <button 
              onClick={handleGlobalLookup}
              disabled={isDiscovering || !searchQuery.trim()}
              className={`px-8 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-900/20 active:scale-95 ${
                !searchQuery.trim() ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Sparkles size={20} /> Global AI Lookup
            </button>
          </div>
          
          {discoveryError && (
            <div className="mt-4 flex items-center gap-2 text-red-400 text-sm font-medium animate-in slide-in-from-top-2">
              <AlertCircle size={16} /> {discoveryError}
            </div>
          )}
        </div>
      </section>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Active Trackers</h2>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-blue-500" /> 15s Real-time Sync</span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-green-500/60 uppercase tracking-widest"><Activity size={12} /> Live Channels</span>
          </div>
        </div>

        <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1">
          <select 
            value={activeSector}
            onChange={(e) => setActiveSector(e.target.value)}
            className="bg-transparent text-xs text-gray-300 px-3 focus:outline-none cursor-pointer h-8"
          >
            {sectors.map(s => <option key={s} value={s} className="bg-gray-950">{s}</option>)}
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStocks.length > 0 ? filteredStocks.map((stock) => {
          const inWatchlist = activeList?.symbols.includes(stock.symbol);
          return (
            <div 
              key={stock.symbol} 
              onClick={() => onSelectStock(stock)}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all group relative animate-in fade-in duration-300 cursor-pointer"
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWatchlist(stock.symbol);
                }}
                className={`absolute top-4 right-4 p-2 rounded-xl border transition-all z-10 ${
                  inWatchlist 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/30' 
                    : 'bg-gray-950 border-gray-800 text-gray-500 hover:text-blue-400 hover:border-blue-500/30'
                }`}
                title={inWatchlist ? "Remove from List" : "Add to Active List"}
              >
                {inWatchlist ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
              </button>
              
              <div className="flex justify-between items-start mb-4 pr-8">
                <div>
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-500/10 px-1.5 py-0.5 rounded">{stock.exchange}</span>
                  <h3 className="text-xl font-bold text-white mt-1 group-hover:text-blue-400 transition-colors">{stock.symbol}</h3>
                  <p className="text-sm text-gray-500 truncate">{stock.name}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${stock.marketStatus === 'Open' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {stock.marketStatus}
                  </span>
                  <span className="text-[10px] text-gray-600 mt-1">{stock.country}</span>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-white">{formatVal(stock.price)}</span>
                <span className={`flex items-center text-sm font-semibold transition-all duration-700 ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stock.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {formatVal(Math.abs(stock.change))} ({stock.changePercent}%)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800 text-xs">
                <div>
                  <p className="text-gray-500 mb-1 font-bold uppercase tracking-tighter">Sector</p>
                  <p className="text-gray-300 font-medium">{stock.sector}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 mb-1 font-bold uppercase tracking-tighter">Sync Token</p>
                  <p className="text-gray-300 font-mono text-[9px] uppercase">{stock.lastUpdated}</p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                 <span className="text-xs text-blue-500 hover:underline font-bold flex items-center gap-1">
                   Detailed Node Analysis <ChevronRight size={14} />
                 </span>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full py-20 text-center text-gray-500 bg-gray-900/50 border border-dashed border-gray-800 rounded-3xl">
            <Search size={48} className="mx-auto mb-4 opacity-10" />
            <h4 className="text-white font-bold mb-2">Node not locally cached</h4>
            <p className="text-sm max-w-xs mx-auto mb-6">Use Global AI Lookup above to discover this asset across worldwide exchanges.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-blue-500 font-bold hover:underline"
            >
              Reset Terminal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketDashboard;
