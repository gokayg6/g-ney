/**
 * Next.js Middleware for Subdomain Routing
 * Handles subdomain detection and routing for both localhost and production
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSubdomainInfo } from "./lib/subdomain";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const url = request.nextUrl;
  
  // Query parameter fallback for testing
  const subdomainParam = url.searchParams.get("subdomain");
  if (subdomainParam && hostname === "localhost:3000") {
    const newUrl = url.clone();
    newUrl.pathname = `/_subdomain/${subdomainParam}${url.pathname === "/" ? "" : url.pathname}`;
    const headers = new Headers(request.headers);
    headers.set("x-subdomain", subdomainParam);
    return NextResponse.rewrite(newUrl, {
      request: { headers },
    });
  }
  
  const subdomainInfo = getSubdomainInfo(hostname);
  
  if (subdomainInfo.isMainDomain) {
    return NextResponse.next();
  }
  
  if (subdomainInfo.isProjectSubdomain && subdomainInfo.subdomain) {
    const newUrl = url.clone();
    const pathname = url.pathname;
    
    const headers = new Headers(request.headers);
    headers.set("x-subdomain", subdomainInfo.subdomain);
    
    newUrl.pathname = `/_subdomain/${subdomainInfo.subdomain}${pathname}`;
    
    return NextResponse.rewrite(newUrl, {
      request: { headers },
    });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/).*)",
  ],
};


