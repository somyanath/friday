import { test, expect } from '../fixtures.js';
test('send the contact form', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Name' }).fill('Somya');
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByRole('status')).toHaveText('Thanks');
});
