"use client";

import {
  Sidebar,
  SidebarContext,
  SidebarItem,
} from "@/components/reusable/sidebar";
import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  LifeBuoy,
  Package,
  Receipt,
  Settings,
  UserCircle,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import DashNav from "@/components/reusable/dash-nav";

// Define route configuration with paths and metadata organized by categories
const routes = [
  {
    category: "Main",
    items: [
      {
        path: "/dashboard/home",
        icon: <LayoutDashboard size={20} />,
        text: "Dashboard",
        alert: true,
      },
      {
        path: "/dashboard/statistics",
        icon: <BarChart3 size={20} />,
        text: "Statistics",
        alert: false,
      },
    ],
  },
  {
    category: "Management",
    items: [
      {
        path: "/dashboard/users",
        icon: <UserCircle size={20} />,
        text: "Users",
        alert: false,
      },
      {
        path: "/dashboard/inventory",
        icon: <Boxes size={20} />,
        text: "Inventory",
        alert: false,
      },
      {
        path: "/dashboard/orders",
        icon: <Package size={20} />,
        text: "Orders",
        alert: true,
      },
      {
        path: "/dashboard/billing",
        icon: <Receipt size={20} />,
        text: "Billing",
        alert: false,
      },
    ],
  },
  {
    category: "System",
    items: [
      {
        path: "/dashboard/settings",
        icon: <Settings size={20} />,
        text: "Settings",
        alert: false,
      },
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
  // Get current pathname to determine active route
  const pathname = usePathname();

  return (
    <main className="flex h-screen bg-background">
      <Sidebar>
        {routes.map((category, categoryIndex) => (
          <div key={`category-${categoryIndex}`} className="mb-4">
            {/* Category Label - Only visible when sidebar is expanded */}
            <SidebarContext.Consumer>
              {({ expanded }) => (
                <div
                  className={`category-label px-3 py-1 ${
                    expanded ? "block" : "hidden"
                  }`}
                >
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                    {category.category}
                  </span>
                </div>
              )}
            </SidebarContext.Consumer>

            {/* Items in this category */}
            {category.items.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="block"
                style={{ textDecoration: "none" }}
              >
                <SidebarItem
                  icon={item.icon}
                  text={item.text}
                  alert={item.alert}
                  active={pathname === item.path}
                />
              </Link>
            ))}

            {/* Add divider between categories except after the last one */}
            {categoryIndex < routes.length - 1 && (
              <hr className="my-2 border-border/50" />
            )}
          </div>
        ))}
      </Sidebar>
      <SidebarContext.Consumer>
        {({ expanded }) => (
          <div
            className={`flex-1 flex flex-col overflow-auto ${
              expanded
                ? "max-w-[calc(100% - 288px)]"
                : "max-w-[calc(100% - 68px)]"
            }`}
          >
            <DashNav />
            {children}
          </div>
        )}
      </SidebarContext.Consumer>
    </main>
  );
};

export default Layout;
