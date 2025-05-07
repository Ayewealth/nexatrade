"use client";

import AreaChart from "@/components/reusable/charts/area";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const Page = () => {
  const [hideFigures, setHideFigures] = useState(false);

  const toggleFigures = () => {
    setHideFigures((prev) => !prev);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex lg:flex-nowrap flex-wrap gap-2 mb-2">
        <div className="lg:w-[75%] w-full">
          <div className="overflow-hidden rounded-lg bg-card transition-all p-4 h-full">
            {/* Profile */}
            <div className="row items-center p-2">
              <div className="w-full flex gap-4">
                <div className="pb-2">
                  <Image
                    src="/assets/user.jpg"
                    alt="User"
                    width={120}
                    height={120}
                    className="object-cover rounded-[20px] w-[120px] h-[120px]"
                  />
                </div>
                <div className="pb-2">
                  <h4 className="font-[Gorditas] font-bold text-[24px] leading-8 mb-2">
                    Hello, johndoe@gmail.com
                  </h4>
                  <p className="text-sm pb-2 text-[#4b5563]">
                    Last Login: 12-15-2024 16:13:15 USA
                  </p>
                  <div className="gd-bg w-fit">
                    <div className="flex gap-2 mb-2 verified items-center">
                      <p className="text-xs text-[#4b5563]">UID:</p>
                      <p className="text-xs text-primary">35403204</p>
                      <Copy
                        className="text-[#6b7280] h-3 w-3 cursor-pointer"
                        onClick={() => {
                          navigator.clipboard.writeText("35403204");
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* total assets */}
            <div className="card-bs-tabs mt-4 p-6 dark:bg-[#030507]">
              <div className="row">
                <div className="lg:w-[50%] w-full">
                  <div className="flex gap-1 items-center">
                    <h5 className="font-[Gorditas] text-lg leading-5 mb-1">
                      Total Assets
                    </h5>
                    <div className="link-secondary">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="cursor-pointer"
                        onClick={toggleFigures}
                      >
                        <path
                          opacity="0.4"
                          d="M21.25 9.15005C18.94 5.52005 15.56 3.43005 12 3.43005C10.22 3.43005 8.49 3.95005 6.91 4.92005C5.33 5.90005 3.91 7.33005 2.75 9.15005C1.75 10.7201 1.75 13.2701 2.75 14.8401C5.06 18.4801 8.44 20.5601 12 20.5601C13.78 20.5601 15.51 20.0401 17.09 19.0701C18.67 18.0901 20.09 16.6601 21.25 14.8401C22.25 13.2801 22.25 10.7201 21.25 9.15005ZM12 16.0401C9.76 16.0401 7.96 14.2301 7.96 12.0001C7.96 9.77005 9.76 7.96005 12 7.96005C14.24 7.96005 16.04 9.77005 16.04 12.0001C16.04 14.2301 14.24 16.0401 12 16.0401Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M12.0004 9.14001C10.4304 9.14001 9.15039 10.42 9.15039 12C9.15039 13.57 10.4304 14.85 12.0004 14.85C13.5704 14.85 14.8604 13.57 14.8604 12C14.8604 10.43 13.5704 9.14001 12.0004 9.14001Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-[Gorditas] font-bold text-[40px] leading-12">
                      {hideFigures ? "****" : "4.55"}
                    </h5>
                    <div>
                      <select className="bg-input dark:bg-[#030507] text-[#6b7280] text-sm font-normal border-0 py-[5px] pr-[34px] pl-[10px] cursor-pointer whitespace-nowrap rounded-md">
                        <option selected value="BTC">
                          BTC
                        </option>
                        <option value="ETH">ETH</option>
                        <option value="BNB">BNB</option>
                        <option value="USDT">USDT</option>
                      </select>
                    </div>
                  </div>
                  <h6 className="text-[#374151] text-sm font-medium leading-6 mb-2">
                    ≈ $0.00
                  </h6>
                </div>
                <div className="lg:w-[50%] w-full">
                  <div className="flex items-center justify-end">
                    <Button className="bg-[#00c288] text-white hover:bg-[#22c55e] cursor-pointer rounded-md">
                      Withdraw
                    </Button>
                  </div>
                  <div className="mt-2">
                    <AreaChart />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-[25%] w-full">
          <div className="h-full transition-all p-4 overfull-hidden rounded-[6px] bg-card">
            <h5 className="text-primary font-[Gorditas] font-bold text-[18px] mb-2 leading-6">
              Deposit or trade
            </h5>
            <p className="text-[#9ca3af] mb-4 text-xs">
              You don&apos;t currently have assets? you can Deposit right now or
              if you do then you can trade.
            </p>
            <div className="row gap-2">
              <div className="flex-none w-full">
                <div className="overflow-hidden rounded-[6px] transition-all border-0 bg-gradient-to-r from-pink-300 to-rose-500 p-4 mt-2 justify-between flex">
                  <div className="flex flex-col">
                    <div className="flex gap-2">
                      <div>
                        <Image
                          src="/assets/deposit.svg"
                          width={38}
                          height={38}
                          alt="deposit"
                        />
                      </div>
                      <p className="text-[#111827] font-[Gorditas] font-bold text-lg">
                        Deposit
                      </p>
                    </div>
                    <p className="text-[#111827] text-sm font-normal leading-5 mb-4">
                      Deposit crypto to start trading
                    </p>
                  </div>
                  <div>
                    <Button className="bg-white text-black rounded-[6px] border-0 py-[6px] px-[24px] text-[14px] transition-all cursor-pointer">
                      Deposit
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex-none w-full">
                <div className="overflow-hidden rounded-[6px] transition-all border-0 bg-gradient-to-r from-green-200 to-green-500 p-4 mt-2 justify-between flex">
                  <div className="flex flex-col">
                    <div className="flex gap-2">
                      <div>
                        <Image
                          src="/assets/margin.svg"
                          width={38}
                          height={38}
                          alt="deposit"
                        />
                      </div>
                      <p className="text-[#111827] font-[Gorditas] font-bold text-lg">
                        Trade
                      </p>
                    </div>
                    <p className="text-[#111827] text-sm font-normal leading-5 mb-4">
                      With the money you have in your account, you can trade.
                    </p>
                  </div>
                  <div>
                    <Button className="bg-[#fff] text-black rounded-[6px] border-0 py-[6px] px-[24px] text-[14px] transition-all cursor-pointer">
                      Trade
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
