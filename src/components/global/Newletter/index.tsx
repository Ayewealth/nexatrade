import { Input } from "@/components/ui/input";
import React from "react";

const Newletter = () => {
  return (
    <section
      className="container nl-bg mt-12 pb-12 pt-6 animation-element-in-view"
      id="contact"
    >
      <div className="row relative items-center justify-center">
        <div className="flex flex-col text-center mb-6 w-full">
          <h2 className="text-4xl leading-12 font-medium text-center uppercase mb-2 font-[Gorditas]">
            Join Our 💌 Newsletter!
          </h2>
          <p className="text-center m-auto text-base mt-2 text-[#6b7280]">
            Get updates, insights, and reports on the latest industry trends.
          </p>
        </div>
        <div className="newsletter-form sm:max-w-[655px] items-center text-center mt-6">
          <p className="mb-4 text-[#9ca3af] text-base">
            Don&apos;t be shy. You are one click away from always being up to
            date.
          </p>
          <form className="relative">
            <Input
              type="email"
              maxLength={50}
              id="exampleFormControlInput1"
              placeholder="Enter your email address"
            />
            <button>Subscribe</button>
          </form>
        </div>
        <div className="flex flex-row justify-center items-center text-center gap-1 mt-4 w-full">
          <svg
            width="24"
            height="24"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z"
              fill="#339af0"
              fill-opacity="0.23"
            ></path>
            <path
              d="M6.75 9L8.25 10.5L11.25 7.5"
              stroke="#339af0"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
          <h6 className="text-[14px] font-medium leading-6 text-[#6b7280]">
            You are subscribing to all our networks.
          </h6>
        </div>
      </div>
    </section>
  );
};

export default Newletter;
