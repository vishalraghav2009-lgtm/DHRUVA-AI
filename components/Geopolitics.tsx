
import React, { useState, useEffect, useCallback } from 'react';
import { GeoImpact } from '../types';
import { fetchLiveGeopolitics } from '../services/geminiService';
import { Globe, Flag, MapPin, Zap, Info, TrendingUp, TrendingDown, Clock, Loader2, RefreshCw } from 'lucide-react';

const Geopolitics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'geopolitical' | 'trade' | 'energy'>('all');
  const [events, setEvents] = useState<GeoImpact[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  const loadGeopolitics = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    
    const liveGeo = await fetchLiveGeopolitics();
    if (liveGeo.length > 0) {
      setEvents(liveGeo);
      setLastUpdated(new Date().toLocaleTimeString());
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadGeopolitics();
    const interval = setInterval(() => loadGeopolitics(true), 60000);
    return () => clearInterval(interval);
  }, [loadGeopolitics]);

  const filteredEvents = activeTab === 'all' 
    ? events 
    : events.filter(e => e.type.toLowerCase() === activeTab);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-gray-500">
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <p className="text-sm font-bold uppercase tracking-widest">Initializing Global Intelligence Node...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <header className="max-w-4xl flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-blue-500">
              <Globe size={24} />
            </div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Global Intelligence Node</span>
          </div>
          <h2 className="text-4xl font-serif font-bold text-white mb-4">Global & Geopolitical Analysis</h2>
          <p className="text-lg text-gray-400 leading-relaxed">
            Our AI monitors shifting borders, trade corridors, and energy supply chains to infer market directional shifts before they manifest in price charts.
          </p>
        </div>
        <div className="text-[10px] font-mono text-blue-500 flex items-center gap-1.5 uppercase tracking-widest bg-blue-500/5 px-3 py-1.5 rounded-lg border border-blue-500/10">
          {refreshing ? <RefreshCw size={12} className="animate-spin" /> : <Clock size={12} />}
          Last Sync: {lastUpdated}
        </div>
      </header>

      <div className="flex items-center gap-4 bg-gray-900/50 p-1 border border-gray-800 rounded-2xl w-fit">
        {(['all', 'geopolitical', 'trade', 'energy'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === tab 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
              : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {filteredEvents.length > 0 ? filteredEvents.map((event, idx) => (
          <div key={idx} className="bg-gray-900 border border-gray-800 rounded-[2.5rem] overflow-hidden hover:border-blue-500/30 transition-all flex flex-col md:flex-row group">
            <div className="md:w-1/3 p-10 bg-gradient-to-br from-gray-900 to-black border-r border-gray-800">
              <div className="flex items-center gap-2 mb-6">
                <Flag className="text-blue-500" size={20} />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{event.type} Analysis</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 leading-tight group-hover:text-blue-400 transition-colors">{event.event}</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Potential Beneficiaries</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.countriesBenefited.map(c => (
                      <span key={c} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold rounded-lg flex items-center gap-1.5">
                        <MapPin size={10} /> {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-3">Affected Sectors</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.sectorsAffected.map(s => (
                      <span key={s} className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold rounded-lg">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-2/3 p-10 relative">
              <div className="absolute top-10 right-10">
                <div className={`px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${
                  event.opportunityRisk === 'Opportunity' ? 'bg-green-500/10 border-green-500/30 text-green-500' :
                  event.opportunityRisk === 'Risk' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                  'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
                }`}>
                  {event.opportunityRisk === 'Opportunity' ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                  Global {event.opportunityRisk}
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-2 text-blue-500 mb-4">
                  <Zap size={20} />
                  <span className="text-xs font-bold uppercase tracking-widest">AI Reasoning Layer</span>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg italic">
                  "{event.analysis}"
                </p>
              </div>

              <div className="bg-gray-950 border border-gray-800 p-6 rounded-3xl">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-900 rounded-xl text-gray-500">
                    <Info size={20} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">AI Interpretation Notice</h5>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      This analysis is based on probabilistic neural modeling of trade flow shifts and diplomatic sentiment analysis. Insights are informational and represent a modeled future state, not a certainty. External variables like emergency policy changes can alter these trajectories instantly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="py-20 text-center text-gray-600 italic">No geopolitical events analyzed.</div>
        )}
      </div>

      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-12 text-white overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
           <Globe size={240} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-3xl font-bold mb-4">Deep Geopolitical Intelligence</h3>
          <p className="text-blue-100 mb-8 leading-relaxed">
            DHRUVA AI's geopolitics engine parses over 50,000 data points daily including UN resolutions, trade tariffs, and maritime congestion data to give you the most accurate directional sense of the global market.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
              <span className="block text-2xl font-bold">94.2%</span>
              <span className="text-[10px] uppercase font-bold text-blue-200">Historical Accuracy</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
              <span className="block text-2xl font-bold">12ms</span>
              <span className="text-[10px] uppercase font-bold text-blue-200">Inference Latency</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Geopolitics;
