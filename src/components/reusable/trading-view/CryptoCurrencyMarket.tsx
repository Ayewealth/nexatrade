import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

const CryptoCurrencyMarketNoSSR = dynamic(
  () =>
    import("react-ts-tradingview-widgets").then(
      (mod) => mod.CryptoCurrencyMarket
    ),
  {
    ssr: false,
  }
);

// Then use it in your component:
export default function CryptoCurrencyMarket() {
  const { theme } = useTheme();
  return (
    <div className="bg-card rounded-md p-4">
      <CryptoCurrencyMarketNoSSR
        colorTheme={theme === "dark" ? "dark" : "light"}
        width="100%"
        height={400}
      />
    </div>
  );
}
