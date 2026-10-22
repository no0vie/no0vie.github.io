import { expect, test, type Page } from '@playwright/test';

const portrait = (page: Page) =>
  page.getByRole('button', { name: /Portrait of Eugene Novikov|Портрет Евгения Новикова/ });

async function toggleCopyMode(page: Page) {
  await portrait(page).click({ clickCount: 3 });
}

test('copy mode starts off, ignores hover, and triple portrait activation toggles it', async ({
  page,
}) => {
  await page.goto('en?edit=1');
  const about = page.getByRole('button', { name: 'Copy About text' });

  await expect(about).toHaveCount(0);
  await page.locator('#about').hover();
  await page.waitForTimeout(5_100);
  await expect(about).toHaveCount(0);

  await toggleCopyMode(page);
  await expect(about).toBeVisible();
  await expect(about).toHaveAttribute('title', 'Copy About text');
  await expect(about).toHaveCSS('width', '48px');

  await toggleCopyMode(page);
  await expect(about).toHaveCount(0);
});

test('each experience has one icon-only copy button and unsupported blocks have none', async ({
  page,
}) => {
  await page.goto('ru');
  await toggleCopyMode(page);

  const cards = page.locator('.experience-card');
  await expect(cards).toHaveCount(4);
  for (let index = 0; index < 4; index += 1) {
    const buttons = cards
      .nth(index)
      .getByRole('button', { name: 'Скопировать описание опыта работы' });
    await expect(buttons).toHaveCount(1);
    await expect(buttons.locator('svg')).toHaveCount(1);
  }
  await expect(page.locator('#projects .copy-button')).toHaveCount(0);
  await expect(page.locator('#education .copy-button')).toHaveCount(0);
  await expect(page.locator('#skills .copy-button')).toHaveCount(0);
});

test('experience copy uses localized HH text and excludes metadata', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('ru');
  await toggleCopyMode(page);
  const card = page.locator('.experience-card').first();
  const button = card.getByRole('button', { name: 'Скопировать описание опыта работы' });

  await button.click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  await expect(button).toHaveClass(/is-copied/);
  await expect(button.locator('.copy-particles')).toHaveCount(1);
  expect(copied).toMatch(/^Разработка продуктов OMNI и ORP:/);
  expect(copied).toContain('\n\n• ');
  expect(copied).not.toContain('МТС Веб Сервисы');
  expect(copied).not.toContain('Ведущий разработчик');
  expect(copied).not.toContain('2024-05');
  expect(copied).not.toContain('React, TypeScript');
  expect(copied).not.toContain('https://');

  await page.waitForTimeout(900);
  await button.click();
  await expect(button).toHaveClass(/is-copied/);
});

test('clipboard failure is announced without explosion', async ({ page }) => {
  await page.goto('en');
  await toggleCopyMode(page);
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error('denied')) },
    });
  });
  const button = page
    .locator('.experience-card')
    .first()
    .getByRole('button', { name: 'Copy work experience description' });

  await button.click();
  await expect(button).toHaveClass(/is-failed/);
  await expect(button).not.toHaveClass(/is-copied/);
  await expect(button.getByRole('status')).toContainText('Could not copy');
});

test('reduced motion shows static confirmation and print hides copy UI', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-write']);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en');
  await portrait(page).press('Shift+Enter');
  const button = page
    .locator('.experience-card')
    .first()
    .getByRole('button', { name: 'Copy work experience description' });
  await button.click();
  await expect(button).toHaveClass(/is-copied/);
  await expect(button.locator('.copy-particles')).toBeHidden();

  await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
  await expect(button).toBeHidden();
});
