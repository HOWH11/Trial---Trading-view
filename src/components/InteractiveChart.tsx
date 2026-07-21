import React, { useState, useMemo, useRef } from "react";
import { Candlestick } from "../types";

interface InteractiveChartProps {
  candlesticks: Candlestick[];
  symbol: string;
  staticImageUrl: string;
  isSpx: boolean;
  selectedTimeframe: string;
  setSelectedTimeframe: (tf: string) => void;
}

export default function InteractiveChart({
  candlesticks,
  symbol,
  staticImageUrl,
  isSpx,
  selectedTimeframe,
  setSelectedTimeframe,
}: InteractiveChartProps) {
  const [viewMode, setViewMode] = useState<"interactive" | "static">(isSpx ? "static" : "interactive");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const timeframes = ["1D", "5D", "1M", "3M", "6M", "YTD", "1Y", "5Y", "All"];

  // SVG dimensions
  const width = 800;
  const height = 440;
  const paddingRight = 60;
  const paddingTop = 40;
  const paddingBottom = 40;
  const chartWidth = width - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Find min/max values for scaling
  const { minPrice, maxPrice, maxVolume } = useMemo(() => {
    if (!candlesticks || candlesticks.length === 0) {
      return { minPrice: 0, maxPrice: 100, maxVolume: 100 };
    }
    let min = Infinity;
    let max = -Infinity;
    let maxVol = 0;
    candlesticks.forEach((c) => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      if (c.volume > maxVol) maxVol = c.volume;
    });
    // Add small buffer
    const buffer = (max - min) * 0.05 || 10;
    return {
      minPrice: Math.max(0, min - buffer),
      maxPrice: max + buffer,
      maxVolume: maxVol || 1,
    };
  }, [candlesticks]);

  // Coordinate conversion helpers
  const getX = (index: number) => {
    if (candlesticks.length <= 1) return chartWidth / 2;
    return (index / (candlesticks.length - 1)) * (chartWidth - 20) + 10;
  };

  const getY = (price: number) => {
    if (maxPrice === minPrice) return chartHeight / 2 + paddingTop;
    return chartHeight - ((price - minPrice) / (maxPrice - minPrice)) * chartHeight + paddingTop;
  };

  // Grid lines
  const gridLines = useMemo(() => {
    const lines = [];
    const stepCount = 5;
    for (let i = 0; i <= stepCount; i++) {
      const price = minPrice + (i / stepCount) * (maxPrice - minPrice);
      lines.push(price);
    }
    return lines;
  }, [minPrice, maxPrice]);

  // Handle hover crosshair tracking
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!containerRef.current || !candlesticks.length) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert local screen X to chart relative coordinates
    const scaleX = width / rect.width;
    const localX = x * scaleX;
    const localY = y * (height / rect.height);
    setMousePos({ x: localX, y: localY });

    // Find closest candlestick index by X coordinate
    let closestIndex = 0;
    let minDiff = Infinity;
    for (let i = 0; i < candlesticks.length; i++) {
      const cx = getX(i);
      const diff = Math.abs(cx - localX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }
    setHoverIndex(closestIndex);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  // Get active candlestick (hovered or latest)
  const activeCandle = useMemo(() => {
    if (candlesticks.length === 0) return null;
    if (hoverIndex !== null && hoverIndex >= 0 && hoverIndex < candlesticks.length) {
      return candlesticks[hoverIndex];
    }
    return candlesticks[candlesticks.length - 1];
  }, [candlesticks, hoverIndex]);

  return (
    <div className="bg-white dark:bg-[#1c2030] rounded-xl border border-[#dfe2ea] dark:border-[#2a2e39] overflow-hidden shadow-sm transition-colors duration-200">
      {/* Chart Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-3 border-b border-[#dfe2ea] dark:border-[#2a2e39] gap-3">
        {/* Timeframe intervals */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar py-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer transition-colors ${
                selectedTimeframe === tf
                  ? "bg-[#0049db] text-white"
                  : "text-[#6A6D78] hover:bg-[#f0f3fa] dark:hover:bg-[#1e222d] dark:text-[#b2b5be]"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* View Mode Controller */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {isSpx && (
            <div className="flex items-center bg-[#f0f3fa] dark:bg-[#1e222d] rounded-lg p-0.5 border border-[#dfe2ea] dark:border-[#2a2e39]">
              <button
                onClick={() => setViewMode("static")}
                className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-md cursor-pointer transition-colors ${
                  viewMode === "static"
                    ? "bg-white dark:bg-[#1c2030] text-[#0049db] dark:text-white shadow-sm"
                    : "text-[#6A6D78] hover:text-[#131722] dark:hover:text-white"
                }`}
              >
                TV Image
              </button>
              <button
                onClick={() => setViewMode("interactive")}
                className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-md cursor-pointer transition-colors ${
                  viewMode === "interactive"
                    ? "bg-white dark:bg-[#1c2030] text-[#0049db] dark:text-white shadow-sm"
                    : "text-[#6A6D78] hover:text-[#131722] dark:hover:text-white"
                }`}
              >
                Live SVG
              </button>
            </div>
          )}

          <button className="p-1.5 hover:bg-[#f0f3fa] dark:hover:bg-[#1e222d] rounded border border-transparent hover:border-[#dfe2ea] transition-all cursor-pointer">
            <span className="material-symbols-outlined text-[#6A6D78] text-[20px]">photo_camera</span>
          </button>
          <button className="p-1.5 hover:bg-[#f0f3fa] dark:hover:bg-[#1e222d] rounded border border-transparent hover:border-[#dfe2ea] transition-all cursor-pointer">
            <span className="material-symbols-outlined text-[#6A6D78] text-[20px]">code</span>
          </button>
          <button
            onClick={() => {
              setViewMode(viewMode === "static" ? "interactive" : "static");
            }}
            className="flex items-center gap-1 px-3 py-1 border border-[#dfe2ea] dark:border-[#2a2e39] dark:text-white rounded-md text-xs font-semibold hover:bg-[#f0f3fa] dark:hover:bg-[#1e222d] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_full</span>
            Full Chart
          </button>
        </div>
      </div>

      {/* Main Plot Area */}
      <div ref={containerRef} className="h-[460px] relative w-full bg-[#fcfcfc] dark:bg-[#131722] select-none transition-colors duration-200">
        {viewMode === "static" && isSpx ? (
          <img
            src={staticImageUrl}
            alt="TradingView S&P 500 Index Candlestick Chart Replica"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          /* Live SVG Candlestick Chart Engine */
          <div className="w-full h-full relative">
            {/* Top-Left OHLC Indicator Panel */}
            {activeCandle && (
              <div className="absolute top-3 left-4 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-mono font-semibold bg-white/80 dark:bg-[#131722]/80 backdrop-blur-xs px-2.5 py-1 rounded border border-[#dfe2ea]/50 dark:border-[#2a2e39]/50 z-10 select-none">
                <span className="text-[#6A6D78]">{symbol}</span>
                <span>
                  O:<span className="text-blue-600 dark:text-blue-400 ml-0.5">{activeCandle.open.toFixed(2)}</span>
                </span>
                <span>
                  H:<span className="text-[#089981] ml-0.5">{activeCandle.high.toFixed(2)}</span>
                </span>
                <span>
                  L:<span className="text-[#F23645] ml-0.5">{activeCandle.low.toFixed(2)}</span>
                </span>
                <span>
                  C:<span className={`ml-0.5 ${activeCandle.close >= activeCandle.open ? "text-[#089981]" : "text-[#F23645]"}`}>{activeCandle.close.toFixed(2)}</span>
                </span>
                <span className="hidden sm:inline">
                  Vol:<span className="text-gray-600 dark:text-gray-400 ml-0.5">{(activeCandle.volume / 1000).toFixed(1)}K</span>
                </span>
                <span className="text-gray-500 text-[10px] pl-1.5">{activeCandle.date}</span>
              </div>
            )}

            {/* SVG Plot */}
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${width} ${height}`}
              preserveAspectRatio="none"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full h-full cursor-crosshair overflow-visible"
            >
              {/* Horizontal Price Grid Lines & Labels */}
              {gridLines.map((price, i) => (
                <g key={i}>
                  <line
                    x1="0"
                    y1={getY(price)}
                    x2={chartWidth}
                    y2={getY(price)}
                    stroke="#f0f3fa"
                    strokeDasharray="2,2"
                    className="dark:stroke-[#232733]"
                  />
                  <text
                    x={chartWidth + 6}
                    y={getY(price) + 4}
                    fill="#6A6D78"
                    className="font-mono text-[9px] font-medium"
                    textAnchor="start"
                  >
                    {price.toLocaleString("en-US", { maximumFractionDigits: 1 })}
                  </text>
                </g>
              ))}

              {/* Volume Bars */}
              {candlesticks.map((candle, idx) => {
                const x = getX(idx);
                const barWidth = Math.max(2, (chartWidth / candlesticks.length) * 0.7);
                const barHeight = (candle.volume / maxVolume) * 60; // Max volume bar height is 60px
                const y = height - paddingBottom - barHeight;
                const isBull = candle.close >= candle.open;

                return (
                  <rect
                    key={`vol-${idx}`}
                    x={x - barWidth / 2}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={isBull ? "#089981" : "#F23645"}
                    opacity="0.18"
                  />
                );
              })}

              {/* Candlesticks (Wicks and Bodies) */}
              {candlesticks.map((candle, idx) => {
                const x = getX(idx);
                const isBull = candle.close >= candle.open;
                const color = isBull ? "#089981" : "#F23645";

                const yOpen = getY(candle.open);
                const yClose = getY(candle.close);
                const yHigh = getY(candle.high);
                const yLow = getY(candle.low);

                const bodyHeight = Math.max(1.5, Math.abs(yClose - yOpen));
                const bodyY = Math.min(yOpen, yClose);
                const bodyWidth = Math.max(3, (chartWidth / candlesticks.length) * 0.8);

                return (
                  <g key={`candle-${idx}`}>
                    {/* Wick Line */}
                    <line
                      x1={x}
                      y1={yHigh}
                      x2={x}
                      y2={yLow}
                      stroke={color}
                      strokeWidth="1.5"
                    />
                    {/* Candle Body */}
                    <rect
                      x={x - bodyWidth / 2}
                      y={bodyY}
                      width={bodyWidth}
                      height={bodyHeight}
                      fill={color}
                      stroke={color}
                      strokeWidth="0.5"
                      rx="0.5"
                    />
                  </g>
                );
              })}

              {/* Hover Crosshair Overlay */}
              {hoverIndex !== null && (
                <g>
                  {/* Vertical line at mouse x */}
                  <line
                    x1={mousePos.x}
                    y1={0}
                    x2={mousePos.x}
                    y2={height - paddingBottom}
                    stroke="#6A6D78"
                    strokeDasharray="3,3"
                    opacity="0.6"
                    className="dark:stroke-white"
                  />
                  {/* Horizontal line at mouse y */}
                  <line
                    x1={0}
                    y1={mousePos.y}
                    x2={chartWidth}
                    y2={mousePos.y}
                    stroke="#6A6D78"
                    strokeDasharray="3,3"
                    opacity="0.6"
                    className="dark:stroke-white"
                  />
                  {/* Indicator circles at exact close value */}
                  <circle
                    cx={getX(hoverIndex)}
                    cy={getY(candlesticks[hoverIndex].close)}
                    r="4"
                    fill={candlesticks[hoverIndex].close >= candlesticks[hoverIndex].open ? "#089981" : "#F23645"}
                    stroke="white"
                    strokeWidth="1.5"
                    className="shadow-md"
                  />
                </g>
              )}
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
