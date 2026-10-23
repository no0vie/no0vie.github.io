import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { basePath, localePath, pageKind, pdfFileName, pdfPath } from '../src/app/routes';
import { App } from '../src/app/App';
import { availability, experience, highlights, profile } from '../src/content';

const escapedText = (text: string) =>
  renderToStaticMarkup(createElement('span', null, text)).slice('<span>'.length, -'</span>'.length);

describe('static page routes', () => {
  it('prefixes local paths for root and project deployments', () => {
    expect(basePath('/en/projects', '/')).toBe('/en/projects');
    expect(basePath('/en/projects', '/career/')).toBe('/career/en/projects');
    expect(basePath('en', '/career')).toBe('/career/en');
    expect(basePath('en')).toBe(`${import.meta.env.BASE_URL}en`);
  });
  it('preserves page segments when switching languages', () => {
    expect(localePath('ru', 'projects', '/career/')).toBe('/career/ru/projects');
    expect(localePath('en', '', '/')).toBe('/en');
    expect(localePath('en', 'projects/missing', '/')).toBe('/en/projects/missing');
    expect(localePath('ru', 'strange?#/name', '/')).toBe('/ru/strange%3F%23/name');
  });
  it('recognizes the published resume, projects and Evolution routes', () => {
    expect(pageKind('')).toBe('resume');
    expect(pageKind('projects')).toBe('projects');
    expect(pageKind('evolution', true)).toBe('evolution');
    for (const page of ['unknown', 'projects/missing', 'cases/example'])
      expect(pageKind(page)).toBe('not-found');
  });
  it('links to dated locale-specific PDFs under the deployment base', () => {
    expect(pdfFileName('ru')).toBe('eugene-novikov-sse-2026-10-22-ru.pdf');
    expect(pdfFileName('en')).toBe('eugene-novikov-sse-2026-10-22-en.pdf');
    expect(pdfPath('ru', '/career/')).toBe(
      '/career/downloads/eugene-novikov-sse-2026-10-22-ru.pdf',
    );
    expect(pdfPath('en', '/')).toBe('/downloads/eugene-novikov-sse-2026-10-22-en.pdf');
  });
});

describe('server-rendered resume', () => {
  it.each(['ru', 'en'] as const)(
    'renders complete approved %s content without browser globals',
    (locale) => {
      const html = renderToStaticMarkup(createElement(App, { locale, page: '' }));
      for (const item of experience) {
        expect(html).toContain(escapedText(item.employer[locale]));
        for (const achievement of item.achievements)
          expect(html).toContain(escapedText(achievement.text[locale]));
      }
      for (const highlight of highlights) {
        expect(html).toContain(escapedText(highlight.heading[locale]));
        expect(html).toContain(escapedText(highlight.text[locale]));
      }
      expect(html).toContain(escapedText(profile.education[locale]));
      expect(html).toContain(escapedText(availability.label[locale]));
      expect(html).toContain('class="availability-status"');
      expect(html).toContain('https://wa.me/qr/XFZZQSNXJCSBL1');
      expect(html).toContain(`downloads/eugene-novikov-sse-2026-10-22-${locale}.pdf`);
      expect(html).toContain(`download="eugene-novikov-sse-2026-10-22-${locale}.pdf"`);
      expect(html).toContain('id="main"');
      expect(html).not.toContain('<details');
    },
  );
  it('renders verified projects and preserves the locale-switch route', () => {
    const html = renderToStaticMarkup(createElement(App, { locale: 'en', page: 'projects' }));
    expect(html).toContain('Pantry');
    expect(html).toContain('Magic Ball');
    expect(html).toContain('https://github.com/no0vie/pantry');
    expect(html).toContain('The public version is complete');
    expect(html).toContain('Released');
    expect(html).toContain('Concept');
    expect(html).toContain('href="/ru/projects"');
  });
  it('renders a localized not-found page with a route home', () => {
    const html = renderToStaticMarkup(createElement(App, { locale: 'en', page: 'missing' }));
    expect(html).toContain('404');
    expect(html).toContain('Page not found');
    expect(html).toContain('href="/en"');
  });
});
