import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

const APP_HOSTNAMES = new Set([
  "localhost",
  "localhost:3000",
  process.env.NEXT_PUBLIC_APP_DOMAIN,
]);

function getHostname(req: NextRequest) {
  return req.headers.get("host") ?? "";
}

export default async function middleware(req: NextRequest) {
  const hostname = getHostname(req);

  if (APP_HOSTNAMES.has(hostname)) {
    return (auth as any)(req);
  }

  // Custom domain — rewrite to the multi-tenant /sites/[domain] route
  const url = req.nextUrl.clone();
  url.pathname = `/site/${hostname}${url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
