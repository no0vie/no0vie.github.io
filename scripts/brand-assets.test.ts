import { describe, expect, it } from 'vitest';
import { brandPalette, createFaviconSvg } from './brand-assets.js';

const relativeLuminance = (hex: string) => {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)!
    .map((value) => Number.parseInt(value, 16) / 255)
    .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
};

const contrastRatio = (foreground: string, background: string) => {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (a, b) => b - a,
  );
  return (lighter + 0.05) / (darker + 0.05);
};

describe('brand assets', () => {
  it('exposes the local Industrial Arctic palette and theme semantics', () => {
    expect(brandPalette.core).toEqual({
      graphite: '#151C25',
      nickel: '#BFCBD4',
      copper: '#DF925D',
      arctic: '#EEF3F6',
    });
    expect(brandPalette.light).toMatchObject({
      background: brandPalette.core.arctic,
      surface: '#FAFBFC',
      elevatedSurface: '#FFFFFF',
      accentText: '#A6532D',
      primaryButton: {
        background: brandPalette.core.copper,
        text: brandPalette.core.graphite,
      },
      personalMark: {
        background: brandPalette.core.copper,
        text: brandPalette.core.graphite,
      },
    });
    expect(brandPalette.dark).toMatchObject({
      accent: brandPalette.core.copper,
      primaryButton: {
        background: brandPalette.core.copper,
        text: brandPalette.core.graphite,
      },
      personalMark: {
        background: brandPalette.core.copper,
        text: brandPalette.core.graphite,
      },
    });
  });

  it.each([
    ['light text', brandPalette.light.text, brandPalette.light.background],
    ['light muted text', brandPalette.light.muted, brandPalette.light.background],
    ['light accent text', brandPalette.light.accentText, brandPalette.light.background],
    [
      'light primary button',
      brandPalette.light.primaryButton.text,
      brandPalette.light.primaryButton.background,
    ],
    ['dark text', brandPalette.dark.text, brandPalette.dark.background],
    ['dark muted text', brandPalette.dark.muted, brandPalette.dark.background],
    ['dark accent text', brandPalette.dark.accentText, brandPalette.dark.background],
  ])('%s meets WCAG AA contrast', (_label, foreground, background) => {
    expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5);
  });

  it('generates a personal theme-aware favicon without corporate branding', () => {
    const favicon = createFaviconSvg();

    expect(favicon).toContain('#151C25');
    expect(favicon).toContain('#DF925D');
    expect(favicon).toContain(`.tile { fill: ${brandPalette.core.copper}; }`);
    expect(favicon).toContain(`.letters { fill: ${brandPalette.core.graphite}; }`);
    expect(favicon).toContain('Eugene Novikov');
    expect(favicon).not.toMatch(/Norilsk|Норильск/i);
  });
});
