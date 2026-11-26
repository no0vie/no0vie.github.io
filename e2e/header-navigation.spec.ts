import { expect, test, type Page } from '@playwright/test';

const localeCopy = {
  ru: {
    openMenu: 'Открыть меню',
    closeMenu: 'Закрыть меню',
    language: 'EN — Switch to English',
    preparation: 'Подготовка',
    notes: 'Заметки',
    resume: 'Резюме',
    projects: 'Проекты',
  },
  en: {
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    language: 'RU — Переключить на русский',
    preparation: 'Preparation',
    notes: 'Notes',
    resume: 'Resume',
    projects: 'Projects',
  },
} as const;

async function expectNoHorizontalOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
}

for (const locale of ['ru', 'en'] as const) {
  test(`${locale}: mobile header exposes locale and accessible menu behavior`, async ({ page }) => {
    const labels = localeCopy[locale];
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto(locale);

    const navigation = page.getByRole('navigation', { name: /navigation|навигация/i });
    const toggle = page.getByRole('button', { name: labels.openMenu });
    const language = page.getByRole('link', { name: labels.language });

    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveAttribute('aria-controls', 'site-navigation');
    await expect(toggle.locator('svg')).toHaveCount(1);
    await expect(language).toBeVisible();
    await expect(navigation.getByRole('link', { name: labels.language })).toHaveCount(0);
    await expect(navigation).toBeHidden();
    await expectNoHorizontalOverflow(page);

    await toggle.click();
    await expect(page.getByRole('button', { name: labels.closeMenu })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await expect(navigation).toBeVisible();
    await expect(language).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await page.keyboard.press('Escape');
    await expect(navigation).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test(`${locale}: beta status follows navigation configuration`, async ({ page }) => {
    const labels = localeCopy[locale];
    await page.goto(locale);

    const navigation = page.getByRole('navigation', { name: /navigation|навигация/i });
    await expect(
      navigation.getByRole('link', { name: `${labels.preparation} BETA` }),
    ).toBeVisible();
    await expect(navigation.getByRole('link', { name: `${labels.notes} BETA` })).toBeVisible();
    await expect(
      navigation.getByRole('link', { name: labels.resume, exact: true }),
    ).not.toContainText('BETA');
    await expect(
      navigation.getByRole('link', { name: labels.projects, exact: true }),
    ).not.toContainText('BETA');
  });
}

test('mobile menu closes after navigation and breakpoint transitions', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('en');

  const toggle = page.getByRole('button', { name: 'Open menu' });
  await toggle.click();
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Projects', exact: true })
    .click();
  await expect(page).toHaveURL(/\/en\/projects\/?$/);
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeHidden();

  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.setViewportSize({ width: 1024, height: 900 });
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeHidden();
  await expect(page.locator('.menu-button')).toHaveAttribute('aria-expanded', 'false');
  await page.setViewportSize({ width: 390, height: 900 });
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeHidden();
  await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
});

test('language change preserves route and theme and closes mobile navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('ru/projects');
  await page.evaluate(() => localStorage.setItem('theme', 'dark'));
  await page.reload();

  await page.getByRole('button', { name: 'Открыть меню' }).click();
  await page.getByRole('link', { name: 'EN — Switch to English' }).click();

  await expect(page).toHaveURL(/\/en\/projects\/?$/);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeHidden();
});

test('closed mobile navigation is excluded from sequential keyboard focus', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto('en');

  const navigation = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(navigation).toBeHidden();
  await page.getByRole('link', { name: 'RU — Переключить на русский' }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
});

test('header remains stable around its breakpoint and representative viewports', async ({
  page,
}) => {
  await page.goto('en');
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
    for (const width of [320, 375, 390, 430, 759, 760, 761, 768, 1024, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      const toggle = page.locator('.menu-button');
      const language = page.getByRole('link', { name: 'RU — Переключить на русский' });
      await expectNoHorizontalOverflow(page);
      await expect(language).toBeVisible();
      expect(
        await language.evaluate((element) => element.getBoundingClientRect().height),
      ).toBeGreaterThanOrEqual(44);
      if (width <= 760) {
        await expect(toggle).toBeVisible();
        expect(
          await toggle.evaluate((element) => element.getBoundingClientRect().width),
        ).toBeGreaterThanOrEqual(44);
        await toggle.click();
        await expectNoHorizontalOverflow(page);
        await toggle.click();
      } else {
        await expect(toggle).toBeHidden();
        await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
      }
    }
  }
});

test('rapid menu toggles keep icon, label and expanded state synchronized', async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 900 });
  await page.goto('en');

  const toggle = page.getByRole('button', { name: 'Open menu' });
  await toggle.click({ clickCount: 4, delay: 20 });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeHidden();
  await expect(toggle.locator('svg')).toHaveCount(1);
});
