"use client";

import React from "react";
import Image from "next/image";
import { WobbleCard } from "@/components/ui/wobble-card";

export function ShowCase() {
  return (
    <div className="container mt-12">
      <div className="flex justify-center w-full mt-12 pt-2 animation-element-in-view">
        <div className="text-center">
          <h2 className="text-2xl sm:text-4xl sm:leading-12 font-medium font-[Gorditas]">
            Trade <span className="gd-text1">Anywhere</span>,{" "}
            <span className="gd-text">Anytime</span>
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6 sm:mt-12">
        <WobbleCard
          containerClassName="col-span-1 lg:col-span-2 h-full bg-[--card] min-h-[500px] lg:min-h-[300px]"
          className=""
        >
          <div className="max-w-xs">
            <h2 className="text-[--foreground] text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em]">
              Real-time Charting
            </h2>
            <p className="mt-4 text-left text-[0.9rem] text-[--muted]">
              Visualize market movements as they happen with dynamic,
              high-performance charts. Track price changes, analyze trends, and
              apply technical indicators in real time to make informed trading
              decisions.
            </p>
          </div>
          <Image
            src="/assets/linear.webp"
            width={500}
            height={500}
            alt="linear demo image"
            className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
          />
        </WobbleCard>
        <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-[--card]">
          <h2 className="max-w-80 text-[--foreground] text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em]">
            Market News Feed
          </h2>
          <p className="mt-4 text-left text-[0.9rem] text-[--muted]">
            Stay ahead of the market with a continuously updated feed of
            financial news. Get breaking headlines, economic updates, and expert
            insights that can impact your trading strategy — all in one place.
          </p>
        </WobbleCard>
        <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-[--card] min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
          <div className="max-w-sm">
            <h2 className="max-w-sm md:max-w-lg text-[--foreground] text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em]">
              Trade Execution Screen
            </h2>
            <p className="mt-4 text-left text-[0.9rem] text-[--muted]">
              Execute buy and sell orders swiftly through an intuitive and
              responsive interface. Access real-time pricing, manage order
              types, and monitor open positions seamlessly, ensuring efficient
              and precise trade execution.
            </p>
          </div>
          <Image
            src="/assets/linear.webp"
            width={500}
            height={500}
            alt="linear demo image"
            className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
          />
        </WobbleCard>
      </div>
    </div>
  );
}
