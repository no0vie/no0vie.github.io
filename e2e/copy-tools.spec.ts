import { expect, test, type Page } from '@playwright/test';

const aboutCopy = (page: Page) =>
  page.locator('#about .copyable-section').first().getByRole('button');

test('normal mode reveals copy after continuous 5 second hover and resets on leave', async ({
  page,
}) => {
  await page.goto('en');
  const section = page.locator('#about .copyable-section').first();
  const button = aboutCopy(page);

  await expect(button).toHaveCSS('opacity', '0');
  await section.hover();
  await page.waitForTimeout(4_900);
  await expect(button).toHaveCSS('opacity', '0');
  await page.waitForTimeout(150);
  await expect(button).toHaveCSS('opacity', '1');

  await page.mouse.move(0, 0);
  await expect(button).toHaveCSS('opacity', '0');
  await section.hover();
  await page.waitForTimeout(2_500);
  await page.mouse.move(0, 0);
  await section.hover();
  await page.waitForTimeout(2_600);
  await expect(button).toHaveCSS('opacity', '0');
});

test('keyboard focus reveals an accessible copy control immediately', async ({ page }) => {
  await page.goto('ru');
  const button = aboutCopy(page);

  await button.focus();
  await expect(button).toHaveCSS('opacity', '1');
  await expect(button).toBeFocused();
  await expect(button).toHaveAccessibleName(/Скопировать.+о себе/i);
});

test('copy uses canonical localized text and reports clipboard success and failure', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('en?edit=1');
  const summary = page
    .locator('.experience-card')
    .first()
    .getByRole('button', { name: /Copy experience summary/i });
  const full = page
    .locator('.experience-card')
    .first()
    .getByRole('button', { name: /Copy full experience/i });

  await summary.click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(
    /^Developing OMNI and ORP:/m,
  );
  await expect(summary).toHaveClass(/is-copied/);
  await expect(summary).toHaveCSS('transform', 'matrix(2, 0, 0, 2, 0, 0)');
  await expect(summary.locator('span[aria-hidden="true"]').first()).toHaveText('Copy');

  await full.click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain('MTS Web Services');
  expect(copied).toContain('• ');
  expect(copied).not.toContain('Copy');

  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error('denied')) },
    });
  });
  await full.click();
  await expect(full).toContainText('Could not copy');
});

test('three portrait activations expose copy controls on touch without a mode toggle', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('en');
  await expect(page.getByRole('button', { name: /Copy mode/i })).toHaveCount(0);
  await expect(aboutCopy(page)).toHaveCSS('opacity', '0');

  const portrait = page.getByRole('button', { name: 'Portrait of Eugene Novikov' });
  await portrait.click();
  await portrait.click();
  await expect(aboutCopy(page)).toHaveCSS('opacity', '0');
  await portrait.click();
  await expect(aboutCopy(page)).toHaveCSS('opacity', '1');
  await expect(aboutCopy(page)).toHaveCSS('min-height', '44px');

  await page.emulateMedia({ media: 'print' });
  await expect(aboutCopy(page)).toBeHidden();
  await expect(portrait).toBeVisible();
});
