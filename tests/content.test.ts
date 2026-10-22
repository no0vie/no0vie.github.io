import { describe, expect, it } from 'vitest';
import {
  achievementSchema,
  contentSchema,
  experience,
  experienceSchema,
  highlights,
  localizedSchema,
  locales,
  monthSchema,
  profile,
  profileSchema,
  projectSchema,
  projects,
  sortExperience,
  validateContent,
} from '../src/content';

const bilingual = { ru: 'Текст', en: 'Text' };

describe('approved bilingual content', () => {
  it('validates the complete seed content', () => {
    expect(locales).toEqual(['ru', 'en']);
    expect(validateContent({ profile, experience, highlights, projects })).toEqual({
      profile,
      experience,
      highlights,
      projects,
    });
    expect(experience.map(({ id }) => id)).toEqual(['mts', 'yandex', 'tensor']);
    expect(projects).toEqual([]);
    expect(experience.every(({ caseStudySlugs }) => caseStudySlugs.length === 0)).toBe(true);
  });

  it.each([{ ru: 'Текст' }, { ru: ' ', en: 'Text' }, { ...bilingual, de: 'Text' }])(
    'rejects incomplete or extra translations: %j',
    (value) => {
      expect(localizedSchema.safeParse(value).success).toBe(false);
    },
  );

  it.each(['unverified', 'estimated', 'reported', 'observed'])(
    'rejects %s evidence',
    (evidence) => {
      expect(
        achievementSchema.safeParse({ id: 'example', text: bilingual, evidence, publishable: true })
          .success,
      ).toBe(false);
    },
  );

  it('rejects private achievements and undeclared metrics', () => {
    const achievement = {
      id: 'example',
      text: bilingual,
      evidence: 'confirmed',
      publishable: true,
    };
    expect(achievementSchema.safeParse({ ...achievement, publishable: false }).success).toBe(false);
    expect(achievementSchema.safeParse({ ...achievement, metric: '10%' }).success).toBe(false);
    expect(
      contentSchema.safeParse({
        profile,
        experience,
        highlights,
        projects,
        privateNotes: 'not public',
      }).success,
    ).toBe(false);
  });

  it('rejects contact fields and unapproved profile links', () => {
    expect(profileSchema.safeParse({ ...profile, email: 'private@example.com' }).success).toBe(
      false,
    );
    expect(profileSchema.safeParse({ ...profile, phone: '+123456789' }).success).toBe(false);
    expect(
      profileSchema.safeParse({ ...profile, github: 'https://github.com/unknown' }).success,
    ).toBe(false);
  });

  it('requires real update dates', () => {
    expect(profileSchema.safeParse({ ...profile, updated: '2026-02-30' }).success).toBe(false);
    expect(profileSchema.safeParse({ ...profile, updated: '2024-02-29' }).success).toBe(true);
  });

  it.each(['2024-00', '2024-13', '2024-1', '24-01', '0000-01', '2024-01-01'])(
    'rejects invalid career month %s',
    (date) => {
      expect(monthSchema.safeParse(date).success).toBe(false);
    },
  );

  it('rejects reversed ranges and unavailable case references', () => {
    const item = experience[0];
    expect(experienceSchema.safeParse({ ...item, start: '2024-05', end: '2024-04' }).success).toBe(
      false,
    );
    expect(
      experienceSchema.safeParse({ ...item, caseStudySlugs: ['unverified-case'] }).success,
    ).toBe(false);
  });

  it('sorts newest starts first without mutating input', () => {
    const items = [
      { start: '2017-01', id: 'old' },
      { start: '2024-05', id: 'new' },
      { start: '2021-03', id: 'middle' },
    ];
    expect(sortExperience(items).map(({ id }) => id)).toEqual(['new', 'middle', 'old']);
    expect(items.map(({ id }) => id)).toEqual(['old', 'new', 'middle']);
    expect(() => sortExperience([{ start: '2024-13' }])).toThrow();
  });

  it('rejects duplicate experience and achievement IDs', () => {
    expect(() =>
      validateContent({
        profile,
        experience: [...experience, experience[0]],
        highlights,
        projects,
      }),
    ).toThrow();
    const item = experience[0];
    expect(
      experienceSchema.safeParse({
        ...item,
        achievements: [...item.achievements, item.achievements[0]],
      }).success,
    ).toBe(false);
  });

  it('defines public projects without permitting unaudited links', () => {
    const project = {
      slug: 'example',
      title: bilingual,
      summary: bilingual,
      stage: 'concept',
      tech: [],
      public: true,
    };
    expect(projectSchema.safeParse(project).success).toBe(true);
    for (const extra of [
      { public: false },
      { stage: 'shipped' },
      { githubUrl: 'https://github.com/no0vie/example' },
      { demoUrl: 'javascript:alert(1)' },
    ]) {
      expect(projectSchema.safeParse({ ...project, ...extra }).success).toBe(false);
    }
  });

  it('keeps numerical performance claims and unverified language levels out of editorial copy', () => {
    const copy = JSON.stringify([
      profile.about,
      highlights,
      experience.map(({ overview, achievements }) => ({ overview, achievements })),
    ]);
    expect(copy).not.toMatch(/\d|B1|ROI|payback|окупаемость/i);
    expect(profile.name).toEqual({ ru: 'Евгений Новиков', en: 'Eugene Novikov' });
  });
});
