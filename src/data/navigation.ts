export interface NavigationItem {
  id: string;
  name: string;
  href: string;
}

export const NAV_ITEMS: NavigationItem[] = [
  { id: "home", name: "Home", href: "#home" },
  { id: "about", name: "About", href: "#about" },
  { id: "portfolio", name: "Portfolio", href: "#portfolio" },
  { id: "timeline", name: "Timeline", href: "#timeline" },
  { id: "skills", name: "Skills", href: "#skills" },
];

export const SECTION_IDS = NAV_ITEMS.map((item) => item.id);
export const DEFAULT_SECTION_ID = "home";
