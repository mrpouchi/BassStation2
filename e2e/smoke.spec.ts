import { expect, test } from '@playwright/test';

test('navigates all sections without runtime errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Welcome to Bass Station Academy' }),
  ).toBeVisible();
  for (const [link, heading] of [
    ['Learn', 'Curriculum'],
    ['Synth Lab', 'Bass Station II reference'],
    ['Challenges', 'Practice by doing'],
    ['Sound Library', 'Your presets'],
  ]) {
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: link }).click();
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('persists parameter edits across reloads (IndexedDB)', async ({ page }) => {
  await page.goto('/synth-lab');
  await page.getByRole('button', { name: /^Resonance/ }).click();
  const slider = page
    .getByRole('complementary', { name: 'Parameter inspector' })
    .getByRole('slider', { name: 'Resonance' });
  await slider.fill('77');
  await page.waitForTimeout(700); // persistence debounce
  await page.reload();
  await page.getByRole('button', { name: /^Resonance/ }).click();
  await expect(
    page
      .getByRole('complementary', { name: 'Parameter inspector' })
      .getByRole('slider', { name: 'Resonance' }),
  ).toHaveValue('77');
});

test('theme switch applies dark mode', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('radio', { name: 'Dark' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
