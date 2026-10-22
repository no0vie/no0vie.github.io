import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { publishingConfig } from './publishing';

export async function serve(root = 'dist', base = '/', port = 0) {
  const directory = resolve(root);
  const types: Record<string, string> = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.xml': 'application/xml',
    '.txt': 'text/plain',
  };
  const server = createServer((request, response) => {
    void (async () => {
      try {
        const pathname = decodeURIComponent(
          new URL(request.url ?? '/', 'http://localhost').pathname,
        );
        if (!pathname.startsWith(base)) throw new Error('Outside base');
        let file = resolve(directory, pathname.slice(base.length));
        if (file !== directory && !file.startsWith(directory + sep))
          throw new Error('Outside root');
        if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
        const body = await readFile(file);
        response.writeHead(200, {
          'Content-Type': types[extname(file)] ?? 'application/octet-stream',
        });
        response.end(body);
      } catch {
        response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end(await readFile(resolve(directory, '404.html')).catch(() => 'Not found'));
      }
    })();
  });
  await new Promise<void>((done, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', done);
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('No server address');
  return {
    origin: `http://127.0.0.1:${address.port}`,
    close: () =>
      new Promise<void>((done, reject) => {
        server.close((error) => (error ? reject(error) : done()));
        server.closeAllConnections();
      }),
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const server = await serve('dist', publishingConfig().base, 4173);
  const timer = setTimeout(() => {
    void server.close();
  }, 180_000);
  for (const signal of ['SIGINT', 'SIGTERM'] as const)
    process.once(signal, () => {
      clearTimeout(timer);
      void server.close();
    });
}
