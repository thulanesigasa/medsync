const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  if (!fs.existsSync('docs')) {
    fs.mkdirSync('docs');
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set mobile device viewport roughly
  await page.setViewportSize({ width: 390, height: 844 });

  console.log('Navigating to app...');
  await page.goto('http://localhost:8081');

  // 1. Splash Screen
  console.log('Taking Splash screen...');
  await page.waitForTimeout(500); // give it a moment to render
  await page.screenshot({ path: 'docs/splash.png' });

  // 2. Login Screen
  console.log('Waiting for login screen...');
  await page.waitForTimeout(2500); // 2 seconds timeout from app + 0.5s buffer
  await page.screenshot({ path: 'docs/login.png' });

  // 3. Home Screen
  console.log('Navigating to Home...');
  await page.getByText('Log In', { exact: true }).click();
  await page.waitForTimeout(1000); // wait for transition
  await page.screenshot({ path: 'docs/home.png' });

  // 4. Booking Screen
  console.log('Navigating to Booking...');
  await page.getByText('Book Appointment', { exact: true }).click();
  await page.waitForTimeout(1000); // wait for transition
  await page.screenshot({ path: 'docs/booking.png' });

  // Select a time slot
  console.log('Selecting time slot...');
  await page.getByText('10:00', { exact: true }).click();
  await page.waitForTimeout(500);

  // 5. Confirmation Screen
  console.log('Navigating to Confirmation...');
  await page.getByText('CONFIRM', { exact: true }).click();
  await page.waitForTimeout(1000); // wait for transition
  await page.screenshot({ path: 'docs/confirmation.png' });

  console.log('Done!');
  await browser.close();
})();
