import { expect, test } from '@playwright/test';

test('available status sits beside the name and runs a six-second ribbon sweep', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'no-preference' });
  await page.goto('ru');

  const titleRow = page.locator('.hero-title-row');
  const status = titleRow.locator('.availability-status[data-animated="true"]');
  await expect(titleRow.locator('h1')).toContainText('Евгений Новиков');
  await expect(status).toContainText('Рассматриваю предложения');
  expect(
    await status.evaluate((element) => getComputedStyle(element, '::before').animationDuration),
  ).toBe('6s');
  expect(
    await status.evaluate((element) => getComputedStyle(element, '::before').animationName),
  ).toBe('availability-ribbon-sweep');

  const titleBox = await titleRow.locator('h1').boundingBox();
  const statusBox = await status.boundingBox();
  expect(titleBox).not.toBeNull();
  expect(statusBox).not.toBeNull();
  if (!titleBox || !statusBox)
    throw new Error('Expected the title and status to have layout boxes');
  expect(statusBox.x).toBeGreaterThan(titleBox.x);
});

test('availability ribbon is static for reduced motion and print', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await page.goto('en');
  const status = page.locator('.availability-status');
  expect(
    await status.evaluate((element) => getComputedStyle(element, '::before').animationName),
  ).toBe('none');

  await page.emulateMedia({ media: 'print', reducedMotion: 'no-preference' });
  await expect(status).toBeVisible();
  expect(await status.evaluate((element) => getComputedStyle(element, '::before').display)).toBe(
    'none',
  );
});
