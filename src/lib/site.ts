export const SITE = {
  name: 'Stackvenn',
  url: 'https://stackvenn.in',
  tagline: 'Where AI engineering, software and work overlap.',
  description:
    'Field notes where AI, engineering and work overlap, from an engineer who ships agentic AI in production. Guides, essays and notes by Srihari Venkatesan.',
  locale: 'en',
  repo: 'https://github.com/MayaDispeler/stackvenn',
  author: {
    name: 'Srihari Venkatesan',
    url: 'https://iamsrihari.com',
    role: 'AI engineer who ships agentic systems in production',
  },
} as const;

export const NAV = [
  { href: '/guides', label: 'Guides' },
  { href: '/essays', label: 'Essays' },
  { href: '/notes', label: 'Notes' },
  { href: '/topics', label: 'Topics' },
  { href: '/about', label: 'About' },
] as const;
