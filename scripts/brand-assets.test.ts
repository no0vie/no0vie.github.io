import { describe, expect, it } from 'vitest';
import { brandPalette, createFaviconSvg, createIco } from './brand-assets.js';

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
      deepCopper: '#853F20',
      slate: '#485563',
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

  it('derives a high-contrast favicon from the canonical mark without changing its paths', () => {
    const source =
      '<svg viewBox="0 0 120 120"><title>Temporary name</title><path d="M1 2Z" fill="#BFCBD4"/><path d="M3 4Z" fill="#DF925D"/></svg>';
    const favicon = createFaviconSvg(source);

    expect(favicon).toContain(`fill="${brandPalette.core.graphite}"`);
    expect(favicon).toContain('<path d="M1 2Z" fill="#BFCBD4"/>');
    expect(favicon).toContain('<path d="M3 4Z" fill="#DF925D"/>');
    expect(favicon).toContain('Eugene Novikov');
    expect(favicon).not.toContain('Temporary name');
  });

  it('packages PNG favicon sizes into a valid multi-image ICO', () => {
    const ico = createIco([
      { size: 16, data: Buffer.from('16px') },
      { size: 32, data: Buffer.from('32px') },
      { size: 48, data: Buffer.from('48px') },
    ]);

    expect(ico.readUInt16LE(2)).toBe(1);
    expect(ico.readUInt16LE(4)).toBe(3);
    expect([ico.readUInt8(6), ico.readUInt8(22), ico.readUInt8(38)]).toEqual([16, 32, 48]);
    expect(ico.subarray(-4).toString()).toBe('48px');
  });
});
