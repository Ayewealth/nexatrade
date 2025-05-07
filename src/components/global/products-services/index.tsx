import Image from "next/image";
import React from "react";

const products = [
  {
    title: "Spot Trading",
    description:
      "Trade cryptocurrencies directly at their current market price with immediate settlement and delivery.",
    image: "/assets/spot.svg",
    imageClass: "",
  },
  {
    title: "Buy Crypto",
    description:
      "Purchase cryptocurrencies easily using multiple payment methods and start your crypto journey.",
    image: "/assets/funding.svg",
    imageClass: "",
  },
  {
    title: "Trading Bot",
    description:
      "Automate your trading strategies with our advanced algorithmic trading bots for optimal performance.",
    image: "/assets/bot.svg",
    imageClass: "",
  },
  {
    title: "NexaTrade Earns",
    description:
      "Earn passive income by staking or lending your crypto assets on our secure platform.",
    image: "/assets/icon-20.svg",
    imageClass: "dark:grayscale-0 dark:invert-0 grayscale-100 invert-100",
  },
  {
    title: "Margin Trading",
    description:
      "Trade with leverage using borrowed funds to maximize your potential returns in the crypto market.",
    image: "/assets/icon-23.svg",
    imageClass: "dark:grayscale-0 dark:invert-0 grayscale-100 invert-100",
  },
  {
    title: "Futures Trading",
    description:
      "Trade cryptocurrency derivatives contracts with leverage for potential future price movements.",
    image: "/assets/icon-21.svg",
    imageClass: "dark:grayscale-0 dark:invert-0 grayscale-100 invert-100",
  },
];

const ProductServices = () => {
  return (
    <section className="container mt-12" id="features">
      <div className="flex justify-center w-full mt-12 pt-2 animation-element-in-view">
        <div className="text-center">
          <h2 className="sm:text-4xl text-2xl sm:leading-12 font-medium font-[Gorditas]">
            Explore NexaTrade{" "}
            <span className="gd-text">Products & Services</span>
          </h2>
        </div>
      </div>
      <div className="row mt-6 sm:mt-12 pt-2 flex flex-wrap">
        {products.map((product, index) => (
          <div
            key={index}
            className="mb-6 xl:flex-none xl:w-[33.33333333%] lg:flex-none lg:w-[33.33333333%] transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <div className="flex card p-6 gap-4">
              <div>
                <h4 className="font-medium mb-4 font-[Gorditas]">
                  {product.title}
                </h4>
                <p className="card-text text-[13px] sm:text-[15px] font-normal">
                  {product.description}
                </p>
              </div>
              <Image
                src={product.image}
                alt={product.title}
                width={140}
                height={50}
                className={`mt-6 w-[100px] ${product.imageClass}`}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductServices;
