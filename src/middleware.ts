import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const authRoutes = ["/login", "/register"];
  const isAuthRoute = authRoutes.includes(pathname);

  if (isAuthRoute && isLoggedIn) {
    const dashboard =
      role === "ADMIN"
        ? "/admin"
        : role === "INSTRUCTOR"
          ? "/instructor"
          : "/student";
    return NextResponse.redirect(new URL(dashboard, req.url));
  }

  if (pathname.startsWith("/student") && (!isLoggedIn || role !== "STUDENT")) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url));
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", req.url));
    if (role === "INSTRUCTOR")
      return NextResponse.redirect(new URL("/instructor", req.url));
  }

  if (pathname.startsWith("/instructor") && (!isLoggedIn || role !== "INSTRUCTOR")) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url));
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", req.url));
    if (role === "STUDENT")
      return NextResponse.redirect(new URL("/student", req.url));
  }

  if (pathname.startsWith("/admin") && (!isLoggedIn || role !== "ADMIN")) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url));
    return NextResponse.redirect(new URL("/student", req.url));
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
  ],
};
