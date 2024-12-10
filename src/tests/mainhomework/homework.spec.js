const { test, expect } = require('@playwright/test');

test.describe('Registration Form Tests', () => {
  const baseUrl = 'https://team8-2022brno.herokuapp.com/registrace';

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
  });

  async function getNameField(page) {
     return page.locator('input[name="name"]');
  }

  async function getEmailField(page) {
     return page.locator('input[name="email"]');
  }

  async function getPasswordField(page) {
     return page.locator('input[name="password"]');
  }

  async function getPasswordConfirmationField(page) {
     return page.locator('input[name="password_confirmation"]');
  }

  async function getRegistrationButtonField(page) {
     return page.locator('button[type="submit"]');
  }

  async function fillRegistrationForm(page, username, email, password, passwordConfirmation) {
    const nameField = await getNameField(page);
    const emailField = await getEmailField(page);
    const passwordField = await getPasswordField(page);
    const passwordConfirmField = await getPasswordConfirmationField(page);

    await nameField.fill(username);
    await emailField.fill(email);
    await passwordField.fill(password);
    await passwordConfirmField.fill(passwordConfirmation);
  }

  async function submitForm(page) {
    const button = await getRegistrationButtonField(page);
    await button.click();
  }

  async function validateText(page, fieldSelector, expectedMessage) {
    await expect(page.locator(fieldSelector)).toHaveText(expectedMessage);
  }

  async function validateFormError(page, fieldSelector, errorMessage) {
    await validateText(page, '.invalid-feedback', errorMessage);
    await expect(page.locator(fieldSelector)).toHaveClass('form-control is-invalid');
  }

  async function validateVisible(page, locator) {
    await expect(locator).toBeVisible();
  }

  async function validateEnable(locator, fieldName) {
    await expect(locator, `${fieldName} should be enabled`).toBeEnabled();
  }

  function getRightNavbar(page) {
     return page.locator(".navbar-right")
  }

  function getUserNameDropdown(page) {
     return getRightNavbar(page).locator('[data-toggle="dropdown"]');
  }

  function getUserFullName() {
    return 'Elena Iung';
  }

  test('Form is displayed correctly', async ({ page }) => {
    const nameField = await getNameField(page);
    await validateVisible(page, nameField);
    await validateEnable(nameField, 'Name field');

    const emailField = await getEmailField(page);
    await validateVisible(page, emailField);
    await validateEnable(emailField, 'Email field');

    const registrationButton = await getRegistrationButtonField(page);
    await validateVisible(page, registrationButton);
    await expect(registrationButton).toHaveText("Zaregistrovat");
  });

  test('Successful registration', async ({ page }) => {
    await test.step('Fill out valid registration data', async () => {
      await fillRegistrationForm(page, getUserFullName(), 'shugalp925@gmail.com', 'Linkin92', 'Linkin92');
    });

    await test.step('Submit the form and verify success', async () => {
      await submitForm(page);
      const userName = await getUserNameDropdown(page);
              await expect(userName).toHaveText(getUserFullName());
    });
  });

  test('Registration with existing email', async ({ page }) => {
    await test.step('Fill out form with an existing email', async () => {
      await fillRegistrationForm(page, getUserFullName(), 'shugalp92@gmail.com', 'Linkin92', 'Linkin92');
    });

    await test.step('Submit the form and check for errors', async () => {
      await submitForm(page);
      await validateFormError(page, 'input[name="email"]', 'Účet s tímto emailem již existuje');
    });
  });

  test('Registration with invalid password (only numbers)', async ({ page }) => {
    await test.step('Fill out form with invalid password', async () => {
      await fillRegistrationForm(page, getUserFullName(), 'shugalp886@gmail.com', '12345678', '12345678');
    });

    await test.step('Submit the form and check for errors', async () => {
      await submitForm(page);
      await validateFormError(page, 'input[name="password"]', 'Heslo musí obsahovat minimálně 6 znaků, velké i malé písmeno a číslici');
    });
  });
});