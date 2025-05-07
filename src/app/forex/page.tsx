"use client";

import AreaChart from "@/components/reusable/charts/area";
import TradingViewMarketOverview from "@/components/reusable/trading-view/Overview";
import TradingViewTicker from "@/components/reusable/trading-view/Ticker";
import TradingViewChart from "@/components/reusable/trading-view/TvChart";
import TradingViewWidget from "@/components/reusable/trading-view/Widget";
import { useState } from "react";

interface CurrencyPair {
  symbol: string;
  name: string;
}

const ForexDashboard: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>("FX:EURUSD");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [symbols, setSymbols] = useState<string[][]>([
    ["COINBASE:UNIUSD|1M|USD"],
    ["BINANCE:BTCUSDT|1D|USD"],
    ["BINANCE:ETHUSDT|1D|USD"],
  ]);

  const commonPairs: CurrencyPair[] = [
    { symbol: "FX:EURUSD", name: "EUR/USD" },
    { symbol: "FX:GBPUSD", name: "GBP/USD" },
    { symbol: "FX:USDJPY", name: "USD/JPY" },
    { symbol: "FX:AUDUSD", name: "AUD/USD" },
  ];

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Top Ticker */}
      <div className="w-full">
        <TradingViewTicker />
      </div>

      {/* Dashboard Header */}
      <header className="p-4 md:p-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-gorditas font-bold mb-4 md:mb-0">
            Forex <span className="gd-text">Dashboard</span>
          </h1>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="btn-gradient px-4 py-2 rounded-md"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          <TradingViewWidget symbols={symbols} />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6">
        {/* Currency Pair Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {commonPairs.map((pair) => (
            <button
              key={pair.symbol}
              onClick={() => setSelectedSymbol(pair.symbol)}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedSymbol === pair.symbol
                  ? "bg-gradient-to-r from-green-500 to-green-700 text-white"
                  : darkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-white hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {pair.name}
            </button>
          ))}
        </div>
        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-gorditas font-semibold">
                Chart Analysis
              </h2>
            </div>
            <div className="p-2">
              <TradingViewChart
                symbol={selectedSymbol}
                theme={darkMode ? "dark" : "light"}
                height={500}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-gorditas font-semibold">
                Market Overview
              </h2>
            </div>
            <div className="p-2">
              <TradingViewMarketOverview theme={darkMode ? "dark" : "light"} />
            </div>
          </div>
        </div>
        <main className="flex items-center justify-center">
          <div className="w-full p-4">
            <AreaChart />
          </div>
        </main>
      </main>
    </div>
  );
};

export default ForexDashboard;
