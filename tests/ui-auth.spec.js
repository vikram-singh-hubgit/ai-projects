const { test, expect } = require('@playwright/test');

const uniqueEmail = () => `user_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`;

test('signup shows welcome page', async ({ page }) => {
  const email = uniqueEmail();

  await page.goto('/register.html');
  await page.getByLabel('Name').fill('Playwright User');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill('secret123');
  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page).toHaveURL(/welcome\.html/);
  await expect(page.getByText('SIGNED IN')).toBeVisible();
  await expect(page.locator('#welcomeTitle')).toContainText('Playwright User');
});

test('login shows welcome page and logout returns to sign in', async ({ page }) => {
  const email = uniqueEmail();

  await page.goto('/register.html');
  await page.getByLabel('Name').fill('Login User');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill('secret123');
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page).toHaveURL(/welcome\.html/);

  await page.getByRole('button', { name: 'Sign Out' }).click();
  await expect(page).toHaveURL(/\/$/);

  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill('secret123');
  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page).toHaveURL(/welcome\.html/);
  await expect(page.locator('#welcomeTitle')).toContainText('Login User');
});
