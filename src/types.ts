export interface KeyStats {
  prevClose: number;
  open: number;
  dayLow: number;
  dayHigh: number;
  yearLow: number;
  yearHigh: number;
  volume: string;
}

export interface TechnicalSummary {
  rating: "Strong Buy" | "Buy" | "Neutral" | "Sell" | "Strong Sell";
  sell: number;
  neutral: number;
  buy: number;
  needleAngle: number; // degrees relative to center vertical (-90 to 90 or 0 to 180)
}

export interface Performance {
  weekly: number;
  monthly: number;
  threeMonth: number;
  sixMonth: number;
  ytd: number;
  oneYear: number;
}

export interface Candlestick {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface AssetData {
  symbol: string;
  name: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  logoText: string;
  logoBg: string;
  stats: KeyStats;
  tech: TechnicalSummary;
  performance: Performance;
  chartData: Record<string, Candlestick[]>; // Map timeframes to candlestick series
}

export interface AIAnalysis {
  summary: string;
  proAnalysis: {
    supportAndResistance: string;
    volumeProfile: string;
    indicators: string;
  };
  rating: string;
  targetPriceRange: string;
  news: Array<{
    title: string;
    source: string;
    sentiment: "positive" | "neutral" | "negative";
    summary: string;
  }>;
}
