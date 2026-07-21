import React from "react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export default function Sidebar({ activeTab, setActiveTab, isDarkMode, setIsDarkMode }: SidebarProps) {
  const primaryButtons = [
    { id: "watchlist", icon: "list", label: "Watchlist" },
    { id: "notifications", icon: "notifications", label: "Alerts" },
    { id: "news", icon: "newspaper", label: "News" },
    { id: "analytics", icon: "analytics", label: "Analytics" },
    { id: "trending", icon: "trending_up", label: "Trending" },
  ];

  return (
    <aside className="fixed right-0 top-16 bottom-0 w-16 bg-white dark:bg-[#131722] border-l border-[#dfe2ea] dark:border-[#2a2e39] flex flex-col items-center py-4 z-40 hidden md:flex transition-colors duration-200">
      {/* Top action icons */}
      <div className="flex flex-col gap-5 items-center w-full">
        {primaryButtons.map((btn) => {
          const isActive = activeTab === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => setActiveTab(btn.id)}
              title={btn.label}
              className={`p-2.5 rounded-xl transition-all relative group cursor-pointer ${
                isActive
                  ? "text-[#0049db] bg-[#f0f3fa] dark:bg-[#1e222d] font-semibold"
                  : "text-[#6A6D78] hover:text-[#131722] hover:bg-[#f8f9ff] dark:hover:text-white dark:hover:bg-[#1e222d]"
              }`}
            >
              {/* Active edge bar */}
              {isActive && (
                <div className="absolute right-0 top-1/4 bottom-1/4 w-0.5 bg-[#0049db] rounded-l" />
              )}
              <span className={`material-symbols-outlined text-[22px] ${isActive ? "material-symbols-fill" : ""}`}>
                {btn.icon}
              </span>
              
              {/* Tooltip */}
              <span className="absolute right-full mr-2 px-2 py-1 text-xs font-medium text-white bg-slate-800 dark:bg-slate-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
                {btn.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom config icons */}
      <div className="mt-auto flex flex-col gap-4 items-center w-full">
        {/* Dark Mode toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="p-2.5 text-[#6A6D78] hover:text-[#0049db] hover:bg-[#f8f9ff] dark:hover:bg-[#1e222d] rounded-xl transition-all cursor-pointer group relative"
        >
          <span className="material-symbols-outlined text-[22px]">
            {isDarkMode ? "light_mode" : "dark_mode"}
          </span>
          <span className="absolute right-full mr-2 px-2 py-1 text-xs font-medium text-white bg-slate-800 dark:bg-slate-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </span>
        </button>

        <button className="p-2.5 text-[#6A6D78] hover:text-primary rounded-xl hover:bg-[#f8f9ff] dark:hover:bg-[#1e222d] transition-all cursor-pointer">
          <span className="material-symbols-outlined text-[22px]">settings</span>
        </button>
        <button className="p-2.5 text-[#6A6D78] hover:text-primary rounded-xl hover:bg-[#f8f9ff] dark:hover:bg-[#1e222d] transition-all cursor-pointer">
          <span className="material-symbols-outlined text-[22px]">help</span>
        </button>
      </div>
    </aside>
  );
}
