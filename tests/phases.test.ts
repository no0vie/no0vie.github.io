import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { App } from '../src/app/App';
import { pageKind } from '../src/app/routes';

it('recognizes only the published case and explicitly enabled evolution', () => {
  expect(pageKind('cases/campaign-wizard')).toBe('case');
  expect(pageKind('cases/missing')).toBe('not-found');
  expect(pageKind('evolution')).toBe('not-found');
  expect(pageKind('evolution', true)).toBe('evolution');
});
for (const locale of ['ru', 'en'] as const) {
  it(`${locale}: links the case from the resume and renders its complete static narrative`, () => {
    const resume = renderToStaticMarkup(createElement(App, { locale, page: '' }));
    expect(resume).toContain(`/${locale}/cases/campaign-wizard`);
    const html = renderToStaticMarkup(
      createElement(App, { locale, page: 'cases/campaign-wizard' }),
    );
    expect(html).toContain('id="results"');
    expect(html).toContain('id="lessons"');
    expect(html).not.toContain('404');
  });
  it(`${locale}: evolution has three static steps only when enabled`, () => {
    const disabled = renderToStaticMarkup(createElement(App, { locale, page: '' }));
    expect(disabled).not.toContain(`/${locale}/evolution`);
    const html = renderToStaticMarkup(
      createElement(App, { locale, page: 'evolution', enableEvolution: true }),
    );
    expect(html.match(/class="evolution-step"/g)).toHaveLength(3);
    expect(html).toContain('2017-01');
    expect(html).toContain('2024-05');
  });
}

import { cases, caseSchema } from '../src/content/cases';
it('allows only complete confirmed public case narratives without extra metrics or private fields', () => {
  const item = cases[0];
  expect(caseSchema.safeParse(item).success).toBe(true);
  for (const extra of [
    { evidence: 'reported' },
    { publishable: false },
    { metric: '10%' },
    { privateNotes: 'private' },
  ]) {
    expect(caseSchema.safeParse({ ...item, ...extra }).success).toBe(false);
  }
  expect(caseSchema.safeParse({ ...item, title: { en: 'Only English' } }).success).toBe(false);
  expect(
    caseSchema.safeParse({ ...item, sections: { ...item.sections, results: undefined } }).success,
  ).toBe(false);
  expect(JSON.stringify(item)).not.toMatch(/\d|ROI|revenue|payback|выручк|окупаемость/i);
});
