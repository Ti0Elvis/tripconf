import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { MiddlewareConfig, NextRequest } from "next/server";
// @libs
import { JWT_SECRET } from "./lib/constants";

const secret = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  try {
    if (token !== undefined) {
      await jwtVerify(token, secret);

      if (pathname === "/login") {
        return NextResponse.redirect(new URL("/", request.url));
      }

      return NextResponse.next();
    }

    if (token === undefined && pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch (error) {
    console.error("JWT validation error:", error);

    if (pathname === "/login") {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
