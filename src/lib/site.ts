import { SECTION, SECTIONS } from './taxonomy';

export const SITE = {
  name: 'Stackvenn',
  url: 'https://stackvenn.in',
  tagline: 'Where AI engineering, software and work overlap.',
  description:
    'Reporting and analysis where AI, engineering and work overlap, from an engineer who ships agentic AI in production. By Srihari Venkatesan.',
  locale: 'en',
  timeZone: 'Asia/Kolkata',
  repo: 'https://github.com/MayaDispeler/stackvenn',
  /** Giscus comments. null until the Giscus app is installed (issue #6); stories then show "Comments open soon". */
  giscus: null as null | { repo: string; repoId: string; category: string; categoryId: string },
  author: {
    name: 'Srihari Venkatesan',
    slug: 'srihari-venkatesan',
    url: 'https://iamsrihari.com',
    role: 'AI engineer who ships agentic systems in production',
    /** Short line under the byline and in the author box. */
    line: 'AI engineer · writes the 2 AM column',
    email: 'srihariv4942@gmail.com',
  },
} as const;

/** Main navigation is the six sections, like a newspaper. Formats never appear in the nav. */
export const NAV = SECTIONS.map((s) => ({ href: `/${s}`, label: SECTION[s].label }));
