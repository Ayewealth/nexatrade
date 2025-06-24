"use client";

import { SidebarContext, SidebarItem } from "@/components/reusable/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface RouteItem {
  path: string;
  icon: React.ReactNode;
  text: string;
  alert?: boolean;
}

interface Category {
  category: string;
  items: RouteItem[];
}

export const SidebarRoutes = ({ routes }: { routes: Category[] }) => {
  const pathname = usePathname();

  return (
    <>
      {routes.map((category, index) => (
        <div key={index} className="mb-4">
          <SidebarContext.Consumer>
            {({ expanded }) => (
              <div className={`px-3 py-1 ${expanded ? "block" : "hidden"}`}>
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                  {category.category}
                </span>
              </div>
            )}
          </SidebarContext.Consumer>

          {category.items.map((item) => (
            <Link key={item.path} href={item.path} className="block">
              <SidebarItem
                icon={item.icon}
                text={item.text}
                alert={item.alert}
                active={pathname === item.path}
              />
            </Link>
          ))}

          {index < routes.length - 1 && (
            <hr className="my-2 border-border/50" />
          )}
        </div>
      ))}
    </>
  );
};
