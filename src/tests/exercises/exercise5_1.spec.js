import { test, expect } from '@playwright/test';

test('complete login, table filtering, and logout test', async ({ page }) => {

    await page.goto('https://team8-2022brno.herokuapp.com/prihlaseni');
    await page.locator('text=Přihlásit').click();
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page).toHaveURL(/.*prihlaseni/);

    await page.locator('#email').fill('shugalp92@gmail.com');
    await page.locator('#password').fill('12345678');
    await page.locator('text=Přihlásit').click();

    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page).toHaveURL(/.*prihlaseni/);

    await page.locator('#email').fill('shugalp92@gmail.com');
    await page.locator('#password').fill('Plusha2011');
    await page.locator('text=Přihlásit').click();

    await expect(page).not.toHaveURL(/.*prihlaseni/);
    await expect(page.locator('text=Přihlášky')).toBeVisible();


    await page.goto('https://team8-2022brno.herokuapp.com/zaci');

    const rows = await page.locator('table').locator('tbody').locator('tr');
    const rowCount = await rows.count();
    console.log(`Table contains ${rowCount} rows.`);
    for (let i = 0; i < rowCount; i++) {
        const rowText = await rows.nth(i).innerText();
        console.log(`Row ${i + 1}: ${rowText}`);
    }

    await page.locator('#DataTables_Table_0_filter').fill('snow');
    await page.keyboard.press('Enter');

    const filteredRowsCount = await rows.count();
    expect(filteredRowsCount).toBeLessThan(rowCount);

    await page.locator('text=Odhlásit').click();

    await expect(page.locator('text=Vyberte období akce')).toBeVisible();
});
