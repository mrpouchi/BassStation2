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

test('play along imports a MIDI file, plays it and keeps it after a reload', async ({ page }) => {
  // Tiny MIDI file: tempo 120, a "Bass" track with two notes.
  const text = (s: string) => [...s].map((c) => c.charCodeAt(0));
  const trk = (body: number[]) => {
    const b = [...body, 0, 0xff, 0x2f, 0];
    return [...text('MTrk'), 0, 0, (b.length >> 8) & 255, b.length & 255, ...b];
  };
  const bytes = [
    ...text('MThd'),
    0,
    0,
    0,
    6,
    0,
    1,
    0,
    2,
    1,
    0xe0,
    ...trk([0, 0xff, 0x51, 3, 0x07, 0xa1, 0x20]),
    ...trk([
      0,
      0xff,
      0x03,
      4,
      ...text('Bass'),
      0,
      0x90,
      40,
      100,
      0x83,
      0x60,
      0x80,
      40,
      0,
      0,
      0x90,
      43,
      100,
      0x83,
      0x60,
      0x80,
      43,
      0,
    ]),
  ];
  await page.goto('/play-along');
  await page.getByLabel('Import MIDI files').setInputFiles({
    name: 'E2E Groove.mid',
    mimeType: 'audio/midi',
    buffer: Buffer.from(bytes),
  });
  await expect(page.getByRole('heading', { name: 'E2E Groove' })).toBeVisible();
  await page.getByRole('button', { name: 'Play' }).click();
  await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();
  await page.getByRole('button', { name: 'Pause' }).click();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'E2E Groove' })).toBeVisible();
});
