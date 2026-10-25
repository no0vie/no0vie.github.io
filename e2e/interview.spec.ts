import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const locale of ['ru', 'en'] as const) {
  test(`${locale}: Interview Lab catalog, direct link, hints, solution and progress`, async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(`${locale}/interview`);
    await expect(page.locator('.exercise-card')).toHaveCount(15);

    const search = page.getByRole('searchbox');
    await search.fill(locale === 'ru' ? 'Promise' : 'Promise');
    await expect(page.locator('.exercise-card')).toHaveCount(1);
    await page.getByRole('link', { name: /Promise\.all/ }).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/interview/implement-promise-all$`));
    await page.reload();
    await expect(page.locator('#exercise-title')).toBeVisible();

    const hintButton = page.getByRole('button', { name: /1\/3/ });
    await hintButton.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.hint-panel section')).toHaveCount(1);
    await expect(page.locator('.hint-panel section h3')).toContainText('1');

    const solution = page.getByRole('button', {
      name: locale === 'ru' ? 'Показать решение' : 'Show solution',
    });
    await solution.click();
    await expect(solution).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#solution-content')).toBeVisible();
    await page.locator('.interview-code button').first().click();
    await expect(page.locator('.interview-code button').first()).toHaveText(
      locale === 'ru' ? 'Скопировано' : 'Copied',
    );

    const progress = page.locator('.exercise-header .progress-select select');
    await progress.selectOption('completed');
    await page.reload();
    await expect(progress).toHaveValue('completed');
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  });
}

test('Interview Lab remains usable at 320px in dark reduced-motion mode', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.goto('en/interview/realtime-messaging-system');
  await expect(page.locator('#exercise-title')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
});
