
import React, { useState, useEffect, useCallback } from 'react';
import { CorporateDeal } from '../types';
import { fetchLiveDeals } from '../services/geminiService';
import { Briefcase, TrendingUp, AlertTriangle, Clock, Loader2, RefreshCw } from 'lucide-react';

const DealsSection: React.FC = () => {
  const [deals, setDeals] = useState<CorporateDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  const loadDeals = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    
    const liveDeals = await fetchLiveDeals();
    if (liveDeals.length > 0) {
      setDeals(liveDeals);
      setLastUpdated(new Date().toLocaleTimeString());
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadDeals();
    const interval = setInterval(() => loadDeals(true), 60000);
    return () => clearInterval(interval);
  }, [loadDeals]);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-gray-500">
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <p className="text-sm font-bold uppercase tracking-widest">Fetching Institutional Deal Flow...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Business Deals & Corporate Actions</h2>
          <p className="text-gray-400">Strategic analysis of M&As, partnerships, and demergers.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-[10px] font-mono text-indigo-500 flex items-center gap-1.5 uppercase tracking-widest bg-indigo-500/5 px-3 py-1.5 rounded-lg border border-indigo-500/10">
            {refreshing ? <RefreshCw size={12} className="animate-spin" /> : <Clock size={12} />}
            Last Sync: {lastUpdated}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {deals.length > 0 ? deals.map((deal) => (
          <div key={deal.id} className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden hover:border-gray-700 transition-all group">
            <div className={`p-1 w-full bg-gradient-to-r ${deal.impact === 'Positive' ? 'from-green-600 to-emerald-600' : deal.impact === 'Risky' ? 'from-red-600 to-orange-600' : 'from-blue-600 to-indigo-600'}`}></div>
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {deal.type}
                    </span>
                    <span className="text-xs text-gray-500">{deal.sector}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {deal.companies.join(' & ')}
                  </h3>
                  
                  {deal.size && (
                    <p className="text-lg font-mono text-blue-400 mb-6">Valuation: {deal.size}</p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Short-Term Reaction</h4>
                      <p className="text-sm text-gray-300">{deal.shortTermReaction}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Long-Term Growth</h4>
                      <p className="text-sm text-gray-300">{deal.longTermImplication}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-gray-500 mr-2 flex items-center gap-1"><TrendingUp size={14}/> Affected:</span>
                    {deal.affectedStocks.map(s => (
                      <span key={s} className="px-2 py-1 bg-gray-950 border border-gray-800 rounded text-[10px] font-mono text-gray-400">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="md:w-80 space-y-6">
                  <div className={`p-6 rounded-2xl border ${
                    deal.impact === 'Positive' ? 'bg-green-500/5 border-green-500/20' : 
                    deal.impact === 'Risky' ? 'bg-red-500/5 border-red-500/20' : 
                    'bg-gray-800/50 border-gray-700'
                  }`}>
                    <div className="flex items-center gap-2 mb-4">
                      {deal.impact === 'Positive' ? <TrendingUp className="text-green-500" /> : <AlertTriangle className="text-red-500" />}
                      <span className={`font-bold uppercase tracking-widest text-xs ${
                        deal.impact === 'Positive' ? 'text-green-500' : 'text-red-500'
                      }`}>AI Assessment: {deal.impact}</span>
                    </div>
                    <p className="text-sm text-gray-300 italic leading-relaxed">
                      "{deal.aiInterpretation}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="py-20 text-center text-gray-600 border border-dashed border-gray-800 rounded-3xl">
            No deal intelligence found at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default DealsSection;
