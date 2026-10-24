import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const locale of ['ru', 'en'] as const) {
  test(`${locale}: notes discovery, deep links, interview mode and accessibility`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto(`${locale}`);
    await page.locator('.notes-link').click();
    await expect(page).toHaveURL(new RegExp(`/notes\\?lang=${locale}$`));
    await expect(page.locator('.note-card')).toHaveCount(9);

    const search = page.getByRole('searchbox');
    await search.fill(locale === 'ru' ? 'микрозадач' : 'microtask');
    await expect(page.locator('.note-card')).toHaveCount(1);
    await expect(page).toHaveURL(/q=/);
    await search.fill('definitely-no-result');
    await expect(page.locator('.empty-state')).toBeVisible();
    await page.locator('.empty-state button').click();

    await page
      .getByLabel(locale === 'ru' ? 'Архитектура' : 'Architecture', { exact: true })
      .check();
    await expect(page.locator('.note-card')).toHaveCount(2);
    await page.getByLabel(locale === 'ru' ? 'Все заметки' : 'All notes').check();

    const firstQuestion = page.locator('.note-card h2 a').first();
    const question = await firstQuestion.textContent();
    await firstQuestion.click();
    await expect(page.locator('#note-title')).toHaveText(question ?? '');
    await page.reload();
    await expect(page.locator('#note-title')).toBeVisible();

    const mode = page.getByLabel(locale === 'ru' ? 'Режим интервью' : 'Interview mode');
    await mode.check();
    await expect(page.locator('#note-answer')).toHaveCount(0);
    const reveal = page.locator('.reveal-button');
    await expect(reveal).toHaveAttribute('aria-expanded', 'false');
    await reveal.focus();
    await page.keyboard.press('Enter');
    await expect(reveal).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#note-answer')).toBeVisible();
    await mode.uncheck();
    await mode.check();
    await expect(page.locator('#note-answer')).toHaveCount(0);

    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.goBack();
    await expect(page.locator('#notes-title')).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('notes are responsive, theme-aware and reduced-motion safe', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.goto('notes/javascript-event-loop?lang=en');
  await expect(page.locator('#note-title')).toContainText('Event Loop');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  await expect(page.locator('pre')).toBeVisible();
  expect(
    await page.locator('pre').evaluate((element) => element.scrollWidth >= element.clientWidth),
  ).toBe(true);
});
