import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export function Testimonials() {
  const testimonials = [
    {
      quote:
        "Since switching to this platform, my trade executions have been faster and more accurate. It's a game-changer for serious forex traders.",
      name: "David Mensah",
      designation: "Full-Time Forex Trader",
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "The crypto signals and charting tools are incredibly reliable. I’ve seen a noticeable improvement in my portfolio's performance.",
      name: "Sophia Bennett",
      designation: "Crypto Analyst & Investor",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Managing multiple assets has never been easier. The UI is clean, and the real-time updates keep me ahead of the market.",
      name: "Jason Osei",
      designation: "Day Trader – Forex & Crypto",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "From accurate price alerts to technical indicators, this platform offers everything I need to make smart crypto trades daily.",
      name: "Victor Alade",
      designation: "Technical Analyst – Crypto Markets",
      src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "I’ve scaled my trading strategy thanks to this platform’s powerful insights and smooth user experience. Highly recommended.",
      name: "Samuel Nwoko",
      designation: "Professional Forex Coach",
      src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return <AnimatedTestimonials testimonials={testimonials} />;
}
