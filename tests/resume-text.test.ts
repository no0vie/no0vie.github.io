import { describe, expect, it } from 'vitest';
import { experience, profile } from '../src/content';
import { formatAboutForClipboard, formatExperienceForClipboard } from '../src/app/resume-text';

describe('resume clipboard blocks', () => {
  it('formats About as plain localized text', () => {
    expect(formatAboutForClipboard(profile, 'ru')).toContain(
      'Разрабатываю программные продукты с 2015 года',
    );
    expect(formatAboutForClipboard(profile, 'en')).toContain(
      'I have built software products since 2015',
    );
  });

  it('formats each employer as a standalone plain-text resume block', () => {
    for (const locale of ['ru', 'en'] as const) {
      for (const item of experience) {
        const block = formatExperienceForClipboard(item, locale);
        expect(block).toContain(item.employer[locale]);
        expect(block).toContain(item.role[locale]);
        expect(block).toContain(item.overview[locale]);
        expect(block).toContain(`• ${item.achievements[0]?.text[locale]}`);
        expect(block).toContain(item.technologies.join(', '));
        expect(block).not.toMatch(/<[^>]+>/);
      }
    }
  });
});
