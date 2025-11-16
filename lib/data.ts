import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "lib", "data.json");

// ====== CORE TYPES ======

export interface HeroData {
  name: string;
  tagline: string;
  taglineHighlight: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
}

export interface AboutData {
  title: string;
  subtitle: string;
  description: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  companyLogo: string;
  position: string;
  period: string;
  description: string;
  skills: string[];
}

export interface ExperienceData {
  title: string;
  subtitle: string;
  items: ExperienceItem[];
}

export type ProjectType = "web" | "mobile-app-template" | "ecommerce" | "game" | "saas";

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  type: ProjectType;
  privacyPolicy?: string;
}

export interface ProjectsData {
  title: string;
  subtitle: string;
  items: ProjectItem[];
}

export interface ContactData {
  title: string;
  subtitle: string;
  email: string;
  phone?: string;
  description: string;
}

export interface SocialIcon {
  link: string;
  image: string;
  alt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  published: boolean;
}

export interface BlogData {
  title: string;
  subtitle: string;
  introTitle?: string;
  introDescription?: string;
  posts: BlogPost[];
}

// ====== SUBDOMAIN PROJECTS ======

export type SubdomainCategory = "mobile-app" | "game" | "ecommerce" | "saas";

export interface SubdomainProject {
  id: string;
  name: string;
  subdomain: string; // "app", "shop", "testgame", "falla", "analytics"...
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
  metadata: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export interface PortfolioData {
  hero: HeroData;
  about: AboutData;
  experience: ExperienceData;
  projects: ProjectsData;
  contact: ContactData;
  social: SocialIcon[];
  blog: BlogData;
  subdomainProjects: SubdomainProject[];
}

// ====== FS HELPERS ======

export function getData(): PortfolioData {
  try {
    const fileContents = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(fileContents) as PortfolioData;
  } catch (error) {
    console.error("Error reading data file:", error);
    throw error;
  }
}

export function saveData(data: PortfolioData): void {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing data file:", error);
    throw error;
  }
}
