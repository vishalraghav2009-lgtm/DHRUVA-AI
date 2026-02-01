
import React, { useState, useEffect, useMemo } from 'react';
import { Newspaper, Globe, Filter, ExternalLink, Clock, Zap, Loader2, Sparkles, TrendingUp, Home, CheckCircle2 } from 'lucide-react';
import { MOCK_NEWS } from '../constants';
import { NewsItem } from '../types';
import { synthesizeMarketPulse } from '../services/geminiService';

const NewsFeed: React.FC = () => {
  const [filter, setFilter] = useState<{ country: string; sector: string }>({ country: 'All', sector: 'All' });
  const [defaultCountry, setDefaultCountry] = useState<string>(() => {
    return localStorage.getItem('dhruva_news_default') || 'USA';
  });
  const [news] = useState<NewsItem[]>(MOCK_NEWS);
  const [marketPulse, setMarketPulse] = useState<string | null>(null);
  const [loadingPulse, setLoadingPulse] = useState(true);

  const countries = ['All', 'USA', 'India', 'UK', 'China', 'Japan'];
  const sectors = ['All', 'Macro', 'Technology', 'Finance', 'Energy', 'Healthcare', 'Markets'];

  useEffect(() => {
    const fetchPulse = async () => {
      setLoadingPulse(true);
      const pulse = await synthesizeMarketPulse(news);
      setMarketPulse(pulse);
      setLoadingPulse(false);
    };
    fetchPulse();
  }, [news]);

  const handleSetDefaultCountry = (c: string) => {
    if (c === 'All') return;
    setDefaultCountry(c);
    localStorage.setItem('dhruva_news_default', c);
  };

  const prioritizedNews = useMemo(() => {
    // 1. First apply sector filtering
    const sectorFiltered = news.filter(item => filter.sector === 'All' || item.category === filter.sector);
    
    // 2. Determine target country for prioritization
    // If user explicitly chose a region, prioritize that region.
    // If user chose 'All', prioritize their default home country.
    const priorityTarget = filter.country !== 'All' ? filter.country : defaultCountry;

    const priorityItems = sectorFiltered.filter(item => item.country === priorityTarget);
    const globalItems = sectorFiltered.filter(item => item.country !== priorityTarget);

    // Prompt logic: Prioritize target country, but backfill if fewer than a certain number (let's say 4).
    // We'll show all priority items first, then global items.
    // To ensure the feed is always "full", we always append the global items.
    return [...priorityItems, ...globalItems];
  }, [news, filter, defaultCountry]);

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'macro': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'technology': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'finance': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'markets': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Live News Node</span>
          </div>
          <h2 className="text-4xl font-serif font-bold text-white mb-2">Financial Intelligence</h2>
          <p className="text-gray-400 text-lg">Synthesizing global market narratives into actionable insights.</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex bg-gray-900 border border-gray-800 rounded-2xl p-1 shadow-xl relative group/region">
            <div className="px-4 py-2 flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase border-r border-gray-800">
              <Globe size={14} /> Region
            </div>
            <select 
              value={filter.country}
              onChange={(e) => setFilter({ ...filter, country: e.target.value })}
              className="bg-transparent text-xs text-gray-300 px-4 focus:outline-none cursor-pointer font-bold pr-10"
            >
              {countries.map(c => <option key={c} value={c} className="bg-gray-950">{c}</option>)}
            </select>
            
            {filter.country !== 'All' && (
              <button 
                onClick={() => handleSetDefaultCountry(filter.country)}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${
                  defaultCountry === filter.country 
                  ? 'text-blue-500 bg-blue-500/10' 
                  : 'text-gray-600 hover:text-gray-300 bg-gray-800/50'
                }`}
                title={defaultCountry === filter.country ? "Primary Home Region" : "Set as Home Region"}
              >
                {defaultCountry === filter.country ? <Home size={14} className="fill-blue-500" /> : <Home size={14} />}
              </button>
            )}
          </div>

          <div className="flex bg-gray-900 border border-gray-800 rounded-2xl p-1 shadow-xl">
            <div className="px-4 py-2 flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase border-r border-gray-800">
              <Filter size={14} /> Sector
            </div>
            <select 
              value={filter.sector}
              onChange={(e) => setFilter({ ...filter, sector: e.target.value })}
              className="bg-transparent text-xs text-gray-300 px-4 focus:outline-none cursor-pointer font-bold"
            >
              {sectors.map(s => <option key={s} value={s} className="bg-gray-950">{s}</option>)}
            </select>
          </div>
        </div>
      </header>

      {/* AI Market Pulse Section */}
      <section className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative bg-gray-900/80 border border-gray-800 rounded-[2.5rem] p-10 backdrop-blur-xl flex flex-col md:flex-row items-center gap-10">
          <div className="shrink-0">
             <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-900/40 relative">
               <Sparkles className="text-white" size={32} />
               <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-4 border-gray-900 rounded-full"></div>
             </div>
          </div>
          <div className="flex-1 space-y-4">
             <div className="flex items-center gap-3">
               <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20 flex items-center gap-1.5">
                 <Zap size={10} className="fill-blue-400" /> Dhruva AI Pulse
               </span>
               <span className="text-[10px] text-gray-600 uppercase font-mono">Last Computed: Today, 09:30 AM</span>
             </div>
             {loadingPulse ? (
               <div className="flex items-center gap-3 text-gray-500 font-medium italic">
                 <Loader2 className="animate-spin" size={18} />
                 Parsing global headlines for executive summary...
               </div>
             ) : (
               <h3 className="text-2xl font-serif text-white leading-relaxed italic">
                 "{marketPulse}"
               </h3>
             )}
          </div>
          <div className="shrink-0 flex items-center gap-2 text-blue-500 font-bold text-sm bg-blue-500/5 px-6 py-3 rounded-2xl border border-blue-500/10">
             <TrendingUp size={16} /> Bullish Sentiment
          </div>
        </div>
      </section>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {prioritizedNews.length > 0 ? (
          prioritizedNews.map((item, idx) => {
            const isPriority = item.country === (filter.country !== 'All' ? filter.country : defaultCountry);
            return (
              <div 
                key={item.id} 
                className={`group relative bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:border-gray-600 transition-all duration-300 flex flex-col h-full ${
                  idx === 0 && isPriority ? 'md:col-span-2 bg-gradient-to-br from-gray-900 to-black' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 border rounded text-[10px] font-bold uppercase ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                    {isPriority && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase rounded">
                        <CheckCircle2 size={10} /> Priority Feed
                      </span>
                    )}
                    <span className="text-[10px] text-gray-500 flex items-center gap-1 font-mono uppercase tracking-tighter">
                      <Clock size={12}/> {item.time}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{item.source}</div>
                </div>
                
                <h3 className={`font-bold text-white mb-4 group-hover:text-blue-400 transition-colors leading-tight ${
                  idx === 0 && isPriority ? 'text-3xl' : 'text-xl'
                }`}>
                  {item.headline}
                </h3>
                
                <p className={`text-gray-400 mb-8 flex-grow leading-relaxed ${
                  idx === 0 && isPriority ? 'text-base' : 'text-sm'
                }`}>
                  {item.snippet}
                </p>
                
                <div className="flex items-center justify-between pt-6 border-t border-gray-800 mt-auto">
                  <div className="flex items-center gap-2">
                     <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold ${
                       isPriority ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-500'
                     }`}>
                       {item.country[0]}
                     </div>
                     <span className={`text-[10px] font-bold uppercase tracking-widest ${isPriority ? 'text-blue-400' : 'text-gray-500'}`}>
                       {item.country}
                     </span>
                  </div>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-blue-500 hover:text-white hover:bg-blue-600 transition-all font-bold shadow-lg"
                  >
                    Deep Read <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-32 text-center text-gray-500 bg-gray-900/30 border border-dashed border-gray-800 rounded-[3rem]">
            <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Newspaper size={32} className="opacity-20" />
            </div>
            <h4 className="text-xl font-bold text-gray-300">Quiet in this Corridor</h4>
            <p className="max-w-xs mx-auto mt-2">No intelligence matching these coordinates is available currently.</p>
            <button 
              onClick={() => setFilter({ country: 'All', sector: 'All' })}
              className="mt-6 text-blue-500 hover:underline text-sm font-bold"
            >
              Clear Filtering
            </button>
          </div>
        )}
      </div>

      <footer className="text-center py-10">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-950 border border-gray-800 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">
           Powered by Gemini 3 Flash Intelligence & Institutional Feeds
        </div>
      </footer>
    </div>
  );
};

export default NewsFeed;
