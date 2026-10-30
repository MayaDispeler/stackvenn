// Facts about the author, copied from iamsrihari.com's source (components/sections/career.tsx,
// about.tsx, lib/seo.ts) on 2026-10-30. Nothing here is written fresh: prose about Srihari (the bio,
// the one-line role descriptions) arrives through a content PR he approves. Unknowns are left empty.

export const AUTHOR = {
  jobTitle: 'AI Engineer',
  location: 'Chennai',
  worksFor: 'Kissflow',
  roles: [
    {
      role: 'Lead Engineer',
      company: 'Kissflow',
      period: 'Jul 2021 – Present',
      line: 'Production agentic workflows in LangGraph and a hybrid-retrieval RAG pipeline used by 100+ people.',
    },
    {
      role: 'Data Engineer',
      company: 'Neurealm (formerly GAVS Tech)',
      period: 'Sep 2020 – Jul 2021',
      line: 'PySpark pipelines processing 10M+ daily events for an AIOps platform.',
    },
    {
      role: 'System Engineer',
      company: 'Tata Consultancy Services',
      period: 'Jul 2017 – Aug 2020',
      line: 'L3 support across three data centres for core banking and insurance applications.',
    },
  ],
  education: [
    { title: 'B.Tech, Aerospace Engineering', place: 'SASTRA University, Thanjavur', year: '2017' },
    {
      title: 'Master of Business Administration',
      place: 'Indira Gandhi National Open University',
      year: 'Expected Dec 2026',
    },
  ],
  /** First-person bio paragraphs (120–180 words in total). Empty until Srihari approves them. */
  bio: [
    'I am an AI engineer in Chennai. In 2017 I kept core banking and insurance systems running across three data centres. When they went down, real customers felt it, and that is where I learned the lesson I still build by: technology is only as good as the trust it earns.',
    'Today I am the primary AI engineer for a SaaS business team at Kissflow. My agentic workflows and retrieval systems serve 100+ colleagues every day, and I prove they work with numbers: research tasks that took 45 minutes now take under 3.',
    'An aerospace engineer by training, I think in failure modes before features. I also write: a book, The Mellivora Paradox, and the 2 AM column, which I write late at night. Stackvenn is where it all lives, from what I learn shipping AI to what I notice about work along the way.',
  ] as string[],
  profiles: {
    linkedin: 'https://www.linkedin.com/in/sriharivvenkatesan',
    github: 'https://github.com/Mayadispeler',
    medium: 'https://medium.com/@ksvhari007',
    /** No Amazon author page is linked anywhere on iamsrihari.com yet. */
    amazonAuthor: '',
  },
  projects: [
    {
      name: 'Orqestra',
      // The Orqestra README's own tagline.
      what: 'Your personal orqestra of specialists. Assembled on demand.',
      // iamsrihari.com links MayaDispeler/TheOrqestra; the Orqestra README links sriharivvenkatesan/orqestra-ai.
      github: 'https://github.com/MayaDispeler/TheOrqestra',
      explained: 'how-orqestra-plans-a-build',
    },
    {
      name: 'Savepoint',
      // iamsrihari.com's tagline for Savepoint.
      what: 'Undo for AI agents that work on old software.',
      github: 'https://github.com/MayaDispeler/savepoint',
      explained: '',
    },
  ],
} as const;
