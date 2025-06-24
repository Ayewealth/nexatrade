"use client";

import { Sidebar, SidebarContext } from "@/components/reusable/sidebar";
import { SidebarRoutes } from "@/components/reusable/sidebar-routes";
import { useState } from "react";
import DashboardMain from "./dashbaord-main";

import { TbLayoutDashboardFilled } from "react-icons/tb";
import { PiHandWithdrawFill, PiHandDepositFill } from "react-icons/pi";
import { FaChartLine, FaUserCog } from "react-icons/fa";
import { MdCandlestickChart, MdWallet } from "react-icons/md";
import { LuHistory } from "react-icons/lu";
import { LifeBuoy } from "lucide-react";

// Define sidebar routes
const routes = [
  {
    category: "Main",
    items: [
      {
        path: "/dashboard/home",
        icon: <TbLayoutDashboardFilled size={20} />,
        text: "Dashboard",
        alert: true,
      },
      {
        path: "/dashboard/wallet",
        icon: <MdWallet size={20} />,
        text: "My Assets",
        alert: false,
      },
      {
        path: "/dashboard/trade",
        icon: <MdCandlestickChart size={20} />,
        text: "Trade Center",
        alert: false,
      },
      {
        path: "/dashboard/deposit",
        icon: <PiHandDepositFill size={20} />,
        text: "Deposit",
        alert: false,
      },
      {
        path: "/dashboard/withdraw",
        icon: <PiHandWithdrawFill size={20} />,
        text: "Withdraw",
        alert: false,
      },
      {
        path: "/dashboard/invest",
        icon: <FaChartLine size={20} />,
        text: "Investment Packages",
        alert: false,
      },
    ],
  },
  {
    category: "Management",
    items: [
      {
        path: "/dashboard/history",
        icon: <LuHistory size={20} />,
        text: "Order History",
        alert: false,
      },
      {
        path: "/dashboard/profile",
        icon: <FaUserCog size={20} />,
        text: "Profile",
        alert: false,
      },
    ],
  },
  {
    category: "System",
    items: [
      {
        path: "/dashboard/help",
        icon: <LifeBuoy size={20} />,
        text: "Help & Support",
        alert: false,
      },
    ],
  },
];
const Layout = ({ children }: { children: React.ReactNode }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <SidebarContext.Provider value={{ expanded }}>
      <div className="flex min-h-screen bg-background w-full overflow-hidden">
        <div className="flex-shrink-0">
          <Sidebar setExpanded={setExpanded} expanded={expanded}>
            <SidebarRoutes routes={routes} />
          </Sidebar>
        </div>

        <DashboardMain>{children}</DashboardMain>
      </div>
    </SidebarContext.Provider>
  );
};

export default Layout;
