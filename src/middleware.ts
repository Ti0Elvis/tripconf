import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { MiddlewareConfig, NextRequest } from "next/server";
// @libs
import { JWT_SECRET } from "./lib/constants";

const secret = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  if (token !== undefined && pathname === "/sign-in") {
    try {
      await jwtVerify(token, secret);
      return NextResponse.redirect(new URL("/", request.url));
    } catch (error) {
      console.error("JWT verification failed:", error);
      return NextResponse.next();
    }
  }

  if (token !== undefined && pathname !== "/sign-in") {
    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (error) {
      console.error("JWT verification failed:", error);
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  if (token === undefined && pathname !== "/sign-in") {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

export const config: MiddlewareConfig = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
