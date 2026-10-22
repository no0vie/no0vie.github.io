import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { basePath, localePath, pageKind, pdfPath } from '../src/app/routes';
import { App } from '../src/app/App';
import { experience, highlights, profile } from '../src/content';

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
  it('only recognizes the resume and projects index', () => {
    expect(pageKind('')).toBe('resume');
    expect(pageKind('projects')).toBe('projects');
    for (const page of ['unknown', 'projects/missing', 'evolution', 'cases/example'])
      expect(pageKind(page)).toBe('not-found');
  });
  it('links to locale-specific PDFs under the deployment base', () => {
    expect(pdfPath('ru', '/career/')).toBe('/career/downloads/resume-ru.pdf');
    expect(pdfPath('en', '/')).toBe('/downloads/resume-en.pdf');
  });
});

describe('server-rendered resume', () => {
  it.each(['ru', 'en'] as const)(
    'renders complete approved %s content without browser globals',
    (locale) => {
      const html = renderToStaticMarkup(createElement(App, { locale, page: '' }));
      for (const item of experience) {
        expect(html).toContain(item.employer[locale]);
        for (const achievement of item.achievements)
          expect(html).toContain(achievement.text[locale]);
      }
      for (const highlight of highlights) expect(html).toContain(highlight[locale]);
      expect(html).toContain(profile.education[locale]);
      expect(html).toContain(`downloads/resume-${locale}.pdf`);
      expect(html).toContain('id="main"');
      expect(html).not.toContain('<details');
    },
  );
  it('renders an honest empty index and preserves the locale-switch route', () => {
    const html = renderToStaticMarkup(createElement(App, { locale: 'en', page: 'projects' }));
    expect(html).toContain('No verified projects published yet.');
    expect(html).toContain('href="/ru/projects"');
  });
  it('renders a localized not-found page with a route home', () => {
    const html = renderToStaticMarkup(createElement(App, { locale: 'en', page: 'missing' }));
    expect(html).toContain('404');
    expect(html).toContain('Page not found');
    expect(html).toContain('href="/en"');
  });
});
