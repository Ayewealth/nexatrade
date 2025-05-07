import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";

const FAQS = () => {
  return (
    <section className="mx-auto max-w-sm px-4 pb-12 antialiased md:max-w-4xl md:px-8 lg:px-12">
      <div className="flex justify-center w-full mt-12 pt-2 animation-element-in-view">
        <div className="text-center">
          <h2 className="text-2xl sm:text-4xl sm:leading-12 font-medium font-[Gorditas]">
            FAQS
          </h2>
        </div>
      </div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="bg-card rounded-md mb-2.5">
          <AccordionTrigger className="font-[Gorditas] text-lg sm:text-xl bg-card">
            What is the minimum amount required to start trading?
          </AccordionTrigger>
          <AccordionContent className="bg-card pl-4">
            You can start trading with as little as $10, depending on the
            trading account type you choose. We recommend starting with an
            amount you&apos;re comfortable risking.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" className="bg-card rounded-md mb-2.5">
          <AccordionTrigger className="font-[Gorditas] text-lg sm:text-xl bg-card">
            Is my money safe on your platform?
          </AccordionTrigger>
          <AccordionContent className="bg-card pl-4">
            Yes. We use advanced encryption and secure payment gateways to
            protect your funds and personal data. Additionally, our platform
            complies with international trading and data protection standards.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3" className="bg-card rounded-md mb-2.5">
          <AccordionTrigger className="font-[Gorditas] text-lg sm:text-xl bg-card">
            Can I withdraw my profits anytime?
          </AccordionTrigger>
          <AccordionContent className="bg-card pl-4">
            Absolutely. You can withdraw your profits 24/7, and we process most
            withdrawal requests within 24–48 hours, depending on your payment
            method.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4" className="bg-card rounded-md mb-2.5">
          <AccordionTrigger className="font-[Gorditas] text-lg sm:text-xl bg-card">
            Do I need prior experience to start trading?
          </AccordionTrigger>
          <AccordionContent className="bg-card pl-4">
            No, you don&apos;t! Our platform is designed for both beginners and
            experienced traders, and we provide educational resources,
            tutorials, and demo accounts to help you get started confidently.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};

export default FAQS;
