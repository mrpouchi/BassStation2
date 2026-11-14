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
    ['Synth Lab', 'Bass Station II'],
    ['Challenges', 'Practice by doing'],
    ['Sound Library', 'Your presets'],
  ]) {
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: link }).click();
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('persists parameter edits across reloads (IndexedDB)', async ({ page }) => {
  await page.goto('/synth-lab?view=reference');
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

test('hardware knob drag updates the inspector and visualisers', async ({ page }) => {
  await page.goto('/synth-lab');
  const knob = page.getByRole('slider', { name: 'Frequency — Frequency' });
  const box = await knob.boundingBox();
  if (!box) throw new Error('knob not visible');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 130, { steps: 8 });
  await page.mouse.up();
  const value = Number(await knob.getAttribute('aria-valuenow'));
  expect(value).toBeLessThan(200);
  await expect(
    page
      .getByRole('complementary', { name: 'Parameter inspector' })
      .getByRole('heading', { name: 'Frequency' }),
  ).toBeVisible();
});
