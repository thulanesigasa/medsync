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
  await page.getByText('Patient Demo').click();
  await page.waitForTimeout(500);
  await page.getByText('LOG IN', { exact: true }).click();
  await page.waitForTimeout(1000); // wait for transition
  await page.screenshot({ path: 'docs/home.png' });

  // 4. Booking Screen
  console.log('Navigating to Booking...');
  await page.getByText('Dr. Pieter Naude').first().click();
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

  // 6. Chats List Screen
  console.log('Navigating to Chats list...');
  await page.getByText('Chats', { exact: true }).filter({ visible: true }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'docs/chats_list.png' });

  // 7. Open chat channel details
  console.log('Opening Dawn Park chat channel...');
  await page.getByText('Dawn Park Clinic', { exact: true }).filter({ visible: true }).first().click();
  await page.waitForTimeout(1000);

  // Type and send a message
  console.log('Sending message to Dawn Park Clinic...');
  await page.getByPlaceholder('Type your message...').fill('Hello Dawn Park team, when are you open?');
  await page.waitForTimeout(500);
  await page.getByLabel('send-button').click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'docs/chat_window.png' });

  console.log('Done!');
  await browser.close();
})();
