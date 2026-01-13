
import React from 'react';
import { MOCK_POLICIES } from '../constants';
import { ShieldCheck, Info, ArrowRight } from 'lucide-react';

const PolicySection: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">Government & Regulatory Intelligence</h2>
        <p className="text-gray-400">Simplified updates on GST, budgets, and market policies.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-600 rounded-lg text-white"><ShieldCheck size={20}/></div>
            <h3 className="text-xl font-bold text-white">Recent Updates</h3>
          </div>
          
          {MOCK_POLICIES.map((policy, idx) => (
            <div key={idx} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 group hover:border-gray-700 transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{policy.category}</span>
                <span className="text-[10px] text-gray-600">{policy.date}</span>
              </div>
              <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{policy.title}</h4>
              <p className="text-sm text-gray-400 mb-4">{policy.summary}</p>
              
              <div className="bg-gray-950/50 rounded-xl p-4 border border-gray-800/50 mb-4">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Impact Analysis</p>
                <p className="text-sm text-green-400">{policy.impact}</p>
              </div>
              
              <button className="text-xs text-blue-500 hover:underline flex items-center gap-1">Read Simplified Explanation <ArrowRight size={12}/></button>
            </div>
          ))}
        </section>

        <section className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-900/20 to-blue-900/20 border border-indigo-500/20 rounded-3xl p-8">
            <h3 className="text-2xl font-serif font-bold text-white mb-6">GST Simplified</h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { slab: '5%', label: 'Common Items', desc: 'Edible oil, Sugar, Tea' },
                { slab: '12%', label: 'Standard-I', desc: 'Butter, Cheese, Mobiles' },
                { slab: '18%', label: 'Standard-II', desc: 'Capital goods, Services' },
                { slab: '28%', label: 'Luxury/Sin', desc: 'Automobiles, Soda' },
              ].map(s => (
                <div key={s.slab} className="bg-gray-950 border border-gray-800 p-4 rounded-2xl">
                  <div className="text-2xl font-bold text-blue-400 mb-1">{s.slab}</div>
                  <div className="text-xs font-bold text-gray-300 uppercase mb-1">{s.label}</div>
                  <p className="text-[10px] text-gray-500">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-4">
              <Info className="text-blue-400 shrink-0" size={20} />
              <p className="text-sm text-gray-300 leading-relaxed">
                The GST Council regularly reviews rates to balance inflation and revenue. 
                DHRUVA AI monitors these sessions to give you immediate sector alerts.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PolicySection;
