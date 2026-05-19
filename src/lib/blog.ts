/**
 * Blog post loader — reads markdown files from content/blog/ at build time.
 *
 * Posts are markdown files with frontmatter. The cron in ACOS writes new
 * files into content/blog/ on the `blog/YYYY-MM-DD-slug` branch, opens a
 * draft PR, and Brett merges via GitHub web UI. Vercel rebuilds on merge
 * and the new post goes live.
 *
 * No CMS, no database. The git repo IS the CMS.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string; // ISO 8601
  description: string;
  keyword: string;
  heroImage: string;
  readingMinutes: number;
  faq?: BlogFAQ[];
  content: string; // raw markdown body
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

function readingMinutesFromMarkdown(md: string): number {
  // 200 wpm is the standard read-rate for editorial content.
  const words = md.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function validateFrontmatter(data: Record<string, unknown>, file: string): void {
  for (const key of ['title', 'date', 'slug', 'description', 'keyword', 'hero_image']) {
    if (!data[key] || typeof data[key] !== 'string') {
      throw new Error(`Blog post ${file} is missing required frontmatter: ${key}`);
    }
  }
}

/** Read every .md file in content/blog/ and return parsed posts, newest first. */
export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
  const posts: BlogPost[] = [];

  for (const file of files) {
    const fullPath = path.join(BLOG_DIR, file);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(raw);
    validateFrontmatter(data as Record<string, unknown>, file);

    posts.push({
      slug: data.slug as string,
      title: data.title as string,
      date: data.date as string,
      description: data.description as string,
      keyword: data.keyword as string,
      heroImage: data.hero_image as string,
      readingMinutes: readingMinutesFromMarkdown(content),
      faq: Array.isArray(data.faq) ? (data.faq as BlogFAQ[]) : undefined,
      content,
    });
  }

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPost(slug: string): BlogPost | null {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}
