"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    TradingView: {
      widget: new (config: TradingViewWidgetConfig) => any;
    };
  }
}

interface TradingViewWidgetConfig {
  autosize: boolean;
  symbol: string;
  interval: string;
  timezone: string;
  theme: string;
  style: string;
  locale: string;
  toolbar_bg: string;
  enable_publishing: boolean;
  hide_side_toolbar: boolean;
  allow_symbol_change: boolean;
  container_id: string;
}

interface TradingViewChartProps {
  symbol?: string;
  theme?: "light" | "dark";
  width?: string | number;
  height?: number;
  interval?: string;
  timezone?: string;
  style?: string;
  locale?: string;
  toolbar_bg?: string;
  enable_publishing?: boolean;
  hide_side_toolbar?: boolean;
  allow_symbol_change?: boolean;
  className?: string;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({
  symbol = "NASDAQ:AAPL",
  theme = "light",
  width = "100%",
  height = 500,
  interval = "D",
  timezone = "Etc/UTC",
  style = "1", // Candles
  locale = "en",
  toolbar_bg = "#f1f3f6",
  enable_publishing = false,
  hide_side_toolbar = false,
  allow_symbol_change = true,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol,
          interval,
          timezone,
          theme,
          style,
          locale,
          toolbar_bg,
          enable_publishing,
          hide_side_toolbar,
          allow_symbol_change,
          container_id: "tradingview-chart",
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [
    symbol,
    theme,
    interval,
    timezone,
    style,
    locale,
    toolbar_bg,
    enable_publishing,
    hide_side_toolbar,
    allow_symbol_change,
  ]);

  return (
    <div
      className={cn("tradingview-chart-container", className)}
      style={{ height }}
    >
      <div
        id="tradingview-chart"
        ref={containerRef}
        style={{ height: "100%", width }}
      />
    </div>
  );
};

export default TradingViewChart;
