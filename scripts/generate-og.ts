import { readFile } from 'node:fs/promises';
process.env.PLAYWRIGHT_BROWSERS_PATH ??= '0';
const { chromium } = await import('@playwright/test');

const portrait = (await readFile('public/profile.jpg')).toString('base64');
const content = {
  ru: {
    name: 'Евгений Новиков',
    role: 'Senior Software Developer',
    detail: 'Frontend · React · TypeScript',
  },
  en: {
    name: 'Eugene Novikov',
    role: 'Senior Software Developer',
    detail: 'Frontend · React · TypeScript',
  },
} as const;

const browser = await chromium.launch({ timeout: 30_000 });
try {
  for (const locale of ['ru', 'en'] as const) {
    const page = await browser.newPage({
      viewport: { width: 1200, height: 630 },
      deviceScaleFactor: 1,
    });
    const text = content[locale];
    await page.setContent(`<!doctype html><html><head><style>
      *{box-sizing:border-box}body{margin:0;width:1200px;height:630px;overflow:hidden;background:linear-gradient(135deg,#f8fbff 0%,#d7e9ff 58%,#96c5ff 100%);color:#0b2d63;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.card{position:relative;display:grid;grid-template-columns:1fr 410px;width:100%;height:100%;padding:72px 78px}.copy{display:flex;flex-direction:column;justify-content:center;z-index:2}.mark{width:76px;height:10px;margin-bottom:48px;border-radius:999px;background:#1769e0;box-shadow:0 10px 28px rgba(23,105,224,.32)}h1{max-width:680px;margin:0;font-size:74px;line-height:1.03;letter-spacing:-3px}.role{margin:28px 0 0;font-size:34px;font-weight:650;color:#1769e0}.detail{margin:16px 0 0;font-size:25px;color:#496886}.portrait{position:absolute;right:58px;bottom:0;width:420px;height:570px;object-fit:cover;object-position:50% 22%;border-radius:210px 210px 24px 24px;box-shadow:0 30px 80px rgba(9,50,108,.3);filter:contrast(1.04) brightness(1.08)}.ring{position:absolute;right:30px;top:24px;width:470px;height:470px;border:3px solid rgba(255,255,255,.75);border-radius:50%}</style></head><body><main class="card"><div class="copy"><div class="mark"></div><h1>${text.name}</h1><p class="role">${text.role}</p><p class="detail">${text.detail}</p></div><div class="ring"></div><img class="portrait" src="data:image/jpeg;base64,${portrait}" alt=""></main></body></html>`);
    await page.screenshot({ path: `public/og-${locale}.png` });
    await page.close();
  }
} finally {
  await browser.close();
}
