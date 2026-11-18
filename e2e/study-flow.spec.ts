import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Study Flow supports deep links, keyboard, reload, explicit completion and accessibility', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('en/interview');
  await expect(page.getByRole('heading', { name: 'Study Flow' })).toBeVisible();
  await page.getByRole('link', { name: 'Event Loop mechanics' }).click();
  await expect(page).toHaveURL(/\/en\/interview\/session\/browser-event-loop-mechanics/);
  await expect(page.locator('.study-progress')).toContainText('1/5');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.study-progress')).toContainText('2/5');
  await page.reload();
  await expect(page.locator('.study-progress')).toContainText('2/5');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);

  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.study-progress')).toContainText('3/5');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.study-progress')).toContainText('4/5');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.study-progress')).toContainText('5/5');
  await expect(page.getByRole('button', { name: 'Finish' })).toBeVisible();
  await page.getByRole('button', { name: 'Finish' }).click();
  await page.getByRole('button', { name: 'good' }).click();
  const completedCount = await page.evaluate(() => {
    const parsed: unknown = JSON.parse(localStorage.getItem('study-flow:v1') ?? '{}');
    if (!parsed || typeof parsed !== 'object' || !('sessions' in parsed)) return 0;
    const sessions = (parsed as { sessions?: Record<string, { completedCount?: number }> })
      .sessions;
    return sessions?.['browser-event-loop-mechanics']?.completedCount ?? 0;
  });
  expect(completedCount).toBe(1);
});

test('URL state survives history, invalid input and locale switching', async ({ page }) => {
  await page.goto(
    'en/interview/session/browser-event-loop-prediction?card=missing&seed=not-a-number',
  );
  await expect(page).toHaveURL(/card=contract&seed=1$/);
  await expect(page.locator('.study-progress')).toContainText('1/5');

  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page).toHaveURL(/card=generated&seed=1$/);
  await page.goBack();
  await expect(page.locator('.study-progress')).toContainText('1/5');
  await page.goForward();
  await expect(page.locator('.study-progress')).toContainText('2/5');

  await page.getByRole('link', { name: /Switch to|Переключить/ }).click();
  await expect(page).toHaveURL(
    /\/ru\/interview\/session\/browser-event-loop-prediction\?card=generated&seed=1$/,
  );
  await expect(page.locator('.study-progress')).toContainText('2/5');
});

test('keyboard navigation ignores focused controls', async ({ page }) => {
  await page.goto('en/interview/session/browser-event-loop-prediction?card=check&seed=1');
  const finish = page.getByRole('button', { name: 'Finish' });
  await finish.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('.study-progress')).toContainText('5/5');
});

test('representative cards fit target viewports, locales and themes', async ({
  page,
}, testInfo) => {
  const matrix = [
    {
      width: 375,
      height: 812,
      theme: 'dark',
      route: 'ru/interview/session/browser-event-loop-prediction?card=generated&seed=42',
    },
    {
      width: 768,
      height: 1024,
      theme: 'light',
      route: 'en/interview/session/browser-event-loop-mechanics?card=timeline&seed=1',
    },
    {
      width: 1024,
      height: 768,
      theme: 'light',
      route: 'ru/interview/session/browser-rendering-critical-path?card=pipeline&seed=1',
    },
    {
      width: 1440,
      height: 900,
      theme: 'dark',
      route: 'en/interview/session/react-fiber-render-commit?card=fiber&seed=1',
    },
  ] as const;

  for (const item of matrix) {
    await page.setViewportSize({ width: item.width, height: item.height });
    await page.goto(item.route);
    await page.evaluate((theme) => {
      localStorage.setItem('theme', theme);
      document.documentElement.dataset.theme = theme;
    }, item.theme);
    await page.reload();
    await expect(page.locator('.study-card')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const box = await page.locator('.study-card').boundingBox();
    expect(box?.x ?? -1).toBeGreaterThanOrEqual(0);
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(item.width);
    await testInfo.attach(`${item.width}-${item.theme}-${item.route.split('/')[0]}`, {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
  }
});

test('seeded challenge replays and touch swipe changes cards', async ({ page }) => {
  await page.goto('ru/interview/session/browser-event-loop-prediction?card=generated&seed=42');
  await expect(page.locator('.challenge')).toContainText('seed 42');
  const source = await page.locator('.challenge code').textContent();
  await page.reload();
  await expect(page.locator('.challenge code')).toHaveText(source ?? '');
  await expect(page.locator('.study-session')).toBeVisible();
  await page.locator('.study-session').evaluate((element) => {
    const start = new Touch({ identifier: 1, target: element, clientX: 300, clientY: 300 });
    element.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [start] }));
    const end = new Touch({ identifier: 1, target: element, clientX: 100, clientY: 305 });
    element.dispatchEvent(new TouchEvent('touchend', { bubbles: true, changedTouches: [end] }));
  });
  await expect(page.locator('.study-progress')).toContainText('3/5');
});
