export function publishingConfig(env: Record<string, string | undefined> = process.env) {
  const base = `/${(env.BASE_PATH ?? '/').replace(/^\/+|\/+$/g, '')}/`.replace('//', '/');
  if ((env.BASE_PATH ?? '').startsWith('//') || !/^\/(?:[\w-]+\/)*$/.test(base))
    throw new Error('BASE_PATH must be a slash-separated path, e.g. /career/');
  const origin = new URL(env.SITE_URL ?? 'https://no0vie.github.io');
  if (
    !['http:', 'https:'].includes(origin.protocol) ||
    origin.pathname !== '/' ||
    origin.search ||
    origin.hash ||
    origin.username ||
    origin.password
  )
    throw new Error('SITE_URL must be an HTTP(S) origin without a path');
  return { base, url: (path: string) => `${origin.origin}${base}${path.replace(/^\//, '')}` };
}

// Same-length replacements preserve the PDF cross-reference byte offsets.
export function normalizePdf(pdf: Buffer): Buffer {
  return Buffer.from(
    pdf.toString('latin1').replace(/\/(CreationDate|ModDate) \(D:\d{14}/g, '/$1 (D:20000101000000'),
    'latin1',
  );
}
