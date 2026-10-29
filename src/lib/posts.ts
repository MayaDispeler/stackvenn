import { getCollection, type CollectionEntry } from 'astro:content';
import { TYPE_DIR } from '../content.config';

export type Post = CollectionEntry<'posts'>;

const showDrafts = import.meta.env.DEV || import.meta.env.SHOW_DRAFTS === 'true';

/** Folder must match `type`, so URLs can never drift from the content model. */
function assertFolder(post: Post) {
  const dir = post.id.split('/')[0];
  if (dir !== TYPE_DIR[post.data.type]) {
    throw new Error(
      `${post.id}: type "${post.data.type}" must live in src/content/${TYPE_DIR[post.data.type]}/`,
    );
  }
}

export function slugOf(post: Post): string {
  return post.id.split('/').at(-1)!;
}

export function urlOf(post: Post): string {
  const { type, pillar } = post.data;
  const slug = slugOf(post);
  if (type === 'guide') return `/guides/${pillar}/${slug}`;
  return `/${TYPE_DIR[type]}/${slug}`;
}

export async function getPosts(filter?: (p: Post) => boolean): Promise<Post[]> {
  const all = await getCollection('posts', (p) => showDrafts || p.data.status !== 'draft');
  all.forEach(assertFolder);
  return all
    .filter((p) => (filter ? filter(p) : true))
    .sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf());
}

export function readingTime(body = ''): number {
  const words = body
    .replace(/```[\s\S]*?```/g, '')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
