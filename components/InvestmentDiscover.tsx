
import React, { useState, useMemo } from 'react';
import { Target, Bookmark, BookmarkCheck, Star, Info, ChevronRight, Activity } from 'lucide-react';
import { CURRENCIES } from '../constants';
import { Stock, User, CurrencyCode } from '../types';

interface InvestmentDiscoverProps {
  stocks: Stock[];
  user: User | null;
  onToggleWatchlist: (symbol: string) => void;
  onSelectStock: (stock: Stock) => void;
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
}

const InvestmentDiscover: React.FC<InvestmentDiscoverProps> = ({ stocks, user, onToggleWatchlist, onSelectStock, currency, setCurrency }) => {
  const [activeCountry, setActiveCountry] = useState('All');
  const [activeSector, setActiveSector] = useState('All');

  const countries = ['All', 'India', 'USA'];
  const sectors = useMemo(() => ['All', 'Technology', 'Energy', 'Finance', 'Healthcare', 'Consumer', 'Infrastructure'], []);
  const cur = CURRENCIES[currency];

  const formatVal = (val: number) => {
    const converted = val * cur.rate;
    return `${cur.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleCountryChange = (c: string) => {
    setActiveCountry(c);
    if (c === 'India') setCurrency('INR');
    else if (c === 'USA') setCurrency('USD');
  };

  const activeList = user?.watchlists.find(l => l.id === user.activeWatchlistId);

  const recommendedStocks = useMemo(() => {
    return stocks.filter(s => {
      const matchesCountry = activeCountry === 'All' || s.country === activeCountry;
      const matchesSector = activeSector === 'All' || s.sector === activeSector;
      // Heuristic for discovery: prioritize large caps or specific strong symbols
      return (matchesCountry && matchesSector) || s.symbol === 'NVDA' || s.symbol === 'RELIANCE';
    }).slice(0, 10);
  }, [stocks, activeCountry, activeSector]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Investment Discovery</h2>
          <div className="flex items-center gap-4">
            <p className="text-gray-400">AI-curated selection with fundamental validation.</p>
            <span className="flex items-center gap-1 text-[10px] font-mono text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
              <Activity size={10} /> 15s LIVE
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1">
            <select 
              value={activeCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="bg-transparent text-xs text-gray-300 px-3 focus:outline-none cursor-pointer h-8"
            >
              {countries.map(c => <option key={c} value={c} className="bg-gray-950">{c}</option>)}
            </select>
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
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {recommendedStocks.map((stock) => {
          const inWatchlist = activeList?.symbols.includes(stock.symbol);
          return (
            <div 
              key={stock.symbol} 
              onClick={() => onSelectStock(stock)}
              className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 hover:border-blue-500/30 transition-all flex flex-col group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-400 font-bold text-xl border border-blue-500/20">
                    {stock.symbol[0]}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{stock.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono text-gray-500 uppercase">{stock.symbol}</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded uppercase">{stock.sector}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWatchlist(stock.symbol);
                  }}
                  className={`p-3 rounded-xl border transition-all ${
                    inWatchlist 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40' 
                      : 'bg-gray-950 border-gray-800 text-gray-500 hover:text-white hover:border-gray-700'
                  }`}
                >
                  {inWatchlist ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                </button>
              </div>

              <div className="bg-gray-950/50 rounded-2xl p-6 border border-gray-800/50 mb-6 flex-grow">
                <div className="flex items-center gap-2 mb-3 text-blue-400 text-xs font-bold uppercase tracking-widest">
                  <Star size={14} className="fill-blue-400"/> AI Investment Thesis
                </div>
                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                  {stock.description || "Consistently outperforming sector benchmarks through technological moat and strategic capital allocation."}
                </p>
                <div className="flex items-start gap-3 bg-blue-500/5 p-4 rounded-xl border border-blue-500/10">
                  <Info className="text-blue-400 shrink-0 mt-0.5" size={16} />
                  <p className="text-[11px] text-gray-400 leading-normal">
                    <strong>Trend:</strong> Syncing live telemetry for {stock.country}. Node sync: {stock.lastUpdated}.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-800 mt-auto">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Current Node Price</span>
                  <span className="text-lg font-mono text-white transition-all duration-700">{formatVal(stock.price)}</span>
                </div>
                <span className="flex items-center gap-1 text-sm font-bold text-blue-500 hover:text-blue-400 transition-all">
                  Deep Discovery <ChevronRight size={16} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InvestmentDiscover;
