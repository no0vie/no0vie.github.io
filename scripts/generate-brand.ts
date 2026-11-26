import { pathToFileURL } from 'node:url';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createFaviconSvg, createIco } from './brand-assets.js';

process.env.PLAYWRIGHT_BROWSERS_PATH ??= '0';

export const generatedBrandPaths = [
  'public/branding/generated/favicon.svg',
  'public/branding/generated/favicon.ico',
  'public/branding/generated/apple-touch-icon.png',
  'public/branding/generated/icon-192.png',
  'public/branding/generated/icon-512.png',
] as const;

export async function generateBrandAssets(): Promise<void> {
  const { chromium } = await import('@playwright/test');
  const sourcePath = 'public/branding/logo.svg';
  const outputPath = 'public/branding/generated';
  const source = await readFile(sourcePath, 'utf8');
  const favicon = createFaviconSvg(source);
  await mkdir(outputPath, { recursive: true });
  await writeFile(`${outputPath}/favicon.svg`, favicon);

  const browser = await chromium.launch({ timeout: 30_000 });
  try {
    const renderPng = async (size: number) => {
      const page = await browser.newPage({
        viewport: { width: size, height: size },
        deviceScaleFactor: 1,
      });
      await page.setContent(
        `<style>*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden}img{display:block;width:100%;height:100%}</style><img src="data:image/svg+xml,${encodeURIComponent(favicon)}" alt="">`,
      );
      const png = await page.screenshot({ omitBackground: true });
      await page.close();
      return png;
    };

    const icoPngs = await Promise.all(
      [16, 32, 48].map(async (size) => ({ size, data: await renderPng(size) })),
    );
    await writeFile(`${outputPath}/favicon.ico`, createIco(icoPngs));
    await writeFile(`${outputPath}/apple-touch-icon.png`, await renderPng(180));
    await writeFile(`${outputPath}/icon-192.png`, await renderPng(192));
    await writeFile(`${outputPath}/icon-512.png`, await renderPng(512));
  } finally {
    await browser.close();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await generateBrandAssets();
  console.log('Generated favicon SVG/ICO and 180/192/512 PNG brand assets.');
}
