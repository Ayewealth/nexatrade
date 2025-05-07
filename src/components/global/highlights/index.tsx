"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ChartCandlestick } from "lucide-react";

const Highlights = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState("dark");

  // Wait for mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Set the current theme once mounted
  useEffect(() => {
    if (!mounted) return;

    const activeTheme = theme === "system" ? systemTheme : theme;
    setCurrentTheme(activeTheme === "dark" ? "dark" : "light");
  }, [theme, systemTheme, mounted]);

  // Main TradingView widget setup
  useEffect(() => {
    if (!mounted) return;

    const setupMainWidget = () => {
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbols: [
          ["BINANCE:ETHUSDT|1M"],
          ["BINANCE:NEARUSDT|1M"],
          ["BINANCE:BTCUSDT|1M"],
          ["BINANCE:LINKUSDT|1M"],
          ["BINANCE:BNBUSDT|1M"],
          ["BINANCE:DOGEUSDT|1M"],
          ["BINANCE:SUIUSDT|1M"],
          ["BINANCE:FTMUSDT|1M"],
          ["BINANCE:SOLUSDT|1M"],
        ],
        chartOnly: false,
        width: "100%",
        height: 373,
        colorTheme: currentTheme, // Dynamic theme
        showVolume: true,
        showMA: true,
        hideDateRanges: false,
        hideMarketStatus: false,
        hideSymbolLogo: false,
        scalePosition: "right",
        scaleMode: "Normal",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
        fontSize: "14",
        noTimeScale: false,
        valuesTracking: "3",
        changeMode: "price-and-percent",
        chartType: "area",
        maLineColor: "#2962FF",
        maLineWidth: 1,
        maLength: 9,
        headerFontSize: "medium",
        backgroundColor: "rgba(19, 23, 34, 0)",
        lineType: 0,
        dateRanges: ["1d|1", "5d|5", "1m|30", "1D|1D", "60m|1W", "all|1M"],
        upColor: "#22ab94",
        downColor: "#f7525f",
        borderUpColor: "#22ab94",
        borderDownColor: "#f7525f",
        wickUpColor: "#22ab94",
        wickDownColor: "#f7525f",
      });

      const container = document.getElementById("tradingview-widget");
      if (container) {
        container.innerHTML = "";
        container.appendChild(script);
      }
    };

    setupMainWidget();

    // Clean up function
    return () => {
      const container = document.getElementById("tradingview-widget");
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [currentTheme, mounted]); // Re-run when theme changes

  // List of cryptocurrencies for the single quote widgets
  const cryptoList = [
    "BINANCE:BTCUSD",
    "BINANCE:NEARUSD",
    "BINANCE:BNBUSD",
    "BINANCE:DOGEUSD",
    "BINANCE:FTMUSD",
    "BINANCE:ETHUSD",
  ];

  // Function to create iframe HTML for single quote widget
  const createSingleQuoteWidget = (symbol) => {
    return {
      __html: `
        <iframe 
          scrolling="no" 
          allowtransparency="true" 
          frameborder="0" 
          src="https://www.tradingview-widget.com/embed-widget/single-quote/?locale=en#%7B%22symbol%22%3A%22${symbol}%22%2C%22width%22%3A%22100%25%22%2C%22isTransparent%22%3Atrue%2C%22colorTheme%22%3A%22${currentTheme}%22%2C%22height%22%3A126%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22single-quote%22%7D" 
          title="single quote TradingView widget" 
          lang="en" 
          style="user-select: none; box-sizing: border-box; display: block; height: 100%; width: 100%;">
        </iframe>
      `,
    };
  };

  // If not mounted yet, show a loading placeholder for SSR
  if (!mounted) {
    return (
      <section className="container mt-12 animate-pulse">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="h-8 card rounded w-64"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card p-4 rounded-xl card h-96"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="card p-4 rounded-xl card h-32"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container mt-12">
      <div className="flex justify-start items-center gap-2 mb-6">
        <ChartCandlestick className="text-[#22c55e]" />
        <h2 className="text-2xl sm:text-4xl font-medium font-[Gorditas]">
          Crypto Highlights
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: TradingView Widget */}
        <div className="lg:col-span-2 card p-4 rounded-xl shadow-lg">
          <div className="tradingview-widget-container" id="tradingview-widget">
            {/* Widget gets inserted here */}
          </div>
        </div>

        {/* Right: Single Quote Widgets Grid */}
        <div className="grid grid-cols-2 gap-4">
          {cryptoList.map((symbol, index) => (
            <div
              key={index}
              className="tradingview-widget-container card rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              style={{ width: "100%", height: "126px" }}
            >
              <div
                className="w-full h-full"
                dangerouslySetInnerHTML={createSingleQuoteWidget(symbol)}
              />

              {/* TradingView widget copyright style */}
              <style
                dangerouslySetInnerHTML={{
                  __html: `
                  .tradingview-widget-copyright {
                    font-size: 13px !important;
                    line-height: 32px !important;
                    text-align: center !important;
                    vertical-align: middle !important;
                    font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif !important;
                    color: ${
                      currentTheme === "dark" ? "#B2B5BE" : "#787B86"
                    } !important;
                  }
                  .tradingview-widget-copyright .blue-text {
                    color: #2962FF !important;
                  }
                  .tradingview-widget-copyright a {
                    text-decoration: none !important;
                    color: ${
                      currentTheme === "dark" ? "#B2B5BE" : "#787B86"
                    } !important;
                  }
                  .tradingview-widget-copyright a:visited {
                    color: ${
                      currentTheme === "dark" ? "#B2B5BE" : "#787B86"
                    } !important;
                  }
                  .tradingview-widget-copyright a:hover .blue-text {
                    color: #1E53E5 !important;
                  }
                  .tradingview-widget-copyright a:active .blue-text {
                    color: #1848CC !important;
                  }
                  .tradingview-widget-copyright a:visited .blue-text {
                    color: #2962FF !important;
                  }
                `,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Highlights;
