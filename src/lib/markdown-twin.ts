// Plain-Markdown version of a story for /<url>.md (REACHABILITY §3), "Copy Markdown" and AI tools.
// MDX imports and component tags are dropped (their inner Markdown stays), and images become their
// alt text, since local asset paths mean nothing outside the site.
import { SITE } from './site';
import { SECTION } from './taxonomy';
import { formatDate, kickerOf, urlOf, type Post } from './posts';

export function markdownTwin(post: Post): string {
  const d = post.data;
  const url = new URL(urlOf(post), SITE.url).href;
  const body = (post.body ?? '')
    .replace(/^\s*(import|export)\s.+$/gm, '')
    .replace(/^\s*<\/?[A-Z][A-Za-z]*(\s[^>]*)?>\s*$/gm, '')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, (_, alt) => (alt ? `[Image: ${alt}]` : ''))
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const meta = [
    `By ${SITE.author.name}`,
    `${SECTION[d.section].label} · ${kickerOf(post)}`,
    `Published ${formatDate(d.published)}${d.updated ? `, updated ${formatDate(d.updated)}` : ''}`,
    url,
  ].join('  \n');

  const summary = d.summary?.length
    ? `\n\n## Explained in 60 seconds\n\n${d.summary.map((s) => `- ${s}`).join('\n')}`
    : '';
  const sources = d.sources.length
    ? `\n\n## Sources\n\n${d.sources.map((s, i) => `${i + 1}. [${s.title}](${s.url})`).join('\n')}`
    : '';

  return `# ${d.headline}\n\n*${d.standfirst}*\n\n${meta}${summary}\n\n${body}${sources}\n`;
}
