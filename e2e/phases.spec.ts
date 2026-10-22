import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const enabled = process.env.ENABLE_EVOLUTION === 'true';
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
    const buttons = page.locator('[data-evolution-controls] button');
    await expect(buttons).toHaveCount(4);
    await expect(buttons.first()).toBeVisible();
    await buttons.first().focus();
    await page.keyboard.press('ArrowRight');
    await expect(buttons.nth(1)).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#step-tensor')).toBeFocused();
    await expect(page.locator('.evolution-step')).toHaveCount(4);
    await expect(page.locator('.career-milestone')).toHaveCount(1);
    await expect(page.locator('.career-milestone a')).toHaveAttribute(
      'href',
      'https://github.com/no0vie/tic-tac-toe',
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.locator('a[hreflang]').click();
    await expect(page).toHaveURL(new RegExp(`/${locale === 'en' ? 'ru' : 'en'}/evolution/?$`));
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
    const fallback = await context.newPage();
    await fallback.goto(`${locale}/evolution`);
    await expect(fallback.locator('.evolution-step')).toHaveCount(4);
    await expect(fallback.locator('.career-milestone')).toHaveCount(1);
    await expect(fallback.locator('[data-evolution-controls]')).toBeHidden();
    await context.close();
    expect(errors).toEqual([]);
  });
}
