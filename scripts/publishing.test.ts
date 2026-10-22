import { describe, expect, it } from 'vitest';
import { publishingConfig, normalizePdf, validatePdf } from './publishing';

describe('publishing configuration', () => {
  it('supports user and project Pages without duplicate slashes', () => {
    expect(publishingConfig({}).base).toBe('/');
    expect(
      publishingConfig({ BASE_PATH: '/career/', SITE_URL: 'https://example.com' }).url('en'),
    ).toBe('https://example.com/career/en');
  });
  it('rejects unsafe or ambiguous deployment configuration', () => {
    for (const base of ['//evil.test/', '/a/../', '/a?b/', '/a\\b/'])
      expect(() => publishingConfig({ BASE_PATH: base })).toThrow();
    expect(() => publishingConfig({ SITE_URL: 'https://example.com/path' })).toThrow();
  });
  it('rejects HTML and structurally broken PDF output', () => {
    expect(() => validatePdf(Buffer.from('<!doctype html><title>404</title>'))).toThrow(
      'PDF header',
    );
    expect(() =>
      validatePdf(Buffer.from('%PDF-1.4\nstartxref\n999\n%%EOF\n'.padEnd(1_001, ' '))),
    ).toThrow('startxref');
  });

  it('accepts a PDF whose startxref points to its cross-reference table', () => {
    const prefix = '%PDF-1.4\n'.padEnd(1_024, ' ');
    const pdf = Buffer.from(
      `${prefix}xref\n0 1\n0000000000 65535 f \ntrailer\n<< /Size 1 >>\nstartxref\n1024\n%%EOF\n`,
    );
    expect(() => validatePdf(pdf)).not.toThrow();
  });

  it('normalizes volatile PDF dates without changing byte offsets', () => {
    const input = Buffer.from(
      "/CreationDate (D:20261022123456+00'00') /ModDate (D:20261022123457+00'00')",
    );
    const result = normalizePdf(input);
    expect(result.length).toBe(input.length);
    expect(result.toString()).not.toContain('20261022');
    expect(normalizePdf(result)).toEqual(result);
  });
});
