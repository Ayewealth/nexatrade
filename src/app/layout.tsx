import type { Metadata } from "next";
import { Poppins, Gorditas } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/global/theme";
import { Toaster } from "@/components/ui/sonner";
import { ReduxProvider } from "@/lib/redux/provider";
import { ReactQueryProvider } from "@/lib/react-query/provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});
const gorditas = Gorditas({
  subsets: ["latin"],
  weight: ["400", "700"], // Gorditas is only available in Regular (400) and Bold (700)
  variable: "--font-gorditas",
});

export const metadata: Metadata = {
  title: "NexaTrade",
  description:
    "NexaTrade is a cutting-edge platform for forex and crypto trading, offering real-time market analysis, secure transactions, and powerful trading tools for traders of all levels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${poppins.variable} ${gorditas.variable} font-[Poppins] antialiased`}
      >
        <ReduxProvider>
          <ReactQueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </ReactQueryProvider>
        </ReduxProvider>
        <Toaster />
      </body>
    </html>
  );
}
