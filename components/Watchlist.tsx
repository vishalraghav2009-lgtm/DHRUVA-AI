
import React, { useState, useMemo } from 'react';
import { 
  Bookmark, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Plus, 
  X, 
  Trash2, 
  PlusCircle,
  Filter,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react';
import { CURRENCIES } from '../constants';
import { User, Stock, CurrencyCode } from '../types';

interface StockRowProps {
  stock: Stock;
  user: User | null;
  onToggleWatchlist: (symbol: string) => void;
  onSelectStock: (stock: Stock) => void;
  formatVal: (val: number) => string;
}

const StockRow: React.FC<StockRowProps> = ({ stock, user, onToggleWatchlist, onSelectStock, formatVal }) => {
  const activeList = user?.watchlists.find(l => l.id === user.activeWatchlistId);
  const isSaved = activeList?.symbols.includes(stock.symbol);

  return (
    <div 
      onClick={() => onSelectStock(stock)}
      className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 md:p-6 group hover:border-blue-500/30 transition-all animate-in fade-in duration-300 cursor-pointer"
    >
      <div className="md:grid md:grid-cols-12 md:items-center gap-4">
        <div className="col-span-4 flex items-center gap-4 mb-4 md:mb-0">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
            {stock.symbol[0]}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-white flex items-center gap-2 truncate">
              {stock.symbol}
              <span className="text-[9px] px-1.5 py-0.5 bg-gray-800 text-gray-500 rounded uppercase hidden sm:inline-block">{stock.sector}</span>
            </div>
            <div className="text-xs text-gray-500 truncate">{stock.name}</div>
          </div>
        </div>

        <div className="col-span-2 mb-2 md:mb-0">
          <span className="text-[10px] text-gray-500 md:hidden block mb-1 uppercase tracking-widest font-bold">Price</span>
          <span className="font-mono text-white text-sm md:text-base">{formatVal(stock.price)}</span>
        </div>

        <div className="col-span-2 mb-2 md:mb-0">
          <span className="text-[10px] text-gray-500 md:hidden block mb-1 uppercase tracking-widest font-bold">Change</span>
          <div className={`flex items-center gap-1 font-semibold text-sm transition-colors duration-500 ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {stock.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {stock.changePercent.toFixed(2)}%
          </div>
        </div>

        <div className="col-span-2 mb-4 md:mb-0">
          <span className="text-[10px] text-gray-500 md:hidden block mb-1 uppercase tracking-widest font-bold">Status</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-block ${stock.marketStatus === 'Open' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            {stock.marketStatus}
          </span>
        </div>

        <div className="col-span-2 text-right flex items-center justify-end gap-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(stock.symbol);
            }}
            className={`p-2 rounded-lg transition-all ${
              isSaved 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
              : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
            title={isSaved ? "Remove from List" : "Add to Active List"}
          >
            {isSaved ? <Bookmark size={16} fill="currentColor" /> : <Plus size={16} />}
          </button>
          <span className="text-[10px] bg-gray-800 group-hover:bg-blue-600/20 group-hover:text-blue-400 text-gray-300 px-3 py-2 rounded-lg font-bold transition-all">Details</span>
        </div>
      </div>
    </div>
  );
};

interface WatchlistProps {
  stocks: Stock[];
  user: User | null;
  onToggleWatchlist: (symbol: string) => void;
  onNavigateToDashboard: () => void;
  onSelectStock: (stock: Stock) => void;
  currency: CurrencyCode;
  onCreateList: (name: string) => void;
  onDeleteList: (id: string) => void;
  onSetActiveList: (id: string) => void;
}

const Watchlist: React.FC<WatchlistProps> = ({ 
  stocks,
  user, 
  onToggleWatchlist, 
  onNavigateToDashboard, 
  onSelectStock,
  currency,
  onCreateList,
  onDeleteList,
  onSetActiveList
}) => {
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [isCreating, setIsCreating] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [viewMode, setViewMode] = useState<'custom' | 'benchmark'>('custom');
  const [benchmarkType, setBenchmarkType] = useState<'country' | 'world'>('country');

  const cur = CURRENCIES[currency];

  const activeWatchlist = useMemo(() => 
    user?.watchlists.find(l => l.id === user.activeWatchlistId),
    [user?.watchlists, user?.activeWatchlistId]
  );

  const activeStocks = useMemo((): Stock[] => {
    let listStocks: Stock[] = [];
    if (viewMode === 'benchmark') {
      listStocks = benchmarkType === 'country' 
        ? stocks.filter(s => s.country === 'India').slice(0, 40)
        : stocks.filter(s => s.country !== 'India').slice(0, 40);
    } else if (activeWatchlist) {
      listStocks = stocks.filter(s => activeWatchlist.symbols.includes(s.symbol));
    }

    if (internalSearchQuery.trim()) {
      const q = internalSearchQuery.toLowerCase();
      listStocks = listStocks.filter(s => 
        s.symbol.toLowerCase().includes(q) || 
        s.name.toLowerCase().includes(q)
      );
    }

    if (sortOrder !== 'none') {
      listStocks = [...listStocks].sort((a, b) => {
        return sortOrder === 'asc' 
          ? a.changePercent - b.changePercent 
          : b.changePercent - a.changePercent;
      });
    }
    
    return listStocks;
  }, [viewMode, benchmarkType, activeWatchlist, internalSearchQuery, sortOrder, stocks]);

  const formatVal = (val: number) => {
    const converted = val * cur.rate;
    return `${cur.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListTitle.trim()) {
      onCreateList(newListTitle.trim());
      setNewListTitle('');
      setIsCreating(false);
    }
  };

  const searchResults = useMemo(() => {
    return globalSearchQuery.length > 0 
      ? stocks.filter(s => 
          (s.symbol.toLowerCase().includes(globalSearchQuery.toLowerCase()) || 
           s.name.toLowerCase().includes(globalSearchQuery.toLowerCase())) &&
          !activeWatchlist?.symbols.includes(s.symbol)
        ).slice(0, 5)
      : [];
  }, [globalSearchQuery, stocks, activeWatchlist]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col xl:flex-row xl:items-start justify-between gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold text-white">My Watchlist</h2>
            <div className="px-2 py-1 bg-blue-600/10 border border-blue-500/20 rounded-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                <Activity size={12} /> Live Sync Active
              </span>
            </div>
          </div>
          <p className="text-gray-400 max-w-2xl leading-relaxed">
            Monitor selected financial data with 15s real-time accuracy. Toggle between private market nodes and global pulse benchmarks.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto z-40">
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-900/40 border border-blue-500/20"
          >
            <PlusCircle size={18} /> 
            <span>Create New List</span>
          </button>

          <div className="relative flex-grow xl:w-80">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text"
                placeholder="Track new assets..."
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all shadow-xl"
              />
              {globalSearchQuery && (
                <button onClick={() => setGlobalSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  <X size={14} />
                </button>
              )}
            </div>

            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 z-50">
                {searchResults.map(stock => (
                  <button
                    key={stock.symbol}
                    onClick={() => {
                      onToggleWatchlist(stock.symbol);
                      setGlobalSearchQuery('');
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-900 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-[10px] font-bold text-blue-400 border border-blue-500/20">
                        {stock.symbol[0]}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-blue-400">{stock.symbol}</div>
                        <div className="text-[10px] text-gray-500">{stock.name}</div>
                      </div>
                    </div>
                    <Plus size={14} className="text-gray-600 group-hover:text-blue-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Watchlist Navigation Bar */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-gray-800 pb-2 overflow-x-auto no-scrollbar gap-8">
          <div className="flex gap-8">
            <button 
              onClick={() => setViewMode('custom')}
              className={`pb-4 px-1 text-sm font-bold transition-all relative ${viewMode === 'custom' ? 'text-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Private Collections
              {viewMode === 'custom' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => {
                setViewMode('benchmark');
                setBenchmarkType('country');
              }}
              className={`pb-4 px-1 text-sm font-bold transition-all relative ${viewMode === 'benchmark' && benchmarkType === 'country' ? 'text-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
            >
              India Benchmark
              {viewMode === 'benchmark' && benchmarkType === 'country' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => {
                setViewMode('benchmark');
                setBenchmarkType('world');
              }}
              className={`pb-4 px-1 text-sm font-bold transition-all relative ${viewMode === 'benchmark' && benchmarkType === 'world' ? 'text-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Global Pulse
              {viewMode === 'benchmark' && benchmarkType === 'world' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full"></div>}
            </button>
          </div>
        </div>

        {viewMode === 'custom' && (
          <div className="flex flex-wrap gap-3">
            {user?.watchlists.map(list => (
              <div 
                key={list.id} 
                className={`group flex items-center gap-3 px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                  user.activeWatchlistId === list.id 
                  ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-900/20' 
                  : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-700'
                }`}
                onClick={() => onSetActiveList(list.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold">{list.name}</span>
                  <span className={`text-[9px] font-mono px-1 rounded ${
                    user.activeWatchlistId === list.id ? 'bg-blue-700 text-blue-100' : 'bg-gray-800 text-gray-400'
                  }`}>
                    {list.symbols.length}
                  </span>
                </div>
                {user.watchlists.length > 1 && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteList(list.id);
                    }}
                    className={`p-1 rounded hover:bg-black/20 opacity-0 group-hover:opacity-100 transition-all ${
                      user.activeWatchlistId === list.id ? 'text-blue-200' : 'text-red-400'
                    }`}
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
            <button 
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-700 text-gray-500 hover:text-blue-400 hover:border-blue-500/50 transition-all text-xs font-bold"
            >
              <Plus size={14} /> New List
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-900/30 p-4 rounded-2xl border border-gray-800/50">
        <div className="relative w-full sm:w-64">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
          <input 
            type="text"
            placeholder="Filter nodes..."
            value={internalSearchQuery}
            onChange={(e) => setInternalSearchQuery(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-all"
          />
          {internalSearchQuery && (
            <button onClick={() => setInternalSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
              <X size={12} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sort By % Change:</span>
          <div className="flex bg-gray-950 border border-gray-800 rounded-xl p-1">
            <button 
              onClick={() => setSortOrder('none')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${sortOrder === 'none' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Default
            </button>
            <button 
              onClick={() => setSortOrder('asc')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all ${sortOrder === 'asc' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <ArrowUp size={12} /> Asc
            </button>
            <button 
              onClick={() => setSortOrder('desc')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all ${sortOrder === 'desc' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <ArrowDown size={12} /> Desc
            </button>
          </div>
        </div>
      </div>

      {isCreating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-gray-900 border border-gray-800 w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <PlusCircle className="text-blue-500" /> Initialize New Market List
            </h3>
            <form onSubmit={handleCreateList} className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Watchlist Designation</label>
                <input 
                  autoFocus
                  type="text"
                  required
                  placeholder="e.g., Tech High-Growth Nodes"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 text-white focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="flex-1 py-4 border border-gray-800 text-gray-400 font-bold rounded-2xl hover:bg-gray-800 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/30"
                >
                  Create List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest pb-4 border-b border-gray-800">
          <div className="col-span-4">Equity / Sector</div>
          <div className="col-span-2">Market Price</div>
          <div className="col-span-2">24H Change</div>
          <div className="col-span-2">Market Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        
        {activeStocks && activeStocks.length > 0 ? (
          <div className="space-y-4 max-h-[1200px] overflow-y-auto pr-2 no-scrollbar">
            {activeStocks.map((stock) => (
              <StockRow 
                key={stock.symbol} 
                stock={stock} 
                user={user} 
                onToggleWatchlist={onToggleWatchlist} 
                onSelectStock={onSelectStock}
                formatVal={formatVal}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-gray-900/20 border border-dashed border-gray-800 rounded-3xl animate-in zoom-in-95">
            <Bookmark size={48} className="mx-auto mb-4 opacity-10" />
            <h3 className="text-xl font-bold text-gray-300 mb-2">
              No Data Synced
            </h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              {viewMode === 'custom' 
                ? (internalSearchQuery ? `No assets in "${activeWatchlist?.name}" match your filter.` : `The "${activeWatchlist?.name}" list is currently empty.`)
                : 'Connecting to real-time nodes for this benchmark.'}
            </p>
            {viewMode === 'custom' && !internalSearchQuery && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => setIsCreating(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/30"
                >
                  <PlusCircle size={18} /> Create Your First List
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
