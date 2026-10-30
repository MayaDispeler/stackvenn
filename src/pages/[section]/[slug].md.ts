// /<section>/<slug>.md: the Markdown twin of every story (REACHABILITY §3).
import type { APIRoute } from 'astro';
import { getStories, slugOf, type Post } from '../../lib/posts';
import { markdownTwin } from '../../lib/markdown-twin';

export async function getStaticPaths() {
  const stories = await getStories();
  return stories.map((post) => ({
    params: { section: post.data.section, slug: slugOf(post) },
    props: { post },
  }));
}

export const GET: APIRoute = ({ props }) =>
  new Response(markdownTwin((props as { post: Post }).post), {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  });
