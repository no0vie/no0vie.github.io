import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToString } from 'react-dom/server';
import type { Plugin } from 'vite';
import type { App as AppType } from '../src/app/App';
import type { pageKind as pageKindType } from '../src/app/routes';

/** Development mirrors the static hydration contract, not an SPA fallback. */
export function resumeDev(): Plugin {
  return {
    name: 'resume-development-html',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        void (async () => {
          if (!request.headers.accept?.includes('text/html')) {
            next();
            return;
          }
          try {
            const requestUrl = new URL(request.url ?? '/', 'http://localhost');
            const path = requestUrl.pathname;
            const localPath = path.startsWith(server.config.base)
              ? path.slice(server.config.base.length)
              : path;
            const parts = localPath.split('/').filter(Boolean);
            if (!parts.length) {
              response.writeHead(302, { Location: `${server.config.base}ru` });
              response.end();
              return;
            }
            const isPublicNotesRoute = parts[0] === 'notes';
            const requestedLocale = requestUrl.searchParams.get('lang');
            const locale = isPublicNotesRoute
              ? requestedLocale === 'en'
                ? 'en'
                : 'ru'
              : parts[0] === 'en'
                ? 'en'
                : 'ru';
            const page = isPublicNotesRoute ? parts.join('/') : parts.slice(1).join('/');
            const enableEvolution = process.env.ENABLE_EVOLUTION !== 'false';
            const { pageKind } = (await server.ssrLoadModule('/src/app/routes.ts')) as {
              pageKind: typeof pageKindType;
            };
            const valid =
              (isPublicNotesRoute || ['ru', 'en'].includes(parts[0])) &&
              pageKind(page, enableEvolution) !== 'not-found';
            const { App } = (await server.ssrLoadModule('/src/app/App.tsx')) as {
              App: typeof AppType;
            };
            const template = await readFile('index.html', 'utf8');
            const html = template
              .replace('lang="ru"', `lang="${locale}"`)
              .replace(
                'data-page=""',
                `data-page="${valid ? page : '404'}" data-evolution="${enableEvolution}"`,
              )
              .replace(
                '<!--app-->',
                renderToString(
                  React.createElement(App, { locale, page: valid ? page : '404', enableEvolution }),
                ),
              );
            response.writeHead(valid ? 200 : 404, { 'Content-Type': 'text/html; charset=utf-8' });
            response.end(await server.transformIndexHtml(path, html));
          } catch (error) {
            next(error);
          }
        })();
      });
    },
  };
}
