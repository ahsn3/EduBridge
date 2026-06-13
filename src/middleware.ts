import { auth } from "@/lib/auth";
import { getDashboardPath } from "@/lib/auth-utils";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const status = req.auth?.user?.status ?? "ACTIVE";

  const authRoutes = ["/login", "/register", "/register/student", "/register/instructor",
    "/verify-email", "/verify-email"];
  const isAuthRoute = authRoutes.includes(pathname);

  if (isLoggedIn && status === "INACTIVE" && pathname !== "/account-suspended") {
    return NextResponse.redirect(new URL("/account-suspended", req.url));
  }

  if (isAuthRoute && isLoggedIn && role && status) {
    // Allow verify-email and registration while completing a new account signup
    const completingSignup =
      pathname === "/verify-email" ||
      pathname.startsWith("/register");
    if (!completingSignup) {
      return NextResponse.redirect(new URL(getDashboardPath(role, status), req.url));
    }
  }

  if (pathname.startsWith("/student") && isLoggedIn && role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (pathname.startsWith("/student") && (!isLoggedIn || role !== "STUDENT" || status !== "ACTIVE")) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url));
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", req.url));
    if (role === "INSTRUCTOR" && status === "PENDING") {
      return NextResponse.redirect(new URL("/pending-approval", req.url));
    }
    if (role === "INSTRUCTOR") return NextResponse.redirect(new URL("/instructor", req.url));
  }

  if (pathname.startsWith("/instructor") && (!isLoggedIn || role !== "INSTRUCTOR")) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url));
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", req.url));
    if (role === "STUDENT") return NextResponse.redirect(new URL("/student", req.url));
  }

  if (pathname.startsWith("/instructor") && isLoggedIn && role === "INSTRUCTOR" && status === "PENDING") {
    return NextResponse.redirect(new URL("/pending-approval", req.url));
  }

  if (pathname.startsWith("/admin") && (!isLoggedIn || role !== "ADMIN" || status !== "ACTIVE")) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url));
    return NextResponse.redirect(new URL("/student", req.url));
  }

  if (pathname === "/pending-approval") {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url));
    if (role !== "INSTRUCTOR" || status !== "PENDING") {
      if (role && status) {
        return NextResponse.redirect(new URL(getDashboardPath(role, status), req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/student/:path*",
    "/instructor/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/register/student",
    "/register/instructor",
    "/verify-email",
    "/pending-approval",
    "/account-suspended",
  ],
};
