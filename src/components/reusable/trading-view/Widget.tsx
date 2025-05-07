"use client";

import { useEffect, useRef } from "react";

interface SymbolOverviewProps {
  symbols: string[][];
}

interface CompareSymbol {
  symbol: string;
  lineColor: string;
  lineWidth: number;
  showLabels: boolean;
}

interface SymbolOverviewConfig {
  symbols: string[][];
  chartOnly: boolean;
  width: string | number;
  height: string | number;
  colorTheme: "light" | "dark";
  showVolume: boolean;
  showMA: boolean;
  hideDateRanges: boolean;
  hideMarketStatus: boolean;
  hideSymbolLogo: boolean;
  scalePosition: "no" | "left" | "right";
  scaleMode: "Normal" | "Logarithmic" | "Percentage";
  fontFamily: string;
  fontSize: string;
  noTimeScale: boolean;
  valuesTracking: string;
  changeMode: "price-and-percent" | "price" | "percent";
  chartType: "area" | "line" | "candlesticks" | "bars";
  maLineColor: string;
  maLineWidth: number;
  maLength: number;
  headerFontSize: "normal" | "large" | "small";
  backgroundColor: string;
  lineWidth: number;
  lineType: number;
  compareSymbol: CompareSymbol;
  dateRanges: string[];
}

const TradingViewSymbolOverview: React.FC<SymbolOverviewProps> = ({
  symbols,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existingScript = document.getElementById(
      "tradingview-symbol-overview-script"
    );
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.id = "tradingview-symbol-overview-script";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.async = true;

    const config: SymbolOverviewConfig = {
      symbols: symbols,
      chartOnly: false,
      width: "100%",
      height: 320,
      colorTheme: "dark",
      showVolume: true,
      showMA: true,
      hideDateRanges: true,
      hideMarketStatus: false,
      hideSymbolLogo: false,
      scalePosition: "no",
      scaleMode: "Normal",
      fontFamily:
        "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
      fontSize: "10",
      noTimeScale: false,
      valuesTracking: "1",
      changeMode: "price-and-percent",
      chartType: "area",
      maLineColor: "#2962FF",
      maLineWidth: 1,
      maLength: 9,
      headerFontSize: "normal",
      backgroundColor: "#131722",
      lineWidth: 2,
      lineType: 0,
      compareSymbol: {
        symbol: "BINANCE:UNIUSDT",
        lineColor: "#FF9800",
        lineWidth: 2,
        showLabels: true,
      },
      dateRanges: ["1d|1", "1m|30"],
    };

    script.innerHTML = JSON.stringify(config);

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbols]);

  return (
    <div
      className="tradingview-widget-container w-full p-4 mb-4 card rounded-2xl"
      style={{ height: 320 }}
      ref={containerRef}
    >
      <div className="tradingview-widget-container__widget" />
    </div>
  );
};

export default TradingViewSymbolOverview;
