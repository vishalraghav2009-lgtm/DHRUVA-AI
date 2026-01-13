
export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // Rate relative to USD (USD=1)
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: string;
  marketStatus: 'Open' | 'Closed';
  lastUpdated: string;
  country: string;
  exchange: string;
  sector: string;
  marketCap: 'Large' | 'Mid' | 'Small';
  description?: string;
  ceo?: string;
  subsidiaries?: string[];
}

export interface Gainer extends Stock {
  horizon: string;
  expectedReturn: number;
  confidence: number;
  reasoning: string;
}

export interface CorporateDeal {
  id: string;
  type: 'M&A' | 'Investment' | 'Partnership' | 'Order' | 'Buyback' | 'Demerger';
  companies: string[];
  size?: string;
  sector: string;
  impact: 'Positive' | 'Neutral' | 'Risky';
  shortTermReaction: string;
  longTermImplication: string;
  aiInterpretation: string;
  affectedStocks: string[];
}

export interface PolicyUpdate {
  title: string;
  category: 'GST' | 'Budget' | 'Regulation' | 'RBI' | 'Advisory';
  summary: string;
  details: string;
  impact: string;
  date: string;
}

export interface GeoImpact {
  event: string;
  type: 'Geopolitical' | 'Trade' | 'Energy';
  countriesBenefited: string[];
  sectorsAffected: string[];
  opportunityRisk: 'Opportunity' | 'Risk' | 'Both';
  analysis: string;
}

export interface NewsItem {
  id: string;
  headline: string;
  snippet: string;
  source: string;
  time: string;
  category: string;
  country: string;
  url: string;
}

export interface UserWatchlist {
  id: string;
  name: string;
  symbols: string[];
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  watchlists: UserWatchlist[];
  activeWatchlistId: string;
}

export type ViewType = 'dashboard' | 'gainers' | 'deals' | 'investment' | 'policy' | 'geopolitics' | 'calculators' | 'watchlist' | 'news' | 'auth' | 'profile' | 'learn';
