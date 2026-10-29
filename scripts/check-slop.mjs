// Fails CI on strong AI-writing tells in text Claude writes (CLAUDE.md "No AI slop").
// Patterns come from .claude/skills/humanizer (Wikipedia "Signs of AI writing") and .claude/skills/stop-slop,
// plus the banned phrases in docs/MARKETING_AUTOMATION.md §3.2.
//
// Scope: UI copy in src/**/*.astro, site/section copy in src/lib/*.ts, every story's headline, standfirst
// and summary, and the body of every story that is not `migrated: true`. Migrated bodies are Srihari's own
// words and follow MIGRATION.md §3 instead.
// Weak tells (adverbs, overused words) only warn: a careful writer uses them on purpose.
// `node scripts/check-slop.mjs --self-test` proves the patterns still fire.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

const STRONG = [
  // humanizer §22 chatbot residue
  [
    /\b(I hope this helps|Great question|Certainly!|Of course!|You're absolutely right|Let me know if you)/i,
    'chatbot residue (humanizer §22)',
  ],
  // §4 staged run-ups / stop-slop throat-clearing
  [
    /\b(let'?s (dive|delve) in(to)?|here'?s the thing|here'?s what you need to know|without further ado|let'?s break (this|it) down|the uncomfortable truth is|let me be clear|real talk)\b/i,
    'staged run-up (humanizer §4)',
  ],
  // §2 one-line closers / emphasis crutches
  [
    /\b(let that sink in|read that again|that is the real win|make no mistake)\b/i,
    'one-line closer (humanizer §2)',
  ],
  [/(^|[.!?]\s+)(Full stop|Period)\.(\s|$)/, 'emphasis crutch (stop-slop)'],
  // §1 not X but Y
  [
    /\bnot (just|only|merely) [^.;!?]{1,60}?,? but (also )?\b/i,
    '"not just X but Y" (humanizer §1)',
  ],
  [
    /\b(it'?s|it is|this is|that'?s) not (about )?[^.;!?]{1,50}[,;:]\s*(it'?s|it is|this is)\b/i,
    '"it\'s not X, it\'s Y" (humanizer §1)',
  ],
  // §12 stock AI words and MARKETING_AUTOMATION banned phrases
  [
    /\b(delve|delves|delving|tapestry|testament to|pivotal|showcas(e|es|ing)|vibrant|meticulous(ly)?|intricacies|game-?changer|revolutioni[sz](e|es|ing)|seamless(ly)?|in today'?s fast-paced|it'?s (important|worth) (to note|noting)|in conclusion|unlock(s|ing)?\b|embark(s|ing)? on|ever-evolving|evolving landscape|in the realm of|stands as a)\b/i,
    'stock AI phrase (humanizer §12, MARKETING_AUTOMATION §3.2)',
  ],
  [
    /\bleverag(e|es|ing)\b(?= (the|our|your|this|these|AI|it)\b)/i,
    '"leverage" as a verb (MARKETING_AUTOMATION §3.2)',
  ],
  // §13 inflated significance send-offs
  [
    /\b(the future (looks|is) bright|exciting times (lie )?ahead|a step in the right direction|setting the stage for|indelible mark)\b/i,
    'inflated significance (humanizer §13)',
  ],
  // §8 dashes (fine in Srihari's migrated bodies, never in ours)
  [/\s[—–]\s|[a-z][—–][a-z]|\s--\s/, 'em/en dash (humanizer §8, stop-slop)'],
];

// Editorial vocabulary (DECISIONS 2026-10-29): the UI never says essay, guide or field note. UI copy only.
const UI_ONLY = [
  [
    /\b(essays?|guides?|field notes?)\b/i,
    'retired vocabulary: use stories, Explained, Brief (DECISIONS 2026-10-29)',
  ],
];

const WEAK = [
  [
    /\b(really|simply|literally|genuinely|honestly|truly|fundamentally|inherently|crucially|importantly|interestingly)\b/i,
    'adverb crutch (stop-slop)',
  ],
  [/\b(robust|crucial|enhance[sd]?|landscape|underscore[sd]?)\b/i, 'overused word (humanizer §12)'],
];

const hit = (text) => STRONG.some(([re]) => re.test(text));

if (process.argv.includes('--self-test')) {
  const bad = [
    'I hope this helps you ship faster.',
    "Let's dive into how caching works.",
    'Let that sink in.',
    'It is not just a tool, but a mindset.',
    "It's not about speed, it's about trust.",
    'We delve into the evolving landscape.',
    'This is a game-changer for teams.',
    'Teams leverage AI to move faster.',
    'The future looks bright for agents.',
    'The model — fast and cheap — wins.',
  ];
  const good = [
    'Caching cuts repeat work.',
    'The model is fast and cheap, so it wins.',
    'Pages live in src/pages.',
    'Not every team needs an agent.',
  ];
  const missed = bad.filter((t) => !hit(t));
  const falsePositives = good.filter(hit);
  if (missed.length || falsePositives.length) {
    console.error('Slop self-test failed. Missed:', missed, 'False positives:', falsePositives);
    process.exit(1);
  }
  console.log(`Slop self-test passed (${bad.length} bad caught, ${good.length} good clean).`);
  process.exit(0);
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/** Visible prose of an .astro file: drop frontmatter, scripts, styles, comments, tags and {expressions}. */
function astroText(src) {
  return src
    .replace(/^---[\s\S]*?\n---/, '')
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\{[^{}]*\}/g, ' ')
    .replace(/<[^>]+>/g, '\n');
}

/** String literals of 25+ characters in .ts files (site, taxonomy and other copy). */
function tsStrings(src) {
  return [...src.matchAll(/'((?:[^'\\\n]|\\.){25,})'|`([^`]{25,})`/g)]
    .map((m) => m[1] ?? m[2])
    .join('\n');
}

/** A story's checked text: headline, standfirst, kicker, summary lines, and the body unless migrated. */
function storyText(src) {
  const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  const fields = fm
    .split(/\r?\n/)
    .filter((l) => /^(headline|standfirst|kicker|dateline):|^\s+- /.test(l))
    .join('\n');
  if (/^migrated:\s*true/m.test(fm)) return fields;
  const body = src
    .replace(/^---[\s\S]*?\n---/, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '');
  return `${fields}\n${body}`;
}

const targets = [];
for (const f of walk(join(root, 'src'))) {
  const src = readFileSync(f, 'utf8');
  if (f.endsWith('.astro')) targets.push([f, astroText(src), true]);
  else if (/src[\\/]lib[\\/].+\.ts$/.test(f)) targets.push([f, tsStrings(src), true]);
  else if (/src[\\/]content[\\/].+\.mdx?$/.test(f)) targets.push([f, storyText(src)]);
}

let errors = 0;
let warnings = 0;
for (const [file, text, isUi] of targets) {
  text.split('\n').forEach((line) => {
    for (const [re, why] of isUi ? [...STRONG, ...UI_ONLY] : STRONG) {
      const m = line.match(re);
      if (m) {
        errors++;
        console.error(
          `✗ ${relative(root, file)}: ${why}: “${m[0].trim()}” in “${line.trim().slice(0, 100)}”`,
        );
      }
    }
    for (const [re, why] of WEAK) {
      const m = line.match(re);
      if (m) {
        warnings++;
        if (process.env.SLOP_VERBOSE) console.warn(`~ ${relative(root, file)}: ${why}: “${m[0]}”`);
      }
    }
  });
}

console.log(
  `Slop check: ${targets.length} files, ${errors} strong tell(s), ${warnings} weak (SLOP_VERBOSE=1 to list).`,
);
if (errors) process.exit(1);
