import { describe, expect, it } from 'vitest';
import { experience, profile } from '../src/content';
import { formatAboutForClipboard, formatExperienceForClipboard } from '../src/app/resume-text';

describe('resume clipboard blocks', () => {
  it('formats About as plain localized text', () => {
    expect(formatAboutForClipboard(profile, 'ru')).toContain(
      'Разрабатываю программные продукты с 2015 года',
    );
    expect(formatAboutForClipboard(profile, 'en')).toContain(
      'I have been building software since 2015',
    );
  });

  it('formats each employer for the HH duties field without card metadata', () => {
    for (const locale of ['ru', 'en'] as const) {
      for (const item of experience) {
        const block = formatExperienceForClipboard(item, locale);
        expect(block).toContain(item.overview[locale]);
        expect(block).toContain(`• ${item.achievements[0]?.text[locale]}`);
        if (item.outcome) expect(block).toContain(`• ${item.outcome[locale]}`);
        const lines = block.split('\n');
        expect(lines).not.toContain(item.employer[locale]);
        expect(lines).not.toContain(item.role[locale]);
        expect(lines).not.toContain(item.start);
        expect(block).not.toContain(item.technologies.join(', '));
        for (const link of item.links) expect(block).not.toContain(link.url);
        expect(block).not.toMatch(/\n{3,}|[ \t]{2,}|<[^>]+>/);
      }
    }
  });

  it('omits empty paragraphs, normalizes whitespace and removes duplicate bullets', () => {
    const source = experience[0];
    const duplicate = source.achievements[0];
    if (!duplicate) throw new Error('Expected a seeded achievement');
    const item = {
      ...source,
      overview: { ru: '  ', en: '  ' },
      achievements: [
        { ...duplicate, text: { ru: ' Первый  пункт\n', en: ' First  item\n' } },
        {
          ...duplicate,
          id: `${duplicate.id}-duplicate`,
          text: { ru: 'Первый пункт', en: 'First item' },
        },
      ],
      outcome: undefined,
    };

    expect(formatExperienceForClipboard(item, 'ru')).toBe('• Первый пункт');
    expect(formatExperienceForClipboard(item, 'en')).toBe('• First item');
  });
});
