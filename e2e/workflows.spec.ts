import { expect, test } from '@playwright/test';

test('lesson completion persists across reloads', async ({ page }) => {
  await page.goto('/learn/sound-fundamentals/frequency');
  await page.getByRole('radio', { name: '880 Hz' }).click();
  await page.getByRole('button', { name: 'Check' }).click();
  await expect(page.getByRole('status', { name: 'Exercise feedback' })).toContainText('Correct');
  await page.waitForTimeout(300);
  await page.goto('/learn');
  await expect(page.getByText('1 of 44 lessons completed')).toBeVisible();
  await page.reload();
  await expect(page.getByText('1 of 44 lessons completed')).toBeVisible();
});

test('saved presets survive a reload and load into Synth Lab', async ({ page }) => {
  await page.goto('/library');
  await page.getByRole('button', { name: 'Save current sound' }).click();
  await page.getByRole('textbox', { name: 'Name' }).fill('E2E Bass');
  await page.getByRole('button', { name: 'Save preset' }).click();
  await expect(page.getByText('Saved “E2E Bass”.')).toBeVisible();
  await page.reload();
  await expect(page.getByText('E2E Bass', { exact: true })).toBeVisible();
  await page.getByText('E2E Bass', { exact: true }).click();
  await page.getByRole('button', { name: 'Load & open Synth Lab' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Bass Station II' })).toBeVisible();
});

test('hardware page works without a device', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/hardware');
  await expect(page.getByRole('heading', { name: 'Bass Station II over USB MIDI' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Connect MIDI' })).toBeVisible();
  expect(errors).toEqual([]);
});
