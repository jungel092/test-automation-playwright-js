import { test } from '@playwright/test';

test('should find registration form elements', async ({ page }) => {
    await page.goto('https://team8-2022brno.herokuapp.com/registrace');

    await page.locator('#name').screenshot({ path: 'username_field.png' });

    await page.locator('#email').screenshot({ path: 'email_field.png' });

    await page.locator('#password').screenshot({ path: 'password_field.png' });

    await page.locator('#password-confirm').screenshot({ path: 'confirm_password_field.png' });

    await page.locator('.btn.btn-primary').screenshot({ path: 'register_button.png' });
});