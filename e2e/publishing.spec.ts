import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const locale of ['ru', 'en']) {
  for (const route of [locale, `${locale}/projects`]) {
    test(`${route}: static content, hydration and accessibility`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      expect((await page.goto(route))?.status()).toBe(200);
      await expect(page.locator('h1')).toBeVisible();
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
            .analyze()
        ).violations,
      ).toEqual([]);
      expect(errors).toEqual([]);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      if (route === locale) {
        const mtsCard = page.locator('.experience-card').first();
        await expect(mtsCard).toContainText(
          locale === 'ru' ? 'положительный коммерческий результат' : 'positive commercial outcome',
        );
        for (const [label, url] of [
          ['OMNI', 'https://omnichannel.mts.ru/'],
          ['ORP', 'https://orp.mts.ru/'],
          ['CRM Trends', 'https://omnichannel.mts.ru/crmtrends'],
        ]) {
          await expect(mtsCard.getByRole('link', { name: new RegExp(label) })).toHaveAttribute(
            'href',
            url,
          );
          await expect(mtsCard.getByRole('link', { name: new RegExp(label) })).toHaveAttribute(
            'rel',
            'noopener noreferrer',
          );
        }
      }
    });
  }
  test(`${locale}: complete without JavaScript, print and download`, async ({
    browser,
    baseURL,
    request,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
    const page = await context.newPage();
    await page.goto(locale);
    await expect(page.locator('.experience-card')).toHaveCount(4);
    await expect(page.locator('.experience-card').last()).toContainText('2015–2016');
    const downloadLink = page.locator('a[download]');
    const href = await downloadLink.getAttribute('href');
    await expect(downloadLink).toHaveAttribute(
      'download',
      `eugene-novikov-sse-2026-10-22-${locale}.pdf`,
    );
    const pdf = await request.get(href!);
    expect(pdf.status()).toBe(200);
    expect(pdf.headers()['content-type']).toContain('application/pdf');
    expect((await pdf.body()).subarray(0, 5).toString()).toBe('%PDF-');
    await page.emulateMedia({ media: 'screen' });
    const downloadPromise = page.waitForEvent('download');
    await downloadLink.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(`eugene-novikov-sse-2026-10-22-${locale}.pdf`);
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('.site-header')).toBeHidden();
    await expect(page.locator('#education')).toBeVisible();
    await page.goto(`${locale}/projects`);
    await expect(page.locator('.project-card')).toHaveCount(4);
    await context.close();
  });
}

test('copy buttons expose reusable About and employer blocks', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('ru?edit=1');
  const about = page.getByRole('button', { name: 'Скопировать текст о себе' });
  await about.click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    'Разрабатываю программные продукты с 2015 года',
  );
  const fullExperience = page
    .locator('.experience-card')
    .first()
    .getByRole('button', { name: /Скопировать опыт полностью/ });
  await fullExperience.click();
  const experienceBlock = await page.evaluate(() => navigator.clipboard.readText());
  expect(experienceBlock).toContain('МТС Веб Сервисы');
  expect(experienceBlock).toContain('1–2 рабочих дня');
  expect(experienceBlock).toContain('положительный коммерческий результат');
  expect(experienceBlock).not.toContain('https://omnichannel.mts.ru/');
  await expect(fullExperience).toHaveClass(/is-copied/);
  await expect(fullExperience.locator('span[aria-hidden="true"]').first()).toHaveText('Копировать');
});

test('locale preserves projects route; theme persists; anchors and keyboard', async ({ page }) => {
  await page.goto('en/projects');
  await page.getByRole('link', { name: 'RU — Переключить на русский' }).click();
  await expect(page).toHaveURL(/\/ru\/projects\/?$/);
  await page.getByRole('link', { name: 'EN — Switch to English' }).click();
  await page.getByRole('button', { name: 'Theme: System', exact: true }).click();
  await page.getByRole('button', { name: 'Theme: Light', exact: true }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('link', { name: 'Resume', exact: true }).click();
  await page.getByRole('link', { name: 'Experience', exact: true }).click();
  await expect(page).toHaveURL(/#experience$/);
  await page.goto('en');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
});

for (const width of [320, 375, 768, 1280]) {
  for (const colorScheme of ['light', 'dark'] as const) {
    test(`${width}px ${colorScheme}: responsive and reduced motion`, async ({ page }, info) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
      await page.goto('en');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      expect(
        await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches),
      ).toBe(true);
      expect(
        await page.evaluate(
          () =>
            document.getAnimations().filter((animation) => animation.playState === 'running')
              .length,
        ),
      ).toBe(0);
      await page.screenshot({
        path: info.outputPath(`resume-${width}-${colorScheme}.png`),
        fullPage: true,
      });
      const menu = page.getByRole('button', { name: /Menu/ });
      if (await menu.isVisible()) await menu.click();
      await page
        .getByRole('navigation', { name: 'Main navigation' })
        .getByRole('link', { name: 'Projects', exact: true })
        .click();
      await expect(page.locator('h1')).toHaveText('Projects');
    });
  }
}

test('unknown routes return genuine 404, never the resume shell', async ({ page }) => {
  expect((await page.goto('en/projects/missing'))?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('Страница не найдена');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
});

test('theme is applied before the client bundle runs', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
  await page.route('**/assets/*.js', (route) => route.abort());
  await page.goto('en');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('.experience-card')).toHaveCount(4);
});

test('published internal links and SEO assets exist', async ({ page, request }) => {
  for (const path of ['ru', 'en', 'ru/projects', 'en/projects']) {
    await page.goto(path);
    const links = await page
      .locator('a[href]')
      .evaluateAll((anchors) => anchors.map((anchor) => (anchor as HTMLAnchorElement).href));
    for (const link of links) {
      if (new URL(link).origin !== new URL(page.url()).origin) continue;
      expect((await request.get(link)).status(), link).toBe(200);
      const target = new URL(link);
      if (target.hash && target.pathname === new URL(page.url()).pathname)
        await expect(page.locator(target.hash)).toHaveCount(1);
    }
  }
  for (const path of ['og-ru.png', 'og-en.png', 'favicon.svg', 'robots.txt', 'sitemap.xml'])
    expect((await request.get(path)).status()).toBe(200);
  await page.goto('en');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og-en\.png$/);
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200');
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630');
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    'content',
    'summary_large_image',
  );
  await expect(page.locator('#contacts').getByRole('link', { name: 'Gmail' })).toHaveAttribute(
    'href',
    'mailto:eugene.malin765@gmail.com',
  );
  await expect(
    page.locator('#contacts').getByRole('link', { name: 'Yandex Mail' }),
  ).toHaveAttribute('href', 'mailto:evgeniys-nov@yandex.ru');
  await expect(page.locator('#contacts').getByRole('link', { name: 'Telegram' })).toHaveAttribute(
    'href',
    'https://t.me/no_0vie',
  );
  await expect(page.getByRole('link', { name: 'WhatsApp' }).first()).toHaveAttribute(
    'href',
    'https://wa.me/qr/XFZZQSNXJCSBL1',
  );
  await expect(page.locator('.availability-status')).toHaveText(/Open to opportunities/);
  const availability: unknown = JSON.parse(await (await request.get('availability.json')).text());
  expect(availability).toEqual({
    status: 'available',
    label: { ru: 'Рассматриваю предложения', en: 'Open to opportunities' },
    updatedAt: '2026-10-22',
    source: 'manual',
  });
  await page.goto('en/projects');
  const pantry = page.locator('.project-card').filter({ hasText: 'Pantry' });
  await expect(pantry).toContainText('Released');
  await expect(pantry).toContainText('The public version is complete');
  const structuredData: unknown = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}',
  );
  expect(structuredData).toMatchObject({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Eugene Novikov',
  });
});

test('profile keeps the legacy contact anchor and falls back to localized initials', async ({
  page,
}) => {
  await page.goto('en#contacts');
  await page.locator('.profile-portrait img').dispatchEvent('error');

  await expect(page.locator('#contacts')).toBeVisible();
  await expect(page.getByRole('img', { name: 'Portrait of Eugene Novikov' })).toHaveText('EN');
  await expect(page.locator('.contact-chip')).toHaveCount(5);
});

test('root defaults to Russian and honors explicit saved English', async ({ page }) => {
  await page.goto('./');
  await expect(page).toHaveURL(/\/ru\/?$/);
  await page.evaluate(() => localStorage.setItem('locale', 'en'));
  await page.goto('./');
  await expect(page).toHaveURL(/\/en\/?$/);
});
