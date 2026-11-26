import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium, type Page } from '@playwright/test';
import { publishingConfig } from './publishing';
import { serve } from './server';

const phase = process.argv[2];
if (phase !== 'before' && phase !== 'after' && phase !== 'comparison') {
  throw new Error('Usage: tsx scripts/capture-visual-refresh.ts <before|after|comparison>');
}

const outputDirectory = resolve('docs/visual-refresh', phase);
await mkdir(outputDirectory, { recursive: true });

const config = publishingConfig();
const server = await serve('dist', config.base);
const browser = await chromium.launch({ timeout: 30_000 });

const openResume = async (
  locale: 'ru' | 'en',
  colorScheme: 'light' | 'dark',
  viewport: { width: number; height: number },
) => {
  const page = await browser.newPage({ colorScheme, reducedMotion: 'reduce', viewport });
  await page.goto(`${server.origin}${config.base}${locale}`, { waitUntil: 'networkidle' });
  return page;
};

const currentLightBaseline = `
  :root {
    --background: #eef3f6;
    --page-background: radial-gradient(circle at 85% 8%, rgba(223, 146, 93, 0.24), transparent 28rem), #eef3f6;
    --surface: #ffffff;
    --surface-elevated: #ffffff;
    --surface-strong: #e4eaee;
    --text: #151c25;
    --muted: #4b5965;
    --border: #bfcbd4;
    --border-subtle: #bfcbd4;
    --accent: #7a3f1d;
    --accent-strong: #5e2e15;
    --accent-soft: #f6e3d5;
    --focus: #7a3f1d;
    --primary-button-background: #151c25;
    --primary-button-text: #eef3f6;
    --personal-mark-background: #7a3f1d;
    --personal-mark-text: #ffffff;
    --personal-mark-shadow: 0 8px 24px rgba(223, 146, 93, 0.24);
    --card-background: linear-gradient(145deg, #ffffff, #e4eaee);
    --card-border: #bfcbd4;
    --card-shadow: 0 12px 34px rgba(21, 28, 37, 0.1);
    --glow: rgba(223, 146, 93, 0.24);
    --shadow: rgba(21, 28, 37, 0.1);
    --shadow-strong: rgba(21, 28, 37, 0.18);
  }
`;

const arcticPaper = `
  :root {
    --background: #fafbfc;
    --page-background: #fafbfc;
  }
`;

const captureComparison = async (page: Page, name: string, override?: string): Promise<void> => {
  if (override) await page.addStyleTag({ content: override });
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: resolve(outputDirectory, `${name}.png`) });
  await page.close();
};

try {
  if (phase === 'comparison') {
    const viewport = { width: 1440, height: 900 };
    await captureComparison(
      await openResume('en', 'light', viewport),
      'a-current-light',
      currentLightBaseline,
    );
    await captureComparison(await openResume('en', 'light', viewport), 'b-arctic-industrial');
    await captureComparison(
      await openResume('en', 'light', viewport),
      'c-arctic-paper',
      arcticPaper,
    );
    await captureComparison(await openResume('en', 'dark', viewport), 'd-approved-dark');
  } else {
    for (const locale of ['ru', 'en'] as const) {
      for (const colorScheme of ['light', 'dark'] as const) {
        for (const viewport of [
          { name: 'desktop', width: 1440, height: 900 },
          { name: 'mobile', width: 375, height: 812 },
        ] as const) {
          const page = await openResume(locale, colorScheme, viewport);
          await page.screenshot({
            path: resolve(
              outputDirectory,
              `${locale}-${colorScheme}-${viewport.name}-${viewport.width}.png`,
            ),
            fullPage: true,
          });
          await page.close();
        }
      }
    }
  }
} finally {
  await browser.close();
  await server.close();
}

console.log(`Captured ${phase} visual-refresh screenshots in ${outputDirectory}`);
