import React from "react";
import { KeyStats } from "../types";

interface KeyStatisticsProps {
  stats: KeyStats;
  currentPrice: number;
}

export default function KeyStatistics({ stats, currentPrice }: KeyStatisticsProps) {
  // Calculate percentage positions for range trackers
  const getPercentage = (val: number, min: number, max: number) => {
    if (max === min) return 50;
    const pct = ((val - min) / (max - min)) * 100;
    return Math.max(2, Math.min(98, pct)); // bound between 2% and 98%
  };

  const dayPct = getPercentage(currentPrice, stats.dayLow, stats.dayHigh);
  const yearPct = getPercentage(currentPrice, stats.yearLow, stats.yearHigh);

  return (
    <div className="bg-white dark:bg-[#1c2030] rounded-xl border border-[#dfe2ea] dark:border-[#2a2e39] p-6 shadow-sm transition-colors duration-200">
      <h3 className="font-headline text-md md:text-lg font-bold text-[#131722] dark:text-white mb-5">
        Key Statistics
      </h3>
      
      <div className="space-y-4">
        {/* Previous Close */}
        <div className="flex justify-between items-center pb-1">
          <span className="text-xs text-[#6A6D78] dark:text-[#b2b5be]">Previous Close</span>
          <span className="font-mono text-xs font-semibold text-[#131722] dark:text-white">
            {stats.prevClose.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Open */}
        <div className="flex justify-between items-center pb-1">
          <span className="text-xs text-[#6A6D78] dark:text-[#b2b5be]">Open</span>
          <span className="font-mono text-xs font-semibold text-[#131722] dark:text-white">
            {stats.open.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Day Range with Visual Slider */}
        <div className="flex justify-between items-start pt-1 pb-2">
          <span className="text-xs text-[#6A6D78] dark:text-[#b2b5be] mt-0.5">Day Range</span>
          <div className="flex flex-col items-end">
            <span className="font-mono text-xs font-semibold text-[#131722] dark:text-white">
              {stats.dayLow.toLocaleString("en-US", { minimumFractionDigits: 2 })} — {stats.dayHigh.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
            {/* Visual Slider Line */}
            <div className="w-40 h-1 bg-[#ebeef6] dark:bg-[#2a2e39] mt-2 relative rounded-full">
              <div
                style={{ left: `${dayPct}%` }}
                className="absolute w-2 h-2 bg-[#0049db] dark:bg-white rounded-full -top-0.5 -translate-x-1/2 transition-all duration-700 ease-out"
              />
            </div>
          </div>
        </div>

        {/* 52-Week Range with Visual Slider */}
        <div className="flex justify-between items-start pt-1 pb-2">
          <span className="text-xs text-[#6A6D78] dark:text-[#b2b5be] mt-0.5">52-Week Range</span>
          <div className="flex flex-col items-end">
            <span className="font-mono text-xs font-semibold text-[#131722] dark:text-white">
              {stats.yearLow.toLocaleString("en-US", { minimumFractionDigits: 2 })} — {stats.yearHigh.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
            {/* Visual Slider Line */}
            <div className="w-40 h-1 bg-[#ebeef6] dark:bg-[#2a2e39] mt-2 relative rounded-full">
              <div
                style={{ left: `${yearPct}%` }}
                className="absolute w-2 h-2 bg-[#0049db] dark:bg-white rounded-full -top-0.5 -translate-x-1/2 transition-all duration-700 ease-out"
              />
            </div>
          </div>
        </div>

        {/* Volume */}
        <div className="pt-4 border-t border-[#f0f3fa] dark:border-[#2a2e39] flex justify-between items-center">
          <span className="text-xs text-[#6A6D78] dark:text-[#b2b5be]">Volume</span>
          <span className="font-mono text-xs font-semibold text-[#131722] dark:text-white">
            {stats.volume}
          </span>
        </div>
      </div>
    </div>
  );
}
