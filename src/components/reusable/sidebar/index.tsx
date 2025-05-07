"use client";

import { ChevronFirst, ChevronLast, Menu, X, MoreVertical } from "lucide-react";
import Image from "next/image";
import React, { createContext, useContext, useState, useEffect } from "react";

export const SidebarContext = createContext({ expanded: true });

export const Sidebar = ({ children }: { children: React.ReactNode }) => {
  // State for desktop sidebar expansion
  const [expanded, setExpanded] = useState(true);
  // State for mobile sidebar visibility
  const [mobileOpen, setMobileOpen] = useState(false);
  // State to track if we're on mobile
  const [isMobile, setIsMobile] = useState(false);

  // Handle screen resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-collapse sidebar on mobile
      if (window.innerWidth < 768) {
        setExpanded(false);
      }
    };

    // Check on initial load
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Clean up
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const handleExpanded = () => {
    setExpanded((curr) => !curr);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen((curr) => !curr);
  };

  return (
    <>
      {/* Mobile menu toggle button - only visible on mobile */}
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-background border shadow-sm"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={`
          h-screen fixed md:relative z-40
          ${
            isMobile
              ? mobileOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : "translate-x-0"
          }
          transition-transform duration-300 ease-in-out
        `}
      >
        <nav className="h-full flex flex-col bg-background border-r shadow-sm">
          <div className="p-4 pb-2 flex justify-between items-center">
            <Image
              src="https://assets.aceternity.com/logo-dark.png"
              alt="logo"
              width={30}
              height={30}
              className={`overflow-hidden transition-all ${
                expanded ? "w-8" : "w-0"
              }`}
            />
            {/* Hide toggle button on mobile as we use the menu button instead */}
            <button
              onClick={handleExpanded}
              className="p-1.5 rounded-lg bg-card cursor-pointer hidden md:block"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>

          <SidebarContext.Provider
            value={{ expanded: isMobile ? true : expanded }}
          >
            <ul className="flex-1 px-3">{children}</ul>
          </SidebarContext.Provider>

          <div className="border-t flex p-3">
            <Image
              src={
                "https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&format=png"
              }
              alt="avatar"
              width={10}
              height={10}
              className="w-10 h-10 rounded-md"
            />
            <div
              className={`flex justify-between items-center overflow-hidden transition-all ${
                isMobile || expanded ? "w-52 ml-3" : "w-0"
              }`}
            >
              <div className="leading-4">
                <h4 className="font-semibold">John Doe</h4>
                <span className="text-xs text-gray-600">johndoe@gmail.com</span>
              </div>
              <MoreVertical size={20} />
            </div>
          </div>
        </nav>
      </aside>

      {/* Overlay for mobile menu */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={toggleMobileSidebar}
        />
      )}
    </>
  );
};

export const SidebarItem = ({
  icon,
  text,
  active,
  alert,
  onClick,
}: {
  icon: React.ReactNode;
  text: string | undefined;
  active?: boolean;
  alert?: boolean;
  onClick?: () => void;
}) => {
  const { expanded } = useContext(SidebarContext);
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  return (
    <li
      onClick={onClick}
      className={`
        relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group
        ${
          active
            ? "bg-card text-foreground"
            : "text-muted-foreground hover:bg-border"
        }
      `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`
            absolute right-2 w-2 h-2 rounded bg-[#f8b500]
            ${expanded ? "" : "top-2"}
            before:content-[''] before:absolute before:inset-0 
            before:rounded-full before:bg-[#f8b500] before:animate-ping 
            before:opacity-75 before:scale-150
          `}
        />
      )}

      {!expanded && !isMobile && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-yellow-100 text-yellow-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      )}
    </li>
  );
};
