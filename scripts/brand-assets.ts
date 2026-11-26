export const brandPalette = {
  core: {
    graphite: '#151C25',
    nickel: '#BFCBD4',
    copper: '#DF925D',
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

export function createFaviconSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Eugene Novikov">
  <style>
    .tile { fill: ${brandPalette.core.copper}; }
    .letters { fill: ${brandPalette.core.graphite}; }
  </style>
  <rect class="tile" width="64" height="64" rx="14"/>
  <text class="letters" x="32" y="42" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="28" font-weight="700">EN</text>
</svg>
`;
}
