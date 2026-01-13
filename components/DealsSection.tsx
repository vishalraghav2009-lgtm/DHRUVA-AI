
import React from 'react';
import { MOCK_DEALS } from '../constants';
import { Briefcase, Info, TrendingUp, AlertTriangle } from 'lucide-react';

const DealsSection: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">Business Deals & Corporate Actions</h2>
        <p className="text-gray-400">Strategic analysis of M&As, partnerships, and demergers.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {MOCK_DEALS.map((deal) => (
          <div key={deal.id} className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden hover:border-gray-700 transition-all">
            <div className="p-1 w-full bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {deal.type}
                    </span>
                    <span className="text-xs text-gray-500">{deal.sector}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">
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
        ))}
      </div>
    </div>
  );
};

export default DealsSection;
