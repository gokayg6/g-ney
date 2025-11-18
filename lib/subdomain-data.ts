/**
 * Subdomain Project Data Access Functions
 */

import { getData } from "./data";

export type SubdomainCategory =
  | "mobile-app"
  | "game"
  | "website"
  | "ecommerce"
  | "saas";

export interface SubdomainMetadata {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface SubdomainProject {
  id: string;
  name: string;
  subdomain: string;
  category: SubdomainCategory;
  title: string;
  description: string;
  tagline: string;
  logo: string;
  coverImage: string;
  features: string[];
  screenshots: string[];
  appStoreLink?: string;
  playStoreLink?: string;
  techStack: string[];
  published: boolean;
  metadata: SubdomainMetadata;
}

interface DataJsonShape {
  subdomainProjects?: SubdomainProject[];
  // diğer alanlar (hero, blog vs) burada önemli değil
}

/**
 * Tüm yayınlanmış subdomain projelerini getirir.
 */
export function getAllSubdomainProjects(): SubdomainProject[] {
  try {
    const raw = getData() as unknown as DataJsonShape;
    const projects = raw.subdomainProjects ?? [];
    return projects.filter((p) => p.published);
  } catch (error) {
    console.error("Error fetching subdomain projects:", error);
    return [];
  }
}

/**
 * Subdomain stringine göre tek bir projeyi getirir.
 */
export function getProjectBySubdomain(
  subdomain: string | undefined
): SubdomainProject | null {
  if (!subdomain) return null;

  try {
    const raw = getData() as unknown as DataJsonShape;
    const projects = raw.subdomainProjects ?? [];

    const lower = subdomain.toLowerCase();

    const project = projects.find(
      (p) => p.subdomain.toLowerCase() === lower && p.published
    );

    return project ?? null;
  } catch (error) {
    console.error(`Error fetching project for subdomain "${subdomain}":`, error);
    return null;
  }
}




