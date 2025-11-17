/**
 * Next.js Middleware for Subdomain Routing
 * Handles subdomain detection and routing for both localhost and production
 * Also handles path-based subdomain routing (e.g., /app, /shop)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSubdomainInfo } from "./lib/subdomain";

// Known routes that should not be treated as subdomains
const KNOWN_ROUTES = [
  '/api',
  '/admin',
  '/blog',
  '/about',
  '/contact',
  '/projects',
  '/subdomain',
  '/_next',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
];

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const url = request.nextUrl;
  const pathname = url.pathname;
  
  // Check if path is a known route
  const isKnownRoute = KNOWN_ROUTES.some(route => pathname.startsWith(route));
  
  // Path-based subdomain routing (e.g., /app, /shop)
  // We'll rewrite to /subdomain/[subdomain] and let the page handle validation
  if (!isKnownRoute && pathname !== '/' && !pathname.startsWith('/_')) {
    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      const potentialSubdomain = pathParts[0];
      
      // Rewrite to subdomain route - the page will validate if it's a real subdomain
      const newUrl = url.clone();
      const remainingPath = pathname.replace(`/${potentialSubdomain}`, '') || '/';
      newUrl.pathname = `/subdomain/${potentialSubdomain}${remainingPath}`;
      
      const headers = new Headers(request.headers);
      headers.set("x-subdomain", potentialSubdomain);
      
      return NextResponse.rewrite(newUrl, {
        request: { headers },
      });
    }
  }
  
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
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};



