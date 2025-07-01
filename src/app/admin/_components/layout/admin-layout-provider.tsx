"use client";

import { Sidebar, SidebarContext } from "@/components/reusable/sidebar";
import { SidebarRoutes } from "@/components/reusable/sidebar-routes";
import { useState } from "react";

import { TbLayoutDashboardFilled } from "react-icons/tb";
import DashboardMain from "./dashboard-main";
// Define sidebar routes
const routes = [
  {
    category: "Main",
    items: [
      {
        path: "/admin/home",
        icon: <TbLayoutDashboardFilled size={20} />,
        text: "Dashboard",
        alert: true,
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
