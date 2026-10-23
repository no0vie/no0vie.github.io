import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { App } from '../src/app/App';
import { getEvolutionStages } from '../src/app/evolution-data';
import { experience } from '../src/content';

describe('Evolution stage adapter', () => {
  it.each(['ru', 'en'] as const)(
    'maps canonical experience into four chronological %s stages',
    (locale) => {
      const stages = getEvolutionStages(locale);

      expect(stages.map(({ id }) => id)).toEqual(['fruct', 'tensor', 'yandex', 'mts']);
      expect(stages).toHaveLength(4);
      for (const stage of stages) {
        const source = experience.find(({ id }) => id === stage.id);
        expect(source).toBeDefined();
        expect(stage.employer).toBe(source?.employer[locale]);
        expect(stage.role).toBe(source?.role[locale]);
        expect(stage.summary).toBe(source?.overview[locale]);
        expect(stage.highlights.length).toBeGreaterThanOrEqual(2);
        expect(stage.highlights.length).toBeLessThanOrEqual(4);
        expect(
          stage.highlights.every((text) =>
            source?.achievements.some((item) => item.text[locale] === text),
          ),
        ).toBe(true);
        expect(stage.resumeAnchor).toBe(`experience-${stage.id}`);
        expect(stage.capabilities.length).toBeGreaterThan(0);
      }
    },
  );

  it('keeps localized presentation metadata aligned by stable stage ID', () => {
    const ru = getEvolutionStages('ru');
    const en = getEvolutionStages('en');

    expect(ru.map(({ id }) => id)).toEqual(en.map(({ id }) => id));
    expect(ru.map(({ capabilities }) => capabilities.length)).toEqual(
      en.map(({ capabilities }) => capabilities.length),
    );
  });
});

describe('Evolution server-rendered experience', () => {
  it.each(['ru', 'en'] as const)(
    'renders an accessible interactive map and complete %s fallback',
    (locale) => {
      const html = renderToStaticMarkup(
        createElement(App, { locale, page: 'evolution', enableEvolution: true }),
      );

      expect(html).toContain('class="evolution-page"');
      expect(html).toContain('data-evolution-map');
      expect(html).toContain('role="tablist"');
      expect(html.match(/role="tab"/g)).toHaveLength(4);
      expect(html).toContain('aria-selected="true"');
      expect(html).toContain('data-evolution-previous');
      expect(html).toContain('data-evolution-next');
      expect(html).toContain('aria-live="polite"');
      expect(html).toContain(`href="/${locale}#experience-fruct"`);
      expect(html).toContain('class="evolution-route-art"');
      expect(html).toContain('class="evolution-swallow"');
      expect(html).toContain(
        locale === 'ru'
          ? 'Создано с любопытством, ChatGPT и Codex.'
          : 'Built with curiosity, ChatGPT &amp; Codex.',
      );
    },
  );
});
