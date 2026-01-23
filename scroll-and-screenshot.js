const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000);
  
  // Scroll to banner section
  await page.evaluate(() => window.scrollTo(0, 200));
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/banner-section.png' });
  
  // Scroll to nearby services section
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/nearby-services.png' });
  
  await browser.close();
})();
