/**
 * Subdomain Detection and Routing Utilities
 * Works for both localhost and production (loegs.com)
 */

export type SubdomainCategory = 
  | "main" 
  | "mobile-app" 
  | "game" 
  | "website" 
  | "ecommerce" 
  | "saas";

export interface SubdomainInfo {
  category: SubdomainCategory;
  subdomain: string | null;
  isMainDomain: boolean;
  isProjectSubdomain: boolean;
  hostname: string;
}

export function getSubdomainInfo(hostname: string): SubdomainInfo {
  const cleanHostname = hostname.split(":")[0];
  const parts = cleanHostname.split(".");
  
  const isLocalhost = cleanHostname === "localhost" || cleanHostname.endsWith(".localhost");
  const isProduction = cleanHostname.includes("loegs.com");
  
  const isMainDomain = 
    cleanHostname === "localhost" || 
    cleanHostname === "loegs.com" || 
    cleanHostname === "www.loegs.com";
  
  if (isMainDomain) {
    return {
      category: "main",
      subdomain: null,
      isMainDomain: true,
      isProjectSubdomain: false,
      hostname: cleanHostname,
    };
  }
  
  let subdomain: string | null = null;
  
  if (isLocalhost && parts.length >= 2) {
    subdomain = parts[0];
  } else if (isProduction && parts.length >= 3) {
    subdomain = parts[0];
  } else if (parts.length > 0) {
    subdomain = parts[0];
  }
  
  const isProjectSubdomain = subdomain !== null && subdomain !== "www";
  
  return {
    category: "mobile-app",
    subdomain,
    isMainDomain: false,
    isProjectSubdomain,
    hostname: cleanHostname,
  };
}

