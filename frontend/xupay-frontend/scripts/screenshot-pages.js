const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const urls = [
    { path: '/', name: 'home' },
    { path: '/dashboard', name: 'dashboard' },
  ];

  if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots');

  for (const u of urls) {
    const url = `http://localhost:3000${u.path}`;
    console.log('Capturing', url);
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
      await page.screenshot({ path: `screenshots/${u.name}.png`, fullPage: true });
      console.log('Saved screenshots/' + u.name + '.png');
    } catch (err) {
      console.error('Failed to capture', url, err.message);
    }
  }

  await browser.close();
})();
