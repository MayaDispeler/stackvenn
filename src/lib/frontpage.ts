// Assembles the front page (DESIGN §2). Each story appears once: lead → top stories → section bands.
// Editor picks come from src/data/frontpage.json; unknown slugs are skipped and the newest stories fill in.
import type { ImageMetadata } from 'astro';
import picks from '../data/frontpage.json';
import { getStories, slugOf, type Post } from './posts';
import { SECTIONS, type Section } from './taxonomy';

const images = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/stories/**/*.{png,jpg,jpeg,webp,svg}',
  { eager: true },
);

/** An image under src/assets/stories/, by path relative to that folder. */
export function storyImage(rel: string | undefined): ImageMetadata | undefined {
  return rel ? images[`/src/assets/stories/${rel}`]?.default : undefined;
}

export interface FrontPage {
  lead?: Post;
  leadImage?: ImageMetadata;
  leadImageCaption?: string;
  top: Post[];
  bands: { section: Section; posts: Post[] }[];
  picks: Post[];
  explained: Post[];
  column: Post[];
}

export async function getFrontPage(): Promise<FrontPage> {
  const all = await getStories();
  const bySlug = new Map(all.map((p) => [slugOf(p), p]));
  const used = new Set<string>();
  const take = (p: Post | undefined) => {
    if (p && !used.has(p.id)) {
      used.add(p.id);
      return p;
    }
    return undefined;
  };
  const fill = (wanted: string[], n: number) => {
    const out = wanted.map((s) => take(bySlug.get(s))).filter((p): p is Post => !!p);
    for (const p of all) {
      if (out.length >= n) break;
      const t = take(p);
      if (t) out.push(t);
    }
    return out.slice(0, n);
  };

  const lead = fill([picks.lead], 1)[0];
  const leadImage = lead && slugOf(lead) === picks.lead ? storyImage(picks.leadImage) : undefined;
  const top = fill(picks.top, 3);

  // Explained and the 2 AM column have their own modules; keep them out of the section bands.
  const isExplained = (p: Post) => p.data.format === 'explained';
  const isColumn = (p: Post) => p.data.column === '2-am';
  const bands = SECTIONS.map((section) => ({
    section,
    posts: all
      .filter(
        (p) => p.data.section === section && !used.has(p.id) && !isExplained(p) && !isColumn(p),
      )
      .slice(0, 3),
  })).filter((b) => b.posts.length);
  bands.forEach((b) => b.posts.forEach((p) => used.add(p.id)));

  return {
    lead,
    leadImage,
    ...(leadImage && picks.leadImageCaption ? { leadImageCaption: picks.leadImageCaption } : {}),
    top,
    bands,
    // Picks may repeat stories above: it's a short ranked list, like a paper's "editor's picks".
    picks: picks.picks
      .map((s) => bySlug.get(s))
      .filter((p): p is Post => !!p)
      .slice(0, 5),
    explained: all.filter((p) => isExplained(p) && !used.has(p.id)).slice(0, 4),
    // The 2 AM block always renders (name + link); it lists only pieces not already shown.
    column: all.filter((p) => isColumn(p) && !used.has(p.id)).slice(0, 3),
  };
}
