const { startApp, waitForAppReady, connectPuppeteer, closeApp, saveScreenshot } = require('../utils');

let browser;

beforeAll(async () => {
  await startApp();
  await waitForAppReady();
  browser = await connectPuppeteer();
});

afterAll(async () => {
  if (browser) await browser.disconnect();
  await closeApp();
});

test('home page have been rendered', async () => {
  const pages = await browser.pages();
  const page = pages[0];

  // 印出 URL 與 HTML
  console.log('Page URL:', await page.url());
  await page.content();

  // 等待 "My Gear" 文字出現
  await page.waitForFunction(() => {
    return document.body && document.body.innerText.includes("My Gear");
  }, { timeout: 10000 });

  // 截圖（自動依測試名稱命名並存到 screenshots 資料夾）
  await saveScreenshot(page, expect.getState().currentTestName, '1');

  // 你可以繼續加更多互動...
}); 