
import { Stock, Gainer, CorporateDeal, PolicyUpdate, GeoImpact, NewsItem, CurrencyConfig, CurrencyCode } from './types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', rate: 83.5 },
  USD: { code: 'USD', symbol: '$', rate: 1 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.78 },
  JPY: { code: 'JPY', symbol: '¥', rate: 155.0 },
};

// Internal helper to generate consistent mock stocks
const generateMockStocks = (): Stock[] => {
  const indiaStocks = [
    'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ADANIENT', 'ICICIBANK', 'SBIN', 'BHARTIARTL', 'AXISBANK', 'KOTAKBANK',
    'LT', 'BAJFINANCE', 'ASIANPAINT', 'MARUTI', 'TITAN', 'ULTRACEMCO', 'SUNPHARMA', 'NESTLEIND', 'NTPC', 'M&M',
    'JSWSTEEL', 'TATAMOTORS', 'ONGC', 'COALINDIA', 'ADANIPORTS', 'HINDALCO', 'WIPRO', 'TECHM', 'HINDUNILVR', 'GRASIM',
    'CIPLA', 'APOLLOHOSP', 'BPCL', 'TATASTEEL', 'BAJAJFINSV', 'BRITANNIA', 'EICHERMOT', 'INDUSINDBK', 'HEROMOTOCO', 'SBILIFE'
  ].map((s, i) => ({
    symbol: s,
    name: `${s} Ltd`,
    price: 15 + Math.random() * 50,
    change: (Math.random() - 0.4) * 2,
    changePercent: (Math.random() - 0.4) * 3,
    high: 70, low: 10,
    volume: `${(Math.random() * 5).toFixed(1)}M`,
    marketStatus: 'Open' as const,
    lastUpdated: new Date().toLocaleTimeString(),
    country: 'India',
    exchange: 'NSE',
    sector: i % 3 === 0 ? 'Technology' : (i % 3 === 1 ? 'Finance' : 'Energy'),
    marketCap: 'Large' as const,
    description: `Leading industry player in the ${i % 3 === 0 ? 'Technology' : (i % 3 === 1 ? 'Finance' : 'Energy')} sector.`
  }));

  const worldStocks = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'BRK.B', 'V', 'MA',
    'AVGO', 'HD', 'COST', 'PG', 'JNJ', 'LLY', 'ABBV', 'MRK', 'PEP', 'KO',
    'ADBE', 'CRM', 'ORCL', 'MCD', 'WMT', 'AMD', 'NFLX', 'DIS', 'TMO', 'NKE',
    'UPS', 'TXN', 'PM', 'INTU', 'AMAT', 'ISRG', 'QCOM', 'CAT', 'GE', 'HON'
  ].map((s, i) => ({
    symbol: s,
    name: `${s} Corp`,
    price: 100 + Math.random() * 900,
    change: (Math.random() - 0.5) * 10,
    changePercent: (Math.random() - 0.5) * 2,
    high: 1200, low: 80,
    volume: `${(Math.random() * 50).toFixed(1)}M`,
    marketStatus: 'Closed' as const,
    lastUpdated: new Date().toLocaleTimeString(),
    country: 'USA',
    exchange: 'NASDAQ',
    sector: i % 3 === 0 ? 'Technology' : (i % 3 === 1 ? 'Healthcare' : 'Consumer'),
    marketCap: 'Large' as const,
    description: `Global powerhouse driving innovation in ${i % 3 === 0 ? 'Technology' : (i % 3 === 1 ? 'Healthcare' : 'Consumer')}.`
  }));

  return [...indiaStocks, ...worldStocks];
};

export const MOCK_STOCKS: Stock[] = generateMockStocks();

export const MOCK_GAINERS: Gainer[] = [
  // Short Term
  { ...MOCK_STOCKS[44], horizon: 'Today', expectedReturn: 4.2, confidence: 88, reasoning: 'Strong pre-market volume and positive sentiment following cloud contract announcement.' },
  { ...MOCK_STOCKS[0], horizon: 'Today', expectedReturn: 1.2, confidence: 75, reasoning: 'Crude oil price stability and positive retail expansion news.' },
  { ...MOCK_STOCKS[3], horizon: 'Tomorrow', expectedReturn: 2.4, confidence: 68, reasoning: 'New multi-year deal with European banking giant expected to trigger accumulation.' },
  { ...MOCK_STOCKS[5], horizon: 'Tomorrow', expectedReturn: 3.1, confidence: 72, reasoning: 'Anticipated interest rate decision by RBI likely to favor banking heavyweights.' },
  { ...MOCK_STOCKS[40], horizon: '3 Days Ahead', expectedReturn: 5.4, confidence: 81, reasoning: 'Technical breakout pattern confirmed on the 4-hour chart; RSI indicates room for growth.' },
  { ...MOCK_STOCKS[43], horizon: '1 Week Ahead', expectedReturn: 8.5, confidence: 92, reasoning: 'Strong demand for AI hardware and upcoming earnings surprise expected.' },
  
  // Weekly
  { ...MOCK_STOCKS[1], horizon: '1st Week', expectedReturn: 6.2, confidence: 79, reasoning: 'Seasonal demand increase in IT services sector starting to reflect in booking pipelines.' },
  { ...MOCK_STOCKS[10], horizon: '2nd Week', expectedReturn: 4.8, confidence: 65, reasoning: 'Infrastructure policy shifts expected to benefit mid-cap engineering firms.' },
  
  // Historical
  { ...MOCK_STOCKS[4], horizon: 'Last 1 Month', expectedReturn: 12.4, confidence: 95, reasoning: 'Historical data shows consistent 12%+ gains during this quarter over the last 5 years.' },
];

export const MOCK_NEWS: NewsItem[] = [
  { id: '1', headline: 'Fed Signals Potential Rate Cut in Upcoming Meeting', snippet: 'Jerome Powell hints at cooling inflation, sparking market optimism across sectors.', source: 'Financial Times', time: '12 mins ago', category: 'Macro', country: 'USA', url: '#' },
  { id: '2', headline: 'Indian Fintech Ecosystem Braces for New Regulatory Norms', snippet: 'RBI releases draft guidelines on peer-to-peer lending and digital wallet interoperability.', source: 'The Economic Times', time: '1 hour ago', category: 'Finance', country: 'India', url: '#' },
  { id: '3', headline: 'Nvidia Blackwell Chip Production Hits Full Scale', snippet: 'Demand from hyperscalers like AWS and Microsoft drives supply chain expansion.', source: 'Bloomberg', time: '3 hours ago', category: 'Technology', country: 'USA', url: '#' },
  { id: '4', headline: 'London Stock Exchange Sees Surge in Tech IPOs', snippet: 'New listing rules attract European unicorns to the London market.', source: 'Reuters', time: '5 hours ago', category: 'Markets', country: 'UK', url: '#' },
  { id: '5', headline: 'Reliance Strategic Green Hydrogen Push', snippet: 'Ambani outlines roadmap for $10B investment in clean energy over next 3 years.', source: 'Mint', time: '2 hours ago', category: 'Energy', country: 'India', url: '#' },
  { id: '6', headline: 'Nikkei 225 Hits Record Highs Amid Chip Rally', snippet: 'Japanese technology stocks lead the surge as global investors pivot to Asia.', source: 'Nikkei Asia', time: '6 hours ago', category: 'Markets', country: 'Japan', url: '#' },
  { id: '7', headline: 'UK Inflation Dips Faster Than Expected', snippet: 'BoE likely to hold rates as consumer price index shows cooling across energy and food.', source: 'The Guardian', time: '8 hours ago', category: 'Macro', country: 'UK', url: '#' },
  { id: '8', headline: 'China Stimulus Package Targets Property Sector', snippet: 'Beijing announces sweeping measures to support developer liquidity and homebuyer confidence.', source: 'SCMP', time: '10 hours ago', category: 'Macro', country: 'China', url: '#' },
  { id: '9', headline: 'TCS Wins Massive Infrastructure Deal in Sweden', snippet: 'The IT major secures a 5-year contract for cloud transformation with a Nordic bank.', source: 'Business Standard', time: '4 hours ago', category: 'Technology', country: 'India', url: '#' },
  { id: '10', headline: 'Amazon Expedites Prime Air Drone Deliveries', snippet: 'New logistics hub in Arizona testing high-frequency autonomous delivery routes.', source: 'TechCrunch', time: '1 hour ago', category: 'Technology', country: 'USA', url: '#' },
];

export const MOCK_DEALS: CorporateDeal[] = [
  {
    id: '1',
    type: 'M&A',
    companies: ['Disney', 'Reliance Viacom18'],
    size: '$8.5 Billion',
    sector: 'Media & Entertainment',
    impact: 'Positive',
    shortTermReaction: 'Market consolidation optimism',
    longTermImplication: 'Monopoly-like pricing power in sports streaming',
    aiInterpretation: 'A massive strategic play to dominate the Indian digital landscape. High synergy potential.',
    affectedStocks: ['RELIANCE', 'TV18BRDCST', 'DISNEY']
  },
  {
    id: '2',
    type: 'Partnership',
    companies: ['Nvidia', 'Softbank'],
    size: 'Undisclosed',
    sector: 'AI Infrastructure',
    impact: 'Positive',
    shortTermReaction: 'Tech sector rally',
    longTermImplication: 'Faster AI adoption in Japan and sovereign AI cloud growth.',
    aiInterpretation: 'Strengthens Nvidia\'s hardware moat while giving Softbank a needed AI win.',
    affectedStocks: ['NVDA', 'SFTBY']
  }
];

export const MOCK_POLICIES: PolicyUpdate[] = [
  {
    title: 'New SEBI Regulation on F&O',
    category: 'Regulation',
    summary: 'Increased margin requirements for retail derivatives.',
    details: 'SEBI aims to curb excessive speculation in the Options market by increasing the lot size and margin requirements.',
    impact: 'Reduced volatility but potential dip in exchange revenues.',
    date: 'Oct 24, 2024'
  },
  {
    title: 'GST Council 54th Meeting',
    category: 'GST',
    summary: 'Tax reduction on health insurance premiums proposed.',
    details: 'Discussion on moving health insurance from 18% to 5% or exempt status to boost insurance penetration.',
    impact: 'Extremely positive for insurance stocks like HDFC Life, ICICI Pru.',
    date: 'Oct 20, 2024'
  }
];

export const MOCK_GEO: GeoImpact[] = [
  {
    event: 'Middle East Supply Chain Shifts',
    type: 'Energy',
    countriesBenefited: ['India', 'USA', 'Qatar'],
    sectorsAffected: ['Oil & Gas', 'Shipping', 'Renewables'],
    opportunityRisk: 'Both',
    analysis: 'Escalation leads to higher crude prices, benefiting upstream producers but hurting refiners and logistics.'
  }
];
