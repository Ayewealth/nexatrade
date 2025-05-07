import FAQS from "@/components/global/faqs";
import HeroHeader from "@/components/global/hero-header";
import Highlights from "@/components/global/highlights";
import Newletter from "@/components/global/Newletter";
import ProductServices from "@/components/global/products-services";
import { ShowCase } from "@/components/global/showcase";
import { Testimonials } from "@/components/global/Testimonail";
import HowToGetStarted from "@/components/reusable/get-started";
import TrustedBy from "@/components/reusable/trusted-by";

export default function Home() {
  return (
    <>
      <HeroHeader />
      <TrustedBy />
      <ProductServices />
      <HowToGetStarted />
      <Highlights />
      <ShowCase />
      <Testimonials />
      <FAQS />
      <Newletter />
    </>
  );
}
