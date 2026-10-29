// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import expressiveCode from 'astro-expressive-code';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

/** Code blocks scroll sideways, so keyboard users must be able to focus them (axe scrollable-region-focusable). */
const focusablePre = {
  name: 'focusable-pre',
  hooks: {
    /** @param {{ renderData: { blockAst: any } }} ctx */
    postprocessRenderedBlock: ({ renderData }) => {
      /** @param {any} node */
      const walk = (node) => {
        if (node.type === 'element' && node.tagName === 'pre') node.properties.tabIndex = 0;
        node.children?.forEach(walk);
      };
      walk(renderData.blockAst);
    },
  },
};

export default defineConfig({
  site: 'https://stackvenn.in',
  // One URL per page, no trailing slash (REACHABILITY §1). Wrangler drops the slash at the edge.
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    expressiveCode({
      themes: ['github-dark-dimmed', 'github-light'],
      plugins: [focusablePre],
      themeCssSelector: (theme) =>
        theme.type === 'dark' ? ':root[data-theme="dark"]' : ':root[data-theme="light"]',
      useDarkModeMediaQuery: false,
      styleOverrides: {
        borderRadius: '6px',
        codeFontFamily: 'var(--font-mono)',
        uiFontFamily: 'var(--font-ui)',
      },
    }),
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/search') && !page.includes('/404'),
    }),
  ],
  fonts: [
    {
      name: 'Schibsted Grotesk',
      cssVariable: '--font-schibsted',
      provider: fontProviders.npm(),
      weights: ['400', '500', '600', '700'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
    },
    {
      name: 'Newsreader',
      cssVariable: '--font-newsreader',
      provider: fontProviders.npm(),
      weights: ['400', '500'],
      styles: ['normal', 'italic'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Georgia', 'Times New Roman', 'serif'],
    },
    {
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains',
      provider: fontProviders.npm(),
      weights: ['400', '500'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['ui-monospace', 'Menlo', 'Consolas', 'monospace'],
    },
  ],
});
