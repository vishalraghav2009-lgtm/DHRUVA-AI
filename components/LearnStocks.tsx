
import React from 'react';
import { BookOpen, PieChart, ShoppingCart, TrendingUp, Zap, HelpCircle, ArrowRight, Lightbulb } from 'lucide-react';

const LearnStocks: React.FC = () => {
  const coreConcepts = [
    {
      title: "What is a Stock?",
      icon: <PieChart className="text-blue-400" size={32} />,
      analogy: "The Pizza Slice",
      explanation: "Imagine your favorite local pizza shop is worth $1,000. They decide to divide that value into 1,000 equal 'slices'. If you buy one slice for $1, you own 0.1% of the shop.",
      benefit: "If the shop gets more popular and is now worth $2,000, your slice is now worth $2. You just made a profit!"
    },
    {
      title: "How the Market Works",
      icon: <ShoppingCart className="text-green-400" size={32} />,
      analogy: "The Digital Farmers Market",
      explanation: "The Stock Exchange (like NSE or NASDAQ) is just a big digital market. Instead of fruits, people bring their company 'slices' to sell, and others come to buy them.",
      benefit: "Prices go up when more people want to buy, and down when more people want to sell. It's all about demand!"
    },
    {
      title: "Market Sentiment",
      icon: <TrendingUp className="text-purple-400" size={32} />,
      analogy: "Bulls vs. Bears",
      explanation: "A 'Bull' market is when everyone is happy and prices are rising (like a bull charging ahead). A 'Bear' market is when prices are falling and everyone is cautious (like a bear hibernating).",
      benefit: "Understanding these moods helps you know when to be brave and when to be careful."
    }
  ];

  const glossary = [
    { term: "IPO", definition: "A company's 'Debut Party' where they sell stocks to the public for the first time." },
    { term: "Dividend", definition: "A small 'Thank You' payment a company gives you from its profits for being an owner." },
    { term: "Market Cap", definition: "The total price tag of the entire company (Price per stock x Total stocks)." },
    { term: "Portfolio", definition: "Your personal 'Collection' of different stocks, like a stamp or card collection." }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <header className="max-w-3xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-blue-500">
            <BookOpen size={24} />
          </div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Dhruva Academy</span>
        </div>
        <h2 className="text-4xl font-serif font-bold text-white mb-4">Master the Markets</h2>
        <p className="text-lg text-gray-400 leading-relaxed">
          The stock market isn't a casino; it's a way to grow with the world's best businesses. Let's break it down into simple, real-life pieces.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {coreConcepts.map((concept, idx) => (
          <div key={idx} className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 hover:border-blue-500/30 transition-all flex flex-col group">
            <div className="mb-6">{concept.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-2">{concept.title}</h3>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-6 w-fit">
              <Lightbulb size={12} className="text-yellow-500" /> Analogy: {concept.analogy}
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
              {concept.explanation}
            </p>
            <div className="bg-blue-600/5 border border-blue-500/10 p-4 rounded-2xl">
              <p className="text-xs text-blue-300 leading-relaxed">
                <span className="font-bold">Why it matters:</span> {concept.benefit}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-[2.5rem] p-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Zap className="text-yellow-500" /> Quick Vocabulary
            </h3>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Don't let the jargon scare you. Here is the "Secret Code" translated into plain English.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {glossary.map((item, idx) => (
                <div key={idx} className="p-4 bg-gray-950 border border-gray-800 rounded-2xl hover:border-gray-700 transition-all">
                  <span className="block text-blue-400 font-bold mb-1">{item.term}</span>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.definition}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 bg-blue-600/10 rounded-3xl p-8 border border-blue-500/20">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <HelpCircle className="text-blue-400" /> Frequently Asked
            </h4>
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-bold text-white">Can I lose all my money?</p>
                <p className="text-xs text-gray-400 leading-relaxed">Only if you put all your eggs in one basket and that basket breaks. That's why we 'diversify'—or buy different slices of different pies.</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold text-white">How much do I need to start?</p>
                <p className="text-xs text-gray-400 leading-relaxed">In the modern world, you can start with as little as $1 or ₹100. It's more about starting early than starting big.</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold text-white">Is it gambling?</p>
                <p className="text-xs text-gray-400 leading-relaxed">No. Gambling is based on pure luck. Investing is based on owning businesses that produce goods and services people need.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-blue-600 rounded-3xl p-10 text-white">
        <div className="max-w-lg">
          <h3 className="text-2xl font-bold mb-2">Ready to see the market?</h3>
          <p className="text-blue-100 text-sm">Now that you know the basics, head over to the Market Dashboard to see real-time companies in action.</p>
        </div>
        <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all flex items-center gap-2 shadow-xl shadow-black/20 shrink-0">
          Go to Dashboard <ArrowRight size={18} />
        </button>
      </footer>
    </div>
  );
};

export default LearnStocks;
