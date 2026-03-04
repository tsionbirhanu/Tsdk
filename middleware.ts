import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
];

const ADMIN_ROUTES = ["/admin"];

export function middleware(req: NextRequest) {
  const token =
    req.cookies.get("tsedk_token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) =>
      req.nextUrl.pathname === route ||
      req.nextUrl.pathname.startsWith("/api/"),
  );

  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
