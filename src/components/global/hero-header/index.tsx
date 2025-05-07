import { Nav } from "@/components/global/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import TradingViewTicker from "@/components/reusable/trading-view/Ticker";

const HeroHeader = () => {
  return (
    <section className="">
      <Nav />
      <div className="container-fluid animation-element-in-view pepe-hero hero-temp2 top-0 dark:bg-[url('/assets/bg.jpg')] dark:bg-top dark:bg-cover dark:bg-no-repeat dark:filter dark:invert-0 dark:grayscale-0">
        <div className="container">
          <div className="row pb-6 md:pb-12">
            <div className="row mt-6 md:mt-12 pt-6 md:pt-12 pb-6 md:pb-12 z-1">
              <h1 className="font-bold text-4xl md:text-6xl lg:text-8xl leading-tight lg:leading-[100px] md:leading-20 pt-6 lg:pt-12 mb-4 lg:mb-6 mt-6 lg:mt-12">
                Shaping the Future of <span className="gd-text1">Crypto</span> &
                <span className="gd-text"> Forex</span>
              </h1>
              <p className="text-sm md:text-lg lg:text-[22px]">
                Experience lightning-fast execution, tight spreads, and a secure
                trading environment — all in one platform.
              </p>
              <div className="flex mt-4 md:mt-6">
                <Link href={"/signup"}>
                  <Button className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-500 text-white font-semibold py-2 md:py-3 px-4 md:px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0.5 font-[Gorditas] cursor-pointer text-sm md:text-base">
                    Start Trading
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex flex-row gap-4 md:gap-6 mb-4 md:mb-6">
              <div className="text-white">
                <h4 className="text-white text-xl md:text-2xl">$12.46B+</h4>
                <p className="mt-1 md:mt-2 text-xs md:text-base">
                  24h Trading Volume
                </p>
              </div>
              <div className="text-white">
                <h4 className="text-white text-xl md:text-2xl">2600+</h4>
                <p className="mt-1 md:mt-2 text-xs md:text-base">
                  Cryptocurrencies
                </p>
              </div>
              <div className="text-white">
                <h4 className="text-white text-xl md:text-2xl">150%</h4>
                <p className="mt-1 md:mt-2 text-xs md:text-base">
                  Simple Earn APR
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <TradingViewTicker />
        </div>
      </div>
    </section>
  );
};

export default HeroHeader;
