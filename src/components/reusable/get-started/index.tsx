import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import React from "react";

const HowToGetStarted = () => {
  return (
    <section className="container mt-12">
      <div className="row items-center">
        <div className="p-6 sm:p-12 pr-12 pl-12 xl:flex-none xl:w-[58.33333333%] lg:flex-none lg:w-[66.66666667%] md:flex-none md:w-[66.66666667%]">
          <div className="pb-6">
            <h2 className="text-2xl sm:text-4xl sm:leading-12 font-medium font-[Gorditas] mb-2">
              How to Get Started
            </h2>
            <p className="my-4 text-[#6b7280] text-sm sm:text-base">
              You can receive your payments in your digital wallet in crypto or
              <br />
              in your bank account in fiat — it’s your choice.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="bg-card rounded-md mb-2.5">
              <AccordionTrigger className="font-[Gorditas] text-lg sm:text-xl bg-card">
                Create an account
              </AccordionTrigger>
              <AccordionContent className="bg-card pl-4">
                Yes. To get started you will sign up and go through all the
                verification process.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="bg-card rounded-md mb-2.5">
              <AccordionTrigger className="font-[Gorditas] text-lg sm:text-xl bg-card">
                Select what you want to trade.
              </AccordionTrigger>
              <AccordionContent className="bg-card pl-4">
                Yes. After signing in to your dashboard you can pick what you
                want to trade on and place a trade with the guidance of your
                mentor.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="bg-card rounded-md mb-2.5">
              <AccordionTrigger className="font-[Gorditas] text-lg sm:text-xl bg-card">
                Place a trade and monitor.
              </AccordionTrigger>
              <AccordionContent className="bg-card pl-4">
                Yes. After picking what you want to trade you can place a trade
                and monitor you profit.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="xl:flex-none xl:w-[41.66666667%] lg:flex-none lg:w-[33.33333333%] md:flex-none md:w-[33.33333333%]">
          <Image
            src="/assets/crypt02.png"
            alt="How to get started"
            width={100}
            height={100}
            className="w-full dark:grayscale-0 dark:invert-0 grayscale-100 invert-100 align-middle"
          />
        </div>
      </div>
    </section>
  );
};

export default HowToGetStarted;
