// Facts about the author, copied from iamsrihari.com's source (components/sections/career.tsx,
// about.tsx, lib/seo.ts) on 2026-10-30. Nothing here is written fresh: prose about Srihari (the bio,
// the one-line role descriptions) arrives through a content PR he approves. Unknowns are left empty.

export const AUTHOR = {
  jobTitle: 'AI Engineer',
  location: 'Chennai',
  worksFor: 'Kissflow',
  roles: [
    { role: 'Lead Engineer', company: 'Kissflow', period: 'Jul 2021 – Present', line: '' },
    {
      role: 'Data Engineer',
      company: 'Neurealm (formerly GAVS Tech)',
      period: 'Sep 2020 – Jul 2021',
      line: '',
    },
    {
      role: 'System Engineer',
      company: 'Tata Consultancy Services',
      period: 'Jul 2017 – Aug 2020',
      line: '',
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
  bio: [] as string[],
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
