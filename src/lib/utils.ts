import { type ClassValue, clsx } from "clsx";

// Utility for merging class names
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Brand color values for use in JS/TS
export const brandColors = {
  cranberry: "#9B1B30",
  cranberryDark: "#7A1526",
  cranberryLight: "#C4324A",
  gold: "#D4AF37",
  goldDark: "#B8982E",
  goldLight: "#E8C84A",
  black: "#1A1A1A",
  white: "#FFFFFF",
  warmGray: "#4A4A4A",
} as const;

// Animation easing values
export const easings = {
  spring: [0.34, 1.56, 0.64, 1] as const,
  smooth: [0.25, 0.1, 0.25, 1] as const,
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
} as const;

// External links
export const links = {
  booking: "https://www.speaktobrett.com",
  email: "mailto:Brett@BrettLechtenberg.com",
  martialArts: "https://personalmasterymartialarts.com",
  ai: "https://totalsuccessai.com",
} as const;
