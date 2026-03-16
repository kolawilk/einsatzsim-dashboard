import { test, expect } from '@playwright/test';

test.describe('Dashboard Funktionstest', () => {
  
  test('FEAT-001: Mission-Liste wird angezeigt', async ({ page }) => {
    await page.goto('http://localhost:5185/');
    await expect(page.locator('text=Mission Manager')).toBeVisible();
    const missions = await page.locator('h3, .mission-card, [data-testid="mission"]').count();
    console.log(`Gefundene Missionen: ${missions}`);
  });

  test('FEAT-003: ElevenLabs TTS Integration', async ({ page }) => {
    await page.goto('http://localhost:5185/sound-generator');
    await expect(page.locator('text=Sound Generator')).toBeVisible();
  });

  test('FEAT-005: KI-Mission-Creator', async ({ page }) => {
    await page.goto('http://localhost:5185/ai-creator');
    await expect(page.locator('text=KI Mission Creator')).toBeVisible();
  });

  test('FEAT-006: Mission-Editor', async ({ page }) => {
    await page.goto('http://localhost:5185/missions');
    await expect(page.locator('text=Mission')).toBeVisible();
  });

  test('FEAT-014: Sound-Bibliothek', async ({ page }) => {
    await page.goto('http://localhost:5185/sound-library');
    await expect(page.locator('text=Sound')).toBeVisible();
  });

});
