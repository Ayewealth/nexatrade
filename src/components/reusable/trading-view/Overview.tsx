"use client";

import { useEffect, useRef } from "react";

interface MarketSymbol {
  s: string;
  d: string;
}

interface MarketTab {
  title: string;
  symbols: MarketSymbol[];
  originalTitle?: string;
}

interface MarketOverviewConfig {
  colorTheme: "light" | "dark";
  dateRange: string;
  showChart: boolean;
  locale: string;
  largeChartUrl: string;
  isTransparent: boolean;
  showSymbolLogo: boolean;
  showFloatingTooltip: boolean;
  width: string;
  height: string;
  plotLineColorGrowing: string;
  plotLineColorFalling: string;
  gridLineColor: string;
  scaleFontColor: string;
  belowLineFillColorGrowing: string;
  belowLineFillColorFalling: string;
  belowLineFillColorGrowingBottom: string;
  belowLineFillColorFallingBottom: string;
  symbolActiveColor: string;
  tabs: MarketTab[];
}

interface TradingViewMarketOverviewProps {
  theme?: "light" | "dark";
}

const TradingViewMarketOverview: React.FC<TradingViewMarketOverviewProps> = ({
  theme = "light",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.async = true;

    const config: MarketOverviewConfig = {
      colorTheme: theme,
      dateRange: "12M",
      showChart: true,
      locale: "en",
      largeChartUrl: "",
      isTransparent: false,
      showSymbolLogo: true,
      showFloatingTooltip: false,
      width: "100%",
      height: "660",
      plotLineColorGrowing: "rgba(41, 98, 255, 1)",
      plotLineColorFalling: "rgba(41, 98, 255, 1)",
      gridLineColor: "rgba(240, 243, 250, 0)",
      scaleFontColor: "rgba(106, 109, 120, 1)",
      belowLineFillColorGrowing: "rgba(41, 98, 255, 0.12)",
      belowLineFillColorFalling: "rgba(41, 98, 255, 0.12)",
      belowLineFillColorGrowingBottom: "rgba(41, 98, 255, 0)",
      belowLineFillColorFallingBottom: "rgba(41, 98, 255, 0)",
      symbolActiveColor: "rgba(41, 98, 255, 0.12)",
      tabs: [
        {
          title: "Forex",
          symbols: [
            {
              s: "FX:EURUSD",
              d: "EUR/USD",
            },
            {
              s: "FX:GBPUSD",
              d: "GBP/USD",
            },
            {
              s: "FX:USDJPY",
              d: "USD/JPY",
            },
            {
              s: "FX:AUDUSD",
              d: "AUD/USD",
            },
            {
              s: "FX:USDCAD",
              d: "USD/CAD",
            },
          ],
          originalTitle: "Forex",
        },
        {
          title: "Crypto",
          symbols: [
            {
              s: "BINANCE:BTCUSDT",
              d: "Bitcoin",
            },
            {
              s: "BINANCE:ETHUSDT",
              d: "Ethereum",
            },
            {
              s: "BINANCE:SOLUSDT",
              d: "Solana",
            },
          ],
        },
      ],
    };

    script.innerHTML = JSON.stringify(config);

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [theme]);

  return (
    <div className="tradingview-widget-container" ref={containerRef}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};

export default TradingViewMarketOverview;
