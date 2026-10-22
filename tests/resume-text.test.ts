import { describe, expect, it } from 'vitest';
import { experience, profile } from '../src/content';
import {
  formatAboutForClipboard,
  formatAchievementForClipboard,
  formatCaseSummaryForClipboard,
  formatExperienceForClipboard,
  formatExperienceSummaryForClipboard,
  formatHighlightForClipboard,
  formatProjectForClipboard,
} from '../src/app/resume-text';
import { cases } from '../src/content/cases';
import { highlights, projects } from '../src/content';

describe('resume clipboard blocks', () => {
  it('formats About as plain localized text', () => {
    expect(formatAboutForClipboard(profile, 'ru')).toContain(
      'Разрабатываю программные продукты с 2015 года',
    );
    expect(formatAboutForClipboard(profile, 'en')).toContain(
      'I have been building software since 2015',
    );
  });

  it('formats individual canonical content targets without decorative UI text', () => {
    for (const locale of ['ru', 'en'] as const) {
      const item = experience[0];
      expect(formatExperienceSummaryForClipboard(item, locale)).toBe(item.overview[locale]);
      expect(formatAchievementForClipboard(item.achievements[0], locale)).toBe(
        item.achievements[0].text[locale],
      );
      expect(formatHighlightForClipboard(highlights[0], locale)).toBe(
        `${highlights[0].heading[locale]}\n\n${highlights[0].text[locale]}`,
      );
      expect(formatProjectForClipboard(projects[0], locale)).toBe(
        `${projects[0].title[locale]}\n\n${projects[0].summary[locale]}`,
      );
      expect(formatCaseSummaryForClipboard(cases[0], locale)).toBe(
        `${cases[0].title[locale]}\n\n${cases[0].summary[locale]}`,
      );
    }
  });

  it('formats each employer as a standalone plain-text resume block', () => {
    for (const locale of ['ru', 'en'] as const) {
      for (const item of experience) {
        const block = formatExperienceForClipboard(item, locale);
        expect(block).toContain(item.employer[locale]);
        expect(block).toContain(item.role[locale]);
        expect(block).toContain(item.overview[locale]);
        expect(block).toContain(`• ${item.achievements[0]?.text[locale]}`);
        if (item.outcome) expect(block).toContain(item.outcome[locale]);
        expect(block).toContain(item.technologies.join(', '));
        for (const link of item.links) expect(block).not.toContain(link.url);
        expect(block).not.toMatch(/<[^>]+>/);
      }
    }
  });
});
