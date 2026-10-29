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
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
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

test('seeded challenge replays and touch swipe changes cards', async ({ page }) => {
  await page.goto('ru/interview/session/browser-event-loop-prediction?card=generated&seed=42');
  await expect(page.locator('.challenge')).toContainText('seed 42');
  const source = await page.locator('.challenge code').textContent();
  await page.reload();
  await expect(page.locator('.challenge code')).toHaveText(source ?? '');
  await page
    .locator('.study-session')
    .dispatchEvent('touchstart', { touches: [{ clientX: 300, clientY: 300 }] });
  await page
    .locator('.study-session')
    .dispatchEvent('touchend', { changedTouches: [{ clientX: 100, clientY: 305 }] });
  await expect(page.locator('.study-progress')).toContainText('3/5');
});
