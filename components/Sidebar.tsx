
import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Briefcase, 
  Globe, 
  ShieldCheck, 
  Calculator, 
  Target,
  Menu,
  X,
  Bookmark,
  Newspaper,
  User,
  LogOut,
  Coins,
  BookOpen
} from 'lucide-react';
import { ViewType, User as UserType, CurrencyCode } from '../types';
import { CURRENCIES } from '../constants';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: UserType | null;
  onLogout: () => void;
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  setActiveView, 
  isOpen, 
  setIsOpen, 
  user, 
  onLogout,
  currency,
  setCurrency
}) => {
  const menuItems: { id: ViewType; label: string; icon: any; requiresAuth?: boolean }[] = [
    { id: 'dashboard', label: 'Market Dashboard', icon: LayoutDashboard },
    { id: 'learn', label: 'Learn Stocks', icon: BookOpen },
    { id: 'news', label: 'Financial News', icon: Newspaper },
    { id: 'watchlist', label: 'My Watchlist', icon: Bookmark, requiresAuth: true },
    { id: 'gainers', label: 'Market Gainers', icon: TrendingUp },
    { id: 'deals', label: 'Corporate Actions', icon: Briefcase },
    { id: 'investment', label: 'Investment Discover', icon: Target },
    { id: 'policy', label: 'Policy Intelligence', icon: ShieldCheck },
    { id: 'geopolitics', label: 'Global Analysis', icon: Globe },
    { id: 'calculators', label: 'Calculators', icon: Calculator },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-white"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-gray-950 border-r border-gray-800 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="mb-10">
            <h1 className="text-2xl font-serif font-bold tracking-tight text-white flex items-center gap-2">
              <span className="text-blue-500">DHRUVA</span> AI
            </h1>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">See the Market. Know the Direction.</p>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = activeView === item.id;
              
              if (item.requiresAuth && !user) return null;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    if (window.innerWidth < 1024) setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                    ${active 
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-900'}
                  `}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-800 space-y-4">
            <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-800">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <Coins size={14} /> Currency
              </div>
              <div className="grid grid-cols-3 gap-1">
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map(code => (
                  <button
                    key={code}
                    onClick={() => setCurrency(code)}
                    className={`text-[10px] font-bold py-1 px-2 rounded transition-all ${
                      currency === code ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-800'
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            {user ? (
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setActiveView('profile')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeView === 'profile' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}
                >
                  <User size={18} />
                  <span className="truncate">{user.name}</span>
                </button>
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setActiveView('auth')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
              >
                <User size={18} />
                Sign In
              </button>
            )}
            
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-4 rounded-2xl border border-gray-800">
              <p className="text-[10px] text-gray-500 leading-relaxed italic">
                "The unshakable guide that shows direction."
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
