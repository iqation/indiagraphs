import { NextRequest, NextResponse } from "next/server";
import { verifyTokenEdge } from "@/app/lib/jwt-edge";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Protect only /account routes
  if (!pathname.startsWith("/account")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("auth_token")?.value;

  // ❌ No token
  if (!token) {
    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.delete("auth_token");
    return res;
  }

  // ❌ Invalid token
  const decoded = await verifyTokenEdge(token);
  if (!decoded) {
    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.delete("auth_token");
    return res;
  }

  // ✅ Authorized
  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"],
};
