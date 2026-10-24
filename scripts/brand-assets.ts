export const brandPalette = {
  light: {
    background: '#f4f8ff',
    text: '#10264a',
    muted: '#526985',
    accent: '#1769e0',
    accentSoft: '#dceaff',
  },
  dark: {
    background: '#07162d',
    text: '#f4f8ff',
    accent: '#6fb1ff',
  },
} as const;

export function createFaviconSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Eugene Novikov">
  <style>
    .tile { fill: ${brandPalette.light.accent}; }
    .letters { fill: white; }
    @media (prefers-color-scheme: dark) {
      .tile { fill: ${brandPalette.dark.background}; }
      .letters { fill: ${brandPalette.dark.accent}; }
    }
  </style>
  <rect class="tile" width="64" height="64" rx="14"/>
  <text class="letters" x="32" y="42" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="28" font-weight="700">EN</text>
</svg>
`;
}
