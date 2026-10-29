// RSS (REACHABILITY §3). Phase 2 ships headlines + standfirsts; Phase 3 switches to full content.
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getStories, kickerOf, urlOf } from '../lib/posts';
import { SITE } from '../lib/site';
import { SECTION } from '../lib/taxonomy';

export async function GET(context: APIContext) {
  const stories = await getStories((p) => p.data.status !== 'draft');
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: stories.map((p) => ({
      title: p.data.headline,
      description: p.data.standfirst,
      link: urlOf(p),
      pubDate: p.data.published,
      categories: [SECTION[p.data.section].label, kickerOf(p)],
      author: SITE.author.name,
    })),
    customData: `<language>en</language>`,
  });
}
