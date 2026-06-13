import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { getAuthSecret } from "@/lib/auth-secret";
import { getDashboardPath, instructorNeedsProfile } from "@/lib/auth-routing";
import { isAdminEmail } from "@/lib/admin-emails";
import { NextResponse } from "next/server";

const { auth } = NextAuth({
  ...authConfig,
  secret: getAuthSecret(),
  providers: [],
});

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const email = req.auth?.user?.email;
  const isAdmin = isAdminEmail(email) || req.auth?.user?.role === "ADMIN";
  const role = isAdmin ? "ADMIN" : req.auth?.user?.role;
  const status = req.auth?.user?.status ?? "ACTIVE";
  const profileCompleted = req.auth?.user?.instructorProfileCompleted ?? false;
  const approvalStatus = req.auth?.user?.instructorApprovalStatus;

  const authRoutes = [
    "/login", "/register", "/register/student", "/register/instructor",
    "/verify-email", "/forgot-password", "/reset-password",
  ];
  const isAuthRoute = authRoutes.includes(pathname);
  const isSignupFlow = pathname === "/verify-email" || pathname.startsWith("/register");

  if (isLoggedIn && status === "INACTIVE" && pathname !== "/account-suspended") {
    return NextResponse.redirect(new URL("/account-suspended", req.url));
  }

  if (isAuthRoute && isLoggedIn && role && status && !isSignupFlow) {
    return NextResponse.redirect(
      new URL(getDashboardPath(role, status, profileCompleted), req.url)
    );
  }

  if (isLoggedIn && role === "INSTRUCTOR" && instructorNeedsProfile(role, status, approvalStatus, profileCompleted)) {
    if (pathname !== "/instructor/complete-profile" && !pathname.startsWith("/api/upload")) {
      return NextResponse.redirect(new URL("/instructor/complete-profile", req.url));
    }
  }

  if (pathname === "/instructor/complete-profile" && isLoggedIn && role === "INSTRUCTOR" && profileCompleted && approvalStatus !== "INFO_REQUESTED") {
    return NextResponse.redirect(new URL("/pending-approval", req.url));
  }

  if (pathname.startsWith("/student") && isLoggedIn && isAdmin) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (pathname.startsWith("/student") && (!isLoggedIn || role !== "STUDENT" || status !== "ACTIVE")) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url));
    if (isAdmin) return NextResponse.redirect(new URL("/admin", req.url));
    if (role === "INSTRUCTOR") {
      return NextResponse.redirect(new URL(getDashboardPath(role, status, profileCompleted), req.url));
    }
  }

  if (pathname.startsWith("/instructor") && pathname !== "/instructor/complete-profile") {
    if (!isLoggedIn || role !== "INSTRUCTOR") {
      if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url));
      if (role === "ADMIN" || isAdmin) return NextResponse.redirect(new URL("/admin", req.url));
      if (role === "STUDENT") return NextResponse.redirect(new URL("/student", req.url));
    }
    if (isLoggedIn && role === "INSTRUCTOR" && status === "PENDING") {
      return NextResponse.redirect(new URL("/pending-approval", req.url));
    }
  }

  if (pathname.startsWith("/admin") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname === "/pending-approval") {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url));
    if (role !== "INSTRUCTOR" || status !== "PENDING") {
      if (role && status) {
        return NextResponse.redirect(new URL(getDashboardPath(role, status, profileCompleted), req.url));
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
    "/forgot-password",
    "/reset-password",
    "/pending-approval",
    "/account-suspended",
  ],
};
