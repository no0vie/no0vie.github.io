import { afterEach, expect, it, vi } from 'vitest';
import { createServer } from 'vite';
import { resumeDev } from '../scripts/dev';

afterEach(() => vi.unstubAllEnvs());

it('development uses canonical case and Evolution routes under a project base', async () => {
  vi.stubEnv('ENABLE_EVOLUTION', 'true');
  const base = '/career/';
  const server = await createServer({
    configFile: false,
    base,
    plugins: [resumeDev()],
    server: { port: 0, host: '127.0.0.1' },
  });
  try {
    await server.listen();
    const address = server.httpServer?.address();
    if (!address || typeof address === 'string') throw new Error('No dev address');
    const origin = `http://127.0.0.1:${address.port}`;
    const get = (path: string) =>
      fetch(`${origin}${base}${path}`, { headers: { accept: 'text/html' }, redirect: 'manual' });

    const root = await get('');
    expect(root.status).toBe(302);
    expect(root.headers.get('location')).toBe(`${base}ru`);

    for (const [path, status, marker] of [
      ['en/cases/campaign-wizard', 200, 'id="approach"'],
      ['ru/evolution', 200, 'class="evolution-timeline"'],
      ['en/cases/missing', 404, 'data-page="404"'],
      ['fr/cases/campaign-wizard', 404, 'data-page="404"'],
    ] as const) {
      const response = await get(path);
      expect(response.status, path).toBe(status);
      expect(await response.text()).toContain(marker);
    }
  } finally {
    await server.close();
  }
}, 30_000);
