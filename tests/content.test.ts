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
  skillGroupSchema,
  skillGroups,
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
    expect(projects.map(({ slug }) => slug)).toEqual([
      'pantry',
      'magic-ball',
      'riply',
      'cave-escaper',
    ]);
    expect(experience.find(({ id }) => id === 'mts')?.caseStudySlugs).toEqual(['campaign-wizard']);
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

  it('allows only explicitly approved public contacts and profile links', () => {
    expect(profile.contacts).toEqual({
      emails: ['eugene.malin765@gmail.com', 'evgeniys-nov@yandex.ru'],
      telegram: 'https://t.me/no_0vie',
      whatsapp: 'https://wa.me/qr/XFZZQSNXJCSBL1',
    });

    expect(profile.availability).toEqual({
      ru: 'Рассматриваю предложения',
      en: 'Open to opportunities',
    });
    expect(profileSchema.safeParse({ ...profile, phone: '+123456789' }).success).toBe(false);
    expect(
      profileSchema.safeParse({
        ...profile,
        contacts: { ...profile.contacts, emails: ['private@example.com'] },
      }).success,
    ).toBe(false);
    expect(
      profileSchema.safeParse({
        ...profile,
        contacts: { ...profile.contacts, whatsapp: 'https://wa.me/no_0vie' },
      }).success,
    ).toBe(false);
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
    expect(
      experienceSchema.safeParse({ ...item, caseStudySlugs: ['campaign-wizard'] }).success,
    ).toBe(true);
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

  it('publishes audited repositories and keeps concept projects link-free', () => {
    expect(projects).toEqual([
      expect.objectContaining({
        slug: 'pantry',
        stage: 'released',
        tech: ['React', 'TypeScript', 'Vite', 'MobX', 'Ant Design', 'Playwright'],
        githubUrl: 'https://github.com/no0vie/pantry',
      }),
      expect.objectContaining({
        slug: 'magic-ball',
        stage: 'in-progress',
        tech: ['Vue 3', 'JavaScript', 'Vuex', 'Vue Router', 'Vite', 'Playwright'],
        githubUrl: 'https://github.com/no0vie/magic-ball',
      }),
      expect.objectContaining({ slug: 'riply', stage: 'concept', tech: [] }),
      expect.objectContaining({ slug: 'cave-escaper', stage: 'concept', tech: [] }),
    ]);
    expect(projects[0]?.summary.ru).toMatch(/публичн.*верс.*завершен.*платформ/i);
    expect(projects[0]?.summary.en).toMatch(/public version.*complete.*platform/i);
    expect(projects.slice(2).every((project) => !('githubUrl' in project))).toBe(true);
    expect(JSON.stringify(projects.slice(2))).toMatch(/Telegram|Телеграм/);

    const project = projects[0];
    for (const extra of [
      { public: false },
      { stage: 'shipped' },
      { githubUrl: 'https://github.com/no0vie/example' },
      { demoUrl: 'javascript:alert(1)' },
    ]) {
      expect(projectSchema.safeParse({ ...project, ...extra }).success).toBe(false);
    }
  });

  it('uses approved recruiter-focused editorial facts and ordering', () => {
    expect(profile.name).toEqual({ ru: 'Евгений Новиков', en: 'Eugene Novikov' });
    expect(profile.role).toEqual({
      ru: 'Старший разработчик ПО',
      en: 'Senior Software Developer',
    });
    expect(profile.about.ru).toMatch(/2017|архитектур|продукт|дежур|настав/i);
    expect(profile.about.en).toMatch(/2017|architect|product|on-call|mentor/i);
    expect(profile.education.ru).toMatch(/B1.*самооцен/i);
    expect(profile.education.en).toMatch(/B1.*self-assessed/i);
    expect(profile.education.en).toMatch(/technical documentation.*communicat/i);

    const mts = experience.find(({ id }) => id === 'mts');
    expect(JSON.stringify([highlights, mts])).toMatch(/1–2 (рабоч|working) (дн|day)/i);
    const yandexIds = experience
      .find(({ id }) => id === 'yandex')
      ?.achievements.map(({ id }) => id);
    expect(yandexIds).toEqual([
      'checkout-addresses',
      'production-on-call',
      'microfrontends',
      'address-cache',
      'map-preloading',
      'ab-experiments',
      'reviews-mentoring',
    ]);
    expect(yandexIds).not.toContain('address-experiment');
  });

  it('exports localized categorized skill groups from verified technologies', () => {
    expect(skillGroups.map(({ id }) => id)).toEqual([
      'core-current',
      'architecture-state',
      'testing-tooling',
      'backend-data',
      'prior-specialized',
    ]);
    expect(skillGroups.every((group) => skillGroupSchema.safeParse(group).success)).toBe(true);
    expect(skillGroups.flatMap(({ skills }) => skills)).toEqual(
      expect.arrayContaining([
        'React',
        'TypeScript',
        'MobX',
        'Microfrontends',
        'Playwright',
        'NestJS',
        'PostgreSQL',
        'WaSaby',
      ]),
    );
  });

  it('keeps confidential and unsupported performance claims out of editorial copy', () => {
    const copy = JSON.stringify({ profile, highlights, experience, projects });
    expect(copy).not.toMatch(/ROI|payback|окупаемость|10x|10–15%/i);
  });
});
