import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

// Dynamically import MarketOverview with SSR turned off
const MarketOverviewNoSSR = dynamic(
  () =>
    import("react-ts-tradingview-widgets").then((mod) => mod.MarketOverview),
  { ssr: false }
);

const tabs = [
  {
    title: "Indices",
    symbols: [
      {
        s: "FOREXCOM:SPXUSD",
        d: "S&P 500",
      },
      {
        s: "FOREXCOM:NSXUSD",
        d: "Nasdaq 100",
      },
      {
        s: "FOREXCOM:DJI",
        d: "Dow 30",
      },
      {
        s: "INDEX:NKY",
        d: "Nikkei 225",
      },
      {
        s: "INDEX:DEU30",
        d: "DAX Index",
      },
      {
        s: "FOREXCOM:UKXGBP",
        d: "UK 100",
      },
    ],
    originalTitle: "Indices",
  },
  {
    title: "Cryptocurrencies",
    symbols: [
      {
        s: "BITSTAMP:BTCUSD",
        d: "Bitcoin",
      },
      {
        s: "BITSTAMP:ETHUSD",
        d: "Ethereum",
      },
      {
        s: "BINANCE:BNBUSD",
        d: "Binance Coin",
      },
      {
        s: "BINANCE:SOLUSD",
        d: "Solana",
      },
      {
        s: "COINBASE:XRPUSD",
        d: "XRP",
      },
      {
        s: "BINANCE:ADAUSD",
        d: "Cardano",
      },
    ],
    originalTitle: "Cryptocurrencies",
  },
  {
    title: "Forex",
    symbols: [
      {
        s: "FX:EURUSD",
      },
      {
        s: "FX:GBPUSD",
      },
      {
        s: "FX:USDJPY",
      },
      {
        s: "FX:USDCHF",
      },
      {
        s: "FX:AUDUSD",
      },
      {
        s: "FX:USDCAD",
      },
    ],
    originalTitle: "Forex",
  },
];

// Use the dynamically imported component
export default function MarketOverviewWidget() {
  const { theme } = useTheme();
  return (
    <div className="bg-card rounded-md p-4">
      <MarketOverviewNoSSR
        colorTheme={theme === "dark" ? "dark" : "light"}
        height={400}
        width="100%"
        showFloatingTooltip
        tabs={tabs}
      />
    </div>
  );
}
