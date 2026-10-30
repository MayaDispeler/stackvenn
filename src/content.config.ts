// Content model from docs/PRD.md §9. Invalid frontmatter fails the build.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { COLUMN_SLUGS, FORMATS, SECTIONS } from './lib/taxonomy';

/** The writing desk (Decap CMS) saves empty optional fields as '' or null; treat them as absent. */
const dropEmpty = (v: unknown) =>
  v && typeof v === 'object' && !Array.isArray(v)
    ? Object.fromEntries(Object.entries(v).filter(([, x]) => x !== '' && x !== null))
    : v;

const source = z.object({ title: z.string().min(1), url: z.url() });

const posts = defineCollection({
  loader: glob({ pattern: '{stories,terms,tools}/**/*.{md,mdx}', base: './src/content' }),
  schema: ({ image }) =>
    z.preprocess(
      dropEmpty,
      z
        .object({
          headline: z.string().min(1),
          /** One-paragraph standfirst under the headline; doubles as the meta description. */
          standfirst: z
            .string()
            .min(120, 'standfirst must be 120–160 characters (it is the meta description)')
            .max(160, 'standfirst must be 120–160 characters (it is the meta description)'),
          format: z.enum(FORMATS),
          section: z.enum(SECTIONS),
          /** Optional kicker override; defaults to the format label or the column name. */
          kicker: z.string().optional(),
          column: z.enum(COLUMN_SLUGS).optional(),
          overlap: z.tuple([z.string().min(1), z.string().min(1)]),
          /** Ordered path (Explained) or reading series, e.g. "start-here". */
          series: z.string().optional(),
          order: z.number().int().positive().optional(),
          level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
          tested_with: z.array(z.string()).optional(),
          /** "Explained in 60 seconds": 3–5 one-line takeaways, Explained only. */
          summary: z.array(z.string().min(1)).min(3).max(5).optional(),
          /** Place line for the dateline, e.g. "Chennai". */
          dateline: z.string().optional(),
          published: z.coerce.date(),
          updated: z.coerce.date().optional(),
          status: z.enum(['draft', 'review', 'approved']),
          canonical: z
            .url()
            .refine(
              (u) => new URL(u).hostname === 'stackvenn.in',
              'canonical must be self (stackvenn.in)',
            )
            .optional(),
          first_published: z
            .object({
              platform: z.enum(['LinkedIn', 'Medium', 'Kissflow', '2 AM']),
              date: z.coerce.date(),
              url: z.url().optional(), // stored for the record only, never rendered as a link
            })
            .optional(),
          migrated: z.boolean().optional(),
          /** 'srihari' for stories he writes in the /admin desk: exempt from the slop check (his voice). */
          written_by: z.enum(['srihari', 'claude']).optional(),
          sources: z.array(source).default([]),
          /** Corrections policy (/about#corrections): each is shown at the end as "Correction, <date>: …". */
          corrections: z
            .array(z.object({ date: z.coerce.date(), text: z.string().min(1) }))
            .default([]),
          cover: image().optional(),
          cover_alt: z.string().optional(),
          cover_credit: z.string().optional(),
          distribute: z
            .object({
              devto: z.boolean().default(false),
              hashnode: z.boolean().default(false),
              bluesky: z.boolean().default(false),
              mastodon: z.boolean().default(false),
              threads: z.boolean().default(false),
              linkedin: z.boolean().default(false),
            })
            .default({
              devto: false,
              hashnode: false,
              bluesky: false,
              mastodon: false,
              threads: false,
              linkedin: false,
            }),
          faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
        })
        .superRefine((d, ctx) => {
          const issue = (path: string, message: string) =>
            ctx.addIssue({ code: 'custom', path: [path], message });
          if (d.format === 'column' && !d.column) issue('column', 'a column piece needs `column`');
          if (d.format !== 'column' && d.column) issue('column', '`column` is for format: column');
          if (d.format !== 'explained' && (d.level || d.summary)) {
            issue('format', '`level` and `summary` are for format: explained');
          }
          if (d.format === 'explained' && !d.level) issue('level', 'Explained pieces need a level');
          if (d.format === 'explained' && !d.tested_with?.length) {
            issue(
              'tested_with',
              'Explained pieces name the tools and versions they were written against',
            );
          }
          if (d.format === 'explained' && !d.summary) {
            issue('summary', 'Explained pieces need an "Explained in 60 seconds" summary');
          }
          if (d.updated && d.updated < d.published) issue('updated', 'updated is before published');
          if (d.cover && !d.cover_alt) issue('cover_alt', 'a cover needs alt text');
        }),
    ),
});

export const collections = { posts };
