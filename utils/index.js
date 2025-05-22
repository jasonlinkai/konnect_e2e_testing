require('dotenv').config();
const { exec } = require('child_process');
const http = require('http');
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const DEBUG_PORT = 9222;
const APP_PATH = process.env.APP_PATH;
const DEBUG_URL = `http://127.0.0.1:${DEBUG_PORT}`;

async function startApp() {
  await new Promise((resolve, reject) => {
    exec(
      `open -a "${APP_PATH}" --args --remote-debugging-port=${DEBUG_PORT}`,
      (err) => (err ? reject(err) : resolve())
    );
  });
}

async function waitForAppReady(timeoutMs = 10000) {
  await new Promise((resolve, reject) => {
    const start = Date.now();
    function check() {
      http.get(`${DEBUG_URL}/json`, (res) => {
        let rawData = "";
        res.on("data", (chunk) => (rawData += chunk));
        res.on("end", () => {
          try {
            const pages = JSON.parse(rawData);
            if (pages.length > 0 && pages[0].url.startsWith("file://")) {
              resolve();
            } else {
              if (Date.now() - start > timeoutMs) reject(new Error('timeout'));
              else setTimeout(check, 500);
            }
          } catch {
            if (Date.now() - start > timeoutMs) reject(new Error('timeout'));
            else setTimeout(check, 500);
          }
        });
      }).on('error', () => {
        if (Date.now() - start > timeoutMs) reject(new Error('timeout'));
        else setTimeout(check, 500);
      });
    }
    check();
  });
}

async function connectPuppeteer() {
  return puppeteer.connect({
    browserURL: DEBUG_URL,
    defaultViewport: null
  });
}

async function closeApp() {
  await new Promise((resolve) => {
    exec(`killall "Kensington Konnect™"`, () => resolve());
  });
}

async function saveScreenshot(page, testName, extraName) {
  const screenshotsDir = path.join(process.cwd(), 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }
  const safeName = testName.replace(/[^a-zA-Z0-9-_]/g, '_');
  let fileName = safeName;
  if (extraName) {
    const safeExtra = extraName.replace(/[^a-zA-Z0-9-_]/g, '_');
    fileName += `_${safeExtra}`;
  }
  const screenshotPath = path.join(screenshotsDir, `${fileName}.png`);
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);
  return screenshotPath;
}

module.exports = {
  startApp,
  waitForAppReady,
  connectPuppeteer,
  closeApp,
  saveScreenshot,
  DEBUG_PORT,
  APP_PATH,
  DEBUG_URL
}; 