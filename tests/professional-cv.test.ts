import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { availability, experience, projects } from '../src/content';
import {
  createProfessionalCv,
  releasedProjects,
  type CvProjectInput,
} from '../src/features/export/professional-cv';
import { ProfessionalCv } from '../src/features/export/ProfessionalCv';

const project = (stage: CvProjectInput['stage']): CvProjectInput => ({
  slug: 'test-project',
  title: { ru: 'Тест', en: 'Test' },
  summary: { ru: 'Описание', en: 'Description' },
  stage,
  public: true,
});

describe('professional CV projection', () => {
  it('includes every canonical professional experience record without copying it', () => {
    const cv = createProfessionalCv('ru');

    expect(cv.experience).toEqual(experience);
    expect(cv.experience).toHaveLength(4);
    expect(cv.experience.every((item, index) => item === experience[index])).toBe(true);
  });

  it('includes only released projects from the canonical catalogue', () => {
    const cv = createProfessionalCv('en');

    expect(cv.releasedProjects.map(({ slug }) => slug)).toEqual(['pantry']);
    expect(cv.releasedProjects[0]).toBe(projects.find(({ slug }) => slug === 'pantry'));
    expect(cv.releasedProjects.map(({ slug }) => slug)).not.toContain('magic-ball');
    expect(cv.releasedProjects.map(({ slug }) => slug)).not.toContain('brnchly');
  });

  it.each(['in-progress', 'concept'] as const)('excludes %s projects', (stage) => {
    expect(releasedProjects([project(stage)])).toEqual([]);
  });

  it('excludes projects with an unknown or absent status at the projection boundary', () => {
    expect(releasedProjects([{ ...project('released'), stage: 'unknown' }])).toEqual([]);
    expect(releasedProjects([{ ...project('released'), stage: undefined }])).toEqual([]);
  });

  it('omits the projects section when no released projects exist', () => {
    expect(releasedProjects([])).toEqual([]);
    expect(releasedProjects([project('concept')])).toEqual([]);
  });

  it('automatically includes a project after a transition to released', () => {
    const candidate = project('in-progress');
    expect(releasedProjects([candidate])).toEqual([]);
    expect(releasedProjects([{ ...candidate, stage: 'released' }])).toHaveLength(1);
  });

  it('uses localized labels and the matching portfolio URL', () => {
    const ru = createProfessionalCv('ru');
    const en = createProfessionalCv('en');

    expect(ru.labels.coreSkills).toBe('Ключевые компетенции');
    expect(en.labels.coreSkills).toBe('Core skills');
    expect(ru.portfolioUrl).toBe('https://no0vie.github.io/ru/');
    expect(en.portfolioUrl).toBe('https://no0vie.github.io/en/');
    expect(ru.releasedProjects[0]?.summary.ru).toContain('рецептов');
    expect(en.releasedProjects[0]?.summary.en).toContain('recipes');
  });

  it('uses an explicit allowlist and excludes web-only data and availability', () => {
    const cv = createProfessionalCv('en');

    expect(Object.keys(cv).sort()).toEqual(
      [
        'coreSkills',
        'experience',
        'labels',
        'locale',
        'portfolioUrl',
        'profile',
        'releasedProjects',
      ].sort(),
    );
    expect(cv).not.toHaveProperty('availability');
    expect(cv).not.toHaveProperty('highlights');
    expect(cv).not.toHaveProperty('cases');
    expect(cv).not.toHaveProperty('navigation');
    expect(availability.label.en).toBe('Open to opportunities');
  });

  it('projects the three distinct landing-page workstreams into both localized PDFs', () => {
    for (const locale of ['ru', 'en'] as const) {
      const mts = createProfessionalCv(locale).experience.find(
        ({ id }) => id === 'mts-web-services',
      );
      const text = mts?.achievements.map((achievement) => achievement.text[locale]).join(' ');
      expect(text).toMatch(
        locale === 'ru'
          ? /существующего публичного лендинга/
          : /existing public-facing landing page/,
      );
      expect(text).toMatch(
        locale === 'ru' ? /всех публичных лендингов/ : /all public-facing landing pages/,
      );
      expect(text).toMatch(
        locale === 'ru' ? /новый лендинг.*один вечер/ : /new event landing page.*single evening/,
      );
    }
  });

  it('keeps substantial experience content intact', () => {
    const cv = createProfessionalCv('ru');

    for (const item of experience) {
      const projected = cv.experience.find(({ id }) => id === item.id);
      expect(projected?.overview).toBe(item.overview);
      expect(projected?.achievements).toBe(item.achievements);
      expect(projected?.technologies).toBe(item.technologies);
    }
  });

  it.each(['ru', 'en'] as const)(
    'renders the explicit %s CV without web-only sections',
    (locale) => {
      const html = renderToStaticMarkup(
        createElement(ProfessionalCv, { locale, siteUrl: 'https://no0vie.github.io' }),
      );

      expect(html).toContain('class="professional-cv"');
      expect(html).toContain('branding/logo.svg');
      expect(html).toContain(`https://no0vie.github.io/${locale}/`);
      expect(html).toContain('Pantry');
      expect(html).not.toContain('Magic Ball');
      expect(html).not.toContain('brnchly');
      expect(html).not.toContain(availability.label[locale]);
      expect(html).not.toMatch(
        /Selected highlights|Главное в работе|Selected case studies|Избранные кейсы/,
      );
    },
  );
});
