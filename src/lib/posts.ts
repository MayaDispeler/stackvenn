import { getCollection, type CollectionEntry } from 'astro:content';
import {
  COLUMNS,
  FORMAT_DIR,
  FORMAT_LABEL,
  RESERVED_SLUGS,
  SECTION,
  type Section,
} from './taxonomy';

export type Post = CollectionEntry<'posts'>;

const showDrafts = import.meta.env.DEV || import.meta.env.SHOW_DRAFTS === 'true';

export function slugOf(post: Post): string {
  return post.id.split('/').at(-1)!;
}

/** Permanent URL: stories at /<section>/<slug>, terms at /terms/<slug>, tools at /tools/<slug>. */
export function urlOf(post: Post): string {
  const dir = FORMAT_DIR[post.data.format];
  const slug = slugOf(post);
  return dir === 'stories' ? `/${post.data.section}/${slug}` : `/${dir}/${slug}`;
}

/** Kicker above the headline: override, column name, or format label. */
export function kickerOf(post: Post): string {
  const d = post.data;
  if (d.kicker) return d.kicker;
  if (d.format === 'column' && d.column) return COLUMNS[d.column].name;
  return FORMAT_LABEL[d.format];
}

export function sectionLabel(section: Section): string {
  return SECTION[section].label;
}

/** Build-time guards: folder matches format, slugs are unique and not reserved. */
function validate(all: Post[]) {
  const seen = new Map<string, string>();
  for (const post of all) {
    const dir = post.id.split('/')[0];
    const want = FORMAT_DIR[post.data.format];
    if (dir !== want) {
      throw new Error(`${post.id}: format "${post.data.format}" must live in src/content/${want}/`);
    }
    const slug = slugOf(post);
    if (RESERVED_SLUGS.includes(slug)) throw new Error(`${post.id}: slug "${slug}" is reserved`);
    const other = seen.get(slug);
    if (other) throw new Error(`Duplicate slug "${slug}": ${other} and ${post.id}`);
    seen.set(slug, post.id);
  }
}

let cache: Promise<Post[]> | undefined;

/** All published posts (drafts too in dev / SHOW_DRAFTS), newest first. */
export async function getPosts(filter?: (p: Post) => boolean): Promise<Post[]> {
  cache ??= getCollection('posts', (p) => showDrafts || p.data.status !== 'draft').then((all) => {
    validate(all);
    return all.sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf());
  });
  const all = await cache;
  return filter ? all.filter(filter) : all;
}

/** Stories per page on the author page. */
export const AUTHOR_PAGE_SIZE = 20;

/** Stories per section-front page after the lead. */
export const SECTION_PAGE_SIZE = 10;

export const isStory = (p: Post) => FORMAT_DIR[p.data.format] === 'stories';

export async function getStories(filter?: (p: Post) => boolean): Promise<Post[]> {
  return getPosts((p) => isStory(p) && (filter ? filter(p) : true));
}

export function readingTime(body = ''): number {
  const words = body
    .replace(/```[\s\S]*?```/g, '')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "1 Sep 2025": fixed three-letter months (en-GB now writes "Sept"). */
export function formatDate(d: Date): string {
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
