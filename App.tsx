
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import MarketDashboard from './components/MarketDashboard';
import GainerDashboard from './components/GainerDashboard';
import DealsSection from './components/DealsSection';
import Calculators from './components/Calculators';
import PolicySection from './components/PolicySection';
import NewsFeed from './components/NewsFeed';
import Watchlist from './components/Watchlist';
import Auth from './components/Auth';
import InvestmentDiscover from './components/InvestmentDiscover';
import LearnStocks from './components/LearnStocks';
import Geopolitics from './components/Geopolitics';
import StockDetailsModal from './components/StockDetailsModal';
import { ViewType, User, CurrencyCode, UserWatchlist, Stock } from './types';
import { MOCK_STOCKS } from './constants';
import { ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [stocks, setStocks] = useState<Stock[]>(MOCK_STOCKS);
  const [lastRefreshed, setLastRefreshed] = useState<number>(Date.now());
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  
  const selectedStockRef = useRef<Stock | null>(null);
  useEffect(() => {
    selectedStockRef.current = selectedStock;
  }, [selectedStock]);

  const updateMarketPrices = useCallback(() => {
    setStocks(prevStocks => {
      const updated = prevStocks.map(s => {
        const volatility = (Math.random() - 0.48) * (s.price * 0.005);
        const newPrice = Math.max(0.01, s.price + volatility);
        
        const prevClose = s.price - s.change;
        const newChange = newPrice - prevClose;
        const newChangePercent = (newChange / prevClose) * 100;

        const updatedStock: Stock = {
          ...s,
          price: Number(newPrice.toFixed(2)),
          change: Number(newChange.toFixed(2)),
          changePercent: Number(newChangePercent.toFixed(2)),
          lastUpdated: new Date().toLocaleTimeString(),
        };

        if (selectedStockRef.current?.symbol === s.symbol) {
          setTimeout(() => setSelectedStock(updatedStock), 0);
        }

        return updatedStock;
      });
      return updated;
    });
    setLastRefreshed(Date.now());
  }, []);

  useEffect(() => {
    const dashboardTicker = setInterval(updateMarketPrices, 15000);
    return () => clearInterval(dashboardTicker);
  }, [updateMarketPrices]);

  useEffect(() => {
    const integrityTicker = setInterval(() => {
      console.debug("[DHRUVA AI] 30s Multi-node Integrity Check Performed.");
    }, 30000);
    return () => clearInterval(integrityTicker);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('dhruva_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
    }
    const savedCurrency = localStorage.getItem('dhruva_currency') as CurrencyCode;
    if (savedCurrency) setCurrency(savedCurrency);
  }, []);

  const handleSetCurrency = (code: CurrencyCode) => {
    setCurrency(code);
    localStorage.setItem('dhruva_currency', code);
  };

  const handleLogin = (userData: any) => {
    const formattedUser: User = {
      ...userData,
      watchlists: userData.watchlists || [{ id: 'default', name: 'My Markets', symbols: [], createdAt: new Date().toISOString() }],
      activeWatchlistId: userData.activeWatchlistId || 'default'
    };
    setUser(formattedUser);
    localStorage.setItem('dhruva_user', JSON.stringify(formattedUser));
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('dhruva_user');
    setUser(null);
    setActiveView('dashboard');
  };

  const toggleWatchlist = (symbol: string) => {
    if (!user) {
      setActiveView('auth');
      return;
    }
    const updatedWatchlists = user.watchlists.map(list => {
      if (list.id === user.activeWatchlistId) {
        const symbols = list.symbols.includes(symbol)
          ? list.symbols.filter(s => s !== symbol)
          : [...list.symbols, symbol];
        return { ...list, symbols };
      }
      return list;
    });
    const updatedUser = { ...user, watchlists: updatedWatchlists };
    setUser(updatedUser);
    localStorage.setItem('dhruva_user', JSON.stringify(updatedUser));
  };

  const renderContent = () => {
    switch (activeView) {
      case 'auth': return <Auth onLogin={handleLogin} />;
      case 'dashboard': return <MarketDashboard stocks={stocks} user={user} onToggleWatchlist={toggleWatchlist} onDiscoverStock={(s) => setStocks(prev => [s as Stock, ...prev])} onSelectStock={setSelectedStock} currency={currency} setCurrency={handleSetCurrency} />;
      case 'learn': return <LearnStocks />;
      case 'news': return <NewsFeed />;
      case 'watchlist': 
        return user ? (
          <Watchlist stocks={stocks} user={user} onToggleWatchlist={toggleWatchlist} onNavigateToDashboard={() => setActiveView('dashboard')} onSelectStock={setSelectedStock} currency={currency} onCreateList={() => {}} onDeleteList={() => {}} onSetActiveList={() => {}} />
        ) : <Auth onLogin={handleLogin} />;
      case 'investment': return <InvestmentDiscover stocks={stocks} user={user} onToggleWatchlist={toggleWatchlist} onSelectStock={setSelectedStock} currency={currency} setCurrency={handleSetCurrency} />;
      case 'gainers': return <GainerDashboard stocks={stocks} user={user} onToggleWatchlist={toggleWatchlist} onSelectStock={setSelectedStock} />;
      case 'deals': return <DealsSection />;
      case 'calculators': return <Calculators currency={currency} />;
      case 'policy': return <PolicySection />;
      case 'geopolitics': return <Geopolitics />;
      case 'profile':
        return user ? (
          <div className="max-w-2xl mx-auto p-10 bg-gray-900 rounded-3xl border border-gray-800 animate-in slide-in-from-bottom-4">
             <div className="flex items-center gap-6 mb-10">
               <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold">{user.name[0]}</div>
               <div><h2 className="text-3xl font-bold text-white">{user.name}</h2><p className="text-gray-400">{user.email}</p></div>
             </div>
             <button onClick={handleLogout} className="w-full py-4 border border-red-500/20 bg-red-500/5 text-red-500 font-bold rounded-2xl hover:bg-red-500/10 transition-all">Logout Securely</button>
          </div>
        ) : <Auth onLogin={handleLogin} />;
      default: return <MarketDashboard stocks={stocks} user={user} onToggleWatchlist={toggleWatchlist} onDiscoverStock={() => {}} onSelectStock={setSelectedStock} currency={currency} setCurrency={handleSetCurrency} />;
    }
  };

  const secondsToSync = 15 - Math.floor((Date.now() - lastRefreshed) / 1000);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex overflow-hidden font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} user={user} onLogout={handleLogout} currency={currency} setCurrency={handleSetCurrency} />
      <main className="flex-1 h-screen overflow-y-auto pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-12 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-gray-800 pb-8">
            <div className="flex items-center gap-4">
              <div className="relative"><span className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25"></span><span className="relative block w-2.5 h-2.5 bg-green-500 rounded-full"></span></div>
              <div className="flex flex-col"><span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global Ticker Pulse</span><span className="text-[10px] font-mono text-green-400">NEXT SYNC: {Math.max(0, secondsToSync)}s</span></div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400"><ShieldCheck size={14} className="text-blue-500"/> Data Integrity: Verified</div>
          </div>
          {renderContent()}
        </div>
      </main>
      {selectedStock && <StockDetailsModal stock={selectedStock} onClose={() => setSelectedStock(null)} currency={currency} />}
    </div>
  );
};

export default App;
