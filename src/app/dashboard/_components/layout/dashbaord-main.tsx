"use client";

import DashNav from "@/components/reusable/dash-nav";
import { SidebarContext } from "@/components/reusable/sidebar";

const DashboardMain = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarContext.Consumer>
      {({ expanded }) => (
        <div
          className={`flex-1 flex flex-col h-screen overflow-hidden ${
            expanded
              ? "md:max-w-[calc(100%-288px)]"
              : "md:max-w-[calc(100%-68px)]"
          }`}
        >
          <div className="flex-shrink-0">
            <DashNav />
          </div>
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            {children}
          </main>
        </div>
      )}
    </SidebarContext.Consumer>
  );
};

export default DashboardMain;
