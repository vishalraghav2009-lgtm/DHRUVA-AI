
import React, { useState, useMemo } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell,
  Tooltip,
  ResponsiveContainer 
} from 'recharts';
import { CURRENCIES } from '../constants';
import { CurrencyCode } from '../types';

interface CalculatorsProps {
  currency: CurrencyCode;
}

const Calculators: React.FC<CalculatorsProps> = ({ currency }) => {
  const [calcType, setCalcType] = useState<'SIP' | 'Compound' | 'Returns'>('SIP');
  const [monthlyInvest, setMonthlyInvest] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const cur = CURRENCIES[currency];

  const formatVal = (val: number) => {
    return `${cur.symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const results = useMemo(() => {
    if (calcType === 'SIP') {
      const n = years * 12;
      const r = rate / 12 / 100;
      const totalInvestment = monthlyInvest * n;
      const futureValue = monthlyInvest * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      const returns = futureValue - totalInvestment;
      
      return { totalInvestment, returns, futureValue };
    } else {
      const totalInvestment = monthlyInvest * 12 * years;
      const futureValue = monthlyInvest * 12 * years * Math.pow(1 + (rate/100), years);
      const returns = futureValue - totalInvestment;
      return { totalInvestment, returns, futureValue };
    }
  }, [monthlyInvest, rate, years, calcType]);

  const pieData = [
    { name: 'Invested', value: results.totalInvestment },
    { name: 'Estimated Returns', value: results.returns },
  ];

  const COLORS = ['#1f2937', '#3b82f6'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">Financial Calculators</h2>
        <p className="text-gray-400">Plan your future with precision in your preferred currency.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
            <div className="flex gap-2 mb-8 bg-black/40 p-1 rounded-xl">
              {['SIP', 'Compound', 'Returns'].map((t: any) => (
                <button
                  key={t}
                  onClick={() => setCalcType(t)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${calcType === t ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-gray-400">Monthly Investment</label>
                  <span className="text-xs font-bold text-white">{formatVal(monthlyInvest)}</span>
                </div>
                <input 
                  type="range" min="100" max="100000" step="100" 
                  value={monthlyInvest} onChange={(e) => setMonthlyInvest(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500" 
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-gray-400">Expected Rate of Return (%)</label>
                  <span className="text-xs font-bold text-white">{rate}%</span>
                </div>
                <input 
                  type="range" min="1" max="30" step="0.5" 
                  value={rate} onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500" 
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-gray-400">Time Period (Years)</label>
                  <span className="text-xs font-bold text-white">{years} Yrs</span>
                </div>
                <input 
                  type="range" min="1" max="40" step="1" 
                  value={years} onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500" 
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-600 border border-blue-400/20 rounded-3xl p-6 text-white shadow-xl shadow-blue-900/20">
            <p className="text-xs text-blue-100 mb-1 uppercase tracking-widest font-bold">Estimated Maturity Value</p>
            <h4 className="text-4xl font-serif font-bold">{formatVal(results.futureValue)}</h4>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <p className="text-xs text-gray-500 mb-1">Total Investment</p>
              <p className="text-xl font-bold text-white">{formatVal(results.totalInvestment)}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <p className="text-xs text-gray-500 mb-1">Est. Returns</p>
              <p className="text-xl font-bold text-green-400">{formatVal(results.returns)}</p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 h-[400px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#030712', border: '1px solid #1f2937', color: '#fff' }}
                   formatter={(value: number) => formatVal(value)}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
               <span className="text-gray-500 text-xs">Returns Ratio</span>
               <span className="text-blue-400 font-bold text-xl">{Math.round((results.returns/results.futureValue)*100)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculators;
