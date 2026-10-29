// The editorial model (docs/PRD.md §5–§7). Sections are the navigation; formats are kickers, never nav.
// URLs derived from here are permanent: changing a section or slug needs a 301 in the same PR.

export const SECTIONS = ['ai', 'engineering', 'careers', 'work', 'life', 'society'] as const;
export type Section = (typeof SECTIONS)[number];

export const SECTION: Record<Section, { label: string; description: string }> = {
  ai: {
    label: 'AI',
    description:
      'Agents, retrieval, evals and the cost of running models in production, from someone who ships them.',
  },
  engineering: {
    label: 'Engineering',
    description: 'How software gets built, tested and kept running, and the trade-offs behind it.',
  },
  careers: {
    label: 'Careers',
    description: 'Promotions, pay, switching jobs and the unwritten rules of the workplace.',
  },
  work: {
    label: 'Work',
    description: 'Productivity, process and what actually happens when teams adopt new tools.',
  },
  life: {
    label: 'Life',
    description: 'Mindset, learning and the habits that hold a working life together.',
  },
  society: {
    label: 'Society',
    description: 'Values, public life and the systems we all live inside.',
  },
};

export const FORMATS = [
  'explained',
  'analysis',
  'opinion',
  'column',
  'brief',
  'term',
  'tool',
] as const;
export type Format = (typeof FORMATS)[number];

/** Label used as the kicker above a headline (a column shows its own name instead). */
export const FORMAT_LABEL: Record<Format, string> = {
  explained: 'Explained',
  analysis: 'Analysis',
  opinion: 'Opinion',
  column: 'Column',
  brief: 'Brief',
  term: 'Terms',
  tool: 'Tools',
};

/** Folder under src/content/ for each format. Stories share one folder; their URL comes from `section`. */
export const FORMAT_DIR: Record<Format, 'stories' | 'terms' | 'tools'> = {
  explained: 'stories',
  analysis: 'stories',
  opinion: 'stories',
  column: 'stories',
  brief: 'stories',
  term: 'terms',
  tool: 'tools',
};

export const COLUMNS = {
  '2-am': {
    name: '2 AM',
    description: 'Essays written at 2am, about work, careers and everything going wrong.',
  },
} as const;
export type ColumnSlug = keyof typeof COLUMNS;
export const COLUMN_SLUGS = Object.keys(COLUMNS) as [ColumnSlug, ...ColumnSlug[]];

/** Slugs a story may not use, because they collide with section sub-routes. */
export const RESERVED_SLUGS = ['page', 'index', 'rss', 'feed'];

export const AUTHOR_SLUG = 'srihari-venkatesan';
