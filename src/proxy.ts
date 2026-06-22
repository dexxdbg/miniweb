import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE = "ab_variant";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only intercept the root path
  if (pathname !== "/") return NextResponse.next();

  let variant = request.cookies.get(COOKIE)?.value;

  if (!variant) {
    variant = Math.random() < 0.3 ? "v2" : "main";
  }

  const response =
    variant === "v2"
      ? NextResponse.rewrite(new URL("/v2", request.url))
      : NextResponse.next();

  // Persist assignment for the session (1 year)
  if (!request.cookies.get(COOKIE)) {
    response.cookies.set(COOKIE, variant, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}

export const config = {
  matcher: "/",
};
