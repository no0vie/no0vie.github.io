import { describe, expect, it } from 'vitest';
import { publishingConfig, normalizePdf } from './publishing';

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
