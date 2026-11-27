export const brandPalette = {
  core: {
    graphite: '#151C25',
    nickel: '#BFCBD4',
    copper: '#DF925D',
    slate: '#485563',
    arctic: '#EEF3F6',
  },
  light: {
    background: '#EEF3F6',
    surface: '#FAFBFC',
    elevatedSurface: '#FFFFFF',
    text: '#151C25',
    muted: '#485563',
    accent: '#DF925D',
    accentText: '#A6532D',
    accentSoft: '#F8E7DA',
    primaryButton: {
      background: '#DF925D',
      text: '#151C25',
    },
    personalMark: {
      background: '#DF925D',
      text: '#151C25',
    },
  },
  dark: {
    background: '#151C25',
    surface: '#202B36',
    text: '#EEF3F6',
    muted: '#BFCBD4',
    accent: '#DF925D',
    accentText: '#F3B98F',
    primaryButton: {
      background: '#DF925D',
      text: '#151C25',
    },
    personalMark: {
      background: '#DF925D',
      text: '#151C25',
    },
  },
} as const;

export function createFaviconSvg(markSvg: string): string {
  const viewBox = /viewBox=["']([^"']+)["']/.exec(markSvg)?.[1];
  const inner = /<svg\b[^>]*>([\s\S]*?)<\/svg>/.exec(markSvg)?.[1];
  if (!viewBox || !inner)
    throw new Error('Canonical brand mark must be a complete SVG with a viewBox');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="Eugene Novikov">
  <rect width="120" height="120" rx="22" fill="${brandPalette.core.graphite}"/>
  ${inner.replace(/<title\b[^>]*>[\s\S]*?<\/title>/, '')}
</svg>
`;
}

export function createIco(pngs: readonly { size: number; data: Buffer }[]): Buffer {
  const header = Buffer.alloc(6 + pngs.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);

  let offset = header.length;
  pngs.forEach(({ size, data }, index) => {
    const entry = 6 + index * 16;
    header.writeUInt8(size === 256 ? 0 : size, entry);
    header.writeUInt8(size === 256 ? 0 : size, entry + 1);
    header.writeUInt8(0, entry + 2);
    header.writeUInt8(0, entry + 3);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });

  return Buffer.concat([header, ...pngs.map(({ data }) => data)]);
}
