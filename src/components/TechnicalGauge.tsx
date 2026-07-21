import React from "react";
import { TechnicalSummary } from "../types";

interface TechnicalGaugeProps {
  tech: TechnicalSummary;
}

export default function TechnicalGauge({ tech }: TechnicalGaugeProps) {
  // Map rating to matching text color utilities
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "Strong Buy":
        return "text-[#089981] dark:text-[#089981]";
      case "Buy":
        return "text-[#089981] opacity-90";
      case "Neutral":
        return "text-[#6A6D78]";
      case "Sell":
        return "text-[#F23645] opacity-90";
      case "Strong Sell":
        return "text-[#F23645] dark:text-[#F23645]";
      default:
        return "text-[#6A6D78]";
    }
  };

  // Convert a degree (-90 to 90) into an SVG rotation transform.
  // 0 is pointing straight up. Sell is pointing left (-60 to -80), Buy pointing right (60 to 80).
  const needleRotation = tech.needleAngle;

  return (
    <div className="bg-white dark:bg-[#1c2030] rounded-xl border border-[#dfe2ea] dark:border-[#2a2e39] p-6 shadow-sm flex flex-col justify-between transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-headline text-md md:text-lg font-bold text-[#131722] dark:text-white">
          Technical Summary
        </h3>
        <div className="text-xs font-semibold text-[#6A6D78] bg-[#f0f3fa] dark:bg-[#1e222d] px-2 py-0.5 rounded">
          1D
        </div>
      </div>

      <div className="flex flex-col items-center py-2">
        {/* Gauge Arc SVG */}
        <div className="relative w-48 h-24 mb-4 select-none">
          <svg viewBox="0 0 100 50" className="w-full h-full">
            <defs>
              {/* Arc Color Gradient */}
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F23645" /> {/* Sell / Red */}
                <stop offset="40%" stopColor="#dfe2ea" /> {/* Neutral / Gray */}
                <stop offset="60%" stopColor="#dfe2ea" /> {/* Neutral / Gray */}
                <stop offset="100%" stopColor="#089981" /> {/* Buy / Green */}
              </linearGradient>
            </defs>

            {/* Inner background arc */}
            <path
              d="M 10,48 A 40,40 0 0,1 90,48"
              fill="none"
              stroke="#ebeef6"
              strokeWidth="8"
              strokeLinecap="round"
              className="dark:stroke-[#2a2e39]"
            />

            {/* Colored arc overlay */}
            <path
              d="M 10,48 A 40,40 0 0,1 90,48"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* Center Pin */}
            <circle cx="50" cy="48" r="4" fill="#131722" className="dark:fill-white" />

            {/* Needle line */}
            <line
              x1="50"
              y1="48"
              x2="50"
              y2="15"
              stroke="#131722"
              strokeWidth="2"
              strokeLinecap="round"
              className="dark:stroke-white transition-transform duration-1000 ease-out origin-[50px_48px]"
              transform={`rotate(${needleRotation}, 50, 48)`}
            />
          </svg>
        </div>

        {/* Rating State Indicator */}
        <span className={`font-headline text-lg md:text-xl font-bold mb-4 tracking-tight ${getRatingColor(tech.rating)}`}>
          {tech.rating}
        </span>

        {/* Technical Oscillators & MAs Breakdown Buttons */}
        <div className="w-full grid grid-cols-3 gap-2 text-center text-xs font-semibold">
          <div className="flex flex-col p-2 bg-[#f8f9ff] dark:bg-[#131722] rounded border border-[#dfe2ea] dark:border-[#2a2e39]">
            <span className="text-[#6A6D78] dark:text-[#b2b5be] text-[10px] uppercase font-bold tracking-wider mb-1">Sell</span>
            <span className="text-[#F23645] font-mono text-sm font-bold">{tech.sell}</span>
          </div>
          <div className="flex flex-col p-2 bg-[#f8f9ff] dark:bg-[#131722] rounded border border-[#dfe2ea] dark:border-[#2a2e39]">
            <span className="text-[#6A6D78] dark:text-[#b2b5be] text-[10px] uppercase font-bold tracking-wider mb-1">Neutral</span>
            <span className="text-[#6A6D78] dark:text-white font-mono text-sm font-bold">{tech.neutral}</span>
          </div>
          <div className="flex flex-col p-2 bg-[#f8f9ff] dark:bg-[#131722] rounded border border-[#dfe2ea] dark:border-[#2a2e39]">
            <span className="text-[#6A6D78] dark:text-[#b2b5be] text-[10px] uppercase font-bold tracking-wider mb-1">Buy</span>
            <span className="text-[#089981] font-mono text-sm font-bold">{tech.buy}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
