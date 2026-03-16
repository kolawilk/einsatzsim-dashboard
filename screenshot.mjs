import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Dashboard
  await page.goto('http://localhost:5185/');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshot-dashboard.png', fullPage: true });
  console.log('Dashboard screenshot done');
  
  // Sound Generator
  await page.goto('http://localhost:5185/sound-generator');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshot-sound-generator.png', fullPage: true });
  console.log('Sound Generator screenshot done');
  
  // Sound Library
  await page.goto('http://localhost:5185/sound-library');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshot-sound-library.png', fullPage: true });
  console.log('Sound Library screenshot done');
  
  // AI Creator
  await page.goto('http://localhost:5185/ai-creator');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshot-ai-creator.png', fullPage: true });
  console.log('AI Creator screenshot done');
  
  await browser.close();
  console.log('All screenshots done!');
})();
