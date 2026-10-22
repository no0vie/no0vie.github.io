import { z } from 'zod';

export const locales = ['ru', 'en'] as const;
export const localeSchema = z.enum(locales);
export type Locale = z.infer<typeof localeSchema>;
const textSchema = z.string().trim().min(1);
const idSchema = z.string().regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/);
export const localizedSchema = z.object({ ru: textSchema, en: textSchema }).strict();
export type Localized = z.infer<typeof localizedSchema>;
export const monthSchema = z.string().regex(/^(?!0000)\d{4}-(0[1-9]|1[0-2])$/);
export const dateSchema = z
  .string()
  .regex(/^(?!0000)\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, 'Expected a real calendar date');

export const contactSchema = z
  .object({
    emails: z.tuple([z.literal('eugene.malin765@gmail.com'), z.literal('evgeniys-nov@yandex.ru')]),
    telegram: z.literal('https://t.me/no_0vie'),
    whatsapp: z.literal('https://wa.me/qr/XFZZQSNXJCSBL1'),
  })
  .strict();

export const profileSchema = z
  .object({
    name: localizedSchema,
    role: localizedSchema,
    about: localizedSchema,
    education: localizedSchema,
    github: z.literal('https://github.com/no0vie'),
    contacts: contactSchema,
    updated: dateSchema,
  })
  .strict();
export type Profile = z.infer<typeof profileSchema>;

export const achievementSchema = z
  .object({
    id: idSchema,
    text: localizedSchema,
    evidence: z.literal('confirmed'),
    publishable: z.literal(true),
  })
  .strict();
export type Achievement = z.infer<typeof achievementSchema>;

export const highlightSchema = z
  .object({
    id: idSchema,
    heading: localizedSchema,
    text: localizedSchema,
  })
  .strict();
export type Highlight = z.infer<typeof highlightSchema>;

export const availabilitySchema = z
  .object({
    status: z.enum(['available', 'selective', 'unavailable', 'unknown']),
    label: localizedSchema,
    updatedAt: dateSchema,
    source: z.enum(['manual', 'hh']),
    verifiedAt: dateSchema.optional(),
  })
  .strict();
export type Availability = z.infer<typeof availabilitySchema>;

export const careerMilestoneSchema = z
  .object({
    id: idSchema,
    afterExperienceId: idSchema,
    beforeExperienceId: idSchema,
    title: localizedSchema,
    text: localizedSchema,
    githubUrl: z.literal('https://github.com/no0vie/tic-tac-toe').optional(),
  })
  .strict();
export type CareerMilestone = z.infer<typeof careerMilestoneSchema>;

const uniqueIds = (items: readonly { id: string }[]) =>
  new Set(items.map(({ id }) => id)).size === items.length;
const experienceLinkSchema = z
  .object({
    label: z.enum(['OMNI', 'ORP', 'CRM Trends']),
    url: z.enum([
      'https://omnichannel.mts.ru/',
      'https://orp.mts.ru/',
      'https://omnichannel.mts.ru/crmtrends',
    ]),
  })
  .strict();

export const experienceSchema = z
  .object({
    id: idSchema,
    employer: localizedSchema,
    role: localizedSchema,
    start: monthSchema,
    end: monthSchema.optional(),
    datePrecision: z.enum(['exact', 'approximate']).default('exact'),
    overview: localizedSchema,
    outcome: localizedSchema.optional(),
    links: z.array(experienceLinkSchema).default([]),
    achievements: z
      .array(achievementSchema)
      .min(1)
      .refine(uniqueIds, 'Achievement IDs must be unique'),
    technologies: z.array(textSchema),
    caseStudySlugs: z.array(z.literal('campaign-wizard')).max(1),
  })
  .strict()
  .refine(({ start, end }) => end === undefined || start <= end, {
    message: 'End month must not precede start month',
    path: ['end'],
  });
export type CareerItem = z.infer<typeof experienceSchema>;

export const projectStageSchema = z.enum(['released', 'in-progress', 'concept']);
export type ProjectStage = z.infer<typeof projectStageSchema>;
const verifiedProjectUrlSchema = z.enum([
  'https://github.com/no0vie/pantry',
  'https://github.com/no0vie/magic-ball',
]);
export const projectSchema = z
  .object({
    slug: idSchema,
    title: localizedSchema,
    summary: localizedSchema,
    stage: projectStageSchema,
    tech: z.array(textSchema),
    githubUrl: verifiedProjectUrlSchema.optional(),
    demoUrl: z.never().optional(),
    public: z.literal(true),
  })
  .strict()
  .refine(
    ({ slug, githubUrl }) =>
      githubUrl === undefined || githubUrl === `https://github.com/no0vie/${slug}`,
    { message: 'GitHub URL must match the audited project slug', path: ['githubUrl'] },
  );
export type Project = z.infer<typeof projectSchema>;

export const skillGroupSchema = z
  .object({
    id: z.enum([
      'core-current',
      'architecture-state',
      'testing-tooling',
      'backend-data',
      'prior-specialized',
    ]),
    label: localizedSchema,
    skills: z.array(textSchema).min(1),
  })
  .strict();
export type SkillGroup = z.infer<typeof skillGroupSchema>;

export const contentSchema = z
  .object({
    profile: profileSchema,
    availability: availabilitySchema,
    careerMilestones: z
      .array(careerMilestoneSchema)
      .refine(uniqueIds, 'Career milestone IDs must be unique'),
    experience: z.array(experienceSchema).refine(uniqueIds, 'Experience IDs must be unique'),
    highlights: z.array(highlightSchema).refine(uniqueIds, 'Highlight IDs must be unique'),
    projects: z
      .array(projectSchema)
      .refine(
        (items) => new Set(items.map(({ slug }) => slug)).size === items.length,
        'Project slugs must be unique',
      ),
  })
  .strict();
export type Content = z.infer<typeof contentSchema>;

export function validateContent(value: unknown): Content {
  return contentSchema.parse(value);
}

/** Sort by start month, newest first, preserving input and equal-date order. */
export function sortExperience<T extends { start: string }>(items: readonly T[]): T[] {
  items.forEach(({ start }) => monthSchema.parse(start));
  return [...items].sort((a, b) => b.start.localeCompare(a.start));
}
