const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const urls = [
    { path: '/', name: 'home' },
    { path: '/dashboard', name: 'dashboard' },
    { path: '/previews/button', name: 'button' },
    { path: '/previews/card', name: 'card' },
    { path: '/previews/neo', name: 'neo' },
  ];

  if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots');

  // detect running dev server port (try 3000 then 3001)
  let baseUrl = 'http://localhost:3000';
  try {
    await page.goto(baseUrl, { waitUntil: 'load', timeout: 5000 });
  } catch (e) {
    baseUrl = 'http://localhost:3001';
  }

  for (const u of urls) {
    const url = `${baseUrl}${u.path}`;
    console.log('Capturing', url);
    try {
      // Try up to 3 times for flaky routes
      let lastErr = null;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          await page.goto(url, { waitUntil: 'load', timeout: 30000 });
          await page.screenshot({ path: `screenshots/${u.name}.png`, fullPage: true });
          console.log('Saved screenshots/' + u.name + '.png');
          lastErr = null;
          break;
        } catch (err) {
          lastErr = err;
          console.warn(`Attempt ${attempt} failed for ${url}: ${err.message}`);
          // small backoff
          await new Promise(r => setTimeout(r, 1000 * attempt));
        }
      }
      if (lastErr) {
        console.error('Failed to capture', url, lastErr.stack || lastErr.message);
      }
    } catch (err) {
      console.error('Unexpected error capturing', url, err.stack || err.message);
    }
  }

  await browser.close();
})();
