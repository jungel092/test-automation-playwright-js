import { test, expect } from '@playwright/test';
import { OrderFormPage } from './pages/order.page.js';
import {
    ICO,
    clientName,
    address,
    substituteName,
    contactName,
    contactPhone,
    contactEmail,
    startDate,
    endDate,
    NAVBAR_TEACHERS,
    NAVBAR_NEW_ORDER,
    ORDER_PAGE_TITLE,
    ORDER_FORM_TITLE,
    SUBURBAN_CAMP,
    AFTERNOON,
    CHILDREN,
    AGE,
    ADULTS,
    ORDER_SUCCESS,
    ORDER_SUCCESS_MESSAGE,
    ORDER_SUCCESS_TOAST,
    ARES_ERROR_TOAST
} from "./fixtures.js";

test.describe('School Order Form', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test.describe('Navigation', () => {
        test('Should allow access to order form through teacher menu', async ({ page }) => {
            const orderPage = new OrderFormPage(page);
            await orderPage.navigate(NAVBAR_TEACHERS, NAVBAR_NEW_ORDER);

            await expect(orderPage.pageHeader).toHaveText(ORDER_PAGE_TITLE);
            await expect(orderPage.contentHeader).toHaveText(ORDER_FORM_TITLE);
        });
    });

    test.describe('Form Features', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto("/objednavka/pridat");
            await new OrderFormPage(page).navigate(NAVBAR_TEACHERS, NAVBAR_NEW_ORDER);
        });

        test('Should display all required form fields', async ({ page }) => {
            const orderPage = new OrderFormPage(page);

            await expect(orderPage.companyId).toBeVisible();
            await expect(orderPage.client).toBeVisible();
            await expect(orderPage.address).toBeVisible();
            await expect(orderPage.substitute).toBeVisible();

            await expect(orderPage.contactName).toBeVisible();
            await expect(orderPage.contactPhone).toBeVisible();
            await expect(orderPage.contactEmail).toBeVisible();

            await expect(orderPage.startDate).toBeVisible();
            await expect(orderPage.endDate).toBeVisible();

            await orderPage.selectType(SUBURBAN_CAMP);
            await expect(orderPage.suburbanCampForm.campDateSelector).toBeVisible();
            await expect(orderPage.suburbanCampForm.numberOfStudentsField).toBeVisible();
            await expect(orderPage.suburbanCampForm.numberStudentAgeField).toBeVisible();
            await expect(orderPage.suburbanCampForm.numberNumberOfAdultsField).toBeVisible();

            await expect(orderPage.submitButton).toBeVisible();
        });

        test('Should handle ARES data entry with fallback to manual input', async ({ page }) => {
            const orderPage = new OrderFormPage(page);

            await orderPage.setICO(ICO);
            const toastText = await orderPage.toast.textContent();
            expect(toastText).toBe(ARES_ERROR_TOAST);

            await orderPage.fillNameAndAddress(clientName, address);
            const values = await orderPage.getFilledValues();
            expect(values.client).toEqual(clientName);
            expect(values.address).toEqual(address);
        });

        test('Should prevent submission of incompletely filled form', async ({ page }) => {
            const orderPage = new OrderFormPage(page);

            await orderPage.setICO(ICO);
            await orderPage.toast.waitFor();
            await orderPage.fillNameAndAddress(clientName, address);
            await orderPage.setOrder(
                substituteName,
                contactName,
                contactPhone,
                contactEmail,
                '',
                ''
            );

            await orderPage.selectType(SUBURBAN_CAMP);
            await orderPage.suburbanCampForm.setUrbanCamp(AFTERNOON, CHILDREN, AGE, ADULTS);
            await orderPage.submit();

            await expect(orderPage.pageHeader).toHaveText(ORDER_PAGE_TITLE);
            await expect(orderPage.contentHeader).toHaveText(ORDER_FORM_TITLE);
        });

        test('Should successfully submit completely filled suburban camp order', async ({ page }) => {
            const orderPage = new OrderFormPage(page);

            await orderPage.setICO(ICO);
            await orderPage.fillNameAndAddress(clientName, address);
            await orderPage.setOrder(
                substituteName,
                contactName,
                contactPhone,
                contactEmail,
                startDate,
                endDate
            );

            await orderPage.selectType(SUBURBAN_CAMP);
            await orderPage.suburbanCampForm.setUrbanCamp(AFTERNOON, CHILDREN, AGE, ADULTS);
            await orderPage.submit();

            await expect(orderPage.toast).toHaveText(ORDER_SUCCESS_TOAST);
            await expect(orderPage.contentHeader).toHaveText(ORDER_SUCCESS);
            await expect(orderPage.orderConfirmationText).toHaveText(ORDER_SUCCESS_MESSAGE);
        });
    });
});