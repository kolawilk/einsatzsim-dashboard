const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Dashboard
  await page.goto('http://localhost:5185/');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshot-dashboard.png', fullPage: true });
  
  // Sound Generator
  await page.goto('http://localhost:5185/sound-generator');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshot-sound-generator.png', fullPage: true });
  
  // Sound Library
  await page.goto('http://localhost:5185/sound-library');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshot-sound-library.png', fullPage: true });
  
  // AI Creator
  await page.goto('http://localhost:5185/ai-creator');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshot-ai-creator.png', fullPage: true });
  
  await browser.close();
  console.log('Screenshots done!');
})();
