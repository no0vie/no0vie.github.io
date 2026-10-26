import { build, createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';

import { publishingConfig, normalizePdf, validatePdf } from './publishing';
import { serve } from './server';
import type { App as AppType } from '../src/app/App';
import type { InterviewPage as InterviewPageType } from '../src/features/interview/InterviewPage';
import type { copy as copyType } from '../src/app/copy';
import type { cases as casesType } from '../src/content/cases';
import { availability, profile } from '../src/content';
import { notes } from '../src/content/notes';
import { interviewExercises } from '../src/content/interview';
import { preparationTopics } from '../src/content/preparation';
import { pdfFileName } from '../src/app/routes';

process.env.PLAYWRIGHT_BROWSERS_PATH ??= '0';
const { chromium } = await import('@playwright/test');
const config = publishingConfig();
const enableEvolution = process.env.ENABLE_EVOLUTION !== 'false';
const knownPages = [
  '',
  'projects',
  'notes',
  ...notes.map(({ slug }) => `notes/${slug}`),
  'interview',
  'interview/topics',
  ...preparationTopics.map(({ slug }) => `interview/topics/${slug}`),
  'interview/practice',
  'interview/paths',
  ...interviewExercises.flatMap(({ slug }) => [`interview/${slug}`, `interview/practice/${slug}`]),
];
const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!,
  );
await build();
const template = await readFile('dist/index.html', 'utf8');
const ssr = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { App } = (await ssr.ssrLoadModule('/src/app/App.tsx')) as { App: typeof AppType };
  const { InterviewPage } = (await ssr.ssrLoadModule(
    '/src/features/interview/InterviewPage.tsx',
  )) as { InterviewPage: typeof InterviewPageType };
  const { copy } = (await ssr.ssrLoadModule('/src/app/copy.ts')) as {
    copy: typeof copyType;
  };

  const { cases } = (await ssr.ssrLoadModule('/src/content/cases.ts')) as {
    cases: typeof casesType;
  };
  knownPages.push(
    ...cases.map((item) => `cases/${item.slug}`),
    ...(enableEvolution ? ['evolution'] : []),
  );
  for (const locale of ['ru', 'en'] as const) {
    for (const page of [...knownPages, '404']) {
      const t = copy[locale];
      const caseStudy = cases.find((item) => page === `cases/${item.slug}`);
      const interviewExercise = interviewExercises.find(
        (item) => page === `interview/${item.slug}` || page === `interview/practice/${item.slug}`,
      );
      const preparationTopic = preparationTopics.find(
        (item) => page === `interview/topics/${item.slug}`,
      );
      const interviewTitle = locale === 'ru' ? 'Лаборатория интервью' : 'Interview Lab';
      const title = `${profile.name[locale]} — ${caseStudy ? caseStudy.title[locale] : interviewExercise ? interviewExercise.content[locale].title : preparationTopic ? preparationTopic.title[locale] : page === 'interview' ? interviewTitle : page === 'evolution' ? t.evolution : page === 'projects' ? t.projects : page === '404' ? t.notFound : t.resume}`;
      const description = caseStudy
        ? caseStudy.summary[locale]
        : interviewExercise
          ? interviewExercise.content[locale].description
          : preparationTopic
            ? preparationTopic.description[locale]
            : page === 'interview'
              ? locale === 'ru'
                ? 'Практические задания уровня Senior по JavaScript, TypeScript, браузеру, безопасности и системному дизайну.'
                : 'Practical senior-level JavaScript, TypeScript, browser, security, and system-design exercises.'
              : page === 'evolution'
                ? t.evolutionIntro
                : page === 'projects'
                  ? t.emptyDetail
                  : profile.about[locale];
      const path = `${locale}${page ? `/${page}` : ''}`;
      const structuredData = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: profile.name[locale],
        url: config.url(locale),
        email: `mailto:${profile.contacts.emails[0]}`,
        sameAs: [profile.github, profile.contacts.telegram],
        hasOccupation: { '@type': 'Occupation', name: profile.role[locale] },
        alumniOf: {
          '@type': 'EducationalOrganization',
          name:
            locale === 'ru'
              ? 'Ярославский государственный университет им. П. Г. Демидова'
              : 'P. G. Demidov Yaroslavl State University',
        },
      }).replace(/</g, '\\u003c');
      const seo =
        `<meta name="description" content="${escape(description)}"><link rel="icon" href="${config.base}favicon.svg">` +
        (page === '404'
          ? '<meta name="robots" content="noindex">'
          : `<link rel="canonical" href="${config.url(path)}">${['ru', 'en'].map((lang) => `<link rel="alternate" hreflang="${lang}" href="${config.url(`${lang}${page ? `/${page}` : ''}`)}">`).join('')}<link rel="alternate" hreflang="x-default" href="${config.url(`ru${page ? `/${page}` : ''}`)}"><meta property="og:type" content="website"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${config.url(path)}"><meta property="og:locale" content="${locale === 'ru' ? 'ru_RU' : 'en_US'}"><meta property="og:image" content="${config.url(`og-${locale}.png`)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${escape(`${profile.name[locale]} — ${profile.role[locale]}`)}"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${structuredData}</script>`);
      const html = template
        .replace('lang="ru"', `lang="${locale}"`)
        .replace('data-page=""', `data-page="${page}" data-evolution="${enableEvolution}"`)
        .replace(/<title>.*?<\/title>/, `<title>${escape(title)}</title>`)
        .replace('<!--seo-->', seo)
        .replace(
          '<!--app-->',
          renderToString(
            React.createElement(App, {
              locale,
              page,
              enableEvolution,
              interviewComponent: InterviewPage,
            }),
          ),
        );
      if (page === '404') {
        if (locale === 'ru') await writeFile('dist/404.html', html);
      } else {
        await mkdir(`dist/${path}`, { recursive: true });
        await writeFile(`dist/${path}/index.html`, html);
      }
    }
  }
} finally {
  await ssr.close();
}
const root = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${profile.name.ru} / ${profile.name.en}</title><script>var locale='ru';try{if(localStorage.getItem('locale')==='en')locale='en'}catch{}location.replace(${JSON.stringify(config.base)}+locale)</script></head><body><main><h1>${profile.name.ru} / ${profile.name.en}</h1><p>Senior Software Engineer (Frontend-focused)</p><p><a href="${config.base}ru">Резюме на русском</a> · <a href="${config.base}en">Resume in English</a></p></main></body></html>`;
await writeFile('dist/index.html', root);
// `/notes` is the public entry point; query `lang` switches its hydrated locale.
await cp('dist/ru/notes', 'dist/notes', { recursive: true });
await writeFile('dist/.nojekyll', '');
await writeFile('dist/availability.json', `${JSON.stringify(availability, null, 2)}\n`);
await writeFile(
  'dist/robots.txt',
  `User-agent: *\nAllow: /\nSitemap: ${config.url('sitemap.xml')}\n`,
);
await writeFile(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[
    'ru',
    'en',
  ]
    .flatMap((locale) => knownPages.map((page) => `${locale}${page ? `/${page}` : ''}`))
    .map((path) => `<url><loc>${config.url(path)}</loc></url>`)
    .join('')}</urlset>`,
);
await mkdir('dist/downloads', { recursive: true });
const server = await serve('dist', config.base);
try {
  const browser = await chromium.launch({ timeout: 30_000 });
  const deadline = setTimeout(() => {
    void browser.close();
  }, 90_000);
  try {
    for (const locale of ['ru', 'en'] as const) {
      const page = await browser.newPage({
        locale,
        timezoneId: 'UTC',
        colorScheme: 'light',
        reducedMotion: 'reduce',
        javaScriptEnabled: false,
      });
      await page.goto(`${server.origin}${config.base}${locale}`, {
        waitUntil: 'networkidle',
        timeout: 30_000,
      });
      await page.locator('a[href]').evaluateAll(
        (anchors, values) => {
          const { localOrigin, publicOrigin, base } = values;
          for (const anchor of anchors as HTMLAnchorElement[]) {
            const target = new URL(anchor.href);
            if (target.origin !== localOrigin) continue;
            const relativePath = target.pathname.startsWith(base)
              ? target.pathname.slice(base.length)
              : target.pathname.replace(/^\//, '');
            anchor.href = `${publicOrigin}${base}${relativePath}${target.search}${target.hash}`;
          }
        },
        {
          localOrigin: server.origin,
          publicOrigin: new URL(config.url('')).origin,
          base: config.base,
        },
      );
      await page.emulateMedia({ media: 'print' });
      await page
        .waitForFunction(() => document.fonts.status === 'loaded', undefined, { timeout: 5_000 })
        .catch(() => undefined);
      const pdf = await page.pdf({
        format: 'A4',
        preferCSSPageSize: true,
        printBackground: true,
        tagged: true,
      });
      const normalizedPdf = normalizePdf(pdf);
      try {
        validatePdf(normalizedPdf);
      } catch (error) {
        throw new Error(`Invalid ${locale} PDF`, { cause: error });
      }
      await writeFile(`dist/downloads/${pdfFileName(locale)}`, normalizedPdf);
      await page.close();
    }
  } finally {
    clearTimeout(deadline);
    await browser.close();
  }
} finally {
  await server.close();
}
console.log('Static pages, SEO and both mandatory PDFs generated.');
