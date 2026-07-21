import React, { useState, useRef, useEffect } from "react";
import { AssetData } from "../types";

interface TopBarProps {
  assets: AssetData[];
  onSelectAsset: (asset: AssetData) => void;
  activeAsset: AssetData;
}

export default function TopBar({ assets, onSelectAsset, activeAsset }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredAssets = searchQuery
    ? assets.filter(
        (a) =>
          a.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : assets;

  return (
    <header className="bg-white dark:bg-[#1c2030] border-b border-[#dfe2ea] dark:border-[#2a2e39] flex justify-between items-center h-16 px-6 w-full z-50 sticky top-0 transition-colors duration-200">
      <div className="flex items-center gap-6">
        {/* TradingView Brand Logo */}
        <div className="text-xl md:text-2xl font-bold font-headline text-[#131722] dark:text-white flex items-center cursor-pointer select-none">
          <span className="text-[#0049db] mr-1">Trading</span>View
        </div>

        {/* Dynamic Search Box */}
        <div ref={dropdownRef} className="relative hidden lg:block">
          <div className="flex items-center bg-[#f0f3fa] dark:bg-[#1e222d] rounded-lg px-3 py-1.5 w-64 border border-transparent focus-within:border-[#0049db] focus-within:bg-white dark:focus-within:bg-[#1c2030] transition-all">
            <span className="material-symbols-outlined text-[#6A6D78] text-[20px] mr-2">search</span>
            <input
              type="text"
              placeholder="Search (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="bg-transparent border-none outline-none focus:ring-0 p-0 text-xs text-text-primary dark:text-white w-full placeholder-[#6A6D78]"
            />
          </div>

          {/* Search Dropdown Panel */}
          {showDropdown && (
            <div className="absolute top-full left-0 mt-1 w-80 bg-white dark:bg-[#1c2030] border border-[#dfe2ea] dark:border-[#2a2e39] rounded-lg shadow-xl max-h-96 overflow-y-auto z-50 divide-y divide-[#f0f3fa] dark:divide-[#2a2e39]">
              <div className="px-3 py-2 text-[10px] uppercase font-bold text-[#6A6D78] bg-[#f8f9ff] dark:bg-[#131722]">
                Financial Instruments
              </div>
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <div
                    key={asset.symbol}
                    onClick={() => {
                      onSelectAsset(asset);
                      setSearchQuery("");
                      setShowDropdown(false);
                    }}
                    className={`px-4 py-2.5 flex items-center justify-between hover:bg-[#f8f9ff] dark:hover:bg-[#1e222d] cursor-pointer transition-colors ${
                      activeAsset.symbol === asset.symbol ? "bg-[#f0f3fa] dark:bg-[#1e222d]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 ${asset.logoBg}`}>
                        {asset.logoText}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-[#131722] dark:text-white">{asset.symbol}</p>
                        <p className="text-[10px] text-[#6A6D78] truncate max-w-[150px]">{asset.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs font-semibold dark:text-white">
                        {asset.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                      <p className={`text-[10px] font-semibold ${asset.changePercent >= 0 ? "text-[#089981]" : "text-[#F23645]"}`}>
                        {asset.changePercent >= 0 ? "+" : ""}
                        {asset.changePercent}%
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-4 text-center text-xs text-[#6A6D78]">
                  No matching assets found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex gap-6 text-sm font-semibold text-[#6A6D78] dark:text-[#b2b5be]">
          <a className="hover:text-[#0049db] dark:hover:text-white transition-colors" href="#">Products</a>
          <a className="hover:text-[#0049db] dark:hover:text-white transition-colors" href="#">Community</a>
          <a className="text-[#0049db] dark:text-white border-b-2 border-[#0049db] pb-1.5" href="#">Markets</a>
          <a className="hover:text-[#0049db] dark:hover:text-white transition-colors" href="#">Brokers</a>
          <a className="hover:text-[#0049db] dark:hover:text-white transition-colors" href="#">More</a>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Mobile Search button */}
        <button
          onClick={() => {
            const query = prompt("Enter stock symbol (e.g. SPX, AAPL, TSLA, BTCUSD, NVDA):");
            if (query) {
              const matched = assets.find(a => a.symbol.toUpperCase() === query.toUpperCase());
              if (matched) {
                onSelectAsset(matched);
              } else {
                alert(`Asset "${query}" not found in local presets.`);
              }
            }
          }}
          className="lg:hidden p-1.5 text-[#6A6D78] hover:text-[#0049db] transition-colors"
        >
          <span className="material-symbols-outlined">search</span>
        </button>

        <button className="material-symbols-outlined text-[#6A6D78] hover:text-[#0049db] transition-colors cursor-pointer">
          language
        </button>
        <a className="text-sm font-semibold text-[#131722] dark:text-white hover:text-[#0049db] transition-colors hidden sm:inline" href="#">
          Sign in
        </a>
        <button className="bg-[#0049db] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
          Get started
        </button>
      </div>
    </header>
  );
}
