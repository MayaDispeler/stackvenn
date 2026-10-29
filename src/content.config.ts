// Content model from docs/PRD.md §9. Invalid frontmatter fails the build.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const TYPES = ['guide', 'essay', 'note', 'glossary', 'tool'] as const;
export const PILLARS = [
  'agentic',
  'retrieval',
  'evals',
  'cost',
  'shipping',
  'careers',
  'work',
  'life',
  'society',
] as const;

/** Folder under src/content/ that each type must live in, which also fixes its URL prefix. */
export const TYPE_DIR: Record<(typeof TYPES)[number], string> = {
  guide: 'guides',
  essay: 'essays',
  note: 'notes',
  glossary: 'glossary',
  tool: 'tools',
};

const source = z.object({ title: z.string().min(1), url: z.url() });

const posts = defineCollection({
  loader: glob({
    pattern: '{essays,notes,guides,glossary,tools}/**/*.{md,mdx}',
    base: './src/content',
  }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        dek: z
          .string()
          .min(120, 'dek must be 120–160 characters (it is the meta description)')
          .max(160, 'dek must be 120–160 characters (it is the meta description)'),
        type: z.enum(TYPES),
        pillar: z.enum(PILLARS),
        overlap: z.tuple([z.string().min(1), z.string().min(1)]),
        series: z.string().optional(),
        order: z.number().int().positive().optional(),
        level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
        tested_with: z.array(z.string()).optional(),
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
        sources: z.array(source).default([]),
        cover: image().optional(),
        cover_alt: z.string().optional(),
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
        if (d.type !== 'guide' && d.level) {
          ctx.addIssue({ code: 'custom', path: ['level'], message: 'level is for guides only' });
        }
        if (d.type === 'guide' && !d.level) {
          ctx.addIssue({ code: 'custom', path: ['level'], message: 'guides need a level' });
        }
        if (d.updated && d.updated < d.published) {
          ctx.addIssue({
            code: 'custom',
            path: ['updated'],
            message: 'updated is before published',
          });
        }
        if (d.cover && !d.cover_alt) {
          ctx.addIssue({ code: 'custom', path: ['cover_alt'], message: 'a cover needs alt text' });
        }
      }),
});

export const collections = { posts };
