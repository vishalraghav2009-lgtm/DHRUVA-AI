
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { 
  X, TrendingUp, TrendingDown, Clock, Activity, ShieldCheck, Globe, Info, Newspaper, ExternalLink, 
  Briefcase, UserCircle, LayoutGrid, Loader2, Sparkles, Building2, PieChart 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Stock, CurrencyCode } from '../types';
import { CURRENCIES, MOCK_NEWS } from '../constants';
import { fetchStockIntelligence } from '../services/geminiService';

interface StockDetailsModalProps {
  stock: Stock;
  onClose: () => void;
  currency: CurrencyCode;
}

const StockDetailsModal: React.FC<StockDetailsModalProps> = ({ stock, onClose, currency }) => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1W');
  const [extendedInfo, setExtendedInfo] = useState<Partial<Stock> | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [lastAIUpdate, setLastAIUpdate] = useState<string>(new Date().toLocaleTimeString());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const cur = CURRENCIES[currency];

  const formatVal = (val: number) => {
    const converted = val * cur.rate;
    return `${cur.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const enrichData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoadingAI(true);
    else setIsRefreshing(true);
    try {
      const aiData = await fetchStockIntelligence(stock.symbol);
      if (aiData) {
        setExtendedInfo(aiData);
        setLastAIUpdate(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error("DHRUVA AI: Enrichment sequence interrupted", err);
    } finally {
      setLoadingAI(false);
      setIsRefreshing(false);
    }
  }, [stock.symbol]);

  useEffect(() => {
    enrichData();
    const enrichmentTicker = setInterval(() => enrichData(true), 30000);
    return () => clearInterval(enrichmentTicker);
  }, [enrichData]);

  const relevantNews = useMemo(() => {
    const filtered = MOCK_NEWS.filter(item => 
      item.headline.toLowerCase().includes(stock.name.toLowerCase()) || 
      item.headline.toLowerCase().includes(stock.symbol.toLowerCase()) ||
      item.snippet.toLowerCase().includes(stock.name.toLowerCase()) ||
      item.snippet.toLowerCase().includes(stock.symbol.toLowerCase())
    );
    return filtered.length > 0 ? filtered : MOCK_NEWS.filter(item => item.category === stock.sector).slice(0, 5);
  }, [stock]);

  const chartData = useMemo(() => {
    const points = timeframe === '1D' ? 24 : timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : 12;
    const data = [];
    const seed = stock.symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    let currentVal = stock.price * 0.95; 
    for (let i = 0; i < points; i++) {
      const randomFactor = Math.sin(seed + i) * 0.02 + (Math.random() - 0.5) * 0.01;
      currentVal = currentVal * (1 + randomFactor);
      const date = new Date();
      if (timeframe === '1D') date.setHours(date.getHours() - (points - i));
      else if (timeframe === '1W') date.setDate(date.getDate() - (points - i));
      else if (timeframe === '1M') date.setDate(date.getDate() - (points - i));
      else date.setMonth(date.getMonth() - (points - i));
      data.push({
        time: timeframe === '1D' ? `${date.getHours()}:00` : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        price: Number(currentVal.toFixed(2)),
      });
    }
    data[data.length - 1].price = stock.price;
    return data;
  }, [stock, timeframe]);

  const isPositive = stock.change >= 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-lg animate-in fade-in duration-300">
      <div className="bg-gray-950 border border-gray-800 w-full max-w-6xl max-h-[95vh] rounded-[3rem] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
        <div className="p-8 border-b border-gray-800 flex items-start justify-between bg-gradient-to-r from-gray-900/50 to-transparent">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2.5 py-1 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5"><ShieldCheck size={12} /> {stock.exchange} Node</span>
              <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1"><Clock size={12} /> Sync: {stock.lastUpdated}</span>
              <span className={`text-[10px] font-mono flex items-center gap-1 ${isRefreshing ? 'text-blue-400 animate-pulse' : 'text-indigo-500'}`}>{isRefreshing ? <Loader2 size={12} className="animate-spin" /> : <Activity size={12} />} AI Heartbeat: {lastAIUpdate}</span>
            </div>
            <h2 className="text-4xl font-bold text-white flex flex-wrap items-center gap-x-4">
              {extendedInfo?.name || stock.name}
              <span className="text-2xl font-mono text-gray-500 font-light tracking-tighter">({stock.symbol})</span>
              {loadingAI && <Loader2 size={24} className="animate-spin text-blue-500 ml-2" />}
            </h2>
          </div>
          <button onClick={onClose} className="p-4 bg-gray-900 border border-gray-800 rounded-[1.5rem] text-gray-400 hover:text-white transition-all shadow-xl"><X size={28} /></button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-10">
              <section>
                <div className="flex flex-wrap items-baseline gap-6 mb-6">
                  <span className="text-7xl font-bold text-white tracking-tighter tabular-nums">{formatVal(stock.price)}</span>
                  <div className={`flex items-center gap-1.5 font-bold text-2xl ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? <TrendingUp size={28} /> : <TrendingDown size={28} />}
                    {formatVal(Math.abs(stock.change))} ({stock.changePercent}%)
                  </div>
                </div>
                <div className="flex gap-1.5 bg-gray-900/50 p-1.5 rounded-2xl border border-gray-800 w-fit mb-8 shadow-inner">
                  {(['1D', '1W', '1M', '1Y'] as const).map(t => (
                    <button key={t} onClick={() => setTimeframe(t)} className={`px-7 py-2.5 rounded-xl text-xs font-bold transition-all ${timeframe === t ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-gray-500 hover:text-gray-300'}`}>{t}</button>
                  ))}
                </div>
                <div className="h-[400px] w-full bg-gray-900/30 rounded-[3rem] border border-gray-800 p-8 relative overflow-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs><linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.3}/><stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} strokeOpacity={0.5} />
                      <XAxis dataKey="time" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
                      <YAxis hide domain={['auto', 'auto']} />
                      <Tooltip contentStyle={{ backgroundColor: '#030712', border: '1px solid #1f2937', borderRadius: '1.5rem' }} labelStyle={{ color: '#9ca3af', fontSize: '10px' }} formatter={(val: number) => [formatVal(val), 'Price Target']} />
                      <Area type="monotone" dataKey="price" stroke={isPositive ? "#10b981" : "#ef4444"} strokeWidth={5} fillOpacity={1} fill="url(#colorPrice)" animationDuration={1000} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="bg-gray-900/50 border border-gray-800 rounded-[3rem] p-10 space-y-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000 pointer-events-none"><Sparkles size={160} className="text-blue-500" /></div>
                <div><h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2"><Sparkles size={16} className="text-blue-500 animate-pulse" /> Business Intelligence Summary</h4><p className="text-xl text-gray-200 font-light italic leading-relaxed">{extendedInfo?.description || stock.description || "Synthesizing real-time corporate narrative..."}</p></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-gray-800">
                  <div className="space-y-6"><h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] flex items-center gap-2"><UserCircle size={14} className="text-blue-500" /> Executive Leadership</h5><div className="flex items-center gap-5 bg-gray-950 p-6 rounded-[2rem] border border-gray-800"><div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white"><UserCircle size={28} /></div><div><p className="text-lg font-bold text-white">{extendedInfo?.ceo || "Processing..."}</p><p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Chief Executive Officer</p></div></div></div>
                  <div className="space-y-6"><h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] flex items-center gap-2"><LayoutGrid size={14} className="text-blue-500" /> Key Investments / Subsidiaries</h5><div className="flex flex-wrap gap-3">{(extendedInfo?.subsidiaries || ['Initializing...', 'Verifying investments...']).map((sub, i) => (<div key={i} className="px-5 py-3 bg-gray-950 border border-gray-800 text-gray-300 text-xs font-bold rounded-2xl flex items-center gap-2.5"><Building2 size={14} className="text-blue-500" /> {sub}</div>))}</div></div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2"><PieChart size={14} className="text-blue-500" /> Alpha Performance Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5"><p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Market Cap</p><p className="text-lg font-bold text-white tabular-nums">{stock.marketCap}</p></div>
                  <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5"><p className="text-[10px] text-gray-500 uppercase font-bold mb-1">High (24h)</p><p className="text-lg font-mono text-green-400 tabular-nums">{formatVal(stock.high)}</p></div>
                  <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5"><p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Low (24h)</p><p className="text-lg font-mono text-red-400 tabular-nums">{formatVal(stock.low)}</p></div>
                  <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5"><p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Volume</p><p className="text-lg font-bold text-white tabular-nums">{stock.volume}</p></div>
                </div>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-[2.5rem] p-8 flex flex-col min-h-[450px] max-h-[600px] shadow-2xl">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2 sticky top-0 bg-inherit z-10 py-1"><Newspaper size={16} className="text-blue-500" /> Global Intelligence Stream</h4>
                <div className="space-y-8 overflow-y-auto pr-3 no-scrollbar flex-grow">
                  {relevantNews.length > 0 ? relevantNews.map(item => (
                    <div key={item.id} className="group/item border-b border-gray-800/30 pb-8 last:border-0 last:pb-0 animate-in fade-in duration-500">
                      <h5 className="text-base font-bold text-white mb-4 leading-snug group-hover/item:text-blue-400 transition-colors">{item.headline}</h5>
                      <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-tight"><span className="flex items-center gap-1.5 opacity-60"><Clock size={12}/> {item.source} • {item.time}</span><a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 flex items-center gap-1 transition-all hover:translate-x-1">Deep Analysis <ExternalLink size={10} /></a></div>
                    </div>
                  )) : <div className="flex flex-col items-center justify-center h-full opacity-30"><Newspaper size={48} className="mb-6" /><p className="text-xs uppercase font-bold">Scanning Global Archives...</p></div>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-gray-900/40 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.6)]"></div><span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Secure Data Channel Active</span></div></div>
          <div className="flex items-center gap-5 w-full sm:w-auto"><button className="flex-1 sm:flex-none px-10 py-4 border border-gray-800 text-gray-400 font-bold rounded-2xl" onClick={onClose}>Dismiss Terminal</button><button className="flex-1 sm:flex-none px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-2xl flex items-center justify-center gap-3 group" onClick={() => window.alert('Order execution protocol initializing...')}> <Briefcase size={20} className="group-hover:scale-110 transition-transform" /> Execute Position</button></div>
        </div>
      </div>
    </div>
  );
};

export default StockDetailsModal;
