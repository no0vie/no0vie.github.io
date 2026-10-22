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
  it(`${locale}: renders one profile introduction with portrait and five contact channels`, () => {
    const html = renderToStaticMarkup(createElement(App, { locale, page: '' }));
    const portraitAlt = locale === 'ru' ? 'Портрет Евгения Новикова' : 'Portrait of Eugene Novikov';

    expect(html).toContain('class="profile-section"');
    expect(html).toContain(`alt="${portraitAlt}"`);
    expect(html).toContain('id="about"');
    expect(html).toContain('id="contacts"');
    expect(html.match(/class="contact-chip"/g)).toHaveLength(5);
    expect(html.match(/mailto:eugene\.malin765@gmail\.com/g)).toHaveLength(1);
    expect(html.match(/mailto:evgeniys-nov@yandex\.ru/g)).toHaveLength(1);
    expect(html.match(/https:\/\/t\.me\/no_0vie/g)).toHaveLength(1);
    expect(html.match(/https:\/\/wa\.me\/qr\/XFZZQSNXJCSBL1/g)).toHaveLength(1);
    expect(html.match(/class="contact-chip" href="https:\/\/github\.com\/no0vie"/g)).toHaveLength(
      1,
    );
    expect(html).toContain('class="footer-contact-link" href="#contacts"');
  });

  it(`${locale}: links the case from the resume and renders its complete static narrative`, () => {
    const resume = renderToStaticMarkup(createElement(App, { locale, page: '' }));
    expect(resume).toContain(`/${locale}/cases/campaign-wizard`);
    const html = renderToStaticMarkup(
      createElement(App, { locale, page: 'cases/campaign-wizard' }),
    );
    expect(html).toContain('id="results"');
    expect(html).toContain('id="lessons"');
    expect(html).toMatch(/1–2 (?:рабочих дн|working day)/i);
    expect(html).toMatch(/двухнедельного спринта|two-week sprint/i);
    expect(html).not.toContain('404');
  });
  it(`${locale}: evolution has four jobs and a non-employment milestone when enabled`, () => {
    const disabled = renderToStaticMarkup(createElement(App, { locale, page: '' }));
    expect(disabled).not.toContain(`/${locale}/evolution`);
    const html = renderToStaticMarkup(
      createElement(App, { locale, page: 'evolution', enableEvolution: true }),
    );
    expect(html.match(/class="evolution-step"/g)).toHaveLength(4);
    expect(html.match(/class="career-milestone"/g)).toHaveLength(1);
    expect(html).toMatch(/dateTime="2015-07">2015<\/time>–<time dateTime="2016-12">2016/);
    expect(html).toContain('https://github.com/no0vie/tic-tac-toe');
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
  expect(JSON.stringify(item)).not.toMatch(/ROI|revenue|payback|выручк|окупаемость|10x|10–15%/i);
  expect(item.sections.results.en).toMatch(/1–2 working days.*two-week sprint/i);
  expect(item.sections.results.ru).toMatch(/1–2 рабочих дн.*двухнедельного спринта/i);
});
