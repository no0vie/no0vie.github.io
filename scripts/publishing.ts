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

export function validatePdf(pdf: Buffer): void {
  if (pdf.length < 1_000 || !pdf.subarray(0, 5).equals(Buffer.from('%PDF-')))
    throw new Error('Invalid PDF header or file size');

  const source = pdf.toString('latin1');
  const trailer = /startxref\s+(\d+)\s+%%EOF\s*$/.exec(source);
  if (!trailer) throw new Error('Invalid PDF trailer');

  const xrefOffset = Number(trailer[1]);
  if (!Number.isSafeInteger(xrefOffset) || source.slice(xrefOffset, xrefOffset + 4) !== 'xref')
    throw new Error('Invalid PDF startxref offset');
}

// Same-length replacements preserve the PDF cross-reference byte offsets.
export function normalizePdf(pdf: Buffer): Buffer {
  return Buffer.from(
    pdf.toString('latin1').replace(/\/(CreationDate|ModDate) \(D:\d{14}/g, '/$1 (D:20000101000000'),
    'latin1',
  );
}
