import { describe, expect, it } from 'vitest';
import { createFaviconSvg } from './brand-assets';

describe('brand assets', () => {
  it('generates a favicon from the accepted blue light and dark theme palette', () => {
    const favicon = createFaviconSvg();

    expect(favicon).toContain('#1769e0');
    expect(favicon).toContain('#07162d');
    expect(favicon).toContain('#6fb1ff');
    expect(favicon).toContain('@media (prefers-color-scheme: dark)');
    expect(favicon).not.toContain('#22644f');
  });
});
