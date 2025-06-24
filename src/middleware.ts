import { NextRequest, NextResponse } from "next/server";

// Middleware function
export async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get cookies
  const access = req.cookies.get("nexatrade-access");
  const isNewUser = req.cookies.get("isNewUser")?.value;

  // Check if the user is trying to access protected routes
  const protectedRoutes = [
    "/dashboard/deposit",
    "/dashboard/help",
    "/dashboard/history",
    "/dashboard/home",
    "/dashboard/invest",
    "/dashboard/password-change",
    "/dashboard/profile",
    "/dashboard/settings",
    "/dashboard/trade",
    "/dashboard/wallet",
    "/dashboard/withdraw",
  ];
  const isProtected = protectedRoutes.some((route) =>
    url.pathname.startsWith(route)
  );

  // Handle protected routes and access checks
  if (isProtected) {
    if (!access) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    // Prevent infinite redirect loop
    if (isNewUser === "true" && url.pathname !== "/dashboard/profile") {
      return NextResponse.redirect(new URL("/dashboard/profile", req.url));
    }

    return NextResponse.next();
  }

  // Continue to the requested page for other routes
  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
