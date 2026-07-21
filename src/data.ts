import { AssetData, Candlestick } from "./types";

// Helper to generate realistic daily candlestick history leading up to today
export function generateCandlestickData(
  startPrice: number,
  pointsCount: number,
  volatility: number = 0.015,
  bullTrend: boolean = true
): Candlestick[] {
  const data: Candlestick[] = [];
  let currentPrice = startPrice;
  const now = new Date();
  
  // Backtrack day by day, skipping weekends
  let currentDate = new Date(now);
  let daysBack = 0;

  while (daysBack < pointsCount) {
    currentDate.setDate(currentDate.getDate() - 1);
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      continue; // Skip weekends for traditional indices
    }
    daysBack++;
  }

  // Set seed-like variations
  for (let i = 0; i < pointsCount; i++) {
    const trendDrift = bullTrend ? 0.0004 : -0.0001;
    const changePercent = (Math.random() - 0.48) * volatility + trendDrift;
    const open = currentPrice;
    const close = currentPrice * (1 + changePercent);
    const high = Math.max(open, close) * (1 + Math.random() * 0.005);
    const low = Math.min(open, close) * (1 - Math.random() * 0.005);
    const volume = Math.floor(Math.random() * 500000) + 100000;

    // Formatting date as "MMM DD, YYYY" or ISO
    const dateStr = currentDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    data.unshift({
      date: dateStr,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
    });

    // Advance current price
    currentPrice = close;
    
    // Increment date for the next step forward
    currentDate.setDate(currentDate.getDate() + 1);
    while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  // Adjust so that the last close matches the actual startPrice
  const lastIndex = data.length - 1;
  if (lastIndex >= 0) {
    const scale = startPrice / data[lastIndex].close;
    for (let i = 0; i < data.length; i++) {
      data[i].open = parseFloat((data[i].open * scale).toFixed(2));
      data[i].high = parseFloat((data[i].high * scale).toFixed(2));
      data[i].low = parseFloat((data[i].low * scale).toFixed(2));
      data[i].close = parseFloat((data[i].close * scale).toFixed(2));
    }
  }

  return data;
}

export const presetAssets: AssetData[] = [
  {
    symbol: "SPX",
    name: "S&P 500 Index",
    exchange: "Standard and Poor's Indices",
    price: 5842.47,
    change: 40.23,
    changePercent: 0.69,
    logoText: "500",
    logoBg: "bg-danger-red", // Red background as requested
    stats: {
      prevClose: 5802.24,
      open: 5815.12,
      dayLow: 5812.10,
      dayHigh: 5861.34,
      yearLow: 4103.78,
      yearHigh: 5878.46,
      volume: "2.41B",
    },
    tech: {
      rating: "Strong Buy",
      sell: 2,
      neutral: 9,
      buy: 15,
      needleAngle: 55, // pointing right
    },
    performance: {
      weekly: 1.24,
      monthly: 3.45,
      threeMonth: 8.12,
      sixMonth: 12.67,
      ytd: 21.05,
      oneYear: 34.89,
    },
    chartData: {}, // Programmatically filled below
  },
  {
    symbol: "DJI",
    name: "Dow Jones Industrial Average",
    exchange: "S&P Dow Jones Indices",
    price: 42374.36,
    change: 228.11,
    changePercent: 0.54,
    logoText: "DJI",
    logoBg: "bg-slate-800",
    stats: {
      prevClose: 42146.25,
      open: 42202.40,
      dayLow: 42180.50,
      dayHigh: 42410.20,
      yearLow: 32327.20,
      yearHigh: 42628.30,
      volume: "310.4M",
    },
    tech: {
      rating: "Buy",
      sell: 4,
      neutral: 8,
      buy: 12,
      needleAngle: 35,
    },
    performance: {
      weekly: 0.54,
      monthly: 1.85,
      threeMonth: 4.12,
      sixMonth: 8.67,
      ytd: 12.35,
      oneYear: 26.10,
    },
    chartData: {},
  },
  {
    symbol: "NDX",
    name: "Nasdaq 100 Index",
    exchange: "Nasdaq Indices",
    price: 20352.12,
    change: 225.40,
    changePercent: 1.12,
    logoText: "NDX",
    logoBg: "bg-primary-container",
    stats: {
      prevClose: 20126.72,
      open: 20210.50,
      dayLow: 20185.20,
      dayHigh: 20420.80,
      yearLow: 14050.40,
      yearHigh: 20690.90,
      volume: "1.84B",
    },
    tech: {
      rating: "Strong Buy",
      sell: 1,
      neutral: 5,
      buy: 18,
      needleAngle: 68,
    },
    performance: {
      weekly: 1.12,
      monthly: 4.10,
      threeMonth: 10.24,
      sixMonth: 18.50,
      ytd: 28.40,
      oneYear: 45.20,
    },
    chartData: {},
  },
  {
    symbol: "IWM",
    name: "Russell 2000 Index",
    exchange: "FTSE Russell Indices",
    price: 2214.89,
    change: -4.65,
    changePercent: -0.21,
    logoText: "IWM",
    logoBg: "bg-[#55595e]",
    stats: {
      prevClose: 2219.54,
      open: 2218.10,
      dayLow: 2205.40,
      dayHigh: 2225.90,
      yearLow: 1720.50,
      yearHigh: 2300.20,
      volume: "24.5M",
    },
    tech: {
      rating: "Neutral",
      sell: 8,
      neutral: 11,
      buy: 7,
      needleAngle: -5,
    },
    performance: {
      weekly: -0.21,
      monthly: 0.85,
      threeMonth: 2.10,
      sixMonth: 5.12,
      ytd: 8.40,
      oneYear: 15.20,
    },
    chartData: {},
  },
  {
    symbol: "BTCUSD",
    name: "Bitcoin / U.S. Dollar",
    exchange: "Cryptocurrency",
    price: 68432.50,
    change: 1245.10,
    changePercent: 1.85,
    logoText: "₿",
    logoBg: "bg-orange-500",
    stats: {
      prevClose: 67187.40,
      open: 67220.00,
      dayLow: 67150.00,
      dayHigh: 68900.00,
      yearLow: 34200.00,
      yearHigh: 73750.00,
      volume: "28.4B",
    },
    tech: {
      rating: "Strong Buy",
      sell: 1,
      neutral: 4,
      buy: 21,
      needleAngle: 75,
    },
    performance: {
      weekly: 4.20,
      monthly: 9.12,
      threeMonth: 12.45,
      sixMonth: 16.20,
      ytd: 62.30,
      oneYear: 124.50,
    },
    chartData: {},
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    exchange: "NASDAQ",
    price: 232.45,
    change: 3.25,
    changePercent: 1.42,
    logoText: "AAPL",
    logoBg: "bg-black",
    stats: {
      prevClose: 229.20,
      open: 230.10,
      dayLow: 229.80,
      dayHigh: 233.10,
      yearLow: 164.08,
      yearHigh: 237.25,
      volume: "52.4M",
    },
    tech: {
      rating: "Buy",
      sell: 3,
      neutral: 8,
      buy: 13,
      needleAngle: 42,
    },
    performance: {
      weekly: 1.42,
      monthly: 5.12,
      threeMonth: 8.40,
      sixMonth: 14.25,
      ytd: 18.90,
      oneYear: 31.20,
    },
    chartData: {},
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    exchange: "NASDAQ",
    price: 268.21,
    change: 12.45,
    changePercent: 4.87,
    logoText: "TSLA",
    logoBg: "bg-red-700",
    stats: {
      prevClose: 255.76,
      open: 258.00,
      dayLow: 256.40,
      dayHigh: 271.80,
      yearLow: 138.80,
      yearHigh: 274.60,
      volume: "84.1M",
    },
    tech: {
      rating: "Strong Buy",
      sell: 2,
      neutral: 6,
      buy: 18,
      needleAngle: 62,
    },
    performance: {
      weekly: 4.87,
      monthly: 14.20,
      threeMonth: 22.40,
      sixMonth: 31.50,
      ytd: 10.20,
      oneYear: 19.40,
    },
    chartData: {},
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    exchange: "NASDAQ",
    price: 143.50,
    change: 5.12,
    changePercent: 3.70,
    logoText: "NVDA",
    logoBg: "bg-green-600",
    stats: {
      prevClose: 138.38,
      open: 139.50,
      dayLow: 139.10,
      dayHigh: 144.50,
      yearLow: 45.10,
      yearHigh: 146.49,
      volume: "184.5M",
    },
    tech: {
      rating: "Strong Buy",
      sell: 0,
      neutral: 3,
      buy: 23,
      needleAngle: 80,
    },
    performance: {
      weekly: 3.70,
      monthly: 18.45,
      threeMonth: 24.12,
      sixMonth: 62.30,
      ytd: 194.50,
      oneYear: 210.40,
    },
    chartData: {},
  },
];

// Prepopulate history chart data for all preset assets
presetAssets.forEach((asset) => {
  const price = asset.price;
  const isBull = asset.changePercent >= 0;
  
  // Fill datasets for timeframes
  asset.chartData["1D"] = generateCandlestickData(price, 24, 0.003, isBull);
  asset.chartData["5D"] = generateCandlestickData(price, 40, 0.006, isBull);
  asset.chartData["1M"] = generateCandlestickData(price, 60, 0.012, isBull);
  asset.chartData["3M"] = generateCandlestickData(price, 90, 0.018, isBull);
  asset.chartData["6M"] = generateCandlestickData(price, 120, 0.024, isBull);
  asset.chartData["YTD"] = generateCandlestickData(price, 150, 0.03, isBull);
  asset.chartData["1Y"] = generateCandlestickData(price, 250, 0.04, isBull);
  asset.chartData["5Y"] = generateCandlestickData(price, 400, 0.08, isBull);
  asset.chartData["All"] = generateCandlestickData(price, 600, 0.15, isBull);
});
