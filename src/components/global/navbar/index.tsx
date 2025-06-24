"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { LogOut, Moon, Sun, User } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/redux/store";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { handleLogout } from "@/utils/logout";
import Image from "next/image";

export function Nav() {
  const pathname = usePathname();

  const getHashLink = (hash: string) => {
    return pathname === "/" ? `#${hash}` : `/#${hash}`;
  };

  const navItems = [
    {
      name: "Features",
      link: getHashLink("features"),
    },
    {
      name: "Testimonials",
      link: getHashLink("testimonials"),
    },
    {
      name: "Contact",
      link: getHashLink("contact"),
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setTheme } = useTheme();
  const { userInfo, isAuthenticated } = useAppSelector((state) => state.auth);

  const hasUserData =
    userInfo?.userData && Object.keys(userInfo.userData).length > 0;
  const isLoggedIn = !!hasUserData && isAuthenticated;

  return (
    <div className="absolute w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full cursor-pointer"
                  >
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarImage
                        src={userInfo.userData.profile_pic || ""}
                        alt={userInfo.userData.full_name || "User"}
                      />
                      <AvatarFallback>
                        <Image
                          src={"/assets/default.jpg"}
                          alt="Default Avatar"
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {userInfo.userData.full_name && (
                        <p className="font-medium text-sm">
                          {userInfo.userData.full_name}
                        </p>
                      )}
                      {userInfo.userData.email && (
                        <p className="text-sm text-muted-foreground">
                          {userInfo.userData.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/home"
                      className="flex items-center cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <NavbarButton variant="secondary" href="/signin">
                  Login
                </NavbarButton>
                <NavbarButton variant="primary" href="/signup">
                  Register
                </NavbarButton>
                <NavbarButton variant="secondary">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="shadow-none cursor-pointer border-0"
                      >
                        <Sun className="h-[0.9rem] w-[0.9rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[0.9rem] w-[0.9rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setTheme("light")}>
                        Light
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("dark")}>
                        Dark
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("system")}>
                        System
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavbarButton>
              </>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              {isLoggedIn ? (
                <div className="flex flex-col gap-2 p-2 border rounded-md">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={userInfo.userData.profile_pic || ""}
                        alt={userInfo.userData.full_name || "User"}
                      />
                      <AvatarFallback>
                        <Image
                          src={"/assets/default.jpg"}
                          alt="Default Avatar"
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      {userInfo.userData.full_name && (
                        <p className="font-medium">
                          {userInfo.userData.full_name}
                        </p>
                      )}
                      {userInfo.userData.email && (
                        <p className="text-xs text-muted-foreground">
                          {userInfo.userData.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <Link
                    href="/dashboard/home"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-transparent text-black dark:text-white border rounded-md"
                  >
                    <User className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-md"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              ) : (
                <>
                  <NavbarButton variant="secondary" href="/signin">
                    Login
                  </NavbarButton>
                  <NavbarButton variant="primary" href="signup">
                    Register
                  </NavbarButton>
                  <NavbarButton variant="secondary" className="px-2 py-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        className="shadow-none cursor-pointer border-0"
                      >
                        <Button variant="outline" size="icon">
                          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                          <span className="sr-only">Toggle theme</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                          Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                          Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                          System
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </NavbarButton>
                </>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
