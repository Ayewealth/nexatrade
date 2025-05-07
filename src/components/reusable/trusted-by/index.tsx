import Image from "next/image";
import React from "react";

const trustedImages = [
  "/assets/logo-3.svg",
  "/assets/logo-2.svg",
  "/assets/logo-4.svg",
  "/assets/logo-9.svg",
  "/assets/logo-10.svg",
  "/assets/logo-5.svg",
] as const;

const TrustedBy = () => {
  return (
    <section className="container mt-12 animation-element-in-view">
      <h5 className="gd-text uppercase text-lg leading-[30px] text-center font-[Gorditas] font-bold">
        Trusted by industries leaders
      </h5>
      <div className="partner grayscale-item crypt-scroll in-view py-4 sm:py-5 lg:py-10">
        <div className="crypt-scrolling scroll-right">
          {/* Display images twice to create continuous scrolling effect */}
          {[...trustedImages, ...trustedImages].map((src, index) => (
            <div key={index}>
              <Image
                alt=""
                width={150}
                height={100}
                src={src}
                className="dark:grayscale-0 dark:invert-0 grayscale-100 invert-100 w-[80px] sm:w-[100px] md:[150px]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
