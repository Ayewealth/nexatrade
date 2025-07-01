import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoNotifications } from "react-icons/io5";
import React from "react";
import { useTheme } from "next-themes";
import { FaMoon } from "react-icons/fa";
import { IoSunnySharp } from "react-icons/io5";
import Link from "next/link";

const DashNav = ({ type }: { type: "user" | "admin" }) => {
  const { setTheme, theme } = useTheme();
  return (
    <div className="flex items-center justify-end lg:justify-between p-[12px] w-full">
      <div className="flex-none w-[25%] hidden lg:block">
        <Input
          type="search"
          placeholder="Search"
          className="border-0 rounded-4xl bg-card py-[7px] px-[12px] placeholder:text-[13px] text-sm"
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56.966 56.966' fill='%23717790c7'%3e%3cpath d='M55.146 51.887L41.588 37.786A22.926 22.926 0 0046.984 23c0-12.682-10.318-23-23-23s-23 10.318-23 23 10.318 23 23 23c4.761 0 9.298-1.436 13.177-4.162l13.661 14.208c.571.593 1.339.92 2.162.92.779 0 1.518-.297 2.079-.837a3.004 3.004 0 00.083-4.242zM23.984 6c9.374 0 17 7.626 17 17s-7.626 17-17 17-17-7.626-17-17 7.626-17 17-17z'/%3e%3c/svg%3e")`,
            backgroundSize: "14px",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "96%",
            transition:
              "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
          }}
        />
      </div>
      <div className="flex items-center gap-2 gap-sm-3">
        {type === "user" && (
          <Link href="/dashboard/withdraw">
            <Button className="lg:block hidden bg-[#fccd4d] hover:bg-[#f8b500] cursor-pointer rounded text-black">
              Add Funds
            </Button>
          </Link>
        )}
        <div className="relative">
          <IoNotifications className="h-5 w-5" />
          <div
            className={`
            absolute top-0 right-0 w-2 h-2 rounded bg-[#f8b500] before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-[#f8b500] before:animate-ping before:opacity-75 before:scale-150
          `}
          />
        </div>
        <div>
          {theme === "dark" ? (
            <Button
              variant="outline"
              className="rounded-full border-0 bg-card cursor-pointer"
              onClick={() => setTheme("light")}
            >
              <IoSunnySharp className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              variant="outline"
              className="rounded-full border-0 bg-card cursor-pointer"
              onClick={() => setTheme("dark")}
            >
              <FaMoon className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashNav;
