import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const locale of ['ru', 'en'] as const) {
  test(`${locale}: Interview Lab catalog, direct link, hints, solution and progress`, async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(`${locale}/interview`);
    await expect(
      page.getByRole('heading', {
        name: locale === 'ru' ? 'Подготовка к интервью' : 'Interview Preparation',
      }),
    ).toBeVisible();
    await page
      .getByRole('link', { name: locale === 'ru' ? 'Практические задания' : 'Practice exercises' })
      .click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/interview/practice$`));
    await expect(page.locator('.exercise-card')).toHaveCount(15);

    const search = page.getByRole('searchbox');
    await search.fill('Promise.all');
    await expect(page.locator('.exercise-card')).toHaveCount(1);
    await page.getByRole('link', { name: /Promise\.all/ }).click();
    await expect(page).toHaveURL(
      new RegExp(`/${locale}/interview/practice/implement-promise-all$`),
    );
    await expect(
      page.getByRole('link', {
        name: new RegExp(locale === 'ru' ? 'Предыдущее задание' : 'Previous exercise'),
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', {
        name: new RegExp(locale === 'ru' ? 'Следующее задание' : 'Next exercise'),
      }),
    ).toBeVisible();
    await page.reload();
    await expect(page.locator('#exercise-title')).toBeVisible();

    const hintButton = page.getByRole('button', { name: /1\/3/ });
    await hintButton.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.hint-panel section')).toHaveCount(1);
    await expect(page.locator('.hint-panel section h3')).toContainText('1');

    const solution = page.locator('button[aria-controls="solution-content"]');
    await expect(solution).toHaveAccessibleName(
      locale === 'ru' ? 'Показать решение' : 'Show solution',
    );
    await solution.click();
    await expect(solution).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#solution-content')).toBeVisible();
    await page.locator('.interview-code button').first().click();
    await expect(page.locator('.interview-code [role="status"]').first()).toHaveText(
      locale === 'ru' ? 'Скопировано' : 'Copied',
    );

    const progress = page.locator('.exercise-header .progress-select select');
    await progress.selectOption('completed');
    await page.reload();
    await expect(progress).toHaveValue('completed');
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  });
}

test('Interview exercise remains readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('en/interview/implement-promise-all');
  await expect(page.locator('#exercise-title')).toBeVisible();
  await expect(page.locator('.hint-panel noscript section')).toHaveCount(3);
  await expect(page.locator('.no-script-solution')).toBeVisible();
  await expect(page.locator('.requires-js')).toHaveCount(3);
  await expect(page.locator('.requires-js:visible')).toHaveCount(0);
  await context.close();
});

test('Interview Lab remains usable at 320px in dark reduced-motion mode', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.goto('en/interview/practice/realtime-messaging-system');
  await expect(page.locator('#exercise-title')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
});
