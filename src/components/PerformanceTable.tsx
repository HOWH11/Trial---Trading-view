import React from "react";
import { Performance } from "../types";

interface PerformanceTableProps {
  performance: Performance;
}

export default function PerformanceTable({ performance }: PerformanceTableProps) {
  const periods = [
    { label: "Weekly", value: performance.weekly },
    { label: "Monthly", value: performance.monthly },
    { label: "3 Month", value: performance.threeMonth },
    { label: "6 Month", value: performance.sixMonth },
    { label: "Year to Date", value: performance.ytd },
    { label: "1 Year", value: performance.oneYear },
  ];

  return (
    <div className="bg-white dark:bg-[#1c2030] rounded-xl border border-[#dfe2ea] dark:border-[#2a2e39] p-6 shadow-sm transition-colors duration-200">
      <h3 className="font-headline text-md md:text-lg font-bold text-[#131722] dark:text-white mb-5">
        Performance
      </h3>
      <div className="space-y-3.5">
        {periods.map((period, idx) => {
          const isPositive = period.value >= 0;
          return (
            <div
              key={period.label}
              className={`flex justify-between items-center pb-2.5 ${
                idx < periods.length - 1 ? "border-b border-[#f0f3fa] dark:border-[#2a2e39]" : ""
              }`}
            >
              <span className="text-xs text-[#6A6D78] dark:text-[#b2b5be] font-medium">
                {period.label}
              </span>
              <span
                className={`font-mono text-xs font-semibold ${
                  isPositive ? "text-[#089981]" : "text-[#F23645]"
                }`}
              >
                {isPositive ? "+" : ""}
                {period.value.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
