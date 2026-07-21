import React, { useState } from "react";
import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import InteractiveChart from "./components/InteractiveChart";
import TechnicalGauge from "./components/TechnicalGauge";
import PerformanceTable from "./components/PerformanceTable";
import KeyStatistics from "./components/KeyStatistics";
import ProAnalysisModal from "./components/ProAnalysisModal";
import { presetAssets } from "./data";
import { AssetData } from "./types";

export default function App() {
  const [activeAsset, setActiveAsset] = useState<AssetData>(presetAssets[0]);
  const [selectedTimeframe, setSelectedTimeframe] = useState("1M");
  const [activeTab, setActiveTab] = useState("watchlist");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentMenuTab, setCurrentMenuTab] = useState("Overview");
  const [isProModalOpen, setIsProModalOpen] = useState(false);

  // Quick helper to switch assets
  const handleSelectAsset = (asset: AssetData) => {
    setActiveAsset(asset);
  };

  // Get active chart points based on timeframe selected
  const activeChartPoints = activeAsset.chartData[selectedTimeframe] || [];

  // Navigation menu tabs
  const menuTabs = ["Overview", "News", "Community", "Technicals", "Seasonals", "Components"];

  // Toggle dark mode class on root html
  React.useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const changeIsPositive = activeAsset.changePercent >= 0;

  return (
    <div className="min-h-screen bg-[#f8f9ff] dark:bg-[#131722] text-[#181c22] dark:text-white transition-colors duration-200">
      {/* Top Navbar */}
      <TopBar
        assets={presetAssets}
        onSelectAsset={handleSelectAsset}
        activeAsset={activeAsset}
      />

      {/* Main Grid Wrapper with responsive desktop sidebar padding */}
      <div className="flex">
        {/* Left Side: Real Content Body */}
        <main className="flex-1 max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:pr-20 pb-24 transition-all">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-1.5 text-xs text-[#6A6D78] dark:text-[#b2b5be] mb-4 overflow-x-auto no-scrollbar whitespace-nowrap">
            <a className="hover:text-[#0049db] dark:hover:text-white transition-colors" href="#">Markets</a>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <a className="hover:text-[#0049db] dark:hover:text-white transition-colors" href="#">USA</a>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <a className="hover:text-[#0049db] dark:hover:text-white transition-colors" href="#">Indices</a>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-[#131722] dark:text-white font-medium">{activeAsset.symbol}</span>
          </nav>

          {/* Symbol Header Section */}
          <section className="flex flex-col md:flex-row md:items-start justify-between gap-5 mb-6">
            <div className="flex items-center gap-4 md:gap-5">
              {/* Asset Badge Circular Logo */}
              <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center text-white font-headline font-black text-xl md:text-3xl shadow-sm shrink-0 select-none ${activeAsset.logoBg}`}>
                {activeAsset.logoText}
              </div>
              
              <div>
                <h1 className="font-headline text-xl md:text-2xl lg:text-3xl font-black text-[#131722] dark:text-white leading-tight">
                  {activeAsset.name}
                </h1>
                
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="font-mono text-[10px] md:text-xs font-bold bg-[#ebeef6] dark:bg-[#1e222d] text-[#131722] dark:text-white px-2 py-0.5 rounded border border-[#dfe2ea] dark:border-[#2a2e39]">
                    {activeAsset.symbol}
                  </span>
                  
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-[#ebeef6] dark:bg-[#1e222d] rounded border border-[#dfe2ea] dark:border-[#2a2e39] cursor-pointer hover:bg-[#e5e8f0] dark:hover:bg-[#2a2e39] transition-colors">
                    <span className="w-3.5 h-3.5 rounded-full bg-red-600 text-[7px] flex items-center justify-center text-white font-bold font-sans">
                      S&amp;P
                    </span>
                    <span className="text-[10px] md:text-xs font-semibold text-[#181c22] dark:text-white">
                      {activeAsset.exchange}
                    </span>
                    <span className="material-symbols-outlined text-[14px]">expand_more</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Metrics Column */}
            <div className="flex flex-col md:items-end mt-2 md:mt-0">
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <span className="font-mono text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#131722] dark:text-white">
                  {activeAsset.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
                <span className={`font-headline text-sm md:text-md lg:text-lg font-bold ${changeIsPositive ? "text-[#089981]" : "text-[#F23645]"}`}>
                  {changeIsPositive ? "+" : ""}
                  {activeAsset.change.toLocaleString("en-US", { minimumFractionDigits: 2 })} ({changeIsPositive ? "+" : ""}
                  {activeAsset.changePercent.toFixed(2)}%)
                </span>
              </div>
              <div className="text-[10px] md:text-xs text-[#6A6D78] dark:text-[#b2b5be] flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                Market Open • Jul 21, 2026, 13:18 EDT
              </div>
            </div>
          </section>

          {/* Tab Navigation Menu */}
          <nav className="flex border-b border-[#dfe2ea] dark:border-[#2a2e39] mb-6 overflow-x-auto no-scrollbar">
            <div className="flex gap-6 md:gap-8 font-headline text-xs md:text-sm font-bold whitespace-nowrap">
              {menuTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCurrentMenuTab(tab)}
                  className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
                    currentMenuTab === tab
                      ? "border-[#0049db] text-[#0049db] dark:text-white"
                      : "border-transparent text-[#6A6D78] hover:text-[#131722] dark:text-[#b2b5be] dark:hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </nav>

          {/* Interactive Responsive Grid Core Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            
            {/* Left Column (8 cols): Interactive Chart, Gauge and Table */}
            <div className="lg:col-span-8 space-y-4 md:space-y-6">
              {/* Candlestick Chart Frame */}
              <InteractiveChart
                candlesticks={activeChartPoints}
                symbol={activeAsset.symbol}
                staticImageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuC25eIeQ6BGZKG4lnq99myaAVLUnhPmlvmWjvKOfUSXFCDwgW-P7mWWtOwDtcm9T0vKBIfZW2-_sSe2W5-2p8M24fktQ0gL3oFTdtV7vUa_zVrnS7SZlNl3MKUb2ltMOVaBsoBLgYySXbFoIVL73vV05BqaCyLSpCpH_e-p49-Ii74dYB59B-CRc0o-rOD0rRZxr7ZX7Vjq2i5FatmvcVtdqtp2ybokrvuuINDPqOlkqI-3J5jHsqFcy5sqKTdeNwv2ZNMBjSLQemU"
                isSpx={activeAsset.symbol === "SPX"}
                selectedTimeframe={selectedTimeframe}
                setSelectedTimeframe={setSelectedTimeframe}
              />

              {/* Gauges & Technical Side-by-Side Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <TechnicalGauge tech={activeAsset.tech} />
                <PerformanceTable performance={activeAsset.performance} />
              </div>
            </div>

            {/* Right Column (4 cols): Statistics, Quick Swappers, and Premium AI Card */}
            <div className="lg:col-span-4 space-y-4 md:space-y-6">
              
              {/* General Core Figures Panel */}
              <KeyStatistics
                stats={activeAsset.stats}
                currentPrice={activeAsset.price}
              />

              {/* Related & Custom Watchlists Ticker Swapper */}
              <div className="bg-white dark:bg-[#1c2030] rounded-xl border border-[#dfe2ea] dark:border-[#2a2e39] overflow-hidden shadow-sm transition-colors duration-200">
                <div className="px-4 py-3 border-b border-[#dfe2ea] dark:border-[#2a2e39] flex items-center justify-between">
                  <h3 className="font-headline text-xs md:text-sm font-bold text-[#131722] dark:text-white">
                    Related Instruments Watchlist
                  </h3>
                  <button
                    onClick={() => alert("Watchlist view expanded. Click any index ticker row to analyze instantly.")}
                    className="text-[#0049db] dark:text-blue-400 font-headline text-[10px] md:text-xs font-bold hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>
                
                {/* Scrollable watchlist lists */}
                <div className="divide-y divide-[#ebeef6] dark:divide-[#2a2e39]">
                  {presetAssets.map((asset) => {
                    const rowIsPositive = asset.changePercent >= 0;
                    const isActiveRow = activeAsset.symbol === asset.symbol;
                    
                    return (
                      <div
                        key={asset.symbol}
                        onClick={() => handleSelectAsset(asset)}
                        className={`p-3.5 flex items-center justify-between hover:bg-[#f8f9ff] dark:hover:bg-[#1e222d] transition-colors cursor-pointer group ${
                          isActiveRow ? "bg-[#f0f3fa] dark:bg-[#1e222d] border-l-4 border-[#0049db]" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded text-white flex items-center justify-center text-[10px] font-bold shrink-0 ${asset.logoBg}`}>
                            {asset.logoText}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#131722] dark:text-white group-hover:text-[#0049db] dark:group-hover:text-blue-400 transition-colors">
                              {asset.name}
                            </p>
                            <p className="text-[10px] text-[#6A6D78] dark:text-[#b2b5be] font-medium font-mono">{asset.symbol}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-mono text-xs font-semibold text-[#131722] dark:text-white">
                            {asset.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </p>
                          <p className={`text-[10px] font-semibold ${rowIsPositive ? "text-[#089981]" : "text-[#F23645]"}`}>
                            {rowIsPositive ? "+" : ""}
                            {asset.changePercent}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Promotional Premium Pro Analysis Banner Card */}
              <div className="bg-[#2962ff] text-white p-6 rounded-xl shadow-md space-y-4">
                <h3 className="font-headline text-md md:text-lg font-bold">Unlock Pro Analysis</h3>
                <p className="text-xs opacity-90 leading-relaxed">
                  Get deeper insights with volume profiles, customized screeners, and 100+ cloud alerts powered by Gemini AI.
                </p>
                <button
                  onClick={() => setIsProModalOpen(true)}
                  className="w-full bg-white text-[#0049db] font-headline text-xs font-bold py-3 rounded-lg hover:bg-opacity-95 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Start free trial
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Desktop Sidebar Rail */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab === "analytics") {
              setIsProModalOpen(true);
            }
          }}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
      </div>

      {/* Pro Analysis AI Drawer Modal */}
      <ProAnalysisModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        asset={activeAsset}
      />

      {/* Corporate Modern Footer */}
      <footer className="bg-white dark:bg-[#131722] border-t border-[#dfe2ea] dark:border-[#2a2e39] w-full py-8 px-6 mt-12 mb-16 md:mb-0 transition-colors duration-200">
        <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-[#131722] dark:text-white tracking-wider uppercase">Products</span>
            <a className="text-xs text-[#6A6D78] dark:text-[#b2b5be] hover:text-[#0049db] dark:hover:text-white transition-colors" href="#">Supercharts</a>
            <a className="text-xs text-[#6A6D78] dark:text-[#b2b5be] hover:text-[#0049db] dark:hover:text-white transition-colors" href="#">Pine Script™</a>
            <a className="text-xs text-[#6A6D78] dark:text-[#b2b5be] hover:text-[#0049db] dark:hover:text-white transition-colors" href="#">Stock Screener</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-[#131722] dark:text-white tracking-wider uppercase">Community</span>
            <a className="text-xs text-[#6A6D78] dark:text-[#b2b5be] hover:text-[#0049db] dark:hover:text-white transition-colors" href="#">Ideas</a>
            <a className="text-xs text-[#6A6D78] dark:text-[#b2b5be] hover:text-[#0049db] dark:hover:text-white transition-colors" href="#">Scripts</a>
            <a className="text-xs text-[#6A6D78] dark:text-[#b2b5be] hover:text-[#0049db] dark:hover:text-white transition-colors" href="#">Streams</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-[#131722] dark:text-white tracking-wider uppercase">About</span>
            <a className="text-xs text-[#6A6D78] dark:text-[#b2b5be] hover:text-[#0049db] dark:hover:text-white transition-colors" href="#">Company</a>
            <a className="text-xs text-[#6A6D78] dark:text-[#b2b5be] hover:text-[#0049db] dark:hover:text-white transition-colors" href="#">Features</a>
            <a className="text-xs text-[#6A6D78] dark:text-[#b2b5be] hover:text-[#0049db] dark:hover:text-white transition-colors" href="#">Media Kit</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-[#131722] dark:text-white tracking-wider uppercase">Legal</span>
            <a className="text-xs text-[#6A6D78] dark:text-[#b2b5be] hover:text-[#0049db] dark:hover:text-white transition-colors" href="#">Privacy Policy</a>
            <a className="text-xs text-[#6A6D78] dark:text-[#b2b5be] hover:text-[#0049db] dark:hover:text-white transition-colors" href="#">Terms of Use</a>
            <a className="text-xs text-[#6A6D78] dark:text-[#b2b5be] hover:text-[#0049db] dark:hover:text-white transition-colors" href="#">Disclaimer</a>
          </div>
        </div>
        <div className="max-w-[1600px] mx-auto border-t border-[#ebeef6] dark:border-[#2a2e39] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-md font-extrabold text-[#131722] dark:text-white tracking-tight">TradingView</div>
          <p className="text-xs text-[#6A6D78] dark:text-[#b2b5be]">© 2026 TradingView, Inc.</p>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-[#6A6D78] dark:text-[#b2b5be] cursor-pointer hover:text-[#0049db]">language</span>
            <span className="material-symbols-outlined text-[#6A6D78] dark:text-[#b2b5be] cursor-pointer hover:text-[#0049db]">share</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (Shown on small screens instead of sidebar) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1c2030] border-t border-[#dfe2ea] dark:border-[#2a2e39] z-50 flex justify-around items-center py-2 transition-colors duration-200">
        <div
          onClick={() => alert("Watchlist active. Scroll to 'Related Instruments' card to select different stocks!")}
          className="flex flex-col items-center text-[#0049db] cursor-pointer"
        >
          <span className="material-symbols-outlined">analytics</span>
          <span className="text-[10px] font-semibold">Markets</span>
        </div>
        <div
          onClick={() => {
            const el = document.getElementById("related-watchlist-sec");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex flex-col items-center text-[#6A6D78] dark:text-[#b2b5be] cursor-pointer"
        >
          <span className="material-symbols-outlined">list</span>
          <span className="text-[10px] font-semibold">Watchlist</span>
        </div>
        <div
          onClick={() => setIsProModalOpen(true)}
          className="flex flex-col items-center text-[#6A6D78] dark:text-[#b2b5be] cursor-pointer"
        >
          <span className="material-symbols-outlined">newspaper</span>
          <span className="text-[10px] font-semibold">Pro AI</span>
        </div>
        <div
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="flex flex-col items-center text-[#6A6D78] dark:text-[#b2b5be] cursor-pointer"
        >
          <span className="material-symbols-outlined">{isDarkMode ? "light_mode" : "dark_mode"}</span>
          <span className="text-[10px] font-semibold">Theme</span>
        </div>
      </nav>
    </div>
  );
}
