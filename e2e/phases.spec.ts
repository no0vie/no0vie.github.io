import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const enabled = process.env.ENABLE_EVOLUTION !== 'false';
for (const locale of ['ru', 'en']) {
  test(`${locale}: case deep link, locale parity, static fallback and axe`, async ({
    page,
    browser,
    baseURL,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    expect((await page.goto(`${locale}/cases/campaign-wizard`))?.status()).toBe(200);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      new RegExp(`/${locale}/cases/campaign-wizard$`),
    );
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
      'href',
      /\/en\/cases\/campaign-wizard$/,
    );
    await expect(page.locator('#results')).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.locator('a[hreflang]').click();
    await expect(page).toHaveURL(
      new RegExp(`/${locale === 'en' ? 'ru' : 'en'}/cases/campaign-wizard/?$`),
    );
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
    const staticPage = await context.newPage();
    await staticPage.goto(`${locale}/cases/campaign-wizard`);
    await expect(staticPage.locator('#lessons')).toBeVisible();
    await context.close();
    expect(errors).toEqual([]);
    expect((await page.goto(`${locale}/cases/missing`))?.status()).toBe(404);
  });
  test(`${locale}: evolution flag, keyboard, mobile, reduced motion and fallback`, async ({
    page,
    browser,
    baseURL,
    request,
  }) => {
    const scripts: string[] = [];
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('request', (request) => {
      if (request.resourceType() === 'script') scripts.push(request.url());
    });
    await page.goto(locale);
    expect(scripts.some((url) => url.includes('assets/evolution-'))).toBe(false);
    await expect(page.locator(`a[href$="/${locale}/evolution"]`)).toHaveCount(enabled ? 1 : 0);
    expect((await page.goto(`${locale}/evolution`))?.status()).toBe(enabled ? 200 : 404);
    const sitemap = await (await request.get('sitemap.xml')).text();
    expect(sitemap.includes(`${locale}/evolution`)).toBe(enabled);
    if (!enabled) return;
    await page.setViewportSize({ width: 320, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
    const buttons = page.locator('[role="tablist"] [role="tab"]');
    await expect(buttons).toHaveCount(4);
    await expect(buttons.first()).toBeVisible();
    await buttons.first().focus();
    await page.keyboard.press('ArrowRight');
    await expect(buttons.nth(1)).toBeFocused();
    await expect(buttons.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#stage-panel-tensor')).toBeVisible();
    await expect(page.locator('#stage-panel-fruct')).toBeHidden();
    await expect(page.locator('.evolution-panel')).toHaveCount(4);
    await expect(page.locator('.evolution-milestone')).toHaveCount(1);
    await expect(page.locator('.evolution-milestone a')).toHaveAttribute(
      'href',
      'https://github.com/no0vie/tic-tac-toe',
    );
    const overflow = await page.evaluate(() => ({
      fits: document.documentElement.scrollWidth <= innerWidth,
      viewport: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      offenders: Array.from(document.querySelectorAll<HTMLElement>('body *'))
        .filter((element) => element.getBoundingClientRect().right > innerWidth + 1)
        .map((element) => ({
          tag: element.tagName,
          className: element.className,
          right: Math.round(element.getBoundingClientRect().right),
          width: Math.round(element.getBoundingClientRect().width),
        }))
        .slice(0, 8),
    }));
    expect(overflow, JSON.stringify(overflow.offenders)).toMatchObject({ fits: true });
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    for (const width of [375, 768, 1024, 1440]) {
      for (const colorScheme of ['light', 'dark'] as const) {
        await page.setViewportSize({ width, height: 900 });
        await page.emulateMedia({ reducedMotion: 'reduce', colorScheme });
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          `${locale} Evolution overflowed at ${width}px in ${colorScheme} theme`,
        ).toBe(true);
        await expect(page.locator('.evolution-page')).toBeVisible();
        await expect(page.locator('[role="tab"][aria-selected="true"]')).toBeVisible();
      }
    }
    await page.locator('a[hreflang]').click();
    await expect(page).toHaveURL(
      new RegExp(`/${locale === 'en' ? 'ru' : 'en'}/evolution/?#tensor$`),
    );
    await expect(page.locator('[role="tab"][aria-selected="true"]')).toHaveAttribute(
      'data-stage-id',
      'tensor',
    );
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
    const fallback = await context.newPage();
    await fallback.goto(`${locale}/evolution`);
    await expect(fallback.locator('.evolution-panel')).toHaveCount(4);
    expect(
      await fallback
        .locator('.evolution-panel')
        .evaluateAll((panels) => panels.every((panel) => !panel.hasAttribute('hidden'))),
    ).toBe(true);
    await expect(fallback.locator('.evolution-milestone')).toHaveCount(1);
    await expect(fallback.locator('[data-evolution-pager]')).toBeHidden();
    await context.close();
    expect(errors).toEqual([]);
  });
}
